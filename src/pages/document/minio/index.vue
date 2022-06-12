<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:30%">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="upload"
            @click="handleAddBucket()"
            v-action:minioAddDialog
            >新增
          </a-button>
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSubBucket()"
            v-action:minioStorageSpaceDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <div style="height: calc(100% - 40px);">
        <s-table
          ref="table"
          size="small"
          :columns="columns"
          :data="loadData"
          bordered
          rowKey="name"
          :showPagination="false"
          :rowSelection="rowSelection"
          @rowClick="rowClick"
          :rowClassName="rowClassName"
        >
        </s-table>
      </div>
    </div>
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="upload"
            @click="handleUpLoad()"
            v-action:minioUploadDialog
          >
            批量上传</a-button
          >
         <!-- <a-button
              class="cu-btn-primary"
              icon="upload"
              @click="handleQueue()"
              >加入队列</a-button
            > -->
          <a-button
            class="cu-btn-orange"
            icon="rollback"
            @click="handleBack()"
            v-action:minioBackDialog
            >返回
          </a-button>
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all', 1)"
            v-action:minioFileDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <div style="height: calc(100% - 40px - 40px);">
        <a-table
          ref="subList"
          size="small"
          :columns="columnsDicItem"
          :data-source="dataSource"
          bordered
          :rowSelection="rowSelectionDic"
          rowKey="uuid"
          showPagination="auto"
          :pagination="pagination"
          @change="handleTableChange"
          :scroll="scrollXY"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="fileName" slot-scope="text, record">
            <template v-if="record.directory">
              <icon-fonts icon="icon-wenjianjia" />
              <a @click="handleLoadData(record)">
                {{ text | objectNameFilter }}</a
              >
            </template>
            <template v-else>
              <t-ellipsis :value="text">
                <template slot="content">
                  <icon-fonts :icon="getIconFonts(record.fileName)" />
                  <a
                    @click="
                      () => {
                        handleDownLoad(record);
                      }
                    "
                  >
                    {{ text | objectNameFilter }}</a
                  >
                </template>
              </t-ellipsis>
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <template v-if="!record.directory">
              <!-- <a
				          v-if="showPreview(record)"
				          @click="
				            () => {
				              handlePreview(record);
				            }
				          "
				          >预览</a
				        >
				        <a-divider v-if="showPreview(record)" type="vertical" /> -->
              <!-- <a
				          v-if="!showQueue(record)"
				          @click="
				            () => {
				              handleQueue(record);
				            }
				          "
				          >加入队列</a
				        >
				        <a-divider v-if="!showQueue(record)" type="vertical" /> -->
              <a
                v-if="showPreview(record)"
                @click="
                  () => {
                    handleOnlinePreview(record);
                  }
                "
                >预览</a
              >
              <a-divider v-if="showPreview(record)" type="vertical" />
              <a @click="handleView(record)">分享</a>
              <a-divider type="vertical" />
              <a @click="handleDownLoad(record)">下载</a>
            </template>
          </span>
        </a-table>
      </div>
      <edit-form
        ref="createModal"
        :visible.sync="visible"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOkBucket"
      />
      <editDic-form
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="mdlDic"
        @cancel="handleCancel(1)"
        @ok="handleOkDic()"
      />
      <web-upload
        ref="createPostModal"
        :visible="visibleFile"
        :data="fileData"
        :url="url.webUpload"
        @cancel="handleCancel(2)"
        @ok="handleOkFile"
      />
      <previewImage
        :imgSrc="imgPreview"
        :visible.sync="imgVisible"
      ></previewImage>
      <shareModal :visible.sync="shareVisible" ref="shareModal"></shareModal>
      <previewModal
        :visible.sync="previewVisible"
        :loading="previewLoading"
        ref="previewModal"
      ></previewModal>
      <!-- <t-modal
          title="Title"
          :visible="visibleVideo"
          @ok="
            () => {
              visibleVideo = false;
            }
          "
          @cancel="
            () => {
              visibleVideo = false;
            }
          "
        >
          <video width="320" height="240" controls>
            <source :src="videoUrl" type="video/mp4" />
            您的浏览器不支持Video标签。
          </video>
        </t-modal> -->
    </div>
  </div>
</template>

<script>
import { STable, Ellipsis } from "@/components";
import editForm from "./edit.vue";
import { dataListMixin } from "@/mixins/dataListMixin";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import editDicForm from "./editDicItem.vue";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage";
import shareModal from "./shareModal"; //分享
import previewModal from "./previewModal"; //预览
import { downloadMinio } from "@/utils/TopVUI";
import { baseUrl } from "@/services/baseUrl.js";
import { getToken } from "@/utils/TopVUI";
import { mapGetters } from "vuex";
import { pdfStreamHandeler, videoStreamHandeler } from "@/services/common";

import {
  submitForm,
  GetUrlParam,
  getIconFont,
  getTypeByList,
  fileSuffix,
  kkFileViewType,
} from "@/utils/util";
import store from "@/store";
import { setTimeout } from "timers";
const columns = [
  {
    title: "存储空间",
    dataIndex: "name",
  },
];
const columnsDicItem = [
  {
    title: "#",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "文件名",
    dataIndex: "fileName",
    scopedSlots: {
      customRender: "fileName",
    },
    customCell: (record, rowIndex) => {
      return {
        style: "color: #1890ff",
      };
    },
  },
  {
    title: "大小",
    width: 80,
    dataIndex: "sizeText",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 220,
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataListMixin, simpleListMixin],
  components: {
    STable,
    Ellipsis,
    editForm,
    editDicForm,
    webUpload,
    previewImage,
    shareModal,
    previewModal,
  },
  data() {
    this.columns = columns;
    this.columnsDicItem = columnsDicItem;
    return {
      // create model
      visible: false,
      visibleView: false,
      subVisible: false,
      visibleFile: false,
      shareVisible: false, //分享
      previewVisible: false,
      subConfirmLoading: false,
      visibleVideo: false,
      previewLoading: false,
      mdl: null,
      mdlDic: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      queryParamDicItem: {},
      url: {
        webUpload: "/document/minio/uploadfile",
        getBucketList: "/document/minio/listBuckets",
        getOssBucketList: "/document/minio/listFiles",
        subAdd: "/document/oss/saveCatalog",
        delFile: "/document/minio/deleteFile",
      },
      ifamSrc: "",
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getBucketList, requestParameters).then(
          (res) => {
            const list = {};
            list.pageNo = 1;
            list.pageSize = 20;
            list.rows = [];
            list.totalCount = res.length;
            list.totalPage = Math.ceil(res.length / 20);
            if (res.statusCode != 300) {
              res.data.forEach((e) => {
                list.rows.push({
                  name: e,
                });
              });
              this.queryParamDicItem.bucket = list.rows[0].name;
            }
            this.fetch();
            return list;
          }
        );
      },
      dataSource: [],
      pagination: {
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: false,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      selectedRowKeysDic: [],
      selectedRowsDic: [],
      masterUuids: "",
      dicUuids: "",
      info: "",
      uuidName: "",
      fileData: {},
      delData: {},
      visibleNewFile: false,
      fileMdl: null,
      fileCatalog: null,
      destinationKey: "",
      destinationBucketName: "",
      tabelLoading: false,
      subConfirmLoadingNewFile: false,
      imgVisible: false,
      imgPreview: "",
      fileUrl: "",
      videoUrl: "",
      pageClientHeight: 0,
    };
  },
  filters: {
    objectNameFilter(val) {
      const objectNameMap = val.split("/")[0];
      return val;
    },
  },
  computed: {
    ...mapGetters(["configData"]),
    rowSelection() {
      return {
        type: "radio",
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
    rowSelectionDic() {
      return {
        selectedRowKeys: this.selectedRowKeysDic,
        onChange: this.onSelectChangeDic,
      };
    },
    kkFileView() {
      let index = this.configData.findIndex(
        (item) => item.code === "kkFileView"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "http://192.168.1.216:8012/onlinePreview";
      }
    },
    // 表格竖向滚动条设置  这里是根据每页数据条数大于等于20的时候出现滚动条
    scrollXY() {
      let height = "";
      height = this.pageClientHeight - 40 - 40 - 22 - 35;
      const tdHeight = this.dataSource?.length * 40 ?? 0;
      return this.dataSource?.length >= 20 || height < tdHeight
        ? { y: height }
        : {};
    },
  },
  // 组件销毁时移除监听事件
  beforeDestroy() {
    this.destroyResizeEvent();
  },
  mounted() {
    // this.fetch();
    this.resizeHandler();
    this.initResizeEvent();
  },
  methods: {
    // 重新调整表格高度
    resizeHandler() {
      // 获取页面内容的高度
      this.pageClientHeight = document.getElementsByClassName(
        "page-common-content"
      )[0]?.clientHeight;
    },
    // 新增++
    handleAddBucket() {
      let form = this.$refs.createModal.form;
      form.resetFields();
      this.visible = true;
    },
    // 创建桶
    handleOkBucket() {
      let form = this.$refs.createModal.form;
      let url = "";
      form.validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true;
          this.$post("/document/minio/createBucket", values)
            .then((res) => {
              if (res === 1 || res.statusCode === 200) {
                this.visible = false;
                this.$refs.table.refresh();
                this.$message.success(res.message, 1.5);
              } else {
                this.$message.error(res.message, 1.5);
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      });
    },
    // 删除
    handleSubBucket(record, type) {
      const that = this;
      if (that.masterSelectedRowKeys.length === 0) {
        that.$message.warn("请先勾选需要的删除的数据");
        return true;
      }
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          that
            .$post("/document/minio/deleteBucket", {
              bucket: that.masterSelectedRowKeys.toString(),
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.table.refresh();
                that.masterSelectedRowKeys = [];
              } else {
                that.$message.info(res.message);
              }
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    // 获取列表
    fetch(params) {
      this.$post(this.url.getOssBucketList, this.queryParamDicItem).then(
        (res) => {
          const pager = {
            ...this.pagination,
          };
          pager.total = res.data.length;
          this.dataSource = res.data;
          // this.cacheData = res.rows
          this.cacheData = JSON.parse(JSON.stringify(res.data));
          // this.destinationKey = res.keyPrefix;
          this.pagination = pager;
        }
      );
    },
    // 返回
    handleBack() {
      delete this.queryParamDicItem["prefix"];
      this.$refs.subList.selectedRowKeys = [];
      this.fetch();
    },
    // 字体图标匹配
    getIconFonts(text) {
      return getIconFont(text);
    },
    rowClassName(row) {
      return row.name === this.info?.name ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 行点击事件
    rowClick(record, rows) {
      console.log(record, rows);
      const that = this;
      that.info = record;
      // that.masterSelectedRowKeys = record;
      // that.masterSelectedRows = rows;
      that.selectedRowKeysDic = [];
      that.queryParamDicItem.bucket = record.name;
      that.queryParamDicItem.prefix = "";
      that.fileData = that.queryParamDicItem;
      that.fetch();
    },
    handleLoadData(record) {
      this.queryParamDicItem.prefix = record.fileName;
      this.fetch();
    },
    // 新增目录
    handleAddDic() {
      if (!this.info) {
        this.$message.info("请先选中左侧表格的数据");
      } else {
        var mdlData = {
          bucketName: this.info.name,
          endpoint: this.info.extranetEndpoint,
          keyPrefix: this.info.keyPrefix,
        };
        if (this.queryParamDicItem.keyPrefix) {
          this.mdlDic = this.queryParamDicItem;
        } else {
          this.mdlDic = mdlData;
        }
        this.subVisible = true;
      }
      const form = this.$refs.subModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handleOkDic: function() {
      let form = this.$refs.subModal.form;
      let url = "";

      form.validateFields((errors, values) => {
        if (!errors) {
          this.subConfirmLoading = true;
          if (values.uuid) {
            url = this.url.subUpdate;
          } else {
            url = this.url.subAdd;
          }
          this.$post("/document/minio/getPresignedObjectUrl", values)
            .then((res) => {
              if (res.statusCode !== 300) {
                // this.subVisible = false;
                this.$refs.subModal.value = res;
                // this.shareVisible = true;
              } else {
                this.$message.error(
                  res.message ? res.message : "操作失败",
                  1.5
                );
              }
            })
            .finally(() => {
              this.subConfirmLoading = false;
            });
        }
      });
    },
    handleUpLoad() {
      if (this.fileData.bucket) {
        this.visibleFile = true;
        this.$refs.createPostModal.add();
      } else {
        this.$message.info("请先选中需要操作的数据");
        return true;
      }
    },
    // 预览
    handleView(e) {
      const form = this.$refs.subModal.form;
      form.resetFields();
      this.mdlDic = {
        bucket: this.queryParamDicItem.bucket,
        objectName: e.fileName,
      };
      this.subVisible = true;
      this.$refs.subModal.value = "";
    },
    handleOkFile() {
      this.visibleFile = false;
      this.fetch();
    },
    // 取消
    handleCancel(type) {
      if (type === 0) {
        this.visible = false;
      } else if (type === 1) {
        this.subVisible = false;
      } else {
        this.visibleFile = false;
      }
    },
    // 删除
    handleSub(record, type) {
      const that = this;
      let masterUuids = "";
      if (that.selectedRowKeysDic.length === 0) {
        that.$message.warn("请先勾选需要的删除的数据");
        return true;
      } else {
        masterUuids = that.delData;
      }
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          that.$post(that.url.delFile, masterUuids).then((res) => {
            if (res.statusCode === 200) {
              that.$message.success(res.message);
              that.fetch();
              that.masterUuids = "";
              that.selectedRowKeysDic = [];
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
    // 下载
    handleDownLoad(e) {
      downloadMinio(this.queryParamDicItem.bucket, e.fileName);
    },
    // 行勾选事件
    onSelectChangeDic(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.delData.bucket = this.queryParamDicItem.bucket;
          this.delData.objectName = e.fileName;
        } else {
          this.delData.objectName = this.delData.objectName + "," + e.fileName;
        }
      });
      this.selectedRowKeysDic = selectedRowKeys;
      this.selectedRowsDic = selectedRows;
    },
    // 图片预览筛选
    showPreview(e) {
      // const imgType = [".jpeg", ".gif", ".png", ".jpg", ".pdf"];
      const imgType = kkFileViewType;
      return getTypeByList(imgType, e.fileName);
    },
    showQueue(e) {
      const imgType = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".mp3",
        ".wav",
        ".mp4",
        ".flv",
        ".jpeg",
        ".gif",
        ".png",
        ".jpg",
      ];
      return getTypeByList(imgType, e.fileName);
    },
    handleQueue(e) {
      if (this.selectedRowsDicl.length === 0) {
        this.$message.warn("请先勾选需要操作的数据");
      } else {
        let url = [];
        this.selectedRowsDic.forEach((res) => {
          url.push(
            this.kkFileView +
              "/" +
              this.queryParamDicItem.bucket +
              "/" +
              res.fileName
          );
        });
      }
      // const that = this;
      // console.log(
      //   this.kkFileView + "/" + this.queryParamDicItem.bucket + "/" + e.fileName
      // );
      // const qw =
      //   that.kkFileView +
      //   "/addTask?url=" +
      //   that.kkFileView +
      //   "/" +
      //   that.queryParamDicItem.bucket +
      //   "/" +
      //   e.fileName;
      // console.log(qw);
      // setTimeout(function() {
      //   that.$message.error("操作成功！");
      // }, 1000);
    },
    handlePreview(e) {
      this.imgPreview = "";
      this.$nextTick(() => {
        let type = e.fileName.indexOf(".pdf");
        if (type > 0) {
          pdfStreamHandeler("/document/minio/pdfStreamHandeler", {
            fileuUrl: this.queryParamDicItem.bucket + "/" + e.fileName,
          }).then((res) => {
            if (res.statusCode !== 300) {
              var binaryData = [];
              binaryData.push(res);
              const blob = new Blob(binaryData, {
                type: "application/pdf;charset-UTF-8",
              });
              const objectUrl = window.URL.createObjectURL(blob);
              window.open("./statics/pdf/web/viewer.html?file=" + objectUrl);
              // this.pdfUrl = objectUrl;
            } else {
              this.$message.error(
                res.message ? res.message : "获取资源失败！",
                1.5
              );
            }
          });
        } else {
          this.imgVisible = true;
          this.imgPreview =
            baseUrl +
            "/document/minio/showPic?fileuUrl=" +
            this.queryParamDicItem.bucket +
            "/" +
            e.fileName;
        }
      });
    },
    handleOnlinePreview(e) {
      this.$refs.previewModal.fileUrl = "";
      this.$nextTick(() => {
        // window.open(
        //   this.kkFileView +
        //     "?url=" +
        //     encodeURIComponent(Base64.encode(res)) +
        //     "&token=" +
        //     getToken()
        // );
        const medieaType = [".jpg", ".jpeg", ".png", ".gif"];
        const videoType = [".mp3", ".wav", ".mp4", ".flv"];
        const flag = getTypeByList(medieaType, e.fileName);
        const video = getTypeByList(videoType, e.fileName);
        if (flag) {
          // window.open(
          //   this.kkFileView +
          //     "?url=" +
          //     encodeURIComponent(Base64.encode(res)) +
          //     "&token=" +
          //     getToken(),
          //   "_blank"
          // );
          this.imgVisible = true;
          this.imgPreview =
            baseUrl +
            "/document/minio/showPic?fileuUrl=" +
            this.queryParamDicItem.bucket +
            "/" +
            e.fileName;
        } else if (video) {
          this.previewVisible = true;
          this.previewLoading = true;
          pdfStreamHandeler("/document/minio/pdfStreamVideo", {
            fileuUrl: this.queryParamDicItem.bucket + "/" + e.fileName,
          }).then((res) => {
            if (res.statusCode !== 300) {
              var binaryData = [];
              binaryData.push(res);
              const blob = new Blob(binaryData, {
                type: "application/video;charset-UTF-8",
              });
              const objectUrl = window.URL.createObjectURL(blob);
              // window.open("./statics/pdf/web/viewer.html?file=" + objectUrl);
              // // this.pdfUrl = objectUrl;
              this.$refs.previewModal.type = "video";
              this.$refs.previewModal.fileUrl = objectUrl;
              this.previewLoading = false;
              // this.visibleVideo = true;
            } else {
              this.$message.error(
                res.message ? res.message : "获取资源失败！",
                1.5
              );
              this.previewVisible = false;
              this.previewLoading = false;
            }
          });
        } else {
          this.$post("/document/minio/getPresignedObjectUrl", {
            bucket: this.queryParamDicItem.bucket,
            objectName: e.fileName,
            days: 1,
          }).then((res) => {
            if (res.statusCode !== 300) {
              this.$refs.previewModal.type = "file";
              this.$refs.previewModal.fileUrl =
                this.kkFileView +
                "/onlinePreview?url=" +
                encodeURIComponent(Base64.encode(res)) +
                "&watermarkTxt=" +
                encodeURIComponent("湖南佐佑科技时代科技有限公司") +
                "&token=" +
                getToken();
              this.previewVisible = true;
            } else {
              this.$message.error(res.message ? res.message : "操作失败", 1.5);
            }
          });
        }
      });
    },
    //监听resize
    initResizeEvent() {
      window.addEventListener("resize", this.resizeHandler, false);
    },
    //移除resize
    destroyResizeEvent() {
      window.removeEventListener("resize", this.resizeHandler);
    },
  },
};
</script>

<style lang="less"></style>
