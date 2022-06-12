<template>
  <t-modal
    title="新增编辑"
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
        <a-form-item
          label="模板名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'sysPortalTemplateUuid',
              { rules: [{ required: true, message: '请选择模板' }] },
            ]"
          >
            <a-select-option
              v-for="(item, index) in sysPortalTemplateList"
              :key="index"
              :value="item.uuid"
              >{{ item.templateName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="门户名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'portalName',
              { rules: [{ required: true, message: '请输入门户名称' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="门户图标"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-input
						placeholder="点击选择图标"
						v-decorator="['portalIcon', { rules: [{ required: true, message: '请选择门户图标' }] }]"
						:readOnly="true"
					>
						<a-icon slot="addonAfter" type="setting" @click="selectIcons" />
					</a-input> -->
          <icon-font-picker
            v-decorator="[
              'portalIcon',
              {
                initialValue: '',
                rules: [{ required: true, message: '请选择门户图标' }],
              },
            ]"
            @change="handleIconChoose"
          ></icon-font-picker>
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['templateClassiftCode']" type="hidden" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";
// 表单字段
const fields = [
  "uuid",
  "portalName",
  "sysPortalTemplateUuid",
  "templateClassiftCode",
  "portalIcon",
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
    iconFontPicker,
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
      sysPortalTemplateList: [],
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));

    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    add(m) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          templateClassiftCode: m.templateClassiftCode,
        });
      });
      this.getPortalClassifyList(m);
    },
    edit(m) {
      this.getPortalClassifyList(m);
    },
    getPortalClassifyList(m) {
      //根据模板分类Id获取数据
      this.$post(
        "/system/sysPortalTemplate/getListDataByTemplateClassiftUuid",
        {
          templateClassiftCode: m.templateClassiftCode,
        }
      ).then((res) => {
        this.sysPortalTemplateList = res;
      });
    },
    handleIconChoose(value) {
      this.form.setFieldsValue({
        portalIcon: value,
      });
    },
  },
};
</script>
