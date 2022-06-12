<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <tool-bar
      @search="$refs.table.refresh(true)"
      @reset="
        () => {
          (this.queryParam = {}), $refs.table.refresh(true);
        }
      "
    >
      <template slot="toolBtn" slot-scope="scope">
        <a-button
          class="cu-btn-primary"
          icon="plus"
          @click="handleAddPost()"
          v-action:userPostAddDialog
          >新增</a-button
        >
        <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          v-action:userPostEditDialog
          >编辑</a-button
        > -->
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleSub($refs.table.selectedRowKeys)"
          v-action:userPostDelDialog
          >删除</a-button
        >
      </template>
    </tool-bar>
    <DataGrid
      ref="table"
      :columns="columns"
      :url="url"
      :queryParam="queryParamObj"
      rowKey="uuid"
      :format-conditions="true"
    >
      <template slot="action" slot-scope="{ text, record }">
        <a style="margin-right: 5px" @click="() => handleEdit(record)">编辑</a>
        <a style="margin-right: 5px" @click="() => handleSub(record)">删除</a>
      </template>
    </DataGrid>
    <!--	新增编辑	 -->
    <edit-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      :treeData="treeData"
      @cancel="handleCancel()"
      @ok="handleOk()"
    />
  </a-card>
</template>

<script>
import { DataGrid } from "@/components";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import editForm from "./postEdit";
export default {
  name: "Table",
  components: { DataGrid, editForm },
  mixins: [dataGridMixin],
  filters: {
    sexStr(val) {
      switch (Number(val)) {
        case 0:
          return "女";
        case 1:
          return "男";
      }
    },
  },
  props: ["queryParam"],
  watch: {
    queryParam: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.queryParamObj = newVal;
      },
    },
  },
  data() {
    return {
      columns: [
        {
          title: "所属机构",
          dataIndex: "company",
        },
        {
          title: "职务",
          dataIndex: "post",
          width: 200,
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 150,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParamObj: {},
      url: {
        getPageSet: "/mdata/sysUserPost/getPageSet",
        save: "/mdata/user/savePosition",
        update: "/mdata/sysUserPost/update",
        deleteBatch: "/mdata/sysUserPost/deleteBatch",
      },
      treeData: [],
    };
  },
  methods: {
    refresh() {
      this.$refs.table.refresh();
    },
    handleAddPost() {
      const form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      if (!this.queryParamObj.userNameId) {
        this.$message.info("请先选择需要操作的数据", 1.5);
      } else {
        this.mdl = {
          userNameId: this.queryParamObj.userNameId,
        };
        this.visible = true;
        this.$refs.createModal.add(this.queryParamObj, this.treeData);
      }
    },
  },
};
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
