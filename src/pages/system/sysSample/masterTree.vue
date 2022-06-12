<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:500px">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown v-action:sysSampleMasterTreeAddDialog>
            <a-menu
              slot="overlay"
              @click="
                (e) => {
                  handleAdd(e.key, $refs.masterList.data, 'master');
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
            @click="
              handleEdit($refs.masterList.rows, $refs.masterList.data, 'master')
            "
            v-action:sysSampleMasterTreeEditDialog
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys, 'master')"
            v-action:sysSampleMasterTreeDelDialog
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
        :formatConditions="false"
        :showSearch="false"
        @rowClick="
          (e) => {
            masterRowClick(e, { puuid: 'id' });
          }
        "
      >
        <span slot="action" slot-scope="{ text, record, index }">
          <template>
            <a @click="handleEdit(record, $refs.masterList.data, 'master')"
              >编辑</a
            >
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'master')">删除</a>
          </template>
        </span>
      </tree-grid>
    </div>
    <div class="page-common-content">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            ((subQueryParam.name = ''), delete subQueryParam.name),
              $refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('1', $refs.masterList.data, 'sub')"
            >新增</a-button
          >
          <!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="
              handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
            "
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="subQueryParam.name" placeholder="名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <dataGrid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="uuid"
      >
        <span slot="testCombobox" slot-scope="{ text, record }">
          {{ text | testComboboxFilter }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, 'sub')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'sub')">删除</a>
          </template>
        </span>
      </dataGrid>
      <edit-dic-form
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @cancel="handleCancel('sub')"
        @ok="handleOk('sub')"
      />
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
import { TreeGrid, DataGrid } from "@/components";
import editDicForm from "./modal/masterTreeEdit.vue";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import editForm from "./modal/treeEdit.vue";
import { filterDictTextByCache } from "@/components/TopVUI/dict/JDictSelectUtil";

export default {
  mixins: [treeGridMixin],
  components: {
    editDicForm,
    TreeGrid,
    editForm,
    DataGrid,
  },
  data() {
    return {
      key: "1",
      columns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      subColumns: [
        {
          title: "名称",
          dataIndex: "name",
          width: 100,
        },
        {
          title: "年龄",
          dataIndex: "age",
          width: 100,
        },
        {
          title: "性别",
          dataIndex: "sex",
          scopedSlots: {
            customRender: "sex",
          },
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
          title: "排序",
          dataIndex: "testCombobox",
          scopedSlots: {
            customRender: "testCombobox",
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      subQueryParam: {},
      url: {
        fathersUrl: "/system/exampleSingleTreegrid/getListByLevelId",
        expandUrl: "/system/exampleSingleTreegrid/getListByPid",
        masterUpdate: "/system/exampleSingleTreegrid/update",
        masterDelete: "/system/exampleSingleTreegrid/deleteBatch",
        masterSaveRoot: "/system/exampleSingleTreegrid/save",
        masterSave: "/system/exampleSingleTreegrid/save",
        subList: "/system/exampleRightDatagrid/getPageSet",
        subSave: "/system/exampleRightDatagrid/save",
        subUpdate: "/system/exampleRightDatagrid/update",
        subDelete: "/system/exampleRightDatagrid/deleteBatch",
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
  activated() {},
  mounted() {},
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: "女",
        1: "男",
      };
      return sexMap[sex];
    },
    testComboboxFilter(val) {
      if (val === "true") {
        return "可排序";
      } else if (val === "false") {
        return "不可排序";
      }
    },
  },
  methods: {},
};
</script>

<style scope>
.table-operator {
  margin-left: 18px;
}

.ant-table-tbody > tr > td:last-child {
  padding: 16px 16px;
}
</style>
