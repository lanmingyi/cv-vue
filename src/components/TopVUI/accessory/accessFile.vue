<!--
 * @Description: 附件组件
 * @Author: 黄婷
 * @Date: 2021-04-26 15:53:58
 * @LastEditTime: 2021-09-06 11:31:58
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\accessory\accessFile.vue
-->
<template>
  <div>
    <div v-if="btnType" class="toolbar flex justify-between flex-wrap">
      <div class="table-operator">
        <!-- <a-button class="cu-btn-primary" icon="plus" @click="handleaddArchivePost">新增</a-button> -->
        <a-button
          class="cu-btn-primary"
          v-if="!type || type != 1"
          @click="handleaddArchivePost"
          icon="upload"
          >上传</a-button
        >
        <a-button
          class="cu-btn-danger"
          v-if="(tag && tag != 'fdsFile' && !type) || type != 1"
          icon="delete"
          @click="handleSubRow('all')"
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
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :rowClassName="rowClassName"
      class="margin-bottom-sm"
      @change="handleTableChange"
      :scroll="{ y: 300 }"
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
            <icon-fonts
              :icon="getIconFontByFile(text)"
              style="margin-right: 5px;"
            />{{ text }}
          </template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <!-- <span v-if="record.editable">
						<a style="margin-right: 5px" @click="saveRecord(record)">保存</a>
						<a style="margin-right: 5px" @click="() => cancel(record.uuid)">取消</a>
					</span> -->
          <!-- <span> -->
          <a @click="handleDownLoad(record)">下载</a>
          <a-divider v-if="showPreview(record)" type="vertical" />
          <a v-if="showPreview(record)" @click="handlePreview(record)">预览</a>
          <!-- <a-divider type="vertical" /> -->
          <template v-if="type && type != 1">
            <!-- <a style="margin-right: 5px" :disabled="editingKey !== ''" @click="() => edit(record.uuid)">编辑</a>
							<a-divider type="vertical" /> -->
            <template v-if="showTypePreview(record)">
              <a-divider type="vertical" />
              <a @click="getViewUrlWebPath(record)">在线编辑</a>
              <a-divider type="vertical" />
            </template>
            <a
              v-if="tag && tag === 'fdsFile'"
              @click="handleSubRow(record, { fileUrl: record.url })"
              >删除</a
            >
            <a v-else @click="handleSubRow(record)">删除</a>
          </template>
          <!-- </span> -->
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
      :visible="visible"
      :url="url.webUpload"
      :loading="confirmLoading"
      :data="mdl"
      @cancel="
        () => {
          visible = false;
        }
      "
      @ok="handleOkUserPost"
      @resTable="resTable"
    />
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { pdfStreamHandeler } from "@/services/common";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import { getIconFont, getTypeByList } from "@/utils/util";
import { download, downloadDfs } from "@/utils/TopVUI.js";
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
    ellipsis: true,
  },
  {
    title: "文件大小",
    dataIndex: "filSize",
  },
  {
    title: "上传人",
    dataIndex: "creator",
  },
  {
    title: "上传时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 200,
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
  mixins: [simpleListMixin],
  props: {
    paramList: {
      type: Object,
    },
    url: {
      type: Object,
      default: () => {
        return {
          webUpload: "/document/oss/multiUpload",
          getPageSet: "/system/attachment/getListByPuuid",
          deleteBatch: "/system/attachment/delete",
          update: "/system/attachment/update",
        };
      },
    },
    type: {
      type: Number,
      default: 2,
    },
    tag: {
      type: String, //fdsFile   区别删除是否带参数
      default: "default",
    },
    label: {
      type: String,
      default: "attachment",
    },
    btnType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.columns = columns;
    return {
      visible: false,
      confirmLoading: false,
      // 查询参数
      queryParam: {},
      rows: "",
      uuid: "",
      selectedRowKeys: [],
      selectedRows: [],
      imgVisible: false,
      imgPreview: "",
      mdl: null,
      // 查询参数
      data: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: (total, range) => {
          return "共" + total + " 条";
        },
        pageSizeOptions: ["10", "20", "30", "40"],
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      dataSource: [],
      cacheData: [],
      action: "",
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      urlpdf: {
        pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
      },
      editingKey: "",
    };
  },
  computed: {
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
    console.log(this.type);
  },
  methods: {
    getIconFontByFile(val) {
      return getIconFont(val);
    },
    // 判断是否显示在线编辑按钮
    showTypePreview(e) {
      const typeList = [".doc", ".ppt", ".xls", ".pdf"];
      return getTypeByList(typeList, e.filePath);
    },
    refreshList(e) {
      this.uuid = "";
      this.rows = "";
      this.selectedRowKeys = [];
      this.queryParam = e ? e : {};
      this.editingKey = "";
      this.dataSource = [];
      this.fetch(this.queryParam);
    },
    fetch(params) {
      if (this.label === "attachment") {
        params.puuid = params && params.puuid ? params.puuid : "null";
      } else {
        params.puuid = params && params.puuid ? params.puuid : "1";
      }
      params.pageNo =
        params && params.pageNo ? params.pageNo : this.pagination.current;
      params.pageSize =
        params && params.pageSize ? params.pageSize : this.pagination.pageSize;
      this.$post(this.url.getDocument, params).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        this.cacheData = JSON.parse(JSON.stringify(res.rows));
        this.pagination = pager;
      });
    },
    saveRecord(record) {
      if (this.label === "attachment") {
        const newData = [...this.dataSource];
        const newCacheData = [...this.cacheData];
        const target = newData.filter((item) => record.uuid === item.uuid)[0];
        const targetCache = newCacheData.filter(
          (item) => record.uuid === item.uuid
        )[0];
        delete target.editable;
        this.dataSource = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
        this.editingKey = "";
        this.$message.success("更新成功！", 1.5);
      } else {
        this.save(record.uuid);
      }
    },
    resTable() {
      this.visible = false;
      this.$message.info("添加成功");
      this.editingKey = "";
      this.dataSource = [];
      this.fetch(this.queryParam);
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
            that.rows = record;
            that.uuid = record.uuid;
            that.rowClassName(record);
          },
        },
      };
    },
    handleaddArchivePost() {
      console.log("this.queryParam", this.queryParam, this.url);
      if (this.queryParam.puuid) {
        if (this.queryParam.puuid === "null") {
          this.$message.warn("此合同未生效");
          return false;
        }
        if (this.queryParam.puuid === "1") {
          this.$message.info("请先选择需要操作的数据");
        } else {
          this.mdl = {
            puuid: this.queryParam.puuid,
          };
          this.visible = true;
        }
      } else {
        this.$message.info("请先选择需要操作的数据！");
      }
      this.editingKey = "";
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createPostModal.add(this.mdl);
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      pager.pageSize = pagination.pageSize;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
        puuid: this.queryParam.puuid,
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
        puuid: this.queryParam.puuid,
      });
    },
    handleOkUserPost() {
      const formUserPost = this.$refs.createPostModal.form;
      this.visible = false;
      this.confirmLoading = false;
      formUserPost.resetFields();
      this.dataSource = [];
      this.fetch(this.queryParam);
    },
    // 下载
    handleDownLoad(e) {
      if (this.label === "attachment") {
        download(e.uuid);
      } else {
        downloadDfs(e.url, e.fileName);
      }
    },
    //判断文件是否可以预览
    showPreview(e) {
      const imgType = ["jpg", "jpeg", "gif", "png", "pdf"];
      return imgType.find((val) => e.fileType === val);
    },
    // 预览
    handlePreview(e) {
      console.log("e----------------预览", e);
      this.imgPreview = "";
      this.$nextTick(() => {
        const imgType = ["jpg", "jpeg", "gif", "png"];
        const type = imgType.find((val) => e.fileType === val);
        if (!type) {
          pdfStreamHandeler(this.urlpdf.pdfStreamHandeler, {
            uuid: e.uuid,
            filePath: e.filePath,
          }).then((res) => {
            var binaryData = [];
            binaryData.push(res);
            const blob = new Blob(binaryData, {
              type: "application/pdf;charset-UTF-8",
            });
            const objectUrl = window.URL.createObjectURL(blob);
            window.open("./statics/pdf/web/viewer.html?file=" + objectUrl);
          });
        } else {
          this.imgVisible = true;
          this.imgPreview =
            baseUrl + "/system/attachment/showPic?path=" + e.filePath;
        }
      });
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
