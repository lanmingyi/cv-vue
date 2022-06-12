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
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['userNameId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <!-- <a-form-item class="hiddenItem">
          <a-input
            v-decorator="['orgId', { initialValue: orgId }]"
            type="hidden"
          />
        </a-form-item> -->
        <a-form-item
          label="所属机构"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <tree-select
            v-decorator="[
              'orgId',
              { initialValue: orgId },
              { rules: [{ required: true, message: '必填' }] },
            ]"
            placeholder="所属机构"
            :parameter="parameter"
            :url="url"
            :data="treeDataList"
            idfield="id"
            textfield="text"
          />
        </a-form-item>
        <a-form-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="[
              'post',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          >
            <a-select-option
              v-for="(item, index) in codeList"
              :value="item.value"
              :key="index"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = ["uuid", "userNameId", "orgId", "post"];
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import editor from "@/components/TopVUI/custom/Editor/index.vue";
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
    treeData: {
      type: Array,
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
      treeDataList: [],
      orgId: "",
      url: {
        fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
        expandUrl: "/mdata/organization/getListByPid",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      codeList: [],
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });

    this.$post(this.url.getDicItemByCode, {
      code: "post",
    }).then((res) => {
      this.codeList = res;
    });
  },
  methods: {
    add(e, treeData) {
      this.treeDataList = this.treeData;
      this.orgId = e.orgId;
    },
    edit(e, treeData) {
      this.treeDataList = this.treeData;
      this.orgId = e.orgId;
    },
  },
};
</script>
