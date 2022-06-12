<template>
  <a-card :bordered="false">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="案例一">
        <s-table
          ref="table"
          size="small"
          :columns="columns"
          :data="loadData"
          bordered
          :rowSelection="rowSelection"
          rowKey="uuid"
          showPagination="auto"
          :scroll="{ x: 1500 }"
          :pageSize="10"
          @rowClick="rowClick"
          :rowClassName="rowClassName"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="rate" slot-scope="text">
            <a-tooltip :title="text">
              <a-progress :percent="text" />
            </a-tooltip>
          </span>
          <template slot="footer">
            <a-table
              size="small"
              :columns="columns"
              :dataSource="footData"
              bordered
              :show-header="false"
              :rowSelection="rowSelection"
              rowKey="uuid"
              :scroll="{ x: 1500 }"
              :pagination="{ hideOnSinglePage: true }"
            ></a-table>
          </template>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleSub(record)">删除</a>
            </template>
          </span>
        </s-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="案例二" force-render>
        <a-table
          rowKey="uuid"
          bordered
          :columns="columns"
          :pageSize="10"
          :dataSource="dataSource"
          @change="handleTableChange"
          :rowSelection="rowSelectionDic"
          :customRow="rowClickDic"
          :rowClassName="rowClassNameDic"
        >
          <!-- :pagination="pagination" -->
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { dataListMixin } from "@/mixins/dataListMixin";
import moment from "moment";
import { STable, Ellipsis } from "@/components";

const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: { customRender: "serial" },
    customRender: function(text, r, index) {
      return text !== "合计" ? parseInt(index) + 1 : text;
    },
  },
  {
    title: "商品名称",
    dataIndex: "name",
  },
  {
    title: "规格型号",
    width: 500,
    dataIndex: "spec",
  },
  {
    title: "商品编号",
    align: "center",
    dataIndex: "code",
    sorter: true,
  },
  {
    title: "销售单价",
    align: "center",
    dataIndex: "sale_price",
    sorter: true,
  },
  {
    title: "进度条",
    align: "center",
    dataIndex: "rate",
    sorter: true,
    scopedSlots: { customRender: "rate" },
  },
];
export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    Ellipsis,
  },
  data() {
    this.columns = columns;
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      pagination: {},
      queryParam: {},
      footData: [],
      dataSource: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(
          "https://mock.ewsd.cn/mock/5f3cd023b2e36507fc711c26/TopVUI/getListViewfooter",
          requestParameters
        ).then((res) => {
          this.footData = res.footer;
          return res;
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowKeysDic: [],
      selectedRowsDic: [],
      uuid: "",
      uuids: "",
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
      };
    },
    rowSelectionDic() {
      return {
        onChange: this.onSelectChangeDic,
      };
    },
  },
  mounted() {
    this.fetch(this.queryParam);
  },
  methods: {
    // 获取表格数据
    fetch(params) {
      this.$post(
        "https://mock.ewsd.cn/mock/5f3cd023b2e36507fc711c26/TopVUI/getListViewfooter",
        params
      ).then((res) => {
        const pager = { ...this.pagination };
        pager.total = res.totalCount;
        this.dataSource = res.rows;
        this.cacheData = res.rows;
        this.pagination = pager;
        this.tableAddTotalRow(this.columns, this.dataSource);
      });
    },
    // 分页操作
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    /** 表格增加合计行 */
    tableAddTotalRow(columns, dataSource) {
      const numKey = "rowIndex";
      const totalRow = { [numKey]: "合计" };
      columns.forEach((column) => {
        const { key, dataIndex } = column;
        if (![key, dataIndex].includes(numKey)) {
          let total = 0;
          var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
          dataSource.forEach((data) => {
            if (reg.test(data[dataIndex])) {
              total += Number.parseInt(Math.ceil(data[dataIndex]));
            }
          });
          if (!Number(total)) {
            total = "-";
          }
          totalRow[dataIndex] = total;
        }
      });
      dataSource.push(totalRow);
    },
    callback(key) {
      console.log(key);
    },
    // handleFooterShow (data) {
    //   return (
    //     <a-table
    //       rowSelection={this.rowSelection}
    //       rowKey={Math.random}
    //       bordered={false}
    //       pagination={false}
    //       columns={this.columns}
    //       dataSource={this.footData}
    //       showHeader={false}
    //       size="small"
    //     ></a-table>
    //   )
    // },
    rowClassName(row) {
      return row.uuid === this.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      const that = this;
      that.info = record;
      that.uuid = record.uuid;
      that.rowClassName(record);
    },
    rowClassNameDic(row) {
      return row.uuid === this.uuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClickDic(record) {
      return {
        on: {
          click: () => {
            this.uuids = record.uuid;
          },
        },
      };
    },
    handleAdd() {
      this.mdl = null;
      this.visible = true;
    },
    handleEdit(record) {
      if (record === "1") {
        if (this.info) {
          this.visible = true;
          this.mdl = this.info;
        } else {
          this.$message.info("请先选中需要修改的数据");
          return true;
        }
      } else {
        this.visible = true;
        this.mdl = { ...record };
      }
    },
    // handleOk () {
    //   const form = this.$refs.createModal.form
    //   this.confirmLoading = true
    //   form.validateFields((errors, values) => {
    //     if (!errors) {
    //       console.log('values', values)
    //       if (values.uuid) {
    //         // 修改 e.g.
    //         updateUser(values).then((res) => {
    //           console.log(res)
    //           if (res.statusCode === 200) {
    //             this.visible = false
    //             this.confirmLoading = false
    //             // 重置表单数据
    //             form.resetFields()
    //             // 刷新表格
    //             this.info = ''
    //             this.$refs.table.refresh()
    //             this.$message.info(res.message)
    //           } else {
    //             this.$message.error(res.message)
    //           }
    //         })
    //       } else {
    //         // 新增
    //         addUser(values).then((res) => {
    //           console.log(res)
    //           if (res.statusCode === 200) {
    //             this.visible = false
    //             this.confirmLoading = false
    //             // 重置表单数据
    //             form.resetFields()
    //             // 刷新表格
    //             this.$refs.table.refresh()
    //             this.$message.info('新增成功')
    //           } else {
    //             this.$message.error('新增失败')
    //           }
    //         })
    //       }
    //     } else {
    //       this.confirmLoading = false
    //     }
    //   })
    // },
    // handleCancel () {
    //   this.visible = false
    //   const form = this.$refs.createModal.form
    //   form.resetFields() // 清理表单数据（可不做）
    // },
    // handleSub (record) {
    //   const that = this
    //   if (record === 'all') {
    //     if (that.selectedRowKeys.length === 0) {
    //       that.$message.warn('请先勾选需要的删除的数据')
    //       return true
    //     }
    //   } else {
    //     that.uuids = record.uuid
    //   }
    //   that.$confirm({
    //     title: '警告',
    //     content: `确定要执行该操作吗?`,
    //     okText: '删除',
    //     okType: 'danger',
    //     cancelText: '取消',
    //     onOk () {
    //       console.log('OK')
    //       // 在这里调用删除接口
    //       deleteUser({ uuid: that.uuids }).then((res) => {
    //         console.log(res)
    //         if (res.statusCode === 200) {
    //           that.$message.success(res.message)
    //           that.$refs.table.refresh()
    //           that.uuids = ''
    //         } else {
    //           that.$message.info(res.message)
    //         }
    //       })
    //       return new Promise((resolve, reject) => {
    //         setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
    //       }).catch(() => console.log('Oops errors!'))
    //     },
    //     onCancel () {
    //       console.log('Cancel')
    //     }
    //   })
    // },
    onSelectChange(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.uuids = e.uuid;
        } else {
          this.uuids = this.uuids + "," + e.uuid;
        }
      });
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      };
    },
  },
};
</script>

<style lang="less"></style>
