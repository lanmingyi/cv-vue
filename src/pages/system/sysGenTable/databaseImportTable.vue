<template>
	<t-modal okText="导入" cancelText="关闭" title="数据库导入表" :width="1200" :visible="visible" :confirmLoading="loading"
		@ok="handleSubmit()" @cancel="
			() => {
				$emit('cancel');
			}
		">
		<div class="toolbar flex justify-between flex-wrap">
			<div class="table-operator">
				<a-form layout="inline">
					<div class="flex justify-between flex-wrap">
						<a-form-item style="width: 200px;">
							<a-select show-search style="width: 200px;" placeholder="数据库名" v-model="queryParam.database"
								@change="kumingChange">
								<a-select-option v-for="(item, index) in kumingcodeList" :value="item.database"
									:key="index">
									{{ item.database }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item style="width: 200px;">
							<a-select show-search placeholder="表名" style="width: 200px;padding-left: 10px"
								v-model="queryParam.tableName">
								<a-select-option v-for="(item, index) in biaomingcodeList" :value="item.tableName"
									:key="index">
									{{ item.tableName }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<div class="table-page-search-submitButtons flex align-center">
							<a-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="search">查询
							</a-button>
							<a-button class="cu-btn-filter margin-left-xs" style="margin-bottom: 10px;"
								@click="resetSearchForm()">重置</a-button>
						</div>
					</div>
				</a-form>
			</div>
		</div>
		<div id="components-layout-demo-basic">
			<a-layout>
				<a-layout>
					<a-layout-content>
						<div class="page-common-sub-box">
							<s-table ref="table" size="small" :columns="columns" :data="loadData" bordered
								:rowSelection="rowSelection" :pageSize="10" :rowKey="(record) => record.tableName"
								showPagination="auto" @rowClick="rowClick" :rowClassName="rowClassName"  :scroll="scrollXY"></s-table>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</t-modal>
</template>

<script>
	import {
		STable
	} from '@/components';

	const columns = [{
			title: '表名',
			dataIndex: 'tableName',
			align: 'center',
			width: 300,
		},
		{
			title: '来自数据库',
			dataIndex: 'database',
			align: 'center',
			width: 300,
		},
		{
			title: '表注释',
			dataIndex: 'notes',
			align: 'center',
			width: 200,
		},
	];
	export default {
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
		},
		name: 'TableList',
		components: {
			STable,
		},
		data() {
			return {
				pagination: {
					pageSizeOptions: ['30', '20', '50', '100'],
				},
				queryParam: {},
				url: {
					getAllDatabases: '/system/sysGenTable/getAllDatabases',
					getPageSetByDatabase: '/system/sysGenTable/getPageSetByDatabase',
					tableNameImportSave: '/system/sysGenTable/tableNameImportSave',
					getPageSetByDatabaseAll: '/system/sysGenTable/getPageSetByDatabaseAll',
				},
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSetByDatabase, requestParameters).then((res) => {
						return res;
					});
				},
				columns,
				cities: [],
				kumingValue: '',
				kuming: '',
				biaomingValue: '',
				selectedRowKeys: [],
				selectedRows: [],
				uuid: '',
				uuids: '',
				userInfo: {},
				tableNameValue: '',
				labelCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 7,
					},
				},
				wrapperCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 13,
					},
				},
				form: this.$form.createForm(this),
				kumingcodeList: [],
				biaomingcodeList: [],
				subHeight : 0,
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
					type: 'radio',
				};
			},
			scrollXY(){
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return { y : height};
			},
		},
		mounted() {},
		methods: {
			onLoad() {
				this.$nextTick(() => {
					this.queryParam = {};
					this.biaomingcodeList = [];
					this.getDataBase();
					this.$refs.table.refresh();
					this.selectedRowKeys = [];
					this.selectedRow = [];
				});
			},
			getDataBase() {
				this.$post(this.url.getAllDatabases).then((res) => {
					this.kumingcodeList = res.rows;
				});
			},
			resetSearchForm() {
				this.queryParam = {};
				this.$refs.table.refresh();
			},
			kumingChange(value) {
				this.biaomingcodeList = [];
				this.$post(this.url.getPageSetByDatabaseAll, {
					database: value,
				}).then((res) => {
					this.biaomingcodeList = res;
				});
			},
			biaomingChange(value) {
				this.biaomingValue = value;
			},
			getRowKeys(row) {
				return row.uuid; // 每条数据的唯一识别值
			},
			rowClassName(row) {
				return row.tableName === this.uuid ? 'bg-bray' : ''; // 每条数据的唯一识别值
			},
			rowClick(record, index) {
				const that = this;
				that.info = record;
				that.uuid = record.tableName;
				that.rowClassName(record);
			},
			onSelectChange(selectedRowKeys, selectedRows) {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRows = selectedRows;
			},
			handleSubmit(e) {
				if (this.info || this.selectedRowKeys?.length) {
					this.$post(this.url.tableNameImportSave, {
						tableName: this.info ? this.info.tableName : this.selectedRows[0].tableName,
						tableSchema: this.info ? this.info.database : this.selectedRows[0].database,
					}).then((res) => {
						if (res.statusCode === 200) {
							this.$emit('ok');
							this.$message.success(res.message);
						} else {
							this.$message.error(res.message);
						}
					});
				} else {
					this.$message.warn('请选择一条数据');
				}
			},
			search() {
				// this.queryParam = {
				// 	database: this.kumingValue,
				// 	tableName: this.biaomingValue
				// }
				this.$refs.table.refresh();
			},
		},
	};
</script>

<style lang="less" scoped>
	.ant-layout-content {
		background: #fff;
	}
</style>
