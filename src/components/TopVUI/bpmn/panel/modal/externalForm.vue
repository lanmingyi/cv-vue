<!--
 * @Description: 外置表单列表页
 * @Author: lmy
 * @Date: 2021-08-17 11:57:15
 * @LastEditTime: 2021-09-02 17:23:57
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<t-modal title="外置表单" :width="1200" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="
      () => {
        $emit('update:visible', false);
      }
    ">
		<a-row :gutter="10">
			<a-col :md="8" :sm="24">
				<a-card :bordered="false">
					<div class="page-common-sub-box">
						<dataGrid ref="masterList" type="master" :columns="masterColumns" :url="url" bordered :showTotal="false"
							:queryParam="masterQueryParam" rowKey="uuid" :pagination="{showQuickJumper:false}" showPagination="auto" @rowClick="
								(e) => {
									masterRowClick(e, { puuid: 'uuid' });
								}
							">
						</dataGrid>
					</div>
				</a-card>
			</a-col>
			<a-col :md="16" :sm="24">
				<a-card :bordered="false">
					<div class="page-common-sub-box">
						<dataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :scroll="scrollXY"
							:queryParam="subQueryParam" rowKey="uuid" showPagination="auto" rowSelectionType="radio"
							@rowClick="rowClick">
							<span slot="action" slot-scope="{ record, text }">
								<a @click="handlePreview(record)">预览</a></span>
						</dataGrid>
					</div>
				</a-card>
				<t-modal title="表单预览" :width="850" :visible="previewVisible" @ok="
            () => {
              previewVisible = false;
            }
          " @cancel="
            () => {
              previewVisible = false;
            }
          ">
					<component ref="previewModal" :isView="false" :drawingList="{}" :is="plugItem"
						v-for="(plugItem, plugIndex) in plugs" :key="plugIndex"></component>
				</t-modal>
			</a-col>
		</a-row>
	</t-modal>
</template>

<script>
	import {
		masterTableMixin
	} from "@/mixins/masterTableMixin";
	import dataGrid from "@/components/table/advance/dataGrid";
	import {
		recordRoute
	} from "@/config";
	const masterColumns = [{
		title: "表单",
		dataIndex: "name",
	}, ];
	const subColumns = [{
			title: "页面路径",
			width: 100,
			dataIndex: "nodeFormPath",
		},
		{
			title: "保存接口地址",
			width: 100,
			dataIndex: "nodeFormSavePath",
		},
		{
			title: "更新接口地址",
			width: 100,
			dataIndex: "nodeFormUpdatePath",
		},
		{
			title: "详情接口地址",
			width: 100,
			dataIndex: "nodeFormEditPath",
		},
		{
			title: "操作",
			dataIndex: "action",
			align: "center",
			width: 100,
			scopedSlots: {
				customRender: "action"
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [masterTableMixin],
		components: {
			dataGrid,
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
		},
		data() {
			return {
				masterColumns,
				subColumns,
				// 查询参数
				masterQueryParam: {},
				subQueryParam: {},
				url: {
					masterList: "/workflow/actForm/getPageSet",
					subList: "/workflow/actFormConfigure/getPageSet",
				},
				previewVisible: false,
				plugs: [],
				subHeight: 0,
			};
		},
		computed: {
			scrollXY(){
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return { y : height};
			},
		},
		created() {
			this.$nextTick(()=>{
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		methods: {
			//提交
			handleOk() {
				const selectedRows = this.$refs.subList.selectedRows;
				this.$emit("ok", selectedRows);
			},
			// 行点击事件
			rowClick(record, index, rowKeys) {
				this.$refs.subList.selectedRows = [];
				this.$refs.subList.selectedRows.push(record);
				this.$refs.subList.selectedRowKeys = [];
				this.$refs.subList.selectedRowKeys.push(rowKeys);
			},
			// 表单预览
			handlePreview(record) {
				this.previewVisible = true;
				this.plugs = [];
				this.plugs.push(() => import(`@/pages` + record.nodeFormPath));
			},
		},
	};
</script>

<style lang="less"></style>
