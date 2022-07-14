<!--
 * @Description: 用户
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-08-20 14:24:38
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <a-input-search
      v-model="userNames"
      :placeholder="placeholder"
      readOnly
      unselectable="on"
      @search="onSearchDepUser"
    >
      <a-button class="cu-btn-primary" slot="enterButton" :disabled="disabled"
        >选择用户</a-button
      >
    </a-input-search>
    <t-select-user-by-dep-modal
      ref="selectModal"
      :record="record"
      :modal-width="modalWidth"
      :multi="multiple"
      @ok="selectOK"
      :user-ids="userIds"
      @initComp="initComp"
    />
  </div>
</template>

<script>
import TSelectUserByDepModal from "./modal/TSelectUserByDepModal";

export default {
  name: "TSelectUserByDep",
  components: { TSelectUserByDepModal },
  props: {
    modalWidth: {
      type: Number,
      default: 1250,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
      required: false,
    },
    record: {
      type: Object,
    },
    placeholder: {
      type: String,
      defalut: "请选择用户",
    },
  },
  data() {
    return {
      userIds: "",
      userNames: "",
    };
  },
  mounted() {
    this.userIds = this.value;
  },
  watch: {
    value(val) {
      this.userIds = val;
    },
    record(val) {
      if (val) {
        this.userIds = val.options.defaultValue;
      }
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  methods: {
    initComp(userNames) {
      this.userNames = userNames;
    },
    onSearchDepUser() {
      this.$refs.selectModal.showModal();
    },
    selectOK(rows, idstr) {
      console.log("当前选中用户", rows);
      console.log("当前选中用户ID", idstr);
      if (!rows) {
        this.userNames = "";
        this.userIds = "";
      } else {
        let temp = "";
        for (let item of rows) {
          temp += "," + item.userName;
        }
        this.userNames = temp.substring(1);
        this.userIds = idstr;
      }
      console.log(this.userIds);
      this.$emit("change", this.userIds);
    },
  },
};
</script>

<style scoped></style>
