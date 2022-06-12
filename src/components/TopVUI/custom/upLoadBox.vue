<!--
 * @Description: 文件上传
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-05-21 14:30:14
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\custom\upLoadBox.vue
-->
<template>
	<div>
		<a-input :readOnly="true" v-model="uploadValues.name">
			<template slot="addonBefore" style="width: 30px">
				<a-tooltip v-if="!uploadValues">
					<a-icon type="edit" />
				</a-tooltip>
				<a-tooltip
					v-else-if="uploadValues.status === 'uploading'"
					:title="`上传中(${Math.floor(uploadValues.percent)}%)`"
				>
					<a-icon type="loading" />
				</a-tooltip>
				<a-tooltip v-else-if="uploadValues.status === 'done'" title="上传完成">
					<a-icon type="check-circle" style="color:#00DB00;" />
				</a-tooltip>
				<a-tooltip v-else title="上传失败">
					<a-icon type="exclamation-circle" style="color:red;" />
				</a-tooltip>
			</template>
			<template slot="addonAfter" style="width: 30px">
				<a-dropdown :trigger="['click']" placement="bottomRight">
					<a-tooltip title="操作">
						<a-icon v-if="uploadValues.status !== 'uploading'" type="setting" style="cursor: pointer;" />
					</a-tooltip>
					<a-menu slot="overlay">
						<a-menu-item>
							<a-upload
								name="file"
								accept="image/*"
								:action="uploadUrl"
								:showUploadList="false"
								:multiple="false"
								:headers="uploadHeader"
								:beforeUpload="beforeUpload"
								@change="(v) => handleChangeUpload(v)"
							>
								<a-icon type="upload" />上传图片
							</a-upload>
						</a-menu-item>
						<a-menu-item @click="handleClickDelFile()">
							<span> <a-icon type="delete" />&nbsp;删除</span>
						</a-menu-item>
					</a-menu>
				</a-dropdown>
			</template>
		</a-input>
	</div>
</template>

<script>
import { baseUrl } from '@/services/baseUrl.js';
import Vue from 'vue';
import { ACCESS_TOKEN } from '@/store/mutation-types';
export default {
	props: {
		avatarImg: {
			type: String,
		},
		url: {
			type: String,
			default: '/document/fdfs/upload',
		},
	},
	data() {
		return {
			uploadUrl: baseUrl + this.url,
			uploadValues: {},
			uploadHeader: {
				token: Vue.ls.get(ACCESS_TOKEN),
			},
			headImg: '',
		};
	},
	created() {},
	mounted() {},
	methods: {
		add() {
			const value = {
				name: this.avatarImg,
				type: '',
				size: '',
				status: this.avatarImg ? 'done' : '',
				percent: '',
			};
			this.uploadValues = value;
		},
		beforeUpload(file, fileList) {
			const isJPG = file.type === 'image/jpg';
			const isJPEG = file.type === 'image/jpeg';
			const isGIF = file.type === 'image/gif';
			const isPNG = file.type === 'image/png';
			if (!(isJPG || isJPEG || isGIF || isPNG)) {
				this.$nextTick(() => {
					const value = {
						name: '',
						type: '',
						size: '',
						status: '',
						percent: '',
					};
					this.uploadValues = value;
				});
				this.$message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片');
			}
			const reader = new FileReader();
			// 把Array Buffer转化为blob 如果是base64不需要
			// 转化为base64
			reader.readAsDataURL(file);
			reader.onload = () => {
				// this.headImg = reader.result
			};
		},
		handleChangeUpload(v) {
			const file = v.file;
			if (file.response && file.response.statusCode == 200) {
				const value = {
					name: file.response ? file.response.filePath : '',
					type: file.type,
					size: file.size,
					status: file.status,
					percent: file.percent,
				};
				this.uploadValues = value;
				this.headImg = file.response.filePath;
				this.$emit('upload', value.name, this.headImg);
			}
		},
		getUploadUrl() {
			return baseUrl + uploadUrl;
		},
		handleClickDelFile() {
			this.uploadValues = '';
		},
	},
};
</script>

<style></style>
