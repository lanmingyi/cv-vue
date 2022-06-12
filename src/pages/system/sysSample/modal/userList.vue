<template>
  <t-modal
    title="新增编辑"
    :width="840"
    :visible="visible"
    :confirmLoading="loading"
    @ok="ok()"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.userName" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号码">
                <a-input-number
                  v-model="queryParam.cellphone"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button
                  class="cu-btn-primary"
                  @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  class="cu-btn-filter"
                  @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="table"
        size="small"
        :columns="columns"
        :data="loadData"
        bordered
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </a-card>
  </t-modal>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";

const columns = [
  {
    title: "#",
    align: "center",
    scopedSlots: { customRender: "serial" },
  },
  {
    title: "用户名称",
    dataIndex: "userName",
  },
  {
    title: "手机",
    dataIndex: "cellphone",
    sorter: true,
  },
  {
    title: "电子邮箱",
    dataIndex: "email",
    sorter: true,
  },
  {
    title: "年龄",
    dataIndex: "age",
    sorter: true,
  },
  {
    title: "备注",
    dataIndex: "remark",
    sorter: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "150px",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "TableList",
  components: {
    STable,
    Ellipsis,
  },
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        // onSelectAll: this.onSelectAll,
        type: "radio",
      };
    },
  },
  data() {
    this.columns = columns;
    return {
      visible: false,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        pageSize: 10,
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return this.$post(
          "/mdata/user/getPageSet",
          Object.assign(parameter, this.queryParam)
        ).then((res) => {
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      optionAlertShow: false,
      selectedRowsList: [],
    };
  },
  created() {},
  methods: {
    // 解决分页全选 获取选中的数据
    // onSelectAll (selected, selectedRows, changeRows) {
    //   this.selectedRowsList = this.selectedRowsList.concat(selectedRows)
    //   if (!selected) {
    //     let selectionsRows = []
    //     this.selectedRowsList.forEach((e, index) => {
    //       if (JSON.stringify(changeRows).indexOf(JSON.stringify(e.uuid)) === -1) {
    //         selectionsRows.push(e)
    //       }
    //     })
    //     this.selectedRowsList = selectionsRows
    //   }
    // },
    show() {
      this.visible = true;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      };
    },
    ok() {
      this.$emit("ok", this.selectedRows);
    },
  },
};
</script>
