<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <!-- <a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')">会议申请</a-button>
          <a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all', 'master')">编辑</a-button>
          <a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')">会议重新申请</a-button>
          <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all','master')">删除</a-button> -->
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.name" placeholder="会议名称" />
              </a-form-item>
              <a-form-item label="">
                <a-select
                  v-model="queryParam.type"
                  placeholder="会议状态"
                  style="width:200px;"
                >
                  <a-select-option
                    v-for="(item, index) in typeList"
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
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="operate" slot-scope="text, record">
          <template>
            <a @click="handleUpload(record)">上报</a>
            <a-divider type="vertical" />
            <a @click="handleDetail(record)">详情</a>
          </template>
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
              :columns="columnsSub"
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
      <web-upload
        ref="createPostModal"
        :visible="subVisible"
        :loading="SubConfirmLoading"
        :data="mdlUserPost"
        @cancel="handleCancel(1)"
        @ok="handleOkUserPost"
      />
    </a-card>
    <detail-form
      ref="detailModal"
      @cancel="
        () => {
          visibleDetail = false;
        }
      "
      :visible="visibleDetail"
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

import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage.vue";
import detailForm from "./detail.vue";
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
  },
  {
    title: "会议室",
    dataIndex: "meetingRoom",
  },
  {
    title: "主办人",
    dataIndex: "creator",
  },
  {
    title: "审批人",
    dataIndex: "participants",
  },
  {
    title: "状态",
    dataIndex: "state",
  },
  {
    title: "操作",
    dataIndex: "operate",
    scopedSlots: {
      customRender: "operate",
    },
  },
];
const columnsSub = [
  {
    title: "#",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "文件名称",
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
    webUpload,
    detailForm,
    previewImage,
  },
  data() {
    this.columns = columns;
    this.columnsSub = columnsSub;
    return {
      queryParam: {},
      queryParamSub: {},
      url: {
        getPageSet: "/office/oaMeetingsBase/meetdone",
        masterAdd: "/office/oaMeetingroomBase/save",
        masterUpdate: "/office/oaMeetingroomBase/update",
        masterDelete: "/office/oaMeetingroomBase/task",
        getDetailByUuid: "/system/attachment/getListByPuuid",
        getDetailBystae: "/office/oaMeetingroomBase/getDetailBystae",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
        updateReport: "/office/oaMeetingsBase/updateReport",
        deleteAttachment: "/system/attachment/delete",
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
            if (res.rows) {
              res.rows.forEach((val) => {
                this.tableList.push(val);
              });
            }
            return res;
          }
        );
      },
      visibleDetail: false,
      subVisible: false,
      SubLoadingUserPost: false,
      mdlUserPost: null,
      SubConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      meetingList: [],
      typeList: [],
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      subSelectedRowKeys: [],
      subRows: "",
      subUUids: "",
      tableList: [],
      imgVisible: false,
      imgPreview: "",
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
      return row.uuid === this.masterUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
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
    handleUpload(record) {
      this.$nextTick(() => {
        console.log("上传", record, this.tableList);
        setTimeout(() => {
          if (this.tableList.length > 0) {
            console.log("1111111111");
            let data = {
              uuid: record.uuid,
            };
            this.$post(this.url.updateReport, data).then((res) => {
              console.log("res", res);
              if (res.statusCode === 200) {
                this.$message.success(res.message);
                this.$refs.masterList.refresh();
                this.$refs.subList.refresh();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            this.$message.info("必须增加会议纪要才能上报");
          }
        }, 300);
      });
    },
    handleDetail(record) {
      console.log("record", record);
      this.visibleDetail = true;
      this.$refs.detailModal.onLoadData(record);
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
      const imgType = ["jpg", "jpeg", "gif", "png"];
      return imgType.find((val) => e.fileType === val);
    },
    // 预览
    handlePreview(e) {
      console.log("e----------------预览", e);
      this.imgPreview = "";
      const imgType = ["jpg", "jpeg", "gif", "png"];
      const type = imgType.find((val) => e.fileType === val);
      if (!type) {
        this.$message.info("pdf");
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
