<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown v-action:sysSampleTreeGridAddDialog>
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
            v-action:sysSampleTreeGridEditDialog
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            v-action:sysSampleTreeGridDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <TreeGrid
        ref="masterList"
        :columns="masterColumns"
        :url="url"
        rowKey="uuid"
        :parameter="parameter"
        @rowClick="masterRowClick"
      >
        <template slot="sex" slot-scope="{ text }">
          {{ text | sexStr }}
        </template>
        <span slot="action" slot-scope="{ text, record, index }">
          <template>
            <a
              @click="handleEdit(record, $refs.masterList.data)"
              v-action:sysSampleTreeGridEditDialog
              >编辑</a
            >
            <a-divider type="vertical" v-action:sysSampleTreeGridDelDialog />
            <a @click="handleSub(record)" v-action:sysSampleTreeGridDelDialog
              >删除</a
            >
          </template>
        </span>
      </TreeGrid>
      <!--	新增编辑	 -->
      <edit-form
        :type="key"
        ref="masterModal"
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
import editForm from "./modal/treeEdit";
export default {
  name: "Table",
  components: { TreeGrid, editForm },
  mixins: [treeGridMixin],
  filters: {
    sexStr(val) {
      switch (val) {
        case "male":
          return "男";
        case "female":
          return "女";
        case "unknown":
          return "未知";
      }
    },
  },
  data() {
    return {
      masterColumns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
        },
        {
          title: "姓名",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "年龄",
          dataIndex: "age",
          dataType: "input",
          width: 100,
        },
        {
          title: "性别",
          dataIndex: "sex",
          scopedSlots: { customRender: "sex" },
        },
        {
          title: "生日",
          dataIndex: "testDate",
        },
        {
          title: "时间",
          dataIndex: "testDatetime",
        },
        {
          title: "操作",
          width: 100,
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      masterVisible: false,
      masterConfirmLoading: false,
      masterMdl: null,
      // 查询参数
      masterQueryParam: {},
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
      key: "1",
    };
  },
  methods: {},
};
</script>

<style scoped lang="less"></style>
