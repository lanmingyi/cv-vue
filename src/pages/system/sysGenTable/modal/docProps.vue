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
    title: "??????",
    dataIndex: "serial",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "????????????",
    dataIndex: "listClearly",
    align: "center",
    scopedSlots: {
      customRender: "listClearly",
    },
  },
  {
    title: "??????",
    dataIndex: "explain",
    align: "center",
    scopedSlots: {
      customRender: "explain",
    },
  },
  {
    title: "????????????",
    dataIndex: "controlType",
    align: "center",
    scopedSlots: {
      customRender: "controlType",
    },
  },
  {
    title: "????????????",
    dataIndex: "controlLength",
    align: "center",
    scopedSlots: {
      customRender: "controlLength",
    },
  },
  {
    title: "???????????????",
    dataIndex: "controlDefaultvalue",
    align: "center",
    scopedSlots: {
      customRender: "controlDefaultvalue",
    },
  },
  {
    title: "????????????",
    dataIndex: "formSort",
    align: "center",
    scopedSlots: {
      customRender: "formSort",
    },
  },
  {
    title: "????????????",
    dataIndex: "listDisplay",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "listDisplay",
    },
  },
  {
    title: "??????????????????",
    dataIndex: "listWhetherSort",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "listWhetherSort",
    },
  },
  {
    title: "????????????",
    dataIndex: "whetherReadOnly",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "whetherReadOnly",
    },
  },
  {
    title: "????????????",
    dataIndex: "whetherSearch",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "whetherSearch",
    },
  },
  {
    title: "??????",
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
        { text: "?????????", value: "textbox" },
        { text: "???????????????", value: "textare" },
        { text: "?????????", value: "numberbox" },
        { text: "??????", value: "datetimebox" },
        { text: "????????????", value: "datetime" },
        // { text:'??????', value:'time' },
        { text: "?????????", value: "combobox" },
        { text: "???????????????", value: "comboTag" },
        // { text:'???????????????', value:'comboboxCode' },
        // { text:'??????', value:'cascader' },
        // { text:'????????????', value:'treeSelect' },
        // { text:'?????????', value:'radio' },
        // { text:'?????????', value:'checkbox' },
        // { text:'??????', value:'filebox' },
        // { text:'??????', value:'imgbox' },
        // { text:'??????', value:'star' },
        // { text:'?????????', value:'editor' },
        // { text:'??????', value:'switch' },
        // { text:'???????????????', value:'icon' },
        // { text:'???????????????', value:'color' },
        // { text:'???????????????', value:'userPoup' },
        // { text:'?????????????????????', value:'department' },
        // { text:'?????????', value:'area' } ,
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
    // ?????????????????????
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
