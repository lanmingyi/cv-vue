<template>
  <t-drawer
    title="申请详情"
    placement="right"
    :closable="false"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @close="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-card :bordered="false">
      <div class="account-center-avatarHolder" id="printBoxDetail">
        <table
          class="table-ant"
          style="table-layout: fixed; word-break: break-all;"
          v-if="data && type === 'borrow'"
        >
          <thead>
            <tr>
              <th colspan="6" style="text-align: center;padding-bottom: 30px;">
                借款申请单
              </th>
            </tr>
          </thead>
          <tr>
            <td style="text-align: center;">流水号:</td>
            <td colspan="2">
              {{ data.serialNumber }}
            </td>
            <td style="text-align: center;">填报日期:</td>
            <td colspan="2">
              {{ data.fillingDate }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>借款人</td>
            <td colspan="2">
              {{ data.loanUser }}
            </td>
            <td>借款单位</td>
            <td colspan="2">
              {{ data.loanDepartmentName }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>借款事由</td>
            <td colspan="5">
              {{ data.subjectMatter }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>还款日期</td>
            <td colspan="2">
              {{ moment(data.loanRepaymentDateStr).format("YYYY-MM-DD") }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>借款金额</td>
            <td colspan="2">
              {{ data.loanMoney }}
            </td>
            <td>金额大写</td>
            <td colspan="2">
              {{ data.loanMoneyCapitalization }}
            </td>
          </tr>
          <tr class="table_tr" v-if="approvalList">
            <td :rowspan="approvalList.length">审批意见</td>
            <td colspan="2" style="text-align: center;">流程环节</td>
            <td>状态</td>
            <td colspan="2">审批意见</td>
          </tr>
          <tr
            class="table_tr line-height-80"
            v-for="(item, index) in approvalList.slice(1)"
            :key="index"
          >
            <td colspan="2">{{ item.activityName }}</td>
            <td>
              {{ item.comment.typeName }}
            </td>
            <td colspan="2">{{ item.comment.message }}</td>
          </tr>
          <tr class="table_tr">
            <td height="150">备注</td>
            <td height="150" colspan="5">
              {{ data.remarks }}
            </td>
          </tr>
        </table>

        <table
          class="table-ant"
          style="table-layout: fixed; word-break: break-all;"
          v-if="data && type === 'payment'"
        >
          <thead>
            <tr>
              <th colspan="6" style="text-align: center;padding-bottom: 30px;">
                付款申请单
              </th>
            </tr>
          </thead>
          <tr>
            <td style="text-align: center;">流水号:</td>
            <td colspan="2">
              {{ data.serialNumber }}
            </td>
            <td style="text-align: center;">填报日期:</td>
            <td colspan="2">
              {{ data.fillingDate }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>付款人</td>
            <td colspan="2">
              {{ data.loanUser }}
            </td>
            <td>付款单位</td>
            <td colspan="2">
              {{ data.loanDepartmentName }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>付款事由</td>
            <td colspan="5">
              {{ data.subjectMatter }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>付款金额</td>
            <td colspan="2">
              {{ data.paymentMoney }}
            </td>
            <td>金额大写</td>
            <td colspan="2">
              {{ data.paymentMoneyCapitalization }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td rowspan="4">审批意见</td>
            <td style="text-align: center;">经办部门</td>
            <td colspan="4">
              {{ data.agentName }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td>财务审核</td>
            <td colspan="4">
              {{ data.finaAudit }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td>领导复核</td>
            <td colspan="4">
              {{ data.leaderReview }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td>出纳</td>
            <td colspan="4">
              {{ data.cashName }}
            </td>
          </tr>
          <tr class="table_tr">
            <td height="150">备注</td>
            <td height="150" colspan="5">
              {{ data.remarks }}
            </td>
          </tr>
        </table>

        <table
          class="table-ant"
          style="table-layout: fixed; word-break: break-all;"
          v-if="data && type === 'remiburse'"
        >
          <thead>
            <tr>
              <th colspan="6" style="text-align: center;padding-bottom: 30px;">
                支出报销单
              </th>
            </tr>
          </thead>
          <tr>
            <td style="text-align: center;">流水号:</td>
            <td colspan="2">
              {{ data.serialNumber }}
            </td>
            <td style="text-align: center;">填报日期:</td>
            <td colspan="2">
              {{ data.fillingDate }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>报销类型</td>
            <td colspan="5">
              {{ data.reimbursementType }}
              <span style="padding-left: 20px;">{{
                data.reimbursementTypeSon
              }}</span>
            </td>
          </tr>
          <tr class="table_tr">
            <td>报销单位</td>
            <td colspan="2">
              {{ data.loanDepartmentName }}
            </td>
            <td>填报人</td>
            <td colspan="2">
              {{ data.loanUser }}
            </td>
          </tr>
          <tr class="table_tr">
            <td>报销是由</td>
            <td colspan="5">
              {{ data.subjectMatter }}
            </td>
          </tr>
          <tr class="table_tr">
            <td colspan="6">报销明细</td>
          </tr>
          <tr class="table_tr">
            <td style="text-align: center;">分类项</td>
            <td style="text-align: center;">事由</td>
            <td style="text-align: center;">单据(张)</td>
            <td colspan="2" style="text-align: center;">关联借款流水号</td>
            <td style="text-align: center;">金额(元)</td>
            <!-- <td style="text-align: center;">操作/<a @click="addline()">新增行</a></td> -->
          </tr>
          <tr class="table_tr" v-for="(item, index) in detailData" :key="index">
            <td style="text-align: center;">
              {{ item.classification }}
            </td>
            <td style="text-align: center;">
              {{ item.subjectMatter }}
            </td>
            <td style="text-align: center;">
              {{ item.bill }}
            </td>
            <td colspan="2" style="text-align: center;">
              {{ item.loanSerialNumber }}
            </td>
            <td style="text-align: center;">
              {{ item.amountOfMoney }}
            </td>
            <!-- <td style="text-align: center;" class="no-print">
							<a>上传凭据</a>
							<a-divider type="vertical" />
							<a @click="deleteBtn(item,index)">删除</a>
						</td> -->
          </tr>
          <tr class="table_tr">
            <td>共计</td>
            <td colspan="2">
              {{ data.reimbursementMoney }}
            </td>
            <td>金额大写</td>
            <td colspan="2">
              {{ data.reimbursementMoneyCapitalization }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td rowspan="4">审批意见</td>
            <td style="text-align: center;">经办部门</td>
            <td colspan="4">
              {{ data.agentName }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td>财务审核</td>
            <td colspan="4">
              {{ data.finaAudit }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td>领导复核</td>
            <td colspan="4">
              {{ data.leaderReview }}
            </td>
          </tr>
          <tr class="table_tr line-height-80">
            <td>出纳</td>
            <td colspan="4">
              {{ data.cashName }}
            </td>
          </tr>
          <tr class="table_tr">
            <td height="150">备注</td>
            <td height="150" colspan="5">
              {{ data.remarks }}
            </td>
          </tr>
        </table>
      </div>
      <div style="text-align: center;margin:50px 0;">
        <a-button class="cu-btn-primary" v-print="'printBoxDetail'"
          >打印</a-button
        >
      </div>
    </a-card>
  </t-drawer>
</template>
<script>
import moment from "moment";
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
      data: "",
      url: {
        getDetailByUuid: "/office/officeFinance/getDetailByUuid",
        getPageSet: "/office/officeReimbursementDetails/getPageSet",
        getListCommentsByBusinessKey:
          "/workflow/apiFlowableProcessInstance/getListCommentsByBusinessKey", //获取审批步骤数据 businessKey
      },
      detailData: [],
      approvalList: [],
      approvalSplitList: [],
    };
  },
  methods: {
    moment,
    edit(m, type) {
      this.$nextTick(() => {
        this.type = type;
        this.approvalList = [];
        this.approvalSplitList = [];
        console.log(m, type);
        this.$post(this.url.getListCommentsByBusinessKey, {
          businessKey: m.uuid,
        }).then((res) => {
          if (res.statusCode == 200) {
            this.approvalList = res.commentBeans;
            this.approvalSplitList = res.commentBeans.slice(2);
          }
        });
        this.$axios("get", `${this.url.getDetailByUuid}?uuid=${m.uuid}`).then(
          (res) => {
            this.data = res;
          }
        );
        if (this.type === "remiburse") {
          this.$post(this.url.getPageSet, {
            financeUuid: m.uuid,
          }).then((res) => {
            this.detailData = res.rows;
          });
          console.log("this.detailData", this.detailData);
        }
      });
    },
  },
};
</script>
<style scoped="scoped" lang="less">
/deep/.content-picture {
  width: 100%;
}

/deep/.account-center-avatarHolder {
  img {
    max-width: 100% !important;
  }

  td {
    // border: 1px solid #000;
  }
}

.table-ant {
  width: 100%;
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
    // border: none;
    width: 100%;
    height: 100%;
    // outline: none;
  }

  textarea {
    // border: none;
    width: 100%;
    height: 100%;
    // outline: none;
  }

  .table_tr > td:nth-child(2n) {
    text-align: center;
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

.account-center-title {
  text-align: center;
  font-size: 26px;
  padding: 15px 0;
}

.account-center-info {
  padding-bottom: 30px;
  display: flex;
  justify-content: center;
  font-size: 12px;

  & > div {
    padding: 0 10px;
  }
}

.account-center-avatarHolder {
  // text-align: center;
  margin-bottom: 24px;

  & > .avatar {
    margin: 0 auto;
    width: 104px;
    height: 104px;
    margin-bottom: 20px;
    border-radius: 50%;
    overflow: hidden;

    img {
      height: 100%;
      width: 100%;
    }
  }

  .username {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}
</style>
