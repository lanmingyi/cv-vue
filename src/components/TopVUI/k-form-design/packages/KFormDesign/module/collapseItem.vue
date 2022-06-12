<!--
 * @Description: 折叠组件
 * @Author: 黄婷
 * @Date: 2020-01-13 00:37:54
 * @LastEditors: 黄婷
 * @LastEditTime: 2021-09-14 09:16:29
 -->
<template>
  <div class="com-content">
    <div class="com-title">{{ title }}</div>
    <draggable
      tag="ul"
      :value="list"
      v-bind="{
        group: { name: 'form-draggable', pull: 'clone', put: false },
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
        <span
          v-if="
            ['icon', 'color', 'userPop', 'depart', 'codeTag', 'area'].includes(
              val.type
            )
          "
        >
          <a-icon :type="val.icon"></a-icon>
        </span>
        <span v-else>
          <svg v-if="val.icon" class="icon" aria-hidden="true">
            <use :xlink:href="`#${val.icon}`"></use>
          </svg>
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
  props: ["list", "title"],
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
