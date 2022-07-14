<!--
 * @Description: 表格操作按钮
 * @Author: lmy
 * @Date: 2021-03-17 13:22:14
 * @LastEditTime: 2021-08-11 10:01:02
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div
    class="toolbar flex justify-between flex-wrap"
    style="width: 100%;"
    ref="toolbars"
    v-if="!collapse"
  >
    <div class="table-operator">
      <slot name="toolBtn"></slot>
    </div>
    <div class="table-page-search-wrapper" v-if="$slots.toolForm">
      <a-form layout="inline">
        <div class="flex justify-start flex-wrap">
          <slot name="toolForm"></slot>
          <div class="table-page-search-submitButtons flex">
            <a-button
              class="cu-btn-primary"
              @click="
                () => {
                  $emit('search');
                }
              "
              >查询</a-button
            >
            <a-button
              class="cu-btn-filter"
              @click="
                () => {
                  $emit('reset');
                }
              "
              >重置</a-button
            >
          </div>
        </div>
      </a-form>
    </div>
  </div>
  <div class="toolbar" v-else>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <div
          :class="[advanced ? null : 'fold', 'flex justify-start flex-wrap']"
        >
          <slot name="toolForm"></slot>
          <slot name="toolFormAdvanced" v-if="advanced"></slot>
          <div class="table-page-search-submitButtons flex">
            <a-button
              class="cu-btn-primary"
              @click="
                () => {
                  $emit('search');
                }
              "
              >查询</a-button
            >
            <a-button
              class="cu-btn-filter"
              @click="
                () => {
                  $emit('reset');
                }
              "
              >重置</a-button
            >
            <a
              @click="toggleAdvanced"
              style="margin-left: 8px;line-height: 32.8px;"
            >
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </div>
        </div>
      </a-form>
    </div>
    <div class="table-operator">
      <slot name="toolBtn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "ToolBar",
  props: {
    collapse: {
      type: false,
    },
  },
  data() {
    return {
      advanced: false,
    };
  },
  computed: {
    slots() {
      return Object.keys(this.$slots);
    },
  },
  created() {},
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
};
</script>

<style></style>
