<template>
  <t-modal
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
        @click="
          () => {
            $emit('save');
          }
        "
        >保存</a-button
      >
      <a-button
        class="cu-btn-danger"
        @click="
          () => {
            $emit('ok');
          }
        "
        >发布</a-button
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
              label="标题"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'title',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="发布部门"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <tree-select
                v-decorator="[
                  'publishingDepartmentName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                :treeValueText="publishingDepartmentName"
                placeholder="发布部门"
                :parameter="parameter"
                :url="url"
                :data="treeData"
                idfield="id"
                textfield="text"
                @change="selectOrg"
              />
            </a-form-item>
          </a-col>
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="内容"
                :labelCol="labelColfull"
                :wrapperCol="wrapperColfull"
              >
                <a-input v-decorator="['content']" type="hidden" />
                <Editor
                  :value="content"
                  :isClear="isClear"
                  style="text-align:left"
                  @onchange="changeEditor"
                ></Editor>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="24">
							<a-form-item label="备注" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
								<a-textarea :rows="4" v-decorator="['remark']" />
							</a-form-item>
						</a-col> -->
            <a-col :span="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input v-decorator="['uuid']" type="hidden" />
              </a-form-item>
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="['publishingDepartmentId']"
                  type="hidden"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-row>
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
  "title",
  "publishingDepartmentName",
  "publishingDepartmentId",
  "remark",
  "content",
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
    organList: {
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
        fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
        expandUrl: "/mdata/organization/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      isClear: true,
      uuid: "",
      content: "",
      titleList: [],
      publishingDepartmentName: "",
      treeData: [],
      showBtn: false,
    };
  },
  updated() {
    this.isClear = false;
    this.content = this.form.getFieldValue("content");
  },
  methods: {
    add(m) {
      this.showBtn = false;
      console.log("add", m);
      this.publishingDepartmentName = "";
    },
    edit(m) {
      console.log("edit", m);
      this.showBtn = true;
      this.publishingDepartmentName = m ? m.publishingDepartmentName : "";
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(m, fields));
      });
    },
    changeEditor(e) {
      this.content = e;
      this.form.setFieldsValue({
        content: e,
      });
    },
    selectOrg(value, node) {
      this.$nextTick(() => {
        this.publishingDepartmentName = node ? node.toString() : "";
        this.form.setFieldsValue({
          publishingDepartmentId: value,
          publishingDepartmentName: node ? node.toString() : "",
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
    this.$post(this.url.fathersUrl).then((res) => {
      this.treeData = res;
      this.treeData.forEach((e, index) => {
        this.treeData[index].title = e.text;
        this.treeData[index].label = e.text;
        this.treeData[index].index = index;
        this.treeData[index].value = e.text;
        this.treeData[index].key = e.id;
        this.treeData[index].levelId = e.levelId;
      });
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
