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
                  'mailbox',
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
                    initialValue: tableNameValue,
                    rules: [{ required: true, message: '必填' }],
                  },
                ]"
                @change="handleProvinceChange"
              >
                <a-select-option
                  v-for="(item, index) in codeList"
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
                  { initialValue: structureValue },
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
                @change="handleChange"
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
          <a-col :span="24" v-for="(item, index) in subTableList" :key="index">
            <a-col :span="8">
              <a-form-item
                label="子表"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :required="false"
              >
                <a-select
                  show-search
                  v-decorator="[
                    `childTable[${index}]`,
                    {
                      initialValue: `${item.childTable}`,
                      rules: [{ required: true, message: '必填' }],
                    },
                  ]"
                >
                  <!-- <a-select show-search v-decorator="['childTable', {initialValue: childTableValue}]" @change="handleProvinceChangeSon"> -->
                  <a-select-option
                    v-for="(items, index1) in codeList"
                    :value="items.tableName"
                    :key="index1"
                    @click="handleChangeClick(items.tableName, item, index)"
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
                <a-input
                  v-decorator="[
                    `title[${index}]`,
                    {
                      initialValue: `${item.title}`,
                      validateTrigger: ['change', 'blur'],
                      rules: [{ required: true, message: '必填' }],
                    },
                  ]"
                />
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
                <a-select
                  style="width: 85%"
                  v-decorator="[
                    `associated[${index}]`,
                    {
                      initialValue: `${item.associated}`,
                      rules: [{ required: true, message: '必填' }],
                    },
                  ]"
                >
                  <a-select-option
                    v-for="city in cities"
                    :key="city"
                    @click="handleChangeClickSon(city, item)"
                  >
                    {{ city }}
                  </a-select-option>
                </a-select>
                <span class="addBtn" @click="btnFormItem(item, index)">
                  <a-icon type="plus" v-if="item.id === 1" />
                  <a-icon type="minus" v-else />
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
      cities: [],
      userInfo: {},
      tableNameValue: "",
      childTableValue: "",
      structureValue: "",
      titleValue: "",
      associatedVlue: "",
      templateDatas: [], // 接收下拉框数据的对象
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
        getAll: "/system/sysGenTable/getAll",
        getAllTable: "/system/sysGenTable/getAll",
        getColumns: "/system/generator/getColumns",
        generateCodeMoreSave: "/system/sysGenTable/generateCodeMoreSave",
      },
      form: this.$form.createForm(this),
      codeList: [],
      structurecodeList: [
        // '左树形表格右数据表格',
        "左数据表格右数据表格",
        "上数据表格下数据表格",
        // '上数据表格下可编辑表格',
      ],
      subTableList: [
        {
          childTable: "",
          title: "子表",
          associated: "",
          id: 1,
        },
      ],
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));

    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
      this.form.getFieldDecorator("keys", {
        initialValue: [],
        preserve: true,
      });
      this.form.getFieldDecorator("childTable", {
        initialValue: [],
        preserve: false,
      });
      this.form.getFieldDecorator("title", {
        initialValue: [],
        preserve: false,
      });
      this.form.getFieldDecorator("associated", {
        initialValue: [],
        preserve: false,
      });
    });
  },
  mounted() {
    this.getDicItemByCode();
  },
  computed: {
    keys() {
      let arr = [];
      this.subTableList.forEach((val, index) => {
        arr.push(index);
      });
      return arr;
    },
  },
  methods: {
    openEdit() {
      this.subTableList = [];
      this.subTableList = [
        {
          childTable: "",
          title: "子表",
          associated: "",
          id: 1,
        },
      ];
    },
    getDicItemByCode() {
      this.$post(this.url.getAllTable).then((res) => {
        this.codeList = res;
      });
    },
    handleChangeClick(value, item, index) {
      item.childTable = value;
      this.cities = [];
      this.$post(this.url.getColumns, {
        tableName: value,
      }).then((res) => {
        res.forEach((e, index) => {
          this.cities.push(e.columnName);
        });
      });
      //   this.$post(this.url.getAll, {
      //     q: value,
      //   }).then((res) => {
      //     this.subTableList[index].title = res[0].notes;
      //   });
    },
    handleChangeClickSon(value, item) {
      item.associated = value;
    },
    handleProvinceChange(value) {
      console.log(value);
      this.tableNameValue = value;
      this.$post(this.url.getAll, {
        q: value,
      }).then((res) => {
        this.structureValue = res[0].notes;
      });
    },
    // handleProvinceChangeSon(value) {
    // this.cities = []
    // this.$post(this.url.getColumns, {
    // 	tableName: value
    // }).then((res) => {
    // 	res.forEach((e, index) => {
    // 		this.cities.push(e.columnName)
    // 	})
    // })
    // 	this.childTableValue = value
    // 	this.associatedVlue = ''
    // },
    handleProvinceChangeSon(value) {
      // console.log("val",value)
      // var target= this.subTableList.filter(item => data.id === item.id)[0]
      // if (target) {
      // 	target.childTable = value
      // }
      // this.subTableList.forEach(val=> {
      // 	if (data.key === val.id) {
      // 		val.childTable = value
      // 	}
      // })
    },
    // handleProvinceChange3(value) {
    // 	this.associatedVlue = value
    // },
    handleProvinceChange3(value, data) {
      // var target= this.subTableList.filter(item => data.id === item.id)[0]
      // if (target) {
      // 	target.associated = value
      // }
      this.subTableList.forEach((val) => {
        if (data.id === val.id) {
          val.associated = value;
        }
      });
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    // add(){
    // 	this.subTableList.push({
    // 			childTable: '',
    // 			title: '子表',
    // 			associated: '',
    // 			icon: false,
    // 	})
    // 	const { form } = this
    // 	form.setFieldsValue({
    // 		keys: this.keys
    // 	})
    // },
    btnFormItem(value, index) {
      // console.log("index====",value,index)
      if (value.id === 1) {
        var data = {
          childTable: "",
          title: "子表",
          associated: "",
          id: 0,
        };
        this.subTableList.push(data);
        const { form } = this;
        form.setFieldsValue({
          keys: this.keys,
        });
      } else {
        this.$nextTick(() => {
          const { form } = this;
          this.subTableList.splice(index, 1);

          form.setFieldsValue({
            keys: this.keys,
            childTable: form
              .getFieldValue("childTable")
              .filter((key, num) => num != index),
            title: form
              .getFieldValue("title")
              .filter((key, num) => num != index),
            associated: form
              .getFieldValue("associated")
              .filter((key, num) => num != index),
          });
        });
      }
    },
    add(data) {
      // const {form} = this
      // const keys = form.getFieldValue('keys')
      // console.log("keys",keys)
      // const nextKeys = keys.concat(id++)
      // form.setFieldsValue({
      // 	keys: nextKeys
      // })

      if (data.icon) {
        var parmas = {
          childTable: "",
          title: "子表",
          associated: "",
          icon: false,
          id: this.subTableList.length + 1,
        };
        this.subTableList.push(parmas);
      } else {
        console.log("data", data);
        this.subTableList.forEach((val, index) => {
          if (val.id === data.id) {
            this.subTableList.splice(index, 1);
          }
        });
      }
    },
    handleSubmit(e) {
      this.form.validateFields((err, values) => {
        console.log("Received values of form: ", values);
        if (!err) {
          console.log(values);
          values.childTable = values.childTable.toString();
          values.title = values.title.toString();
          values.associated = values.associated.toString();
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
