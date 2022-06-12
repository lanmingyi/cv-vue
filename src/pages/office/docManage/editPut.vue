<template>
  <j-modal
    :visible="visibleType"
    :width="800"
    title="公文详情"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-col :md="24" :sm="24">
      <a-card :bordered="false">
        <a-tabs default-active-key="1" @change="changeTab">
          <a-tab-pane key="1" tab="文件清单">
            <a-col :md="8" :sm="24">
              <a-card :bordered="false">
                <div class="box_container">
                  <div class="box_art">
                    <div class="box_name">正文：</div>
                    <div class="box_filename text-blue" v-show="fileName">
                      {{ fileName }}
                    </div>
                    <div
                      class="box_filelist flex align-start"
                      v-show="!fileName"
                    >
                      <a-button
                        class="cu-btn-primary"
                        v-if="fileNameList.length == 0"
                        icon="upload"
                        @click="documentAdd"
                      >
                        新建公文
                      </a-button>
                      <a-upload
                        :multiple="true"
                        :file-list="fileNameList"
                        :remove="handleRemoveName"
                        :before-upload="beforeUploadName"
                        @preview="handlePreview"
                      >
                        <a-button
                          class="cu-btn-success margin-left"
                          v-if="fileNameList.length == 0"
                          @click="
                            () => {
                              changeType == 'document';
                            }
                          "
                        >
                          <a-icon type="upload" /> 上传公文
                        </a-button>
                      </a-upload>
                    </div>
                  </div>
                  <div class="box_art">
                    <div class="box_name">附件：</div>
                    <div class="box_filelist">
                      <a-upload
                        :multiple="true"
                        :file-list="fileList"
                        :remove="handleRemove"
                        :before-upload="beforeUpload"
                        @preview="previewFile"
                      >
                        <a-button
                          class="cu-btn-primary"
                          @click="
                            () => {
                              changeType == 'file';
                            }
                          "
                        >
                          <a-icon type="upload" /> 上传附件
                        </a-button>
                      </a-upload>
                    </div>
                  </div>
                </div>
              </a-card>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-card :bordered="false">
                <div class="box_title">公文预览</div>
                <div id="documentFile"></div>
              </a-card>
            </a-col>
          </a-tab-pane>
          <a-tab-pane key="2" tab="公文表单">
            <a-spin :spinning="loading" id="printBox">
              <a-form :form="form" id="form">
                <div class="account-center-avatarHolder">
                  <table
                    class="table-ant"
                    style="table-layout: fixed; word-break: break-all;"
                  >
                    <thead>
                      <tr>
                        <th
                          colspan="6"
                          style="text-align: center;padding-bottom: 30px;"
                        >
                          <a-form-item>
                            <a-input
                              class="text-center"
                              v-decorator="['title']"
                              placeholder="公文标题"
                              :disabled="disabled"
                            />
                          </a-form-item>
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <td style="text-align: center;">编号:</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            style="border-bottom: 1px solid #e7e7e7;border-radius: inherit;"
                            v-decorator="['codeId']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                      <td style="text-align: center;">公开属性:</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            style="border-bottom: 1px solid #e7e7e7;border-radius: inherit;"
                            v-decorator="['applicantTime']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                    </tr>
                    <tr class="table_tr">
                      <td>来文单位</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            v-decorator="['paymentReason']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                      <td>收文时间</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            v-decorator="['paymentUnit']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                    </tr>
                    <tr class="table_tr">
                      <td>文号</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            v-decorator="['paymentUnit']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                      <td>公文种类</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            v-decorator="['paymentName']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                    </tr>
                    <tr class="table_tr">
                      <td>紧急程度</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            v-decorator="['paymentUnit']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                      <td>要求复办时间</td>
                      <td colspan="2">
                        <a-form-item>
                          <a-input
                            v-decorator="['paymentName']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                    </tr>
                    <tr class="table_tr">
                      <td>公文摘要</td>
                      <td colspan="5">
                        <a-form-item>
                          <a-input
                            type="textarea"
                            :rows="4"
                            style="width: 100%;height: 100%;margin-top: 5px;"
                            v-decorator="['paymentReason']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                      </td>
                    </tr>
                    <tr class="table_tr">
                      <td>备注</td>
                      <td colspan="5">
                        <a-form-item>
                          <a-input
                            type="textarea"
                            :rows="4"
                            style="width: 100%;height: 100%;margin-top: 5px;"
                            v-decorator="['leaderReview']"
                            :disabled="disabled"
                          />
                        </a-form-item>
                        <a-form-item>
                          <a-input v-decorator="['uuid']" type="hidden" />
                        </a-form-item>
                      </td>
                    </tr>
                  </table>
                </div>
              </a-form>
            </a-spin>
          </a-tab-pane>
          <a-tab-pane v-if="type == 'view'" key="3" tab="流程流转">
            <div class="box_art">
              <s-table
                ref="table"
                size="small"
                :columns="columns"
                :data="loadData"
                bordered
                :pageSize="10"
                rowKey="uuid"
                showPagination="auto"
                :rowClassName="rowClassName"
                :customRow="rowClick"
              >
                <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                </span>
              </s-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>

    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 3,
      }"
    >
      <template>
        <a-button
          class="cu-btn-primary"
          icon="plus"
          v-if="type == 'add'"
          @click="
            () => {
              $emit('save');
            }
          "
          >保存
        </a-button>
        <a-button
          key="back"
          @click="
            () => {
              $emit('cancel');
            }
          "
          >关闭</a-button
        >
      </template>
    </div>
  </j-modal>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { STable, Ellipsis } from "@/components";
import { simpleListMixin } from "@/mixins/simpleListMixin";
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
    title: "操作人",
    dataIndex: "creator",
    width: 200,
    align: "center",
  },
  {
    title: "操作时间",
    width: 150,
    dataIndex: "createTime",
    align: "center",
  },
  {
    title: "流转步骤",
    width: 150,
    dataIndex: "process",
    align: "center",
  },
  {
    title: "流转意见",
    width: 150,
    dataIndex: "processContent",
    align: "center",
  },
];
export default {
  mixins: [simpleListMixin],
  components: {
    STable,
    Ellipsis,
  },
  props: {
    visibleType: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    this.columns = columns;
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      visible: false,
      confirmLoading: false,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      rows: "", //选中行数据
      url: {
        getPageSet: "/system/topicBase/getPageSet",
        save: "/shop/shopDocument/save",
        update: "/shop/shopDocument/update",
        deleteBatch: "/shop/shopDocument/deleteBatch",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      mdl: null,
      form: this.$form.createForm(this),
      fullscreen: true,
      viewUrl: "",
      keys: 1,
      fileName: "",
      fileList: [],
      fileNameList: [],
      type: "",
      changeType: "",
      simpleMode: "normal",
      disabled: false,
    };
  },
  watch: {},
  created() {
    this.viewUrl =
      "http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fvideo.ch9.ms%2fbuild%2f2011%2fslides%2fTOOL-532T_Sutter.pptx";
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    changeTab(key) {
      this.keys = key;
      if (key == 1) {
        this.getWpsData();
      }
    },
    addMenu() {},
    add() {
      this.type = "add";
      this.disabled = false;
    },
    edit(disabled) {
      this.type = "view";
      this.disabled = disabled ? true : false;
      this.getWpsData();
    },
    getWpsData() {
      const params = {
        fileUrl: "https://zysd-test1.oss-cn-beijing.aliyuncs.com/佐佑科技用户-副本.doc",
        uuid: "10K",
        uploadType: "oss",
      };
      let url =
        "https://wwo.wps.cn/office/w/99138d8719ad447593887429e804a2c1?_w_userid=ewsd0001&_w_filetype=web&_w_filepath=https://zysd-test1.oss-cn-beijing.aliyuncs.com/佐佑科技用户-副本.doc&_w_tokentype=1&_w_uploadType=oss&_w_fileId=10K&_w_appid=6f73b51047984a55900fddac4f114b6c&_w_fname=佐佑科技用户-副本.doc&_w_signature=TV74zEY6OTHNvPjoEmBq8thR65k%3D";
      // 编辑
      this.$post("/office/wps/getViewUrlWebPath", params)
        .then((res) => {
          console.log("1111", res);
          this.fileName = this.getQueryString("_w_fname", url);
          console.log("fileName--", this.fileName);
          this.openWps(res.Token.wpsUrl, res.Token.token);
        })
        .catch((err) => {
          this.$message.info(err);
        });
    },
    openWps(url, token) {
      let _this = this;
      _this.$nextTick(() => {
        const wps = _this.wps.config({
          mode: _this.simpleMode ? "simple" : "normal",
          mount: document.querySelector("#documentFile"),
          wpsUrl: url,
        });
        wps.setToken({
          token,
        });
        let app = wps.Application;
        console.log(JSON.stringify(app));
      });
    },
    getQueryString(name, url) {
      let href = "";
      if (url) {
        href = url;
      } else {
        href = location.href;
      }
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    //新建公文
    documentAdd() {
      this.$post(
        "/office/wps/createTemplateFile",
        {
          template: "word",
        },
        null
      )
        .then((res) => {
          console.log("res", res.data);
          let data = res.data;
          this.openWps(data.Token.wpsUrl, this.token);
        })
        .catch((err) => {
          this.$message.info(err);
        });
    },
    //上传附件 || 公文
    previewFile(file) {
      console.log("file", file);
    },
    handlePreview(file) {
      console.log("file", file);
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    handleRemoveName(file) {
      this.fileNameList = [];
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      console.log("this.fileList--------", this.fileList);
      return false;
    },
    beforeUploadName(file) {
      this.fileNameList = [...this.fileNameList, file];
      console.log("this.fileList--------", this.fileNameList);
      return false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-col .ant-form-item-control-wrapper {
  width: 100%;
}

.account-center-avatarHolder {
  padding-top: 20px;
}

.box_title {
  padding-bottom: 30px;
}

.box_container {
  padding: 40px 30px;
  background: #fafafa;
  border-radius: 10px;

  .box_art {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;

    .box_name {
      width: 20%;
      text-align: right;
      padding-right: 10px;
      white-space: nowrap;
    }

    .box_filename,
    .box_filelist {
      width: 65%;

      span {
        width: 100%;
        display: block;
      }

      div {
        margin-bottom: 10px;
      }
    }
  }
}

.table-ant {
  width: 80%;
  margin: 0 auto;
  padding: 10px 20px 10px;

  thead {
    font-size: 20px;
    font-weight: bold;
  }

  .table_tr {
    height: 40px;
    line-height: 40px;
    border: 1px solid #e7e7e7;
  }

  .line-height-80 {
    line-height: 80px;
  }

  .table_tr > td {
    border-right: 1px solid #e7e7e7;
    text-align: center;
  }

  input {
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
  }

  textarea {
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .table_tr > td:nth-child(2n) {
    text-align: left;
    // padding-left: 20px;
  }
}

.ant-form-item {
  display: flex;
  margin-bottom: 0 !important;
}

.ant-input:focus {
  border: none;
  box-shadow: none;
}

textarea,
textarea.ant-input:hover,
textarea:focus {
  // border: 1px solid #DAE2F3;
  -webkit-box-shadow: none;
  box-shadow: none;
}

/*去除页眉页脚*/
@page {
  size: auto;
  /* auto is the initial value */
  margin: 3mm;
  /* this affects the margin in the printer settings */
}

html {
  background-color: #ffffff;
  margin: 0;
  /* this affects the margin on the html before sending to printer */
}

body {
  border: solid 1px blue;
  margin: 10mm 15mm 10mm 15mm;
  /* margin you want for the content */
}

/*去除页眉页脚*/
</style>
