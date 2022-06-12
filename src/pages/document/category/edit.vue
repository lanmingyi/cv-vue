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
            :treeValueId="pid.toString()"
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
            v-decorator="[
              'sort',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
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
            v-decorator="['levelId', { initialValue: levelId }]"
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
const fields = ["uuid", "pid", "levelId", "state", "text", "sort"];
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
    type: {
      type: String,
    },
  },
  components: {
    TreeSelect,
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
        fathersUrl: "/system/channel/getChannelsById",
        expandUrl: "/system/channel/getChannelsByPid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
    };
  },
  methods: {
    add(m, data) {
      this.treeData = data ? data : [];
      this.pid = m ? m.id : "1";
    },
    edit(m, data) {
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
