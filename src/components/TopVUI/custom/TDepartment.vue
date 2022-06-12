<!--
 * @Description: 岗位选择器
 * @Author: 黄婷
 * @Date: 2021-03-02 14:49:16
 * @LastEditTime: 2021-08-05 14:07:51
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\TDepartment.vue
-->
<template>
	<t-modal title="岗位" :width="1000" :visible="visible" switchFullscreen wrapClassName="t-popup-modal"
		@ok="handleSubmit" @cancel="handleCancel" cancelText="关闭">
		<a-card :bordered="false">
			<div class="toolbar flex justify-between flex-wrap">
				<div class="table-page-search-wrapper">
					<a-form layout="inline">
						<div class="flex justify-between flex-wrap">
							<a-form-item label="">
								<a-input v-model="queryParam.text" placeholder="岗位名称" />
							</a-form-item>
							<div class="table-page-search-submitButtons flex">
								<a-button class="cu-btn-primary" @click="$refs.table.refresh(true)">查询</a-button>
								<a-button class="cu-btn-filter" @click="
                    () => {
                      (queryParam = {}), $refs.table.refresh();
                    }
                  ">重置</a-button>
							</div>
						</div>
					</a-form>
				</div>
			</div>
			<div class="page-common-sub-box">
				<s-table ref="table" size="small" :columns="columns" :data="loadData" bordered :pageSize="10"
					:rowSelection="rowSelection" rowKey="uuid" showPagination="auto" :rowClassName="rowClassName"
					@rowClick="rowClick" :scroll="scrollXY">
					<span slot="serial" slot-scope="text, record, index">
						{{ index + 1 }}
					</span>
					<span slot="sex" slot-scope="text">
						{{ text | sexFilter }}
					</span>
					<span slot="action" slot-scope="text, record">
						<template>
							<a @click="handleEdit(record)">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record)">删除</a>
						</template>
					</span>
				</s-table>
			</div>
		</a-card>
	</t-modal>
</template>

<script>
	import {
		simpleListMixin
	} from "@/mixins/simpleListMixin";
	import {
		STable,
		Ellipsis
	} from "@/components";

	const columns = [{
			title: "#",
			width: 50,
			align: "center",
			scopedSlots: {
				customRender: "serial",
			},
		},
		{
			title: "岗位名称",
			dataIndex: "text",
			align: "center",
		},
		{
			title: "岗位编号",
			dataIndex: "value",
			align: "center",
			sorter: true,
		},
	];
	export default {
		name: "TableList",
		mixins: [simpleListMixin],
		components: {
			STable,
			Ellipsis
		},
		props: {
			visible: {
				type: Boolean,
			},
		},
		data() {
			this.columns = columns;
			return {
				confirmLoading: false,
				mdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				selectedRowKeys: [],
				selectedRows: [],
				rows: "", //选中行数据
				subHeight: 0,
				url: {
					getPageSet: "/system/dicItem/getPageSet",
				},
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					this.queryParam.puuid = "4028804863ede3960163ee2cc35301fe";
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
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
		},
		created() {
			this.$nextTick(()=>{
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		methods: {
			rowClassName(row) {
				return row.uuid === this.rows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			rowClick(record, index) {
				// 数据表格行点击事件
				this.selectedRows = [];
				this.selectedRows.push(record);
				this.selectedRowKeys = index;
			},
			handleSubmit() {
				console.log(this.selectedRows);
				if (!this.selectedRows || this.selectedRows.length == 0) {
					this.$message.warning("请选择一条数据");
					return false;
				}
				let selectedRows = {
					value: "",
					text: ""
				};
				this.selectedRows.forEach((e, index) => {
					if (index === 0) {
						selectedRows.value += e.uuid;
						selectedRows.text += e.text;
					} else {
						selectedRows.value += "," + e.uuid;
						selectedRows.text += "," + e.text;
					}
				});
				console.log(selectedRows, "selectedRows.toString()===========");
				this.$emit("change", selectedRows);
				this.close();
			},
			close() {
				this.$emit("close");
			},
			handleCancel() {
				this.close();
			},
		},
	};
</script>

<style lang="less"></style>
