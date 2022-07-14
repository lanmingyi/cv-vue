<!--
 * @Description: 动态表格组件，传入record数据，通过判断record.type，来渲染对应的组件，
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:46:56
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KBatch\module\KFormModelItem.vue
-->
<template>
	<a-form-model-item v-if="
      [
        'input',
        'textarea',
        'date',
        'time',
        'number',
        'radio',
        'checkbox',
        'select',
        'rate',
        'switch',
        'slider',
        'uploadImg',
        'uploadFile',
        'cascader',
        'treeSelect',
      ].includes(record.type)
    " :prop="`domains.${index}.${record.model}`" :rules="record.rules">
		<!-- 单行文本 -->
		<a-input :style="`width:${record.options.width}`" v-if="record.type === 'input'"
			:disabled="record.options.disabled || parentDisabled" :placeholder="record.options.placeholder"
			:type="record.options.type" :allowClear="record.options.clearable" :addonBefore="record.options.prefix"
			:addonAfter="record.options.suffix" :maxLength="record.options.maxLength" :value="value"
			@change="handleChange($event.target.value)" />
		<!-- 多行文本 -->
		<a-textarea :style="`width:${record.options.width}`" v-else-if="record.type === 'textarea'" :autoSize="{
        minRows: record.options.minRows,
        maxRows: record.options.maxRows,
      }" :disabled="record.options.disabled || parentDisabled" :placeholder="record.options.placeholder"
			:allowClear="record.options.clearable" :maxLength="record.options.maxLength" :rows="4" :value="value"
			@change="handleChange($event.target.value)" />

		<!-- 日期选择 -->
		<KDatePicker v-else-if="record.type === 'date'" :parentDisabled="parentDisabled" :record="record" :value="value"
			:allowClear="record.options.clearable" @change="handleChange" />
		<!-- 时间选择 -->
		<KTimePicker v-else-if="record.type === 'time'" :parentDisabled="parentDisabled" :record="record" :value="value"
			:allowClear="record.options.clearable" @change="handleChange" />
		<!-- 数字输入框 -->
		<a-input-number v-else-if="record.type === 'number'" :style="`width:${record.options.width}`" :min="
        record.options.min || record.options.min === 0
          ? record.options.min
          : -Infinity
      " :max="
        record.options.max || record.options.max === 0
          ? record.options.max
          : Infinity
      " :precision="
        record.options.precision > 50 ||
        (!record.options.precision && record.options.precision !== 0)
          ? null
          : record.options.precision
      " :disabled="record.options.disabled || parentDisabled" :allowClear="record.options.clearable"
			:step="record.options.step" :placeholder="record.options.placeholder" :value="value"
			@change="handleChange" />
		<!-- 单选框 -->
		<TDictSelectTag :style="`width:${record.options.width}`" v-else-if="record.type === 'radio'"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder"
			@change="handleChange($event, record.model)" :dataType="record.options.dataType" :url="record.options.url"
			:dataList="record.options.options" :method="record.options.method" :params="record.options.dynamicKey"
			:dictCode="record.options.dictCode" :valueFeild="record.options.valueFeild"
			:textFeild="record.options.textFeild" :allowClear="record.options.clearable" type="radio" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></TDictSelectTag>
		<!-- 多选框 -->
		<TMultiSelectTag :style="`width:${record.options.width}`" v-else-if="record.type === 'checkbox'"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder"
			@change="handleChange($event, record.model)" :dataType="record.options.dataType" :url="record.options.url"
			:dataList="record.options.options" :method="record.options.method" :params="record.options.dynamicKey"
			:dictCode="record.options.dictCode" :valueFeild="record.options.valueFeild"
			:textFeild="record.options.textFeild" :allowClear="record.options.clearable" type="checkbox" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></TMultiSelectTag>
		<!-- 评分 -->
		<a-rate v-else-if="record.type === 'rate'" :count="record.options.max"
			:disabled="record.options.disabled || parentDisabled" :placeholder="record.options.placeholder"
			:allowHalf="record.options.allowHalf" :allowClear="record.options.clearable" :value="value"
			@change="handleChange" />
		<!-- 下拉选框 -->
		<TDictSelectTag v-else-if="record.type === 'select' && !record.options.multiple"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder"
			@change="handleChange($event, record.model)" :dataType="record.options.dataType" :url="record.options.url"
			:dataList="record.options.options" :method="record.options.method" :params="record.options.dynamicKey"
			:dictCode="record.options.dictCode" :valueFeild="record.options.valueFeild"
			:textFeild="record.options.textFeild" :allowClear="record.options.clearable" type="select" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></TDictSelectTag>
		<TMultiSelectTag v-else-if="record.type === 'select' && record.options.multiple"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder"
			@change="handleChange($event, record.model)" :dataType="record.options.dataType" :url="record.options.url"
			:dataList="record.options.options" :method="record.options.method" :params="record.options.dynamicKey"
			:dictCode="record.options.dictCode" :valueFeild="record.options.valueFeild"
			:textFeild="record.options.textFeild" :allowClear="record.options.clearable" type="select" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></TMultiSelectTag>
		<!-- 开关 -->
		<a-switch v-else-if="record.type === 'switch'" :disabled="record.options.disabled || parentDisabled"
			:checked="value" @change="handleChange" />
		<!-- 滑块 -->
		<div v-else-if="record.type === 'slider'" :style="`width:${record.options.width}`" class="slider-box">
			<div class="slider">
				<a-slider :disabled="record.options.disabled || parentDisabled" :min="record.options.min"
					:max="record.options.max" :step="record.options.step" :value="value"
					:vertical="record.options.vertical" @change="handleChange" />
			</div>
			<div class="number" v-if="record.options.showInput">
				<a-input-number style="width:100%" :disabled="record.options.disabled || parentDisabled"
					:min="record.options.min" :max="record.options.max" :step="record.options.step"
					:allowClear="record.options.clearable" :value="value" @change="handleChange" />
			</div>
		</div>
		<!-- 上传图片 -->
		<UploadImg v-else-if="record.type === 'uploadImg'" :style="`width:${record.options.width}`"
			:parentDisabled="parentDisabled" :record="record" :config="config" :value="value" @change="handleChange" />
		<!-- 上传文件 -->
		<UploadFile v-else-if="record.type === 'uploadFile'" :style="`width:${record.options.width}`"
			:parentDisabled="parentDisabled" :dynamicData="dynamicData" :config="config" :record="record" :value="value"
			@change="handleChange" />
		<!-- 树选择器 -->
		<!-- <a-tree-select
      v-else-if="record.type === 'treeSelect'"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :showSearch="record.options.showSearch"
      :treeCheckable="record.options.treeCheckable"
      :treeData="record.options.options"
      :disabled="record.options.disabled || parentDisabled"
      :allowClear="record.options.clearable"
      :value="value"
      @change="handleChange"
    /> -->
		<TreeSelect :placeholder="record.options.placeholder" :multiple="record.options.multiple"
			:showSearch="record.options.showSearch" :treeCheckable="record.options.treeCheckable"
			:treeData="record.options.options" :disabled="parentDisabled || record.options.disabled"
			:allowClear="record.options.clearable" :fathersUrl="record.options.fathersUrl"
			:expandUrl="record.options.expandUrl" :fathersParma="record.options.fathersParma"
			:childParma="record.options.childParma" @change="handleChange($event, record.model)" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]" v-else-if="record.type === 'treeSelect'"></TreeSelect>
		<!-- 级联选择器 -->
		<!-- 级联 -->
		<Tcascader :placeholder="record.options.placeholder" :multiple="record.options.multiple"
			:showSearch="record.options.showSearch" :treeCheckable="record.options.treeCheckable"
			:treeData="record.options.options" :disabled="parentDisabled || record.options.disabled"
			:allowClear="record.options.clearable" :fathersUrl="record.options.fathersUrl"
			:expandUrl="record.options.expandUrl" :fathersParma="record.options.fathersParma"
			:childParma="record.options.childParma" :text-feild="record.options.textFeild"
			:value-feild="record.options.valueFeild" :record="record" @change="handleChange($event, record.model)"
			v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]" v-else-if="record.type === 'cascader'"></Tcascader>
	</a-form-model-item>
	<a-form-item v-else-if="
      !(record.options.hidden === true) &&
        [
          'icon',
          'color',
          'userPop',
          'depart',
          'codeTag',
          'area',
          'countdown',
        ].includes(record.type)
    " :label="record.label" :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}" :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    ">
		<!-- <FontPicker
      v-if="record.type === 'icon'"
      :record="record"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="
        (e) => {
          handleChange(e, record.model);
        }
      "
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></FontPicker> -->
		<iconFontPicker v-if="record.type === 'icon'" :record="record" :options="record.options.options"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder" @change="
        (e) => {
          handleChange(e, record.model);
        }
      " v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></iconFontPicker>
		<colorPicker v-else-if="record.type === 'color'" :options="record.options.options" :record="record"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder"
			:showprecolor="record.options.showprecolor" :showhistorycolor="record.options.showhistorycolor"
			:format="record.options.format" :showPalette="record.options.showPalette" :size="record.options.size"
			:canMove="record.options.canMove" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></colorPicker>
		<TSelectUserByDep v-else-if="record.type === 'userPop'" :record="record" :options="record.options.options"
			:multiple="record.options.multiple" :disabled="parentDisabled || record.options.disabled"
			:placeholder="record.options.placeholder" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></TSelectUserByDep>
		<TSelectDepart v-else-if="record.type === 'depart'" :record="record" :multi="true"
			:options="record.options.options" :disabled="parentDisabled || record.options.disabled"
			:placeholder="record.options.placeholder" @change="
        (e) => {
          handleChange(e, record.model);
        }
      " v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]">
		</TSelectDepart>
		<TDictSelectTag v-else-if="record.type === 'codeTag'" :multi="true" :options="record.options.options"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder" @change="
        (e) => {
          handleChange(e, record.model);
        }
      " dictCode="sex" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"></TDictSelectTag>
		<TAreaLinkage v-else-if="record.type === 'area'" :record="record" :type="record.options.areaType"
			:options="record.options.options" :disabled="parentDisabled || record.options.disabled"
			:placeholder="record.options.placeholder" @change="
        (e) => {
          handleChange(e, record.model);
        }
      " dictCode="sex" v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]">
		</TAreaLinkage>
		<a-statistic-countdown v-else-if="record.type === 'countdown'" :options="record.options.options"
			:disabled="parentDisabled || record.options.disabled" :placeholder="record.options.placeholder"
			format="HH:mm:ss:SSS" v-decorator="[
        record.model,
        {
          initialValue: Number(record.options.defaultValue),
          rules: record.rules,
        },
      ]">
		</a-statistic-countdown>
	</a-form-item>
	<!-- 文本 -->
	<a-form-model-item v-else-if="record.type === 'text'">
		<div :style="{ textAlign: record.options.textAlign }">
			<label :class="{ 'ant-form-item-required': record.options.showRequiredMark }" v-text="record.label"></label>
		</div>
	</a-form-model-item>
	<!-- html -->
	<div v-else-if="record.type === 'html'" v-html="record.options.defaultValue"></div>

	<div v-else>
		<!-- 空 -->
	</div>
</template>
<script>
	/*
	 * author lmy
	 * date 2019-11-20
	 */
	// import moment from "moment";

	import UploadFile from "../../UploadFile";
	import UploadImg from "../../UploadImg";
	import KDatePicker from "../../KDatePicker";
	import KTimePicker from "../../KTimePicker";
	import FontPicker from "@/components/TopVUI/font/fontPicker.vue";
	import colorPicker from "@/components/TopVUI/color/colorPicker.vue";
	import TSelectUserByDep from "@/components/TopVUI/custom/TSelectUserByDep";
	import TSelectDepart from "@/components/TopVUI/custom/TSelectDepart";
	import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
	import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
	import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
	import iconFontPicker from "@/components/TopVUI/font/iconFontPicker.vue";
	import TreeSelect from "../../components/formTreeSelect.vue";
	import Tcascader from "../../components/Tcascader.vue";
	export default {
		name: "KFormItem",
		props: [
			"record",
			"domains",
			"index",
			"value",
			"parentDisabled",
			"dynamicData",
			"config",
		],
		components: {
			UploadImg,
			UploadFile,
			KDatePicker,
			KTimePicker,
			FontPicker,
			colorPicker,
			TSelectUserByDep,
			TSelectDepart,
			TDictSelectTag,
			TMultiSelectTag,
			TAreaLinkage,
			iconFontPicker,
			TreeSelect,
			Tcascader,
		},
		computed: {
			customList() {
				if (window.$customComponentList) {
					return window.$customComponentList.map((item) => item.type);
				} else {
					return [];
				}
			},
		},
		methods: {
			handleChange(e) {
				console.log(e);
				this.$emit("input", e);
			},
		},
	};
</script>
<style lang="less" scoped>
	.slider-box {
		display: flex;

		>.slider {
			flex: 1;
			margin-right: 16px;
		}

		>.number {
			width: 70px;
		}
	}
</style>
