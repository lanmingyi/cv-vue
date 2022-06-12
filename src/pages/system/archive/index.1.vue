<template>
  <div>
    <a-row :gutter="10">
      <a-col :md="5" :sm="24">
        <a-card :bordered="false">
          <a-tree
            v-if="orgTree.length"
            showLine
            :load-data="onLoadData"
            :tree-data="orgTree"
            @select="selectTree"
            default-expand-all
          />
        </a-card>
      </a-col>
      <a-col :md="19" :sm="24">
        <a-card :bordered="false">
          <div
            class="toolbar flex justify-between flex-wrap"
            style="width: 100%;"
          >
            <div class="table-operator">
              <a-button class="cu-btn-primary" icon="plus" @click="handleAdd"
                >新增</a-button
              >
              <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit('1')"
                >编辑</a-button
              >
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleSub('all')"
                >删除</a-button
              >
            </div>
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <div class="flex justify-between flex-wrap">
                  <a-form-item label="">
                    <a-input
                      v-model="queryParam.title"
                      placeholder="资源名称"
                    />
                  </a-form-item>
                  <div class="table-page-search-submitButtons flex">
                    <a-button class="cu-btn-primary" @click="resetFrom()"
                      >查询</a-button
                    >
                    <a-button class="cu-btn-filter" @click="refreshQueryParam()"
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
            bordered
            :pageSize="10"
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
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleSub(record, 0)">删除</a>
              </template>
            </span>
          </s-table>
        </a-card>
        <a-card :bordered="false">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="附件信息">
              <accessory-info
                ref="accessoryModal"
                :params="queryParamUserPost"
                :model="mdl"
              />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
    <edit-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel()"
      @ok="handleOk"
    />
  </div>
</template>

<script>
import { STable } from "@/components";

import editForm from "./edit";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import accessoryInfo from "@/components/TopVUI/accessory/index";
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
    title: "资源名称",
    dataIndex: "title",
  },
  {
    title: "创建人",
    dataIndex: "creator",
    sorter: true,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    sorter: true,
  },
];
export default {
  name: "TreeList",
  mixins: [simpleListMixin],
  components: {
    STable,
    editForm,
    accessoryInfo,
  },
  data() {
    this.columns = columns;
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      pagination: {},
      // 查询参数
      queryParam: {},
      queryParamList: {},
      queryParamUserPost: {},
      data: [],
      orgTree: [],
      url: {
        getChannelsById: "/system/channel/getChannelsById?id=12",
        getPageSetData: "/system/archive/getPageSetData",
        getChannelsByPid: "/system/channel/getChannelsByPid",
        deleteArchive: "/system/archive/delete?source=welder",
        update: "/system/archive/update",
        save: "/system/archive/save",
        deleteBatch: "/system/attachment/delete",
        getPageSet: "/system/attachment/getListByPuuid",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSetData, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      selectedRowKeys: [],
      selectedRows: [],
      uuid: "",
      rows: {},
      imgVisible: false,
      imgPreview: "",
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
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
  created() {
    this.$post(this.url.getChannelsById).then((res) => {
      // 获取树形第一层级
      this.orgTree = res;
      this.orgTree.forEach((e, index) => {
        this.orgTree[index].title = e.text;
        this.orgTree[index].label = e.text;
        this.orgTree[index].index = index;
        this.orgTree[index].key = e.id;
        this.orgTree[index].levelId = e.levelId;
        this.orgTree[index].key = e.id;
      });
    });
  },
  methods: {
    resetFrom() {
      this.$refs.table.refresh();
      this.queryParamUserPost = {};
      this.$refs.accessoryModal.refreshList(this.queryParamUserPost); // 设置刷新子表
    },
    refreshQueryParam() {
      this.queryParam = {};
      this.queryParam = Object.assign({}, this.queryParamList);
      this.$refs.table.refresh();
    },
    rowClassName(row) {
      return row.uuid === this.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      // 数据表格行点击事件
      const that = this;
      that.rows = record;
      that.uuid = record.uuid;
      that.queryParamUserPost.puuid = record.uuid; // 设置子表加载参数
      that.$refs.accessoryModal.refreshList(that.queryParamUserPost); // 设置刷新子表
    },
    // 加载树形子级数据
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        // 判断是否有子级
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.$post(this.url.getChannelsByPid, {
          pid: treeNode.dataRef.id,
        })
          .then((res) => {
            const orgTree = res;
            orgTree.forEach((e, index) => {
              orgTree[index].title = e.text;
              orgTree[index].index = index;
              orgTree[index].key = e.id;
              orgTree[index].levelId = e.levelId;
            });
            treeNode.dataRef.children = orgTree;
            this.orgTree = [...this.orgTree];
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 树形选择事件
    selectTree(value, node, extra) {
      const tree = node.node.dataRef;
      this.queryParam = {};
      this.queryParam.id = tree.id;
      this.queryParamList = Object.assign({}, this.queryParam);
      this.$refs.table.refresh();
      this.queryParamUserPost = {};
      this.info = "";
      this.uuid = "";
      this.selectedRowKeys = [];
      this.$refs.accessoryModal.refreshList(this.queryParamUserPost); // 设置刷新子表
    },
    // 新增
    handleAdd() {
      if (!this.queryParam.id) {
        this.$message.info("请先选择左侧树形的数据");
        return true;
      } else {
        this.mdl = {
          categoryId: this.queryParam.id,
        };
        this.visible = true;
      }
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createModal.add(this.mdl);
    },
  },
};
</script>

<style lang="less">
.tom-tree {
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
