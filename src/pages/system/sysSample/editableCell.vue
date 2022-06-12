<!--
 * @Description: 可编辑表格列
 * @Author: 黄婷
 * @Date: 2021-06-23 09:35:06
 * @LastEditTime: 2021-08-24 19:07:58
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysSample\editableCell.vue
-->
<template>
  <div class="editable-cell">
    <a-form :form="form" v-if="editable">
      <a-form-item class="editable-cell-input-wrapper">
        <!-- 普通文本框 -->
        <a-input
          v-if="cellData.dataType === 'textbox'"
          v-decorator="[
            cellData.dataIndex,
            { initialValue: value, rules: getOptionRules() },
          ]"
          style="margin: -5px 0"
          @change="(e) => handleChange(e.target.value)"
          @pressEnter="check"/>
        <!-- 日期输入框 -->
        <t-date
          v-else-if="cellData.dataType === 'date'"
          v-decorator="[
            cellData.dataIndex,
            { initialValue: value, rules: getOptionRules() },
          ]"
          style="width: 100%;"
          :trigger-change="true"
          :showTime="cellData.option.showTime"
          :dateFormat="
            cellData.dataType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
          "
          allowClear
          :type="cellData.dataType"
          @change="handleChange"
          @pressEnter="check"/>
        <!-- 数值输入框 -->
        <a-input-number
          v-else-if="~['numberbox'].indexOf(cellData.dataType)"
          v-decorator="[
            cellData.dataIndex,
            { initialValue: value, rules: getOptionRules() },
          ]"
          :min="cellData.option.min ? cellData.option.min : 0"
          :max="cellData.option.max ? cellData.option.max : 100"
          :decimalSeparator="cellData.option.decimalSeparator"
          :style="{
            width: cellData.width
              ? parseInt(cellData.width) - 20 + 'px'
              : '100px',
          }"
          @change="handleChange"
          @pressEnter="check"/>
        <!-- 字典单选下拉框 -->
        <t-dict-select-tag
          v-decorator="[
            cellData.dataIndex,
            { initialValue: value, rules: getOptionRules() },
          ]"
          :dictCode="cellData.option.dictCode"
          v-else-if="
            (cellData.dataType === 'combobox' &&
              cellData.option.modeType === 'default') ||
              !cellData.option.modeType
          "
          :dataList="cellData.option.list"
          :style="{
            width: cellData.width
              ? parseInt(cellData.width) - 20 + 'px'
              : '150px',
          }"
          @change="handleChange"
          @pressEnter="check"/>
        <!-- 字典单选多选框 -->
        <t-multi-select-tag
          v-else-if="
            cellData.dataType === 'combobox' &&
              cellData.option.modeType === 'tags'
          "
          v-decorator="[
            cellData.dataIndex,
            { initialValue: value, rules: getOptionRules() },
          ]"
          :dictCode="cellData.option.dictCode"
          :dataList="cellData.option.list"
          :style="{
            width: cellData.width
              ? parseInt(cellData.width) - 20 + 'px'
              : '150px',
          }"
          @change="handleChange"
          @pressEnter="check"
        ></t-multi-select-tag>
        <a-icon type="check" class="editable-cell-icon-check" @click="check"
      /></a-form-item>
    </a-form>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || " " }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag"; //字典
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag"; //多选
export default {
  components: { TDictSelectTag, TMultiSelectTag },
  props: {
    cellData: Object,
    text: [String, Number],
    record: Object,
  },
  data() {
    return {
      value: this.text,
      editable: false,
      form: this.$form.createForm(this),
    };
  },
  mounted() {
    // console.log(this.cellData);
  },
  watch: {
    "record.editable": {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal) this.editable = true;
      },
    },
  },
  methods: {
    handleChange(e) {
      this.value = e;
      console.log(this.value);
    },
    check() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.editable = false;
          this.$emit("change", this.value);
        }
      });
    },
    edit() {
      this.editable = true;
    },
    getOptionRules() {
      return this.cellData?.option?.rules ?? [];
    },
  },
};
</script>

<style scoped>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}
.editable-cell-input-wrapper {
  margin-bottom: 0 !important;
}

.editable-cell-text-wrapper {
  /* padding: 5px 24px 5px 5px; */
  min-height: 18px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;

  top: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
  right: 0;
}

.editable-cell-icon-check {
  /* line-height: 28px; */
}

td:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
