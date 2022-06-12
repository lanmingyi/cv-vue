<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="
              (e) => {
                handleAdd('2', $refs.masterList.data);
              }
            "
            v-action:categoryAddDialog
            >新增</a-button
          >
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.masterList.rows, $refs.masterList.data)"
          v-action:categoryEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            v-action:categoryDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>

      <tree-grid
        ref="masterList"
        :columns="columns"
        rowKey="uuid"
        :url="url"
        :parameter="parameter"
        @rowClick="masterRowClick"
      >
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
  mixins: [treeGridMixin],
  components: {
    TreeGrid,
    editForm,
  },
  data() {
    return {
      key: "0",
      masterConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      masterRows: null,
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      columns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
        },
        {
          title: "创建时间",
          align: "left",
          dataIndex: "createTime",
          sorter: true,
        },
        {
          title: "创建者",
          align: "left",
          dataIndex: "creator",
        },
        {
          title: "排序",
          dataIndex: "sort",
          width: 80,
          sorter: true,
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
        fathersUrl: "/system/channel/getChannelsById",
        expandUrl: "/system/channel/getChannelsByPid",
        masterUpdate: "/system/channel/updateChannelData",
        masterDelete: "/system/channel/deleteBatch",
        masterSaveRoot: "/system/channel/saveRoot",
        masterSave: "/system/channel/saveChildren",
      },
      parameter: {
        father: { levelId: 1 },
        children: {},
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
  computed: {
    disabled() {
      if (!this.masterSelectedRows.find((item) => item.levelId == 1))
        return false;
      else return true;
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="less">
// .table {
// 	background-color: @base-bg-color;
// 	padding: calc();
// }
</style>
