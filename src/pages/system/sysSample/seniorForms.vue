<template>
  <a-card :bordered="false">
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
          v-action:sysSampleSeniorFormsAddDialog
          >新增</a-button
        >
        <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit()"
          v-action:sysSampleSeniorFormsEditDialog
          >编辑</a-button
        >
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleSub($refs.table.selectedRowKeys)"
          v-action:sysSampleSeniorFormsDelDialog
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
      <template slot="sex" slot-scope="{ text }">
        {{ text | sexStr }}
      </template>
    </EdataGrid>
  </a-card>
</template>
<script>
import { EdataGrid } from "@/components";
import { eDataGridMixin } from "@/mixins/eDataGridMixin";
export default {
  name: "Table",
  mixins: [eDataGridMixin],
  components: {
    EdataGrid,
  },
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
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          width: 100,
          type: "text",
          option: {
            rules: [
              {
                required: true,
                message: "必填",
              },
            ],
          },
          scopedSlots: {
            customRender: "name",
          },
        },
        {
          title: "年龄",
          dataIndex: "age",
          width: 100,
          type: "text",
          option: {
            rules: [
              {
                required: true,
                message: "必填",
              },
            ],
          },
          scopedSlots: {
            customRender: "age",
          },
        },
        {
          title: "性别",
          dataIndex: "sex",
          slots: {
            title: "性别",
          },
          type: "select",
          width: 100,
          scopedSlots: {
            customRender: "sex",
          },
          option: {
            modeType: "default",
            dictCode: "sex",
            rules: [
              {
                required: true,
                message: "必填",
              },
            ],
            dataType: "code", //static;dynamic
            list: [
              {
                label: "女",
                value: "0",
              },
              {
                label: "男",
                value: "1",
              },
            ],
          },
        },
        {
          title: "生日",
          width: 100,
          dataIndex: "testDate",
        },
        {
          title: "时间",
          width: 100,
          dataIndex: "testDatetime",
        },
        {
          title: "排序",
          width: 100,
          dataIndex: "testCombobox",
          customRender: (text) => {
            return text == true ? "可排序" : "不可排序";
          },
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
        fathersUrl: "/workflow/testTreegrid/getListByLevelId",
        expandUrl: "/workflow/testTreegrid/getListByPid",
        getPageSet: "/system/testDemo/getPageSet",
        save: "/system/testDemo/save",
        update: "/system/testDemo/update",
        deleteBatch: "/system/testDemo/deleteBatch",
      },
    };
  },
  methods: {
    handleDesign() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
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
