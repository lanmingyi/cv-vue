<template>
  <div>
    <div class="toolbar flex justify-between flex-wrap">
      <div class="table-operator">
        <a-button
          class="cu-btn-primary"
          icon="plus"
          @click="handleaddArchivePost"
          >新增</a-button
        >
        <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')"
          >删除</a-button
        >
      </div>
    </div>
    <a-table
      bordered
      ref="table"
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      rowKey="uuid"
      showPagination="auto"
      :customRow="rowClick"
      :row-selection="{
        selectedRowKeys: selectedRowKeysUserPost,
        onChange: onSelectChangeUserPost,
      }"
      :rowClassName="rowClassName"
      class="margin-bottom-sm"
      @change="handleTableChange"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <template
        v-for="col in ['fileName']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.uuid, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a style="margin-right: 5px" @click="() => save(record.uuid)"
              >保存</a
            >
            <a style="margin-right: 5px" @click="() => cancel(record.uuid)"
              >取消</a
            >
          </span>
          <span v-else>
            <a
              style="margin-right: 5px"
              :disabled="editingKey !== ''"
              @click="() => edit(record.uuid)"
              >编辑</a
            >
            <a-divider type="vertical" />
            <a @click="handleDownLoad(record)">下载</a>
            <a-divider type="vertical" />
            <a v-if="showPreview(record)" @click="handlePreview(record)"
              >预览</a
            >
            <a-divider v-if="showPreview(record)" type="vertical" />
            <a @click="handleSub(record, 1)">删除</a>
          </span>
        </div>
      </template>
    </a-table>
    <t-modal
      title="图片预览"
      :width="800"
      :visible="imgVisible"
      @ok="() => (imgVisible = false)"
      @cancel="() => (imgVisible = false)"
    >
      <div style="width: 100%;">
        <img style="width: 100%;object-fit: center;" :src="imgPreview" />
      </div>
    </t-modal>
    <web-upload
      ref="createPostModal"
      :visible="visibleUserPost"
      :loading="confirmLoadingUserPost"
      :data="mdlUserPost"
      @cancel="handleCancel(0)"
      @ok="handleOkUserPost"
      @resTable="resTable"
    />
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";

import webUpload from "@/components/TopVUI/custom/webupload.vue";
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
    title: "文件名称",
    dataIndex: "fileName",
    scopedSlots: {
      customRender: "fileName",
    },
  },
  {
    title: "文件大小",
    width: 90,
    dataIndex: "fileSize",
  },
  {
    title: "上传人",
    width: 200,
    dataIndex: "creator",
  },
  {
    title: "上传时间",
    width: 180,
    dataIndex: "createTime",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 250,
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "Accessory",
  components: {
    webUpload,
  },
  props: {
    paramList: {
      type: Object,
    },
    url: {
      type: String,
      default: "/system/attachment/upload",
    },
    tag: {
      type: String,
      default: "attachment",
    },
  },
  data() {
    this.columns = columns;
    return {
      visibleUserPost: false,
      imgVisible: false,
      imgPreview: "",
      confirmLoadingUserPost: false,
      mdl: null,
      mdlUserPost: null,
      // pagination: {},
      queryParamUserPost: null,
      // 查询参数
      userPost: [],
      data: [],

      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total, range) => {
          return "共 " + total + " 条";
        },
        pageSizeOptions: ["10", "20", "30", "40"],
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      orgTree: [],
      dataSource: [],
      cacheData: [],
      selectedRowKeysUserPost: [],
      selectedRowsUserPost: [],
      advanced: false,
      userNameId: "",
      uuid: "",
      uuids: "",
      dicUuids: "",
      info: "",
      infoUserPost: "",
      orgName: "",
      orgId: "",
      fileList: [],
      action: "",
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      url: {
        getPageSet: "/system/attachment/getListByPuuid",
        delete: "/system/attachment/delete",
      },
      urlFile: {
        webUpload: "/document/fdfs/upload",
        getPageSet: "/document/fastdfs/getPageSet",
        deleteBatch: "/document/fdfs/delete",
        update: "/document/fastdfs/update",
      },
      editingKey: "",
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  created() {
    this.action = baseUrl + this.url;
    this.headers.token = Vue.ls.get(ACCESS_TOKEN);
  },
  mounted() {
    // this.fetch(this.queryParamUserPost)
  },
  methods: {
    fetch(params) {
      let url = "";
      if (this.tag != "fdsFile") {
        url = this.url.getPageSet;
      } else {
        url = this.urlFile.getDocument;
      }
      this.$post(url, params).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        this.cacheData = JSON.parse(JSON.stringify(res.rows));
        this.pagination = pager;
      });
    },
    check(key) {
      const newData = [...this.dataSource];
      const target = newData.filter((item) => key === item.uuid)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.dataSource = newData;
      }
    },
    // edit(key) {
    // 	const newData = [...this.dataSource]
    // 	const target = newData.filter(item => key === item.uuid)[0]
    // 	this.editingKey = key
    // 	if (target) {
    // 		target.editable = true
    // 		this.dataSource = newData
    // 	}
    // },
    // save(key) {
    // 	const newData = [...this.dataSource]
    // 	const newCacheData = [...this.cacheData]
    // 	const target = newData.filter(item => key === item.uuid)[0]
    // 	const targetCache = newCacheData.filter(item => key === item.uuid)[0]
    // 	if (target && targetCache) {
    // 		this.$post(this.requestUrl.getDetailByUuid, {
    // 			puuid: target.puuid
    // 		}).then((res) => {
    // 			if (res.statusCode !== 300) {
    // 				// 刷新表格
    // 				this.dataSource = newData
    // 				delete target.editable
    // 				Object.assign(targetCache, target)
    // 				this.cacheData = newCacheData
    // 				this.$message.info('修改成功')
    // 			} else {
    // 				this.$message.error(res.message)
    // 			}
    // 		})
    // 	}
    // 	this.editingKey = ''
    // },
    // cancel(key) {
    // 	const newData = [...this.dataSource]
    // 	const target = newData.filter(item => key === item.uuid)[0]
    // 	this.editingKey = ''
    // 	if (target) {
    // 		Object.assign(target, this.cacheData.filter(item => key === item.uuid)[0])
    // 		delete target.editable
    // 		this.dataSource = newData
    // 		if (this.isNew) {
    // 			this.isNew = false
    // 			this.dataSource.splice(0, 1)
    // 		}
    // 	}
    // },
    resTable() {
      this.visibleUserPost = false;
      this.$message.info("添加成功");
      this.editingKey = "";
      this.dataSource = [];
      this.fetch(this.queryParamUserPost);
      // this.$refs.tableUserPost.refresh()
    },
    refreshList(e) {
      this.uuid = "";
      this.info = "";
      this.selectedRowKeysUserPost = [];
      this.dicUuids = "";
      this.queryParamUserPost = e;
      this.editingKey = "";
      this.dataSource = [];
      this.fetch(this.queryParamUserPost);
      // this.$refs.tableUserPost.refresh()
    },
    refreshListPost(e) {
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    rowClassName(row) {
      return row.uuid === this.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.infoUserPost = record;
            that.uuid = record.uuid;
            that.rowClassName(record);
          },
        },
      };
    },
    handleaddArchivePost() {
      if (this.queryParamUserPost) {
        if (!this.queryParamUserPost.puuid) {
          this.$message.warn("此合同未生效");
          return false;
        }
        this.mdlUserPost = {
          puuid: this.queryParamUserPost.puuid,
        };
        this.visibleUserPost = true;
      } else {
        this.$message.info("请先选择需要操作的数据");
      }
      this.editingKey = "";
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createPostModal.add(this.mdlUserPost);
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
        puuid: this.queryParamUserPost.puuid,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    onShowSizeChange(current, pageSize) {
      const pager = { ...this.pagination };
      pager.pageSize = pageSize;
      this.pagination = pager;
      this.fetch({
        pageSize: pageSize,
        pageNo: current,
        puuid: this.queryParamUserPost.puuid,
      });
    },
    // handleChange(value, key, column) {
    // 	const newData = [...this.dataSource]
    // 	const target = newData.filter(item => key === item.uuid)[0]
    // 	if (target) {
    // 		target[column] = value
    // 		this.dataSource = newData
    // 	}
    // },
    // 下载
    handleDownLoad(e) {
      if (this.tag != "fdsFile") {
        this.download(e.uuid);
      } else {
        this.downloadDfs(e.url, e.fileName);
      }
    },
    showPreview(e) {
      const imgType = ["jpg", "jpeg", "gif", "png", "pdf"];
      return imgType.find((val) => e.fileType === val);
    },
    // 预览
    handlePreview(e) {
      console.log("e----------------预览", e);
      const imgType = ["jpg", "jpeg", "gif", "png"];
      const type = imgType.find((val) => e.fileType === val);
      if (!type) {
        this.$message.info("pdf");
      } else {
        this.imgVisible = true;
        this.imgPreview = "";
        this.imgPreview =
          baseUrl + "/system/attachment/showPic?path=" + e.filePath;
      }
    },
    handleOkUserPost() {
      const formUserPost = this.$refs.createPostModal.form;
      this.visibleUserPost = false;
      this.confirmLoadingUserPost = false;
      formUserPost.resetFields();
      this.dataSource = [];
      this.fetch(this.queryParamUserPost);
      // this.$refs.tableUserPost.refresh()
    },
    // 取消
    handleCancel(type) {
      this.visibleUserPost = false;
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createPostModal.add();
    },
    // 删除
    handleSub(record, type) {
      const that = this;
      let uuids = "";
      if (record === "all") {
        // 判断删除操作
        if (that.selectedRowKeysUserPost.length === 0) {
          that.$message.warn("请先勾选需要的删除的数据");
          return true;
        } else {
          uuids = that.dicUuids;
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
          that
            .$post(that.url.delete, {
              uuid: uuids,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.editingKey = "";
                that.dataSource = [];
                that.fetch(that.queryParamUserPost);
                // that.$refs.tableUserPost.refresh()
                that.selectedRowKeysUserPost = [];
                that.uuids = "";
              } else {
                that.$message.info(res.message);
              }
            });
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
      // console.log(changeableRowKeys)
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
    toggleAdvanced() {
      this.advanced = !this.advanced;
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

.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
