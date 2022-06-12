<template>
  <t-modal
    title="新增编辑"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel'), (isClear = true);
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item label="栏目" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <tree-select
            v-decorator="['categoryId', { initialValue: categoryId }]"
            :treeValueId="categoryId.toString()"
            placeholder="请选择菜单"
            :parameter="parameter"
            :url="url"
            :data="treeData"
            idfield="id"
            textfield="text"
            @change="seleteOrg"
          />
        </a-form-item>
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'title',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input type="hidden" v-decorator="['content']" /> -->
          <Editor
            v-decorator="['content']"
            :isClear="isClear"
            style="text-align:left"
            @onchange="changeEditor"
          ></Editor>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['documentUuid']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="['type', { initialValue: 'topic' }]"
            type="hidden"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import Editor from "@/components/TopVUI/custom/Editor/index.vue";

import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
// 表单字段
const fields = [
  "uuid",
  "content",
  "categoryId",
  "title",
  "documentUuid",
  "type",
];

export default {
  components: {
    Editor,
    TreeSelect,
  },
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
  data() {
    return {
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
      isClear: true,
      content: "",
      treeData: [],
      levelId: 1,
      pid: 1,
      categoryId: "",
      showFlag: true,
      showFlagUuid: true,
      url: {
        fathersUrl: "/system/category/getCategorysByTypeAndLevelId",
        expandUrl: "/system/category/getListByPid",
        getTopicBaseDetailByUuid: "/system/topicBase/getDetailByUuid",
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
  updated() {
    // this.isClear = false;
    // this.content = this.form.getFieldValue('content');
  },
  methods: {
    add(m, data) {
      console.log("m", m);
      this.treeData = data ? data : [];
      this.categoryId = m && m.id ? m.id : m.categoryId;
      this.content = "";
      // this.form.setFieldsValue({
      //   categoryId: this.categoryId,
      // });
    },
    edit(m, data) {
      console.log("m", m);
      this.treeData = data;
      this.categoryId = m.categoryId;
      // this.form.setFieldsValue(pick(m, fields));
      // this.form.setFieldsValue({
      //   categoryId: this.categoryId,
      // });
      this.showFlagUuid = true;
      this.getDetailByUuid(m.uuid);
    },
    seleteOrg(value, node) {
      console.log("value,node", value, node);
      this.$nextTick(() => {
        this.categoryId = value;
        this.form.setFieldsValue({
          categoryId: this.categoryId,
        });
      });
    },
    changeEditor(e) {
      // this.content = e
      this.form.setFieldsValue({
        content: e,
      });
    },
    getDetailByUuid(value) {
      this.$nextTick(() => {
        if (this.showFlagUuid) {
          this.showFlagUuid = false;
          this.$axios(
            "GET",
            `${this.url.getTopicBaseDetailByUuid}?uuid=${value}`
          ).then((res) => {
            this.form.setFieldsValue({
              content: res.content,
              documentUuid: res.documentUuid,
            });
          });
        }
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
