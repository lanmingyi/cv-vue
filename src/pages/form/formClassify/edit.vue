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
          <a-form-item class="hiddenItem">
            <!-- uuid隐藏 -->
            <a-input v-decorator="['uuid']" disabled type="hidden" />
          </a-form-item>
          <a-form-item class="hiddenItem">
            <a-input
              v-decorator="['levelId', { initialValue: levelId }]"
              disabled
              type="hidden"
            />
          </a-form-item>
          <a-col class="gutter-row" :span="24" v-if="type === '2'">
            <a-form-item
              label="父级"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <tree-select
                v-decorator="[
                  'pid',
                  {
                    initialValue: pid,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                placeholder="请选择菜单"
                :parameter="parameter"
                :url="url"
                :data="treeData"
              />
            </a-form-item>
          </a-col>
          <template v-else>
            <a-form-item class="hiddenItem">
              <a-input
                v-decorator="['pid', { initialValue: 1 }]"
                disabled
                type="hidden"
              />
            </a-form-item>
          </template>

          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="分类名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'text',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="排序"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number
                v-decorator="[
                  'sort',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
                :min="1"
                :max="100"
              />
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="子节点"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                name="radioGroup"
                v-decorator="[
                  'state',
                  { initialValue: 'open' },
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-radio value="closed">
                  有子节点
                </a-radio>
                <a-radio value="open">
                  无子节点
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-textarea :rows="4" v-decorator="['remark']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
// 表单字段
const fields = [
  "uuid",
  "pid",
  "levelId",
  "state",
  "text",
  "remark",
  "sex",
  "sort",
];

export default {
  components: {
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
      url: {
        fathersUrl: "/form/formModule/getListByLevelId",
        expandUrl: "/form/formModule/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
      },
    };
  },
  methods: {
    add(m, data) {
      console.log(m, data);
      this.treeData = data ? data : [];
      this.pid = m ? m.id : "";
      this.levelId = m ? Number(m.levelId + 1) : 1;
    },
    edit(m, data) {
      this.form.setFieldsValue(pick(m, fields));
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
