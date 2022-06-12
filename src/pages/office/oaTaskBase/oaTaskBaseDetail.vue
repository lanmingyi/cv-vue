<template>
  <a-card title="任务详情">
    <a slot="extra" href="#">
      <a-button class="cu-btn-primary" icon="check" @click="handleUpadte('yes')"
        >完成任务</a-button
      >
      <!-- <a-button class="cu-btn-primary" icon="sync" @click="handleUpadte('no')">更新</a-button> -->
      <a-button
        v-if="!isUpdate"
        class="cu-btn-primary"
        icon="edit"
        @click="
          () => {
            isUpdate = true;
          }
        "
        >编辑</a-button
      >
      <a-button
        v-else
        class="cu-btn-primary"
        icon="sync"
        @click="handleUpadte('no')"
        >更新</a-button
      >
      <a-button class="cu-btn-danger" icon="close" @click="closeRight"
        >关闭</a-button
      >
    </a>
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <div class="account-center-avatarHolder">
          <table
            class="table-ant"
            style="table-layout: fixed; word-break: break-all;"
          >
            <tr class="table_tr">
              <td>任务标题</td>
              <td colspan="2">
                <div v-if="!isUpdate">{{ modelInfo.title }}</div>
                <a-form-item v-else>
                  <a-input
                    v-decorator="[
                      'title',
                      {
                        initialValue: modelInfo.title,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                  />
                </a-form-item>
              </td>
              <td>优先级</td>
              <td colspan="2">
                <div v-if="!isUpdate">{{ modelInfo.priorityName }}</div>
                <a-form-item v-else>
                  <a-select
                    v-decorator="[
                      'priorityName',
                      { initialValue: modelInfo.priorityName },
                    ]"
                  >
                    <a-select-option
                      v-for="(item, index) in priorityArr"
                      :value="item.text"
                      @click="changePriority(item)"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>任务类型</td>
              <td colspan="2">
                <div v-if="!isUpdate">{{ modelInfo.taskTypeName }}</div>
                <a-form-item v-else>
                  <a-select
                    v-decorator="[
                      'taskType',
                      { initialValue: modelInfo.taskTypeName },
                    ]"
                    @change="taskTypeChange"
                  >
                    <a-select-option
                      v-for="(item, index) in taskTypeArr"
                      :value="item.value"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>指派人</td>
              <td colspan="2">
                <div v-if="!isUpdate">{{ modelInfo.assigner }}</div>
                <a-form-item v-else>
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
                      'assigner',
                      {
                        initialValue: modelInfo.assigner,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                    placeholder="指派人"
                    readOnly
                  >
                    <a-icon slot="prefix" type="user" />
                  </a-input>
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>任务状态</td>
              <td colspan="2">
                <div v-if="!isUpdate">
                  {{
                    modelInfo.status == 0
                      ? "未开始"
                      : modelInfo.status == 1
                      ? "已接受"
                      : "已完成"
                  }}
                </div>
                <a-form-item v-else>
                  <a-select
                    v-decorator="['status', { initialValue: modelInfo.status }]"
                  >
                    <a-select-option :value="0">
                      未开始
                    </a-select-option>
                    <a-select-option :value="1">
                      已接受
                    </a-select-option>
                    <a-select-option :value="2">
                      已完成
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </td>
              <td>排序</td>
              <td colspan="2">
                <div v-if="!isUpdate">{{ modelInfo.sort }}</div>
                <a-form-item v-else>
                  <a-input
                    v-decorator="['sort', { initialValue: modelInfo.sort }]"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>计划开始时间</td>
              <td colspan="5">
                <div v-if="!isUpdate">{{ modelInfo.planStartTime }}</div>
                <a-form-item v-else>
                  <a-input
                    v-decorator="[
                      'planStartTime',
                      {
                        initialValue: modelInfo.planStartTime,
                        rules: [{ required: true, message: '开始时间' }],
                      },
                    ]"
                    type="hidden"
                  />
                  <a-date-picker
                    v-model="startValue"
                    :disabled-date="disabledStartDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="计划开始时间"
                    @openChange="handleStartOpenChange"
                    style="width: 100%;min-width: 100%;"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>计划结束时间</td>
              <td colspan="5">
                <div v-if="!isUpdate">{{ modelInfo.planEndTime }}</div>
                <a-form-item v-else>
                  <a-input
                    v-decorator="[
                      'planEndTime',
                      {
                        initialValue: modelInfo.planEndTime,
                        rules: [{ required: true, message: '结束时间' }],
                      },
                    ]"
                    type="hidden"
                  />
                  <a-date-picker
                    v-model="endValue"
                    :disabled-date="disabledEndDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="计划结束时间"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                    style="width: 100%;min-width: 100%;"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>实际开始时间</td>
              <td colspan="5">
                <div v-if="!isUpdate">{{ modelInfo.actualStartTime }}</div>
                <a-form-item v-else>
                  <a-input v-decorator="['actualStartTime']" type="hidden" />
                  <a-date-picker
                    v-model="startActualValue"
                    :disabled-date="disabledActualStartDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="实际开始时间"
                    @openChange="handleStartOpenActualChange"
                    style="width: 100%;min-width: 100%;"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr">
              <td>实际结束时间</td>
              <td colspan="5">
                <div v-if="!isUpdate">{{ modelInfo.actualEndTime }}</div>
                <a-form-item v-else>
                  <a-input v-decorator="['actualEndTime']" type="hidden" />
                  <a-date-picker
                    v-model="endActualValue"
                    :disabled-date="disabledActualEndDate"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="实际结束时间"
                    :open="endOpenActual"
                    @openChange="handleEndOpenActualChange"
                    style="width: 100%;min-width: 100%;"
                  />
                </a-form-item>
              </td>
            </tr>
            <tr class="table_tr ">
              <td>任务内容</td>
              <td colspan="5">
                <div v-if="!isUpdate">{{ modelInfo.content }}</div>
                <a-form-item v-else>
                  <a-textarea
                    :rows="6"
                    v-decorator="[
                      'content',
                      {
                        initialValue: modelInfo.content,
                        rules: [{ required: true, message: '必填' }],
                      },
                    ]"
                  />
                </a-form-item>
              </td>
            </tr>
          </table>
        </div>
        <a-form-item>
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['pid']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['levelId']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['taskTypeText']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['assignerId']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['priority']" type="hidden" />
        </a-form-item>
      </a-form>
      <a-card :bordered="false" class="margin-top">
        <template slot="title"
          ><icon-fonts icon="icon-jindu" class="card-title-icon" />任务进度
        </template>
        <task-tab
          ref="taskEvolveList"
          :model="model"
          :paramList="queryParamList"
        ></task-tab>
      </a-card>
      <a-card class="margin-top" :bordered="false">
        <template slot="title"
          ><icon-fonts icon="icon-jihua" class="card-title-icon" />任务计划
        </template>
        <task-tab
          ref="taskPlanList"
          :model="model"
          :paramList="queryParamList"
        ></task-tab>
      </a-card>
      <a-card class="margin-top" :bordered="false">
        <template slot="title"
          ><icon-fonts icon="icon-wenti" class="card-title-icon" />任务问题
        </template>
        <task-tab
          ref="taskProblemList"
          :model="model"
          :paramList="queryParamList"
        ></task-tab>
      </a-card>
      <a-card class="margin-top" :bordered="false">
        <template slot="title"
          ><icon-fonts icon="icon-fujian" class="card-title-icon" />附件信息
        </template>
        <accessory-info
          ref="accessoryModal"
          :type="2"
          :params="queryParamList"
        ></accessory-info>
      </a-card>
    </a-spin>
  </a-card>
</template>

<script>
import pick from "lodash.pick";
import moment from "moment";

import UserPopup from "@/components/TopVUI/custom/userPopup";
// 表单字段
const fields = [
  "uuid",
  "levelId",
  "pid",
  "title",
  "priority",
  "taskTypeText",
  "taskType",
  "assigner",
  "assignerId",
  "status",
  "sort",
  "planStartTime",
  "planEndTime",
  "actualStartTime",
  "actualEndTime",
  "content",
  "priorityName",
];
import taskTab from "./tabsIndex.vue";
import accessoryInfo from "../oaChuanyue/passFiles.vue";
import {
  filterDictTextByCache,
  filterDictText,
} from "@/components/TopVUI/dict/JDictSelectUtil";

export default {
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 6,
        },
      },
      labelColfull: {
        xs: {
          span: 24,
        },
        sm: {
          span: 3,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 18,
        },
      },
      wrapperColfull: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
      taskTypeArr: [],
      priorityArr: [],
      assignerArr: [],
      url: {
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
        getListByKeywords: "/mdata/user/getListByKeywords",
        getDetailByUuid: "/office/oaTaskBase/getDetailByUuid",
      },
      form: this.$form.createForm(this),
      visiblePopup: false,
      endOpen: false,
      planStartTime: "",
      planEndTime: "",
      endValue: "",
      startValue: "",
      actualStartTime: "",
      actualEndTime: "",
      endOpenActual: false,
      endActualValue: "",
      startActualValue: "",
      modelInfo: {},
      spinning: false,
      isUpdate: false,
    };
  },
  components: { taskTab, accessoryInfo, UserPopup },
  props: {
    queryParamList: {
      type: Object,
      default: null,
    },
    fileUrl: {
      type: Object,
    },
    model: {
      type: Object,
      default: null,
    },
    actType: {
      type: String,
      default: null,
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  watch: {
    startValue(val) {
      this.form.setFieldsValue({
        planStartTime: moment(val).format("YYYY-MM-DD HH:mm:ss"),
      });
    },
    endValue(val) {
      this.form.setFieldsValue({
        planEndTime: moment(val).format("YYYY-MM-DD HH:mm:ss"),
      });
    },
    startActualValue(val) {
      this.form.setFieldsValue({
        actualStartTime: moment(val).format("YYYY-MM-DD HH:mm:ss"),
      });
    },
    endActualValue(val) {
      this.form.setFieldsValue({
        actualEndTime: moment(val).format("YYYY-MM-DD HH:mm:ss"),
      });
    },
  },
  mounted: function() {
    // this.fgtArrList()
    // this.refreshList(this.queryParamList,this.model)
  },
  methods: {
    refreshList(info, recored) {
      const that = this;
      that.spinning = true;
      that.isUpdate = false;
      // if(that.actType === 'view'){
      // 	that.modelInfo = info
      // }
      // 页面数据接口地址
      let taskEvolveUrl = {
        getPageSet: "/office/oaTaskProgress/getPageSet",
        save: "/office/oaTaskProgress/save",
        deleteBatch: "/office/oaTaskProgress/deleteBatch",
        update: "/office/oaTaskProgress/update",
      };
      let taskPlanUrl = {
        getPageSet: "/office/oaTaskPlan/getPageSet",
        save: "/office/oaTaskPlan/save",
        deleteBatch: "/office/oaTaskPlan/deleteBatch",
        update: "/office/oaTaskPlan/update",
      };
      let taskProblemUrl = {
        getPageSet: "/office/oaTaskProblem/getPageSet",
        save: "/office/oaTaskProblem/save",
        deleteBatch: "/office/oaTaskProblem/deleteBatch",
        update: "/office/oaTaskProblem/update",
      };
      // that.fgtArrList()
      that.$nextTick(() => {
        that.$post(that.url.getDicItemByCode + "?code=taskType").then((res) => {
          that.taskTypeArr = res;
        });
        that.$post(that.url.getDicItemByCode + "?code=priority").then((res) => {
          that.priorityArr = res;
        });
        that.$post(that.url.getListByKeywords).then((res) => {
          that.assignerArr = res;
        });
        that
          .$post(that.url.getDetailByUuid, { uuid: recored.uuid })
          .then((res) => {
            // 设置表单组件的值
            that.form.setFieldsValue(pick(res, fields));
            that.modelInfo = res;
            that.modelInfo.priorityName = that.getCodeText(
              that.priorityArr,
              res.priority
            );
            that.modelInfo.taskTypeName = that.getCodeText(
              that.taskTypeArr,
              res.taskType
            );
            that.startValue = res.planStartTime;
            that.endValue = res.planEndTime;
            that.startActualValue = res.actualStartTime
              ? res.actualStartTime
              : "";
            that.endActualValue = res.actualEndTime ? res.actualEndTime : "";
            // that.modelInfo.taskTypeName = getCodeText(this.taskTypeArr,modelInfo.taskType)
            console.log(that.model);
            that.spinning = false;
          });
        that.$refs.taskEvolveList.refreshList(info, taskEvolveUrl); // 设置刷新子表
        that.$refs.taskPlanList.refreshList(info, taskPlanUrl); // 设置刷新子表
        that.$refs.taskProblemList.refreshList(info, taskProblemUrl); // 设置刷新子表
        // that.$refs.accessoryModal.refreshList(info)
        that.$refs.accessoryModal.fetch(info);
      });
    },
    fgtArrList() {
      this.$post(this.url.getDicItemByCode + "?code=taskType").then((res) => {
        this.taskTypeArr = res;
      });
      this.$post(this.url.getDicItemByCode + "?code=priority").then((res) => {
        this.priorityArr = res;
      });
      this.$post(this.url.getListByKeywords).then((res) => {
        this.assignerArr = res;
      });
    },
    getCodeText(arr, val) {
      return filterDictText(arr, val);
    },
    getStatus(val) {
      const arrStatus = {
        0: "未开始",
        1: "已接受",
        2: "已完成",
      };
      return arrStatus[val];
    },
    // 开始时间
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    changeStart(data, dateString) {
      this.$nextTick(() => {
        this.planStartTime = moment(dateString, "YYYY-MM-DD HH:mm:ss")._i;
        this.form.setFieldsValue({
          planStartTime: this.planStartTime,
        });
      });
    },
    changeEnd(data, dateString) {
      this.$nextTick(() => {
        this.planEndTime = moment(dateString, "YYYY-MM-DD HH:mm:ss")._i;
        this.form.setFieldsValue({
          planEndTime: this.planEndTime,
        });
      });
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    // 实际开始时间
    disabledActualStartDate(startValue) {
      const endValue = this.endActualValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledActualEndDate(endValue) {
      const startValue = this.startActualValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenActualChange(open) {
      if (!open) {
        this.endOpenActual = true;
      }
    },
    handleEndOpenActualChange(open) {
      this.endOpenActual = open;
    },
    // 结束
    changePriority(item) {
      this.$nextTick(() => {
        console.log("item----", item);
        this.form.setFieldsValue({
          priority: item.value,
        });
      });
    },
    taskTypeChange(e) {
      this.form.setFieldsValue({
        taskTypeText: this.taskTypeArr[e - 1].text,
      });
    },
    popupCallback(value, other) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          assigner: value.userName,
          assignerId: value.userNameId,
        });
      });
    },
    assignerIdChange(value) {
      this.assignerArr.forEach((e) => {
        if (e.userNameId == value) {
          this.form.setFieldsValue({
            assigner: e.userName,
          });
        }
      });
    },
    closeRight() {
      this.$emit("closeRight");
    },
    handleUpadte(type) {
      this.$emit("update", type);
    },
  },
};
</script>

<style scoped="scoped" lang="less">
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
    width: 25%;
    border-right: 1px solid #e7e7e7;
    // text-align: left;
    padding-left: 8px;
    .ant-form-item {
      margin: 0 !important;
    }
  }

  input {
    // border: none;
    width: 100%;
    height: 100%;
    outline: none;
  }

  textarea {
    // border: none;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .table_tr > td:nth-child(2n) {
    // text-align: left;
    // padding-left: 20px;
  }
}
.card-title-icon {
  margin-right: 5px;
}
</style>
