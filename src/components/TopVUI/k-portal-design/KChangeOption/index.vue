<!--
 * @Description: 修改卡片、图表，下拉框等控件options的组件，添加移除校验规制的组件
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-05-21 13:55:26
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div class="option-change-container">
		<a-row v-if="type === 'option' || type === 'tab'" :gutter="8">
			<div class="option-change-box" v-for="(val, index) in value" :key="index">
				<a-col :span="9"><a-input v-model="val.label" placeholder="名称"/></a-col>
				<a-col :span="9"><a-input v-model="val.value" placeholder="值"/></a-col>
				<a-col :span="6"
					><div @click="handleDelete(index)" class="option-delete-box">
						<a-icon type="delete" /></div
				></a-col>
			</div>
			<a-col :span="24"><a @click="handleAdd">添加</a></a-col>
		</a-row>
		<a-row v-if="type === 'card'" :gutter="8">
			<div class="option-change-box" v-for="(val, index) in value" :key="index">
				<a-col :span="8"><a-input v-model="val.label" placeholder="文字"/></a-col>
				<a-col :span="8"><a-input v-model="val.icon" placeholder="图标"/></a-col>
				<a-col :span="8"><a-input v-model="val.unit" placeholder="单位"/></a-col>
				<a-col :span="18"><a-input v-model="val.count" placeholder="键值"/></a-col>
				<a-col :span="4">
					<colorPicker
						v-model="val.backgroundColor"
						@change="
							(event) => {
								changCardBg(event, index);
							}
						"
					></colorPicker
				></a-col>

				<a-col :span="2"
					><div @click="handleDelete(index)" class="option-delete-box">
						<a-icon type="delete" /></div
				></a-col>
			</div>
			<a-col :span="24"><a @click="handleAddCard">添加</a></a-col>
		</a-row>
		<a-row v-else-if="type === 'colspan'" :gutter="8">
			<div class="option-change-box" v-for="(val, index) in value" :key="index">
				<a-col :span="18"
					><a-input-number style="width:100%" :max="24" v-model="val.span" placeholder="名称"
				/></a-col>
				<a-col :span="6"
					><div @click="handleDelete(index)" class="option-delete-box">
						<a-icon type="delete" /></div
				></a-col>
			</div>
			<a-col :span="24"><a @click="handleAddCol">添加</a></a-col>
		</a-row>
		<a-row v-if="type === 'miniCard'" :gutter="8">
			<div class="option-change-box" v-for="(val, index) in value" :key="index">
				<a-col :span="9"><a-input v-model="val.title" placeholder="文字"/></a-col>
				<a-col :span="9"><a-input v-model="val.iconFont" placeholder="图标"/></a-col>
				<a-col :span="4">
					<!-- <a-input v-model="val.background" placeholder="背景颜色"/> -->
					<colorPicker
						v-model="val.background"
						@change="
							(event) => {
								changMiniCardBg(event, index);
							}
						"
					></colorPicker>
				</a-col>
				<a-col :span="22"><a-input v-model="val.url" placeholder="url"/></a-col>
				<a-col :span="2"
					><div @click="handleDelete(index)" class="option-delete-box">
						<a-icon type="delete" /></div
				></a-col>
			</div>
			<a-col :span="24"><a @click="handleAddMiniCard">添加</a></a-col>
		</a-row>
		<a-row v-if="type === 'color'" :gutter="8">
			<div class="option-change-box" v-for="(vals, index) in value" :key="index">
				<a-col :span="4"
					><colorPicker
						v-model="vals.value"
						@change="
							(event) => {
								changChartColor(event, index);
							}
						"
				/></a-col>
				<a-col :span="18"> <a-input v-model="vals.value"></a-input></a-col>
				<a-col :span="2"
					><div @click="handleDelete(index)" class="option-delete-box">
						<a-icon type="delete" /></div
				></a-col>
			</div>
			<a-col :span="24"><a @click="handleAddChartColor">添加</a></a-col>
		</a-row>
	</div>
</template>
<script>
import colorPicker from '@/components/TopVUI/color/colorPicker';
export default {
	name: 'KChangeOption',
	components: { colorPicker },
	props: {
		value: {
			type: Array,
			required: true,
		},
		type: {
			type: String,
			default: 'option',
		},
	},
	methods: {
		handleAdd() {
			// 添加
			let addData = [
				...this.value,
				{
					value: `${this.value.length + 1}`,
					label: '选项' + (this.value.length + 1),
					list: this.type === 'tab' ? [] : undefined,
				},
			];
			this.$emit('input', addData);
		},
		//卡片列表
		handleAddCard() {
			// 添加
			let addData = [
				...this.value,
				{
					value: `${this.value.length + 1}`,
					label: '卡片' + (this.value.length + 1),
					unit: '个',
					count: 'text',
					icon: '',
					backgroundColor: 'linear-gradient(67.0deg,#eb5008 0.0,#e02e87 100.0%)',
				},
			];
			this.$emit('input', addData);
		},
		// 小卡片
		handleAddMiniCard() {
			// 添加
			let addData = [
				...this.value,
				{
					title: '卡片' + (this.value.length + 1),
					iconFont: 'tree',
					background: '#ff0000',
					url: '',
				},
			];
			this.$emit('input', addData);
		},
		handleAddCol() {
			// 添加栅格Col
			let addData = [
				...this.value,
				{
					span: 12,
					list: [],
				},
			];
			this.$emit('input', addData);
		},
		handleAddRules() {
			let addData = [
				...this.value,
				{
					pattern: '',
					message: '',
				},
			];
			this.$emit('input', addData);
		},
		handleDelete(deleteIndex) {
			// 删除
			this.$emit(
				'input',
				this.value.filter((val, index) => index !== deleteIndex)
			);
			console.log(this.value.filter((val, index) => index !== deleteIndex));
		},
		changCardBg(val, index) {
			let valueData = this.value;
			valueData[index].backgroundColor = val;
			this.$emit('input', valueData);
		},
		changMiniCardBg(val, index) {
			let valueData = this.value;
			valueData[index].background = val;
			this.$emit('input', valueData);
		},
		handleAddChartColor() {
			let addData = this.value;
			addData.push('#000');
			this.$emit('input', addData);
		},
		changChartColor(val, index) {
			let valueData = this.value;
			valueData[index].value = val;
			console.log(valueData);
			this.$emit('input', valueData);
		},
	},
};
</script>
<style lang="less" scoped>
.option-change-container {
	width: calc(100% - 8px);
}
.option-change-box {
	height: 38px;
	padding-bottom: 6px;
	.option-delete-box {
		margin-top: 3px;
		background: #ffe9e9;
		color: #f22;
		width: 32px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		border-radius: 50%;
		overflow: hidden;
		transition: all 0.3s;
		&:hover {
			background: #f22;
			color: #fff;
		}
	}
}
</style>
