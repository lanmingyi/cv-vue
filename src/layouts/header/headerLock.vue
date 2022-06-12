<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-08-31 10:08:14
 * @LastEditTime: 2021-08-31 14:13:15
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\layouts\header\headerLock.vue
-->
<template>
  <div>
    <span v-if="text" @click="handleLock">{{ text }}</span>
    <!-- <i v-else class="icon-suoping" @click="handleLock"></i> -->
    <a-icon type="lock" v-else @click="handleLock" />
    <t-modal
      title="设置锁屏密码"
      :visible.sync="box"
      width="30%"
      append-to-body
      :footer="null"
    >
      <a-form ref="form" :form="form" laba-width="80px">
        <a-form-item label="锁屏密码">
          <a-input
            v-decorator="[
              'pwd',
              {
                rules: [{ required: true, min: 1, message: '必填！' }],
              },
            ]"
            placeholder="请输入锁屏密码"
          >
            <a-icon slot="addonAfter" type="setting" @click="handleSetLock" />
          </a-input>
        </a-form-item>
      </a-form>
    </t-modal>
  </div>
</template>

<script>
// import { validatenull } from "@/util/validate";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "top-lock",
  props: {
    text: String,
  },
  data() {
    return {
      box: false,
      form: this.$form.createForm(this),
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["lockPasswd"]),
  },
  methods: {
    ...mapActions(["SetLockPasswd", "SetLock"]),
    handleSetLock() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          console.log(values);
          this.SetLockPasswd(values.pwd);
          this.handleLock();
        }
      });
    },
    handleLock() {
      if (!this.lockPasswd) {
        this.box = true;
        return;
      }
      console.log(this.box);
      this.SetLock();
      setTimeout(() => {
        this.$router.push({ path: "/lock" });
      }, 100);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
