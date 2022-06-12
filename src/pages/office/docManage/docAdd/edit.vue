<template>
  <t-modal
    :visible="visible"
    :width="800"
    title="公文编辑"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <template slot="footer">
      <a-button
        class="cu-btn-primary"
        icon="plus"
        @click="
          () => {
            $emit('ok');
          }
        "
        >发送</a-button
      >
      <a-button
        class="cu-btn-primary"
        icon="edit"
        @click="
          () => {
            $emit('save');
          }
        "
        >存草稿</a-button
      >
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

    <!-- <iframe width="100%" height="800" :src="viewUrl"></iframe> -->
    <a-tabs default-active-key="1" v-model="key" @change="changeTabs">
      <a-tab-pane key="1" tab="文件清单">
        <a-col :md="8" :sm="24">
          <a-card :bordered="false">
            <div class="box_title">文件清单</div>
            <div class="box_container">
              <div class="box_art">
                <div class="box_name">正文：</div>
                <div class="box_filename text-blue" @click="showView('2')">
                  {{ fileName }}
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
                  >
                    <a-button class="cu-btn-primary">
                      <a-icon type="upload" /> 上传
                    </a-button>
                  </a-upload>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :md="16" :sm="24">
          <a-card :bordered="false">
            <div id="documentFile"></div>
          </a-card>
        </a-col>
      </a-tab-pane>
      <a-tab-pane key="2" tab="表单信息">
        <a-form :form="form" id="form">
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="编号"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'code',
                    { rules: [{ required: true, message: '必填' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="拟稿人"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <user-popup
                  :visible="visiblePopup"
                  style="width: 100%;"
                  @change="(value, other) => popupCallback(value, other)"
                  @close="() => (visiblePopup = false)"
                  :typeNum="1"
                />
                <a-input
                  @click="() => (visiblePopup = true)"
                  v-decorator="[
                    'drafter',
                    { rules: [{ required: true, message: '必填' }] },
                  ]"
                  placeholder="发布人"
                  readOnly
                >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="拟稿人单位"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'drafterDepartment',
                    { rules: [{ required: true, message: '必填' }] },
                  ]"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="公文种类"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  v-decorator="[
                    'documentTypeText',
                    { rules: [{ required: true, message: '必填' }] },
                  ]"
                >
                  <a-select-option
                    v-for="(item, index) in documentList"
                    :key="index"
                    :value="item.value"
                    @click="changeDocument(item)"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="公文标题"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input
                  v-decorator="[
                    'title',
                    { rules: [{ required: true, message: '必填' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="办理人"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <!-- <a-input v-decorator="['drafter', {rules: [{required: true, message: '必填'}]}]" /> -->
                <user-popup
                  :visible="visiblePopupHandler"
                  style="width: 100%;"
                  @change="(value, other) => popupCallbackHandler(value, other)"
                  @close="() => (visiblePopupHandler = false)"
                  :typeNum="1"
                />
                <a-input
                  @click="() => (visiblePopupHandler = true)"
                  v-decorator="[
                    'handler',
                    { rules: [{ required: true, message: '必填' }] },
                  ]"
                  placeholder="办理人"
                  readOnly
                >
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item>
                <a-input v-decorator="['uuid']" disabled type="hidden" />
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="['documentType']"
                  disabled
                  type="hidden"
                />
              </a-form-item>
              <a-form-item>
                <a-input v-decorator="['drafterId']" disabled type="hidden" />
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="['drafterDepartmentId']"
                  disabled
                  type="hidden"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </t-modal>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import pick from "lodash.pick";
import { mapGetters } from "vuex";
import UserPopup from "@/components/TopVUI/custom/userPopup";

const fields = [
  "paymentReason",
  "paymentUnit",
  "paymentName",
  "agentName",
  "finaAudit",
];
export default {
  components: {
    UserPopup,
  },
  props: {
    visible: {
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
      form: this.$form.createForm(this),
      url: {
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
      },
      fullscreen: true,
      viewUrl: "",
      fileName: "工作方案.pdf",
      fileList: [],
      key: "1",
      documentList: [],
      showType: "add",
      visiblePopupHandler: false,
      visiblePopup: false,
    };
  },
  watch: {},
  created() {
    this.viewUrl =
      "http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fvideo.ch9.ms%2fbuild%2f2011%2fslides%2fTOOL-532T_Sutter.pptx";
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
    this.$post(this.url.getDicItemByCode, {
      code: "documentType",
    }).then((res) => {
      this.documentList = res;
    });
  },
  mounted() {
    // this.src = localStorage.getItem('wpsUrl');
    // console.log(this.wpsUrl, this.token);
    // this.openWps(this.src, this.token);
  },
  computed: {
    ...mapGetters(["token"]),
  },
  methods: {
    changeTabs(e) {
      this.key = e;
      this.$nextTick(() => {
        let box = document.getElementById("viewFile");
        console.log("box--", !box, box);
        if (this.key == 1 && !box) {
          this.edit();
        }
      });
    },
    add() {
      // 新建 template值 {"word", "excel", "ppt"}
      this.showType = "add";
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
    edit() {
      this.showType = "edit";
      const params = {
        fileUrl: "https://zysd-test1.oss-cn-beijing.aliyuncs.com/辞职证明.doc",
        uuid: "10K",
        uploadType: "oss",
      };
      let url =
        "https://wwo.wps.cn/office/w/99138d8719ad447593887429e804a2c1?_w_userid=ewsd0001&_w_filetype=web&_w_filepath=https://zysd-test1.oss-cn-beijing.aliyuncs.com/辞职证明.doc&_w_tokentype=1&_w_uploadType=oss&_w_fileId=10K&_w_appid=6f73b51047984a55900fddac4f114b6c&_w_fname=辞职证明.doc&_w_signature=TV74zEY6OTHNvPjoEmBq8thR65k%3D";
      // console.log("params", params)
			// 编辑
      this.$post("/office/wps/getViewUrlWebPath", params)
        .then((res) => {
          console.log("res-edit", res);
          this.fileName = this.getQueryString("_w_fname", url);
          console.log("fileName--", this.fileName);
          this.openWps(res.Token.wpsUrl, this.token);
        })
        .catch((err) => {
          this.$message.info(err);
        });
    },
    showView(id) {
      this.key = id;
    },
    fileClick(item) {
      console.log("item", item);
    },
    changeDocument(item) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          documentType: item.value,
          documentTypeText: item.text,
        });
      });
    },
    openWps(url, token) {
      let _this = this;
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
    //上传
    handleChange(info) {
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileList;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      console.log("this.fileList--------", this.fileList);
      return false;
    },
    popupCallback(value, other) {
      console.log(value);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          drafter: value.userName,
          drafterId: value.userNameId,
          drafterDepartment: value.orgName,
          drafterDepartmentId: value.orgId,
        });
      });
    },
    popupCallbackHandler(value, other) {
      console.log(value);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          handler: value.userName,
          handlerId: value.userNameId,
          handlerDepartment: value.orgName,
          handlerDepartmentId: value.orgId,
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
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

      div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
