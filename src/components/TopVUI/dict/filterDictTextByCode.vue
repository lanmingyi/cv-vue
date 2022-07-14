<!--
 * @Description: 表格列字典数据处理
 * @Author: lmy
 * @Date: 2021-08-25 09:25:29
 * @LastEditTime: 2021-08-25 10:35:19
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>{{ textValue }}</div>
</template>

<script>
export default {
  data() {
    return {
      textValue: "",
    };
  },
  props: {
    code: {
      type: String,
    },
    value: {
      type: String,
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.getTextBycode(this.code, val);
      }
    },
  },
  mounted() {
    this.getTextBycode(this.code, this.value);
  },
  methods: {
    getTextBycode(dictCode, key) {
      if (key == null || key.length == 0) {
        this.textValue = "";
      }
      if (!dictCode) {
        this.textValue = "字典Code不能为空!";
      }
      //优先从缓存中读取字典配置
      this.$post("/system/dicSet/getDicItemByCode", {
        code: dictCode,
      }).then((res) => {
        let item = res.filter((t) => t["value"] == key);
        if (item && item.length > 0) {
          this.textValue = item[0]["text"];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
