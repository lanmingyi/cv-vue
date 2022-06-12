<template>
  <t-modal
    title="新增编辑"
    :width="640"
    :visible="visible"
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
        <a-form-item label="父级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <tree-select
            v-decorator="[
              'puuid',
              {
                rules: [{ required: true, message: '必填' }],
              },
            ]"
            placeholder="请选择"
            :parameter="parameter"
            :url="url"
            :data="treeData"
          />
        </a-form-item>
        <a-form-item
          label="文件名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'fileName',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item
          label="文件大小"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['fileSize']" disabled />
        </a-form-item>
        <a-form-item label="url" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['url']" disabled />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="备注"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            v-decorator="['remark']"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import pick from "lodash.pick";
// 表单字段
const fields = ["uuid", "remark", "fileName", "fileSize", "url", "puuid"];
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
  components: { TreeSelect },
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
      puuid: "",
      url: {
        fathersUrl: "/system/channel/getChannelsByPid",
        expandUrl: "/system/channel/getChannelsByPid",
      },
      parameter: {
        father: { pid: 3 },
        children: {},
      },
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
    edit(m, data) {
      this.treeData = data;
    },
  },
};
</script>
