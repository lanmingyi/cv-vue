<template>
  <div>
    <a-table
      size="small"
      :columns="columns"
      :dataSource="dataSource"
      bordered
      :pagination="false"
      :rowKey="(record, index) => record.listClearly"
      :rowSelection="rowSelection"
      :scroll="{ y: 350 }"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <template
        v-for="(col, i) in [
          'listClearly',
          'explain',
          'formSort',
          'controlType',
          'listWhetherSort',
          'whetherRequired',
          'whetherSearch',
          'whetherReadOnly',
          'listDisplay',
          'controlDefaultvalue',
          'controlLength',
        ]"
        :slot="col"
        slot-scope="text, record"
      >
        <div
          v-if="~['listClearly', 'explain', 'controlDefaultvalue'].indexOf(col)"
          :key="col"
        >
          <a-input
            :key="col"
            style="margin: -5px 0;min-width: 120px;"
            :value="text"
            @change="
              (e) => handleChange(e.target.value, record.listClearly, col)
            "
          />
        </div>
        <div v-else-if="~['controlType'].indexOf(col)" :key="col">
          <a-select
            :key="col"
            style="margin: -5px 0;min-width: 100%;"
            :value="text"
            @change="(e) => handleChange(e, record.listClearly, col)"
          >
            <a-select-option
              v-for="(item, index) in controlType"
              :key="index"
              :value="item.value"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </div>
        <div v-else-if="~['controlLength', 'formSort'].indexOf(col)" :key="col">
          <a-input-number
            :key="col"
            style="margin: -5px 0;width: 100%;"
            required
            :value="text"
            @change="(e) => handleChange(e, record.listClearly, col)"
          />
        </div>
        <div v-else :key="col">
          <a-checkbox
            :key="col"
            style="margin: -5px 0"
            :checked="getCheckValue(text)"
            @change="
              (e) => handleChange(e.target.checked, record.listClearly, col)
            "
          ></a-checkbox>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "serial",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "字段名称",
    dataIndex: "listClearly",
    align: "center",
    scopedSlots: {
      customRender: "listClearly",
    },
  },
  {
    title: "注释",
    dataIndex: "explain",
    align: "center",
    scopedSlots: {
      customRender: "explain",
    },
  },
  {
    title: "控件类型",
    dataIndex: "controlType",
    align: "center",
    scopedSlots: {
      customRender: "controlType",
    },
  },
  {
    title: "控件长度",
    dataIndex: "controlLength",
    align: "center",
    scopedSlots: {
      customRender: "controlLength",
    },
  },
  {
    title: "控件默认值",
    dataIndex: "controlDefaultvalue",
    align: "center",
    scopedSlots: {
      customRender: "controlDefaultvalue",
    },
  },
  {
    title: "表单排序",
    dataIndex: "formSort",
    align: "center",
    scopedSlots: {
      customRender: "formSort",
    },
  },
  {
    title: "列表显示",
    dataIndex: "listDisplay",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "listDisplay",
    },
  },
  {
    title: "列表是否排序",
    dataIndex: "listWhetherSort",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "listWhetherSort",
    },
  },
  {
    title: "是否只读",
    dataIndex: "whetherReadOnly",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "whetherReadOnly",
    },
  },
  {
    title: "是否查询",
    dataIndex: "whetherSearch",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "whetherSearch",
    },
  },
  {
    title: "必填",
    dataIndex: "whetherRequired",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "whetherRequired",
    },
  },
];
export default {
  name: "UserForm",
  props: {
    data: {
      type: Array,
    },
  },
  data() {
    return {
      columns,
      formData: [],
      dataSource: [],
      controlType: [
        { text: "文本框", value: "textbox" },
        { text: "多行文本框", value: "textare" },
        { text: "数字框", value: "numberbox" },
        { text: "日期", value: "datetimebox" },
        { text: "日期时间", value: "datetime" },
        // { text:'时间', value:'time' },
        { text: "下拉框", value: "combobox" },
        { text: "下拉框多选", value: "comboTag" },
        // { text:'字典下拉框', value:'comboboxCode' },
        // { text:'级联', value:'cascader' },
        // { text:'树形下拉', value:'treeSelect' },
        // { text:'单选框', value:'radio' },
        // { text:'复选框', value:'checkbox' },
        // { text:'文件', value:'filebox' },
        // { text:'图片', value:'imgbox' },
        // { text:'评分', value:'star' },
        // { text:'富文本', value:'editor' },
        // { text:'开关', value:'switch' },
        // { text:'图标选择器', value:'icon' },
        // { text:'颜色选择器', value:'color' },
        // { text:'人员选择器', value:'userPoup' },
        // { text:'组织机构选择器', value:'department' },
        // { text:'省市区', value:'area' } ,
      ],
      selectedRowKeys: [],
    };
  },
  watch: {
    data(val) {
      this.dataSource = val;
      console.log(this.dataSource, "this.dataSource====");
    },
  },
  mounted() {
    this.dataSource = this.data;
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    getCheckValue(val) {
      return val ? JSON.parse(val) : false;
    },
    getDataListByProp() {
      return this.data;
    },
    onLoadData(data) {
      this.dataSource = data;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 组件值修改事件
    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      const target = newData.filter((item) => key === item.listClearly)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newData;
        this.$emit("changeRows", this.dataSource);
      }
    },
  },
};
</script>

<style scoped></style>
