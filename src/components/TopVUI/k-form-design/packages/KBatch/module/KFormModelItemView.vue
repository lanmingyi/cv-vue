<!--
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件，无用
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:46:13
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KBatch\module\KFormModelItemView.vue
-->

<template>
  <a-form-model-item
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
  >
    <!-- 单选框 -->
    <TDictSelectTag
      :style="`width:${record.options.width}`"
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
      :style="`width:${record.options.width}`"
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
      :allowClear="record.options.clearable"
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
    <!-- 树选择器 -->
    <a-tree-select
      v-else-if="record.type === 'treeSelect'"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :showSearch="record.options.showSearch"
      :treeCheckable="record.options.treeCheckable"
      :treeData="record.options.options"
      :disabled="true"
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
      :disabled="true"
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
      :disabled="true"
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
    <FontPicker
      v-else-if="record.type === 'icon'"
      :record="record"
      :options="record.options.options"
      :disabled="true"
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
      :disabled="true"
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
      :disabled="true"
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
      :disabled="true"
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
      :disabled="true"
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
      :disabled="true"
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
      :disabled="true"
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
  </a-form-model-item>
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
import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
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
    TAreaLinkage,
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
  > .slider {
    flex: 1;
    margin-right: 16px;
  }
  > .number {
    width: 70px;
  }
}
</style>
