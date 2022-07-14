<!--
 * @Description: 请假流程表单处理界面
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-08-26 13:47:28
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\oaLeave\view.vue
-->
<template>
  <a-row :gutter="16">
    <!-- <a-divider orientation="left"> 基本信息 </a-divider> -->
    <a-col>
      <a-form-item class="hiddenItem">
        <!-- uuid隐藏 -->
        <a-input v-decorator="['uuid']" disabled type="hidden" />
      </a-form-item>
    </a-col>
    <a-col class="gutter-row" :span="24">
      <a-form-item
        label="休假标题"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'title',
            { rules: [{ required: true, message: '休假标题' }] },
          ]"
          :disabled="!isView"
        />
      </a-form-item>
    </a-col>
    <a-col class="gutter-row" :span="24">
      <a-form-item
        label="开始时间"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <t-date
          v-decorator="[
            'beginTime',
            { rules: [{ required: true, message: '开始时间' }] },
          ]"
          style="width: 100%;"
          :trigger-change="true"
          :showTime="true"
          dateFormat="YYYY-MM-DD HH:mm:ss"
          allowClear
          :disabled="!isView"
        />
      </a-form-item>
    </a-col>
    <a-col class="gutter-row" :span="24">
      <a-form-item
        label="结束时间"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <t-date
          v-decorator="[
            'endTime',
            { rules: [{ required: true, message: '结束时间' }] },
          ]"
          style="width: 100%;"
          :trigger-change="true"
          :showTime="true"
          dateFormat="YYYY-MM-DD HH:mm:ss"
          allowClear
          :disabled="!isView"
        />
      </a-form-item>
    </a-col>
    <a-col class="gutter-row" :span="24">
      <a-form-item
        label="休假类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <TDictSelectTag
          v-decorator="[
            'item',
            { rules: [{ required: true, message: '休假类型' }] },
          ]"
          dictCode="leaveType"
          :disabled="!isView"
        ></TDictSelectTag>
      </a-form-item>
    </a-col>
    <a-col class="gutter-row" :span="24">
      <a-form-item
        label="请假天数"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          style="width: 100%;"
          v-decorator="[
            'days',
            { rules: [{ required: true, message: '休假标题' }] },
          ]"
          :min="1"
          :disabled="!isView"
        />
      </a-form-item>
    </a-col>
    <a-col class="gutter-row" :span="24">
      <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea
          :rows="4"
          v-decorator="[
            'reason',
            { rules: [{ required: true, message: '备注' }] },
          ]"
          :disabled="!isView"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
import pick from "lodash.pick";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
// 表单字段
const fields = [
  "uuid",
  "beginTime",
  "endTime",
  "item",
  "reason",
  "title",
  "days",
];
export default {
  props: {
    drawingList: {
      type: Object,
      default: () => null,
    },
    isView: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    TDictSelectTag,
  },
  data() {
    return {
      title: "",
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
    };
  },
  mounted() {
		console.log(this.$parent)
		console.log(this.$parent.$parent)
		console.log(this.$parent.$parent.form)
    if (
      JSON.stringify(this.drawingList) !== "{}" &&
      this.$parent.$parent.form
    ) {
      //加一个判断区分发起流程和办理流程
      fields.forEach((v) => this.$parent.$parent.form.getFieldDecorator(v));
      // 当 model 发生改变时，为表单设置值
      this.$parent.$parent.form.setFieldsValue(pick(this.drawingList, fields));
    }
  },
  methods: {},
};
</script>
