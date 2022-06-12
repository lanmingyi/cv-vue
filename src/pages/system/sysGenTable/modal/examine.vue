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
          'dictionariesCode',
          'validationRules',
        ]"
        :slot="col"
        slot-scope="text, record"
      >
        <div v-if="~['listClearly', 'explain'].indexOf(col)">
          <a-input
            :key="col"
            style="margin: -5px 0;width: 100%;"
            :value="text"
            @change="
              (e) => handleChange(e.target.value, record.listClearly, col)
            "
          />
        </div>
        <div v-else-if="~['dictionariesCode'].indexOf(col)">
          <a-select
            show-search
            :key="col"
            style="margin: -5px 0;width: 100%;"
            :value="text"
            allowClear
            @change="(e) => handleChange(e, record.listClearly, col)"
          >
            <a-select-option
              v-for="(item, index) in dicSetCodeLists"
              :key="index"
              :value="item.code"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </div>
        <div v-else-if="~['validationRules'].indexOf(col)">
          <a-select
            :key="col"
            style="margin: -5px 0;width: 100%;"
            :value="text"
            @change="(e) => handleChange(e, record.listClearly, col)"
          >
            <a-select-option
              v-for="(item, index) in validationList"
              :key="index"
              :value="item.value"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </div>
        <div v-else>
          <a-checkbox
            :key="col"
            style="margin: -5px 0"
            :checked="getCheckValue(text)"
            @change="
              (e) => handleChange(e.target.checked, record.listClearly, col)
            "
          />
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
  // {
  // 	title: '字段href',
  // 	dataIndex: 'formType',
  // 	align: 'center',
  // 	scopedSlots: {
  // 		customRender: 'formType'
  // 	}
  // },
  {
    title: "验证规则",
    dataIndex: "validationRules",
    align: "center",
    scopedSlots: {
      customRender: "validationRules",
    },
  },
  {
    title: "字典code",
    dataIndex: "dictionariesCode",
    align: "center",
    scopedSlots: {
      customRender: "dictionariesCode",
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
      form: this.$form.createForm(this),
      formData: [],
      dataSource: [],
      formType: [
        { text: "textbox", value: "textbox" },
        { text: "numberbox", value: "numberbox" },
        { text: "datetimebox", value: "datetimebox" },
        { text: "datetime", value: "datetime" },
        { text: "text", value: "text" },
        { text: "tinyint", value: "tinyint" },
      ],
      selectedRowKeys: [],
      validationList: [
        { text: "无", value: "0" },
        {
          text: "邮箱",
          value: "/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/",
        },
        // { text:'url', value: /^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$/ },
        {
          text: "手机号",
          value:
            "/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/",
        },
        // { text:'电话号码', value:/^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$/ },
        { text: "身份证", value: "/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/" },
        { text: "邮政编码", value: "/[1-9]\d{5}(?!\d)/" },
        { text: "6到18个字符之间", value: "/^.{6,18}$/" },
        { text: "字母", value: "/^[A-Za-z]+$/" },
        { text: "包含字母，数字，下划线和横线", value: "/^\w+$/" },
        { text: "包含字母，数字", value: "/^[A-Za-z0-9]+$/" },
        { text: "日期格式", value: "/^\d{4}-\d{1,2}-\d{1,2}/" },
      ],
      dicSetCodeList: [],
      dicSetCodeLists: [],
      codeTxt: "",
    };
  },
  watch: {
    data(val) {
      this.dataSource = val;
    },
  },
  mounted() {
    this.dataSource = this.data;
    this.getDicSetCode();
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  watch: {
    dicSetCodeList: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal);
        this.dicSetCodeLists = newVal;
      },
    },
  },
  methods: {
    getDicSetCode() {
      this.$post("/system/dicSet/selectAll", { text: this.codeTxt }).then(
        (res) => {
          this.dicSetCodeList = res;
        }
      );
    },
    handleSearch(val) {
      this.codeTxt = val;
      console.log(val);
      this.getDicSetCode();
    },
    getCheckValue(val) {
      return val ? JSON.parse(val) : false;
    },
    getDataListByProp() {
      return this.data;
    },
    onLoadData(data) {
      this.dataSource = data;
      console.log(this.dataSource);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getDataList(val) {
      this.dataSource = val;
    },
    // 组件值改变事件
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
