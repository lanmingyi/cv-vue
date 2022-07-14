<!--
 * @Description: 监听器参数配置
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-02 17:07:59
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    title="监听器参数配置"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
      <div class="table-operator">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAdd"
          >新增</a-button
        >
      </div>
    </div>
		<div class="page-common-sub-box" style="padding-bottom: 45px;">
			<a-table
				ref="table"
				size="small"
				:columns="columns"
				:data-source="dataSource"
				bordered
				:pagination="pagination"
				:rowSelection="rowSelection"
				:rowKey="(record, index) => index"
				showPagination="auto"
				:customRow="rowClick"
				@change="handleTableChange"
				:rowClassName="rowClassName"
				:scroll="scrollXY"
			>
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<template
					v-for="col in ['type', 'name', 'value']"
					:slot="col"
					slot-scope="text, record, index"
				>
					<div v-if="col === 'type'" :key="col">
						<a-select
							v-if="record.editable"
							style="width: 120px"
							:defaultValue="text"
							@change="(e) => handleChange(e, index, col)"
						>
							<a-select-option value="stringValue">
								字符串
							</a-select-option>
							<a-select-option value="expression">
								表达式
							</a-select-option>
						</a-select>
						<template v-else>
							{{ text }}
						</template>
					</div>
					<div v-else :key="col">
						<a-input
							v-if="record.editable"
							style="margin: -5px 0"
							:value="text"
							@change="(e) => handleChange(e.target.value, index, col)"
						/>
						<template v-else>
							{{ text }}
						</template>
					</div>
				</template>
				<template slot="operation" slot-scope="text, record, index">
					<div class="editable-row-operations">
						<span v-if="record.editable">
							<a style="margin-right: 5px" @click="() => save(index)">保存</a>
							<a style="margin-right: 5px" @click="() => cancel(index)">取消</a>
						</span>
						<span v-else>
							<a
								style="margin-right: 5px"
								:disabled="editingKey !== ''"
								@click="() => edit(index)"
								>编辑</a
							>
						</span>
						<a-divider type="vertical" />
						<a @click="() => handleSub(record.uuid)">删除</a>
					</div>
				</template>
			</a-table>
		</div>
  </t-modal>
</template>

<script>
import moment from "moment";
import { STable } from "@/components";
const columns = [
  {
    title: "类型",
    dataIndex: "type",
    scopedSlots: {
      customRender: "type",
    },
  },
  {
    title: "名称",
    dataIndex: "name",
    scopedSlots: {
      customRender: "name",
    },
  },
  {
    title: "值",
    dataIndex: "value",
    sorter: true,
    needTotal: true,
    scopedSlots: {
      customRender: "value",
    },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    scopedSlots: {
      customRender: "operation",
    },
  },
];
export default {
  name: "TableList",
  props: {
    visible: {
      type: Boolean,
    },
    value: {
      type: Array,
    },
  },
  data() {
    this.columns = columns;
    return {
      // create model
      pagination: {
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      isNew: false,
      editingKey: "",
			subHeight: 0
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
		scrollXY(){
			let subHeight = this.subHeight ? this.subHeight : 500
			let height = subHeight - 40 - 40
			return { y : height};
		}
  },
  mounted() {
    this.fetch();
  },
	created() {
		this.$nextTick(()=>{
			this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
		})
	},
  methods: {
    // 获取数据
    fetch(e) {
      this.dataSource = e ? e : [];
    },
    // 分页
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
    // 分页
    onShowSizeChange(current, pageSize) {
      const pager = { ...this.pagination };
      pager.pageSize = pageSize;
      this.pagination = pager;
      this.fetch({
        pageSize: pageSize,
        pageNo: current,
      });
    },
    // 分页
    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      const target = newData.filter((item, index) => key === index)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
    // 编辑
    edit(key) {
      this.dataSource[key].editable = true;
      this.editingKey = key;
    },
    // 保存
    save(index) {
      this.dataSource[index].editable = false;
      this.editingKey = "";
      this.isNew = false;
    },
    // 取消
    cancel(key) {
      this.editingKey = "";
      if (this.isNew) {
        this.isNew = false;
        this.dataSource.splice(0, 1);
      } else {
        this.dataSource[key].editable = false;
      }
    },
    rowClassName(row) {
      return row.uuid === this.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 行点击
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.info = record;
            that.uuid = record.uuid;
            that.rowClassName(record);
          },
        },
      };
    },
    // 新增
    handleAdd() {
      const newData = {
        type: "",
        name: "",
        value: "",
        editable: true,
      };
      if (!this.isNew) {
        this.isNew = true;
        this.dataSource.splice(0, 0, newData);
      } else {
        this.dataSource[0] = newData;
      }
    },
    // 提交
    handleOk() {
      this.$emit("ok", this.dataSource);
    },
    // 删除
    handleSub(record, index) {
      this.dataSource.splice(index, 1);
    },
    // 勾选
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
};
</script>

<style lang="less"></style>
