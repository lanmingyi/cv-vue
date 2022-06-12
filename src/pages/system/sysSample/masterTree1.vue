<template>
  <div>
    <a-row :gutter="10">
      <a-col :md="8" :sm="24">
        <a-card :bordered="false">
          <div
            class="toolbar flex justify-between flex-wrap"
            style="width: 100%;"
          >
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
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleSub('all')"
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
            @rowClick="
              (e, key) => {
                masterRowClick(e, key, { puuid: 'id' });
              }
            "
          >
          </tree-grid>
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-card :bordered="false">
          <tool-bar>
            <template slot="toolBtn" slot-scope="scope">
              <a-button
                class="cu-btn-primary"
                icon="plus"
                @click="handleAdd('1', $refs.masterList.getListData(), 'sub')"
                >新增</a-button
              >
              <a-button
                class="cu-btn-default"
                icon="edit"
                @click="
                  handleEdit('all', $refs.masterList.getListData(), 'sub')
                "
                >编辑</a-button
              >
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleSub('all', 'sub')"
                >删除</a-button
              >
            </template>
          </tool-bar>
          <s-table
            ref="subList"
            size="small"
            :columns="columnsDicItem"
            :data="loadDataDicItem"
            bordered
            :rowSelection="subRowSelection"
            rowKey="uuid"
            showPagination="auto"
            :customRow="subRowClick"
            :rowClassName="rowClassNameDic"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="sex" slot-scope="text">
              {{ text | sexFilter }}
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <a
                  @click="
                    handleEdit(record, $refs.masterList.getListData(), 'sub')
                  "
                  >编辑</a
                >
                <a-divider type="vertical" />
                <a href="javascript:;" @click="handleSub(record, 'sub')"
                  >删除</a
                >
              </template>
            </span>
          </s-table>
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
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
import { STable } from "@/components";
import editDicForm from "./modal/masterTreeEdit.vue";
import { dataTreeMixin } from "@/mixins/dataTreeMixin";
import editForm from "./modal/treeEdit.vue";
const columns = [
  {
    title: "名称",
    align: "left",
    dataIndex: "text",
  },
];
const columnsDicItem = [
  {
    title: "#",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "年龄",
    width: 80,
    dataIndex: "age",
    align: "center",
  },
  {
    title: "性别",
    width: 80,
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
  {
    title: "排序",
    width: 100,
    dataIndex: "testCombobox",
    align: "center",
    scopedSlots: {
      customRender: "testCombobox",
    },
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: "150px",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  mixins: [dataTreeMixin],
  components: {
    STable,
    editDicForm,
    TreeGrid,
    editForm,
  },
  data() {
    return {
      key: "1",
      columns,
      columnsDicItem,
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
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      subSelectedRowKeys: [],
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      url: {
        fathersUrl: "/workflow/testTreegrid/getListByLevelId",
        expandUrl: "/workflow/testTreegrid/getListByPid",
        masterUpdate: "/workflow/testTreegrid/update",
        masterDelete: "/workflow/testTreegrid/deleteBatch",
        masterSaveRoot: "/workflow/testTreegrid/save",
        masterSave: "/workflow/testTreegrid/save",
        subList: "/workflow/testDatagrid/getPageSet",
        subSave: "/workflow/testDatagrid/save",
        subUpdate: "/workflow/testDatagrid/update",
        subDelete: "/workflow/testDatagrid/deleteBatch",
      },
      defaultExpandedRowKeys: [],
      loadDataDicItem: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.subQueryParam
        );
        return this.$post(this.url.subList, requestParameters).then((res) => {
          return res;
        });
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
  computed: {
    subRowSelection() {
      return {
        selectedRowKeys: this.subSelectedRowKeys,
        onChange: this.onSelectChangeSub,
      };
    },
  },
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
  methods: {
    rowClassName(row) {
      return row.uuid === this.masterRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClassNameDic(row) {
      return row.uuid === this.subRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
  },
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
