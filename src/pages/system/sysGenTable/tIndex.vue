<template>
  <div>
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button class="cu-btn-primary" icon="plus" @click="add()"
            >新增</a-button
          >
          <a-button class="cu-btn-default" icon="edit" @click="updateData()"
            >编辑</a-button
          >
          <a-button
            class="cu-btn-orange"
            icon="vertical-align-bottom"
            @click="databaseImportTable()"
            >数据库导入表</a-button
          >
          <a-button
            class="cu-btn-brown"
            icon="border-inner"
            @click="singleTableGenerationCode()"
            >单表生成代码</a-button
          >
          <a-button
            class="cu-btn-olive"
            icon="deployment-unit"
            @click="mainsubTableGenerationCode()"
            >主子表生成代码</a-button
          >
          <a-button
            class="cu-btn-maroon"
            icon="pull-request"
            @click="synchronization()"
            >同步数据库</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all', 'master')"
            >移除</a-button
          >
        </div>
        <div class="table-operator">
          <a-input-search
            placeholder="请输入表名进行搜索"
            enter-button
            @search="onSearch"
            style="margin-left: 16px; width: 272px;"
          />
        </div>
      </div>
      <s-table
        ref="masterList"
        size="small"
        :columns="columns"
        :data="loadData"
        bordered
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        @rowClick="click"
        :rowClassName="rowClassName"
      >
        <span slot="action" slot-scope="record">
          <template>
            <a
              @click="
                () => {
                  visibleDetail = true;
                }
              "
              >修改</a
            >
            <a-divider type="vertical" />
            <a
              @click="
                () => {
                  visibleDetail = true;
                }
              "
              >同步数据库</a
            >
          </template>
        </span>
      </s-table>
      <!--单表代码-->
      <datagrid-modal
        ref="datagridModal"
        :loading="confirmLoading"
        :puuid="puuid"
        :visible="datagridVisible"
        @handleCancel="handleCancel"
        @ok="handleSubmit"
      />
      <!--主子表代码-->
      <masterson-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel2"
        @ok="handleOk"
        :customRow="rowClick"
      />
      <!--数据库导入表-->
      <generated-modal
        ref="generatedModal"
        :visible="generatedVisible"
        :loading="confirmLoading"
        @cancel="createCancel(0)"
        @ok="generatedOk"
      />
      <!--同步数据库-->
      <syn-model
        :model="mdl"
        :visible="synchronizationVisible"
        :loading="confirmLoading"
        @cancel="synchronizationCancel(0)"
        @ok="handleOk"
      />
      <!--更新数据库-->
      <updatedata-model
        ref="updateDataModal"
        :visible="updateDataVisible"
        :loading="updateDataConfirmLoading"
        @cancel="updateDataCancel(0)"
        @ok="updateDataOk"
        :model="mdl"
        :sqlFileTypeList="sqlFileTypeList"
        :javaFileTypeList="javaFileTypeList"
        :topjuiFileTypeList="topjuiFileTypeList"
        :topjuiValiTypeList="topjuiValiTypeList"
        :codeList="codeList"
      />
    </a-card>
    <!-- <a-card :bordered="false">
			<a-tabs>
				<a-tab-pane tab="字段信息">
					
					<a-table ref="subList" size="small" :columns="columnsDicItem" :data-source="dataSource" bordered :scroll="{ x: 2200 }"
						:pageSize="10" rowKey="uuid"o"
						:rowSelection="rowSelection">
					</a-table>
				</a-tab-pane>
			</a-tabs>
		</a-card> -->
  </div>
</template>
<script>
import { STable, Ellipsis } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import mastersonForm from "./masterson.vue";
import generatedModal from "./databaseImportTable.vue";
import datagridModal from "./datagridModal";
import synModel from "./synchronization";
import updatedataModel from "./updatedata";

var uuid = "";
const columns = [
  {
    title: "表类型",
    dataIndex: "tableType",
    align: "center",
    width: 100,
  },
  {
    title: "表名",
    dataIndex: "tableName",
    align: "center",
    width: 200,
  },
  {
    title: "来自数据库",
    dataIndex: "database",
    align: "center",
    width: 200,
  },
  {
    title: "类名",
    dataIndex: "className",
    align: "center",
    width: 200,
  },
  {
    title: "是否同步数据库",
    dataIndex: "synchronizeDatabase",
    align: "center",
    width: 120,
  },
  {
    title: "说明",
    dataIndex: "notes",
    align: "center",
    width: 300,
  },
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   scopedSlots: {
  //     customRender: 'action'
  //   }
  // }
];
const columnsDicItem = [
  {
    title: "列名",
    dataIndex: "listClearly",
    align: "center",
  },
  {
    title: "注释",
    dataIndex: "explain",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "fieldType",
    align: "center",
  },
  {
    title: "长度",
    dataIndex: "listClearlyLength",
    align: "center",
  },
  {
    title: "是否null",
    dataIndex: "whetherNull",
    align: "center",
  },
  {
    title: "主键",
    dataIndex: "primaryKey",
    align: "center",
  },
  {
    title: "Java类型",
    dataIndex: "javaType",
    align: "center",
  },
  {
    title: "Java字段名称",
    dataIndex: "javaFiled",
    align: "center",
  },
  {
    title: "表单显示",
    dataIndex: "formDisplay",
    align: "center",
  },
  {
    title: "显示表单类型",
    dataIndex: "formType",
    align: "center",
  },
  {
    title: "表单排序",
    dataIndex: "formSort",
    align: "center",
  },
  {
    title: "字典集代码",
    dataIndex: "code",
    align: "center",
  },
  {
    title: "是否必填",
    dataIndex: "required",
    align: "center",
  },
  {
    title: "校验类型",
    dataIndex: "parityBit",
    align: "center",
  },
  {
    title: "最小值",
    dataIndex: "maximumValue",
    align: "center",
  },
  {
    title: "最大值",
    dataIndex: "minimumValue",
    align: "center",
  },
  {
    title: "是否idField",
    dataIndex: "idField",
    align: "center",
  },
  {
    title: "是否treeFiled",
    dataIndex: "treeField",
    align: "center",
  },
  {
    title: "是否levelId",
    dataIndex: "levelId",
    align: "center",
  },
  {
    title: "是否pid",
    dataIndex: "pid",
    align: "center",
  },
];

export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    Ellipsis,
    datagridModal,
    mastersonForm,
    generatedModal,
    synModel,
    updatedataModel,
  },
  data() {
    this.columns = columns;
    this.columnsDicItem = columnsDicItem;
    return {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showLessItems: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total) => `共有 ${total} 条数据`,
      },
      data: [],
      confirmLoading: false,
      updateDataConfirmLoading: false,
      generatedVisible: false,
      synchronizationVisible: false,
      updateDataVisible: false,
      mdl: null,
      puuid: "",
      masterUuids: "",
      selectedRowKeys: [],
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      queryParam: {},
      queryParamDicItem: {},
      url: {
        masterList: "/system/sysGenTable/getPageSet",
        deleteBatch: "/system/sysGenTable/deleteBatch",
        attachedList: "/system/sysGenFiled/getPageSet",
        masterDelete: "/system/sysGenTable/deleteBatch",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
        getCode: "/system/sysGenFiled/getCode",
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.masterList, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      loadDataDicItem: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.queryParamDicItem
        );
        return this.$post(this.url.attachedList, requestParameters).then(
          (res) => {
            let obj = {};
            obj = {
              pageNo: 1,
              pageSize: 20,
              rows: res,
              totalCount: 2,
              totalPage: 1,
            };
            return obj;
          }
        );
      },
      datagridVisible: false,
      loading: false,
      visible: false,
      tableIndex: 0,
      form: this.$form.createForm(this),
      info: "",
      uuid: "",
      arr: [],
      sqlFileTypeList: [],
      javaFileTypeList: [],
      topjuiFileTypeList: [],
      topjuiValiTypeList: [],
      codeList: [],
      dataSource: [],
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
  },
  mounted() {
    this.getCodeList();
  },
  methods: {
    rowClassName(row) {
      return row.uuid === this.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    click(record, index) {
      this.mdl = record;
      this.tableIndex = index;
      this.uuid = record.uuid;
      this.queryParamDicItem.puuid = this.uuid;
      // this.$refs.subList.refresh()
      this.getSubData();
    },
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.info = record;
          },
        },
      };
    },
    getSubData() {
      console.log("this.mdl.uuid", this.mdl.uuid);
      this.$post(this.url.attachedList, { puuid: this.mdl.uuid }).then(
        (res) => {
          this.dataSource = res;
          this.dataSource.forEach((e) => {
            e.editable = true;
            // e.isNew= true
          });
        }
      );
    },
    getData() {
      this.$axios("GET", this.url.masterList).then((res) => {
        const pagination = { ...this.pagination };
        pagination.total = res.totalCount;
        this.pagination = pagination;
        this.data = res.rows;
      });
    },
    singleTableGenerationCode() {
      console.log("this.mdl", this.mdl);
      if (this.mdl) {
        if (!this.mdl.tableType) {
          this.$message.info("请先修改表类型");
        } else if (this.mdl.synchronizeDatabase == "否") {
          this.$message.info("请先同步数据库");
        } else {
          this.datagridVisible = true;
          this.$refs.datagridModal.add(this.mdl);
        }
      } else {
        this.$message.info("请先选择一条数据");
      }
      // if (this.uuid === '') {
      // 	this.$message.error('请先选择一条数据')
      // } else {
      // 	this.puuid = this.uuid
      // 	this.datagridVisible = true
      // }
    },
    // removeData() {
    // 	if (this.uuid === '') {
    // 		this.$message.error('请先勾选至少一条数据')
    // 	}
    // 	this.$post(this.url.deleteBatch, {
    // 		uuid: this.uuid
    // 	}).then((res) => {
    // 		if (res.statusCode === 200) {
    // 			this.$refs.masterList.refresh()
    // 			this.$message.success(res.message)
    // 		} else {
    // 			this.$message.error(res.message)
    // 		}
    // 	})
    // },
    add() {
      let form = {};
      this.updateDataVisible = true;
      this.$refs.updateDataModal.add(this.mdl);
      form = this.$refs.updateDataModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    onSearch(value) {
      this.queryParam = {
        tableName: value,
      };
      this.$refs.masterList.refresh();
    },
    handleSubmit() {
      this.getData();
      this.datagridVisible = false;
      this.$refs.masterList.refresh();
    },
    handleCancel() {
      this.datagridVisible = false;
    },
    mainsubTableGenerationCode() {
      // this.mdl = null
      this.visible = true;
      this.$refs.createModal.openEdit();
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
        }
      });
      this.$refs.masterList.refresh();
    },
    generatedOk() {
      console.log("返回国");
      this.$refs.masterList.refresh();
    },
    updateDataOk() {
      this.updateDataVisible = false;
      this.dataSource = [];
      this.$refs.masterList.refresh();
      this.getSubData();
    },
    handleCancel2() {
      this.visible = false;
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    databaseImportTable() {
      this.generatedVisible = true;
      this.$refs.generatedModal.onLoad();
    },
    synchronization() {
      if (this.uuid === "") {
        this.$message.error("请勾选一条数据");
        return;
      }
      this.puuid = this.uuid;
      this.synchronizationVisible = true;
    },
    createCancel(type) {
      this.generatedVisible = false;
    },
    synchronizationCancel(type) {
      this.synchronizationVisible = false;
      this.$refs.masterList.refresh();
    },
    updateData() {
      if (this.uuid === "") {
        this.$message.error("请选中一条数据");
      } else {
        this.updateDataVisible = true;
        this.$refs.updateDataModal.onLoad(this.mdl);
      }
    },
    updateDataCancel(type) {
      this.updateDataVisible = false;
      console.log("this.mdl", this.mdl, "走到这里了吗");
    },
    getCodeList() {
      // 获取会议类型
      this.$post(this.url.getDicItemByCode, {
        code: "mysqlFileType",
      }).then((res) => {
        if (res.statusCode != "300") {
          this.sqlFileTypeList = res;
        }
      });
      // 申请状态
      this.$post(this.url.getDicItemByCode, {
        code: "javaFileType",
      }).then((res) => {
        if (res.statusCode != "300") {
          this.javaFileTypeList = res;
        }
      });
      // 获取会议类型
      this.$post(this.url.getDicItemByCode, {
        code: "topjuiFileType",
      }).then((res) => {
        if (res.statusCode != "300") {
          this.topjuiFileTypeList = res;
        }
      });
      // 申请状态
      this.$post(this.url.getDicItemByCode, {
        code: "topjuiValiType",
      }).then((res) => {
        if (res.statusCode != "300") {
          this.topjuiValiTypeList = res;
        }
      });
      this.$post(this.url.getCode).then((res) => {
        if (res.statusCode != "300") {
          this.codeList = res;
        }
      });
    },
  },
};
</script>
