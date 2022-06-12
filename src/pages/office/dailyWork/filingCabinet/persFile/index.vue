<template>
  <div class="container">
    <a-col :md="8" :sm="24">
      <a-card :bordered="false">
        <div
          class="toolbar flex justify-between flex-wrap"
          style="width: 100%;"
        >
          <div class="table-operator">
            <a-button
              class="cu-btn-primary"
              icon="plus"
              @click="handleAdd('master')"
              >新增文件夹</a-button
            >
            <a-button
              class="cu-btn-default"
              icon="edit"
              @click="handleEdit('all', 'master')"
              >编辑</a-button
            >
            <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub('all', 'master')"
              >删除</a-button
            >
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
          @rowClick="masterRowClick"
          :rowClassName="rowClassName"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
        </s-table>
        <master-form
          ref="masterModal"
          :visible="masterVisible"
          :loading="masterConfirmLoading"
          :model="masterMdl"
          @cancel="handleCancel('master')"
          @ok="handleOk('master')"
        />
      </a-card>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :bordered="false">
        <div
          class="toolbar flex justify-between flex-wrap"
          style="width: 100%;"
        >
          <div class="table-operator">
            <a-button
              class="cu-btn-primary"
              icon="plus"
              @click="handleaddArchivePost"
              >多文件上传</a-button
            >
            <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub('all', 'sub')"
              >删除</a-button
            >、
            <a-button class="cu-btn-default" icon="edit">共享</a-button>
          </div>
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <div class="flex justify-between flex-wrap">
                <a-form-item label="">
                  <a-input
                    v-model="queryParam.trainName"
                    placeholder="文件名"
                  />
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
              <a>共享</a>
            </template>
          </span>
        </s-table>
      </a-card>
    </a-col>
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
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { pdfStreamHandeler } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage.vue";
import masterForm from "./edit.vue";
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
    title: "文件名",
    dataIndex: "postName",
  },
  {
    title: "排序",
    dataIndex: "sortId",
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
    title: "共享用户",
    width: 80,
    dataIndex: "creator",
  },
  {
    title: "创建时间",
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
    webUpload,
    previewImage,
    masterForm,
  },
  data() {
    this.columns = columns;
    this.subColumns = subColumns;
    return {
      queryParam: {},
      queryParamSub: {},
      queryParamTrainee: {},
      url: {
        getPageSet: "/system/topicBase/getPageSet",
      },
      urlpdf: {
        pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            var list = {
              pageNo: 1,
              pageSize: 10,
              rows: [
                {
                  sortId: "1",
                  name: "管理员",
                  trainStartTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  status: "礼仪",
                  postName: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7807",
                  trainContent: "示例执行器123",
                },
                {
                  sortId: "2",
                  name: "管理员",
                  trainStartTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  status: "礼仪",
                  postName: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型",
                  uuid: "97c3c7800c254e38955603206ba1285d",
                  trainContent:
                    "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型123",
                },
              ],
              totalCount: 1,
              totalPage: 1,
            };
            return list;
          }
        );
      },
      loadDataSub: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.queryParamSub
        );
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            var list = {
              pageNo: 0,
              pageSize: 0,
              rows: [
                {
                  fileSize: "20kb",
                  creator: "管理员",
                  trainStartTime: "2018-06-12 08:49:01",
                  creatorTime: "2018-06-12 10:49:01",
                  status: "礼仪",
                  fileName: "示例执行器.pdf",
                  uuid: "F9BF6730AC374624AAB327B49EBA7807",
                  trainContent: "示例执行器123",
                },
              ],
              totalCount: 0,
              totalPage: 0,
            };
            return list;
          }
        );
      },
      key: 1,
      subVisible: false,
      SubLoadingUserPost: false,
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: null,
      masterConfirmLoading: false,
      SubConfirmLoading: false,
      trainList: [
        {
          text: "礼仪",
          value: "礼仪",
        },
      ],
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
  mounted() {},
  methods: {
    changTabs(key) {
      var that = this;
      that.key = Number(key);
      that.$nextTick(() => {
        setTimeout(() => {
          if (that.key === 1 && that.$refs.subList) {
            console.log("this.queryParamSub====", that.queryParamSub);
            that.$refs.subList.refresh(); // 设置刷新子表
          } else if (that.key === 2 && that.$refs.traineeList) {
            that.queryParamTrainee = {};
            that.queryParamTrainee = Object.assign({}, that.queryParam);
            that.$refs.traineeList.refreshList(that.queryParamTrainee); // 设置刷新子表
          }
        }, 10);
      });
    },
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
      if (this.key === 1 && this.$refs.subList) {
        this.$refs.subList.refresh();
      } else if (this.key === 2 && this.$refs.traineeList) {
        this.$refs.traineeList.refreshList(this.queryParamSub);
      }
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
    handleaddArchivePost() {
      console.log("this.queryParamSub", this.queryParamSub);
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
