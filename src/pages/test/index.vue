<template>
  <div class="table">
    <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
      <div class="table-operator">
        <a-dropdown>
          <a-menu
            slot="overlay"
            @click="
              (e) => {
                handleAdd(e.key, $refs.masterList.getListData());
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
        <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit('all', $refs.masterList.getListData())"
          >编辑</a-button
        >
        <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')"
          >删除</a-button
        >
      </div>
    </div>
    <tree-grid
      ref="masterList"
      :columns="columns"
      rowKey="uuid"
      :url="url"
      :parameter="parameter"
      @onSelectChange="onSelectChangeMaster"
      @rowClick="masterRowClick"
    >
      <template slot="portalDisplay" slot-scope="{ text }">
        {{ text === 1 ? "是" : "否" }}
      </template>
      <span slot="sex" slot-scope="text">
        {{ text | sexFilter }}
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
</template>

<script>
import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
import { dataTreeMixin } from "@/mixins/dataTreeMixin";
import editForm from "./edit.vue";
export default {
  name: "Table",
  mixins: [dataTreeMixin],
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
          title: "姓名",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "年龄",
          dataIndex: "age",
          align: "center",
        },
        {
          title: "性别",
          dataIndex: "sex",
          align: "center",
          scopedSlots: {
            customRender: "sex",
          },
        },
        {
          title: "生日",
          dataIndex: "testDate",
          align: "center",
        },
        {
          title: "注册时间",
          dataIndex: "testDatetime",
          align: "center",
        },
      ],
      url: {
        fathersUrl: "/workflow/testTreegrid/getListByLevelId",
        expandUrl: "/workflow/testTreegrid/getListByPid",
        masterUpdate: "/workflow/testTreegrid/update",
        masterDelete: "/workflow/testTreegrid/deleteBatch",
        masterSaveRoot: "/workflow/testTreegrid/save",
        masterSave: "/workflow/testTreegrid/save",
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
    sexFilter(sex) {
      const sexMap = {
        0: "女",
        1: "男",
      };
      return sexMap[sex];
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
