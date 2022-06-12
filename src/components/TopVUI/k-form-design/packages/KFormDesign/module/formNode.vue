<!--
 * @Description: 将数据通过k-form-item组件解析，生成控件
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-14 09:13:58
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormDesign\module\formNode.vue
-->

<template>
  <div
    class="drag-move-box"
    @click.stop="$emit('handleSelectItem', record)"
    :class="{ active: record.key === selectItem.key }"
  >
    <div class="form-item-box">
      <kFormItem :formConfig="config" :record="record" />
    </div>
    <!-- <div v-if="!hideModel" class="show-key-box" v-text="record.model" /> -->
    <div
      class="copy"
      :class="record.key === selectItem.key ? 'active' : 'unactivated'"
      @click.stop="$emit('handleCopy')"
    >
      <a-icon type="copy" />
    </div>
    <a-popconfirm
      placement="bottomRight"
      ok-text="是"
      cancel-text="否"
      @confirm="$emit('handleDelete')"
    >
      <a-icon slot="icon" type="question-circle-o" style="color: red" />
      <template slot="title">
        <p>是否删除该组件？</p>
      </template>
      <div
        class="delete"
        :class="record.key === selectItem.key ? 'active' : 'unactivated'"
      >
        <a-icon type="delete" />
      </div>
    </a-popconfirm>
    <!-- 		<div
			class="delete"
			:class="record.key === selectItem.key ? 'active' : 'unactivated'"
			@click.stop="$emit('handleDelete')"
		>
			<a-icon type="delete" />
		</div> -->
  </div>
</template>
<script>
/*
 * author 黄婷
 * date 2019-11-20
 * description 通过json生成的单个表单节点
 */
import kFormItem from "../../KFormItem/index";
export default {
  props: {
    record: {
      type: Object,
      required: true,
    },
    selectItem: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      required: true,
    },
    hideModel: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    kFormItem,
  },
};
</script>
