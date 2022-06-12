<!--
 * @Description: 表单发布
 * @Author: 黄婷
 * @Date: 2021-08-12 17:08:19
 * @LastEditTime: 2021-08-12 18:05:24
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\form\formModule\releaseModal.vue
-->
<template>
  <t-modal
    title="新增编辑"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="
      () => {
        $emit('update:visible', false);
      }
    "
    @ok="
      () => {
        $emit('ok');
      }
    "
  >
    <a-form :form="form">
      <a-form-item
        label="父级菜单"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <tree-select
          v-decorator="[
            'pid',
            {
              rules: [{ required: true, message: '必填！' }],
            },
          ]"
          placeholder="请选择菜单"
          :parameter="parameter"
          :url="url"
        />
      </a-form-item>
      <a-form-item
        label="资源名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'text',
            {
              initialValue: tableDesc,
              rules: [{ required: true, message: '请输入资源名称！' }],
            },
          ]"
          placeholder="资源名称"
        />
      </a-form-item>

      <a-form-item
        label="资源图标"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <icon-font-picker
          v-decorator="['iconCls', { initialValue: '' }]"
          @change="handleIconChoose"
        ></icon-font-picker>
      </a-form-item>
      <a-form-item class="hiddenItem">
        <a-input
          v-decorator="['url', { initialValue: menuUrl }]"
          type="hidden"
        />
      </a-form-item>
    </a-form>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";
const fields = ["pid", "text", "iconCls", "url"];
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false,
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
    TreeSelect,
    iconFontPicker,
  },
  data() {
    return {
      icon: [],
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
          span: 18,
        },
      },
      form: this.$form.createForm(this),
      url: {
        fathersUrl: "/system/menu/getListByLevelId",
        expandUrl: "/system/menu/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      menuUrl: "",
      tableDesc: "",
    };
  },
  mounted: function() {},
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
      this.menuUrl = "/form/formPreview/index?tableName=" + m.tableName;
      this.tableDesc = m.tableDesc;
    },
    handleIconChoose(value) {
      this.form.setFieldsValue({
        iconCls: value,
      });
    },
  },
};
</script>

<style></style>
