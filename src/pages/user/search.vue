<!--
 * @Description: 注册查询
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-18 11:47:53
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\search.vue
-->
<template>
  <t-modal
    title="账号申请状态"
    :width="640"
    :visible="visible"
    ok-text="查询"
    cancel-text="关闭"
    :switchFullscreen="true"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item
          label="企业名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'enterpriseName',
              { rules: [{ required: true, message: '必填' }] },
            ]"
            placeholder="企业名称"
          />
        </a-form-item>
        <a-form-item
          label="联系电话"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            size="large"
            placeholder="11 位手机号"
            v-decorator="[
              'contactsNumber',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的手机号',
                    pattern: /^1[3456789]\d{9}$/,
                  },
                ],
                validateTrigger: ['blur'],
              },
            ]"
          />
        </a-form-item>
        <template v-if="resultObj.length != 0">
          <!-- <a-form-item label="审批状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
						{{resultObj.status}}
					</a-form-item>
					<a-form-item label="审批意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
						{{resultObj.message}}
					</a-form-item> -->
          <a-card title="审批结果" :bordered="false" class="margin-top-sm">
            <a-timeline style="width: 80%;margin: 0 auto;padding-top: 10px;">
              <a-timeline-item
                :color="getDotColor(item.auditType)"
                v-for="(item, index) in resultObj"
                :key="index"
              >
                <p>{{ item.createTime }}</p>
                <p>审批{{ item.auditType }}</p>
                <p>{{ item.auditOpinion }}</p>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </template>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button
        class="cu-btn-primary"
        key="reset"
        @click="resetSubmit()"
        v-if="btnShow"
      >
        重新申请
      </a-button>
      <a-button key="submit" type="primary" @click="handleOk"> 查询 </a-button>
      <a-button
        key="cancel"
        @click="
          () => {
            $emit('cancel');
          }
        "
      >
        关闭
      </a-button>
    </template>
  </t-modal>
</template>

<script>
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
  },
  data() {
    return {
      title: "",
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
          span: 16,
        },
      },
      form: this.$form.createForm(this),
      resultObj: [],
      formModel: {},
      btnShow: false,
    };
  },
  methods: {
    restForm() {
      this.form.resetFields(); // 清理表单数据（可不做)
      this.resultObj = "";
    },
    handleOk() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          // this.$success({
          // 	title: '账号申请状态',
          // 	content: '注册成功！'
          // });
          this.$post("/system/sysEnterpriseRegister/search", values)
            .then((res) => {
              if (res.statusCode !== 400) {
                this.$message.success(res.message, 1.5);
                return false;
              }
              this.resultObj = res.list;
              this.formModel = res.data;
              this.btnShow = true;
            })
            .catch((err) => {
              // this.registerBtn = false
            });
        }
      });
    },
    resetSubmit() {
      this.$emit("ok", this.formModel);
    },
    getDotColor(val) {
      if (val === "未通过") {
        return "red";
      } else if (val === "审核中") {
        return "blue";
      } else {
        return "green";
      }
    },
  },
};
</script>
