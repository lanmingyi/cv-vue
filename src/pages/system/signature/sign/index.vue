<template>
  <a-row type="flex">
    <a-col flex="1 1 750px">
      <div id="printBox">
        <a-card class="seal-card padding-bottom-sm" :bordered="false" >
          <div class="seal-title padding-lr text-center padding-tb">{{title}}</div>
          <!-- 文本 -->
          <div v-html="html" class="padding-lr"></div>
          <div v-html="html" class="padding-lr"></div>
          <!-- 文本 -->
          <div class="seal-date padding">
            <div class="seal-data-box">
              <div class="padding-bottom-xs">日期：{{newDate}}</div>
              <div>签名：</div>
            </div>
          </div>
          <div class="drag-box" v-drag v-if="showDrag">
            <img class="drag-img" :style="[imgStyle]" :src="sealImg" alt="" />
          </div>
        </a-card>
      </div>
    </a-col>
    <a-col flex="0 1 185px">
      <a-card class=" seal-btn" :bordered="false" >
        <div class="text-left">图片大小(px)</div>
        <div>
          宽：<a-input-number style="width:100px !important;margin-top:5px" v-model="imgWidth" :min="100" :max="500"/>
        </div>
        <div>
          高：<a-input-number style="width:100px !important;margin-top:5px" v-model="imgHeight" :min="100" :max="500"/>
        </div>
        <div class="seal-btn-seal margin-top-sm">
          <a-upload
            name="file"
            accept="image/*"
            :action="uploadUrl"
            :showUploadList="false"
            :multiple="false"
            :headers="uploadHeader"
            :before-upload="beforeUpload"
          >
            <span style="font-size: 13px">本地图片</span>
          </a-upload>
        </div>
        <div class="seal-btn-seal" @click="toPdf">
          生成pdf
        </div>
        <div class="seal-btn-seal" v-print="printObj">
          打印
        </div>
        <a-popover v-model="visiblePop" title="" trigger="click" placement="bottomRight" >
          <a slot="content">
            <vue-esign ref="esign"
                style="width:100%;height:100%;border: 1px dashed #c2c1c1;"
                :isCrop="isCrop"
                :lineWidth="lineWidth"
                :lineColor="lineColor"
                :bgColor.sync="bgColor" />
            <div class="margin-top">
              <a-button class="margin-right-xs" @click="handleReset">重置</a-button>
              <a-button @click="handleGenerate">确定</a-button>
            </div>
          </a>
          <div class="seal-btn-seal" >
            签名
          </div>
        </a-popover>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import moment from 'moment';
import { baseUrl } from '@/services/baseUrl.js';
import Vue from 'vue';
import { ACCESS_TOKEN } from '@/store/mutation-types';
export default {
  name: "TableList",
  mixins: [],
  components: {
  },
  data() {
    return {
      newDate:"",
      title: '电子签名',
      html: `北京市疾病预防控制中心微信公众号7月12日消息，北京市气象台2021年7月11日09时00分发布暴雨黄色预警信号。预计，11日17时至13日08时，本市将出现暴雨到大暴雨天气。目前， 暴雨黄色预警中， 地质灾害气象风险随之增加， 强降雨对日常生活、 对交通运输影响较大， 请减少不必要的出行， 驾车注意避让积水路段， 山区需防次生地质灾害。强降雨天气， 十大健康提示需注意夏季外环境因素有利于肠道传染病病原微生物的繁殖和传播， 所以个人和居家卫生非常必要。北京市疾病预防控制中心指出：“ 任何单位和个人， 一旦发现饮水出现异常， 及时报告当地卫生部门， 这是我们每个人的责任和义务。 只要我们大家共同努力， 积极行动起来， 从我做起， 从现在做起， 提高防病意识， 养成良好卫生习惯， 保障健康， 安全度过。`,
      printObj: {
        id: "printBox", //打印标签的id
        popTitle: "Document", //文件标题
        extraCss: '@/assets/style/common.css',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
      },
      imgWidth: 250,
      imgHeight: 250,
      showDrag:false,
      uploadUrl: baseUrl + '/document/fdfs/upload',
			uploadValues: {},
			uploadHeader: {
				token: Vue.ls.get(ACCESS_TOKEN),
			},
      sealImg: '',
      visiblePop:false,
      lineWidth: 6, //画笔粗细
      lineColor: '#000000', //画笔颜色
      bgColor: '', //画布背景色，为空时画布背景透明
      isCrop: true, //是否裁剪
    };
  },
  computed: {
    imgStyle(){
      let style = {}
      style.width = this.imgWidth + 'px'
      style.height = this.imgHeight + 'px'
      return style;
    },
  },
  //注册局部组件指令
  directives: {
    drag: function(el) {
      let dragBox = el; //获取当前元素
      dragBox.onmousedown = e => {
        //算出鼠标相对元素的位置
        let disX = e.clientX - dragBox.offsetLeft;
        let disY = e.clientY - dragBox.offsetTop;
        document.onmousemove = e => {
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          //移动当前元素
          dragBox.style.left = left + "px";
          dragBox.style.top = top + "px";
        };
        document.onmouseup = e => {
          //鼠标弹起来的时候不再移动
          document.onmousemove = null;
          //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
          document.onmouseup = null;
        };
      };
    }
  },
  mounted(){
    this.showDrag = false
    this.newDate = moment(new Date()).format('yyyy-MM-DD HH:mm:ss')
    this.printObj.popTitle = this.title
  },
  methods: {
    moment,
    beforeUpload(file) {
      // console.log("file",file)
			const reader = new FileReader();
			// 把Array Buffer转化为blob 如果是base64不需要
			// 转化为base64
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.sealImg = reader.result
       this.showDrag = true
			};
      return false;
		},
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    handleReset () { // 清除
      this.sealImg = ''
      this.showDrag = false
      this.$refs.esign.reset()
    },
    handleGenerate () { // 获取base64
      var _this = this
      _this.$refs.esign.generate().then(res => {
        this.sealImg = res
        this.showDrag = true
        // 转成文件
        // var blob = _this.dataURLtoBlob(res)
        // var tofile = _this.blobToFile(blob, '签名.jpg')
        // console.log(tofile)
        // setTimeout(async () => {
        //   const formData = new FormData()
        //   formData.append('file', tofile, tofile.name)
        //   formData.append('fileType', 9)
        //   // ajax 请求
        // })
      }).catch(err => {
        // _this.$toast(err) // 画布没有签字时会执行这里 'Not Signned'
      })
    },
    toSeal(){
      this.showDrag = !this.showDrag
    },
    toPdf(){
      let ele = document.getElementById('printBox')
      this.getPdfFromHtml(ele,this.title + new Date().getTime())
    },
  },
};
</script>

<style lang="less">
.ant-popover-content{
  width: 600px;
  height: 200px;
}
#printBox{
    width: 750px;
    margin: 0 auto;
  }
  .seal-card{
    // width: 70%;
    // min-width: 500px;
    width: 750px;
    min-height: 83vh;
    margin: 20px auto;
    position: relative;
    .seal-title{
      font-size: 16px;
      font-weight: bold;
    }
    .seal-date{
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      flex-direction: column;
      .seal-date-box{
        width: 250px;
      }
    }
  }
  .seal-btn{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 10px 0 10px 20px;
    .seal-btn-seal{
      width: 70px;
      height: 30px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 1px solid rgb(31, 143, 248);
      margin-top: 10px;
      font-size: 13px;
    }
  }
  .drag-box{
    /* 使用定位，脱离文档流 */
    position: absolute;
    top: 0;
    left: 0;
    /* 鼠标移入变成拖拽手势 */
    cursor: move;
    z-index: 10;
    .drag-img{
      width: 200px;
      height: 200px;
    }
  }
</style>
