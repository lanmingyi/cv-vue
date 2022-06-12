<template>
  <t-modal
    :visible="visible"
    :width="800"
    title="编号发文"
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
            $emit('save');
          }
        "
        >保存</a-button
      >
      <a-button
        class="cu-btn-primary"
        icon="edit"
        @click="
          () => {
            $emit('sign');
          }
        "
        >提交</a-button
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
    <a-col :md="8" :sm="24">
      <a-card :bordered="false">
        <div class="box_title">待发公文</div>
        <div class="box_container">
          <div class="box_art">
            <div class="box_name">审批表单：</div>
            <div class="box_filelist">
              <a @click="keys = 1"><a-icon type="file" />发文稿纸表单</a>
            </div>
          </div>
          <div class="box_art">
            <div class="box_name">正文：</div>
            <div class="box_filename">{{ fileName }}</div>
            <a-button
              class="cu-btn-primary"
              size="small"
              @click="keys = 2"
              v-show="fileName"
              >编辑正文</a-button
            >
            <a-button
              class="cu-btn-primary"
              size="small"
              @click="upload(1)"
              v-show="!fileName"
              >上传正文</a-button
            >
          </div>
          <div class="box_art">
            <div class="box_name">附件：</div>
            <a-button class="cu-btn-primary" size="small" @click="addMenu()"
              >新建目录</a-button
            >
            <a-button class="cu-btn-primary" size="small" @click="upload(2)"
              >添加附件</a-button
            >
          </div>
          <div class="box_art">
            <div class="box_name"></div>
            <div class="box_filelist">
              <div v-for="(item, index) in fileList" :key="index">
                {{ item.fileName }}
              </div>
            </div>
          </div>
        </div>
        <div class="box_title" style="padding-top: 20px;">相关操作</div>
        <div class="box_title" style="padding-top: 20px;">发文说明</div>
      </a-card>
    </a-col>
    <a-col :md="16" :sm="24">
      <a-card :bordered="false">
        <div v-show="keys === 1">
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
                        XX局发文稿纸
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
                        />
                      </a-form-item>
                    </td>
                    <td style="text-align: center;">公开属性:</td>
                    <td colspan="2">
                      <a-form-item>
                        <a-input
                          style="border-bottom: 1px solid #e7e7e7;border-radius: inherit;"
                          v-decorator="['applicantTime']"
                        />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td>拟稿时间</td>
                    <td colspan="2">
                      <a-form-item>
                        <a-input v-decorator="['paymentReason']" />
                      </a-form-item>
                    </td>
                    <td>公文种类</td>
                    <td colspan="2">
                      <a-form-item>
                        <a-input v-decorator="['paymentUnit']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td>拟稿单位</td>
                    <td colspan="2">
                      <a-form-item>
                        <a-input v-decorator="['paymentUnit']" />
                      </a-form-item>
                    </td>
                    <td>拟稿人</td>
                    <td colspan="2">
                      <a-form-item>
                        <a-input v-decorator="['paymentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td>公文标题</td>
                    <td colspan="5">
                      <a-form-item>
                        <a-input v-decorator="['paymentReason']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td>依据</td>
                    <td colspan="5">
                      <a-form-item>
                        <a-input
                          type="textarea"
                          style="width: 100%;height: 100%;margin-top: 5px;"
                          v-decorator="['paymentReason']"
                        />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr line-height-80">
                    <td rowspan="2">拟稿意见</td>
                    <td style="text-align: center;">拟稿部门意见</td>
                    <td colspan="4">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr line-height-80">
                    <td>会签意见</td>
                    <td colspan="4">
                      <a-form-item>
                        <a-input v-decorator="['finaAudit']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr line-height-80">
                    <td rowspan="9">行文发文</td>
                    <td style="text-align: center;">行文审核</td>
                    <td colspan="4">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td rowspan="7">套红行文</td>
                    <td style="text-align: center;">发文字号</td>
                    <td colspan="1">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                    <td style="text-align: center;">签发人</td>
                    <td colspan="1">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td style="text-align: center;">发文机关</td>
                    <td colspan="1">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                    <td style="text-align: center;">成文日期</td>
                    <td colspan="1">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td style="text-align: center;">印发份数</td>
                    <td colspan="1">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                    <td style="text-align: center;">印发日期</td>
                    <td colspan="1">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td style="text-align: center;">主送单位</td>
                    <td colspan="3">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td style="text-align: center;">抄送单位</td>
                    <td colspan="3">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td style="text-align: center;">主题词</td>
                    <td colspan="3">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr">
                    <td style="text-align: center;">附件</td>
                    <td colspan="3">
                      <a-form-item>
                        <a-input v-decorator="['agentName']" />
                      </a-form-item>
                    </td>
                  </tr>
                  <tr class="table_tr line-height-80">
                    <td>签阅意见</td>
                    <td colspan="4">
                      <a-form-item>
                        <a-input v-decorator="['leaderReview']" />
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
        </div>
        <div v-show="keys === 2">
          <iframe width="100%" height="800" :src="viewUrl"></iframe>
        </div>
      </a-card>
    </a-col>
  </t-modal>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
export default {
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
      fullscreen: true,
      viewUrl: "",
      keys: 1,
      fileName: "关于公开遴选公务员的通知.doc",
      fileList: [
        {
          fileName: "附件1",
        },
        {
          fileName: "附件2",
        },
      ],
    };
  },
  watch: {},
  created() {
    this.viewUrl =
      "http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fvideo.ch9.ms%2fbuild%2f2011%2fslides%2fTOOL-532T_Sutter.pptx";
  },
  methods: {
    addMenu() {},
    upload(type) {
      if (type && type === 1) {
        if (this.fileName) {
          this.$confirm({
            title: "警告",
            content:
              "公文正文只能有一个，若继续添加正文则将丢弃正在编辑的正文或覆盖已存在的正文，是否继续？",
            okText: "是",
            okType: "danger",
            cancelText: "否",
            onOk() {
              // that.$message.error('签收数据失败')
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }
      }
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
    align-items: center;
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
