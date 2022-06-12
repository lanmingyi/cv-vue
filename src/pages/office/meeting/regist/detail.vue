<template>
  <a-modal
    title="会议登记表"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <template slot="footer">
      <!-- <a-button class="cu-btn-primary" v-print="'printBox'">打印</a-button> -->
      <a-button
        class="cu-btn-primary"
        v-if="!showUpData"
        @click="
          () => {
            $emit('save');
          }
        "
        >保存</a-button
      >
      <a-button
        class="cu-btn-primary"
        v-if="!showUpData"
        @click="
          () => {
            $emit('ok');
          }
        "
        >完成登记</a-button
      >
      <a-button
        class="cu-btn-primary"
        v-if="showUpData"
        @click="
          () => {
            $emit('update');
          }
        "
        >更新</a-button
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
                  会议登记表
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
              <td style="text-align: center;">登记日期:</td>
              <td colspan="2">
                <a-form-item>
                  <t-date
                    v-decorator="[
                      'registerDate',
                      { rules: [{ required: true, message: '登记日期' }] },
                    ]"
                    style="width: 100%;"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD HH:mm:ss"
                    allowClear
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>通知单位</td>
              <td colspan="2">
                <a-form-item>
                  <tree-select
                    v-decorator="[
                      'notificationUnit',
                      { rules: [{ required: true, message: '必填' }] },
                    ]"
                    :treeValueText="notificationUnit"
                    placeholder="通知单位"
                    :parameter="parameterOrg"
                    :url="urlOrg"
                    :data="treeData"
                    idfield="id"
                    textfield="text"
                    @change="selectOrg"
                  />
                </a-form-item>
              </td>
              <td>会议通知方式</td>
              <td colspan="2">
                <a-form-item>
                  <a-select
                    v-decorator="[
                      'methodOfMeetingNotice',
                      { rules: [{ required: true, message: '必填' }] },
                    ]"
                  >
                    <a-select-option
                      v-for="(item, index) in noticeList"
                      :key="index"
                      :value="item.text"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>通知人</td>
              <td colspan="2">
                <a-form-item>
                  <user-popup
                    :visible="visiblePopupNotifi"
                    style="width: 100%;"
                    @change="
                      (value, other) => popupCallNotifiback(value, other)
                    "
                    @close="() => (visiblePopupNotifi = false)"
                  />
                  <a-input
                    @click="() => (visiblePopupNotifi = true)"
                    v-decorator="[
                      'notifier',
                      {
                        initialValue: notifier,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                    placeholder="通知人"
                    readOnly
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </td>
              <td>来电号码</td>
              <td colspan="2">
                <a-form-item>
                  <a-input v-decorator="['callingNumber']" />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>参会时间</td>
              <td colspan="2">
                <a-form-item>
                  <t-date
                    v-decorator="[
                      'participationTime',
                      { rules: [{ required: true, message: '登记日期' }] },
                    ]"
                    style="width: 100%;"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD HH:mm:ss"
                    allowClear
                  />
                </a-form-item>
              </td>
              <td>会议地点</td>
              <td colspan="2">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'mettingAddress',
                      { rules: [{ required: true, message: '必填' }] },
                    ]"
                    @click="attendAddMeeting"
                    readOnly
                  />
                  <t-select-meeting
                    ref="attendModal"
                    @change="attendSelectMeeting"
                    @changeData="changeattendMeeting"
                    :isSelect="false"
                    :visible="attendVisible"
                    @close="close"
                    :paramList="paramList"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>会议主持人</td>
              <td colspan="2">
                <a-form-item>
                  <user-popup
                    :visible="visiblePopup"
                    style="width: 100%;"
                    @change="(value, other) => popupCallback(value, other)"
                    @close="() => (visiblePopup = false)"
                  />
                  <a-input
                    @click="() => (visiblePopup = true)"
                    v-decorator="[
                      'moderator',
                      {
                        initialValue: moderator,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                    placeholder="会议主持人"
                    readOnly
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </td>
              <td>承办/主办单位</td>
              <td colspan="2">
                <a-form-item>
                  <tree-select
                    v-decorator="[
                      'company',
                      {
                        initialValue: company,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                    :treeValueText="company"
                    placeholder="承办/主办单位"
                    :parameter="parameterOrg"
                    :url="urlOrg"
                    :data="treeData"
                    idfield="id"
                    textfield="text"
                    @change="selectCompany"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>会议名称</td>
              <td colspan="2">
                <a-form-item>
                  <a-input v-decorator="['mettingName']" />
                </a-form-item>
              </td>
              <td>会议类型</td>
              <td colspan="2">
                <a-form-item>
                  <a-select
                    v-decorator="[
                      'mettingType',
                      { rules: [{ required: true, message: '必填' }] },
                    ]"
                  >
                    <a-select-option
                      v-for="(item, index) in typeList"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr line-height-80">
              <td>会议议题</td>
              <td colspan="5">
                <a-form-item>
                  <a-input
                    type="textarea"
                    v-decorator="[
                      'issueName',
                      { rules: [{ required: true, message: '必填' }] },
                    ]"
                    hidden
                  />
                  <a-select
                    mode="multiple"
                    v-model="issueNameList"
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <!-- <div slot="dropdownRender" slot-scope="menu">
										      <v-nodes :vnodes="menu" />
										      <a-divider style="margin: 4px 0;" />
										      <div
										        style="padding: 4px 8px; cursor: pointer;"
										        @mousedown="e => e.preventDefault()"
										        @click="addItem"
										      >
										        <a-icon type="plus" /> Add item
										      </div>
										    </div> -->
                    <a-select-option
                      v-for="(item, index) in topicsList"
                      :key="index"
                      :value="item.topicsName"
                    >
                      {{ item.topicsName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td height="150">会议内容</td>
              <td height="150" colspan="5">
                <a-form-item>
                  <a-input
                    type="textarea"
                    style="width: 100%;height: 100%;margin-top: 5px;"
                    v-decorator="['mettingContent']"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td height="150">参会要求</td>
              <td height="150" colspan="5">
                <a-form-item>
                  <a-input
                    type="textarea"
                    style="width: 100%;height: 100%;margin-top: 5px;"
                    v-decorator="['mettingRequirement']"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>通知接收人</td>
              <td colspan="2">
                <a-form-item>
                  <user-popup
                    :visible="visiblePopupNotice"
                    style="width: 100%;"
                    @change="
                      (value, other) => popupCallNoticeback(value, other)
                    "
                    @close="() => (visiblePopupNotice = false)"
                  />
                  <a-input
                    @click="() => (visiblePopupNotice = true)"
                    v-decorator="[
                      'noticeReceiver',
                      {
                        initialValue: noticeReceiver,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                    placeholder="通知接收人"
                    readOnly
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </td>
              <td>通知接收时间</td>
              <td colspan="2">
                <a-form-item>
                  <t-date
                    v-decorator="[
                      'noticeReceiverTime',
                      { rules: [{ required: true, message: '登记日期' }] },
                    ]"
                    style="width: 100%;"
                    :showTime="true"
                    dateFormat="YYYY-MM-DD HH:mm:ss"
                    allowClear
                  />
                </a-form-item>
              </td>
            </tr>
            <!-- <tr class="table_tr line-height-80">
							<td rowspan="5">会议受理与安排</td>
							<td style="text-align: center;">经办人意见</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['operatorOpinion']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td>主任/科长意见</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['directorsOpinion']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td>分局领导意见</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['opinionsOfBranchLeaders']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td>实际参会人员</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['actualParticipants']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td>参会专家</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['participatingExperts']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td rowspan="3">会议经办</td>
							<td style="text-align: center;">会议承办处理结果</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['handlingResultsMeeting']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td>会议摘要</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['meetingSummary']" />
								</a-form-item>
							</td>
						</tr>
						<tr class="table_tr line-height-80">
							<td>领导示阅</td>
							<td colspan="4">
								<a-form-item>
									<a-input v-decorator="['leadershipDemonstration']" />
								</a-form-item>
								<a-form-item>
									<a-input v-decorator="['uuid']" type="hidden"/>
								</a-form-item>
							</td>
						</tr> -->
          </table>

          <a-form-item>
            <a-input v-decorator="['issueUuid']" type="hidden" />
          </a-form-item>
          <a-form-item>
            <a-input v-decorator="['uuid']" type="hidden" />
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from "lodash.pick";

import UserPopup from "@/components/TopVUI/custom/userPopup";
import Editor from "@/components/TopVUI/custom/Editor/index.vue";
import TSelectMeeting from "@/components/TopVUI/custom/TSelectMeeting";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
// 表单字段
const fields = [
  "serialNumber",
  "registerDate",
  "notificationUnit",
  "methodOfMeetingNotice",
  "notifier",
  "callingNumber",
  "participationTime",
  "mettingAddress",
  "moderator",
  "company",
  "mettingName",
  "mettingType",
  "mettingContent",
  "leadershipDemonstration",
  "uuid",
  "mettingRequirement",
  "noticeReceiver",
  "noticeReceiverTime",
  "operatorOpinion",
  "directorsOpinion",
  "opinionsOfBranchLeaders",
  "actualParticipants",
  "participatingExperts",
  "handlingResultsMeeting",
  "meetingSummary",
  "leadershipDemonstration",
  "issueUuid",
  "issueName",
];

export default {
  components: {
    Editor,
    UserPopup,
    TSelectMeeting,
    TreeSelect,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
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
    typeList: {
      type: Array,
      default: () => [],
    },
    meetingList: {
      type: Array,
      default: () => [],
    },
    securityList: {
      type: Array,
      default: () => [],
    },
    noticeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      url: {
        getSerialNumber: "/office/officeMeetingRegister/getSerialNumber", // 获取流水号
        getMettingTopic: "/office/oaMeetingTopics/getMettingTopic",
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
      amountWord: "",
      borrowAmount: "",
      noticeReceiver: "",
      moderator: "",
      visiblePopupNotice: false,
      visiblePopup: false,
      showUpData: false,
      visiblePopupNotifi: false,
      notifier: "",
      treeData: [],
      treeDataCompany: [],
      paramList: [],
      assetUuid: [],
      assetData: [],
      attendVisible: false,
      notificationUnit: "",
      company: "",
      issueNameList: [],
      topicsList: [],
    };
  },
  updated() {
    this.isClear = false;
    this.trainContent = this.form.getFieldValue("trainContent");
  },
  watch: {
    borrowAmount(val) {
      console.log("val", val);
    },
  },
  methods: {
    handleChange(e) {
      console.log("log", e);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          issueName: this.issueNameList.join(","),
        });
      });
    },
    addItem() {
      console.log("新增");
    },
    popupCallback(value, other) {
      this.$nextTick(() => {
        this.moderator = value.userName;
        this.form.setFieldsValue({
          moderator: this.moderator,
        });
      });
    },
    popupCallNoticeback(value, other) {
      this.$nextTick(() => {
        this.noticeReceiver = value.userName;
        this.form.setFieldsValue({
          noticeReceiver: this.noticeReceiver,
        });
      });
    },
    popupCallNotifiback(value, other) {
      this.$nextTick(() => {
        this.notifier = value.userName;
        this.form.setFieldsValue({
          notifier: this.notifier,
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
        this.$message.info("登记失败");
      });
    },
    attendAddMeeting() {
      this.attendVisible = true;
    },
    attendSelectMeeting(e) {},
    close() {
      this.attendVisible = false;
    },
    changeattendMeeting(data) {
      console.log("data", data[0]);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          conferenceRoomUuid: data[0].uuid,
          mettingAddress: data[0].name,
        });
      });
    },
    add(m, type) {
      console.log("add", m, type);
      this.noticeReceiver = "";
      this.moderator = "";
      this.form.setFieldsValue(pick(m, fields));
      this.$nextTick(() => {
        this.notificationUnit =
          m && m.notificationUnit ? m.notificationUnit : "";
        this.company = m && m.company ? m.company : "";
      });
      if (m) {
        this.typeList.forEach((val) => {
          if (val.text === m.mettingType) {
            this.form.setFieldsValue({
              mettingType: val.value,
            });
          }
        });
        this.issueNameList = m.issueName ? m.issueName.split(",") : [];
      }
      this.$post(this.url.getMettingTopic).then((res) => {
        console.log("res111", res);
        this.topicsList = res;
      });
      this.$post(this.url.getSerialNumber).then((res) => {
        console.log("res2222", res);
        this.form.setFieldsValue({
          serialNumber: res,
        });
      });
      if (type && type === "1") {
        this.showUpData = true;
      } else {
        this.showUpData = false;
      }
    },
    changeAddress(item) {
      this.form.setFieldsValue({
        conferenceRoomUuid: item.uuid,
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
        this.notificationUnit = node ? node.toString() : "";
        this.form.setFieldsValue({
          notificationUnitId: value,
          notificationUnit: this.notificationUnit,
        });
      });
    },
    selectCompany(value, node) {
      this.$nextTick(() => {
        this.company = node ? node.toString() : "";
        this.form.setFieldsValue({
          company: this.company,
        });
      });
    },
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
