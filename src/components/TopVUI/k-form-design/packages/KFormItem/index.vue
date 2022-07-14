<!--
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: lmy
 * @Date: 2020-01-02 22:41:48
 * @LastEditors: lmy
 * @LastEditTime: 2021-09-14 09:17:13
 -->
<template>
  <!-- <a-col class="grid-col" :span="record.grid"> -->
  <a-form-item
    v-if="
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
    "
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
  >
    <!-- 单行文本 -->
    <a-input
      :style="`width:${record.options.width}`"
      v-if="record.type === 'input'"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :type="record.options.type"
      :allowClear="record.options.clearable"
      :maxLength="record.options.maxLength"
      :addonBefore="record.options.prefix"
      :addonAfter="record.options.suffix"
      @change="handleChange($event.target.value, record.model)"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules, // 验证规则
        },
      ]"
    />
    <!-- 多行文本 -->
    <a-textarea
      :style="`width:${record.options.width}`"
      v-else-if="record.type === 'textarea'"
      :autoSize="{
        minRows: record.options.minRows,
        maxRows: record.options.maxRows,
      }"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :allowClear="record.options.clearable"
      :maxLength="record.options.maxLength"
      :rows="4"
      @change="handleChange($event.target.value, record.model)"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules, // 验证规则
        },
      ]"
    />

    <!-- 日期选择 -->
    <KDatePicker
      v-else-if="record.type === 'date'"
      :record="record"
      :parentDisabled="disabled"
      @change="handleChange($event, record.model)"
      :allowClear="record.options.clearable"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.range
            ? record.options.rangeDefaultValue
            : record.options.defaultValue, // 默认值
          rules: record.rules, // 验证规则
        },
      ]"
    />
    <!-- 时间选择 -->
    <KTimePicker
      v-else-if="record.type === 'time'"
      :record="record"
      :parentDisabled="disabled"
      @change="handleChange($event, record.model)"
      :allowClear="record.options.clearable"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules, // 验证规则
        },
      ]"
    />
    <!-- 数字输入框 -->
    <a-input-number
      v-else-if="record.type === 'number'"
      :style="`width:${record.options.width} !important`"
      :min="
        record.options.min || record.options.min === 0
          ? record.options.min
          : -Infinity
      "
      :max="
        record.options.max || record.options.max === 0
          ? record.options.max
          : Infinity
      "
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      :step="record.options.step"
      :precision="
        record.options.precision > 50 ||
        (!record.options.precision && record.options.precision !== 0)
          ? null
          : record.options.precision
      "
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    />
    <!-- 单选框 -->
    <TDictSelectTag
      v-else-if="record.type === 'radio'"
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
      :allowClear="record.options.clearable"
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
      :allowClear="record.options.clearable"
      type="checkbox"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TMultiSelectTag>
    <!-- 评分 -->
    <a-rate
      v-else-if="record.type === 'rate'"
      :count="record.options.max"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :allowHalf="record.options.allowHalf"
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
    <!-- 下拉选框 -->
    <!-- <a-select
      :style="`width:${record.options.width}`"
      v-else-if="record.type === 'select'"
      :placeholder="record.options.placeholder"
      :showSearch="record.options.showSearch"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      :mode="record.options.multiple ? 'multiple' : ''"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    /> -->
    <TDictSelectTag
			:style="`width:${record.options.width}`"
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
      :allowClear="record.options.clearable"
      :showSearch="record.options.showSearch"
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
			:style="`width:${record.options.width}`"
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
      :allowClear="record.options.clearable"
      type="select"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></TMultiSelectTag>
    <!-- 开关 -->
    <a-switch
      v-else-if="record.type === 'switch'"
      :disabled="disabled || record.options.disabled"
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
    <!-- 滑块 -->
    <div
      v-else-if="record.type === 'slider'"
      :style="`width:${record.options.width}`"
      class="slider-box"
    >
      <div class="slider">
        <a-slider
          :disabled="disabled || record.options.disabled"
          :min="record.options.min"
          :max="record.options.max"
          :step="record.options.step"
          :vertical="record.options.vertical"
          v-decorator="[
            record.model,
            { initialValue: record.options.defaultValue, rules: record.rules },
          ]"
        />
      </div>
      <div class="number" v-if="record.options.showInput">
        <a-input-number
          style="width:100%"
          :disabled="disabled || record.options.disabled"
          :min="record.options.min"
          :max="record.options.max"
          :step="record.options.step"
          @change="handleChange($event, record.model)"
          v-decorator="[
            record.model,
            {
              initialValue: record.options.defaultValue,
            },
          ]"
        />
      </div>
    </div>
    <!-- 上传图片 -->
    <UploadImg
      ref="uploadImg"
      v-else-if="record.type === 'uploadImg'"
      :style="`width:${record.options.width}`"
      :parentDisabled="disabled"
      :record="record"
      :config="config"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    />
    <!-- 上传文件 -->
    <UploadFile
      v-else-if="record.type === 'uploadFile'"
      :style="`width:${record.options.width}`"
      :record="record"
      :config="config"
      :dynamicData="dynamicData"
      :parentDisabled="disabled"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    />
    <!-- 树选择器 -->
    <!-- <a-tree-select
      v-else-if="record.type === 'treeSelect'"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :showSearch="record.options.showSearch"
      :treeCheckable="record.options.treeCheckable"
      :treeData="record.options.options"
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
      url: '/mockXHR/portal/getTreeData',
            parameter: '',
    /> -->
    <TreeSelect
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :showSearch="record.options.showSearch"
      :treeCheckable="record.options.treeCheckable"
      :treeData="record.options.options"
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      :url="record.options.url"
      :parameter="record.options.parameter"
      :method="record.options.method"
			:parentKey.sync="record.options.parentKey"
			:expandUrl="record.options.expandUrl"
			:childParams="record.options.childParams"
			:codeParams="record.options.codeParams"
			:dataType="record.options.dataType"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
      v-else-if="record.type === 'treeSelect'"
    ></TreeSelect>
    <!-- 级联 -->
    <Tcascader
      :placeholder="record.options.placeholder"
      :disabled="disabled || record.options.disabled"
      :allowClear="true"
      :url="record.options.url"
      :parameter="record.options.parameter"
      :method="record.options.method"
      :record="record"
			:parentKey.sync="record.options.parentKey"
			:expandUrl="record.options.expandUrl"
			:childParams="record.options.childParams"
			:codeParams="record.options.codeParams"
			:dataType="record.options.dataType"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
      v-else-if="record.type === 'cascader'"
    ></Tcascader>
    <!-- 级联选择器 -->
    <!-- <a-cascader
      v-else-if="record.type === 'cascader'"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :showSearch="record.options.showSearch"
      :options="record.options.options"
      :disabled="disabled || record.options.disabled"
      :allowClear="record.options.clearable"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    /> -->
  </a-form-item>
  <!-- 可隐藏label -->
  <a-form-item
    v-else-if="record.type === 'batch' || record.type === 'editor'"
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
    <!-- 动态表格 -->
    <KBatch
      v-if="record.type === 'batch'"
      ref="KBatch"
      :style="`width:${record.options.width}`"
      :record="record"
      :config="config"
      :parentDisabled="disabled"
      :dynamicData="dynamicData"
      @change="handleChange($event, record.model)"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    />
    <!-- 富文本编辑器 -->
    <editor
      v-else
      ref="KEditor"
      :style="`width:${record.options.width}`"
      :parentDisabled="disabled"
      :dynamicData="dynamicData"
      :height="record.options.height"
      :placeholder="record.options.placeholder"
      @onchange="
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
    />
  </a-form-item>
  <!-- button按钮 -->
  <a-form-item v-else-if="record.type === 'button'">
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
      :ghost="record.options.ghost"
      :icon="record.options.icon ? record.options.icon : null"
      :shape="record.options.shape ? record.options.shape : null"
      :size="record.options.size"
      :block="record.options.block"
      :html-type="record.options.handle === 'submit' ? 'submit' : undefined"
      v-text="record.label"
    ></a-button>
  </a-form-item>
  <!-- alert提示 -->
  <a-form-item v-else-if="record.type === 'alert'">
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
  <a-form-item v-else-if="record.type === 'text'">
    <div
      :style="{
        textAlign: record.options.textAlign,
        width: record.options.width,
        lineHeight: record.options.lineHeight,
      }"
    >
      <label
        :class="{
          'ant-form-item-required': record.options.showRequiredMark,
          'text-bold': record.options.textBold,
          'text-italic': record.options.textItalic,
          'text-decoration': record.options.textUnderline,
          'text-strikethrough': record.options.textStrikethrough,
        }"
        :style="{
          fontSize: record.options.textSize + 'px !important',
          color: record.options.textColor,
        }"
        v-text="record.label"
      ></label>
    </div>
  </a-form-item>
  <!-- html -->
  <div v-else-if="record.type === 'html'" v-html="record.options.defaultValue">
    {{ record.options.defaultValue }}
  </div>
  <!-- 自定义组件 -->
  <customComponent
    v-else-if="customList.includes(record.type)"
    :record="record"
    :disabled="disabled"
    :dynamicData="dynamicData"
    @change="handleChange($event, record.model)"
    :formConfig="formConfig"
  />
  <a-form-item
    v-else-if="
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
    <!-- iconFontPicker -->
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
    <!-- 图标选择器 -->
    <iconFontPicker
      v-if="record.type === 'icon'"
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
    ></iconFontPicker>
    <!-- 颜色选择器 -->
    <colorPicker
      v-else-if="record.type === 'color'"
      :options="record.options.options"
      :record="record"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :showprecolor="record.options.showprecolor"
      :showhistorycolor="record.options.showhistorycolor"
      :format="record.options.format"
      :showPalette="record.options.showPalette"
      :size="record.options.size"
      :canMove="record.options.canMove"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules,
        },
      ]"
    ></colorPicker>
    <!-- 人员选择器 -->
    <TSelectUserByDep
      v-else-if="record.type === 'userPop'"
      :record="record"
      :multiple="record.options.multiple"
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
    <!-- 部门选择器 -->
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
    <!-- 字典选择器 -->
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
    <!-- 省市区 -->
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
    <!-- 倒计时 -->
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

  <div v-else>
    <!-- 分割线 -->
    <a-divider
      v-if="record.type === 'divider'"
      :orientation="record.options.orientation"
      :dashed="record.options.dashed"
      >{{ record.label }}</a-divider
    >
    <!-- <a-divider v-else-if="record.type === 'divider' && record.label !== ''">{{
      record.label
    }}</a-divider>
    <a-divider v-else-if="record.type === 'divider' && record.label === ''" /> -->
  </div>
  <!-- </a-col> -->
</template>
<script>
/*
 * author lmy
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
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker.vue";
import colorPicker from "@/components/TopVUI/color/colorPicker.vue";
import TSelectUserByDep from "@/components/TopVUI/custom/TSelectUserByDep";
import TSelectDepart from "@/components/TopVUI/custom/TSelectDepart";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
import editor from "@/components/TopVUI/custom/Editor/index.vue";
import TreeSelect from "../components/formTreeSelect.vue";
import Tcascader from "../components/Tcascader.vue";
export default {
  name: "KFormItem",
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
    TMultiSelectTag,
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
  watch: {
    record(val) {
      // console.log(val.options.defaultValue)
      val.options.defaultValue = val.options.defaultValue
        ? val.options.defaultValue
        : "";
    },
  },
  mounted() {
    // console.log(this.isView,'111111111111')
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
