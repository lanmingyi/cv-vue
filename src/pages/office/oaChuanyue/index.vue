<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<toolBar @search="$refs.table.refresh(true)" @reset="
					() => {
						(this.queryParam = {}), $refs.table.refresh(true);
					}
				">
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.title" placeholder="标题" />
					</a-form-item>
				</template>
			</toolBar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<span slot="rankText" slot-scope="{text}">
					<a-tag color="pink" v-if="text == '一级'">
						{{ text }}
					</a-tag>
					<a-tag color="orange" v-if="text == '二级'">
						{{ text }}
					</a-tag>
					<a-tag color="green" v-if="text == '三级'">
						{{ text }}
					</a-tag>
				</span>
				<span slot="action" slot-scope="{text, record}">
					<template>
						<a @click="openDrawer(record)">{{ text }}</a>
					</template>
				</span>
			</DataGrid>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :type="cyType" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
		</div>
	</div>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import editForm from "./edit.vue";
	const columns = [
		{
			title: "标题",
			dataIndex: "title",
			scopedSlots: {
				customRender: "action",
			},
		},
		{
			title: "紧急程度",
			dataIndex: "rankText",
			scopedSlots: {
				customRender: "rankText",
			},
		},
		{
			title: "完成时间",
			dataIndex: "completeDate",
		},
		{
			title: "创建人",
			dataIndex: "creator",
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm
		},
		data() {
			return {
				columns,
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				cyType: {
					value: 1,
				},
				url: {
					getPageSet: "/office/oaChuanyue/getPageSet",
				},
			};
		},
		computed: {
		},
		methods: {
			openDrawer(record) {
				this.$refs.createModal.title = record.title;
				this.cyType.add = false;
				this.cyType.edit = true;
				this.rows = record;
				this.$refs.createModal.request(record);
				this.visible = true;
			}
		},
	};
</script>

<style lang="less"></style>
