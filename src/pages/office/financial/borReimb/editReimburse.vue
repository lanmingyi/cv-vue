<template>
  <t-modal
    title="支出报销单"
    :width="1000"
    :visible="visible"
    :fullscreen="false"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <template slot="footer">
      <a-button class="cu-btn-primary" v-print="'printBox'">打印</a-button>
      <a-button class="cu-btn-primary" @click="handleFaOk('no')">保存</a-button>
      <a-button class="cu-btn-primary" @click="handleFaOk('yes')"
        >申请</a-button
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
                  支出报销单
                </th>
              </tr>
            </thead>
            <tr>
              <td style="text-align: center;">流水号:</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    style="border-bottom: 1px solid #e7e7e7;border-radius: inherit;"
                    v-decorator="['serialNumber']"
                    placeholder="自动生成"
                    readOnly
                  />
                </a-form-item>
              </td>
              <td style="text-align: center;">填报日期:</td>
              <td colspan="2">
                <a-form-item>
                  <t-date
                    v-decorator="['fillingDate']"
                    style="width: 100%;"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD HH:mm:ss"
                    allowClear
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>报销类型</td>
              <td colspan="5">
                <a-form-item>
                  <a-select
                    v-decorator="[
                      'reimbursementType',
                      { rules: [{ required: true, message: '必填！' }] },
                    ]"
                    style="width: 200px"
                  >
                    <a-select-option
                      v-for="item in typeList"
                      :key="item.text"
                      @click="typeChange(item)"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                  <a-select
                    v-decorator="[
                      'reimbursementTypeSon',
                      { rules: [{ required: true, message: '必填！' }] },
                    ]"
                    style="width: 200px;padding-left: 20px;"
                  >
                    <a-select-option
                      v-for="items in typeSonList"
                      :key="items.text"
                    >
                      {{ items.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>填报人</td>
              <td colspan="2">
                <a-form-item>
                  <user-popup
                    :visible="visiblePopup"
                    style="width: 100%;"
                    @change="(value, other) => popupCallback(value, other)"
                    @close="() => (visiblePopup = false)"
                    :typeNum="1"
                  />
                  <a-input
                    @click="
                      () => {
                        if (typeNum != 2) {
                          visiblePopup = true;
                        }
                      }
                    "
                    v-decorator="[
                      'loanUser',
                      {
                        initialValue: loanUser,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                    placeholder="填报人"
                    readOnly
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </td>
              <td>报销单位</td>
              <td colspan="2">
                <a-form-item>
                  <!-- <tree-select v-decorator="['loanDepartmentName', { initialValue: loanDepartmentName ,rules: [{required: true, message: '必填'}]}]" :treeValueText="loanDepartmentName" placeholder="报销单位" :parameter="parameterOrg"
									 :url="urlOrg" :data="treeData" idfield="id" textfield="text" @change="selectOrg"/> -->
                  <a-input
                    v-decorator="['loanDepartmentName']"
                    placeholder="报销单位"
                    readOnly
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>报销是由</td>
              <td colspan="5">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'subjectMatter',
                      { rules: [{ required: true, message: '必填！' }] },
                    ]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td colspan="6">报销明细</td>
            </tr>
            <tr class="table_tr">
              <td style="text-align: center;">分类</td>
              <td style="text-align: center;">事由</td>
              <td style="text-align: center;">单据(张)</td>
              <td style="text-align: center;">关联借款流水号</td>
              <td style="text-align: center;">金额(元)</td>
              <td style="text-align: center;">
                操作/<a @click="addline()">新增行</a>
              </td>
            </tr>
            <tr
              class="table_tr"
              v-for="(item, index) in detailData"
              :key="index"
            >
              <td style="text-align: center;">
                <a-input v-model="item.classification" />
              </td>
              <td style="text-align: center;">
                <a-input v-model="item.subjectMatter" />
              </td>
              <td style="text-align: center;">
                <a-input v-model="item.bill" />
              </td>
              <td style="text-align: center;">
                <a-input v-model="item.loanSerialNumber" />
              </td>
              <td style="text-align: center;">
                <a-input v-model="item.amountOfMoney" @change="changeNum" />
              </td>
              <td style="text-align: center;" class="no-print">
                <a>上传凭据</a>
                <a-divider type="vertical" />
                <a @click="deleteBtn(item, index)">删除</a>
              </td>
            </tr>
            <tr class="table_tr">
              <td>共计</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'reimbursementMoney',
                      { initialValue: reimbursementMoney },
                    ]"
                    readOnly
                  />
                </a-form-item>
              </td>
              <td>金额大写</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'reimbursementMoneyCapitalization',
                      { initialValue: reimbursementMoneyCapitalization },
                    ]"
                    readOnly
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td height="150">备注</td>
              <td height="150" colspan="5">
                <a-form-item>
                  <a-input
                    type="textarea"
                    style="width: 100%;height: 100%;margin-top: 5px;"
                    v-decorator="['remarks']"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input v-decorator="['uuid']" type="hidden" />
                </a-form-item>
                <a-form-item>
                  <a-input v-decorator="['loanUserId']" type="hidden" />
                </a-form-item>
                <a-form-item>
                  <a-input
                    v-decorator="['reimbursementTypeUuid']"
                    type="hidden"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input v-decorator="['loanDepartmentId']" type="hidden" />
                </a-form-item>
              </td>
            </tr>
          </table>
        </div>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import moment from "moment";
import { mapGetters } from "vuex";

import Editor from "@/components/TopVUI/custom/Editor/index.vue";
import UserPopup from "@/components/TopVUI/custom/userPopup";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
// 表单字段
const fields = [
  "uuid",
  "serialNumber",
  "fillingDate",
  "loanUser",
  "loanUserId",
  "loanDepartmentName",
  "paymentForReimbursement",
  "reimbursementMoney",
  "paymentMoneyCapitalization",
  "agentName",
  "finaAudit",
  "leaderReview",
  "cashName",
  "remarks",
  "loanDepartmentId",
  "reimbursementTypeSon",
  "reimbursementTypeUuid",
  "reimbursementType",
  "reimbursementMoneyCapitalization",
  "subjectMatter",
];

export default {
  components: {
    Editor,
    UserPopup,
    TreeSelect,
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
    organList: {
      type: Array,
      default: () => [],
    },
    typeNum: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      url: {
        getDetailByUuid: "/office/officeFinance/getDetailByUuid",
        getPageSet: "/office/officeReimbursementDetails/getPageSet",
        getListByPidTree: "/system/codeItem/getListByPid",
        saveReimbursement: "/office/officeFinance/saveReimbursement",
      },
      urlOrg: {
        fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
        expandUrl: "/mdata/organization/getListByPid",
      },
      parameterOrg: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      isClear: true,
      uuid: "",
      trainContent: "",
      detailData: [
        {
          classification: "",
          subjectMatter: "",
          bill: "",
          loanSerialNumber: "",
          amountOfMoney: "",
        },
      ],
      reimbursementMoney: "",
      loanUser: "",
      reimbursementMoneyCapitalization: "",
      visiblePopup: false,
      showSave: false,
      treeData: [],
      typeList: [],
      typeSonList: [],
      timer: null,
      loanDepartmentName: "",
      loanDepartmentId: "",
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
    this.$post(this.urlOrg.fathersUrl).then((res) => {
      this.treeData = res;
      this.treeData.forEach((e, index) => {
        this.treeData[index].title = e.text;
        this.treeData[index].label = e.text;
        this.treeData[index].index = index;
        this.treeData[index].value = e.text;
        this.treeData[index].key = e.id;
        this.treeData[index].levelId = e.levelId;
      });
    });
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    reimbursementMoney(val, old) {
      if (val != old) {
        this.reimbursementMoneyCapitalization = this.changeCapital(val);
        this.form.setFieldsValue({
          reimbursementMoneyCapitalization: this
            .reimbursementMoneyCapitalization,
        });
      }
    },
  },
  methods: {
    moment,
    changeNum(e) {
      this.$nextTick(() => {
        var num = "";
        this.detailData.forEach((val) => {
          num = Number(num) + Number(val.amountOfMoney);
        });
        this.reimbursementMoney = num;
        this.form.setFieldsValue({
          reimbursementMoney: this.reimbursementMoney,
        });
      });
    },
    changeCapital(n) {
      if (n == 0) {
        return "零";
      }
      if (!/^(\+|-)?(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
      var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
        str = "";
      n += "00";
      var a = parseFloat(n);
      if (a < 0) {
        n = n.substr(1);
      }
      var p = n.indexOf(".");
      if (p >= 0) {
        n = n.substring(0, p) + n.substr(p + 1, 2);
      }
      unit = unit.substr(unit.length - n.length);
      for (var i = 0; i < n.length; i++)
        str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
      if (a > 0) {
        return str
          .replace(/零(仟|佰|拾|角)/g, "零")
          .replace(/(零)+/g, "零")
          .replace(/零(万|亿|元)/g, "$1")
          .replace(/(亿)万|壹(拾)/g, "$1$2")
          .replace(/^元零?|零分/g, "")
          .replace(/元$/g, "元整");
      } else {
        return (
          "负" +
          str
            .replace(/零(仟|佰|拾|角)/g, "零")
            .replace(/(零)+/g, "零")
            .replace(/零(万|亿|元)/g, "$1")
            .replace(/(亿)万|壹(拾)/g, "$1$2")
            .replace(/^元零?|零分/g, "")
            .replace(/元$/g, "元整")
        );
      }
    },
    addline() {
      this.$nextTick(() => {
        var parmas = {
          classification: "",
          subjectMatter: "",
          bill: "",
          loanSerialNumber: "",
          amountOfMoney: "",
        };
        this.detailData.push(parmas);
        const { form } = this;
        form.setFieldsValue({
          keys: this.keys,
        });
      });
    },
    handleSave() {
      this.form.validateFields((errors, values) => {
        console.log(values);
      });
    },
    handleApply() {
      this.form.validateFields((errors, values) => {
        console.log(values);
        this.$message.info("申请失败");
      });
    },
    deleteBtn(item, index) {
      console.log("item.index", item, index);
      this.$nextTick(() => {
        this.detailData.splice(index, 1);
        this.changeNum();
      });
    },
    add(m) {
      console.log("add", m);
      this.amountNum = "";
      this.loanUser = "";
      this.reimbursementMoney = "";
      this.reimbursementMoneyCapitalization = "";
      this.loanDepartmentName = "";
      this.showSave = false;
      this.detailData = [];
      this.detailData = [
        {
          classification: "",
          subjectMatter: "",
          bill: "",
          loanSerialNumber: "",
          amountOfMoney: "",
        },
      ];
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(m, fields));
        this.form.setFieldsValue({
          fillingDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          loanDepartmentName: "",
        });
        this.$post(this.url.getListByPidTree, {
          pid: "A678492BBD7942EA8E96E85B27112154",
        }).then((res) => {
          this.typeList = res;
          this.typeSonList = [];
        });
        if (this.typeNum && this.typeNum === 2) {
          this.form.setFieldsValue({
            loanUserId: this.userInfo.userNameId,
            loanUser: this.userInfo.userName,
            loanDepartmentId: this.userInfo.orgId,
            loanDepartmentName: this.userInfo.orgName,
          });
        }
      });
    },
    edit(m) {
      this.amountNum = "";
      this.showSave = true;
      this.detailData = [];
      this.detailData = [
        {
          classification: "",
          subjectMatter: "",
          bill: "",
          loanSerialNumber: "",
          amountOfMoney: "",
        },
      ];
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(m, fields));
        this.$post(this.url.getPageSet, {
          financeUuid: m.uuid,
        }).then((res) => {
          this.detailData = res.rows;
        });
      });
    },
    typeChange(item) {
      this.form.setFieldsValue({
        reimbursementTypeUuid: item.uuid,
      });
      this.$post(this.url.getListByPidTree, {
        pid: item.id,
      }).then((res) => {
        this.typeSonList = res;
      });
    },
    popupCallback(value, other) {
      this.$nextTick(() => {
        this.loanUser = value.userName;
        this.form.setFieldsValue({
          loanUser: this.loanUser,
          loanUserId: value.userNameId,
          loanDepartmentId: value.orgId,
          loanDepartmentName: value.orgName,
        });
      });
    },
    changeEditor(e) {
      this.trainContent = e;
      this.form.setFieldsValue({
        trainContent: e,
      });
    },
    selectOrg(value, node) {
      this.$nextTick(() => {
        this.loanDepartmentName = node ? node.toString() : "";
        this.form.setFieldsValue({
          loanDepartmentId: this.loanDepartmentId,
          loanDepartmentName: this.loanDepartmentName,
        });
      });
    },
    handleFaOk(type) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        let url = "";
        this.form.validateFields((errors, values) => {
          values.isRelease = type;
          var fileDate = {
            isRelease: type,
            officeFinance: JSON.stringify(values),
            officeReimbursementDetailsStr: JSON.stringify(this.detailData),
          };
          console.log(fileDate, type);
          if (!errors) {
            url = this.url.saveReimbursement;
            this.$post(url, fileDate).then((res) => {
              if (res === 1 || res.statusCode === 200) {
                this.$emit("reply");
                this.$message.success(res.message ? res.message : "操作成功");
              } else {
                this.$message.error(res.message);
              }
            });
          }
        });
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-col .ant-form-item-control-wrapper {
  width: 100%;
}

.tab_table {
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
  margin-right: 10px;
  padding: 5px 5px 0 5px;
  max-height: 300px;
  overflow: auto;

  & span {
    padding: 3px 8px;
    margin-bottom: 5px;
  }
}

.item-box {
  display: flex;
  align-items: flex-start;
}

.account-center-avatarHolder {
  padding-top: 20px;
}

.table-ant {
  width: 80%;
  margin: 0 auto 50px;
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
