<template>
  <div>
    <tool-bar
      @search="$refs.table.refresh(true)"
      @reset="
        () => {
          (this.queryParam = {}), $refs.table.refresh(true);
        }
      "
    >
      <template slot="toolBtn" slot-scope="scope">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
          >新增</a-button
        >
      </template>
    </tool-bar>
    <a-table
      id="database-list"
      ref="tabel"
      size="small"
      :columns="columns"
      :dataSource="dataSource"
      bordered
      :pagination="false"
      :rowKey="(record, index) => index"
      :rowSelection="rowSelection"
      :scroll="{ y: 350 }"
      class="tab-table-bottom"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <template
        v-for="(col, i) in [
          'listClearly',
          'explain',
          'fieldType',
          'listClearlyLength',
          'whetherNull',
          'primaryKey',
          'parityBit',
          'listClearlyValue',
          'decimalPoint',
          'fieldDefaultvalue',
        ]"
        :slot="col"
        slot-scope="text, record"
      >
        <div
          v-if="
            ~[
              'listClearly',
              'explain',
              'listClearlyValue',
              'fieldDefaultvalue',
            ].indexOf(col)
          "
          :key="i"
        >
          <a-input
            :key="col"
            style="margin: -5px 0;width: 100%;"
            :value="text"
            @change="
              (e) => handleChange(e.target.value, record.listClearly, col)
            "
            @blur="
              (event) => {
                changeJavaType(event.target.value, record.listClearly, col);
              }
            "
          />
        </div>
        <div v-else-if="~['whetherNull', 'primaryKey'].indexOf(col)" :key="i">
          <a-checkbox
            :key="col"
            style="margin: -5px 0"
            :checked="getCheckValue(text)"
            @change="
              (e) => handleChange(e.target.checked, record.listClearly, col)
            "
          ></a-checkbox>
        </div>
        <div v-else-if="~['fieldType'].indexOf(col)" :key="i">
          <TDictSelectTag
            type="select"
            dictCode="mysqlFileType"
            :value="text"
            @change="(e) => handleChange(e, record.listClearly, col)"
          ></TDictSelectTag>
        </div>
        <div
          v-else-if="~['listClearlyLength', 'decimalPoint'].indexOf(col)"
          :key="i"
        >
          <a-input-number
            :key="col"
            :min="0"
            style="margin: -5px 0;width: 100%;"
            :value="text"
            @change="(e) => handleChange(e, record.listClearly, col)"
          />
        </div>
        <div v-else :key="i">
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
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a @click="() => remove(record.listClearly)">删除</a>
          </span>
        </div>
      </template>
    </a-table>
    <!-- <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">{{$t('newMember')}}</a-button> -->
  </div>
</template>

<script>
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import { camelCase } from "@/utils/index";
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
    title: "字段类型",
    dataIndex: "fieldType",
    align: "center",
    scopedSlots: {
      customRender: "fieldType",
    },
  },
  {
    title: "长度",
    dataIndex: "listClearlyLength",
    align: "center",
    scopedSlots: {
      customRender: "listClearlyLength",
    },
  },
  {
    title: "默认值",
    dataIndex: "fieldDefaultvalue",
    align: "center",
    scopedSlots: {
      customRender: "fieldDefaultvalue",
    },
  },
  {
    title: "小数点",
    dataIndex: "decimalPoint",
    align: "center",
    scopedSlots: {
      customRender: "decimalPoint",
    },
  },
  {
    title: "允许空值",
    dataIndex: "whetherNull",
    align: "center",
    scopedSlots: {
      customRender: "whetherNull",
    },
  },
  {
    title: "主键",
    dataIndex: "primaryKey",
    align: "center",
    scopedSlots: {
      customRender: "primaryKey",
    },
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 100,
    scopedSlots: {
      customRender: "action",
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
  components: { TDictSelectTag },
  data() {
    return {
      columns,
      formData: [],
      dataSource: [],
      fieldType: [
        { text: "varchar", value: "varchar" },
        { text: "int", value: "int" },
        { text: "timestamp", value: "timestamp" },
        { text: "datetime", value: "datetime" },
        { text: "text", value: "text" },
        { text: "tinyint", value: "tinyint" },
      ],
      selectedRowKeys: [],
      form: this.$form.createForm(this),
    };
  },
  watch: {
    data(val) {
      this.dataSource = val;
      console.log(this.dataSource);
    },
  },
  mounted() {},
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
      this.form.validateFields((errors, values) => {
        if (!errors) {
          console.log("no errors", values);
        } else {
          console.log("have errors", errors);
        }
      });
      // this.$emit('change',this.data)
      return this.data;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleSubmit(e) {
      e.preventDefault();
    },
    // 新增
    handleAdd() {
      let newData = {
        editable: true,
        isNew: true,
        code: null,
        controlDefaultvalue: null,
        controlLength: null,
        controlType: null,
        decimalPoint: null,
        dictionariesCode: null,
        explain: "",
        fieldDefaultvalue: null,
        fieldType: null,
        formDisplay: "false",
        formSort: null,
        formType: null,
        idField: "false",
        intLength: null,
        javaFiled: null,
        javaType: null,
        levelId: "false",
        listClearly: "",
        listClearlyLength: null,
        listDisplay: "false",
        listWhetherSort: "false",
        maximumLength: null,
        maximumValue: null,
        minimumLength: null,
        minimumValue: null,
        modifier: null,
        modifierId: null,
        modifyTime: null,
        parityBit: null,
        pid: "false",
        primaryKey: "false",
        puuid: "",
        required: "false",
        treeField: "false",
        uuid: "",
        validationRules: null,
        whetherNull: "false",
        whetherReadOnly: "false",
        whetherRequired: "false",
        whetherSearch: "false",
      };
      let currPosition = (this.dataSource.length + 1) * 50;
      this.dataSource.splice(this.dataSource.length + 1, 0, newData);
      document.querySelector(
        "#database-list .ant-table-fixed-header>.ant-table-content>.ant-table-scroll>.ant-table-body"
      ).scrollTop = currPosition;
      this.$emit("changeRows", this.dataSource);
    },
    // 删除
    remove(key) {
      const newData = this.dataSource.filter(
        (item) => item.listClearly !== key
      );
      this.dataSource = newData;
      this.$emit("changeRows", this.dataSource);
    },
    // 保存
    saveRow(key) {
      let target = this.dataSource.filter(
        (item) => item.listClearly === key
      )[0];
      target.editable = false;
      target.isNew = false;
      let targetIndex = this.dataSource.findIndex(
        (item) => item.listClearly === key
      );
      this.$set(this.dataSource, targetIndex, target);
    },
    toggle(key) {
      let target = this.dataSource.filter(
        (item) => item.listClearly === key
      )[0];
      let targetIndex = this.dataSource.findIndex(
        (item) => item.listClearly === key
      );
      target.editable = !target.editable;
      this.$set(this.dataSource, targetIndex, target);
    },
    getRowByKey(key, newData) {
      const data = this.dataSource;
      return (newData || data).filter((item) => item.listClearly === key)[0];
    },
    // 取消
    cancle(key) {
      let target = this.dataSource.filter(
        (item) => item.listClearly === key
      )[0];
      target.editable = false;
      let targetIndex = this.dataSource.findIndex(
        (item) => item.listClearly === key
      );
      this.$set(this.dataSource, targetIndex, target);
    },
    // 修改
    handleChange(value, key, column) {
      console.log(value);
      const newData = [...this.dataSource];
      const target = newData.filter((item) => key === item.listClearly)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newData;
        this.$emit("changeRows", this.dataSource);
      }
    },
    // java字段驼峰命名
    changeJavaType(value, key, column) {
      console.log(value, key, column);
      if (column === "listClearly") {
        console.log(value, key, column);
        const newData = [...this.dataSource];
        const target = newData.filter((item) => key === item.listClearly)[0];
        console.log(target);
        if (target) {
          target.javaFiled = camelCase(target.listClearly);
          target[column] = value;
          this.dataSource = newData;
          this.$emit("changeRows", this.dataSource);
        }
      }
    },
  },
};
</script>

<style scoped="scoped">
/* /deep/.tab-table-bottom .ant-table-tbody>tr>td{
	padding: 0 !important;
}
/deep/.tab-form-list .ant-form-item{
	margin: 0 !important;
} */
</style>
