<template>
  <a-modal
    title="新增/编辑"
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
      <a-button
        class="cu-btn-primary"
        v-if="!type"
        @click="
          () => {
            $emit('ok');
          }
        "
        >提交</a-button
      >
      <a-button
        class="cu-btn-primary"
        v-if="type"
        @click="
          () => {
            $emit('reply');
          }
        "
        >重新申请</a-button
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
          <a-col :span="12">
            <a-form-item
              label="议题名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'topicsName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="会议名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                v-decorator="[
                  'mettingName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in meetingList"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
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
                  'meetingOfNumber',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="议题时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <t-date
                v-decorator="[
                  'startTime',
                  { rules: [{ required: true, message: '议题时间' }] },
                ]"
                style="width: 100%;"
                :showTime="true"
                dateFormat="YYYY-MM-DD HH:mm:ss"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="申报理由"
              :labelCol="labelColfull"
              :wrapperCol="wrapperColfull"
            >
              <a-textarea :rows="4" v-decorator="['applyReason']" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['uuid']" type="hidden" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from "lodash.pick";

// 表单字段
const fields = [
  "uuid",
  "topicsName",
  "mettingName",
  "startTime",
  "meetingOfNumber",
  "applyReason",
];

export default {
  components: {},
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
        getCategorysByTypeAndLevelId:
          "/system/category/getCategorysByTypeAndLevelId",
        getListByPid: "/system/category/getListByPid",
        getTopicBaseDetailByUuid: "/system/topicBase/getDetailByUuid",
        getDetailByUuidAndUser: "/office/oaMeetingsBase/getDetailByUuidAndUser",
        editcontents: "/office/oaMeetingsBase/editcontents",
        getDetail: "/office/oaMeetingsBase/editcontents",
        getListByUuids: "/mdata/user/getListByUuids",
      },
      isClear: true,
      uuid: "",
      type: false,
    };
  },
  methods: {
    add(m) {
      console.log("add", m);
      this.type = false;
    },
    edit(m, type) {
      this.type = type && type === "reapply" ? true : false;
      this.form.setFieldsValue(pick(m, fields));
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
