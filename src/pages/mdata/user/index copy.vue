<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-sider width="300" style="background:#fff">
        <tree-grid
          ref="masterList"
          :columns="orgColumns"
          rowKey="uuid"
          :url="url"
          :parameter="parameter"
          @rowClick="masterRowClick"
        ></tree-grid>
      </a-layout-sider>
      <a-layout-content style="background:#fff;padding-left: 20px;">
        <div
          class="toolbar flex justify-between flex-wrap"
          style="width: 100%;"
        >
          <div class="table-operator">
            <a-button class="cu-btn-primary" icon="plus" @click="handleAdd"
              >新增</a-button
            >
            <!-- <a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all')">编辑</a-button> -->
            <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub('all', 0)"
              >删除</a-button
            >
            <!-- <a-upload
							name="file"
							:showUploadList="false"
							:multiple="false"
							:headers="tokenHeader"
							:action="uploadUrl"
							@change="(e) => handleImportExcel(e, 'table')"
						>
							<a-button class="cu-btn-primary" icon="import">导入</a-button>
						</a-upload> -->
            <a-button
              class="cu-btn-primary"
              icon="export"
              @click="handleExportXls(columns, 'sys_user', 1)"
              >导出</a-button
            >
            <!-- <a-button class="cu-btn-info" icon="export" @click="handleExportXls(columns, 'sys_user', 2)"
							>下载模板</a-button
						> -->
            <a-button class="cu-btn-info" icon="export" @click="resetPassword()"
              >重置密码</a-button
            >
          </div>
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <div class="flex justify-between flex-wrap">
                <a-form-item label="">
                  <a-input
                    v-model="queryParam.userNameId"
                    placeholder="员工号"
                  />
                </a-form-item>
                <a-form-item label="">
                  <a-input v-model="queryParam.userName" placeholder="姓名" />
                </a-form-item>
                <div class="table-page-search-submitButtons flex">
                  <a-button class="cu-btn-primary" @click="resetForm()"
                    >查询</a-button
                  >
                  <a-button class="cu-btn-filter" @click="resetSearchForm"
                    >重置</a-button
                  >
                </div>
              </div>
            </a-form>
          </div>
        </div>
        <s-table
          ref="table"
          :columns="columns"
          rowKey="uuid"
          :data="loadData"
          :pageSize="10"
          bordered
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          @rowClick="rowClick"
          :rowClassName="rowClassName"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="sex" slot-scope="text">
            <!-- {{ text }} -->
            {{ text | sexFilter }}
          </span>
          <span slot="status" slot-scope="text">
            {{ text | statusFilter }}
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record, $refs.masterList.getListData())"
                >编辑</a
              >
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;" @click="handleViewDetail(record)"
                      >详情</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleSub(record, 0)"
                      >删除</a
                    >
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <!-- <a @click="handleSub(record,0)">删除</a> -->
            </template>
          </span>
        </s-table>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="职位信息">
            <div
              class="toolbar flex justify-between flex-wrap"
              style="width: 100%;"
            >
              <div class="table-operator">
                <a-button
                  class="cu-btn-primary"
                  icon="plus"
                  @click="handleAddUserPost"
                  >新增</a-button
                >
                <!-- <a-button class="cu-btn-default"
            icon="edit" @click="handleEditUserPost('1')">编辑</a-button> -->
                <a-button
                  class="cu-btn-danger"
                  icon="delete"
                  @click="handleSub('all', 1)"
                  >删除</a-button
                >
              </div>
            </div>
            <s-table
              ref="tableUserPost"
              rowKey="uuid"
              :columns="columnsUserPost"
              bordered
              :pageSize="10"
              :rowSelection="{
                selectedRowKeys: selectedRowKeysUserPost,
                onChange: onSelectChangeUserPost,
              }"
              @rowClick="rowClickUserPost"
              :rowClassName="rowClassNamePost"
              :data="loadDataUserPost"
            >
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <a @click="handleEditUserPost(record)">编辑</a>
                  <a-divider type="vertical" />
                  <a @click="handleSub(record, 1)">删除</a>
                </template>
              </span>
            </s-table>
          </a-tab-pane>
          <!-- <a-tab-pane key="2" tab="绑定第三方账号">
				  <div class="table-operator">
				    <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all',2)">删除</a-button>
				  </div>
				  <s-table
				    ref="tableUserOther"
				    rowKey="uuid"
				    :columns="columnsUserOther"
				    bordered
				    :row-selection="{ selectedRowKeys: selectedRowKeysUserOther, onChange: onSelectChangeUserOther }"
				    :data="loadDataUserOther">
				    <span slot="serial" slot-scope="text, record, index">
				      {{ index + 1 }}
				    </span>
				  </s-table>
				</a-tab-pane> -->
        </a-tabs>
      </a-layout-content>
    </a-layout>
    <edit-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel(0)"
      @ok="handleOk"
    />
    <post-form
      ref="createPostModal"
      :visible="visibleUserPost"
      :loading="confirmLoadingUserPost"
      :model="mdlUserPost"
      @cancel="handleCancel(1)"
      @ok="handleOkUserPost"
    />
    <detail-form
      ref="detailModal"
      @cancel="handleCancelDetail()"
      :visible="visibleDetail"
    />
  </a-card>
</template>

<script>
import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
import { STable } from "@/components";

import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./edit";
import postForm from "./post";
import detailForm from "./detail";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { baseUrl } from "@/services/baseUrl.js";
const orgColumns = [
  {
    title: "组织机构",
    dataIndex: "text",
  },
];
export default {
  name: "TreeList",
  mixins: [dataListMixin],
  components: {
    STable,
    editForm,
    postForm,
    detailForm,
    TreeGrid,
  },
  data() {
    return {
      orgColumns,
      visible: false,
      visibleUserPost: false,
      visibleDetail: false,
      confirmLoading: false,
      confirmLoadingUserPost: false,
      mdl: null,
      mdlUserPost: null,
      // 查询参数
      queryParam: {},
      queryParamUser: {},
      queryParamUserPost: {},
      queryParamUserOther: {},
      userPost: [],
      data: [],
      // 表头
      columns: [
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
          title: "员工号",
          align: "center",
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
          title: "电话",
          align: "center",
          dataIndex: "telephone",
          sorter: true,
        },
        {
          title: "手机",
          align: "center",
          dataIndex: "cellphone",
          sorter: true,
        },
        {
          title: "电子邮箱",
          align: "center",
          dataIndex: "email",
          sorter: true,
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "status",
          scopedSlots: {
            customRender: "status",
          },
          customCell: (record, rowIndex) => {
            if (record.status === 1 || record.status === "1") {
              return {
                style: "color: green",
              };
            } else {
              return {
                style: "color: red",
              };
            }
          },
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "action",
          width: 150,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      columnsUserPost: [
        {
          title: "#",
          width: 50,
          align: "center",
          scopedSlots: {
            customRender: "serial",
          },
        },
        {
          title: "所属机构",
          dataIndex: "company",
        },
        {
          title: "职务",
          dataIndex: "post",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 150,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      columnsUserOther: [
        {
          title: "#",
          width: 50,
          align: "center",
          scopedSlots: {
            customRender: "serial",
          },
        },
        {
          title: "昵称",
          dataIndex: "nick",
        },
        {
          title: "openid",
          dataIndex: "openid",
        },
        {
          title: "unionid",
          dataIndex: "unionid",
        },
        {
          title: "类型",
          dataIndex: "type",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 150,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      orgTree: [],
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowKeysUserPost: [],
      selectedRowsUserPost: [],
      advanced: false,
      selectedRowKeysUserOther: [],
      selectedRowsUserOther: [],
      userNameId: "",
      uuids: "",
      dicUuids: "",
      info: "",
      infoUserPost: "",
      orgName: "",
      orgId: "",
      url: {
        uploadUrl: "/system/attachment/upload",
        importExcelUrl: "/mdata/exportImport/exportleadingIn",
        exportExcelTemplate: "/mdata/csExcelUser/exportExcelTemplate",
        exportExcelUrl: "/mdata/csExcelUser/exportExcel",
        fathersUrl: "/mdata/organization/getListByLevelId",
        expandUrl: "/mdata/organization/getListByPid",
        getUserList: "/mdata/user/getPageSet",
        updateUser: "/mdata/user/update",
        deleteUser: "/mdata/user/delete",
        addUser: "/mdata/user/save",
        getUserPost: "/mdata/sysUserPost/getPageSet",
        savePosition: "/mdata/user/savePosition",
        updatePosition: "/mdata/sysUserPost/update",
        delUserPost: "/mdata/sysUserPost/deleteBatch",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {
          levelId: 1,
        },
      },
      tokenHeader: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getUserList, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      loadDataUserPost: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.queryParamUserPost
        );
        return this.$post(this.url.getUserPost, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    uploadUrl: function() {
      return `${baseUrl}${this.url.uploadUrl}`;
    },
  },
  filters: {
    sexFilter(sex) {
      const sexMap = {
        1: "男",
        2: "女",
      };
      return sexMap[sex];
    },
    statusFilter(status) {
      const statusMap = {
        0: "禁用",
        1: "启用",
      };
      return statusMap[status];
    },
  },
  methods: {
    resetForm() {
      this.$refs.table.refresh();
      this.queryParamUserPost = {};
      this.$refs.tableUserPost.refresh(); // 设置刷新子表
    },
    resetSearchForm() {
      const id = this.queryParam.orgId;
      this.queryParam = {};
      this.queryParam.orgId = id;
      this.$refs.table.refresh();
    },
    rowClassName(row) {
      return row.uuid === this.uuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClassNamePost(row) {
      return row.uuid === this.dicUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      // 数据表格行点击事件
      const that = this;
      that.info = record;
      that.uuids = record.uuid;
      that.queryParamUserPost.userNameId = record.userNameId; // 设置子表加载参数
      that.$refs.tableUserPost.refresh(); // 设置刷新子表
    },
    rowClickUserPost(record, index) {
      const that = this;
      that.infoUserPost = record;
      that.dicUuids = record.uuid;
    },
    // 树形选择事件
    masterRowClick(value, index) {
      const tree = value;
      this.queryParam.orgId = tree.id;
      this.orgName = tree.text;
      this.uuids = "";
      this.info = value;
      this.selectedRowKeys = [];
      this.$refs.table.refresh();
      this.queryParamUserPost = {};
      this.infoUserPost = "";
      this.dicUuids = "";
      this.selectedRowKeysUserPost = [];
      this.$refs.tableUserPost.refresh(); // 设置刷新子表
    },
    // 新增
    handleAdd() {
      if (!this.queryParam.orgId) {
        this.$message.info("请先选择左侧树形的数据");
        return true;
      } else {
        this.mdl = {
          orgId: this.queryParam.orgId,
          orgName: this.orgName,
        };
        this.visible = true;
      }
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createModal.add(this.mdl, this.$refs.masterList.getListData());
    },
    // 编辑
    handleEdit(record) {
      if (record === "1") {
        if (this.info) {
          this.visible = true;
          this.mdl = this.info;
        } else {
          this.$message.info("请先选中需要修改的数据");
          return true;
        }
      } else {
        this.visible = true;
        this.mdl = { ...record };
      }
      this.$refs.createModal.add(this.mdl, this.$refs.masterList.getListData());
    },
    // 查看详情
    handleViewDetail(e) {
      this.visibleDetail = true;
      this.$refs.detailModal.onLoadData(e);
    },
    handleAddUserPost() {
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      if (!this.queryParamUserPost.userNameId) {
        this.$message.info("请先选择需要操作的数据");
      } else {
        this.mdlUserPost = {
          orgId: this.info.orgId,
          userNameId: this.queryParamUserPost.userNameId,
        };
        this.$refs.createPostModal.addPost(
          this.mdlUserPost,
          this.$refs.masterList.getListData()
        );
        this.visibleUserPost = true;
      }
    },
    handleEditUserPost(record) {
      if (record === "1") {
        if (this.infoUserPost) {
          this.visibleUserPost = true;
          this.infoUserPost.userNameId = this.queryParamUserPost.userNameId;
          this.infoUserPost.orgName = this.infoUserPost.company;
          this.mdlUserPost = this.infoUserPost;
          this.$refs.createPostModal.editPost(
            this.mdlUserPost,
            this.$refs.masterList.getListData()
          );
        } else {
          this.$message.info("请先选中需要修改的数据");
          return true;
        }
      } else {
        this.visibleUserPost = true;
        record.userNameId = this.queryParamUserPost.userNameId;
        record.orgName = record.company;
        this.mdlUserPost = { ...record };
        this.$refs.createPostModal.editPost(
          this.mdlUserPost,
          this.$refs.masterList.getListData()
        );
      }
    },
    // 表单提交
    handleOk() {
      const form = this.$refs.createModal.form;

      let url = "";
      form.validateFields((errors, values) => {
        if (!errors) {
          // values.dataAuth = values.dataAuth.toString();
          values.userGroup = values.userGroup.toString();
          values.userGroupName1 = values.userGroupName1.toString();
          // values.dataAuthName = values.dataAuthName.toString();
          if (values.uuid) {
            url = this.url.updateUser;
          } else {
            url = this.url.addUser;
          }
          this.confirmLoading = true;
          this.$post(url, values).then((res) => {
            if (res.statusCode === 200 || res === 1) {
              this.visible = false;
              this.confirmLoading = false;
              // 重置表单数据
              form.resetFields();
              // 刷新表格
              this.$refs.table.refresh();
              this.$message.info(res.message);
            } else {
              this.confirmLoading = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleOkUserPost() {
      let url = "";
      const formUserPost = this.$refs.createPostModal.form;
      this.confirmLoadingUserPost = true;
      formUserPost.validateFields((errors, values) => {
        if (!errors) {
          if (values.uuid) {
            url = this.url.updatePosition;
          } else {
            url = this.url.savePosition;
          }
          this.$post(url, values).then((res) => {
            if (res.statusCode === 200 || res === 1) {
              this.visibleUserPost = false;
              this.confirmLoadingUserPost = false;
              // 重置表单数据
              formUserPost.resetFields();
              // 刷新表格
              this.$refs.tableUserPost.refresh();
              this.$message.info(res.message);
            } else {
              this.confirmLoadingUserPost = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.confirmLoadingUserPost = false;
        }
      });
    },
    // 取消
    handleCancel(type) {
      if (type === 0) {
        this.visible = false;
      } else {
        this.visibleUserPost = false;
      }
    },
    handleCancelDetail() {
      this.visibleDetail = false;
    },
    // 删除
    handleSub(record, type) {
      const that = this;
      let uuids = "";
      if (record === "all") {
        // 判断删除操作
        if (type === 0) {
          if (that.selectedRowKeys.length === 0) {
            that.$message.warn("请先勾选需要的删除的数据");
            return true;
          } else {
            uuids = that.uuids;
          }
        } else if (type === 1) {
          if (that.selectedRowKeysUserPost.length === 0) {
            that.$message.warn("请先勾选需要的删除的数据");
            return true;
          } else {
            uuids = that.dicUuids;
          }
        } else {
          if (that.selectedRowKeysUserOther.length === 0) {
            that.$message.warn("请先勾选需要的删除的数据");
            return true;
          } else {
            uuids = that.dicUuids;
          }
        }
      } else {
        uuids = record.uuid;
      }
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          if (type === 0) {
            that
              .$post(that.url.deleteUser, {
                uuid: uuids,
              })
              .then((res) => {
                if (res.statusCode === 200) {
                  that.$message.success(res.message);
                  that.uuids = "";
                  that.info = "";
                  that.selectedRowKeys = [];
                  that.$refs.table.refresh();
                } else {
                  that.$message.info(res.message);
                }
              });
          } else {
            that
              .$post(that.url.delUserPost, {
                uuid: uuids,
              })
              .then((res) => {
                if (res.statusCode === 200) {
                  that.$message.success(res.message);
                  that.infoUserPost = "";
                  that.dicUuids = "";
                  that.selectedRowKeysUserPost = [];
                  that.$refs.tableUserPost.refresh();
                } else {
                  that.$message.info(res.message);
                }
              });
          }
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    onSelectChangeResh(changeableRowKeys) {
      console.log(changeableRowKeys);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.uuids = e.uuid;
        } else {
          this.uuids = this.uuids + "," + e.uuid;
        }
      });
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    onSelectChangeUserPost(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.dicUuids = e.uuid;
        } else {
          this.dicUuids = this.dicUuids + "," + e.uuid;
        }
      });
      this.selectedRowKeysUserPost = selectedRowKeys;
      this.selectedRowsUserPost = selectedRows;
    },
    onSelectChangeUserOther(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.dicUuids = e.uuid;
        } else {
          this.dicUuids = this.dicUuids + "," + e.uuid;
        }
      });
      this.selectedRowKeysUserOther = selectedRowKeys;
      this.selectedRowsUserOther = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetPassword() {
      if (this.selectedRows.length === 0) {
        this.$message.warn("请先勾选需要操作的用户");
      } else {
        let userPwd = {};
        this.selectedRows.forEach((req, index) => {
          if (index === 0) {
            userPwd.uuid = req.uuid;
            userPwd.password = req.userNameId;
          } else {
            userPwd.uuid += "," + req.uuid;
            userPwd.password += "," + req.userNameId;
          }
        });
        this.$post("/mdata/user/updatePassword", userPwd).then((res) => {
          if (res.statusCode === 200) {
            this.$message.success(res.message);
            this.$refs.table.refresh();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
  },
};
</script>

<style lang="less">
.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
