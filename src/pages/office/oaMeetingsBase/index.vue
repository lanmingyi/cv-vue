<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('master')"
            >会议申请</a-button
          >
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleAplayEdit()"
            >编辑</a-button
          >
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleResetEdit()"
            >会议重新申请</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all', 'master')"
            >删除</a-button
          >
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input
                  v-model="queryParam.meetingRoom"
                  placeholder="会议室名称"
                />
              </a-form-item>
              <a-form-item label="">
                <a-select
                  v-model="queryParam.stateValue"
                  placeholder="会议状态"
                  style="width:200px;"
                >
                  <a-select-option
                    v-for="(item, index) in meetingState"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <div class="table-page-search-submitButtons flex align-center">
                <a-button class="cu-btn-primary" @click="resetForm()"
                  >查询</a-button
                >
                <a-button class="cu-btn-filter" @click="resetSearchForm()"
                  >重置</a-button
                >
              </div>
            </div>
          </a-form>
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
        :rowClassName="rowClassName"
        @rowClick="masterRowClick"
        :pageSize="10"
        :scroll="{ x: 1500, y: 400 }"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
      <a-card :bordered="false">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="附件信息">
            <div class="table-operator">
              <a-button
                class="cu-btn-primary"
                icon="plus"
                @click="handleaddArchivePost"
                >新增</a-button
              >
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleSub('all', 'sub')"
                >删除</a-button
              >
            </div>
            <s-table
              ref="subList"
              rowKey="uuid"
              :columns="subColumns"
              bordered
              :pageSize="10"
              :rowSelection="subRowSelection"
              @rowClick="subRowClick"
              :rowClassName="subRowClassName"
              :scroll="{ x: 'auto', y: 300 }"
              :data="loadDataSub"
            >
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <a
                    @click="
                      () => {
                        download(record.uuid);
                      }
                    "
                    >下载</a
                  >
                  <a-divider type="vertical" />
                  <a v-if="showPreview(record)" @click="handlePreview(record)"
                    >预览</a
                  >
                  <a-divider v-if="showPreview(record)" type="vertical" />
                  <a @click="handleSub(record, 'sub')">删除</a>
                </template>
              </span>
            </s-table>
          </a-tab-pane>
        </a-tabs>
      </a-card>
      <edit-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        :typeList="typeList"
        :meetingList="meetingList"
        @cancel="handleCancel('master')"
        @ok="handleJsonOk('master')"
      />
      <web-upload
        ref="createPostModal"
        :visible="subVisible"
        :loading="SubConfirmLoading"
        :data="mdlUserPost"
        @cancel="handleCancel(1)"
        @ok="handleOkUserPost"
      />
      <preview-image
        :imgSrc="imgPreview"
        :visible="imgVisible"
        @cancel="() => (imgVisible = false)"
      ></preview-image>
    </a-card>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { pdfStreamHandeler } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage.vue";
import editForm from "./edit.vue";
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
    title: "会议名称",
    dataIndex: "name",
  },
  {
    title: "会议类型",
    dataIndex: "type",
    width: 100,
  },
  {
    title: "会议室",
    dataIndex: "meetingRoom",
  },
  {
    title: "开会时间",
    dataIndex: "meetingTime",
  },
  {
    title: "会议截止时间",
    dataIndex: "blocking",
  },
  {
    title: "主办人",
    dataIndex: "creator",
    width: 100,
  },
  {
    title: "审批人",
    dataIndex: "participants",
    width: 100,
  },
  {
    title: "会议内容",
    dataIndex: "content",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "状态",
    dataIndex: "stateValue",
    width: 100,
    scopedSlots: {
      customRender: "stateValue",
    },
  },
];
const subColumns = [
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
    width: 250,
    dataIndex: "fileName",
    ellipsis: true,
  },
  {
    title: "文件大小",
    width: 90,
    dataIndex: "fileSize",
  },
  {
    title: "上传人",
    width: 80,
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
    width: "150px",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    editForm,
    webUpload,
    previewImage,
  },
  data() {
    this.columns = columns;
    this.subColumns = subColumns;
    return {
      queryParam: {},
      queryParamSub: {},
      url: {
        getPageSet: "/office/oaMeetingsBase/task",
        masterAdd: "/office/oaMeetingroomBase/save",
        masterUpdate: "/office/oaMeetingroomBase/update",
        masterDelete: "/office/oaMeetingsBase/deleteBatch",
        getDetailByUuid: "/system/attachment/getListByPuuid",
        getDetailBystae: "/office/oaMeetingroomBase/getDetailBystae",
        jsonUpdate: "/office/oaMeetingsBase/updateSate",
        jsonSave: "/office/oaMeetingsBase/save",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
        deleteAttachment: "/system/attachment/delete",
      },
      urlpdf: {
        pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      loadDataSub: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.queryParamSub
        );
        return this.$post(this.url.getDetailByUuid, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      subVisible: false,
      SubLoadingUserPost: false,
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: null,
      masterConfirmLoading: false,
      SubConfirmLoading: false,
      meetingList: [],
      typeList: [],
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      subSelectedRowKeys: [],
      subRows: "",
      subUUids: "",
      imgVisible: false,
      imgPreview: "",
      meetingState: [],
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
    subRowSelection() {
      return {
        selectedRowKeys: this.subSelectedRowKeys,
        onChange: this.onSelectChangeSub,
      };
    },
  },
  mounted() {
    this.getCodeList();
  },
  methods: {
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    subRowClassName(row) {
      return row.uuid === this.subUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    masterRowClick(record, index) {
      this.masterRows = record;
      this.masterUuids = record.uuid;
      this.queryParamSub.puuid = record.uuid;
      this.queryParamSub.page = this.queryParamSub.page
        ? this.queryParamSub.page
        : "1";
      this.queryParamSub.rows = this.queryParamSub.pageSize
        ? this.queryParamSub.pageSize
        : "10";
      this.$refs.subList.refresh();
    },
    subRowClick(record, index) {
      this.subRows = record;
      this.subUuids = record.uuid;
    },
    handleAplayEdit() {
      console.log("this.masterRows", this.masterRows);
      if (this.masterRows) {
        if (
          this.masterRows &&
          this.masterRows.state === "meeting.foundation.state01"
        ) {
          //'申请中'
          this.handleEdit("all", "master");
        } else {
          this.$message.info("请选择申请中的会议数据");
        }
      } else {
        this.$message.info("请选择操作的会议数据");
      }
    },
    handleResetEdit() {
      console.log("this.masterRows", this.masterRows);
      if (this.masterRows) {
        if (
          this.masterRows &&
          this.masterRows.state === "meeting.foundation.state07"
        ) {
          //'驳回'
          this.$refs.masterModal.reset();
          this.handleEdit("all", "master");
        } else {
          this.$message.info("请选择被驳回的会议数据");
        }
      } else {
        this.$message.info("请选择操作的会议数据");
      }
    },
    resetForm() {
      this.$refs.masterList.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.masterList.refresh();
    },
    getCodeList() {
      // 获取会议类型
      this.$post(this.url.getDicItemByCode, {
        code: "meetingsType",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.typeList = res;
        }
      });
      // 会议状态
      this.$post(this.url.getDicItemByCode, {
        code: "meetingstate",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.meetingState = res;
        }
      });
      // 获取会议室
      this.$post(this.url.getDetailBystae).then((res) => {
        if (res.statusCode !== 300) {
          this.meetingList = res;
        }
      });
    },
    handleaddArchivePost() {
      if (!this.queryParamSub.puuid) {
        this.$message.info("请先选择用户数据");
      } else {
        this.mdlUserPost = {
          puuid: this.queryParamSub.puuid,
        };
        this.subVisible = true;
      }
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createPostModal.add(this.mdlUserPost);
    },
    handleOkUserPost() {
      this.subLoadingUserPost = true;
      this.subVisible = false;
      const formUserPost = this.$refs.createPostModal.form;
      formUserPost.resetFields();
      this.$refs.subList.refresh();
    },
    showPreview(e) {
      const imgType = ["jpg", "jpeg", "gif", "png", "pdf"];
      return imgType.find((val) => e.fileType === val);
    },
    // 预览
    handlePreview(e) {
      console.log("e----------------预览", e);
      this.imgPreview = "";
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
    },
  },
};
</script>

<style lang="less">
.rowColorRed {
  background-color: #ffd2d2;
}
.ant-tag-blue {
  color: white;
  background: #009688;
  border-color: #009688;
}

.ant-tag-red {
  color: white;
  background: #ff5722;
  border-color: #ff5722;
}
</style>
