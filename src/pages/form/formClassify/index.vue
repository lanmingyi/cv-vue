<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown v-action:formClassifyAddDialog>
            <a-menu
              slot="overlay"
              @click="
                (e) => {
                  handleAdd(e.key, $refs.masterList.data);
                }
              "
            >
              <a-menu-item key="1">
                <a-icon type="plus" /> 新增根机构
              </a-menu-item>
              <a-menu-item key="2">
                <a-icon type="plus" /> 新增子机构
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
          v-action:formClassifyEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            v-action:formClassifyDelDialog
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
        <span slot="action" slot-scope="{ text, record, index }">
          <template>
            <a @click="handleEdit(record, $refs.masterList.data)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">删除</a>
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
import editForm from "./edit";
export default {
  name: "Table",
  components: { TreeGrid, editForm },
  mixins: [treeGridMixin],
  data() {
    return {
      masterColumns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
        },
        {
          title: "备注",
          dataIndex: "remark",
          align: "center",
        },
        {
          title: "排序",
          dataIndex: "sort",
          align: "center",
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
        fathersUrl: "/form/formModule/getListByLevelId",
        expandUrl: "/form/formModule/getListByPid",
        masterUpdate: "/form/formModule/update",
        masterDelete: "/form/formModule/deleteBatch",
        masterSaveRoot: "/form/formModule/saveRoot",
        masterSave: "/form/formModule/save",
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

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
