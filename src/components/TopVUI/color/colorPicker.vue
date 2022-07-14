<!--
 * @Description: 颜色选择器
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-03 16:49:22
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="abc">
    <div :class="['colorpicker', size]" :id="this.domId"></div>
  </div>
</template>

<script>
import Colorpicker from "./index.js";
export default {
  name: "colorPicker",
  props: {
    size: {
      type: String,
      default: "large",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    record: {
      type: Object,
    },
    formatType: {
      type: String,
      default: "hex",
    },
    showprecolor: {
      type: Boolean,
      default: false,
    },
    showhistorycolor: {
      type: Boolean,
      default: true,
    },
    showPalette: {
      type: Boolean,
      default: true,
    },
    autoConfirm: {
      type: Boolean,
      default: false,
    },
    canMove: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      values: "",
      formatTypeValue: "",
      colorTypeOption: "single",
      domId: "dom-" + Math.ceil(Math.random() * 100), //动态设置唯一ID
    };
  },
  watch: {
    // value输入内容，这里我监听了一下值
    value: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        this.values = newVal ? newVal : "#000"; //当值不存在默认设置黑色
        if (
          document.getElementById(this.domId) &&
          document.getElementById(this.domId) != null
        )
          this.initColor();
      },
    },
    //表单设计的时候接收的属性值
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal || oldVal) this.values = this.record.options.defaultValue;
      },
    },
    formatType: function(value) {
      this.formatTypeValue = value; //初始颜色类型
    },
  },
  mounted() {
    console.log(this.value);
    this.initColor();
  },
  updated() {
    this.initColor();
  },
  methods: {
    initColor() {
      let that = this;
      var nopre = new XNColorPicker({
        color: that.values, //初始颜色
        selector: "#" + that.domId, //选择器容器
        showprecolor: this.showprecolor, //显示预制颜色
        prevcolors: null, //预制颜色，不设置则默认
        showhistorycolor: this.showhistorycolor, //显示历史
        historycolornum: 16, //历史条数
        format: that.formatType, //rgba hex hsla,初始颜色类型
        showPalette: this.showPalette, //显示色盘
        show: false, //初始化显示
        lang: "cn", // cn 、en
        disabled: this.disabled,
        colorTypeOption: "single,linear-gradient,radial-gradient", //颜色选择器可选类型，纯色，线性渐变，径向渐变
        canMove: this.canMove, //默认为true
        autoConfirm: this.autoConfirm, //改变颜色时自动确认
        onError: function(e) {},
        onCancel: function(color) {
          // console.log('cancel', color);
          that.$emit("cancle");
        },
        onChange: function(color) {
          // console.log('change', color);
        },
        //提交事件
        onConfirm: function(color) {
          const colorTypeOption = color.colorType;
          if (colorTypeOption === "single") {
            that.values = color.color[that.formatType];
          } else if (colorTypeOption === "linear-gradient") {
            that.values = color.color.str;
          } else {
            that.values = color.color.str;
          }
          that.$emit("change", that.values);
        },
      });
    },
  },
};
</script>

<style lang="less">
.default {
  .fcolorpicker-curbox {
    width: 30px;
    height: 30px;
  }
}
.small {
  .fcolorpicker-curbox {
    width: 24px;
    height: 24px;
  }
}
.large {
  .fcolorpicker-curbox {
    width: 36px;
    height: 36px;
  }
}
</style>
