<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form">
          <a-form-item
            label="工号"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              placeholder="请输入工号"
              v-decorator="[
                'userNameId',
                {
                  rules: [{ required: true, min: 1, message: '必填！' }],
                },
              ]"
              disabled
            />
          </a-form-item>
          <a-form-item class="hiddenItem">
            <a-input type="hidden" v-decorator="['uuid']" />
          </a-form-item>
          <a-form-item
            label="姓名"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              placeholder="请输入姓名"
              v-decorator="[
                'userName',
                {
                  rules: [{ required: true, min: 1, message: '必填' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            label="性别"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              name="radioGroup"
              :default-value="1"
              v-decorator="['sex']"
            >
              <a-radio value="1">
                男
              </a-radio>
              <a-radio value="2">
                女
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="年龄"
            :required="false"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input-number
              id="inputNumber"
              v-decorator="['age']"
              :min="1"
              :max="110"
              @change="onChange"
            />
          </a-form-item>
          <a-form-item
            label="电子邮箱"
            :required="false"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="exp@admin.com" v-decorator="['email']" />
          </a-form-item>
          <a-form-item
            label="固定电话"
            :required="false"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input placeholder="固定电话" v-decorator="['telephone']" />
          </a-form-item>
          <a-form-item
            label="手机号码"
            :required="false"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              placeholder="手机号码"
              v-decorator="[
                'cellphone',
                {
                  rules: [
                    { required: true, min: 1, message: '请输入11位的手机号！' },
                  ],
                },
              ]"
              :maxLength="11"
            />
          </a-form-item>
          <a-form-item class="hiddenItem">
            <a-input v-decorator="['avatar']" type="hidden" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" block @click="save()">保存</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img" />
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal" @ok="setavatar" />
  </div>
</template>

<script>
import AvatarModal from "./AvatarModal";
import pick from "lodash.pick";
import { mapActions } from "vuex";
import { baseUrl } from "@/services/baseUrl";
import { getToken } from "@/utils/TopVUI";
// 表单字段
const fields = [
  "userNameId",
  "userName",
  "uuid",
  "sex",
  "age",
  "email",
  "avatar",
  "cellphone",
  "telephone",
];
export default {
  components: {
    AvatarModal,
  },
  data() {
    return {
      // cropper
      form: this.$form.createForm(this),
      preview: {},
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 3,
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
      option: {
        // img: '/avatar2.jpg',
        img: "",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
      },
      userInfos: {},
    };
  },
  mounted() {
    this.getUserInfo();
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 userInfos 发生改变时，为表单设置值
    this.$watch("userInfos", () => {
      this.userInfos && this.form.setFieldsValue(pick(this.userInfos, fields));
    });
  },
  methods: {
    ...mapActions(["SetUserInfo"]),
    getUserInfo() {
      this.$post("/mdata/user/getCurrentUserInfor").then((res) => {
        this.userInfos = res;
        this.option.img = this.userInfos.avatar
          ? this.userInfos.avatar
          : "/avatar2.jpg";
      });
    },
    setavatar(url) {
      console.log(
        baseUrl + "/document/minio/showPic?fileuUrl=zysd-test02" + "/" + url
      );
      this.option.img =
        baseUrl + "/document/minio/showPic?fileuUrl=zysd-test02" + "/" + url;
      this.userInfos.avatar =
        baseUrl + "/document/minio/showPic?fileuUrl=zysd-test02" + "/" + url;
    },
    onChange(value) {
      console.log("changed", value);
    },
    save() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          values.avatar = this.option.img;
          this.$post("/mdata/user/foundationUpdate", values).then((res) => {
            if (res.statusCode === 200) {
              this.SetUserInfo();
              this.$message.info(res.message, 1.5);
            } else {
              this.$message.info(res.message, 1.5);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
