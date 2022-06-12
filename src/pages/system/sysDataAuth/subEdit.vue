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
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item
          label="规则分类"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          required
        >
          <tree-select
            v-decorator="['pid', { initialValue: pid }]"
            placeholder="请选择菜单"
            :parameter="parameter"
            :url="url"
            :data="treeData"
            idfield="id"
            textfield="text"
          />
        </a-form-item>
        <a-form-item
          label="规则名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input  placeholder="请输入规则名称"
            v-decorator="['ruleName', { rules: [{ required: true }] }]"
          />
        </a-form-item>
        <a-form-item
          label="接口地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input placeholder="请输入接口地址"
            v-decorator="['ruleHref', { rules: [{ required: true }] }]"
          />
        </a-form-item>
        <a-form-item
          label="SQL条件语句"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea placeholder="请输入SQL条件语句" v-decorator="['ruleSql', { rules: [{ required: true }] }]" :rows="6" />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number placeholder="请输入排序"
            id="inputNumber"
            style="width: 100%;"
            :min="1"
                          :precision="0"
            v-decorator="['ruleSort', { rules: [{ required: true }] }]"
          />
          <a-input  v-decorator="['uuid']" disabled type="hidden" />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea placeholder="请输入备注" v-decorator="['ruleRemark']" :rows="2" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

// 表单字段
const fields = [
  "uuid",
  "pid",
  "ruleHref",
  "ruleRemark",
  "ruleSql",
  "ruleSort",
  "ruleName",
];
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
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
    TreeSelect,
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
      treeData: [],
      levelId: 1,
      pid: 1,
      showFlag: true,
      url: {
        fathersUrl: "/system/sysDataAuthGroup/getListByPid",
        expandUrl: "/system/sysDataAuthGroup/getListByPid",
      },
      parameter: {
        father: {
          pid: 1,
        },
        children: {},
      },
    };
  },
  methods: {
    add(m, data) {
      console.log(m);
      this.treeData = data ? data : [];
      this.pid = m ? m.pid : "";
      console.log(this.pid);
    },
    edit(m, data) {
      this.treeData = data;
      this.pid = m.pid;
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
