<template>
  <div>
    <t-modal
      title="用户信息"
      :width="1200"
      :visible="visible"
      :confirmLoading="confirmLoading"
      switchFullscreen
      wrapClassName="t-popup-modal"
      @ok="handleSubmit"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-card :bordered="false">
        <div
          class="table-operator flex justify-between flex-wrap"
          style="width: 100%;"
        >
          <div class="table-page-search-wrapper">
            <a-form layout="inline" :form="form">
              <div class="flex justify-between flex-wrap">
                <a-form-item>
                  <tree-select
                    style="width: 200px;"
                    v-model="queryParam.orgName"
                    :treeValueText="queryParam.orgName"
                    placeholder="组织机构"
                    :parameter="parameter"
                    :url="url"
                    :data="treeData"
                    idfield="id"
                    textfield="text"
                    @change="select"
                  />
                </a-form-item>
                <a-form-item label="">
                  <a-input
                    v-model="queryParam.userNameId"
                    :max-length="11"
                    placeholder="工号"
                  />
                </a-form-item>
                <a-form-item label="">
                  <a-input
                    v-model="queryParam.userName"
                    :max-length="11"
                    placeholder="姓名"
                  />
                </a-form-item>
                <div class="table-page-search-submitButtons flex">
                  <a-button
                    class="cu-btn-primary"
                    type="primary"
                    @click="$refs.table.refresh(true)"
                    >查询</a-button
                  >
                  <a-button class="cu-btn-filter" @click="refreshParams"
                    >重置</a-button
                  >
                </div>
              </div>
            </a-form>
          </div>
        </div>
				<div class="page-common-sub-box">
					<s-table
						ref="table"
						size="small"
						:columns="columns"
						:data="loadData"
						bordered
						:rowSelection="rowSelection"
						rowKey="uuid"
						showPagination="auto"
						@rowClick="rowClick"
						:pageSize="10"
					>
						<span slot="serial" slot-scope="text, record, index">
							{{ index + 1 }}
						</span>
						<span slot="status" slot-scope="text">
							{{ text | statusFilter }}
						</span>
					</s-table>
				</div>
      </a-card>
    </t-modal>
  </div>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";

import { triggerWindowResizeEvent } from "@/utils/util";
import TreeSelect from "./TreeSelect";
const columns = [
  {
    title: "#",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
    fixed: "left",
  },
  {
    title: "工号",
    align: "center",
    width: 300,
    dataIndex: "userNameId",
  },
  {
    title: "姓名",
    align: "center",
    dataIndex: "userName",
  },
  {
    title: "性别",
    align: "center",
    dataIndex: "sex",
    scopedSlots: {
      customRender: "sex",
    },
    sorter: true,
  },
  {
    title: "专业",
    align: "center",
    dataIndex: "major",
    sorter: true,
  },
  {
    title: "学历",
    align: "center",
    dataIndex: "education",
    sorter: true,
  },
  {
    title: "状态",
    align: "center",
    dataIndex: "status",
    scopedSlots: {
      customRender: "status",
    },
    sorter: true,
  },
];
export default {
  name: "transferPopup",
  components: {
    STable,
    Ellipsis,
    TreeSelect,
  },
  props: {
    code: {
      type: String,
      default: "",
      required: false,
    },
    field: {
      type: String,
      default: "",
      required: false,
    },
    orgFields: {
      type: String,
      default: "",
      required: false,
    },
    destFields: {
      type: String,
      default: "",
      required: false,
    },
    width: {
      type: Number,
      default: 1200,
      required: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    triggerChange: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    multi: {
      type: Boolean,
      required: false,
      default: false,
    },
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    /** 分组ID，用于将多个popup的请求合并到一起，不传不分组 */
    groupId: String,
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        selectedRowKeys: this.selectedRowKeys,
        // onSelectAll: this.onSelectAll,
        type: "radio",
      };
    },
  },
  data() {
    this.columns = columns;
    return {
      title: "",
      showText: "",
      confirmLoading: false,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        pageSize: 10,
      },
      modalWidth: 800,
      url: {
        getUserList: "/mdata/user/getPageSet",
        // fathersUrl: '/system/menu/getListByLevelId',
        // expandUrl: '/system/menu/getListByPid',
        fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
        expandUrl: "/mdata/organization/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return this.$post(
          this.url.getUserList,
          Object.assign(parameter, this.queryParam)
        ).then((res) => {
          return res;
        });
      },
      form: this.$form.createForm(this),
      selectedRowKeys: [],
      selectedRows: [],
      optionAlertShow: false,
      selectedRowsList: [],
      treeData: [],
    };
  },
  created() {
    // this.queryParam.forEach(v => this.form.getFieldDecorator(v))
    triggerWindowResizeEvent();
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "离职",
        1: "在职",
      };
      return statusMap[status];
    },
  },
  methods: {
    // 解决分页全选 获取选中的数据
    // onSelectAll (selected, selectedRows, changeRows) {
    //   this.selectedRowsList = this.selectedRowsList.concat(selectedRows)
    //   if (!selected) {
    //     let selectionsRows = []
    //     this.selectedRowsList.forEach((e, index) => {
    //       if (JSON.stringify(changeRows).indexOf(JSON.stringify(e.uuid)) === -1) {
    //         selectionsRows.push(e)
    //       }
    //     })
    //     this.selectedRowsList = selectionsRows
    //   }
    // },
    // show(){
    //   this.visible = true;
    // },
    resTable(m) {
      this.$nextTick(() => {
        this.selectedRows = [];
        this.selectedRowKeys = [];
        this.queryParam.orgId = m ? m.orgId : "";
        this.$refs.table.refresh();
      });
    },
    rowClick(record, row) {
      // 数据表格行点击事件
      this.selectedRows = [];
      this.selectedRows.push(record);
      this.selectedRowKeys = row;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    resetSearchForm() {
      this.queryParam = {
        pageSize: 10,
      };
    },
    handleCancel() {
      this.close();
    },
    openModal() {
      this.visible = true;
    },
    handleEmpty() {
      this.showText = "";
      const destFieldsArr = this.destFields.split(",");
      if (destFieldsArr.length === 0) {
        return;
      }
      const res = {};
      for (let i = 0; i < destFieldsArr.length; i++) {
        res[destFieldsArr[i]] = "";
      }
      if (this.triggerChange) {
        this.$emit("callback", res);
      } else {
        this.$emit("input", "", res);
      }
    },
    handleSubmit() {
      if (!this.multi) {
        if (this.selectedRows && this.selectedRows.length > 1) {
          this.$message.warning("请选择一条记录");
          return false;
        }
      }
      if (!this.selectedRows || this.selectedRows.length == 0) {
        this.$message.warning("请选择一条记录");
        return false;
      }
      const field = this.field;
      this.showText = this.selectedRows[0].userName;
      const res = this.selectedRows[0];
      this.$emit("input", this.showText, res);
      this.close();
    },
    close() {
      this.$emit("close");
    },
    select(value, node) {
      this.queryParam.orgId = "";
      this.queryParam.orgName = "";
      this.$nextTick(() => {
        this.queryParam.orgId = value;
        this.queryParam.orgName = node ? node.toString() : "";
      });
    },
    refreshParams() {
      this.queryParam = {};
      this.$refs.table.refresh();
    },
  },
};
</script>
