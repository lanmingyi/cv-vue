<template>
  <div id="app">
    <a-card
      class="project-list"
      :loading="loading"
      :bordered="false"
      title="图标选择器"
      :body-style="{ padding: 0 }">
      <div>
        <a-row class="more-info">
          <a-col :span="8">
            <fontawesome-picker v-model="value" />
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card
      class="project-list"
      :loading="loading"
      :bordered="false"
      title="iconfont"
      :body-style="{ padding: 0 }">
      <div class="more-info">
        <div class="icons-list">
          <icon-fonts icon="icon-caiyouduo_caiyouquan-xuanzhong" />
          <icon-fonts icon="icon-caiyouduo_caiyouduo" />
          <icon-fonts icon="icon-caiyouduo_wode-ticaizhibo" />
          <icon-fonts icon="icon-caiyouduo_zhifu-zhifubaozhifu" />
          <icon-fonts icon="icon-caiyouduo_shouye-saoma" />
          <icon-fonts icon="icon-caiyouduo_shouye-weixin" />
          <icon-fonts icon="icon-caiyouduo_shouye-bifenzhibo" />
          <icon-fonts icon="icon-caiyouduo_zhifu-weixinzhifu" />
          <icon-fonts icon="icon-caiyouduo_hemaixiangqing-dianzhuchupiao" />
          <icon-fonts icon="icon-caiyouduo_caiyouquan-weixuanzhong" />
          <icon-fonts icon="icon-caiyouduo_dapiao" />
        </div>
      </div>
    </a-card>
     <a-card>
       <div class="font-container">
         <div
           v-for="item in showJson"
           :key="item"
           class="my-font"
         >
           <font-awesome-icon :icon="item" /><span style="margin-left: 5px;">{{item}}</span>
         </div>
        </div>
     </a-card>
  </div>
</template>
<script>
import fontawesomePicker from '@/components/TopVUI/font/fontPicker.vue'
import fontJson from '@/components/TopVUI/font/json/font.json'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: {
    fontawesomePicker,
    FontAwesomeIcon
  },
  data () {
    return {
      value: '',
      showJson: []
    }
  },
  created () {
    this.showJson = fontJson
  }
}
</script>
<style scoped>
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 24px;
}
.font-container {
  font-size: 18px;
  width: 100%;
  padding-left: 20px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
}
.my-font {
  cursor: pointer;
  margin: 0 20px 20px 0;
  min-width: 250px;
  /* padding: 0 5px; */
  padding-top: 5px;
  text-align: left;
}
.my-font:hover {
  background-color: rgba(206, 206, 206, 0.5);
}
.more-info {
  border: 0;
  margin: 16px;
}
</style>
