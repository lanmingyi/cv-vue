<!--
 * @Description: 左侧控件
 * @Author: lmy
 * @Date: 2021-05-13
 * @LastEditors: lmy
 * @LastEditTime: 2021-08-06 16:28:31
 -->
<template>
  <draggable
    tag="ul"
    :value="list"
    v-bind="{
      group: { name: 'index-draggable', pull: 'clone', put: false },
      sort: false,
      animation: 180,
      ghostClass: 'moving',
    }"
    @start="handleStart($event, list)"
  >
    <li
      v-for="(val, index) in list"
      :key="index"
      @dragstart="$emit('generateKey', list, index)"
      @click="$emit('handleListPush', val)"
    >
      <span>
        <icon-fonts :icon="val.icon" class="card-title-icon" />
      </span>
      {{ val.label }}
    </li>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "asideLeft",
  props: ["list"],
  components: {
    draggable,
  },
  methods: {
    handleStart(e, list) {
      this.$emit("start", list[e.oldIndex].type);
    },
  },
};
</script>
