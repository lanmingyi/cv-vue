<template>
  <t-modal
    title="新增/编辑"
    :width="640"
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
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col>
            <a-form-item class="hiddenItem">
              <!-- uuid隐藏 -->
              <a-input v-decorator="['uuid']" disabled type="hidden" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="用户名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['userName']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="用户ID"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['userNameId']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="密码"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['password']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="生日"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['birthday']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="学历"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['education']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="手机"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['cellphone']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="电子邮箱"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['email']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="年龄"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number
                style="width: 100%;"
                v-decorator="['age']"
                :min="1"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="国家"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['country']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['remark']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
// 表单字段
const fields = [
  "uuid",
  "userName",
  "userNameId",
  "password",
  "birthday",
  "education",
  "cellphone",
  "email",
  "age",
  "country",
  "remark",
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
      form: this.$form.createForm(this),
    };
  },
  methods: {
    add(m, data) {
      // console.log(m, data)
    },
    edit(m, data) {
      // console.log(m, data)
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
