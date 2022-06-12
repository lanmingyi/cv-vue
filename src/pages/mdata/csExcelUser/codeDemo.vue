<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<a-tabs default-active-key="1">
				<a-tab-pane key="1" tab="生成二维码">
					<a-form :form="form">
					<a-row :gutter="16">
						<a-col class="gutter-row" :span="16">
							<a-form-item label="二维码内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="codeOptions.codeContent" />
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="16">
							<a-form-item label="二维码颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<color-picker v-decorator="['color']" @change="changeClsColour" />
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="16">
							<a-form-item label="二维码背景颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<color-picker v-decorator="['bgcolor']" @change="changeBgColour" />
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="16">
							<a-form-item label="二维码边框颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<color-picker v-decorator="['bordercolor']" @change="changeBorderColour" />
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="16">
							<a-form-item label="二维码中间图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<!-- <a-radio-group name="radioGroup" v-model="imgValue">
									<a-radio :value="1">
										本地上传
									</a-radio>
									<a-radio :value="2">
										图片链接
									</a-radio>
								</a-radio-group> -->
								<a-input  v-decorator="['url']"  type="hidden" disabled/>
								<!-- <a-upload v-show="imgValue == 1" name="file" list-type="picture-card" class="avatar-uploader"
									:show-upload-list="false"  :action="uploadUrl" :headers="headers" @change="handleChange">
									<img class="ant-upload-img" v-if="url" :src="url" alt="avatar" />
									<div v-else>
										<a-icon :type="imageLoading ? 'loading' : 'plus'" />
										<div class="ant-upload-text">
											上传
										</div>
									</div>
								</a-upload> -->
								<a-upload v-show="imgValue == 1"
								  list-type="picture-card" 
								  :show-upload-list="false"
								  :file-list="fileList"
								  :before-upload="beforeUpload"
								  @change="handleUpload"
								>
								  <img class="ant-upload-img" v-if="imgUrl" :src="imgUrl" alt="avatar" />
								  <div v-else>
								  	<a-icon :type="imageLoading ? 'loading' : 'plus'" />
								  	<div class="ant-upload-text">
								  		上传
								  	</div>
								  </div>
								</a-upload>
								<!-- <a-textarea v-show="imgValue == 2" :rows="4" v-model="url" @pressEnter="textChange"/> -->
							</a-form-item>
							</a-col>
							<a-col class="gutter-row" :span="16">
								
								<div style="margin: 10px 100px;" >
									<a-button type="primary" @click="ok()" style="margin: 0 30px 0 0;">
									    生成
									</a-button>
									<a-button type="primary" @click="resetBarcode()" style="margin: 0 30px 0 0;">
									    重置
									</a-button>
									<a-button type="primary" @click="downLoad('code')">
										下载
									</a-button>
								</div>
								
							</a-col>
							<a-col class="gutter-row" :span="16">
								<canvas id="myCanvas" width="260" height="260" style="border:1px solid #d3d3d3;" v-show="show">
								您的浏览器不支持 HTML5 canvas 标签。</canvas>
								<div class="sg-qrcode" v-show="codeshow" style="margin: 10px 100px;">
									<vue-qr 
									:text="codeOptions.value" 
									:size="260" 
									:margin="20" 
									:logoScale="0.2" 
									:colorDark="codeOptions.codeColor" 
									:colorLight="codeOptions.codeBgColor" 
									:backgroundColor="codeOptions.codeBorderColor" 
									:logoSrc="codeOptions.url"
								
										>
										<!-- logoScale设置过大会导致扫码失败 -->
									</vue-qr>
								</div>
							</a-col>
					</a-row>
					</a-form>
					
					
				</a-tab-pane>
				<a-tab-pane key="2" tab="生成条形码" force-render>
					<a-form :form="form">
					<a-row :gutter="16">
						<a-col class="gutter-row" :span="16">
							<a-form-item label="条形码内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input  v-model="barOptions.barcodeContent" />
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="16">
							<a-form-item label="条形码颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<color-picker v-decorator="['barcolor']" @change="changeBarColour" />
							</a-form-item>
						</a-col>
						<a-col class="gutter-row" :span="16">
							<a-form-item label="条形码背景颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<color-picker v-decorator="['barbgcolor']" @change="changeBarBgColour" />
							</a-form-item>
						</a-col> 
						<a-col class="gutter-row" :span="16">
							<a-form-item label="是否显示条形码下方内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
								 <a-switch default-checked @change="showBarChange" />
							</a-form-item>
						</a-col>
					</a-row>
					<div style="margin: 10px 100px;">
						<a-button type="primary" @click="createBarcode()" style="margin: 0 30px 0 0;">
						    生成
						</a-button>
						<a-button type="primary" @click="resetBarcode()" style="margin: 0 30px 0 0;">
						    重置
						</a-button>
						<a-button type="primary" @click="downLoad('bar')">
							下载
						</a-button>
					</div>
					
					<div style="margin: 10px 100px;width: 500px">
						
						<img id="barcode"/>
						<!-- <VueBarcode v-if="shapeCode" :value="shapeCode.value" :options="barOptions"></VueBarcode> -->
					</div>
					
					</a-form>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>

<script>
	import pick from 'lodash.pick'
	import colorPicker from '@/components/TopVUI/color/colorPicker';
	import VueQr from "vue-qr"
	import html2canvas from "html2canvas"
	import JsBarcode from 'jsbarcode'
	import VueBarcode from '@xkeshi/vue-barcode';
	import { axios } from "@/utils/request";
	import {
		baseUrl
	} from '@/services/baseUrl.js';
	import Vue from 'vue';
	import {
		ACCESS_TOKEN
	} from '@/store/mutation-types';
	const fields = ['color','bgcolor','bordercolor','barcolor','barbgcolor']
	export default {
		components: {
			VueQr,
			VueBarcode,
			colorPicker
		},
		data() {
			return {
				uploadUrl: baseUrl + `/document/minio/uploadfile`,
				headers: {
					token: Vue.ls.get(ACCESS_TOKEN),
				},
				imageLoading:false,
				imgValue: 1,
				imgUrl:'',
				show:false,
				codeshow:true,
				shapeCode: {
					value: "20221",
				},
				codeOptions:{},
				barOptions:{},
				form: this.$form.createForm(this),
				loading: false,
				
				
				fileList: [],
				labelCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 5,
					},
				},
				wrapperCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 16,
					},
				},
			}
		},
		
		mounted() {
			this.resetBarcode()
			this.createBarcode()
		},
		methods: {
			
			createImg(num){
				var canvas=document.getElementById("myCanvas");
				var context=canvas.getContext("2d");
				var qrcode = document.querySelectorAll('.sg-qrcode img')
				var url = qrcode[0].src
				var img = new Image();
				img.src = url
				img.onload = function() {
				    context.drawImage(img,0,0);
				    //console.log(url);
				}
				this.show=true
				this.codeshow=false
				
			},
			showBarChange(checked){
				console.log(checked)
				this.barOptions.showBar=checked
			},
			//重置
			resetBarcode(){
				var option={
					barcolor:'#000000',
					barbgcolor:'#ffffff',
					color:"#000000",
					bgcolor:"#ffffff",
					bordercolor:"#ffffff",
					
				}
				this.form.setFieldsValue(pick(option, fields))
				this.barOptions={
					barcolor:'black',
					barBgColor:'white',
					barcodeContent:'123456',
					showBar:true
				}
				this.codeOptions={
					codeColor:"black",
					codeBgColor:"white",
					codeBorderColor:"white",
					value: "123456",
					codeContent:'',
					url:'https://vue.misboot.com/document/minio/showPic?fileuUrl=misboot-cloud-vue/logo1.png',
				}
				this.imgUrl=''
				this.createBarcode()
			},
			createBarcode(){
				if(!this.barOptions.barcodeContent){
					 this.$message.error('请输入条形码内容!');
				}else{
					JsBarcode("#barcode",this.barOptions.barcodeContent, {
					  format: "CODE128",  //条形码的格式
					  lineColor: this.barOptions.barcolor,  //线条颜色
					  background:this.barOptions.barBgColor,
					  width:2, //线宽
					  height:80,  //条码高度
					  displayValue: this.barOptions.showBar //是否显示文字信息
					})
				}
				
				
			},
			changeClsColour(val){
				this.codeOptions.codeColor=val
			},
			changeBgColour(val){
				this.codeOptions.codeBgColor=val
			},
			changeBorderColour(val){
				this.codeOptions.codeBorderColor=val
			},
			changeBarColour(val){
				this.barOptions.barcolor=val
			},
			changeBarBgColour(val){
				this.barOptions.barBgColor=val
			},
			beforeUpload(file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				  if (!isJpgOrPng) {
					this.$message.error('只能选择.jpg或者.png类型的图片文件!');
					return false;
				  }
				  const isLt2M = file.size / 1024 / 1024 < 2;
				  if (!isLt2M) {
					this.$message.error('图片大小必须小于2MB!');
					return false;
				  }
				//console.log(file)
			    this.fileList = [...this.fileList, file];
			   
			},
			// 上传
			handleUpload(files) {
			  const { fileList } = this;
			  const isJpgOrPng = files.file.type === 'image/jpeg' ||  files.file.type  === 'image/png';
			  console.log(fileList,files.file.type,files,isJpgOrPng)
			 
				  fileList.forEach((file) => {
				    this.$nextTick(() => {
				      this.uploadUrl = "/document/minio/uploadfile";
				      const formData = new FormData();
				      formData.append("name", file.name);
				      formData.append("type", file.type);
				      formData.append("lastModifiedDate", file.lastModifiedDate);
				      formData.append("size", file.size);
				      // formData.append('upfile', file)		//方式1
				      formData.append("file", file);
				      formData.append("bucket", "misboot-cloud-vue");
				      this.uploadData(formData);
				    });
				  });
			 
			 
			},
			// 图片上传
			uploadData(e) {
			  this.imageLoading = true;
			  const that = this;
			  axios({
			    url: baseUrl + that.uploadUrl,
			    method: "post",
			    processData: false,
			    headers: {
			      token: Vue.ls.get(ACCESS_TOKEN),
			    },
			    data: e,
			  })
			    .then((res) => {
					//console.log(res)
			      if (res.statusCode === 200) {
			         this.imgUrl=res.url
			       
			      } else {
			        that.$message.error(res.message);
			      }
			    })
			    .finally(() => {
			      this.imageLoading = false;
			    });
			},
			ok() {
				if(this.codeOptions.codeContent){
					this.codeOptions.value=this.codeOptions.codeContent
				}else{
					 this.$message.error('请输入二维码内容!');
				}
				if(this.imgUrl){
					this.codeOptions.url=this.imgUrl
				}else{
					this.codeOptions.url='https://vue.misboot.com/document/minio/showPic?fileuUrl=misboot-cloud-vue/logo1.png'
				}
				
			},
			//二维码，条形码下载
			downLoad(type) {
				if(type==='code'){
					var qrcode = document.querySelectorAll('.sg-qrcode img')
					var url = qrcode[0].src
				}else if(type=='bar'){
					var barImg=document.getElementById("barcode");
					var url=barImg.src
				}
				
				var a = document.createElement('a')
				var event = new MouseEvent('click')
				a.download = "下载"
				a.href = url
				a.dispatchEvent(event)
			},
		}
	}
</script>

<style scoped>
	.index-container {
		background-color: white;
		padding: 20px;
		padding-bottom: 50px;
	}
</style>
