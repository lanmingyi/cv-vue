<template>
  <t-modal
    title="新增/编辑"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <template slot="footer">
      <a-button
        class="cu-btn-primary"
        v-if="!type"
        @click="
          () => {
            $emit('ok');
          }
        "
        >提交申请</a-button
      >
      <a-button
        class="cu-btn-primary"
        v-if="type === 'reApply'"
        @click="
          () => {
            $emit('reply');
          }
        "
        >重新申请</a-button
      >
      <a-button
        class="cu-btn-primary"
        v-if="type === 'switchPosition'"
        @click="
          () => {
            $emit('switchPosition');
          }
        "
      >
        调换申请</a-button
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
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="24" type="flex" justify="start">
          <a-col :span="24">
            <a-form-item
              label="会议主题"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <!-- <a-select v-decorator="['topics', {rules: [{required: true, message: '必填'}]}]">
								<a-select-option v-for="(item, index) in topicsList" :key="index"
									:value="item.topicsName" @click="changeTopics(item)">
									{{ item.topicsName }}
								</a-select-option>
							</a-select> -->
              <a-input
                v-decorator="[
                  'topics',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="会议室名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="typeNum === 1"
            >
              <a-input
                v-decorator="[
                  'conferenceRoomName',
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
            <a-form-item
              label="会议室名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="typeNum === 2"
            >
              <a-input
                v-decorator="[
                  'conferenceRoomName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                readOnly
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="参会人数"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'attendNumberOfPeople',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="预定开始日期"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'reserveStartDate',
                  {
                    initialValue: reserveStartDate
                      ? moment(reserveStartDate).format('YYYY-MM-DD')
                      : '',
                    rules: [{ required: true, message: '预定日期' }],
                  },
                ]"
                type="hidden"
              />
              <a-date-picker
                v-model="startValue"
                :disabled-date="disabledStartDate"
                :show-today="false"
                @change="panelStartChange"
                :show-time="{ format: 'HH:mm', 'minute-step': 30 }"
                format="YYYY-MM-DD HH:mm"
                placeholder="预定开始日期"
                @openChange="handleStartOpenChange"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="预定结束日期"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'reserveEndDate',
                  {
                    initialValue: reserveEndDate
                      ? moment(reserveEndDate).format('YYYY-MM-DD')
                      : '',
                    rules: [{ required: true, message: '开始时间' }],
                  },
                ]"
                type="hidden"
              />
              <a-date-picker
                v-model="endValue"
                :disabled-date="disabledEndDate"
                :show-today="false"
                @change="panelEndChange"
                :show-time="{ format: 'HH:mm', 'minute-step': 30 }"
                format="YYYY-MM-DD HH:mm"
                placeholder="预定结束日期"
                :open="endOpen"
                @openChange="handleEndOpenChange"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <a-textarea :rows="4" v-decorator="['reason']" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['conferenceRoomUuid']" type="hidden" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['department']" type="hidden" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['uuid']" type="hidden" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['topicsId']" type="hidden" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import moment from "moment";

import TSelectMeeting from "@/components/TopVUI/custom/TSelectMeeting";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
// 表单字段
const fields = [
  "uuid",
  "conferenceRoomName",
  "conferenceRoomUuid",
  "department",
  "departmentName",
  "reason",
  "topics",
  "attendNumberOfPeople",
  "reserveStartDate",
  "topicsId",
  "reserveEndDate",
];

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
    meetingList: {
      type: Array,
      default: () => [],
    },
    typeNum: {
      type: Number,
      default: 2,
    },
  },
  components: {
    TSelectMeeting,
    TreeSelect,
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      labelColfull: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
      wrapperColfull: {
        xs: {
          span: 24,
        },
        sm: {
          span: 18,
        },
      },
      form: this.$form.createForm(this),
      url: {
        getTopicBaseDetailByUuid: "/system/topicBase/getDetailByUuid",
        getDetailByUuidAndUser: "/office/oaMeetingsBase/getDetailByUuidAndUser",
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
      treeData: [],
      topicsList: [],
      type: "",
      attendVisible: false,
      paramList: [],
      assetUuid: [],
      assetData: [],
      departmentName: "",
      startTime: null,
      endTime: null,
      nowTime: null,
      startValue: "",
      endValue: "",
      endOpen: false,
      reserveStartDate: "",
      reserveEndDate: "",
      nowValue: new Date(),
    };
  },
  methods: {
    moment,
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
          conferenceRoomName: data[0].name,
        });
      });
    },
    onLoad(title, uuid) {
      console.log("title,uuid--------", title, uuid);
      this.$post(this.url.getMettingTopic).then((res) => {
        console.log("res", res);
        this.topicsList = res;
      });
      this.$nextTick(() => {
        this.form.setFieldsValue({
          conferenceRoomUuid: uuid,
          conferenceRoomName: title,
        });
      });
    },
    add(m) {
      console.log("add", m);
      this.type = "";
      this.startValue = "";
      this.endValue = "";
      this.nowValue = null;
      this.reserveStartDate = "";
      this.reserveEndDate = "";
      this.$post(this.url.getMettingTopic).then((res) => {
        console.log("res", res);
        this.topicsList = res;
      });
    },
    edit(m, type) {
      console.log("m------", m);
      this.type = type ? type : "";
      this.startValue = "";
      this.endValue = "";
      this.reserveStartDate = "";
      this.reserveEndDate = "";
      this.$post(this.url.getMettingTopic).then((res) => {
        this.topicsList = res;
      });
      this.reserveStartDate = m.reserveStartDate;
      this.reserveEndDate = m.reserveEndDate;
      this.startValue = moment(m.reserveStartDate);
      this.endValue = moment(m.reserveEndDate);
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(m, fields));
        if (m) {
          this.form.setFieldsValue({
            reserveStartDate: moment(m.reserveStartDate).format(
              "yyyy-MM-DD HH:mm:ss"
            ),
            reserveEndDate: moment(m.reserveEndDate).format(
              "yyyy-MM-DD HH:mm:ss"
            ),
          });
        }
      });
      console.log("reserveStartDate-----", this.reserveStartDate);
      console.log("reserveEndDate---------", this.reserveEndDate);
    },
    // 开始时间
    getChangeDate(val) {
      let time = moment(val)
        .format("yyyy-MM-DD HH:mm")
        .split(" ")[1];
      let data = moment(val).format("yyyy-MM-DD");

      let hour = time.split(":")[0];
      let minute = time.split(":")[1];
      console.log("minute---", minute);
      if (minute > 30) {
        hour++;
        minute = "00";
      } else if (minute == "00") {
        minute = "00";
      } else if (minute <= 30) {
        minute = "30";
      }
      return data.concat(" " + hour + ":" + minute + ":00");
    },
    disabledStartDate(startValue) {
      const endValue = new Date();
      if (!startValue || !endValue) {
        return false;
      }
      return endValue.valueOf() > startValue.valueOf() + 2 * 60 * 1000; //给两分钟显示今日
      // if(this.endValue){
      // 	return endValue.valueOf() < startValue.valueOf(); //给两分钟显示今日
      // } else {
      // 	return endValue.valueOf() > startValue.valueOf() + (2*60*1000); //给两分钟显示今日
      // }
      // return startValue.valueOf() > endValue.valueOf() || startValue < moment().subtract(1, 'day').endOf("day");
    },
    disabledEndDate(endValue) {
      const startValue = moment(this.startValue);
      if (!endValue || !startValue) {
        return false;
      }
      return (
        startValue.valueOf() + 30 * 60 * 1000 >
        endValue.valueOf() + 2 * 60 * 1000
      ); //预定最小时长30分钟   毫秒
    },
    handleStartOpenChange(open) {
      if (!open) {
        // this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      if (this.startValue) {
        this.endOpen = open;
      } else {
        this.$message.info("请先选择预定开始日期");
      }
    },
    panelStartChange(date, dateString) {
      this.form.setFieldsValue({
        reserveStartDate: this.getChangeDate(date),
      });
      this.startValue = this.getChangeDate(date);
    },
    panelEndChange(date, dateString) {
      this.form.setFieldsValue({
        reserveEndDate: this.getChangeDate(date),
      });
      this.endValue = this.getChangeDate(date);
      this.nowValue = date;
    },
    //-------结束
    changeAddress(item) {
      console.log("item", item);
      this.form.setFieldsValue({
        conferenceRoomUuid: item.uuid,
      });
    },
    changeTopics(item) {
      console.log("item", item);
      this.form.setFieldsValue({
        topics: item.text,
        topicsId: item.uuid,
      });
    },
    selectOrg(value, node) {
      this.$nextTick(() => {
        this.departmentName = node ? node.toString() : "";
        this.form.setFieldsValue({
          department: value,
          departmentName: node ? node.toString() : "",
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
/deep/a .ant-calendar-ok-btn.disabled.active {
  background-color: #f5f5f5 !important;
  border-color: #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.25) !important;
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
</style>
