<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown v-action:codeItemAddDialog>
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
          v-action:codeItemEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys)"
            v-action:codeItemDelDialog
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
        <span slot="action" slot-scope="{ record }">
          <template>
            <a
              @click="handleEdit(record, $refs.masterList.data)"
              v-action:codeItemEditDialog
              >编辑</a
            >
            <a-divider type="vertical" />
            <a @click="handleSub(record)" v-action:codeItemDelDialog>删除</a>
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
import editForm from "./treeEdit";
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
          ellipsis: true,
          width: 200,
        },
        {
          title: "体系代码",
          dataIndex: "codeSetId",
          ellipsis: true,
        },
        {
          title: "编号",
          dataIndex: "id",
          ellipsis: true,
          width: 200,
        },
        {
          title: "父级编号",
          dataIndex: "pid",
          ellipsis: true,
          width: 200,
        },
        {
          title: "层级",
          dataIndex: "levelId",
          ellipsis: true,
        },
        {
          title: "代码",
          dataIndex: "code",
          ellipsis: true,
        },
        {
          title: "备注",
          dataIndex: "remark",
          ellipsis: true,
        },
        {
          title: "操作",
          width: 150,
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
        fathersUrl: "/system/codeItem/getListByLevelId",
        expandUrl: "/system/codeItem/getListByPid",
        masterUpdate: "/system/codeItem/update",
        masterDelete: "/system/codeItem/delete",
        masterSaveRoot: "/system/codeItem/saveRoot",
        masterSave: "/system/codeItem/save",
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
