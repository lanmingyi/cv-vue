<template>
  <t-modal
    okText="生成代码"
    cancelText="关闭"
    title="主子表"
    :width="940"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleSubmit()"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading" style="padding: 20px 0;">
      <a-form :form="form" id="form">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-form-item
              label="基础包"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'packetPath',
                  {
                    initialValue: 'com.misboot',
                    rules: [{ required: true, min: 1, message: '必填！' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item
              label="系统名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'moduleName',
                  {
                    initialValue: 'system',
                    rules: [{ required: true, min: 1, message: '必填！' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item
              label="作者"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                style="width: 85%;"
                v-decorator="[
                  'author',
                  {
                    initialValue: '佐佑科技',
                    rules: [{ required: true, min: 1, message: '必填！' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="邮箱"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'mailbox',
                  {
                    initialValue: 'fengkai@zuoyo.com',
                    rules: [{ required: true, min: 1, message: '必填！' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item
              label="功能描述"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'funDescription',
                  {
                    initialValue: '代码自动生成',
                    rules: [{ required: true, min: 1, message: '必填！' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-form-item
              label="主表"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                show-search
                v-decorator="[
                  'mainTable',
                  {
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                @change="changeMasterTable"
              >
                <a-select-option
                  v-for="(item, index) in tableList"
                  :value="item.tableName"
                  :key="index"
                >
                  {{ item.tableName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item
              label="说明"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'mainTitle',
                  { rules: [{ required: true, min: 1, message: '必填！' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item
              label="页面结构"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                style="width: 85%"
                show-search
                v-decorator="[
                  'structure',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in structurecodeList"
                  :value="item"
                  :key="index"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="24"
            v-for="(item, subIndex) in subTableList"
            :key="subIndex"
          >
            <a-col :span="8">
              <a-form-item
                label="子表"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :required="false"
              >
                <!-- <span>{{ subIndex }}</span> -->
                <a-select
                  show-search
                  v-model="item.childTable"
                  @change="
                    (e) => {
                      changeSubTable(e, subIndex);
                    }
                  "
                >
                  <!-- <a-select show-search v-decorator="['childTable', {initialValue: childTableValue}]" @change="handleProvinceChangeSon"> -->
                  <a-select-option
                    v-for="(items, index1) in tableList"
                    :value="items.tableName"
                    :key="index1"
                  >
                    {{ items.tableName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item
                label="说明"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :required="false"
              >
                <a-input v-model="item.title" />
                <!-- <a-input v-decorator="['title',{initialValue: titleValue}, {rules: [{required: true, min: 1, message: '必填！'}]}]" /> -->
              </a-form-item>
            </a-col>
            <a-col :span="9">
              <a-form-item
                label="关联字段"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :required="false"
              >
                <a-select style="width: 85%" v-model="item.associated">
                  <a-select-option
                    v-for="(child, index) in linkfield"
                    :key="index"
                    :value="child.columnName"
                  >
                    {{ child.columnName }}
                  </a-select-option>
                </a-select>
                <span
                  class="addBtn"
                  @click="addFormItem(subIndex)"
                  v-if="subIndex === 0"
                >
                  <a-icon type="plus" />
                </span>
                <span class="addBtn" v-else @click="delFormItem(subIndex)">
                  <a-icon type="minus" />
                </span>
              </a-form-item>
            </a-col>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

import { baseUrl } from "@/services/baseUrl.js";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
let id = 0;
// 表单字段
const fields = [
  "uuid",
  "userName",
  "userNameId",
  "password",
  "birthday",
  "education",
  "cellphone",
  "email",
  "age",
  "country",
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
      url: {
        getAllTable: "/system/sysGenTable/getAll",
        getColumns: "/system/generator/getColumns",
        generateCodeMoreSave: "/system/sysGenTable/generateCodeMoreSave",
      },
      form: this.$form.createForm(this),
      structurecodeList: [
        // '左树形表格右数据表格',
        "左数据表格右数据表格",
        "上数据表格下数据表格",
        // '上数据表格下可编辑表格',
      ],
      subTableList: [
        {
          childTable: "",
          title: "",
          associated: "",
        },
      ],
      tableList: [],
      linkfield: [],
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
  mounted() {},
  methods: {
    openEdit() {
      this.subTableList = [
        {
          childTable: "",
          title: "",
          associated: "",
        },
      ];
      this.getAllTable();
    },
    getAllTable() {
      this.$post(this.url.getAllTable).then((res) => {
        this.tableList = res;
      });
    },
    changeMasterTable(val) {
      const list = this.tableList.filter((res) => res.tableName === val);
      this.form.setFieldsValue({ mainTitle: list[0].notes });
    },
    changeSubTable(val, index) {
      const list = this.tableList.filter((res) => res.tableName === val);
      let subTableList = this.subTableList;
      subTableList[index].title = list[0].notes;
      // this.form.setFieldsValue({ subTableList: subTableList });
      this.getColumns(val);
    },
    getColumns(val) {
      this.$post(this.url.getColumns, { tableName: val }).then((res) => {
        this.linkfield = res;
      });
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        console.log("Received values of form: ", values);
        if (!err) {
          let childTable = [],
            title = [],
            associated = [];
          this.subTableList.forEach((res) => {
            childTable.push(res.childTable);
            title.push(res.title);
            associated.push(res.associated);
          });
          values.childTable = childTable.toString();
          values.title = title.toString();
          values.associated = associated.toString();
          console.log(this.subTableList, values);
          window.location.href =
            baseUrl +
            "/system/sysGenTable/generateCodeMoreSave?packetPath=" +
            values.packetPath +
            "&moduleName=" +
            values.moduleName +
            "&author=" +
            values.author +
            "&mailbox=" +
            values.mailbox +
            "&mainTable=" +
            values.mainTable +
            "&structure=" +
            values.structure +
            "&childTable=" +
            values.childTable +
            "&title=" +
            values.title +
            "," +
            values.mainTitle +
            "&associated=" +
            values.associated +
            "&token=" +
            Vue.ls.get(ACCESS_TOKEN);
        }
      });
    },
    // 添加子表数据
    addFormItem() {
      let newData = {
        childTable: "",
        title: "",
        associated: "",
      };
      this.subTableList.push(newData);
    },
    // 删除子表
    delFormItem(index) {
      // const newData = this.subTableList;
      // newData.splice(index, 1);
      // console.log(newData);
      this.subTableList.splice(index, 1);
      // delete this.subTableList[index];
      console.log(this.subTableList);
    },
  },
};
</script>

<style lang="less" scoped>
.addBtn {
  width: 14%;
  padding: 5px 0;
  margin-left: 1%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

.addBtn:hover {
  background: #e7e7e7;
}
</style>
