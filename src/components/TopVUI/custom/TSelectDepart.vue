<!--
 * @Description: 部门选择器
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-08-20 14:26:58
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="components-input-demo-presuffix">
    <!---->
    <a-input
      @click="openModal"
      :placeholder="placeholder"
      v-model="departNames"
      readOnly
      v-if="!disabled"
    >
      <a-icon slot="prefix" type="cluster" title="部门选择控件" />
      <a-icon
        v-if="departIds"
        slot="suffix"
        type="close-circle"
        @click="handleEmpty"
        title="清空"
      />
    </a-input>
    <a-input :placeholder="placeholder" v-model="departNames" readOnly v-else>
      <a-icon slot="prefix" type="cluster" title="部门选择控件" />
    </a-input>
    <t-select-depart-modal
      ref="innerDepartSelectModal"
      :modal-width="modalWidth"
      :multi="multi"
      :rootOpened="rootOpened"
      :depart-id="departIds"
      @ok="handleOK"
      @initComp="initComp"
    />
  </div>
</template>

<script>
import TSelectDepartModal from "./modal/TSelectDepartModal";
export default {
  name: "TSelectDepart",
  components: {
    TSelectDepartModal,
  },
  props: {
    modalWidth: {
      type: Number,
      default: 500,
      required: false,
    },
    multi: {
      type: Boolean,
      default: false,
      required: false,
    },
    rootOpened: {
      type: Boolean,
      default: true,
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
    // 自定义返回字段，默认返回 id
    customReturnField: {
      type: String,
      default: "id",
    },
    record: {
      type: Object,
    },
    placeholder: { type: String, default: "请选择组织机构" },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      departNames: "",
      departIds: "",
    };
  },
  mounted() {
    this.departIds = this.value;
  },
  watch: {
    value(val) {
      if (this.customReturnField === "id") {
        this.departIds = val;
      }
    },
    departNames(val) {
      console.log(val);
    },
    record(val) {
      if (val) {
        this.departIds = val.options.defaultValue;
      }
    },
  },
  methods: {
    initComp(departNames) {
      this.departNames = departNames;
      //update-begin-author:lvdandan date:20200513 for:TESTA-438 部门选择组件自定义返回值，数据无法回填
      //TODO 当返回字段为部门名称时会有问题,因为部门名称不唯一
      //返回字段不为id时，根据返回字段获取id
      if (this.customReturnField !== "id" && this.value) {
        const dataList = this.$refs.innerDepartSelectModal.dataList;
        console.log("this.value", this.value);
        this.departIds = this.value
          .split(",")
          .map((item) => {
            const data = dataList.filter(
              (d) => d[this.customReturnField] === item
            );
            return data.length > 0 ? data[0].id : "";
          })
          .join(",");
      }
      //update-end-author:lvdandan date:20200513 for:TESTA-438 部门选择组件自定义返回值，数据无法回填
    },
    openModal() {
      this.$refs.innerDepartSelectModal.show();
    },
    handleOK(rows, idstr) {
      console.log(rows, idstr);
      let val = "";
      if (!rows && rows.length <= 0) {
        this.departNames = "";
        this.departIds = "";
      } else {
        val = rows.map((row) => row[this.customReturnField]).join(",");
        this.departNames = rows.map((row) => row["title"]).join(",");
        this.departIds = idstr;
      }
      console.log(val, this.departNames);
      this.$emit("change", val);
    },
    getDepartNames() {
      return this.departNames;
    },
    handleEmpty() {
      this.$refs.innerDepartSelectModal.handleClear();
      this.handleOK("");
    },
  },
};
</script>

<style scoped>
.components-input-demo-presuffix .anticon-close-circle {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  font-size: 12px;
}
.components-input-demo-presuffix .anticon-close-circle:hover {
  color: #f5222d;
}
.components-input-demo-presuffix .anticon-close-circle:active {
  color: #666;
}
</style>
