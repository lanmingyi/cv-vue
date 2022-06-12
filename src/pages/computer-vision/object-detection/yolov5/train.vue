<template>
  <div>
    <div class="process">
      <div class="label">训练进度：</div>
      <div class="content">
        <a-progress :percent="processPercent"></a-progress>
      </div>
    </div>
    <a-button @click="run" type="primary" :disabled="isTraining">训练</a-button>
  </div>
</template>


<script>

import {convertToTensor, createModel, testModel, trainModel} from "@comp/cv/scatter2d/lib/model.ts";
import getTrainData from "@comp/cv/scatter2d/lib/traindata.ts";

export default{
  name: "train",
  components: {},
  data() {
    return {
      epochs: 20,
      epochCurrent: -1,
      isTraining: false,

      originalData: [],
      predictedData: [],
      lossData: [],
      mseData: [],
      batchSize: 28,

    }
  },

  computed:{
    processPercent(){
      return parseInt(
          (((this.epochCurrent + 1) * 100) / this.epochs).toFixed(0)
      );
    }
  },

  methods: {
    reset(){
      this.epochCurrent = -1;
      this.predictedData.splice(0, this.predictedData.length);
      this.lossData.splice(0, this.lossData.length);
      this.mseData.splice(0, this.mseData.length);
    },
    run(){
      this.isTraining = true;
      this.reset();
      /* 创建模型 */
      let model = createModel();
      /* 准备数据 */
      let normalizationData = convertToTensor(this.originalData);

      let callbacks = {
        onTrainBegin: logs => {
          console.log("Train begin.");
          this.$message.success("Train start!");
        },
        onTrainEnd: logs => {
          console.log("Train End.");
          this.$message.success("Train end!");
          this.isTraining = false;
        },
        onEpochEnd: (epoch, logs) => {
          this.epochCurrent = epoch;
          this.lossData.push([epoch, logs.loss]);
          this.mseData.push([epoch, logs.mse]);
        }
      };
      /** 生成配置 */
      let config = {
        batchSize: this.batchSize,
        epochs: this.epochs,
        shuffle: true,
        callbacks
      };

      /** 延时以提高按钮的响应速度 */
      setTimeout(() => {
        /* 训练模型 */
        trainModel({ model, normalizationData, config }).then(() => {
          /* 测试模型 */
          this.predictedData = testModel(model, normalizationData);
        });
      }, 1000);

    },
  },

  mounted() {
    /* 获取训练数据 */
    this.originalData = getTrainData();
    this.reset();
  }

};

</script>

<style lang="scss" scoped>
.process {
  width: 600px;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  .label {
    flex-basis: 100px;
  }
  .content {
    flex: 1;
  }
}
</style>