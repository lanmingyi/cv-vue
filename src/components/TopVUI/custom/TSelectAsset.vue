<template>
  <t-modal
    centered
    title="资产选择"
    :width="1000"
    :height="800"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    @cancel="close"
    cancelText="关闭"
  >
    <template>
      <!-- 查询区域 -->
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-page-search-wrapper">
          <!-- <a-form layout="inline">
						<div class="table-operator flex justify-between flex-wrap">
							<a-form-item>
								<a-tree-select style="width: 200px;" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData"
								 placeholder="组织机构" :showSearch="true" :load-data="onLoadData" v-model="queryParam.orgName" @select="select" />
							</a-form-item>
							<a-form-item label="">
								<a-input v-model="queryParam.name" placeholder="姓名" />
							</a-form-item>
							<div class="table-page-search-submitButtons flex">
								<a-button class="cu-btn-primary" @click="$refs.table.refresh(true)">查询</a-button>
								<a-button class="cu-btn-filter" @click="refreshParam()">重置</a-button>
							</div>
						</div>
					</a-form> -->
        </div>
      </div>
      <a-row :gutter="24">
        <a-col :span="24">
          <s-table
            bordered
            ref="table"
            :columns="innerColumns"
            :data="loadData"
            rowKey="uuid"
            :scroll="{ y: 500 }"
            :pageSize="10"
            :rowSelection="{
              selectedRowKeys,
              onChange: onSelectChange,
              onSelectAll: onSelectAll,
              getCheckboxProps: getCheckboxProps,
              type: 'radio',
            }"
            @rowClick="customRowFn"
          >
          </s-table>
        </a-col>
        <!-- <a-col :span="8">
					<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
						<div class="table-page-search-wrapper">
							<a-form layout="inline">
								<div class="flex justify-between flex-wrap">
								</div>
							</a-form>
						</div>
					</div>
					<a-table rowKey="uuid" bordered v-bind="selectedTable">
						<span slot="action" slot-scope="text, record, index">
							<a @click="handleDeleteSelected(record, index)">删除</a>
						</span>
					</a-table>
				</a-col> -->
      </a-row>
    </template>
  </t-modal>
</template>

<script>
import { STable } from "@/components";
import { cloneObject } from "@/utils/util";

const columns = [
  {
    title: "SN码",
    dataIndex: "snCode",
    width: 200,
  },
  {
    title: "资产类别",
    dataIndex: "assetClass",
    align: "left",
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    align: "left",
    width: 150,
  },
  {
    title: "资产编号",
    dataIndex: "assetCode",
    align: "left",
    width: 200,
  },
  {
    title: "规格型号",
    dataIndex: "specificationModel",
    align: "left",
  },
];
export default {
  name: "TSelectAsset",
  components: {
    STable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: "",
    },
    // 查询条件Code
    queryParamCode: {
      type: String,
      default: null,
    },
    // 查询条件文字
    queryParamText: {
      type: String,
      default: null,
    },
    // 过长裁剪长度，设置为 -1 代表不裁剪
    ellipsisLength: {
      type: Number,
      default: 12,
    },
    paramList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.columns = columns;
    return {
      innerValue: [],
      selectedRowKeys: [],
      // 已选择列表
      selectedTable: {
        pagination: false,
        scroll: {
          y: 500,
        },
        columns: [
          {
            ...this.columns[0],
            width: this.columns[0].widthRight || this.columns[0].width,
          },
          {
            title: "操作",
            dataIndex: "action",
            align: "center",
            width: 60,
            scopedSlots: {
              customRender: "action",
            },
          },
        ],
        dataSource: [],
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.masterList, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      url: {
        masterList: "/office/oaAssetManage/getFreeStatus",
        getOrgTree: "/mdata/organization/getListByLevelId?levelId=1",
        getTreeListByPid: "/mdata/organization/getListByPid",
      },
      options: [],
      dataSourceMap: {},
      queryParam: {
        pageNo: 1,
        pageSize: 10,
      },
      treeData: [],
    };
  },
  computed: {
    // 表头
    innerColumns() {
      const columns = cloneObject(this.columns);
      columns.forEach((column) => {
        // 给所有的列加上过长裁剪
        if (this.ellipsisLength !== -1) {
          // column.customRender = (text) => this.renderEllipsis(text)
        }
      });
      return columns;
    },
  },
  created() {
    this.$post(this.url.getOrgTree).then((res) => {
      this.treeData = res;
      this.treeData.forEach((e, index) => {
        this.treeData[index].title = e.text;
        this.treeData[index].label = e.text;
        this.treeData[index].index = index;
        this.treeData[index].value = e.id;
        this.treeData[index].key = e.id;
        this.treeData[index].levelId = e.levelId;
      });
    });
  },
  mounted() {},

  methods: {
    refreshParam() {
      this.queryParam = {};
    },
    select(value, node, extra) {
      this.$nextTick(() => {
        this.queryParam.orgId = node.dataRef.id;
        this.queryParam.orgName = node.dataRef.text;
      });
    },
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.$post(this.url.getTreeListByPid, {
          pid: treeNode.dataRef.id,
        })
          .then((res) => {
            const treeData = res;
            treeData.forEach((e, index) => {
              treeData[index].title = e.text;
              treeData[index].label = e.text;
              treeData[index].index = index;
              treeData[index].value = e.id;
              treeData[index].levelId = e.levelId;
              treeData[index].key = e.id;
            });
            treeNode.dataRef.children = treeData;
            this.treeData = [...this.treeData];
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    /** 关闭弹窗 */
    close() {
      this.$emit("close");
      this.selectedRowKeys = [];
      this.selectedTable.dataSource = [];
    },
    refreshList(e) {
      this.queryParam = e || {};
      if (this.$refs.table) this.$refs.table.refresh();
    },

    /** 完成选择 */
    handleOk() {
      // console.log('this.selectedRowKeys', this.selectedRowKeys)
      this.$emit("input", this.selectedRowKeys);
      this.$emit("changeData", this.selectedTable.dataSource);
      this.close();
    },

    /** 删除已选择的 */
    handleDeleteSelected(record, index) {
      this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record.uuid), 1);
      this.selectedTable.dataSource.splice(index, 1);
    },
    customRowFn(record) {
      if (this.selectedRowKeys) {
        this.selectedRowKeys = [];
        this.selectedTable.dataSource = [];
        this.selectedRowKeys.push(record.uuid);
        this.selectedTable.dataSource.push(record);
      } else {
        this.selectedRowKeys.push(record.uuid);
        this.selectedTable.dataSource.push(record);
      }
      // const type = this.paramList.some(item => item.uuid === record.uuid)
      // console.log("type",type, this.multiple)
      // if (!type) {
      // 	const key = record.uuid
      // 	if (!this.multiple) {
      // 		this.selectedRowKeys = [key]
      // 		this.selectedTable.dataSource = [record]
      // 	} else {
      // 		const index = this.selectedRowKeys.indexOf(key)
      // 		if (index === -1) {
      // 			this.selectedRowKeys.push(key)
      // 			this.selectedTable.dataSource.push(record)
      // 		} else {
      // 			this.handleDeleteSelected(record, index)
      // 		}
      // 		console.log("this.selectedTable.dataSource",this.selectedTable.dataSource, this.selectedRowKeys)
      // 	}
      // } else {
      // 	this.$message.info('已存在该数据')
      // }
    },
    onSelectChange(selectedRowKeys, selectedRow) {
      this.selectedTable.dataSource = selectedRow.reduce(
        (all, next) =>
          all.some((item) => item["uuid"] == next["uuid"])
            ? all
            : [...all, next],
        []
      );

      this.selectedRowKeys = selectedRowKeys.reduce(
        (all, next) =>
          all.some((item) => item == next) ? all : [...all, next],
        []
      );
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (!selected) {
        const selectionsRows = [];
        const dataSource = [];
        this.selectedRowKeys.forEach((e, index) => {
          if (JSON.stringify(changeRows).indexOf(JSON.stringify(e)) === -1) {
            selectionsRows.push(e);
          }
        });
        this.selectedTable.dataSource.forEach((e, index) => {
          if (
            JSON.stringify(changeRows).indexOf(JSON.stringify(e.uuid)) === -1
          ) {
            dataSource.push(e);
          }
        });
        this.selectedRowKeys = selectionsRows;
        this.selectedTable.dataSource = dataSource;
      }
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: this.paramList.some((item) => item.uuid === record.uuid),
          // defaultChecked: this.paramList.some(item => item.uuid === record.uuid)
        },
      };
    },
  },
};
</script>
<style lang="less" scoped>
.ant-modal-content {
  height: 100% !important;
}
</style>
