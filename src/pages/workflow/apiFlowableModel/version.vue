<template>
	<t-modal title="版本管理" :width="1200" :visible="visible" :confirmLoading="loading" @ok="
      () => {
        $emit('ok');
      }
    " @cancel="
      () => {
        $emit('cancel');
      }
    ">
		<div class="page-common-sub-box">
			<DataGrid ref="table" :columns="columns" :url="url" bordered rowKey="procdefId" showPagination="auto"
				:queryParam="queryParam"  :scroll="scrollXY">
				<span slot="modelVersion" slot-scope="{ text, record, index }">
					<a-tag v-if="text" :color="'geekblue'">
						{{ "V:" + record.modelVersion }}
					</a-tag>
				</span>
				<span slot="birthday" slot-scope="{ text, record, index }">
					<a-tag v-if="record.modelVersion == null" :color="'red'">
						{{ "未发布" }}
					</a-tag>
					<a-tag v-if="record.modelVersion != null" :color="'green'">
						{{ "已发布" }}
					</a-tag>
				</span>
				<span slot="majorVersion" slot-scope="{ text, record, index }">
					{{ text ? text : "否" }}
				</span>
				<span slot="action" slot-scope="{ text, record }">
					<template>
						<a @click="changeVirsion(record)">设为主版本</a>
						<!-- <a-divider type="vertical" />
						<a @click="handleDel(record)">删除</a> -->
					</template>
				</span>
			</DataGrid>
		</div>
	</t-modal>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		ACCESS_TOKEN
	} from "@/store/mutation-types";
	import Vue from "vue";
	import {
		baseUrl
	} from "@/services/baseUrl.js";

	export default {
		name: "TableList",
		components: {
			DataGrid
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
				type: String,
				default: () => null,
			},
		},
		data() {
			return {
				columns: [
				    // {
					// 	title: "流程分类",
					// 	dataIndex: "modelType",
					// 	sorter: false,
					// 	align: "center",
					// },
					{
						title: "流程版本",
						dataIndex: "modelVersion",
						sorter: false,
						align: "center",
						scopedSlots: {
							customRender: "modelVersion",
						},
					},
					{
						title: "发布状态",
						dataIndex: "birthday",
						sorter: false,
						scopedSlots: {
							customRender: "birthday",
						},
						align: "center",
					},
					{
						title: "主版本",
						dataIndex: "majorVersion",
						sorter: false,
						scopedSlots: {
							customRender: "majorVersion",
						},
						align: "center",
					},
					{
						title: "部署时间",
						dataIndex: "createTime",
						sorter: false,
						align: "center",
					},
					{
						title: "操作",
						dataIndex: "action",
						scopedSlots: {
							customRender: "action",
						},
						align: "center",
					},
				],
				advanced: true,
				queryParam: {},
				url: {
					getPageSet: "/workflow/apiFlowableModel/getListByModelKey",
					deleteBatch: "/workflow/apiFlowableProcessDefinition/deleteDeployment",
				},
				mdlVersion: null,
				confirmLoadingVersion: false,
				visibleVersion: false,
				modelKey: "",
				subHeight : 0,
			};
		},
		computed:{
			scrollXY(){
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return { y : height};
			},
		},
		mounted() {},
		methods: {
			refreshList(e) {
				this.queryParam.modelKey = e;
				if (this.$refs.table) this.$refs.table.refresh();
			},
			//设置主版本
			changeVirsion(record) {
				const that = this;
				that.$confirm({
					title: "提示",
					content: `确定要设置该版本为主版本吗?`,
					okText: "确定",
					cancelText: "取消",
					onOk() {
						that
							.$post("/workflow/apiFlowableModel/setMajorVersion", {
								procdefId: record.procdefId,
								modelKey: record.modelKey,
							})
							.then((res) => {
								if (res.statusCode === 200) {
									that.$message.success(res.message);
									that.$refs.table.refresh();
									that.$emit("ok");
								} else {
									that.$message.info(res.message);
								}
							});
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			//删除
			handleDel(record) {
				const that = this;
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						console.log("OK");
						// 在这里调用删除接口
						that
							.$post(that.url.deleteBatch, {
								deploymentId: record.deploymentId,
							})
							.then((res) => {
								if (res.statusCode === 200) {
									that.$message.success(res.message);
									that.$refs.table.refresh();
								} else {
									that.$message.info(res.message);
								}
							});
						return new Promise((resolve, reject) => {
							setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
						}).catch(() => console.log("Oops errors!"));
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
		},
	};
</script>

<style lang="less"></style>
