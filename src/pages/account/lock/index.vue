<template>
  <div class="lock-container">
    <div class="lock-form animated bounceInDown">
      <div class="animated" :class="{ shake: passwdError, bounceOut: pass }">
        <!-- <h3 class="title">{{ userInfo.username }}</h3> -->
        <a-input
          placeholder="请输入登录密码"
          type="password"
          class="input-with-select animated"
          v-model="passwd"
          @keyup.enter.native="handleLogin"
        >
          <a-button
            slot="append"
            icon="icon-bofangqi-suoping"
            @click="handleLogin"
          ></a-button>
          <a-button
            slot="append"
            icon="icon-tuichu"
            @click="handleLogout"
          ></a-button>
        </a-input>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "lock",
  data() {
    return {
      passwd: "",
      passwdError: false,
      pass: false,
    };
  },
  created() {
    const cachedTabsStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_KEY);
    console.log(cachedTabsStr, "cachedTabsStr====");
  },
  mounted() {},
  computed: {
    ...mapGetters(["userInfo", "isLock", "lockPasswd"]),
  },
  props: [],
  methods: {
    ...mapActions(["ClearLock"]),
    handleLogout() {
      this.$confirm("是否退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    },
    handleLogin() {
      const cachedTabsStr = sessionStorage.getItem(
        process.env.VUE_APP_TBAS_KEY
      );
      console.log(cachedTabsStr, this.$router);
      if (this.passwd != this.lockPasswd) {
        this.passwd = "";
        this.$message.error("解锁密码错误,请重新输入");
        this.passwdError = true;
        setTimeout(() => {
          this.passwdError = false;
        }, 1000);
        return;
      }
      // this.pass = true;
      // setTimeout(() => {
      //   this.ClearLock();
      //   this.$router.push({
      //     path: "/system/portal/index",
      //   });
      // }, 1000);
    },
  },
  components: {},
};
</script>

<style lang="scss">
.lock-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .title {
    margin-bottom: 8px;
    color: #333;
  }
}
.lock-container::before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/img/bg4.jpg");
  background-size: cover;
}
.lock-form {
  width: 300px;
}
</style>
