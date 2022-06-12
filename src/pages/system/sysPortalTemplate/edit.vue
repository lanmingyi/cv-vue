<template>
  <t-modal
    title="新增/编辑"
    :width="640"
    :visible="visible"
    :switchFullscreen="true"
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
          <a-form-item class="hiddenItem">
            <!-- 主键隐藏 -->
            <a-input v-decorator="['uuid']" disabled type="hidden" />
          </a-form-item>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="分类"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                @change="templateClassiftCodeChange"
                v-decorator="[
                  'templateClassiftCode',
                  { rules: [{ required: true, message: '请选择分类' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in portalClassifyList"
                  :key="index"
                  :value="item.classifyCode"
                  >{{ item.classifyName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="模板名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="模板名称"
                v-decorator="[
                  'templateName',
                  { rules: [{ required: true, message: '请输入模板名称' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="模板类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                @change="templateTypeChange"
                placeholder="请选择模板类型"
                v-decorator="[
                  'templateType',
                  { rules: [{ required: true, message: '请选择模板类型' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in templateTypeList"
                  :key="index"
                  :value="item"
                  >{{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="模板路径"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                placeholder="模板路径"
                readOnly
                v-decorator="[
                  'templatePath',
                  { rules: [{ required: true, message: '请输入模板路径' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = [
  "uuid",
  "templateName",
  "templatePath",
  "templateClassiftCode",
  "templateType",
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
      portalClassifyList: [],
      templateTypeList: ["系统默认", "自建"],
    };
  },
  methods: {
    add(m, data) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          templateClassiftCode: m.templateClassiftCode,
        });
      });
      this.getPortalClassifyList();
    },
    edit(m, data) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          templateClassiftCode: m.templateClassiftCode,
        });
      });
      this.getPortalClassifyList();
    },
    getPortalClassifyList() {
      this.$post("/system/sysPortalClassify/getPageSet").then((res) => {
        this.portalClassifyList = res.rows;
      });
    },
    templateTypeChange(value) {
      let templateClassiftCode = this.form.getFieldValue(
        "templateClassiftCode"
      );
      let templatePathValue = "";
      if ("系统默认" == value) {
        templatePathValue = "/" + templateClassiftCode + "/portal/index";
      } else {
        templatePathValue =
          "/" + templateClassiftCode + "/sysPortal/sysPortalPreview";
      }
      this.form.setFieldsValue({
        templatePath: templatePathValue,
      });
    },
    templateClassiftCodeChange() {
      this.form.setFieldsValue({
        templatePath: "",
        templateType: "",
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
