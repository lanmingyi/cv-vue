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
          v-if="isDetectionButton"
          type="primary"
          @click="startDetection"
      >开始检测</a-button
      >
      <a-button
          v-else
          type="danger"
          @click="finishDetection"
      >停止识别</a-button
      >
    </div>
    <br/>
    <div class="video-canvas">
<!--      <video ref="video" autoplay @loadedmetadata="setCanvas"></video>-->
      <video ref="video" autoplay></video>
      <canvas ref="canvas"></canvas>
<!--      <video ref="video" width="500" height="376" autoplay @loadedmetadata="setCanvas"></video>-->
<!--      <canvas ref="canvas" width="500" height="376"></canvas>-->
    </div>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'

export default {
  name: "detection",
  data() {
    return {
      nets: "tinyFaceDetector",
      isDetectionButton: true,
      isDetection: false,
      webModelList: ['', ''],
      minConfidence: 0.5,
      inputSize: 512,
      scoreThreshold: 0.5,
      faceMatcher: null,
      model: '',
    };
  },

  methods: {
    async changeWebModel(e){

    },


    async startDetection(e){
      this.isDetection = true
      // navigator.getUserMedia()
      // navigator.mediaDevices
      //     .getUserMedia(
      //     {
      //       video: true,
      //     })
      //     .then((stream) => {
      //       this.$refs.video.srcObject = stream
      //       this.isDetectionButton = false
      //       this.$refs.video.play()
      //     })
      //     .catch(err => {
      //       console.log(err)
      //       this.isDetectionButton = true
      //     })

      this.weights = 'models/hand/skeleton/model.json'
      tf.loadGraphModel(this.weights).then( model =>{
        this.model = model
        console.log('model', this.model)
      })

      const c = this.$refs.canvas
      const ctx = c.getContext('2d')
      // this.drawKeyPoints(keyPoints, ctx);

    },
    finishDetection(){
      this.isDetection = false
      if (!this.$refs["video"].srcObject) return;
      let stream = this.$refs["video"].srcObject;
      let tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      this.$refs["video"].srcObject = null;
      this.isDetectionButton = true;
    },

    async setCanvas(){
    },

    drawPoint(x, y, r, ctx){
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.fill()
    },

    drawKeyPoints(keyPoints, ctx){
      const keyPointsArray = keyPoints
      for(let i = 0; i<keyPointsArray.length; i++){
        const y = keyPointsArray[i][0]
        const x = keyPointsArray[i][0]
        this.drawPoint(x, y, r, ctx);
      }
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