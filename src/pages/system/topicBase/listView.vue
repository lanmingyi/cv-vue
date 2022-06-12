<template>
  <t-modal
    :visible="visible"
    :width="1000"
    :title="queryParam.title"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    :confirmLoading="loading"
    @ok="onClose"
    @cancel="onClose"
    :footer="null"
  >
    <a-table
      :columns="columns"
      :data-source="dataSource"
      bordered
      :pagination="pagination"
      bordered
      rowKey="uuid"
      showPagination="auto"
      class="margin-bottom"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="title" slot-scope="text, record">
        <ellipsis :length="42" style="color: #074e9e;">{{ record }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleViewDetail(record)">详情</a>
        </template>
      </span>
    </a-table>
    <detail-form
      ref="detailModal"
      @cancel="handleCancelDetail()"
      :visible="visibleDetail"
    />
  </t-modal>
</template>
<script>
import detailForm from "./detail.vue";
import { STable, Ellipsis } from "@/components";

const columns = [
  {
    title: "#",
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "left",
  },
  {
    title: "发布时间",
    dataIndex: "createTime",
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
  // mixins: [dataTreeMixin],
  components: {
    detailForm,
    Ellipsis,
    STable,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
    queryParam: {
      type: Object,
    },
  },
  data() {
    return {
      queryParamDicItem: {},
      mdl: null,
      data: [],
      columns,
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      url: {
        getTopicBaseList: "/system/topicBase/getPageSet",
      },
      fullscreen: false,
      visibleDetail: false,
      dataSource: [],
    };
  },
  mounted() {
    // this.fetch(this.queryParamDicItem)
  },
  methods: {
    fetch(params) {
      this.$post(this.url.getTopicBaseList, params).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        this.pagination = pager;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    onShowSizeChange(current, pageSize) {
      const pager = { ...this.pagination };
      pager.pageSize = pageSize;
      this.pagination = pager;
      this.fetch({
        pageSize: pageSize,
        pageNo: current,
        id: this.queryParam.id,
        title: this.queryParam.title,
      });
    },
    refreshList(e) {
      this.queryParamDicItem = e;
      this.fetch(this.queryParamDicItem);
    },
    // 查看详情
    handleViewDetail(e) {
      this.visibleDetail = true;
      this.$refs.detailModal.onLoadData(e);
    },
    handleCancelDetail() {
      this.visibleDetail = false;
    },
    onClose() {
      this.$emit("onClose");
      this.$nextTick(() => {
        setTimeout(() => {
          this.dataSource = [];
        }, 20);
      });
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
  /* color: green; */
  /* color: var(--color); */
}
</style>
