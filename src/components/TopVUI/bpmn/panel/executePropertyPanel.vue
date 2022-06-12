<!--
 * @Description: 监听器
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-04 15:33:52
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\executePropertyPanel.vue
-->
<template>
  <t-modal
    title="新增编辑"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @ok="ok"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
      <div class="table-operator">
        <a-button
          class="cu-btn-success margin-right-sm"
          icon="plus"
          @click="handleAdd"
          >新增</a-button
        >
        <a-button
          class="cu-btn-primary margin-right-sm"
          icon="edit"
          @click="handleEdit('all')"
          >编辑</a-button
        >
        <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')"
          >删除</a-button
        >
      </div>
    </div>
		<div class="page-common-sub-box" style="padding-bottom: 45px;">
			<a-table
				bordered
				ref="table"
				size="small"
				:columns="columns"
				:data-source="data"
				:rowSelection="rowSelection"
				:pageSize="10"
				:rowKey="(record, index) => index"
				showPagination="auto"
				:customRow="rowClick"
				:rowClassName="rowClassName"
				:scroll="scrollXY"
			>
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<span slot="graduationDate" slot-scope="text, record, index">
					<a-button @click="handleConfig(record, index)">配置参数</a-button>
				</span>
				<span slot="operation" slot-scope="record, index">
					<template>
						<a @click="handleSub(record, index)">删除</a>
					</template>
				</span>
			</a-table>
		</div>
    <add-form
      ref="createModal"
      :visible="visibleEdit"
      :type="type"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
    <executrParam
      ref="executrParamList"
      :visible="executrParams"
      @cancel="paramsHandleCancel"
      @ok="paramsHandleOk"
    ></executrParam>
  </t-modal>
</template>
<script>
import moment from "moment";
import { STable } from "@/components";
import { getPageSet } from "@/services/common.js";
import addForm from "./modal/edit.vue";
import executrParam from "./modal/executrParam.vue";
import { simpleListMixin } from "@/mixins/simpleListMixin.js";

const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "事件",
    dataIndex: "event",
  },
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "java类名",
    dataIndex: "className",
  },
  {
    title: "参数",
    dataIndex: "graduationDate",
    scopedSlots: { customRender: "graduationDate" },
    sorter: true,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: {
      customRender: "operation",
    },
  },
];
export default {
  name: "education",
  mixins: [simpleListMixin],
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
    executionListener: {
      type: Array,
    },
    taskListener: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  components: {
    STable,
    addForm,
    executrParam,
  },
  data() {
    this.columns = columns;
    return {
      visibleEdit: false,
      confirmLoading: false,
      mdl: null,
      advanced: false,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      uuid: "",
      uuids: "",
      url: {
        getPageSet: "/workflow/actDeModel/getPageSet",
        save: "/workflow/actDeModel/save",
        update: "/workflow/actDeModel/update",
        deleteBatch: "/workflow/actDeModel/deleteBatch",
      },
      data: [],
      type: 0,
      executrParams: false,
      nowIndex: null,
      info: "",
			subHeight: 0
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
  mounted() {
    this.getData();
  },
	created() {
		this.$nextTick(()=>{
			this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
		})
	},
  methods: {
    rowClassName(row) {
      return row.uuid === this.info?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 配置时获取数据
    getData(e) {
      this.type = e;
      if (this.type === 1) {
        this.data = this.executionListener;
      } else {
        this.data = this.taskListener;
      }
    },
    // 刷新
    refreshList(e) {
      this.$refs.table.refresh();
    },
    // 行点击
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.info = record;
            console.log(that.info);
          },
        },
      };
    },
    // 新增
    handleAdd() {
      this.visibleEdit = true;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    // 编辑
    handleEdit() {
      console.log(111111);
      if (!this.info) {
        this.$message.info("请选择需要操作的数据");
        return true;
      } else {
        this.mdl = this.info;
        this.visibleEdit = true;
      }
    },
    // 配置参数
    handleConfig(e, index) {
      this.executrParams = true;
      this.nowIndex = index;
      let nowObj = [];
      if (this.type === 1) {
        nowObj = this.executionListener[index];
      } else {
        nowObj = this.taskListener[index];
      }
      if (!nowObj.params) {
        nowObj.params = [];
      }
      this.$refs.executrParamList.fetch(nowObj.params);
    },
    // 取消
    handleCancel() {
      this.visibleEdit = false;
    },
    // 删除
    handleSub(e, index) {
      this.data.splice(index, 1);
    },
    // 表单提交
    handleOk() {
      this.visibleEdit = false;
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log(values);
          this.confirmLoading = false;
          this.data.push(values);
        } else {
          this.confirmLoading = false;
        }
      });
    },
    ok() {
      this.$emit("addExecute", this.data, this.type);
    },
    // 表单提交
    paramsHandleOk(param) {
      this.executrParams = false;
      let cache = [];
      if (this.type === 1) {
        cache = this.executionListener[this.nowIndex];
        cache.params = param;
        this.$set(this.executionListener[this.nowIndex], this.nowIndex, cache);
      } else {
        cache = this.taskListener[this.nowIndex];
        cache.params = param;
        this.$set(this.taskListener[this.nowIndex], this.nowIndex, cache);
      }
      this.nowIndex = null;
    },
    paramsHandleCancel() {
      this.executrParams = false;
    },
  },
};
</script>

<style lang="less"></style>
