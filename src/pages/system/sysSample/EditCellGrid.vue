<!--
 * @Description: 可编辑单元格
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-06-24 18:15:26
 * @LastEditors: 黄婷
 * @FilePath: \vue-antd-admine:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysSample\EditCellGrid.vue
-->
<template>
	<a-table v-bind="{ ...$options.propsData, columns: columns, dataSource: dataSource }">
		<template v-for="(col, index) in columns" :slot="col.dataIndex" slot-scope="text, record, index">
			<editable-cell
				ref="EditableCell"
				:key="index"
				:cell-data="col"
				:text="text"
				:record="record"
				@change="onCellChange(record, col.dataIndex, $event)"
			/>
		</template>
		<template slot="operation" slot-scope="text, record">
			<a href="javascript:;" @click="() => onDelete(record.key)">Delete</a>
		</template>
	</a-table>
</template>
<script>
import EditableCell from './editableCell';
export default {
	components: {
		EditableCell,
	},
	props: {
		bordered: Boolean,
		columns: Array,
		components: Object,
		footer: Function,
		// pagination: Object,
		rowClassName: Function,
		customRow: Function,
		rowKey: [String, Function],
		rowSelection: Object,
		scroll: Object,
		showHeader: Boolean,
		size: String,
		customHeaderRow: Function,
		customRow: Function,
		url: Object,
	},
	data() {
		return {
			dataSource: [],
			cacheData: [],
			pagination: {},
		};
	},
	mounted() {
		this.fetch(this.queryParam);
	},
	methods: {
		fetch(params) {
			this.$post(this.url.getPageSet, params).then((res) => {
				const pager = { ...this.pagination };
				pager.total = res.totalCount;
				this.dataSource = res.rows;
				this.cacheData = res.rows;
				this.pagination = pager;
			});
		},
		onCellChange(record, dataIndex, value) {
			const dataSource = [...this.dataSource];
			const target = dataSource.find((item) => item.key === record.key);
			if (target) {
				target[dataIndex] = value;
				this.dataSource = dataSource;
			}
			let params = {};
			if (record.uuid) params.uiuid = record.uuid;
			params[dataIndex] = value;
			const url = record.uuid ? this.url.save : this.url.update;
			this.$post(url, params).then((res) => {
				console.log(res);
				// this.fetch(this.queryParam);
			});
		},
		onDelete(key) {
			const dataSource = [...this.dataSource];
			this.dataSource = dataSource.filter((item) => item.key !== key);
		},
		handleAddRow() {
			const { count, dataSource } = this;
			let newData = { editable: true };
			this.columns.forEach((e) => {
				newData[e.dataIndex] = '';
			});
			console.log(newData);
			// this.dataSource = [...dataSource, newData];
			this.dataSource.splice(0, 0, newData);
		},
	},
};
</script>
<style></style>
