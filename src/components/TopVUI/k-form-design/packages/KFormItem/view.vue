<!--
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: kcz
 * @Date: 2020-01-02 22:41:48
 * @LastEditors: 黄婷
 * @LastEditTime: 2021-08-04 16:49:56
 -->
<template>
  <!-- 可隐藏label -->
  <a-form-item
    v-if="!(record.options.hidden === true) && record.type === 'batch'"
    :label="!record.options.showLabel ? '' : record.label"
    :label-col="
      formConfig.layout === 'horizontal' && record.options.showLabel
        ? formConfig.labelCol
        : {}
    "
    :wrapper-col="
      formConfig.layout === 'horizontal' && record.options.showLabel
        ? formConfig.wrapperCol
        : {}
    "
  >
    <KBatch
      v-if="record.type === 'batch'"
      ref="KBatch"
      :style="`width:${record.options.width}`"
      :record="record"
      :config="config"
      :parentDisabled="disabled"
      :dynamicData="dynamicData"
      :isView="record.options.disabled"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></KBatch>
  </a-form-item>
  <!-- button按钮 -->
  <a-form-item
    v-else-if="!(record.options.hidden === true) && record.type === 'button'"
  >
    <a-button
      :disabled="disabled || record.options.disabled"
      @click="
        record.options.handle === 'submit'
          ? false
          : record.options.handle === 'reset'
          ? $emit('handleReset')
          : dynamicData[record.options.dynamicFun]
          ? dynamicData[record.options.dynamicFun]()
          : false
      "
      :type="record.options.type"
      :html-type="record.options.handle === 'submit' ? 'submit' : undefined"
      v-text="record.label"
    ></a-button>
  </a-form-item>
  <!-- alert提示 -->
  <a-form-item
    v-else-if="!(record.options.hidden === true) && record.type === 'alert'"
  >
    <a-alert
      :message="record.label"
      :description="record.options.description"
      :type="record.options.type"
      :showIcon="record.options.showIcon"
      :closable="record.options.closable"
      :banner="record.options.banner"
    />
  </a-form-item>
  <!-- 文本 -->
  <a-form-item
    v-else-if="!(record.options.hidden === true) && record.type === 'text'"
  >
    <div :style="{ textAlign: record.options.textAlign }">
      <label
        :class="{ 'ant-form-item-required': record.options.showRequiredMark }"
        v-text="record.label"
      ></label>
    </div>
  </a-form-item>
  <!-- html -->
  <div
    v-else-if="!(record.options.hidden === true) && record.type === 'html'"
    v-html="record.options.defaultValue"
  ></div>
  <!-- <div
    v-else-if="!(record.options.hidden === true) && record.type === 'editor'"
    v-html="getHtml(record.options.defaultValue)"
  ></div> -->
  <a-form-item
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
    v-else-if="!(record.options.hidden === true) && record.type === 'editor'"
  >
    <div
      style="width: 100%;padding: 0px 10px; border: 1px solid #d9d9d9;display: inline-block;line-height: 32px;border-radius: 5px;min-height: 32px;"
      v-html="getHtml(record.options.defaultValue)"
    ></div>
  </a-form-item>
  <div v-else-if="record.type === 'divider'">
    <!-- 分割线 -->
    <a-divider
      v-if="
        record.type === 'divider' &&
          record.label !== '' &&
          record.options.orientation
      "
      :orientation="record.options.orientation"
      >{{ record.label }}</a-divider
    >
    <a-divider v-else-if="record.type === 'divider' && record.label !== ''">{{
      record.label
    }}</a-divider>
    <a-divider v-else-if="record.type === 'divider' && record.label === ''" />
  </div>
  <a-form-item
    v-else-if="
      !(record.options.hidden === true) &&
        [
          'radio',
          'checkbox',
          'select',
          'switch',
          'cascader',
          'treeSelect',
        ].includes(record.type)
    "
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
  >
    <!-- 单选按钮 -->
    <TDictSelectTag
      v-if="record.type === 'radio'"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
      :dataType="record.options.dataType"
      :url="record.options.url"
      :dataList="record.options.options"
      :method="record.options.method"
      :params="record.options.dynamicKey"
      :dictCode="record.options.dictCode"
      :valueFeild="record.options.valueFeild"
      :textFeild="record.options.textFeild"
      type="radio"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TDictSelectTag>
    <!-- 多选框 -->
    <TMultiSelectTag
      v-else-if="record.type === 'checkbox'"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
      :dataType="record.options.dataType"
      :url="record.options.url"
      :dataList="record.options.options"
      :method="record.options.method"
      :params="record.options.dynamicKey"
      :dictCode="record.options.dictCode"
      :valueFeild="record.options.valueFeild"
      :textFeild="record.options.textFeild"
      type="checkbox"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TMultiSelectTag>
    <!--  <span  v-else-if="record.type === 'select'">
	  {{getArrayIndex(record.options.options,record.options.defaultValue)}}
  </span> -->
    <!-- 下拉选框 -->
    <TDictSelectTag
      v-else-if="record.type === 'select' && !record.options.multiple"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
      :dataType="record.options.dataType"
      :url="record.options.url"
      :dataList="record.options.options"
      :method="record.options.method"
      :params="record.options.dynamicKey"
      :dictCode="record.options.dictCode"
      :valueFeild="record.options.valueFeild"
      :textFeild="record.options.textFeild"
      type="select"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TDictSelectTag>
    <TMultiSelectTag
      v-else-if="record.type === 'select' && record.options.multiple"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
      :dataType="record.options.dataType"
      :url="record.options.url"
      :dataList="record.options.options"
      :method="record.options.method"
      :params="record.options.dynamicKey"
      :dictCode="record.options.dictCode"
      :valueFeild="record.options.valueFeild"
      :textFeild="record.options.textFeild"
      type="select"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TMultiSelectTag>
    <!-- 树选择器 -->
    <a-tree-select
      v-else-if="record.type === 'treeSelect'"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :showSearch="record.options.showSearch"
      :treeCheckable="record.options.treeCheckable"
      :treeData="record.options.options"
      :disabled="record.options.disabled"
      :allowClear="record.options.clearable"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    />
    <!-- 级联选择器 -->
    <a-cascader
      v-else-if="record.type === 'cascader'"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :showSearch="record.options.showSearch"
      :options="record.options.options"
      :disabled="record.options.disabled"
      :allowClear="record.options.clearable"
      @change="handleChange($event, record.model)"
      readOnly
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    />
    <!-- 开关 -->
    <a-switch
      v-else-if="record.type === 'switch'"
      :disabled="record.options.disabled"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          valuePropName: 'checked',
          rules: record.rules,
        },
      ]"
    />
  </a-form-item>
  <a-form-item
    v-else-if="
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
    "
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
  >
    <FontPicker
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
    ></FontPicker>
    <colorPicker
      v-else-if="record.type === 'color'"
      :options="record.options.options"
      :record="record"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></colorPicker>
    <TSelectUserByDep
      v-else-if="record.type === 'userPop'"
      :record="record"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TSelectUserByDep>
    <TSelectDepart
      v-else-if="record.type === 'depart'"
      :record="record"
      :multi="true"
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
    >
    </TSelectDepart>
    <TDictSelectTag
      v-else-if="record.type === 'codeTag'"
      :multi="true"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="
        (e) => {
          handleChange(e, record.model);
        }
      "
      dictCode="sex"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TDictSelectTag>
    <TAreaLinkage
      v-else-if="record.type === 'area'"
      :record="record"
      :type="record.options.areaType"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="
        (e) => {
          handleChange(e, record.model);
        }
      "
      dictCode="sex"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    >
    </TAreaLinkage>

    <a-statistic-countdown
      v-else-if="record.type === 'countdown'"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      format="HH:mm:ss:SSS"
      v-decorator="[
        record.model,
        {
          initialValue: Number(record.options.defaultValue),
          rules: record.rules,
        },
      ]"
    >
    </a-statistic-countdown>
  </a-form-item>
  <a-form-item
    v-else
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
    ><span
      style="width: 100%;padding: 0px 10px; border: 1px solid #d9d9d9;display: inline-block;line-height: 32px;border-radius: 5px;min-height: 32px;"
    >
      {{ record.options.defaultValue }}
    </span>
  </a-form-item>
</template>
<script>
/*
 * author 黄婷
 * date 2019-11-20
 */
// import moment from "moment";
import customComponent from "./customComponent";
import KBatch from "../KBatch/batch.vue";
import UploadFile from "../UploadFile";
import UploadImg from "../UploadImg";
import KDatePicker from "../KDatePicker";
import KTimePicker from "../KTimePicker";
import FontPicker from "@/components/TopVUI/font/fontPicker.vue";
import colorPicker from "@/components/TopVUI/color/colorPicker.vue";
import TSelectUserByDep from "@/components/TopVUI/custom/TSelectUserByDep";
import TSelectDepart from "@/components/TopVUI/custom/TSelectDepart";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
import editor from "@/components/TopVUI/custom/Editor/index.vue";
// import { getArrayIndex } from '@/utils/util'
export default {
  name: "KFormItemView",
  props: {
    // 表单数组
    record: {
      type: Object,
      required: true,
    },
    // form-item 宽度配置
    formConfig: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    KBatch,
    UploadImg,
    UploadFile,
    KDatePicker,
    KTimePicker,
    customComponent,
    FontPicker,
    colorPicker,
    TSelectUserByDep,
    TSelectDepart,
    TDictSelectTag,
    TAreaLinkage,
    editor,
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
  watch: {
    record(val) {
      console.log(val.options.defaultValue);
      val.options.defaultValue = val.options.defaultValue
        ? val.options.defaultValue
        : "";
    },
  },
  mounted() {
    // console.log(this.isView,'view====')
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      if (!this.$refs.KBatch) return true;
      return this.$refs.KBatch.validationSubform();
    },
    handleChange(value, key) {
      this.record.options.defaultValue = value;
      // change事件
      this.$emit("change", value, key);
    },
    getHtml(e) {
      return e.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
    },
    getArrayIndex(list, val) {
      var index = list.map((item) => item.value.toString()).indexOf(val);
      console.log(index);
      if (index >= 0) {
        return list[index].label;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.slider-box {
  display: flex;
  > .slider {
    flex: 1;
    margin-right: 16px;
  }
  > .number {
    width: 70px;
  }
}
</style>
