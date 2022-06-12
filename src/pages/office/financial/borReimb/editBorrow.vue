<template>
  <t-modal
    title="借款申请单"
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
      <a-button
        v-if="state != '草稿' && !isView"
        class="cu-btn-primary"
        @click="
          () => {
            $emit('save');
          }
        "
        >保存</a-button
      >
      <a-button
        v-if="!isView"
        class="cu-btn-primary"
        @click="
          () => {
            $emit('ok');
          }
        "
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
      <a-form :form="form">
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
                  借款申请单
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
                    :disabled="isView"
                  />
                </a-form-item>
              </td>
              <td style="text-align: center;">填报日期:</td>
              <td colspan="2">
                <a-form-item>
                  <!-- <t-date v-decorator="['fillingDate']" style="width: 100%;"
									 :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss" allowClear :disabled="isView"/> -->
                  <a-date-picker
                    v-decorator="['fillingDate']"
                    style="width: 100%;"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    allowClear
                    :disabled="isView"
                    @change="changeStartData"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>借款人</td>
              <td colspan="2">
                <a-form-item>
                  <user-popup
                    :visible="visiblePopupNotice"
                    style="width: 100%;"
                    @change="
                      (value, other) => popupCallNoticeback(value, other)
                    "
                    @close="() => (visiblePopupNotice = false)"
                    :typeNum="1"
                  />
                  <a-input
                    @click="
                      () => {
                        if (typeNum != 2) {
                          visiblePopupNotice = true;
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
                    placeholder="借款人"
                    readOnly
                    :disabled="isView"
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </td>
              <td>借款单位</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'loanDepartmentName',
                      { rules: [{ required: true, message: '必填！' }] },
                    ]"
                    readOnly
                    :disabled="isView"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>借款事由</td>
              <td colspan="5">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'subjectMatter',
                      { rules: [{ required: true, message: '必填！' }] },
                    ]"
                    :disabled="isView"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>还款日期</td>
              <td colspan="2">
                <a-form-item>
                  <!-- <t-date v-decorator="['loanRepaymentDateStr',{rules: [{required: true, message: '必填！'}]}]" style="width: 100%;" dateFormat="YYYY-MM-DD" allowClear :disabled="isView" /> -->
                  <a-date-picker
                    v-decorator="[
                      'loanRepaymentDateStr',
                      { rules: [{ required: true, message: '必填！' }] },
                    ]"
                    :disabled-date="disabledEndDate"
                    format="YYYY-MM-DD"
                    @change="changeDate"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>借款金额</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'loanMoney',
                      {
                        initialValue: loanMoney,
                        rules: [{ required: true, message: '必填！' }],
                      },
                    ]"
                    @change="changeNum"
                    :disabled="isView"
                  />
                </a-form-item>
              </td>
              <td>金额大写</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'loanMoneyCapitalization',
                      { initialValue: loanMoneyCapitalization },
                    ]"
                    readOnly
                    :disabled="isView"
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
                    :disabled="isView"
                  />
                </a-form-item>
                <a-form-item>
                  <a-input v-decorator="['uuid']" type="hidden" />
                </a-form-item>
                <a-form-item>
                  <a-input v-decorator="['loanUserId']" type="hidden" />
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
// 表单字段
const fields = [
  "uuid",
  "serialNumber",
  "fillingDate",
  "loanUser",
  "loanUserId",
  "loanDepartmentName",
  "subjectMatter",
  "loanMoney",
  "loanMoneyCapitalization",
  "agentName",
  "finaAudit",
  "leaderReview",
  "cashName",
  "remarks",
  "loanRepaymentDateStr",
  "loanDepartmentId",
];

export default {
  components: {
    Editor,
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
        getOrgTree: "/mdata/organization/getListByLevelId?levelId=1",
        getListByPid: "/mdata/organization/getListByPid",
        getDetailByUuid: "/office/officeFinance/getDetailByUuid",
      },
      isClear: true,
      uuid: "",
      trainContent: "",
      loanMoneyCapitalization: "",
      loanMoney: "",
      visiblePopupNotice: false,
      loanUser: "",
      showSave: false,
      treeData: [],
      state: true,
      isView: false,
      startValue: "",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    loanMoney(val) {
      console.log("val", val);
    },
  },
  mounted() {
    console.log("userInfo", this.userInfo);
  },
  methods: {
    moment,
    changeNum() {
      this.$nextTick(() => {
        this.form.validateFields((errors, values) => {
          if (values.loanMoney) {
            this.loanMoneyCapitalization = this.changeCapital(
              Number(values.loanMoney)
            );
          } else {
            this.loanMoneyCapitalization = "";
          }
          this.form.setFieldsValue({
            loanMoneyCapitalization: this.loanMoneyCapitalization,
          });
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
    popupCallNoticeback(value, other) {
      this.$nextTick(() => {
        console.log("value", value);
        this.loanUser = value.userName;
        this.form.setFieldsValue({
          loanUser: this.loanUser,
          loanUserId: value.userNameId,
          loanDepartmentName: value.orgName,
          loanDepartmentId: value.orgId,
        });
      });
    },
    add(m) {
      console.log("add", m);
      this.amountWord = "";
      this.loanUser = "";
      this.loanMoney = "";
      this.state = "";
      this.isView = m.isView;
      this.loanMoneyCapitalization = "";
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(m, fields));
        this.form.setFieldsValue({
          fillingDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        });
        this.startValue = new Date();
        this.showSave = false;
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
      this.amountWord = "";
      this.loanUser = "";
      this.showSave = true;
      this.state = m.state;
      this.isView = m.isView;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(m, fields));
        this.form.setFieldsValue({
          loanRepaymentDateStr: moment(m.loanRepaymentDateStr).format(
            "YYYY-MM-DD"
          ),
        });
      });
    },
    changeEditor(e) {
      this.trainContent = e;
      this.form.setFieldsValue({
        trainContent: e,
      });
    },
    changeDate(date, dateStr) {
      console.log("date, dateString", date, dateStr);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          loanRepaymentDateStr: dateStr,
        });
      });
    },
    changeStartData(date, dateStr) {
      console.log("date, dateString", date, dateStr);
      this.startValue = date;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          fillingDate: dateStr,
        });
      });
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-form-item-control-wrapper {
  width: 100%;
  height: 100%;
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
    width: 100%;
  }

  input {
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
    background: transparent;
  }

  textarea {
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
    background: transparent;
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
  background: transparent;
}

textarea,
textarea.ant-input:hover,
textarea:focus {
  // border: 1px solid #DAE2F3;
  -webkit-box-shadow: none;
  box-shadow: none;
  background: transparent;
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
