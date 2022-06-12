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
          <a-col class="gutter-row" :span="24" v-if="type === '2'">
            <a-form-item
              label="父级"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
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
              <!-- <a-input v-decorator="['pid',{ initialValue: pid}]" disabled type="hidden" /> -->
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
            <a-form-item class="hiddenItem">
              <a-input
                v-decorator="['levelId', { initialValue: 1 }]"
                disabled
                type="hidden"
              />
            </a-form-item>
          </template>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="text值"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['text',{ rules: [{required: true, message: '必填'}]}]" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="姓名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['name',{ rules: [{required: true, message: '必填'}]}]" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="性别"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
							<TDictSelectTag placeholder="请选择" dictCode="sex" v-decorator="['sex']"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="年龄"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number v-decorator="['age']" :min="1" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="生日"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <t-date
                v-decorator="['testDate',{ rules: [{required: true, message: '必填'}]}]"
                style="width: 100%;"
                :trigger-change="true"
                dateFormat="YYYY-MM-DD"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="注册时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <t-date
                v-decorator="['testDatetime']"
                style="width: 100%;"
                :trigger-change="true"
                :showTime="true"
                dateFormat="YYYY-MM-DD HH:mm:ss"
                allowClear
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
                  { initialValue: 'open' , rules: [{ required: true, message: '必填' }] }
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
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
// 表单字段
const fields = [
  "uuid",
  "pid",
  "pidName",
  "levelId",
  "state",
  "text",
  "portalDisplay",
  "name",
  "sex",
  "age",
  "testDate",
  "testDatetime",
  "testCombobox",
];

export default {
  components: {
    TreeSelect,
		TDictSelectTag
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
        fathersUrl: "/workflow/testTreegrid/getListByLevelId",
        expandUrl: "/workflow/testTreegrid/getListByPid",
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
      this.pid = m ? m.id : "";
    },
    edit(m, data) {
      console.log(m, data, "===================");
      this.treeData = data;
      this.pid = m.pid;
    },
    seleteOrg(value, node) {
      console.log("value,node", value, node);
      this.$nextTick(() => {
        this.pid = value;
        this.form.setFieldsValue({
          pid: this.pid,
        });
      });
    },
  },
  watch: {},
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  mounted() {
    console.log(this.model, "this.model=====");
  },
};
</script>
