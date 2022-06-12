<template>
  <div>
    <a-spin :spinning="spinning">
      <div>
        <a-select id="content-select" style="width: 200px" @select="changeImage" placeholder="请选择检测对象">
          <a-select-option v-for="(item,key) in imageList" :key="key" :value="item">
            {{item}}
          </a-select-option>
        </a-select>
        <a-select style="width: 200px" @change="changeWebModel" placeholder="请选择模型">
          <a-select-option v-for="(item,key) in webModelList" :key="key" :value="item">{{item}}</a-select-option>
        </a-select>
        <a-button class="cu-btn-primary" @click="loadModel">
          加载模型
        </a-button>
        <a-button type="primary" @click="startDetection" :disabled="disabled">
          开始检测
        </a-button>
        <a-button type="primary" @click="backEndDetection">
          后端检测
        </a-button>
      </div>
      <br/>
      <div>
        <input type="file" ref="fileSelect" style="display: none" accept="image/x-png,image/gif,image/jpeg"/>
        <a-row>
          <a-col :span="12">
            <img ref="img1" v-if="detectionImg===''" src="./images/object_detection/1.jpg" height="300" width="500"/>
            <img ref="img2" v-else :src="detectionImg" height="300" width="500"/>
          </a-col>
          <a-col :span="12">
            <img ref="result" v-if="ifBackEndDetection" :src="resultImg" height="300" width="500"/>
            <canvas ref="canvas" v-else height="300" width="500"/>
          </a-col>
        </a-row>
      </div>
      <video ref="webcamVideo" height="375" width="500"></video>
      <div>
        <canvas ref="hiddenCanvas" style="display: none"/>
        <a-button type="primary" @click="takePicture" style="margin-right: 5px" :disabled="pictureButton">拍摄</a-button>
        <a-button type="primary" danger @click="closeWebcam" :disabled="closeButton">关闭摄像头</a-button>
      </div>

    </a-spin>

<!--    <a-select id="content-select" style="width: 200px" @select="changeImage" placeholder="请选择检测对象">-->
<!--      <a-select-option v-for="(item,key) in imageList" :key="key" :value="item">-->
<!--        {{item}}-->
<!--      </a-select-option>-->
<!--    </a-select>-->
<!--    <a-select style="width: 200px" @change="changeWebModel" placeholder="请选择模型">-->
<!--      <a-select-option v-for="(item,key) in webModelList" :key="key" :value="item">{{item}}</a-select-option>-->
<!--    </a-select>-->
<!--    <a-button class="cu-btn-primary" @click="loadModel">-->
<!--      加载模型-->
<!--    </a-button>-->
<!--    <a-button type="primary" @click="startDetection" :disabled="disabled">-->
<!--      开始检测-->
<!--    </a-button>-->
    <div>
<!--      <iframe src="https://map.baidu.com/search/%E5%85%A8%E5%9B%BD/@12959219.599966891,4825334.630059942,5z?querytype=s&wd=%E5%85%A8%E5%9B%BD&c=1&provider=pc-aladin&pn=0&device_ratio=1&da_src=shareurl" width="600" height="350" style="border:0;" allowfullscreen="" loading="lazy"></iframe>-->
    </div>

  </div>
</template>


<script>
// const tf = require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs';
import axios from "axios";
// const weights = '/web_model/model.json';
const names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
  'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
  'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
  'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
  'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
  'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
  'hair drier', 'toothbrush']

export default{
  name: "detect",
  components: {},
  data() {
    return {
      imageList: ['调用摄像头', '选择文件', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'],
      webModelList: ['yolov5s', 'yolov5x'],
      detectionImg: '',

      weights: '',
      model: '',
      spinning: false,
      disabled: true,
      pictureButton: true,
      closeButton: true,
      file: '',
      server_url: 'http://127.0.0.1:5003',
      resultImg: '',
      ifBackEndDetection: false,
    }
  },
  mounted() {
    // this.fileSelect = document.getElementById('file-select')
    this.fileSelect = this.$refs.fileSelect

    this.snapButton = this.$refs.snapButton
    this.webcamVideoElement = this.$refs.webcamVideo
    this.img = this.$refs.img1 ? this.$refs.img1 : this.$refs.img2

  },

  methods: {
    changeImage(e,option){
      if(e==='调用摄像头'){

        this.camModal = this.$refs.camModal
        console.log('this.camModal', this.camModal)
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        console.log('navigator.getUserMedia', navigator.getUserMedia)


        navigator.getUserMedia(
            {
              video: true
            },
            (stream) => {
              this.stream = stream;
              this.webcamVideoElement.srcObject = stream;
              this.webcamVideoElement.play();
            },
            (err) => {
              console.error(err);
            }
        );

        this.pictureButton = false
        this.closeButton = false

      }
      else if(e==='选择文件'){
        this.fileSelect.onchange = (evt) => {
          this.file = evt.target.files[0];
          console.log('选择文件', evt.target.files[0])
          const fileReader = new FileReader();
          fileReader.onload = ((e) => {
            this.detectionImg = e.target.result;
          });
          fileReader.readAsDataURL(this.file);
          this.fileSelect.value = '';
        }
        this.fileSelect.click()
      }
      else{
        this.detectionImg = require(`./images/object_detection/${e}`)
      }
    },

    changeWebModel(e){
      this.weights = `/models/yolo/${e}_web_model/model.json`
      console.log('this.weight', this.weights)
    },

    closeWebcam(){
      this.webcamVideoElement.srcObject.getTracks()[0].stop()
      this.pictureButton = true
      this.closeButton = true
    },

    takePicture(){
      const hiddenCanvas = this.$refs.hiddenCanvas
      const hiddenContext = hiddenCanvas.getContext('2d');
      hiddenCanvas.width = this.webcamVideoElement.width;
      hiddenCanvas.height = this.webcamVideoElement.height;
      console.log('hiddenCanvas.width', hiddenCanvas.width)
      console.log('hiddenCanvas.height', hiddenCanvas.height)
      hiddenContext.drawImage(this.webcamVideoElement, 0, 0,
          hiddenCanvas.width, hiddenCanvas.height);
      const imageDataURL = hiddenCanvas.toDataURL('image/jpg');
      this.detectionImg = imageDataURL;

    },


    loadModel() {
      if (this.weights === '')
      {
        this.$message.warn('请先选择模型', 1.5)
        return
      }
      this.spinning = true
      tf.loadGraphModel(this.weights).then(model => {
        console.log('model', model)
        this.model= model

        // this.$set({model: model})
        console.log('this.model', this.model)
        this.spinning = false
        this.$message.success('加载成功', 1.5)
        this.disabled = false
      });
    },

    cropToCanvas(image, canvas, ctx) {
      // console.log('image', image)
      // console.log('canvas', canvas)
      // console.log('ctx', ctx)

      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;
      // canvas.width = image.width;
      // canvas.height = image.height;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const ratio = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const newWidth = Math.round(naturalWidth * ratio);
      const newHeight = Math.round(naturalHeight * ratio);
      ctx.drawImage(
          image,
          0,
          0,
          naturalWidth,
          naturalHeight,
          (canvas.width - newWidth) / 2,
          (canvas.height - newHeight) / 2,
          newWidth,
          newHeight,
      );
    },

    startDetection(e) {
      const c = this.$refs.canvas
      const img1 = this.$refs.img1
      const img2 = this.$refs.img2
      const ctx = c.getContext("2d");
      if (img1){
        this.cropToCanvas(img1, c, ctx);
      }else{
        this.cropToCanvas(img2, c, ctx);
      }
      // this.cropToCanvas(e.target, c, ctx);

      let [modelWidth, modelHeight] = this.model.inputs[0].shape.slice(1, 3);

      console.log('tf.browser.fromPixels(c)', tf.browser.fromPixels(c))
      const input = tf.tidy(() => {
        return tf.image.resizeBilinear(tf.browser.fromPixels(c), [modelWidth, modelHeight])
            .div(255.0).expandDims(0);
      });
      this.model.executeAsync(input).then(res => {
        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";

        const [boxes, scores, classes, valid_detections] = res;
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        const classes_data = classes.dataSync();
        const valid_detections_data = valid_detections.dataSync()[0];

        tf.dispose(res)

        var i;
        for (i = 0; i < valid_detections_data; ++i){
          let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
          x1 *= c.width;
          x2 *= c.width;
          y1 *= c.height;
          y2 *= c.height;
          const width = x2 - x1;
          const height = y2 - y1;
          const klass = names[classes_data[i]];
          const score = scores_data[i].toFixed(2);

          // Draw the bounding box.
          ctx.strokeStyle = "#00FFFF";
          ctx.lineWidth = 4;
          ctx.strokeRect(x1, y1, width, height);

          // Draw the label background.
          ctx.fillStyle = "#00FFFF";
          const textWidth = ctx.measureText(klass + ":" + score).width;
          const textHeight = parseInt(font, 10); // base 10
          ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);

        }
        for (i = 0; i < valid_detections_data; ++i){
          let [x1, y1, , ] = boxes_data.slice(i * 4, (i + 1) * 4);
          x1 *= c.width;
          y1 *= c.height;
          const klass = names[classes_data[i]];
          const score = scores_data[i].toFixed(2);

          // Draw the text last to ensure it's on top.
          ctx.fillStyle = "#000000";
          ctx.fillText(klass + ":" + score, x1, y1);

        }
      });
      this.$message.success('检测完成', 1.5)
    },

    backEndDetection(){
      this.img = this.$refs.img1 ? this.$refs.img1 : this.$refs.img2
      this.file = this.img.src
      console.log('this.img.src', this.img.src)
      let param = new FormData()
      param.append('file', this.file.src)

      // var timer = setInterval(() => {
      //   this.myFunc();
      // }, 30);
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头

      axios
          .post(this.server_url + "/upload", param, config)
          .then((response) => {
            this.resultImg = response.data.draw_url;
            // ctx.drawImage(
            //     response.data.draw_url,
            //     0,
            //     0
            // );
          });
      this.ifBackEndDetection = true
    },


  },

};
</script>

<style scoped>

</style>