<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown v-action:categoryDgAddDialog>
            <a-menu
              slot="overlay"
              @click="
                (e) => {
                  handleAdd(e.key, $refs.masterList.data);
                }
              "
            >
              <a-menu-item key="1">
                <a-icon type="plus" /> 新增根节点
              </a-menu-item>
              <a-menu-item key="2">
                <a-icon type="plus" /> 新增子节点
              </a-menu-item>
            </a-menu>
            <a-button class="cu-btn-primary" icon="plus">
              新增
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.masterList.rows, $refs.masterList.data)"
          v-action:categoryDgEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            v-action:categoryDgDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>

      <tree-grid
        ref="masterList"
        :columns="masterColumns"
        :url="url"
        rowKey="uuid"
        :parameter="parameter"
        @rowClick="masterRowClick"
      >
        <span slot="portalDisplay" slot-scope="text">
          {{ text | stateFilter }}
        </span>
        <span slot="action" slot-scope="{ text, record, index }">
          <template>
            <a @click="handleEdit(record, $refs.masterList.data)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">删除</a>
          </template>
        </span>
      </tree-grid>
      <!-- <api /> -->
      <edit-form
        ref="masterModal"
        :type="key"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
      />
    </div>
  </div>
</template>

<script>
import { TreeGrid } from "@/components";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import editForm from "./edit.vue";
export default {
  name: "Table",
  components: { TreeGrid, editForm },
  mixins: [treeGridMixin],
  data() {
    return {
      key: "0",
      masterConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      masterRows: null,
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      masterColumns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
        },
        {
          title: "是否显示首页",
          align: "left",
          dataIndex: "portalDisplay",
          scopedSlots: {
            customRender: "portalDisplay",
          },
        },
        {
          title: "排序",
          dataIndex: "sort",
        },
        {
          title: "操作",
          width: 100,
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      url: {
        fathersUrl: "/system/category/getCategorysByTypeAndLevelId",
        expandUrl: "/system/category/getListByPid",
        masterUpdate: "/system/category/update",
        masterDelete: "/system/category/deleteBatch",
        masterSaveRoot: "/system/category/saveRoot",
        masterSave: "/system/category/save",
      },
      parameter: {
        father: {
          levelId: 1,
          type: "topic",
        },
        children: {
          levelId: 1,
          type: "topic",
        },
      },
    };
  },
  filters: {
    stateFilter(val) {
      const stateMap = {
        0: "否",
        1: "是",
      };
      return stateMap[val.text];
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
