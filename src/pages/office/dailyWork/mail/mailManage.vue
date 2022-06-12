<template>
  <div class="container">
    <a-card :bordered="false">
      <a-tabs default-active-key="1" tab-position="left">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="folder" />
            文件夹管理
          </span>
          <div
            class="toolbar flex justify-between flex-wrap"
            style="width: 100%;"
          >
            <div class="table-operator">
              <a-button
                class="cu-btn-primary"
                icon="plus"
                @click="handleAdd('master')"
                >新建</a-button
              >
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleSub('all', 'master')"
                >清空</a-button
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
            :rowClassName="rowClassName"
            @rowClick="masterRowClick"
            :pageSize="10"
            :scroll="{ y: 400 }"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="operate" slot-scope="text, record">
              <template>
                <a @click="handleEdit(record, 'master')">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleSub(record, 'master')">删除</a>
              </template>
            </span>
          </s-table>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="pushpin" />
            自动回复
          </span>
          <a-checkbox @change="onChange">
            启用自动回复
          </a-checkbox>
          <div v-show="showAutoReply">
            <a-col :span="6">
              自动回复内容：
            </a-col>
            <a-col :span="18">
              <Editor
                :value="autoReplyContent"
                style="text-align:left"
                @onchange="changeAutoReplyEditor"
              ></Editor>
            </a-col>
          </div>
        </a-tab-pane>
      </a-tabs>
      <edit-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @ok="handleJsonOk('master')"
      />
    </a-card>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { pdfStreamHandeler } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./edit.vue";
import Editor from "@/components/TopVUI/custom/Editor/index.vue";
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
    title: "序号",
    dataIndex: "officialDocNo",
    ellipsis: true,
  },
  {
    title: "文件夹名称",
    dataIndex: "applicant",
    ellipsis: true,
  },
  {
    title: "未读/总邮件数",
    dataIndex: "status",
  },
  {
    title: "占用空间",
    dataIndex: "collectTime",
  },
  {
    title: "操作",
    dataIndex: "operate",
    scopedSlots: {
      customRender: "operate",
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    editForm,
    Editor,
  },
  data() {
    this.columns = columns;
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
                  officialDocNo: "8",
                  applicant: "张三三",
                  unit: "财务部",
                  assetName: "电脑",
                  collectTime: "2018-06-12 08:49:01",
                  buyDepartment: "财务部",
                  assetStatus: "设备",
                  assetsValues: "4999",
                  status: "通知",
                  title: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型",
                  uuid: "97c3c7800c254e38955603206ba1285d",
                },
                {
                  assetId: "8",
                  unit: "研发部",
                  applicant: "张三三",
                  assetName: "电脑",
                  collectTime: "2018-06-12 08:49:01",
                  assetStatus: "设备",
                  officialDocNo: "4999",
                  buyDepartment: "财务部",
                  status: "通知",
                  title: "杨幂女儿太厉害，才4岁就看纯英文动画片",
                  uuid: "bd85830e4a2c4ffaaa229ad76791adae",
                },
                {
                  assetId: "8",
                  unit: "人事部",
                  applicant: "张三三",
                  assetName: "电脑",
                  collectTime: "2018-06-12 08:49:01",
                  assetStatus: "设备",
                  officialDocNo: "4999",
                  buyDepartment: "财务部",
                  status: "通知",
                  title: "7步搞定4㎡卫生间装修，又省钱又上档次",
                  uuid: "93c3e68af6654bd5a3290a5b24751bbe",
                },
              ],
              totalCount: 1,
              totalPage: 1,
            };
            return list;
          }
        );
      },
      key: 1,
      subVisible: false,
      SubLoadingUserPost: false,
      SubConfirmLoading: false,
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: null,
      masterConfirmLoading: false,
      detailConfirmLoading: false,
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
      visibleDetail: false,
      /* 自动回复内容 */
      showAutoReply: false,
      autoReplyContent: "",
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
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
      if (e.target.checked) {
        this.showAutoReply = true;
      }
    },
    changeEditor(e) {
      this.autoReplyContent = e;
    },
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
    handleDetailCancel() {
      this.visibleDetail = false;
    },
    handleDetailOk() {
      this.visibleDetail = false;
    },
    handleBrowse(record) {
      this.visibleDetail = true;
      let form = {};
      form = this.$refs.detailModal.form;
      form.resetFields();
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
