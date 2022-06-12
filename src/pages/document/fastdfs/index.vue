<template>
  <a-row :gutter="10">
    <a-col :md="6" :sm="24">
      <a-card :bordered="false">
        <tree-grid
          ref="masterList"
          :columns="columns"
          rowKey="uuid"
          :url="url"
          :parameter="parameter"
          :formatConditions="false"
          :showSearch="false"
          @rowClick="
            (e) => {
              masterRowClick(e, { puuid: 'id' });
            }
          "
        ></tree-grid>
      </a-card>
    </a-col>
    <a-col :md="18" :sm="24">
      <a-card :bordered="false">
        <tool-bar>
          <template slot="toolBtn" slot-scope="scope">
            <a-button
              class="cu-btn-primary"
              icon="upload"
              @click="handleUpLoad"
              v-action:fastdfsUploadDialog
              >上传</a-button
            >
            <a-button
              class="cu-btn-default"
              icon="edit"
              @click="
                handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
              "
              v-action:fastdfsEditDialog
              >编辑</a-button
            >
            <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
              v-action:fastdfsDelDialog
              >删除</a-button
            >
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
          <span slot="fileName" slot-scope="{ text, record }">
            <template>
              <t-ellipsis :value="text">
                <template slot="content">
                  <icon-fonts
                    :icon="getIconFonts(text)"
                    style="margin-right: 5px;"
                  />
                  <a @click="handleDownloadDfs(record.url, record.fileName)">{{
                    text | ellipsis(30)
                  }}</a>
                </template>
              </t-ellipsis>
            </template>
          </span>
          <span slot="action" slot-scope="{ text, record }">
            <template>
              <a
                v-if="showPreview(record)"
                @click="
                  () => {
                    handlePreview(record);
                  }
                "
                >预览</a
              >
              <a-divider type="vertical" v-if="showPreview(record)" />
              <a
                @click="
                  () => {
                    handleDownloadDfs(record.url, record.fileName);
                  }
                "
                >下载</a
              >
              <!-- <template v-if="showTypePreview(record)">
                <a-divider type="vertical" />
                <a @click="getViewUrlWebPath(record)">在线编辑</a>
              </template> -->
              <a-divider type="vertical" />
              <a @click="handleSub(record, 'sub')">删除</a>
            </template>
          </span>
        </data-grid>
        <editDic-form
          ref="subModal"
          :visible="subVisible"
          :loading="subConfirmLoading"
          :model="subMdl"
          @cancel="handleCancel('sub')"
          @ok="handleOk('sub')"
        />
        <web-upload
          ref="createPostModal"
          :visible="visibleFile"
          :url="url.webUpload"
          :loading="confirmLoadingUserPost"
          :model="mdlUserPost"
          @cancel="handleCancel(1)"
          @ok="handleOkFile"
        />
        <previewImage
          :imgSrc="imgPreview"
          :visible.sync="imgVisible"
        ></previewImage>
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import { DataGrid, TreeGrid, Ellipsis } from "@/components";
import { pdfStreamHandeler } from "@/services/common";
import editDicForm from "./edit.vue";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import Accessory from "@/components/TopVUI/accessory/index";
import editForm from "./edit.vue";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage";
import { baseUrl } from "@/services/baseUrl.js";
import { getIconFont, getTypeByList, fileSuffix } from "@/utils/util";
import store from "@/store";
import { downloadDfs } from "@/utils/TopVUI.js";
import "@/utils/filter";
export default {
  mixins: [treeGridMixin],
  components: {
    DataGrid,
    editDicForm,
    TreeGrid,
    webUpload,
    previewImage,
    Ellipsis,
  },
  data() {
    return {
      columns: [
        {
          title: "分类名称",
          dataIndex: "text",
        },
      ],
      subColumns: [
        {
          title: "文件名称",
          dataIndex: "fileName",
          scopedSlots: { customRender: "fileName" },
          customCell: (record, rowIndex) => {
            return {
              style: "color: #1890ff",
            };
          },
          width: 300,
          ellipsis: true,
        },
        {
          title: "文件大小",
          dataIndex: "fileSize",
          width: 120,
          sorter: true,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          sorter: true,
          width: 120,
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 220,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
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
        fathersUrl: "/system/channel/getChannelsByPid",
        expandUrl: "/system/channel/getChannelsByPid",
        subList: "/document/fastdfs/getPageSet",
        subSave: "/document/fastdfs/save",
        subUpdate: "/document/fastdfs/update",
        subDelete: "/document/fastdfs/deleteBatch",
        webUpload: "/document/fdfs/upload",
        pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
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
        father: { pid: 3 },
        children: {},
      },
      visibleFile: false,
      confirmLoading: false,
      confirmLoadingUserPost: false,
      imgVisible: false,
      imgPreview: "",
      mdlUserPost: null,
    };
  },
  activated() {},
  mounted() {},
  methods: {
    getIconFonts(text) {
      return getIconFont(text);
    },
    // 上传
    handleUpLoad() {
      this.visibleFile = true;
      const form = this.$refs.createPostModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.mdlUserPost = this.subQueryParam;
      this.$refs.createPostModal.add(this.mdlUserPost);
    },
    handleCancel() {
      this.confirmLoadingUserPost = false;
      this.visibleFile = false;
      this.subVisible = false;
    },
    handleOkFile() {
      const formUserPost = this.$refs.createPostModal.form;
      this.confirmLoadingUserPost = false;
      this.visibleFile = false;
      formUserPost.resetFields();
      this.$refs.subList.refresh();
    },
    showPreview(e) {
      const imgType = [".jpeg", ".gif", ".png", ".jpg", ".pdf"];
      // for (var i=0; i<=imgType.length; i++) {
      //     let index = e.fileName.indexOf(imgType[i])
      //     if(index > 0){
      // 	  return true
      //       break;
      //     }
      // }
      return getTypeByList(imgType, e.fileName);
    },
    // 预览
    handlePreview(e) {
      this.imgPreview = "";
      this.$nextTick(() => {
        let type = e.fileName.indexOf(".pdf");
        if (type > 0) {
          // pdfStreamHandeler(this.url.pdfStreamHandeler, {
          //   uuid: e.uuid,
          //   filePath: e.filePath,
          // }).then((res) => {
          //   var binaryData = [];
          //   binaryData.push(res);
          //   const blob = new Blob(binaryData, {
          //     type: "application/pdf;charset-UTF-8",
          //   });
          //   const objectUrl = window.URL.createObjectURL(blob);
          //   window.open("./statics/pdf/web/viewer.html?file=" + objectUrl);
          // });
          window.open(e.url);
        } else {
          this.imgVisible = true;
          this.imgPreview = e.url;
        }
      });
    },
    // 判断是否显示在线编辑按钮
    showTypePreview(e) {
      return getTypeByList(fileSuffix, e.url);
    },
    // 在线编辑
    getViewUrlWebPath(record) {
      console.log(record);
      // let url = 'https://' + record.bucketName + '.' + record.endpoint + '/' + record.key;
      let url = "https://34c09h5190.wicp.vip/" + record.url;
      //let url = 'http://192.168.1.216/' + record.url;
      let reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
      if (!reg.test(url)) {
        this.$message.info("请输入正确的file url！");
        return;
      }
      const fileName = url;
      const fileStrArr = fileName.split(".");
      const suffix = fileStrArr[fileStrArr.length - 1];

      let result = fileSuffix.some((item) => {
        return item === suffix;
      });

      if (!result) {
        this.$message.info("不支持该文件类型");
        return;
      }
      this.loading = true;
      const params = {
        fileUrl: url,
        uuid: record.uuid,
        uploadType: "fdfs",
      };
      this.$post("/document/wps/getViewUrlWebPath", params, null)
        .then((res) => {
          store.commit("SET_WPSURL", res.Token.wpsUrl);
          localStorage.setItem("wpsUrl", res.Token.wpsUrl);
          const jump = this.$router.resolve({ name: "viewFile" });
          window.open(jump.href, "_blank");
        })
        .catch(() => {
          this.$message.info("请求错误！");
          this.loading = false;
        });
    },
    handleDownloadDfs(url, fileName) {
      downloadDfs(url, fileName);
    },
  },
};
</script>

<style scoped="scoped">
.table-operator {
  margin-left: 18px;
}

.ant-table-tbody > tr > td:last-child {
  padding: 16px 16px;
}
</style>
