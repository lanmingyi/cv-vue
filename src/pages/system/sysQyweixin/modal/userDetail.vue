<!--
 * @Description: 用户详情
 * @Author: 黄婷
 * @Date: 2021-06-15 19:02:05
 * @LastEditTime: 2021-07-27 16:50:16
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysQyweixin\modal\userDetail.vue
-->
<template>
  <t-modal
    title="详情"
    :width="680"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('update:visible', false);
      }
    "
  >
    <a-card :bordered="false" v-if="model">
      <a-row :gutter="24"
        ><a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6"
          ><div class="account-center-avatarHolder">
            <div class="avatar">
              <!-- <img :src="model.avatar" v-if="model.avatar" /> -->
              <a-avatar
                class="avatarBox"
                shape="square"
                size="large"
                :src="model.avatar"
                style="color: #f56a00; backgroundColor: #fde3cf"
              >
                <a-icon slot="icon" type="user" />
              </a-avatar>
            </div>
            <a-descriptions title="" :column="{ md: 1 }" style="padding-top-xs">
              <a-descriptions-item label="姓名">
                {{ model.name }}
              </a-descriptions-item>
              <a-descriptions-item label="性别">
                {{ model.gender == "1" ? "男" : "女" }}
              </a-descriptions-item>
            </a-descriptions>
          </div></a-col
        >
        <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18"
          ><div class="account-center-detail">
            <a-descriptions title="" :column="{ md: 2 }">
              <a-descriptions-item label="别名">
                {{ model.alias }}
              </a-descriptions-item>
              <a-descriptions-item label="职位">
                {{ model.position }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                {{ model.mobile }}
              </a-descriptions-item>
              <a-descriptions-item label="电子邮箱">
                {{ model.email }}
              </a-descriptions-item>
              <a-descriptions-item label="户籍所在地">
                {{ model.address }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import { baseUrl } from "@/services/baseUrl";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
// 表单字段
const fields = ["orgIds", "years", "userIds"];

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
      url: {
        fathersUrl: "/system/sysQyweixinOrganization/getDatList",
        expandUrl: "/system/sysQyweixinOrganization/getDatList",
        subList: "/system/sysQyweixinUser/getPageSet",
      },
      parameter: {
        father: {
          pid: 0,
        },
        children: {},
      },
      userList: [],
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
    // getAvatar() {
    // 	return this.model.avatar == null ? '' : baseUrl + '/system/attachment/showPic?path=' + this.model.avatar;
    // },
    // seleteOrg(value, node) {
    // 	console.log('value,node', value, node);
    // 	this.$post(this.url.subList, { orgId: value }).then((res) => {
    // 		this.userList = res.rows;
    // 	});
    // },
  },
};
</script>
