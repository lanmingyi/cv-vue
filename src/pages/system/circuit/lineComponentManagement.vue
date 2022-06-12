<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.table.refresh(true)" @reset="
				    () => {
				      (this.queryParam = {}), $refs.table.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()" v-action:lcmAddDialog>新增
						</a-button>
						<!-- <a-button
				      class="cu-btn-default"
				      icon="edit"
				      @click="handleEdit($refs.table.rows)"
				      v-action:sysSampleTabListEditDialog
				      >编辑</a-button
				    > -->
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
							v-action:lcmDelDialog>删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.pointGroupName" placeholder="线路组件" />
						</a-form-item>
						<a-form-item label="">
							<!-- <TSearchSelectTag v-model="maxPoint" :dictOptions="maxPointList" :syn="true"
								@change="changeMaxPoint">
							</TSearchSelectTag> -->
							<t-dict-select-search-tag v-model="queryParam.maxPoint" :dataList="maxPointList"
								placeholder="起始点" @change="changeMaxPoint" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<!-- <TSearchSelectTag v-model="minPoint" :dictOptions="maxPointList" :syn="true"
								@change="changeMinPoint">
							</TSearchSelectTag> -->
							<t-dict-select-search-tag v-model="queryParam.minPoint" :dataList="maxPointList"
								placeholder="终止点" @change="changeMinPoint" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<!-- <TSearchSelectTag v-model="locationPoint" :dictOptions="maxPointList" :syn="true"
								@change="changelocationPoint">
							</TSearchSelectTag> -->
							<t-dict-select-search-tag v-model="queryParam.locationPoint" :dataList="maxPointList"
								placeholder="位置点" @change="changelocationPoint" dataType="static" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGridNew ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="5" rowKey="uuid"
					showPagination="auto" @rowClick="customClick" :queryParam="queryParam">
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
							<a-divider type="vertical" />
							<a @click="handleMap(record)">位置查询</a>
						</template>
					</span>
				</DataGridNew>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
			<map-form ref="createMapModal" :mapVisible="mapVisible" :loading="confirmLoading" :model="map"
				@cancel="handleCancelMap()" @ok="handleOk()" />
			<div class="page-common-box-content">
				<a-tabs default-active-key="1" @change="changTabs">
					<a-tab-pane key="1" tab="位置点">
						<child-one ref="childOne"></child-one>
					</a-tab-pane>
				</a-tabs>
			</div>

		</div>
	</div>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGridNew,
		TDictSelectSearchTag,
		TSearchSelectTag
	} from "@/components";

	import editForm from "./modal/lineComponentEdit.vue";
	import childOne from "./modal/lineComponentSubOne.vue";
	import mapForm from "./modal/map.vue";

	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGridNew,
			editForm,
			childOne,
			TDictSelectSearchTag,
			TSearchSelectTag,
			mapForm
		},
		data() {
			return {
				columns: [{
						title: "线路组件",
						align: 'center',
						// width: 100,
						dataIndex: "pointGroupName",
					},
					{
						title: "起始点",
						align: 'center',
						// fixed: 'left',
						// width: 100,
						dataIndex: "maxPoint"
					},
					{
						title: "终止点",
						align: 'center',
						// width: 150,
						dataIndex: "minPoint"
					},
					{
						title: "添加人",
						align: 'center',
						// width: 100,
						dataIndex: "creator"
					},
					{
						title: "添加时间",
						align: 'center',
						// width: 150,
						dataIndex: "createTime"
					},
					{
						title: "最后修改人",
						align: 'center',
						// width: 150,
						dataIndex: "modifier"
					},
					{
						title: "最后修改时间",
						align: 'center',
						// width: 150,
						dataIndex: "modifyTime"
					},
					{
						title: "操作",
						align: 'center',
						dataIndex: "action",
						// width: 140,
						scopedSlots: {
							customRender: "action"
						},
					},
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {
					pageSize: 5
				},
				url: {
					getPageSet: "/bdata/lineLocationpointGroup/getPageSet",
					save: "/bdata/lineLocationpointGroup/save",
					update: "/bdata/lineLocationpointGroup/update",
					deleteBatch: "/bdata/lineLocationpointGroup/deleteBatch",
					locationPoint: "/bdata/lineLine/getLocationPointInfo"
				},
				childOneQueryParam: {
					pageSize: 5
				},
				childTwoQueryParam: {},
				tabIndex: 1,
				maxPointList: [],
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
				} else if (val === "false") {
					return "不可排序";
				}
			},
		},
		methods: {
			customClick(record, index) {
				console.log('exportRecord:', record);
				this.$refs.table.rows = record;
				this.childOneQueryParam.PUUID = record.uuid;
				this.childTwoQueryParam.PUUID = record.uuid;
				this.getListFilter(this.tabIndex);
			},
			changTabs(key) {
				this.tabIndex = Number(key);
				this.$nextTick(() => {
					this.getListFilter(this.tabIndex);
				});
			},
			getListFilter(key) {
				if (key === 1) {
					this.$refs.childOne.queryParam = this.childOneQueryParam;
					this.$refs.childOne.refresh(); // 设置刷新子表
				} else if (key === 2 && this.$refs.childTwo) {
					this.$refs.childTwo.queryParam = this.childTwoQueryParam;
					this.$refs.childTwo.refresh(); // 设置刷新子表
				}
			},
			changeMaxPoint(e) {
				this.queryParam.maxPoint = e;
			},
			changeMinPoint(e) {
				this.queryParam.minPoint = e;
			},
			changelocationPoint(e) {
				this.queryParam.locationPoint = e;
			}
		},
		created() {
			const url = this.url.locationPoint;
			// // console.log('param:',requestParameters);
			this.$get(url).then((res) => {
				this.maxPointList = res.data;
				console.log('ex:', this.maxPointList);
			});
		}
	};
</script>

<style lang="less"></style>
