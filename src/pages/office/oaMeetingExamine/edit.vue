<template>
  <t-modal
    title="新增/编辑"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
  >
    <template slot="footer">
      <a-button
        class="cu-btn-primary"
        icon="edit"
        @click="
          () => {
            $emit('ok', 'agree');
          }
        "
        >同意</a-button
      >
      <a-button
        class="cu-btn-danger"
        icon="delete"
        @click="
          () => {
            $emit('ok', 'no');
          }
        "
        >驳回</a-button
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
        <a-form-item
          label="申请人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'applicantUserIdName',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="会议名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'exaName',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="会议类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'atype',
              { rules: [{ required: true, message: '必填' }] },
            ]"
            @change="changeType"
          >
            <a-select-option
              v-for="(item, index) in typeList"
              :key="index"
              :value="item.text"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="会议室"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'aname',
              { rules: [{ required: true, message: '必填' }] },
            ]"
            @change="changeMeeting"
          >
            <a-select-option
              v-for="(item, index) in meetingList"
              :key="index"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="开会时间"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'ameetingTime',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="会议截止时间"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'ablocking',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['uuid', { initialValue: uuid }]"
            type="hidden"
          />
        </a-form-item>
        <a-form-item
          label="会议内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            v-decorator="[
              'acontent',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['remarks']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import Editor from "@/components/TopVUI/custom/Editor/index.vue";

// 表单字段
const fields = [
  "uuid",
  "applicantUserIdName",
  "exaName",
  "atype",
  "aname",
  "ameetingTime",
  "ablocking",
  "acontent",
  "remarks",
];

export default {
  components: { Editor },
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
    typeList: {
      type: Array,
      default: () => [],
    },
    meetingList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 5,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
      form: this.$form.createForm(this),
      url: {
        getCategorysByTypeAndLevelId:
          "/system/category/getCategorysByTypeAndLevelId",
        getListByPid: "/system/category/getListByPid",
        getTopicBaseDetailByUuid: "/system/topicBase/getDetailByUuid",
        getEdit: "/office/oaMeetingExamine/edit",
        getDetailByUuid: "/office/oaMeetingExamine/getDetailByUuid",
      },
      uuid: "",
      state: "",
    };
  },
  methods: {
    ok(type) {
      this.$emit("ok", type);
    },
    add(m) {
      console.log("add", m);
      this.uuid = "";
    },
    edit(m) {
      console.log("edit", m);
      this.$axios("get", `${this.url.getDetailByUuid}?uuid=${m.uuid}`).then(
        (res) => {
          console.log("res", res);
          this.form.setFieldsValue(pick(res, fields));
        }
      );
    },
    changeType(val) {
      this.typeList.forEach((e) => {
        // console.log('type---', e)
      });
    },
    changeMeeting(val) {
      this.meetingList.forEach((e) => {
        // console.log('Meeting---', e)
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
  },
};
</script>
