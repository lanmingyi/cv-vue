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
        $emit('update:visible',false)
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
				<a-form-item class="hiddenItem">
					<!-- 旧表名 -->
				  <a-input v-decorator="['oldTableName']" type="hidden" />
				</a-form-item>
        <a-form-item label="新表名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入新表名，表名默认前缀efd_"
            v-decorator="[
              'newTableName',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="父级模块"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <tree-select
            v-decorator="[
              'id',
              {rules: [{ required: true, message: '必填！' }]},
            ]"
            placeholder="请选择菜单"
            :parameter="parameter"
            :url="url"
            :data="treeData"
            idfield="id"
            textfield="text"
          />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number placeholder="请输入排序"
            v-decorator="[
              'sort',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
            :min="1"
            :precision="0"
          />
        </a-form-item>
        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入描述"
            type="textarea"
            v-decorator="[
              'tableDesc',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入备注" type="textarea" :rows="4" v-decorator="['remark']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// 表单字段
const fields = [
	"newTableName",
  "oldTableName",
  "tableDesc",
  "id",
  "sort",
  "remark",
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
    TreeSelect,
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
          span: 17,
        },
      },
      form: this.$form.createForm(this),
      uuid: "",
      sortId: "",
      AuthGroup: [],
      sysAuthdataGroup: [],
      SHOW_PARENT,
      treeData: [],
      showFlag: true,
      url: {
				getOrgTree: "/form/formModule/getListByLevelId?levelId=1",
				getTreeListByPid: "/form/formModule/getListByPid",
        fathersUrl: "/form/formModule/getListByLevelId",
        expandUrl: "/form/formModule/getListByPid"
      },
      parameter: {
        father: {
          levelId: 1,
        },
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
		
  },
};
</script>
