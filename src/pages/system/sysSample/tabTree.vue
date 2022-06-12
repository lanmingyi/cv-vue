<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:500px">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-dropdown v-action:sysSampleTabTreeAddDialog>
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
            v-action:sysSampleTabTreeEditDialog
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            v-action:sysSampleTabTreeDelDialog
            >删除
          </a-button>
        </div>
      </div>
      <tree-grid
        ref="masterList"
        :columns="columns"
        rowKey="uuid"
        :url="url"
        :parameter="parameter"
        @rowClick="masterRowClick"
      >
        <template slot="portalDisplay" slot-scope="{ text }">
          {{ text === 1 ? "是" : "否" }}
        </template>

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
    <a-tabs class="page-common-content" default-active-key="1" @change="changTabs">
      <a-tab-pane key="1" tab="子表一">
        <child-one ref="childOne"></child-one>
      </a-tab-pane>
      <a-tab-pane key="2" tab="子表二">
        <child-two ref="childTwo"></child-two>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { TreeGrid } from "@/components";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import editForm from "./modal/treeEdit.vue";
import childOne from "./modal/childFive.vue";
import childTwo from "./modal/childSix.vue";
export default {
  name: "Table",
  mixins: [treeGridMixin],
  components: {
    TreeGrid,
    editForm,
    childOne,
    childTwo,
  },
  data() {
    return {
      key: "0",
      masterConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      columns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
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
        fathersUrl: "/system/exampleSingleTreegrid/getListByLevelId",
        expandUrl: "/system/exampleSingleTreegrid/getListByPid",
        masterUpdate: "/system/exampleSingleTreegrid/update",
        masterDelete: "/system/exampleSingleTreegrid/deleteBatch",
        masterSaveRoot: "/system/exampleSingleTreegrid/save",
        masterSave: "/system/exampleSingleTreegrid/save",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      childOneQueryParam: {},
      childTwoQueryParam: {},
      tabIndex: 1,
    };
  },
  filters: {
    sexFilter(sex) {
      switch (sex) {
        case "male":
          return "男";
        case "female":
          return "女";
        case "unknown":
          return "未知";
      }
    },
  },
  created() {},
  methods: {
    masterRowClick(record, index) {
			this.$refs.masterList.rows = record
      this.childOneQueryParam.puuid = record.id;
      this.childTwoQueryParam.puuid = record.id;
      this.getListFilter(this.tabIndex);
    },
    changTabs(key) {
      this.tabIndex = Number(key);
      this.$nextTick(() => {
        this.getListFilter(this.tabIndex);
      });
    },
    getListFilter(key) {
      if (key === 1) {
        this.$refs.childOne.treeData = this.$refs.masterList.data;
        this.$refs.childOne.subQueryParam = this.childOneQueryParam;
        this.$refs.childOne.refresh(this.$refs.masterList.rows); // 设置刷新子表
      } else if (key === 2 && this.$refs.childTwo) {
        this.$refs.childTwo.treeData = this.$refs.masterList.data;
        this.$refs.childTwo.subQueryParam = this.childTwoQueryParam;
        this.$refs.childTwo.refresh(this.$refs.masterList.rows); // 设置刷新子表
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
