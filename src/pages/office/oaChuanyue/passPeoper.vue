<template>
	<a-card :bordered="false">
		<toolBar @search="$refs.table.refresh(true)" @reset="
					() => {
						(this.queryParam = {}), $refs.table.refresh(true);
					}
				">
			<template slot="toolBtn" slot-scope="scope">
				<div class="table-operator" v-if="type && type === 2">
					<t-select-role ref="userModal" @changeData="selectUser" @show="addUser" selectButtonIcon="plus"
						selectButtonText="添加传阅人" :isSelect="false" style="display: inline-block;" />
					<a-button class="cu-btn-danger" icon="play-circle" @click="handelUpdate($refs.table.rowKeys)">开始传阅</a-button>
				</div>
			</template>
		</toolBar>
		<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
			:format-conditions="true" :pageSize="10">
			<span slot="status" slot-scope="{text}">
				<a-tag color="pink" v-if="text == 0">
					{{ text | statusFilter }}
				</a-tag>
				<a-tag color="blue" v-if="text == 1">
					{{ text | statusFilter }}
				</a-tag>
				<a-tag color="green" v-if="text == 2">
					{{ text | statusFilter }}
				</a-tag>
			</span>
		</DataGrid>
	</a-card>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import TSelectRole from "@/components/TopVUI/custom/TSelectRole";
	const columns = [{
			title: "传阅人",
			dataIndex: "personName",
			ellipsis: true,
		},
		{
			title: "传阅意见内容",
			dataIndex: "remark",
			ellipsis: true,
		},
		{
			title: "传阅状态",
			dataIndex: "status",
			scopedSlots: {
				customRender: "status",
			},
			ellipsis: true,
		},
		{
			title: "创建人",
			dataIndex: "creator",
			ellipsis: true,
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			ellipsis: true,
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			TSelectRole
		},
		props: {
			params: {
				type: Object,
				default: null,
			},
			model: {
				type: Object,
				default: null,
			},
			type: {
				type: Number,
				default: 1,
			},
		},
		data() {
			return {
				columns,
				visible: false,
				confirmLoading: false,
				// 查询参数
				queryParam: {},
				loadData: [],
				mdlUserPost: null,
				rows: {},
				url: {
					getPageSet: "/office/oaChuanyueReceiver/getListByChaungyueUuid",
					save: "/office/oaChuanyueReceiver/save",
					update: "/office/oaChuanyue/update",
					deleteBatch: "/system/attachment/delete",
					getDetailByUuid: "/office/oaChuanyue/getDetailByUuid",
				}
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "未传阅",
					1: "已传阅",
					2: "已读",
				};
				return statusMap[status];
			},
		},
		methods: {
			fetch(qurey){
				this.queryParam = qurey
				this.$refs.table.refresh()
			},
			addUser() {
				if (this.queryParam.chuanyueUuid) {
					this.$refs.userModal.show();
				} else {
					this.$message.info("请选择需要操作的数据");
					return;
				}
			},
			selectUser(data) {
				if (!data.length) {
					this.$message.info("请选择需要操作的数据");
					return false;
				}
				let that = this;
				let uuid = [];
				data.forEach((item) => {
					uuid.push(item.uuid);
				});
				that
					.$post(that.url.save, {
						uuid: uuid.join(),
						parentUuid: that.queryParam.chuanyueUuid,
					})
					.then((res) => {
						if (res.statusCode === 200) {
							that.$message.success("保存成功！");
							that.fetch(that.queryParam);
						} else {
							that.$message.error(res.message);
						}
					});
			},
			handelUpdate(record) {
				// console.log(this.$refs.table.dataSource)
				this.loadData = this.$refs.table.dataSource
				// console.log("record" , record)
				if (this.loadData && this.loadData.length > 0) {
				// if (record != null) {
					this.$nextTick(() => {
						this.$post(this.url.getDetailByUuid, {
							uuid: this.rows.uuid,
							// uuid: record,
						}).then((res) => {
							var values = {
								completeDate: this.rows.completeDate,
								rank: this.rows.rank,
								rankText: this.rows.rankText,
								title: this.rows.title,
								uuid: this.rows.uuid,
								content: res.content,
							};
							this.$post(this.url.update, values).then((res) => {
								if (res === 1 || res.statusCode === 200) {
									this.$message.success("传阅成功！");
									this.fetch(this.queryParam);
								} else {
									this.$message.error("传阅失败！");
								}
								this.loading = false;
							});
						});
					});
				} else {
					this.$message.warning("请先添加传阅人员！");
				}
			},
			refresh(row) {
				console.log("row" , row)
				this.queryParam = row
				this.rows = row
				this.$refs.table.refresh();
				// console.log(this.$refs.table.dataSource)
			},
		},
	};
</script>

<style lang="less"></style>
