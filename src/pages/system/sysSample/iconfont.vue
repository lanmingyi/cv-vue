<template>
  <div id="app">
    <a-card
      class="project-list"
      :bordered="false"
      title="图标选择器"
      :body-style="{ padding: 0 }"
    >
      <div>
        <a-row class="more-info">
          <a-col :span="8">
            <font-picker v-model="value" />
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card
      class="project-list"
      :bordered="false"
      title="iconfont"
      :body-style="{ padding: 0 }"
    >
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
      <!-- <div class="font-container">
         <div
           v-for="(item,index) in showJson"
           :key="index"
           class="my-font"
		   @click="copyLink(index)"
         >
           <font-awesome-icon :icon="item" /><span style="margin-left: 5px;" data-clipboard-action="copy" :class="['cobyOrderSn'+index]" :data-clipboard-text="item">{{item}}</span>
         </div>
        </div> -->
      <div class="padding-xs">
        <a-input-search
          style="width:100%"
          v-model="fontTxt"
          placeholder="图标"
          enter-button
          allowClear
          @change="
            (e) => {
              onSearch(e.target.value);
            }
          "
          @search="onSearch"
        />
      </div>
      <a-tabs v-model="currentIndex" @change="changeCurrentIndex">
        <a-tab-pane tab="Ant Design图标库" key="1">
          <ul>
            <li
              v-for="(icon, index) in antdJsonList"
              :key="icon.icon_id"
              @click="copyLink(index)"
            >
              <icon-fonts
                :icon="'icon-' + icon.font_class"
                :title="icon.name"
                data-clipboard-action="copy"
                :class="[
                  'cobyOrderSn' + index,
                  { active: activeIndex === icon.font_class },
                ]"
                :data-clipboard-text="icon.font_class"
              />
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane tab="阿里官方图标" key="2">
          <ul>
            <li
              v-for="(icon, index) in iconJsonList"
              :key="icon.icon_id"
              @click="copyLink(index)"
            >
              <icon-fonts
                :icon="'icon-' + icon.font_class"
                :title="icon.name"
                data-clipboard-action="copy"
                :class="[
                  'cobyOrderSn' + index,
                  { active: activeIndex === icon.font_class },
                ]"
                :data-clipboard-text="icon.font_class"
              />
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane tab="多色图标" key="3">
          <ul>
            <li
              v-for="(icon, index) in multicolorList"
              :key="icon.icon_id"
              @click="copyLink(index)"
            >
              <icon-fonts
                :icon="'icon-' + icon.font_class"
                :title="icon.name"
                data-clipboard-action="copy"
                :class="[
                  'cobyOrderSn' + index,
                  { active: activeIndex === icon.font_class },
                ]"
                :data-clipboard-text="icon.font_class"
              />
            </li>
          </ul>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import fontPicker from "@/components/TopVUI/font/fontPicker.vue";
import fontJson from "@/components/TopVUI/font/json/font.json";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import iconJson from "@/components/TopVUI/font/json/icon.json";
import antdJson from "@/components/TopVUI/font/json/antd.json";
import multicolor from "@/components/TopVUI/font/json/multicolor.json";

export default {
  name: "FontAwesomeIcons",
  components: {
    fontPicker,
    FontAwesomeIcon,
  },
  data() {
    return {
      value: "",
      showJson: [],
      iconJsonList: [],
      antdJsonList: [],
      multicolorList: [],
      currentIndex: "1",
      activeIndex: "",
      fontTxt: "",
    };
  },
  // created() {
  //   this.showJson = fontJson;
  //   this.iconJsonList = iconJson;
  //   this.antdJsonList = antdJson;
  //   this.multicolorList = multicolor;
  //   console.log(this.multicolorList);
  //   this.currentIndex = "1";
  // },
  mounted() {
    this.iconJsonList = iconJson;
    this.antdJsonList = antdJson;
    this.multicolorList = multicolor;
  },
  methods: {
    // 复制图标
    copyLink(index) {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn" + index);
      clipboard.on("success", function() {
        _this.$message.success("复制成功！");
      });
      clipboard.on("error", function() {
        _this.$message.success("复制失败！");
      });
    },
    fontClick(item) {
      this.activeIndex = item.font_class;
    },
    onSearch(val) {
      if (this.currentIndex === "1") {
        this.antdJsonList = antdJson.filter(
          (item) => item.font_class.indexOf(val) >= 0
        );
      } else if (this.currentIndex === "2") {
        this.iconJsonList = iconJson.filter(
          (item) => item.font_class.indexOf(val) >= 0
        );
      } else {
        this.multicolorList = multicolor.filter(
          (item) => item.font_class.indexOf(val) >= 0
        );
      }
    },
    changeCurrentIndex(key) {
      this.currentIndex = key;
      this.onSearch(this.fontTxt);
    },
  },
};
</script>
<style lang="less" scoped>
@import "@/components/TopVUI/icon/Icon";
.icons-list {
  .anticon {
    margin-right: 6px;
    font-size: 24px;
  }
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
