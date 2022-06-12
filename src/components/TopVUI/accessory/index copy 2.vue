<template>
  <div>
    <tool-bar
      v-if="btnType"
      @search="$refs.table.refresh(true)"
      @reset="
        () => {
          (this.queryParam = {}), $refs.table.refresh(true);
        }
      "
    >
      <template slot="toolBtn" slot-scope="scope">
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
          @click="handleSub($refs.table.selectedRowKeys)"
          >删除</a-button
        >
      </template>
    </tool-bar>
    <DataGrid
      ref="table"
      :columns="columns"
      :url="url"
      :queryParam="queryParam"
      rowKey="uuid"
      :format-conditions="true"
    >
      <template
        v-for="col in ['fileName']"
        :slot="col"
        slot-scope="{ text, record }"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.uuid, col)"
          />
          <template v-else>
            <t-ellipsis :value="text">
              <template slot="content">
                <icon-fonts
                  :icon="getIconFontByFile(text)"
                  style="margin-right: 5px;"
                />
                <a @click="handleDownLoad(record)">{{ text | ellipsis(30) }}</a>
              </template>
            </t-ellipsis>
          </template>
        </div>
      </template>
      <template slot="action" slot-scope="{ text, record }">
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
            <!-- <template v-if="showTypePreview(record)">
              <a-divider type="vertical" />
              <a @click="getViewUrlWebPath(record)">在线编辑</a>
            </template> -->
            <a-divider type="vertical" />
            <a
              v-if="tag && tag === 'fdsFile'"
              @click="handleSub(record, { fileUrl: record.url })"
              >删除</a
            >
            <a v-else @click="handleSub(record)">删除</a>
          </template>
          <!-- </span> -->
        </div>
      </template>
    </DataGrid>
    <!--	新增编辑	 -->
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
import "@/utils/filter";
import { DataGrid } from "@/components";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { baseUrl } from "@/services/baseUrl.js";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { pdfStreamHandeler } from "@/services/common";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import { getIconFont, getTypeByList, fileSuffix } from "@/utils/util";
import { download, downloadDfs } from "@/utils/TopVUI.js";
import store from "@/store";
export default {
  name: "Table",
  components: { DataGrid, webUpload },
  mixins: [dataGridMixin],
  filters: {
    sexStr(val) {
      switch (Number(val)) {
        case 0:
          return "女";
        case 1:
          return "男";
      }
    },
    testComboboxStr(val) {
      switch (JSON.parse(val)) {
        case false:
          return "不排序";
        case true:
          return "排序";
      }
    },
  },
  props: {
    paramList: {
      type: Object,
    },
    url: {
      type: Object,
      default: () => {
        return {
          webUpload: "/document/fdfs/upload",
          getPageSet: "/system/attachment/getListByPuuid",
          deleteBatch: "/system/attachment/delete",
          update: "/system/attachment/update",
          getPageSet: "/system/attachment/getListByPuuid",
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
    fileType: {
      //文件上传
      type: String,
      default: "oss",
    },
  },
  data() {
    return {
      columns: [
        {
          title: "文件名称",
          dataIndex: "fileName",
          width: 300,
          scopedSlots: {
            customRender: "fileName",
          },
          ellipsis: true,
        },
        {
          title: "文件大小",
          dataIndex: "filSize",
          width: 100,
          sorter: true,
        },
        {
          title: "上传人",
          dataIndex: "creator",
          ellipsis: true,
        },
        {
          title: "上传时间",
          dataIndex: "createTime",
          sorter: true,
        },
        {
          title: "操作",
          width: 220,
          dataIndex: "action",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      // url: {
      //   getPageSet: "/system/testDemo/getPageSet",
      //   save: "/system/testDemo/save",
      //   update: "/system/testDemo/update",
      //   deleteBatch: "/system/testDemo/deleteBatch",
      // },
      action: "",
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      imgVisible: false,
      imgPreview: "",
      urlpdf: {
        pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
      },
    };
  },
  created() {
    this.action = baseUrl + this.url;
    this.headers.token = Vue.ls.get(ACCESS_TOKEN);
  },
  methods: {
    getIconFontByFile(val) {
      return getIconFont(val);
    },
    // 判断是否显示在线编辑按钮
    showTypePreview(e) {
      // const typeList = ['.doc', '.ppt', '.xls','.pdf']
      return getTypeByList(fileSuffix, e.filePath);
    },
    refreshList(e) {
      this.uuid = "";
      this.rows = "";
      this.selectedRowKeys = [];
      this.queryParam = e ? e : {};
      this.editingKey = "";
      this.dataSource = [];
      this.$refs.table.refresh();
    },
    resTable() {
      this.visible = false;
      this.$message.info("添加成功");
      this.editingKey = "";
      this.dataSource = [];
      this.$refs.table.refresh();
    },
    handleaddArchivePost() {
      console.log("this.queryParam", this.queryParam, this.url);
      if (this.queryParam.puuid) {
        if (this.queryParam.puuid === "null") {
          this.$message.warn("此合同未生效");
          return false;
        }
        if (this.queryParam.puuid == "1") {
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
    handleOkUserPost() {
      const formUserPost = this.$refs.createPostModal.form;
      this.visible = false;
      this.confirmLoading = false;
      formUserPost.resetFields();
      this.dataSource = [];
      this.$refs.table.refresh();
    },
    // 下载
    handleDownLoad(e) {
      if (this.label === "attachment") {
        download(e.uuid);
      } else {
        downloadDfs(e.url, e.fileName);
      }
    },
    showPreview(e) {
      const imgType = ["jpg", "jpeg", "gif", "png", "pdf"];
      return imgType.find((val) => e.fileType === val);
    },
    // 预览
    handlePreview(e) {
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
    // 在线编辑
    getViewUrlWebPath(record) {
      let url = "";
      if (this.fileType === "oss") {
        url =
          "https://" +
          record.bucketName +
          "." +
          record.endpoint +
          "/" +
          record.key;
      } else if (this.fileType === "fdfs") {
        url = "https://34c09h5190.wicp.vip/" + record.url;
        //let url = 'http://192.168.1.216/' + record.url ;
      } else {
        url = "https://34c09h5190.wicp.vip/" + record.fileName;
      }

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
        uploadType: this.fileType === "oss" ? "oss" : "fdfs",
      };
      this.$post("/document/wps/getViewUrlWebPath", params, null)
        .then((res) => {
          // window.open(res.Token.wpsUrl, '_blank');
          // // this.$router.push({path: '/document/oss/view'})
          // // util.$emit('getUrl',res.Token.wpsUrl)
          // let data = GetUrlParam(res.Token.wpsUrl)

          // let urls = res.Token.wpsUrl.split("?")[0];
          // console.log(data,urls)
          // new submitForm(urls,data).get();
          // this.visibleView = true
          // this.ifamSrc = res.Token.wpsUrl
          // console.log(this.ifamSrc)
          store.commit("SET_WPSURL", res.Token.wpsUrl);
          localStorage.setItem("wpsUrl", res.Token.wpsUrl);
          const jump = this.$router.resolve({ name: "viewFile" });
          window.open(jump.href, "_blank");
          // util.$emit('getUrl',res.Token.wpsUrl)
        })
        .catch(() => {
          this.$message.info("请求错误！");
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
