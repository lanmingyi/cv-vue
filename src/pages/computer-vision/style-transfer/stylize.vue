<template>
  <div>
    <div>
      <a-select class="select" @change="changeContentImg" placeholder="请选择内容图像">
        <a-select-option v-for="(item,key) in contentImgList" :key="key" :value="item" >{{ item }} </a-select-option>
      </a-select>

      <a-select class="select" @change="changeStyleImg" placeholder="请选择风格图像">
        <a-select-option v-for="(item,key) in styleImgList" :key="key" :value="item" >{{ item }} </a-select-option>
      </a-select>
    </div>
    <a-button class="cu-btn-primary" @click="loadModel">
      加载模型
    </a-button>
    <a-button type="primary" @click="generateStylizeImg" :disabled="disabled">
      风格化
    </a-button>

    <a-spin :spinning="spinning">
      <div>
        <img ref="contentImg1" v-if="contentImg===''" src="./images/chicago.jpg" class="image"/>
        <img ref="contentImg2" v-else :src="contentImg" class="image"/>

        <img ref="styleImg1" v-if="styleImg===''" src="./images/seaport.jpg" class="image"/>
        <img ref="styleImg2" v-else :src="styleImg" class="image"/>
        <br/>
        <br/>
        <canvas ref="stylized" class="centered" style="margin: auto; display: block;"></canvas>
      </div>
    </a-spin>


  </div>

</template>

<script>
import * as tf from '@tensorflow/tfjs';
// https://github.com/reiinakano/arbitrary-image-stylization-tfjs

export default {
  name: "stylize",
  data() {
    return {
      contentImgList: ['chicago', 'stata'],
      styleImgList: ['seaport', 'towers'],
      contentImg: '',
      styleImg: '',
      stylizeImg: '',
      styleWeights: '/models/style/saved_model_style_inception_js/model.json',
      transformWeights: 'models/style/saved_model_transformer_separable_js/model.json',
      model: '',
      styleRatio: 1.0,
      spinning: false,
      disabled: true,
    }
  },
  computed:{
    // async loadMobileNetStyleModel() {
    //   if (!this.mobileStyleNet) {
    //     this.mobileStyleNet = await tf.loadGraphModel(
    //         '/models/saved_model_style_js/model.json');
    //   }
    //   console.log(this.mobileStyleNet)
    //
    //   return this.mobileStyleNet;
    // }
  },
  mounted() {

  },

  methods: {
    changeContentImg(e) {
      this.contentImg = require(`./images/${e}.jpg`)
    },
    changeStyleImg(e) {
      this.styleImg = require(`./images/${e}.jpg`)
    },

    loadModel(){
      this.spinning = true
      try {
        tf.loadGraphModel(this.styleWeights).then(model => {
          console.log('this.styleModel', model)
          this.styleModel = model
        })

        tf.loadGraphModel(this.transformWeights).then(model => {
          console.log('this.transformModel', model)
          this.transformModel = model

          this.spinning = false
          this.$message.success('加载成功', 1.5)
          this.disabled = false
        })


      }catch (err){
        console.log(err)
      }

    },

    generateStylizeImg(e) {
      let styleImg = ''
      let contentImg = ''
      const contentImg1= this.$refs.contentImg1
      const contentImg2= this.$refs.contentImg2
      const styleImg1= this.$refs.styleImg1
      const styleImg2= this.$refs.styleImg2
      this.stylized = this.$refs.stylized



      if(contentImg1) {
        // console.log('contentImg1',contentImg1)
        contentImg = contentImg1
      }else {
        // console.log('contentImg2',contentImg2)
        contentImg = contentImg2
      }

      if (styleImg1){
        styleImg = styleImg1
        // console.log('styleImg1',styleImg1)
      }else{
        // console.log('styleImg2',styleImg2)
        styleImg = styleImg2
      }



      // await tf.nextFrame()
      // this.styleButton.textContent = 'Generating 100D style representation'
      // await tf.nextFrame()

      let bottleneck = tf.tidy(() => {
        return this.styleModel.predict(tf.browser.fromPixels(styleImg).toFloat().div(tf.scalar(255)).expandDims());
      })

      console.log('bottleneck', bottleneck)

      if (this.styleRatio !== 1.0) {
        console.log('this.styleRatio', this.styleRatio)
        // this.styleButton.textContent = 'Generating 100D identity style representation';
        // await tf.nextFrame();
        const identityBottleneck = tf.tidy(() => {
          return this.styleModel.predict(tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims());
        })
        console.log('identityBottleneck',identityBottleneck)
        const styleBottleneck = bottleneck;
        bottleneck = tf.tidy(() => {
          const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(this.styleRatio));
          const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-this.styleRatio));
          return styleBottleneckScaled.addStrict(identityBottleneckScaled)
        })
        styleBottleneck.dispose();
        identityBottleneck.dispose();
      }


      // this.styleButton.textContent = 'Stylizing image...';
      // await tf.nextFrame();
      const stylized = tf.tidy(() => {
        return this.transformModel.predict([tf.browser.fromPixels(contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
      })
      tf.browser.toPixels(stylized, this.stylized);
      bottleneck.dispose();  // Might wanna keep this around
      stylized.dispose();
      this.$message.success('风格迁移完成', 1.5)
    },

  },

};
</script>

<style scoped>
.image{
  max-width: 500px;
  margin-left: 200px;
}
.select{
  width: 500px;
  margin-left: 200px;
}

</style>