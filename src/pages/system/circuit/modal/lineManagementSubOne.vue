<template>
	<a-card :bordered="false" :bodyStyle="{ padding: 0 }">
		<tool-bar @search="$refs.table.refresh(true)" @reset="
        () => {
          ((queryParam.name = ''), delete queryParam.name),
            $refs.table.refresh();
        }
      ">
			<template slot="toolBtn" slot-scope="scope">
				<a-button class="cu-btn-primary" icon="plus" @click="handleAdd(queryParam)">新增</a-button>
				<a-button class="cu-btn-default" icon="edit" @click="handleInsert(queryParam)">插入</a-button>
				<!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          >编辑</a-button
        > -->

				<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
				</a-button>
				<a-button class="cu-btn-default" icon="heat-map" @click="handleMap(queryParam)">轨迹查询</a-button>
			</template>
			<!-- <template slot="toolForm">
				<a-form-item label="">
					<a-input v-model="queryParam.name" placeholder="姓名" />
				</a-form-item>
			</template> -->
		</tool-bar>
		<DataGridNew ref="table" :columns="columns" :url="url" bordered :pageSize="5" rowKey="uuid" showPagination="auto"
			:queryParam="queryParam">
			<span slot="sex" slot-scope="{ text }">
				{{ text | sexFilter }}
			</span>
			<span slot="testCombobox" slot-scope="{ text }">
				{{ text | testComboboxFilter }}
			</span>
			<span slot="action" slot-scope="{ text, record }">
				<template>
					<a @click="handleEdit(record)">编辑</a>
					<a-divider type="vertical" />
					<a @click="handleSub(record)">删除</a>
				</template>
			</span>
		</DataGridNew>
		<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" :url="url" @cancel="handleCancel()"
			@ok="handleOk()" />
		<map-form ref="createMapModal" :mapVisible="mapVisible" :loading="confirmLoading" :model="map"
			@cancel="handleCancelMap()" @ok="handleOk()" />
	</a-card>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGridNew
	} from "@/components";
	import editForm from "./lineManagementEditSubOne.vue";
	import mapForm from "./map.vue";
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGridNew,
			editForm,
			mapForm
		},
		data() {
			return {
				columns: [{
						title: "线路组件",
						dataIndex: "pointGroupName",
						align: "center",
						width: "100",
						fixed: "left"
					},
					{
						title: "位置点编码",
						dataIndex: "pointCode",
						align: "center",
						width: "100"
					},
					{
						title: "位置点自定义名称",
						dataIndex: "customizeName",
						align: "center",
						width: "250"
					},
					{
						title: "应用设定",
						dataIndex: "departureplaceInformation",
						align: "center",
						width: "150"
					},
					{
						title: "驾驶员操作说明",
						dataIndex: "destinationInformation",
						align: "center",
						width: "150"
					},
					{
						title: "距上个位置点里程",
						dataIndex: "departureplaceMileage",
						align: "center",
						width: "150"
					},
					{
						title: "添加人",
						dataIndex: "creator",
						align: "center",
						width: "150"
					},
					{
						title: "添加时间",
						dataIndex: "createTime",
						align: "center",
						width: "150"
					},
					{
						title: "最后修改人",
						dataIndex: "modifier",
						align: "center",
						width: "150"
					},
					{
						title: "最后修改时间",
						dataIndex: "modifyTime",
						align: "center",
						width: "150"
					},
					{
						title: "操作",
						dataIndex: "action",
						align: "center",
						fixed: "right",
						width: "100",
						scopedSlots: {
							customRender: "action",
						},
					},
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {pageSize:5},
				url: {
					getPageSet: "/bdata/lineLineDetail/getPageSet",
					save: "/bdata/lineLineDetail/save",
					update: "/bdata/lineLineDetail/update",
					deleteBatch: "/bdata/lineLineDetail/deleteBatch",
					locationPoint: "/bdata/lineLine/getLocationPointInfo"
				},
				mapVisible: false,
				map: null
			};
		},
		filters: {
			sexFilter(sex) {
				switch (sex) {
					case "male":
						return "男";
					case "female":
						return "女";
					case "unknown":
						return "未知";
				}
			},
			testComboboxFilter(val) {
				if (val === "true") {
					return "可排序";
				} else {
					return "不可排序";
				}
			},
		},
		methods: {
			refresh() {
				this.$refs.table.refresh();
			},
		},
	};
</script>

<style lang="less"></style>
