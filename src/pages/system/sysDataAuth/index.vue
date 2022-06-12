<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:45%">
      <tool-bar>
        <template slot="toolBtn" slot-scope="scope">
          <a-dropdown v-action:sysDataAuthLeftAddDialog>
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
                  handleEdit(
                    $refs.masterList.rows,
                    $refs.masterList.data,
                    'master'
                  )
                "
                v-action:sysDataAuthLeftEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys, 'master')"
            v-action:sysDataAuthLeftDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <tree-grid
        ref="masterList"
        :columns="masterColumns"
        rowKey="uuid"
        :url="url"
        :parameter="parameter"
        :formatConditions="false"
        :showSearch="false"
        @rowClick="
          (e) => {
            masterRowClick(e, { pid: 'id' });
          }
        "
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, $refs.masterList.data, 'master')"
              >编辑</a
            >
          </template>
        </span>
      </tree-grid>
    </div>
    <div class="page-common-content">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            (subQueryParam = {}), $refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('1', $refs.masterList.data, 'sub')"
            v-action:sysDataAuthRightAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="
                  handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
                "
                v-action:sysDataAuthRightEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
            v-action:sysDataAuthRightDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <DataGrid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, $refs.masterList.data, 'sub')"
              >编辑</a
            >
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'sub')">删除</a>
          </template>
        </span>
      </DataGrid>
      <subForm
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @cancel="handleCancel('sub')"
        @ok="handleOk('sub')"
      />
      <masterForm
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
import subForm from "./subEdit";
import { treeGridMixin } from "@/mixins/treeGridMixin";
import masterForm from "./masterEdit";

export default {
  mixins: [treeGridMixin],
  components: {
    subForm,
    TreeGrid,
    masterForm,
    DataGrid,
  },
  data() {
    return {
      key: "1",
      masterColumns: [
        {
          title: "名称",
          align: "left",
          dataIndex: "text",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 80,
          scopedSlots: { customRender: "action" },
        },
      ],
      subColumns: [
        {
          title: "规则名称",
          dataIndex: "ruleName",
          align: "left",
        },
        {
          title: "接口地址",
          dataIndex: "ruleHref",
        },
        {
          title: "SQL语句",
          dataIndex: "ruleSql",
        },
        {
          title: "排序",
          dataIndex: "ruleSort",
        },
        {
          title: "备注",
          dataIndex: "ruleRemark",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 150,
          scopedSlots: { customRender: "action" },
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
        fathersUrl: "/system/sysDataAuthGroup/getListByPid",
        expandUrl: "/system/sysDataAuthGroup/getListByPid",
        masterUpdate: "/system/sysDataAuthGroup/update",
        masterDelete: "/system/sysDataAuthGroup/deleteBatch",
        masterSaveRoot: "/system/sysDataAuthGroup/saveRoot",
        masterSave: "/system/sysDataAuthGroup/save",
        subList: "/system/sysDataAuth/getPageSet",
        subSave: "/system/sysDataAuth/save",
        subUpdate: "/system/sysDataAuth/update",
        subDelete: "/system/sysDataAuth/deleteBatch",
      },
      parameter: {
        father: {
          pid: 1,
        },
        children: {},
      },
    };
  },
  activated() {},
  mounted() {},
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
