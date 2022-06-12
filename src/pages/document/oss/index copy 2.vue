<template>
  <a-row :gutter="10">
    <a-col :md="6" :sm="24">
      <a-card :bordered="false">
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
      </a-card>
    </a-col>
    <a-col :md="18" :sm="24">
      <a-card :bordered="false">
        <tool-bar>
          <template slot="toolBtn" slot-scope="scope">
            <a-button class="cu-btn-primary" icon="plus" @click="handleAddDic"
              >新增目录</a-button
            >
            <a-button
              class="cu-btn-primary"
              icon="upload"
              @click="handleUpLoad()"
              >批量上传</a-button
            >
            <a-button
              class="cu-btn-orange"
              icon="rollback"
              @click="handleBack()"
              >返回</a-button
            >
            <a-button class="cu-btn-info" icon="swap" @click="handleChangeFile"
              >更改存储空间</a-button
            >
            <a-button
              class="cu-btn-empty"
              icon="swap"
              @click="handleChangeFileCatalog"
              >更改文件目录</a-button
            >
            <a-button class="cu-btn-danger" icon="delete" @click="handleSub()"
              >删除</a-button
            >
            <a-button-group v-if="fileCatalog">
              <a-button
                type="primary"
                icon="check"
                @click="handleOkFileCatalog()"
              />
              <a-button
                type="primary"
                icon="close"
                @click="
                  () => {
                    fileCatalog = null;
                  }
                "
              />
            </a-button-group>
          </template>
        </tool-bar>

        <a-spin :spinning="tabelLoading">
          <data-grid
            ref="subList"
            :columns="columnsDicItem"
            :url="url"
            bordered
            rowKey="uuid"
            showPagination="auto"
            :queryParam="queryParamDicItem"
          >
            <span slot="objectName" slot-scope="{ text, record }">
              <template v-if="!record.isFile">
                <icon-fonts icon="icon-wenjianjia" />
                <a @click="handleLoadData(record)">
                  {{ text | objectNameFilter }}</a
                >
              </template>
              <template v-else>
                <t-ellipsis :value="text">
                  <template slot="content">
                    <icon-fonts :icon="getIconFonts(record.objectName)" />
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
            <span slot="storageClass" slot-scope="{ text, record }">
              {{ text | storageClassFilter }}
            </span>
            <span slot="action" slot-scope="{ text, record }">
              <template v-if="record.isFile">
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
                <a @click="handleView(record)">详情</a>
                <a-divider type="vertical" />
                <a @click="handleDownLoad(record)">下载</a>
                <template v-if="showTypePreview(record)">
                  <a-divider type="vertical" />
                  <a @click="getViewUrlWebPath(record)">在线编辑</a>
                </template>
              </template>
            </span>
          </data-grid>
        </a-spin>
        <edit-form
          ref="createModal"
          :visible="visible"
          :model="mdl"
          @cancel="handleCancel(0)"
          @ok="
            () => {
              $refs.createModal.form.resetFields(), (visible = false);
            }
          "
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
        <viewModal :visible.sync="visibleView" :url="ifamSrc"></viewModal>
        <newFile
          ref="newFile"
          :visible="visibleNewFile"
          :loading="subConfirmLoadingNewFile"
          :bucketList="bucketList"
          :model="fileMdl"
          @cancel="
            () => {
              visibleNewFile = false;
            }
          "
          @ok="handleOkChange"
        ></newFile>
        <previewImage
          :imgSrc="imgPreview"
          :visible.sync="imgVisible"
        ></previewImage>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { pdfStreamHandeler } from "@/services/common";
import { STable, Ellipsis, DataGrid } from "@/components";
import editForm from "./edit.vue";
import { dataListMixin } from "@/mixins/dataListMixin";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import editDicForm from "./editDicItem.vue";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage";
import viewModal from "./view.vue";
import newFile from "./newFile.vue";
import { downloadOss } from "@/utils/TopVUI.js";
// import util from '@/utils/util'
import {
  submitForm,
  GetUrlParam,
  getIconFont,
  getTypeByList,
  fileSuffix,
} from "@/utils/util";
import store from "@/store";
const columns = [
  {
    title: "存储空间",
    dataIndex: "name",
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
    viewModal,
    newFile,
    DataGrid,
    previewImage,
  },
  data() {
    this.columns = columns;
    return {
      // create model
      columnsDicItem: [
        {
          title: "文件名（objectName）",
          dataIndex: "objectName",
          scopedSlots: {
            customRender: "objectName",
          },
          customCell: (record, rowIndex) => {
            return {
              style: "color: #1890ff",
            };
          },
          ellipsis: true,
        },
        {
          title: "大小",
          width: 80,
          dataIndex: "size",
          ellipsis: true,
        },
        {
          title: "更新时间",
          width: 150,
          dataIndex: "updateTime",
          ellipsis: true,
          sorter: true,
        },
        {
          title: "存储类型",
          width: 100,
          dataIndex: "storageClass",
          scopedSlots: {
            customRender: "storageClass",
          },
          ellipsis: true,
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 230,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      visibleView: false,
      subVisible: false,
      visibleFile: false,
      subConfirmLoading: false,
      mdl: null,
      mdlDic: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      queryParamDicItem: {},
      url: {
        webUpload: "/document/oss/multiUpload",
        getBucketList: "/document/oss/getBucketList",
        getPageSet: "/document/oss/getPageSet",
        subAdd: "/document/oss/saveCatalog",
        delFile: "/document/oss/delFile",
      },
      ifamSrc: "",
      bucketList: [],
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
              list.rows = res;
              this.queryParamDicItem.bucketName = list.rows[0].name;
              this.destinationBucketName = list.rows[0].name;
              this.queryParamDicItem.endpoint = list.rows[0].extranetEndpoint;
              this.queryParamDicItem.keyPrefix = list.rows[0].keyPrefix;
              this.$refs.subList.refresh();
              this.bucketList = res;
            }
            // this.$refs.subList.refresh();
            return list;
          }
        );
      },
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      info: "",
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
    };
  },
  filters: {
    objectNameFilter(val) {
      const objectNameMap = val.split("/")[0];
      return val;
    },
    statusFilter(status) {
      const statusMap = {
        0: "禁用",
        1: "启用",
      };
      return statusMap[status];
    },
    storageClassFilter(val) {
      let text = "";
      if (val === "Standard") {
        text = "标准存储";
      } else if (val === "IA") {
        text = "低频访问";
      } else if (val === "Archive") {
        text = "归档存储";
      }
      return text;
    },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
  },
  mounted() {
    // this.$refs.subList.refresh();
  },
  methods: {
    // 字体图标匹配
    getIconFonts(text) {
      return getIconFont(text);
    },
    rowClassName(row) {
      return row.name === this.info?.name ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 行点击事件
    rowClick(record, index) {
      const that = this;
      that.info = record;
      that.masterSelectedRowKeys = index;
      that.$refs.subList.selectedRowKeys = [];
      that.queryParamDicItem.bucketName = record.name;
      that.queryParamDicItem.endpoint = record.extranetEndpoint;
      that.queryParamDicItem.keyPrefix = record.keyPrefix;
      that.fileData = that.queryParamDicItem;
      that.$refs.subList.refresh();
      this.destinationBucketName = record.name;
    },
    handleLoadData(record) {
      this.queryParamDicItem.bucketName = record.bucketName;
      this.queryParamDicItem.endpoint = record.endpoint;
      this.queryParamDicItem.keyPrefix = record.uuid;
      this.queryParamDicItem.nextMarker = " ";
      this.queryParamDicItem.search = " ";
      this.$refs.subList.refresh();
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
    // 更新
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
          this.$post(url, values)
            .then((res) => {
              if (res === 1 || res.statusCode === 200) {
                this.subVisible = false;
                this.subRows = null;
                this.$refs.subList.refresh();
                this.$message.success(
                  res.message ? res.message : "操作成功",
                  1.5
                );
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
    // 上传
    handleUpLoad() {
      if (this.fileData.bucketName) {
        this.visibleFile = true;
        this.$refs.createPostModal.add();
      } else {
        this.$message.info("请先选中需要操作的数据");
        return true;
      }
    },
    // 图片预览筛选
    showPreview(e) {
      const imgType = [".jpeg", ".gif", ".png", ".jpg", ".pdf"];
      return getTypeByList(imgType, e.objectName);
    },
    // 预览
    handlePreview(e) {
      this.imgPreview = "";
      this.$nextTick(() => {
        let type = e.objectName.indexOf(".pdf");
        if (type > 0) {
          window.open(
            "https://" + e.bucketName + "." + e.endpoint + "/" + e.objectName
          );
        } else {
          this.imgVisible = true;
          this.imgPreview =
            "https://" + e.bucketName + "." + e.endpoint + "/" + e.objectName;
        }
      });
    },
    // 预览详情
    handleView(e) {
      this.mdl = {
        bucketName: e.objectName,
        acl: "default",
        url: "https://" + e.bucketName + "." + e.endpoint + "/" + e.objectName,
      };
      this.visible = true;
    },
    handleOkFile() {
      this.visibleFile = false;
      this.$refs.subList.refresh();
    },
    // 返回
    handleBack() {
      delete this.queryParamDicItem["keyPrefix"];
      delete this.queryParamDicItem["nextMarker"];
      delete this.queryParamDicItem["search"];
      this.$refs.subList.selectedRowKeys = [];
      this.$refs.subList.refresh();
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
    handleSub() {
      const that = this;
      let uuids = [],
        endpoint = "",
        bucketName = "";
      if (that.$refs.subList.selectedRowKeys.length === 0) {
        that.$message.warn("请先勾选需要的删除的数据");
        return true;
      } else {
        that.$refs.subList.selectedRows.forEach((e, index) => {
          uuids.push(e.uuid);
          endpoint = e.endpoint;
          bucketName = e.bucketName;
        });
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
            .$post(that.url.delFile, {
              uuids: uuids.toString(),
              endpoint: endpoint,
              bucketName: bucketName,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.subList.refresh();
                that.$refs.subList.selectedRowKeys = [];
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
      downloadOss(e.bucketName, e.endpoint, e.objectName);
    },
    // 行勾选事件
    onSelectChangeDic(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.delData.uuids = e.uuid;
          this.delData.endpoint = e.endpoint;
          this.delData.bucketName = e.bucketName;
        } else {
          this.delData.uuids = this.delData.uuids + "," + e.uuid;
        }
      });
      this.$refs.subList.selectedRowKeys = selectedRowKeys;
      this.$refs.subList.selectedRows = selectedRows;
    },
    // 在线编辑
    getViewUrlWebPath(record) {
      let url =
        "https://" +
        record.bucketName +
        "." +
        record.endpoint +
        "/" +
        record.key;
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
        uuid: record.size,
        uploadType: "oss",
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
    // 判断是否显示在线编辑按钮
    showTypePreview(e) {
      return getTypeByList(fileSuffix, e.objectName);
    },
    // 更换存储空间
    handleChangeFile() {
      if (this.$refs.subList.selectedRowKeys.length === 0) {
        this.$message.info("请先选中需要操作的数据！");
      } else {
        const flag = this.$refs.subList.selectedRows.some((item) => {
          return item.isFile == false;
        });
        if (flag) {
          this.$message.info("文件夹不能移动！");
        } else {
          this.fileMdl = {
            sourceBucketName: this.$refs.subList.selectedRows[0].bucketName,
            endpoint: this.$refs.subList.selectedRows[0].endpoint,
            sourceKey: this.$refs.subList.selectedRowKeys.toString(),
          };
          this.visibleNewFile = true;
        }
      }
    },
    // 确定更换存储空间
    handleOkChange() {
      const form = this.$refs.newFile.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.subConfirmLoadingNewFile = true;
          this.$post("/document/oss/ossFileMoveBucket", values)
            .then((res) => {
              if (res.statusCode === 200) {
                this.$message.success(res.message);
                this.visibleNewFile = false;
                this.$refs.subList.selectedRowKeys = [];
                this.$refs.subList.refresh();
              } else {
                this.$message.warn(res.message);
              }
            })
            .finally(() => {
              this.subConfirmLoadingNewFile = false;
            });
        }
      });
    },
    // 更改文件目录
    handleChangeFileCatalog() {
      if (this.$refs.subList.selectedRowKeys.length === 0) {
        this.$message.info("请先勾选需要操作的数据！");
      } else {
        const flag = this.$refs.subList.selectedRows.some((item) => {
          return item.isFile == false;
        });
        if (flag) {
          this.$message.info("文件夹不能移动！");
        } else {
          this.fileCatalog = {
            sourceBucketName: this.$refs.subList.selectedRows[0].bucketName,
            endpoint: this.$refs.subList.selectedRows[0].endpoint,
            sourceKey: this.$refs.subList.selectedRowKeys.toString(),
          };
        }
      }
    },
    // 确定更换文件夹目录
    handleOkFileCatalog() {
      this.tabelLoading = true;
      let destinationKeyList = [];
      this.$refs.subList.selectedRows.forEach((e) => {
        if (e.objectName.indexOf("/") > 0) {
          let arr = e.objectName.split("/");
          destinationKeyList.push(this.destinationKey + arr[arr.length - 1]);
        } else {
          destinationKeyList.push(this.destinationKey + e.objectName);
        }
      });
      this.fileCatalog.destinationKey = destinationKeyList.toString();
      this.fileCatalog.destinationBucketName = this.destinationBucketName;
      this.$post("/document/oss/ossFileMoveFolder", this.fileCatalog)
        .then((res) => {
          if (res.statusCode === 200) {
            this.$message.success(res.message);
            this.visibleNewFile = false;
            this.$refs.subList.selectedRowKeys = [];
            this.$refs.subList.refresh();
            this.fileCatalog = null;
          } else {
            this.$message.warn(res.message);
          }
        })
        .finally(() => {
          this.tabelLoading = false;
        });
    },
  },
};
</script>

<style lang="less"></style>
