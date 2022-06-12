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
        <a-form-item
          label="所属机构"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <tree-select
            v-decorator="[
              'orgId',
              {
                initialValue: orgId,
                rules: [{ required: true, message: '必填' }],
              },
            ]"
            placeholder="所属机构"
            :parameter="parameter"
            :url="url"
            :data="treeData"
            idfield="id"
            textfield="text"
						@change="selectOrg"
          />
        </a-form-item>
        <a-form-item
          label="员工号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'userNameId',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    message: '请输入至少一个字符的名称！',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
          <a-input v-decorator="['orgName']" type="hidden" />
        </a-form-item>
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'userName',
              {
                rules: [
                  {
                    required: true,
                    min: 1,
                    message: '请输入至少一个字符的名称！',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['sex', { initialValue: '1' }]">
            <a-radio value="1">
              男
            </a-radio>
            <a-radio value="2">
              女
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="角色授权"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <tree-select
						v-decorator="[
							'userGroupName1',
							{ initialValue: userGroupName1, rules: [{ required: true, message: '必填' }] },
						]"
						:treeCheckable="true"
						placeholder="角色授权"
						:parameter="parameterAuth"
						:url="urlAuth"
						:data="AuthGroup"
						idfield="id"
						textfield="text"
						@change="selectUserGroupName"
					/> -->
          <a-tree-select
            v-decorator="[
              'userGroupName1',
              {
                initialValue: userGroupName1,
                rules: [{ required: true, message: '必填' }],
              },
            ]"
            style="width: 100%"
            :tree-data="AuthGroup"
            tree-checkable
            treeCheckStrictly
            @change="selectUserGroupName"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['userGroup']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['userGroupName']" type="hidden" />
        </a-form-item>
        <!-- <a-form-item
          label="数据授权"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'dataAuthName',
              { rules: [{ required: true, message: '请选择数据权限！' }] },
            ]"
            @change="changeDataAuth"
          >
            <a-select-option
              v-for="(item, index) in sysAuthdataGroup"
              :value="item.name"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select> -->
        <!-- <t-multi-select-tag valueFeild="name" textFeild="name" v-decorator="['dataAuthName', {rules: [{required: true, message: '请选择数据权限！'}]}]" @change="changeDataAuth" :dataList="sysAuthdataGroup"></t-multi-select-tag> -->
        <!-- </a-form-item> -->
        <a-form-item class="hiddenItem">
          <a-input
            v-decorator="['dataAuth', { initialValue: dataAuth }]"
            type="hidden"
          />
        </a-form-item>
        <a-form-item
          label="固定电话"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['telephone']" />
        </a-form-item>
        <a-form-item
          label="手机号码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
				<!-- pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, -->
          <a-input
            v-decorator="[
              'cellphone',
              {
                rules: [
                  {
                    pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
                    maxLength: 11,
                    message: '请输入正确的手机号码！',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="电子邮箱"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                    message: '请输入正确的邮箱！',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1 }]">
            <a-radio :value="1">
              启用
            </a-radio>
            <a-radio :value="0">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
// import {
// 	TreeSelect
// } from 'ant-design-vue'

import pick from "lodash.pick";
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import { getFilter } from "@/utils/TopVUI";
// const SHOW_PARENT = TreeSelect.SHOW_PARENT
// 表单字段
const fields = [
  "uuid",
  "userNameId",
  "userName",
  "sex",
  "orgId",
  "orgName",
  "telephone",
  "cellphone",
  "status",
  "userGroup",
  "dataAuth",
  "dataAuthName",
  "userGroupName",
  "email",
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
  components: { TMultiSelectTag, TreeSelect },
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
      orgId: "",
      orgName: "",
      AuthGroup: [],
      sysAuthdataGroup: [],
      // SHOW_PARENT,
      userGroup: "",
      userGroupName: "",
      userGroupName1: [],
      dataAuth: "",
      url: {
        fathersUrl: "/mdata/organization/getListByLevelId",
        expandUrl: "/mdata/organization/getListByPid",
        getAllList: "/system/sysAuthdataGroup/getAllList",
      },
      urlAuth: {
        fathersUrl: "/system/authGroup/getListByUserUuid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      authGroupData: [],
      treeExpandedKeys: [],
    };
  },
  created() {
    // 获取数据权限
    this.$post(this.urlAuth.fathersUrl).then((res) => {
      let AuthGroup = [];
      let children = [];
      this.authGroupData = res;
      res.forEach((e) => {
        if (e.pid == 1) {
          e.title = e.text;
          e.value = e.id;
          e.key = e.id;
          e.children = e.state === "closed" ? [] : "";
          AuthGroup.push(e);
        } else {
          children.push(e);
        }
      });
      this.AuthGroup = getFilter(AuthGroup, children);
    });
    this.$post(this.url.getAllList).then((res) => {
      this.sysAuthdataGroup = res;
    });
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    changeDataAuth(val) {
      this.sysAuthdataGroup.forEach((e) => {
        if (val == e.name) {
          this.dataAuth = e.id;
        }
      });
    },
    // 新增编辑
    add(e, data) {
      // this.form.setFieldsValue(pick(e, fields));
      this.userGroupName1 = [];
      this.orgName = "";
			data.forEach(item => {
				if(item.id == e.orgId){
					e.orgName = item.text
				}
			})
      this.$nextTick(() => {
        let userGroup = e.userGroup ? e.userGroup.split(",") : "";
        let userGroupName = e.userGroupName ? e.userGroupName.split(",") : "";
        userGroup &&
          userGroup.forEach((item, index) => {
            this.userGroupName1.push({
              value: item,
              label: userGroupName[index],
            });
          });
        this.orgId = e.orgId;
        this.form.setFieldsValue({
          ...e,
          userGroupName1: this.userGroupName1,
        });
      });
      this.treeData = data;
    },
    edit(e, data) {
      this.add(e, data);
    },
    selectOrg(value, node) {
			console.log(value, node)
      this.orgId = value;
      this.orgName = node ? node.toString() : "";
      this.form.setFieldsValue({
        orgId: value,
        orgName: this.orgName,
      });
    },
    // 角色授权
    selectUserGroupName(value, node, extra) {
      console.log(value, node, extra);

      let userGroup = [];
      let userGroupName = [];
      value.forEach((item) => {
        userGroup.push(item.value);
        userGroupName.push(item.label);
      });
      let data = this.authGroupData.filter(
        (item) => item.id == value[value.length - 1].value && item.levelId != 1
      );
      if (data.length != 0) {
        let index = value.findIndex((val) => val.value == data[0].pid);
        if (index < 0) {
          userGroup.push(data[0].pid);
          let name = this.authGroupData.filter(
            (item) => item.id == data[0].pid
          );
          if (name.length > 0) {
            userGroupName.push(name[0].text);
            let index = value.findIndex((val) => val.value == data[0].pid);
            value.push({
              value: data[0].pid,
              label: name[0].text,
            });
          }
        }
      }
      // // this.userGroup = value;
      this.userGroupName = userGroupName.toString();
      // console.log(value, this.userGroupName);
      this.form.setFieldsValue({
        userGroup: userGroup.toString(),
        userGroupName1: value.toString(),
        userGroupName: this.userGroupName,
      });
    },
  },
};
</script>
