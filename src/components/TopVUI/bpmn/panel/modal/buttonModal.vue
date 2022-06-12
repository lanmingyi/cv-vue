<!--
 * @Description: 流程按钮
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-02 17:00:26
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\modal\buttonModal.vue
-->
<template>
  <t-modal
    title="流程按钮"
    :width="640"
    :visible="visible"
    @ok="handleOk"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
	<div class="page-common-sub-box">
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      bordered
      :rowSelection="rowSelection"
      rowKey="uuid"
      showPagination="auto"
      @rowClick="rowClick"
			:scroll="scrollXY"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </s-table>
		</div>
  </t-modal>
</template>

<script>
import { STable, Ellipsis } from "@/components";

const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: { customRender: "serial" },
    fixed: "left",
  },
  {
    title: "名称",
    dataIndex: "buttonName",
    sorter: true,
    align: "center",
  },
  {
    title: "标识",
    dataIndex: "buttonCode",
    sorter: true,
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "buttonSort",
    sorter: true,
    align: "center",
  },
];
export default {
  name: "TableList",
  components: {
    STable,
    Ellipsis,
  },
  props: {
    visible: {
      type: Boolean,
    },
    btnList: {
      type: Array,
    },
  },
  data() {
    return {
      columns,
      mdl: null,
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(
          "/workflow/flowButton/getPageSet",
          requestParameters
        ).then((res) => {
          this.data = res.rows;
          this.data.forEach((e) => {
            this.btnList.forEach((m) => {
              if (m.nodeButtonCode === e.buttonCode + "") {
                this.selectedRows.push(e);
                this.selectedRowKeys.push(e.uuid);
              }
            });
          });
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      uuid: "",
      ids: "",
      data: "",
			subHeight: 0,
      // btnList:[]
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
		scrollXY(){
			let subHeight = this.subHeight ? this.subHeight : 500
			let height = subHeight - 40 - 40
			return { y : height};
		},
  },
  watch: {
    visible() {
      let selectedRows = [];
      let selectedRowKeys = [];
      if (this.data.length === 0) {
        return true;
      }
      this.data.forEach((e) => {
        this.btnList.forEach((m) => {
          if (m.nodeButtonCode === e.buttonCode) {
            selectedRows.push(e);
            selectedRowKeys.push(e.uuid);
          }
        });
      });
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
  },
  methods: {
    getBtnList(e) {
      // this.btnList = e
      // console.log(this.btnList,this.data)
      // if(this.data.length===0){ return true }
      // this.data.forEach(e=>{
      //   this.btnList.forEach(m=>{
      //     if(m.nodeButtonCode === e.buttonCode+''){
      //       this.selectedRows = []
      //       this.selectedRowKeys = []
      //       this.selectedRows.push(e)
      //       this.selectedRowKeys.push(e.uuid)
      //     }
      //   })
      // })
    },
    rowClick(record, index) {
      // 数据表格行点击事件
      this.selectedRows = [];
      this.selectedRows.push(record);
      this.selectedRowKeys = index;
    },
    // 表单提交
    handleOk() {
      if (!this.selectedRows || this.selectedRows.length == 0) {
        this.$message.warning("请选择一条数据");
        return true;
      }
      this.$emit("cancel");
      this.$emit("change", this.selectedRows);
    },
    // 勾选事件
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    // 重置
    reset() {
      this.queryParam = {};
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
