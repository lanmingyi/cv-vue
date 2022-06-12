<!--
 * @Description: 折叠组件
 * @Author: 黄婷
 * @Date: 2021-05-13
 * @LastEditors: 黄婷
 * @LastEditTime: 2021-09-08 10:42:57
 -->
<template>
  <div class="com-content">
    <div class="com-title">{{ title }}</div>
    <draggable
      tag="ul"
      :value="itemList"
      v-bind="{
        group: { name: 'index-draggable', pull: 'clone', put: false },
        options: { draggable: '.draggable' },
        sort: false,
        animation: 180,
        ghostClass: 'moving',
      }"
      @start="handleStart($event, itemList)"
    >
      <li
        v-for="(val, index) in itemList"
        :key="index"
        @dragstart="$emit('generateKey', itemList, index)"
        @click="$emit('handleListPush', val)"
        :class="!val.canEdit ? 'draggable' : 'undraggable'"
      >
        <span>
          <icon-fonts :icon="val.icon" class="card-title-icon" />
        </span>
        {{ val.label }}
      </li>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "collapseItem",
  props: {
    list: Array,
    title: String,
  },
  components: {
    draggable,
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.itemList = newVal && newVal.length > 0 ? newVal : [];
      },
    },
  },
  data() {
    return {
      itemList: [],
    };
  },
  methods: {
    handleStart(e, list) {
      this.$emit("start", list[e.oldIndex].type);
    },
  },
};
</script>
