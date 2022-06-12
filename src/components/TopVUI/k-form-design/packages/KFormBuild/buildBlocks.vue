<!--
 * @Description: 表单设计布局组件
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:47:44
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormBuild\buildBlocks.vue
-->
<template>
  <!-- 标签页布局 -->
  <a-tabs
    v-if="record.type === 'tabs'"
    class="grid-row"
    :default-active-key="0"
    :tabBarGutter="record.options.tabBarGutter"
    :type="record.options.type"
    :size="record.options.size"
    :tabPosition="record.options.tabPosition"
    :animated="record.options.animated"
  >
    <a-tab-pane
      v-for="(tabItem, index) in record.columns"
      :key="index"
      :tab="tabItem.label"
    >
      <buildBlocks
        ref="nestedComponents"
        @handleReset="$emit('handleReset')"
        @change="handleChange"
        v-for="item in tabItem.list"
        :disabled="disabled"
        :dynamicData="dynamicData"
        :key="item.key"
        :record="item"
        :formConfig="formConfig"
        :config="config"
      />
    </a-tab-pane>
  </a-tabs>
  <!-- 栅格布局 -->
  <a-row
    v-else-if="record.type === 'grid'"
    :class="[
      'grid-row',
      record.options.tableStyle ? 'grid-row-tabel' : '',
      record.options.formBorder ? 'grid-row-form-border' : '',
    ]"
    :gutter="record.options.gutter"
    v-bind="{
      type: record.options.type === 'default' ? null : 'flex',
      align: record.options.type === 'default' ? null : record.options.align,
      justify:
        record.options.type === 'default' ? null : record.options.justify,
    }"
  >
    <!-- <a-row
    v-else-if="record.type === 'grid'"
    :class="['grid-row']"
    :gutter="record.options.gutter"
    v-bind="{
      type: record.options.type === 'default' ? null : 'flex',
      align: record.options.type === 'default' ? null : record.options.align,
      justify:
        record.options.type === 'default' ? null : record.options.justify,
    }"
  > -->
    <a-col
      class="grid-col"
      v-for="(colItem, idnex) in record.columns"
      :key="idnex"
      :span="colItem.span || 0"
    >
      <buildBlocks
        ref="nestedComponents"
        @handleReset="$emit('handleReset')"
        @change="handleChange"
        v-for="item in colItem.list"
        :disabled="disabled"
        :dynamicData="dynamicData"
        :key="item.key"
        :record="item"
        :formConfig="formConfig"
        :config="config"
      />
    </a-col>
  </a-row>
  <!-- 卡片布局 -->
  <a-card
    v-else-if="record.type === 'card'"
    class="grid-row"
    :title="record.label"
    :bordered="record.options.bordered ? record.options.bordered : false"
  >
    <buildBlocks
      ref="nestedComponents"
      @handleReset="$emit('handleReset')"
      @change="handleChange"
      v-for="item in record.list"
      :disabled="disabled"
      :dynamicData="dynamicData"
      :key="item.key"
      :record="item"
      :formConfig="formConfig"
      :config="config"
    />
  </a-card>
  <!-- 表格布局 -->
  <table
    v-else-if="record.type === 'table'"
    class="kk-table-9136076486841527"
    :class="{
      bright: record.options.bright,
      small: record.options.small,
      bordered: record.options.bordered,
      formBorder: record.options.formBorder,
    }"
    :style="record.options.customStyle"
  >
    <tr v-for="(trItem, trIndex) in record.trs" :key="trIndex">
      <td
        class="table-td"
        v-for="(tdItem, tdIndex) in trItem.tds"
        :key="tdIndex"
        :colspan="tdItem.colspan"
        :rowspan="tdItem.rowspan"
      >
        <buildBlocks
          ref="nestedComponents"
          @handleReset="$emit('handleReset')"
          @change="handleChange"
          v-for="item in tdItem.list"
          :disabled="disabled"
          :dynamicData="dynamicData"
          :key="item.key"
          :record="item"
          :formConfig="formConfig"
          :config="config"
        />
      </td>
    </tr>
  </table>

  <div :class="[formConfig.columns === 'two' ? 'flexColumnsItem' : '']" v-else>
    <!-- <KFormView
		  v-if="isView"
	    ref="nestedComponents"
	    @handleReset="$emit('handleReset')"
	    @change="handleChange"
	    :disabled="disabled"
	    :dynamicData="dynamicData"
	    :key="record.key"
	    :record="record"
	    :formConfig="formConfig"
	    :config="config"
	  	:isView='isView||record.options.disabled'
      v-if="!record.options.hidden"
	  /> -->
    <KFormItem
      :class="[record.options.hidden ? 'hiddenItem' : '']"
      ref="nestedComponents"
      @handleReset="$emit('handleReset')"
      @change="handleChange"
      :disabled="record.options.disabled"
      :dynamicData="dynamicData"
      :key="record.key"
      :record="record"
      :formConfig="formConfig"
      :config="config"
    >
    </KFormItem>
  </div>
</template>
<script>
/*
 * author 黄婷
 * date 2019-11-20
 */
import KFormItem from "../KFormItem/index";
import KFormView from "../KFormItem/view";
export default {
  name: "buildBlocks",
  props: {
    record: {
      type: Object,
      required: true,
    },
    formConfig: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      default: () => ({}),
    },
    dynamicData: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    KFormItem,
    KFormView,
  },
  mounted() {
    // console.log(this.record,'view====')
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      let nestedComponents = this.$refs.nestedComponents;
      if (
        typeof nestedComponents === "object" &&
        nestedComponents instanceof Array
      ) {
        for (let i = 0; nestedComponents.length > i; i++) {
          if (!nestedComponents[i].validationSubform()) {
            return false;
          }
        }
        return true;
      } else if (typeof nestedComponents !== "undefined") {
        return nestedComponents.validationSubform();
      } else {
        return true;
      }
    },
    handleChange(value, key) {
      this.$emit("change", value, key);
    },
  },
};
</script>
