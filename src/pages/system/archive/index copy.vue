<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-sider width="300" style="" class="layout-box">
        <tree-grid
          ref="masterList"
          :columns="columns"
          rowKey="uuid"
          :url="url"
          :parameter="parameter"
          @rowClick="masterRowClick"
        ></tree-grid>
      </a-layout-sider>
      <a-layout-content style="padding-left: 20px;" class="layout-box">
        <div
          class="toolbar flex justify-between flex-wrap"
          style="width: 100%;"
        >
          <div class="table-operator">
            <a-button
              class="cu-btn-primary"
              icon="plus"
              @click="handleAdd('1', $refs.masterList.getListData(), 'sub')"
              >新增</a-button
            >
            <a-button
              class="cu-btn-default"
              icon="edit"
              @click="handleEdit('all', $refs.masterList.getListData(), 'sub')"
              >编辑</a-button
            >
            <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub('all', 'sub')"
              >删除</a-button
            >
          </div>
        </div>
        <s-table
          ref="subList"
          size="small"
          :columns="columnsDicItem"
          :data="loadDataDicItem"
          bordered
          :rowSelection="subRowSelection"
          rowKey="uuid"
          showPagination="auto"
          @rowClick="subRowClick"
          :rowClassName="rowClassNameDic"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
        </s-table>
        <editDic-form
          ref="subModal"
          :visible="subVisible"
          :loading="subConfirmLoading"
          :model="subMdl"
          @cancel="handleCancel('sub')"
          @ok="handleOk('sub')"
        />
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="附件信息">
            <Accessory
              ref="accessoryList"
              :paramList="queryParamAccessory"
              :url="fileUrl"
              fileType="local"
            ></Accessory>
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>
<script>
import { TreeGrid } from "@/components";
import { STable } from "@/components";

import editDicForm from "./edit.vue";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import Accessory from "@/components/TopVUI/accessory/index";
const columns = [
  {
    title: "分类名称",
    dataIndex: "text",
  },
];
const columnsDicItem = [
  {
    title: "#",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "资源名称",
    dataIndex: "title",
    ellipsis: true,
  },
];
export default {
  mixins: [treeGridMixin],
  components: { STable, editDicForm, TreeGrid, Accessory },
  data() {
    return {
      columns,
      columnsDicItem,
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      subQueryParam: {},
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      subSelectedRowKeys: [],
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      url: {
        fathersUrl: "/system/channel/getChannelsByPid",
        expandUrl: "/system/channel/getChannelsByPid",
        subList: "/system/archive/getPageSetData",
        subSave: "/system/archive/save",
        subUpdate: "/system/archive/update",
        subDelete: "/system/archive/delete",
        deleteAttachment: "/system/attachment/delete",
        getDetailByUuid: "/system/attachment/getListByPuuid",
      },
      fileUrl: {
        webUpload: "/system/attachment/upload",
        getPageSet: "/system/attachment/getListByPuuid",
        deleteBatch: "/system/attachment/delete",
        update: "/system/attachment/update",
      },
      defaultExpandedRowKeys: [],
      loadDataDicItem: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.subQueryParam
        );
        return this.$post(this.url.subList, requestParameters).then((res) => {
          return res;
        });
      },
      parameter: {
        father: { pid: 2 },
        children: {},
      },
      queryParamAccessory: {},
    };
  },
  activated() {},
  mounted() {},
  computed: {
    subRowSelection() {
      return {
        selectedRowKeys: this.subSelectedRowKeys,
        onChange: this.onSelectChangeSub,
      };
    },
  },
  methods: {
    rowClassNameDic(row) {
      return row.uuid === this.subRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 子表行点击事件
    subRowClick(record, index) {
      this.subRows = record;
      this.queryParamAccessory.puuid = record.uuid;
      this.$refs.accessoryList.refreshList(this.queryParamAccessory); // 设置刷新子表
    },
    // 主表行点击事件
    masterRowClick(record, index, param) {
      this.masterRows = record;
      this.subMdl = record;
      if (this.$refs.subList) {
        this.subQueryParam.id = record.id;
        this.$refs.subList.refresh();
      }
    },
    handleSub() {
      const that = this;
      if (that.subSelectedRowKeys.length === 0) {
        that.$message.warn("请先勾选需要的删除的数据", 1.5);
        return true;
      }
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          that
            .$post(that.url.subDelete, {
              uuid: that.subSelectedRowKeys.toString(),
            })
            .then((res) => {
              if (res.statusCode === 200 || res === 1) {
                that.$message.success("删除成功", 1.5);
                that.subRows = null;
                that.subSelectedRowKeys = [];
                that.$refs.subList.refresh();
                that.$refs.accessoryList.refreshList({ puuid: 1 });
              } else {
                that.$message.error(res.message);
              }
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
  },
};
</script>

<style scope>
.table-operator {
  margin-left: 18px;
}

.ant-table-tbody > tr > td:last-child {
  padding: 16px 16px;
}
</style>
