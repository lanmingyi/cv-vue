<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.table.refresh(true)"
        @reset="
          () => {
            (queryParam = {}), $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd()"
            v-action:configAddDialog
            >新增</a-button
          >
          <!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit()"
            v-action:configEditDialog
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:configDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.name" placeholder="名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <EdataGrid
        ref="table"
        :columns="columns"
        :url="url"
        rowKey="uuid"
        :queryParam="queryParam"
      >
      </EdataGrid>
    </div>
  </div>
</template>
<script>
import { EdataGrid } from "@/components";
import { eDataGridMixin } from "@/mixins/eDataGridMixin";
export default {
  name: "Table",
  mixins: [eDataGridMixin],
  components: { EdataGrid },
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
  data() {
    return {
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          width: 200,
          type: "text",
          option: {
            rules: [{ required: true, message: "必填" }],
          },
          scopedSlots: { customRender: "name" },
        },
        {
          title: "代码",
          dataIndex: "code",
          width: 200,
          type: "text",
          option: {
            rules: [{ required: true, message: "必填" }],
          },
          scopedSlots: { customRender: "code" },
        },
        {
          title: "值",
          dataIndex: "value",
          type: "text",
          // width: 200,
          scopedSlots: { customRender: "value" },
          option: {
            rules: [{ required: true, message: "必填" }],
          },
        },
        {
          title: "描述",
          dataIndex: "description",
          type: "text",
          scopedSlots: {
            customRender: "description",
          },
          width: 200,
        },
        {
          title: "操作",
          width: 150,
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/system/config/getPageSetData",
        save: "/system/config/save",
        update: "/system/config/update",
        deleteBatch: "/system/config/delete",
      },
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
