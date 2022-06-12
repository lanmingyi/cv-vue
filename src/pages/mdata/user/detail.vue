<template>
  <t-drawer
    title="用户详情"
    placement="right"
    :closable="false"
    :after-visible-change="afterVisibleChange"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @close="onClose"
  >
    <a-card :bordered="false">
      <div class="account-center-avatarHolder">
        <div class="avatar">
          <img :src="data.avatar" v-if="data.avatar" />
          <a-avatar
            class="avatarBox"
            v-else
            shape="square"
            size="large"
            style="color: #f56a00; backgroundColor: #fde3cf"
          >
            <a-icon slot="icon" type="user" />
          </a-avatar>
        </div>
        <div class="username"></div>
        <div class="bio">{{ data.userName }}</div>
        <div class="bio">
          {{
            data.sex
              ? data.sex == "0"
                ? " "
                : data.sex === "1"
                ? "男"
                : "女"
              : ""
          }}
        </div>
      </div>
      <div class="account-center-detail">
        <a-descriptions title="" :column="{ md: 2 }">
          <a-descriptions-item label="员工号">
            {{ data.userNameId }}
          </a-descriptions-item>
          <a-descriptions-item label="职务">
            {{ data.postText }}
          </a-descriptions-item>
          <a-descriptions-item label="所属机构">
            {{ data.orgName }}
          </a-descriptions-item>
          <a-descriptions-item label="角色权限">
            {{ data.userGroupName }}
          </a-descriptions-item>
          <!--<a-descriptions-item label="数据权限">-->
            <!--{{ data.dataAuthName }}-->
          <!--</a-descriptions-item>-->
          <a-descriptions-item label="联系电话">
            {{ data.cellphone }}
          </a-descriptions-item>
          <a-descriptions-item label="电子邮箱">
            {{ data.email }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </t-drawer>
</template>
<script>
// import { getUserListDetailByUuid } from '@/api/mdata'
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
      form: this.$form.createForm(this),
      data: "",
    };
  },
  methods: {
    afterVisibleChange(val) {
      // console.log('visible', val)
    },
    onClose() {
      this.$emit("update:visible", false);
    },
    onLoadData(e) {
      this.data = e;
      // getUserListDetailByUuid({ uuid: e.uuid }).then(res => {
      //   // console.log(res)
      // })
    },
  },
};
</script>
<style scoped="scoped" lang="less">
.account-center-avatarHolder {
  text-align: center;
  margin-bottom: 24px;

  & > .avatar {
    margin: 0 auto;
    width: 104px;
    height: 104px;
    margin-bottom: 20px;
    border-radius: 50%;
    overflow: hidden;

    img {
      height: 100%;
      width: 100%;
    }
  }

  .username {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}

.avatarBox {
  width: 100%;
  height: 100%;
  line-height: 2;
  font-size: 50px;
}
</style>
