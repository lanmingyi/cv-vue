<template>
  <a-card>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="版本号(大于app传过来的版本号则更新)">
            <a-input
              placeholder="版本号"
              v-decorator="[
                'appVersion',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="整包更新/热更新">
            <a-select
              placeholder="请选择更新类型"
              v-decorator="[
                'appUpdataType',
                { rules: [{ required: true, message: '请选择更新类型' }] },
              ]"
            >
              <a-select-option
                v-for="(item, index) in appUpdataType"
                :key="index"
                :value="item.value"
                >{{ item.key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="wgt/apk下载地址(该地址能直接访问)">
            <a-input
              placeholder="请输入wgt/apk下载地址"
              id="appUpdateDownloadUrl"
              v-decorator="[
                'appUpdateDownloadUrl',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="版本更新内容">
            <a-input
              id="note"
              placeholder="请输入版本更新内容"
              v-decorator="[
                'note',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="margin-top-sm">
        <a-col :span="12">
          <a-button type="primary" @click="check" block>
            保存
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script>
import pick from "lodash.pick";
export default {
  components: {},
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
      appUpdataType: [
        { key: "整包更新", value: "1" },
        { key: "热更新", value: "2" },
      ],
    };
  },
  mounted() {
    this.getDetailByUuid();
  },
  methods: {
    getDetailByUuid() {
      this.$post("/system/sysConfiguration/getDetailByUuid", {
        uuid: "4",
      }).then((res) => {
        this.form.resetFields();
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(
              res,
              ",uuid",
              "type",
              "appVersion",
              "appUpdataType",
              "appUpdateDownloadUrl",
              "note"
            )
          );
        });
      });
    },
    check() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.uuid = "4";
          values.type = "app";
          values.jsonData = JSON.stringify(values);
          this.$post("/system/sysConfiguration/save", values).then((res) => {
            if (res.statusCode === 200 || res === 1) {
              this.$message.success(
                res.message ? res.message : "操作成功",
                1.5
              );
            } else {
              this.$message.error(res.message, 1.5);
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
/deep/ .ant-form-item-control {
  line-height: 1.2 !important;
}
</style>
