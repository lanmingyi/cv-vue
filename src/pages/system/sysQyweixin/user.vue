<!--
 * @Description: 用户数据
 * @Author: lmy
 * @Date: 2021-06-09 18:48:12
 * @LastEditTime: 2021-09-09 17:22:52
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysQyweixin\user.vue
-->
<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:30%">
      <tree-grid
        ref="masterList"
        :columns="columns"
        rowKey="uuid"
        :url="url"
        :parameter="parameter"
        @rowClick="
          (e) => {
            masterRowClick(e, { orgId: 'id' });
          }
        "
      >
      </tree-grid>
    </div>
    <div class="page-common-content">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            (this.subQueryParam.userName = ''), $refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="{ scope }">
          <a-button
            class="cu-btn-primary"
            icon="sync"
            @click="handleSynchronization()"
            v-action:userQyweixinSync
            >同步企业微信用户</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="subQueryParam.userName" placeholder="姓名" />
          </a-form-item>
        </template>
      </tool-bar>
        <data-grid
          ref="subList"
          type="sub"
          :url="url"
          :columns="subColumns"
          bordered
          :queryParam="subQueryParam"
          rowKey="uuid"
          showPagination="auto"
        >
          <span slot="gender" slot-scope="{ text }">
            {{ text | sexFilter }}
          </span>
          <span slot="action" slot-scope="{ text, record }">
            <template>
              <a @click="handleViewDetail(record)">查看详情</a>
            </template>
          </span>
        </data-grid>
      <user-detail :visible.sync="visible" :model="subMdl"></user-detail>
    </div>
  </div>
</template>
<script>
import { DataGrid, TreeGrid } from "@/components";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import userDetail from "./modal/userDetail";
const columns = [
  {
    title: "名称",
    align: "left",
    dataIndex: "name",
    ellipsis: true,
  },
];
const subColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "职位",
    dataIndex: "position",
    sorter: true,
  },
  {
    title: "性别",
    dataIndex: "gender",
    align: "center",
    scopedSlots: {
      customRender: "gender",
    },
    sorter: true,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center",
    sorter: true,
  },
  {
    title: "联系电话",
    dataIndex: "mobile",
    align: "center",
    sorter: true,
  },
  {
    title: "住址",
    dataIndex: "address",
    align: "center",
  },
  {
    title: "操作",
    width: 150,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  mixins: [treeGridMixin],
  components: {
    DataGrid,
    TreeGrid,
    userDetail,
  },
  data() {
    return {
      key: "1",
      columns,
      subColumns,
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
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      url: {
        fathersUrl: "/system/sysQyweixinOrganization/getDatList",
        expandUrl: "/system/sysQyweixinOrganization/getDatList",
        subList: "/system/sysQyweixinUser/getPageSet",
        subSave: "/workflow/testDatagrid/save",
        subUpdate: "/workflow/testDatagrid/update",
        subDelete: "/workflow/testDatagrid/deleteBatch",
      },
      defaultExpandedRowKeys: [],
      parameter: {
        father: {
          pid: 0,
        },
        children: {},
      },
      userList: [],
      loading: false,
      visible: false,
    };
  },
  filters: {
    sexFilter(sex) {
      return sex == "2" ? "女" : "男";
    },
  },
  activated() {},
  mounted() {},
  methods: {
    handleSynchronization() {
      const that = this;
      that.$confirm({
        title: "警告",
        content: `同步企业微信用户将覆盖本地用户数据，确定执行该操作吗？`,
        okText: "同步",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.loading = true;
          // 在这里调用删除接口
          that
            .$post("/system/sysQyweixinUser/synchroQyWexixingUser", {
              orgId: that.subQueryParam.orgId,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message, 1.5);
                that.$refs.subList.refresh();
              } else {
                that.$message.error(res.message, 1.5);
              }
            })
            .finally(() => {
              that.loading = false;
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handleViewDetail(record) {
      this.visible = true;
      this.subMdl = record;
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
