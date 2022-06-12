<template>
	<t-modal
		title="新增/编辑"
		:width="800"
		:visible="visible"
		:confirmLoading="loading"
		@ok="
			() => {
				$emit('ok');
			}
		"
		@cancel="
			() => {
				$emit('cancel');
			}
		"
	>
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="24" type="flex" justify="start">
					<a-col :span="24">
						<a-form-item label="用品ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['useId']" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="用品库名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['warehouseName', { rules: [{ required: true, message: '必填' }] }]">
								<a-select-option
									v-for="(item, index) in warehouseList"
									:key="index"
									:value="item.warehouseName"
									@click="changeWare(item)"
								>
									{{ item.warehouseName }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="办公用品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['useType', { rules: [{ required: true, message: '必填' }] }]">
								<a-select-option
									v-for="(item, index) in typeList"
									:key="index"
									:value="item.value"
									@click="changeType(item)"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="办公用品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['useName', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="[
									'counts',
									{ initialValue: '0', rules: [{ required: true, message: '必填' }] },
								]"
								disabled
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea :rows="4" v-decorator="['explain']" />
						</a-form-item>
					</a-col>
					<!-- <a-col :span="24">
						<a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['images']" hidden />
							<div >
								<a-upload accept="image/*" :action="upLoadUrl" :headers="uploadHeader" list-type="picture-card" @change="handleChange"
								 @preview="handlePreview" >
									<img  v-if="images" :src="images" alt="avatar" @click.stop=""/>
									<div v-if="fileList.length === 0">
										<a-icon :type="loading ? 'loading' : 'plus'" />
										<div class="ant-upload-text">
											上传
										</div>
									</div>
								</a-upload>
							</div>
							<div style="font-size: 10px;color: red;line-height: 10px;">* 最多上传一张照片</div>
							<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
								<img alt="example" style="width: 100%" :src="previewImage" />
							</a-modal>
						</a-form-item>
					</a-col> -->
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['useTypeName']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['suppliesUuid']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';
import { baseUrl } from '@/services/baseUrl.js';
import Vue from 'vue';
import { ACCESS_TOKEN } from '@/store/mutation-types';

// 表单字段
const fields = [
	'uuid',
	'useId',
	'useType',
	'useTypeName',
	'useName',
	'images',
	'explain',
	'counts',
	'suppliesUuid',
	'warehouseName',
];

export default {
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		loading: {
			type: Boolean,
			default: () => false,
		},
		model: {
			type: Object,
			default: () => null,
		},
		typeList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			labelCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 8,
				},
			},
			labelColfull: {
				xs: {
					span: 24,
				},
				sm: {
					span: 4,
				},
			},
			wrapperCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 12,
				},
			},
			wrapperColfull: {
				xs: {
					span: 24,
				},
				sm: {
					span: 18,
				},
			},
			form: this.$form.createForm(this),
			uploadHeader: {
				token: Vue.ls.get(ACCESS_TOKEN),
			},
			url: {
				getSerialNumber: '/office/officeMeetingRegister/getSerialNumber',
				getPageSetSupplies: '/office/oaWorkSupplies/getPageSet',
			},
			// upLoadUrl: baseUrl + '/system/attachment/upload',
			upLoadUrl: baseUrl + '/document/fdfs/upload',
			uuid: '',
			avatar: '',
			uploadValues: '',
			previewVisible: false,
			previewImage: '',
			warehouseList: [],
			fileList: [],
			fileData: [],
			images: '',
		};
	},
	methods: {
		add(m) {
			console.log('add', m);
			this.fileList = [];
			this.images = '';
			this.form.setFieldsValue(pick(m, fields));
			this.$post(this.url.getPageSetSupplies).then((res) => {
				this.warehouseList = res.rows;
			});
			this.$post(this.url.getSerialNumber).then((res) => {
				this.form.setFieldsValue({
					useId: res,
				});
			});
		},
		edit(m) {
			this.fileList = [];
			this.images = '';
			this.$nextTick(() => {
				this.form.setFieldsValue(pick(m, fields));
				this.$post(this.url.getPageSetSupplies).then((res) => {
					this.warehouseList = res.rows;
					res.rows.forEach((val) => {
						if (val.uuid == m.suppliesUuid) {
							this.form.setFieldsValue({
								warehouseName: val.warehouseName,
							});
						}
					});
				});
				this.images = baseUrl + '/system/attachment/showPic?path=' + m.images;
				this.fileList.push({
					url: m.images,
				});
			});
		},
		changeWare(item) {
			this.$nextTick(() => {
				this.form.setFieldsValue({
					warehouseName: item.warehouseName,
					suppliesUuid: item.uuid,
				});
			});
		},
		handleCancel() {
			this.previewVisible = false;
		},
		handlePreview(file) {
			console.log('file', file);
			this.previewImage = file.thumbUrl;
			this.previewVisible = true;
		},
		handleChange(info) {
			if (info.file.status === 'uploading') {
				return;
			}
			if (info.file.status === 'done') {
				console.log('info', info.file);
				// this.images = baseUrl + '/system/attachment/showPic?path=' + info.file.response.url
				this.fileList.push(info.file.response);
				this.form.setFieldsValue({
					images: info.file.response.url,
				});
			}
		},
		changePic(e, img) {
			this.uploadValues = e;
			this.avatar = e;
			this.model.avatar = img;
			this.form.setFieldsValue({
				avatar: e,
			});
		},
		changeType(item) {
			this.$nextTick(() => {
				console.log('item.text', item.value, item.text);
				this.form.setFieldsValue({
					useTypeName: item.text,
					useType: item.value,
				});
			});
		},
	},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));
		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
			this.model && this.form.setFieldsValue(pick(this.model, fields));
		});
	},
};
</script>

<style lang="less" scoped>
.tab_table {
	width: 100%;
	min-height: 100px;
	background: #ffffff;
	border-radius: 8px;
	border: 1px solid #e7e7e7;
	margin-right: 10px;
	padding: 5px 5px 0 5px;
	max-height: 300px;
	overflow: auto;

	& span {
		padding: 3px 8px;
		margin-bottom: 5px;
	}
}

.item-box {
	display: flex;
	align-items: flex-start;
}
</style>
