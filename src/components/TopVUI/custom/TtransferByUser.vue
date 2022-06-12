<!--
 * @Description: 人员穿梭组件
 * @Author: 黄婷
 * @Date: 2021-08-25 10:39:21
 * @LastEditTime: 2021-08-25 17:42:36
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\TtransferByUser.vue
-->
<template>
  <div>
    <a-input @click="showModal" readonly></a-input>
    <t-modal
      title="选择用户"
      :width="1000"
      :visible="visible"
      @ok="handleOK"
      @cancel="
        () => {
          visible = false;
        }
      "
    >
      <a-row :gutter="24">
        <a-col :span="6">
          <z-tree :url="url" :parameter="parameter" @select="select"></z-tree>
        </a-col>
        <a-col :span="18">
          <a-transfer
            :data-source="userList"
            :target-keys="targetKeys"
            :disabled="disabled"
            :show-search="showSearch"
            :filter-option="
              (inputValue, item) => item.userName.indexOf(inputValue) !== -1
            "
            :show-select-all="true"
            @change="onChange"
          >
            <template
              slot="children"
              slot-scope="{
                props: {
                  direction,
                  filteredItems,
                  selectedKeys,
                  disabled: listDisabled,
                },
                on: { itemSelectAll, itemSelect },
              }"
            >
              <a-table
                :row-selection="
                  getRowSelection({
                    disabled: listDisabled,
                    selectedKeys,
                    itemSelectAll,
                    itemSelect,
                  })
                "
                :columns="direction === 'left' ? leftColumns : rightColumns"
                :data-source="filteredItems"
                size="small"
                :style="{ pointerEvents: listDisabled ? 'none' : null }"
                :custom-row="
                  ({ uuid, disabled: itemDisabled }) => ({
                    on: {
                      click: () => {
                        if (itemDisabled || listDisabled) return;
                        itemSelect(uuid, !selectedKeys.includes(uuid));
                      },
                    },
                  })
                "
              />
            </template>
          </a-transfer>
          <!-- <a-switch
            un-checked-children="disabled"
            checked-children="disabled"
            :checked="disabled"
            style="margin-top: 16px"
            @change="triggerDisable"
          />
          <a-switch
            un-checked-children="showSearch"
            checked-children="showSearch"
            :checked="showSearch"
            style="margin-top: 16px"
            @change="triggerShowSearch"
          /> -->
        </a-col>
      </a-row>
    </t-modal>
  </div>
</template>
<script>
import difference from "lodash/difference";
import { ZTree } from "@/components";
const leftTableColumns = [
  {
    dataIndex: "userName",
    title: "姓名",
  },
  {
    dataIndex: "userNameId",
    title: "员工号",
  },
];
const rightTableColumns = [
  {
    dataIndex: "userName",
    title: "姓名",
  },
];

export default {
  data() {
    return {
      userList: [],
      targetKeys: [],
      disabled: false,
      showSearch: true,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      visible: false,
      url: {
        fathersUrl: "/mdata/organization/getListByLevelId",
        expandUrl: "/mdata/organization/getListByPid",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
    };
  },
  component: { ZTree },
  mounted() {
    this.getUserList();
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    select(tree, node) {
      this.getUserList(tree.id);
    },
    getUserList(orgId) {
      this.$post("/mdata/user/getPageSet", { orgId: orgId }).then((res) => {
        res.rows.forEach((res) => {
          res.key = res.uuid;
          res.disabled = false;
        });
        this.userList = res.rows;
      });
    },
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },
    triggerDisable(disabled) {
      this.disabled = disabled;
    },
    triggerShowSearch(showSearch) {
      this.showSearch = showSearch;
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled },
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
    handleOK() {
      console.log(this.targetKeys);
    },
  },
};
</script>
