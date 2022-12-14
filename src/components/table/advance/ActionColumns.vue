<template>
  <div class="action-columns" ref="root">
    <div class="ant-popover-title">
      <a-checkbox
        :indeterminate="indeterminate"
        :checked="checkAll"
        @change="onCheckAllChange"
        class="check-all"
      />列展示
      <!-- <a-button @click="resetColumns" style="float: right" type="link" size="small">重置</a-button> -->
    </div>
    <div class="ant-popover-inner-content">
      <a-list style="width: 100%" size="small">
        <a-list-item
          :key="i"
          v-for="(col, i) in columns"
          v-if="col.type !== 'serial'"
          @click="onCheckChangeTitle(col)"
        >
          <a-checkbox
            v-model="col.visible"
            @change="(e) => onCheckChange(e, col)"
          />
          <template v-if="col.title">
            {{ col.title }}
          </template>
          <slot
            v-else-if="col.slots && col.slots.title"
            :name="col.slots.title"
          ></slot>
          <template slot="actions"> </template>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";

export default {
  name: "ActionColumns",
  props: ["columns", "visibleColumns"],
  data() {
    return {
      visible: false,
      indeterminate: false,
      checkAll: true,
      checkedCounts: this.columns.length,
      backColumns: cloneDeep(this.columns),
    };
  },
  watch: {
    checkedCounts(val) {
      this.checkAll = val === this.columns.length;
      this.indeterminate = val > 0 && val < this.columns.length;
    },
  },
  created() {
    this.$emit("update:visibleColumns", [...this.columns]);
    for (let col of this.columns) {
      if (col.visible === undefined) {
        this.$set(col, "visible", true);
      }
      if (!col.visible) {
        this.checkedCounts -= 1;
      }
    }
  },
  methods: {
    onCheckChange(e, col) {
      if (!col.visible) {
        this.checkedCounts -= 1;
      } else {
        this.checkedCounts += 1;
      }
    },
    onCheckChangeTitle(col) {
      console.log(col);
      col.visible = !col.visible;
      if (!col.visible) {
        this.checkedCounts -= 1;
      } else {
        this.checkedCounts += 1;
      }
    },
    fixColumn(fixed, col) {
      if (fixed !== col.fixed) {
        this.$set(col, "fixed", fixed);
      } else {
        this.$set(col, "fixed", undefined);
      }
    },
    setSearch(col) {
      this.$set(col, "searchAble", !col.searchAble);
      if (!col.searchAble && col.search) {
        this.resetSearch(col);
      }
    },
    resetSearch(col) {
      // col.search.value = col.dataType === 'boolean' ? false : undefined
      col.search.value = undefined;
      col.search.backup = undefined;
    },
    resetColumns() {
      const { columns, backColumns } = this;
      let counts = columns.length;
      backColumns?.length &&
        backColumns.forEach((back, index) => {
          const column = columns[index];
          column.visible = back.visible === undefined || back.visible;
          if (!column.visible) {
            counts -= 1;
          }
          if (back.fixed !== undefined) {
            column.fixed = back.fixed;
          } else {
            this.$set(column, "fixed", undefined);
          }
          this.$set(column, "searchAble", back.searchAble);
          // column.searchAble = back.searchAble
          this.resetSearch(column);
        });
      this.checkedCounts = counts;
      this.visible = false;
      this.$emit("reset", this.getConditions(columns));
    },
    onCheckAllChange(e) {
      if (e.target.checked) {
        this.checkedCounts = this.columns.length;
        this.columns.forEach((col) => (col.visible = true));
      } else {
        this.checkedCounts = 0;
        this.columns.forEach((col) => (col.visible = false));
      }
    },
    getConditions(columns) {
      const conditions = {};
      columns
        .filter(
          (item) =>
            item.search.value !== undefined &&
            item.search.value !== "" &&
            item.search.value !== null
        )
        .forEach((col) => {
          conditions[col.dataIndex] = col.search.value;
        });
      return conditions;
    },
  },
};
</script>

<style scoped lang="less">
.action-columns {
  display: inline-block;
  .check-all {
    margin-right: 8px;
  }
  .left,
  .right {
    transform: rotate(-90deg);
  }
  .active {
    color: @primary-color;
  }
}
</style>
