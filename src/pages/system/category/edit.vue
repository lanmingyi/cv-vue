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
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item
          label="父级"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="type === '2'"
        >
          <tree-select
            v-decorator="['pid', { initialValue: pid }]"
            :treeValueId="String(pid)"
            placeholder="请选择"
            :parameter="parameter"
            :url="url"
            :data="treeData"
            idfield="id"
            textfield="text"
            @change="seleteOrg"
          />
        </a-form-item>
        <template v-else>
          <a-form-item class="hiddenItem">
            <a-input
              v-decorator="['pid', { initialValue: 1 }]"
              disabled
              type="hidden"
            />
          </a-form-item>
        </template>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'text',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            id="inputNumber"
            style="width: 100%;"
            :min="-100"
            :max="100"
            v-decorator="['sort']"
          />
        </a-form-item>
        <a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <icon-font-picker
            v-decorator="['iconCls', { initialValue: '' }]"
            @change="handleIconChoose"
          ></icon-font-picker>
        </a-form-item>
        <a-form-item
          label="是否在首页显示"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="['portalDisplay', { initialValue: '1' }]"
          >
            <a-radio value="1">
              是
            </a-radio>
            <a-radio value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="是否有子节点"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="['state', { initialValue: 'open' }]"
          >
            <a-radio value="closed">
              是
            </a-radio>
            <a-radio value="open">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" disabled type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input
            v-decorator="['type', { initialValue: 'topic' }]"
            disabled
            type="hidden"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input
            v-decorator="['levelId', { initialValue: 1 }]"
            disabled
            type="hidden"
          />
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
  "levelId",
  "state",
  "text",
  "portalDisplay",
  "sort",
  "iconCls",
];
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";
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
    type: {
      type: String,
    },
  },
  components: {
    TreeSelect,
    iconFontPicker,
  },
  data() {
    return {
      title: "",
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
      pidName: "",
      showFlag: true,
      url: {
        fathersUrl: "/system/category/getCategorysByTypeAndLevelId",
        expandUrl: "/system/category/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
          type: "topic",
        },
        children: {
          type: "topic",
        },
      },
    };
  },
  methods: {
    add(m, data) {
      console.log(m, data);
      this.treeData = data ? data : [];
      this.pid = m ? m.id : "1";
      console.log(this.pid);
    },
    edit(m, data) {
      console.log(m, data);
      this.treeData = data;
      this.pid = m.pid;
    },
    seleteOrg(value, node) {
      this.$nextTick(() => {
        this.pid = value;
        this.form.setFieldsValue({
          pid: this.pid,
        });
      });
    },
    handleIconChoose(value) {
      this.form.setFieldsValue({
        iconCls: value,
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
