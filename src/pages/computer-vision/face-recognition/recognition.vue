<template>
  <div>
    <div>
      <!--      选择模型-->
      <a-select
          style="width: 200px; margin-right: 10px"
          @change="changeWebModel"
          placeholder="请选择模型"
      >
        <a-select-option
            v-for="(item,key) in webModelList"
            :key="key"
            :value="item"
        >{{item}}</a-select-option>
      </a-select>
      <!-- 开始识别-->
      <a-button
          v-if="isRecognitionFlag"
          type="primary"
          @click="startRecognition"
      >开始识别</a-button
      >
      <a-button
          v-else
          type="danger"
          @click="finishRecognition"
      >停止识别</a-button
      >
    </div>
    <br/>
    <div class="video-canvas">
      <video ref="video" autoplay @loadedmetadata="setCanvas"></video>
      <canvas ref="canvas"></canvas>
<!--      <video ref="video" width="500" height="376" autoplay @loadedmetadata="setCanvas"></video>-->
<!--      <canvas ref="canvas" width="500" height="376"></canvas>-->
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  name: "recognition",
  data() {
    return {
      nets: "tinyFaceDetector",
      isRecognitionFlag: true,
      isRecognition: false,
      webModelList: ['ssd_mobilenetv1', 'tiny_face_detector'],
      minConfidence: 0.5,
      inputSize: 512,
      scoreThreshold: 0.5,
      faceMatcher: null,
      faceImg: [
        {
          name: "兰明易",
          img: [
              "images/lmy/lmy.png",
          ],
        },
        {
          name: "杨永梅",
          img: [
            "images/yym/yym.png",
          ],
        },
        // {
        //   name: "李中山",
        //   img: [
        //     "images/lzs/lzs.png",
        //   ],
        // },
        // {
        //   name: "唐德俊",
        //   img: [
        //     "images/tdj/tdj.png",
        //   ],
        // },
        // {
        //   name: "肖宇瑾",
        //   img: [
        //     "images/xyj/xyj.png",
        //   ],
        // },
        // {
        //   name: "修东海",
        //   img: [
        //     "images/xdh/xdh.png",
        //   ],
        // },
        // {
        //   name: "朱志良",
        //   img: [
        //     "images/zzl/zzl.png",
        //   ],
        // },
      ],
    };
  },

  watch: {
    nets(val) {
      this.nets = val;
      this.changeWebModel();
    },
  },

  mounted() {
    this.timer = setInterval(() =>{
      if(this.isRecognition){
        this.setCanvas();
      }
    }, 0);

    this.$nextTick(() => {
      this.changeWebModel();
    });

  },

  methods: {
    async changeWebModel(e){
      await faceapi.nets[this.nets].loadFromUri("/models/faceapi");
      await faceapi.loadFaceLandmarkModel("/models/faceapi");
      // let minConfidence = this.minConfidence
      // let inputSize = this.inputSize
      // let scoreThreshold = this.scoreThreshold
      //
      // this.options =  e === 'ssd_mobilenetv1'
      //     ? new faceapi.SsdMobilenetv1Options({ minConfidence })
      //     : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
      // console.log('this.options', this.options)
    },


    async startRecognition(e){
      this.isRecognition = true
      // navigator.getUserMedia()
      navigator.mediaDevices
          .getUserMedia(
          {
            video: true,
          })
          .then((stream) => {
            this.$refs.video.srcObject = stream
            this.isRecognitionFlag = false
            this.$refs.video.play()
          })
          .catch(err => {
            console.log(err)
            this.isRecognitionFlag = true
          })

      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models/faceapi");
      await faceapi.loadFaceLandmarkModel("/models/faceapi");
      await faceapi.loadFaceRecognitionModel("/models/faceapi");

      this.faceMatcher = await this.createFaceMatcher()


      // await faceapi.loadMtcnnModel('/models')
      // console.log(await faceapi.loadMtcnnModel('/models'))
      //
      // await faceapi.loadFaceRecognitionModel('/models')
      // const mtcnnForwardParams = {
      //   // limiting the search space to larger faces for webcam detection
      //   minFaceSize: 200
      // }
      // const mtcnnResults = await faceapi.mtcnn(this.$refs.video, mtcnnForwardParams)
      // console.log('mtcnnResults', mtcnnResults)
      //
      // faceapi.drawDetection('canvas', mtcnnResults.map(res => res.faceDetection), { withScore: false })
      // faceapi.drawLandmarks('canvas', mtcnnResults.map(res => res.faceLandmarks), { lineWidth: 4, color: 'red' })
      //
      // // const detections = faceapi.detectAllFaces(this.$refs.video)
      // // console.log('detections', detections)
    },
    finishRecognition(){
      this.isRecognition = false
      if (!this.$refs["video"].srcObject) return;
      let stream = this.$refs["video"].srcObject;
      let tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      this.$refs["video"].srcObject = null;
      this.isRecognitionFlag = true;
    },

    async setCanvas(){
      // let ctx = this.$refs["canvas"].getContext("2d");
      // ctx.drawImage(this.$refs["video"], 0, 0, 500, 376);

      const result = await faceapi
          .detectAllFaces(this.$refs.video, this.options)
          .withFaceLandmarks()
          .withFaceDescriptors()

      // console.log('result', result)
      const dims = faceapi.matchDimensions(this.$refs["canvas"], this.$refs["video"], true);
      // console.log(dims)
      const resizedResults = faceapi.resizeResults(result, dims);
      // 人脸检测
      // faceapi.draw.drawDetections(this.$refs["canvas"], resizedResults);
      // console.log(resizedResults)
      // 人脸识别
      resizedResults.forEach(({ detection, descriptor }) => {
        const label = this.faceMatcher.findBestMatch(descriptor).toString();
        console.log('label', label)
        new faceapi.draw.DrawBox(detection.box, { label }).draw(this.$refs.canvas);
      });


      // let imgBase64 = this.$refs["canvas"].toDataURL("image/jpeg", 0.7);
      // let str = imgBase64.replace("data:image/jpeg;base64,", "");
      // this.base64 = str;
      // const { data: res } = await this.$http.post("/img", this.base64);
      // this.acc = res.acc;
    },

    async createFaceMatcher() {
      const labeledFaceDescriptors = await Promise.all(
          this.faceImg.map(async faceImg => {
            const descriptors = []
            for (let image of faceImg.img){
              const img = await faceapi.fetchImage(image)
              descriptors.push(await faceapi.computeFaceDescriptor(img))
            }
            return new faceapi.LabeledFaceDescriptors(faceImg.name,descriptors)
          })
      )
      return new faceapi.FaceMatcher(labeledFaceDescriptors)
    }

  },

};
</script>

<style scoped>
.video-canvas{
  position: relative;
}
.video-canvas canvas{
  position: absolute;
  top: 0;
  left: 0;
}

</style>