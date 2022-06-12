<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm
				">
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.mettingName" placeholder="会议名称" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="startTime" slot-scope="{text,record}">
						{{moment(record.startTime).format('yyyy-MM-DD HH:mm')}}
						 - 
						{{moment(record.endTime).format('yyyy-MM-DD HH:mm')}}
					</span>
					<span slot="operate" slot-scope="{operate, record}">
						<template>
							<a @click="handleDetail(record)">查看</a>
							<!-- <a-divider type="vertical" />
							<a-dropdown>
								<a class="ant-dropdown-link">
									更多
									<a-icon type="down" />
								</a>
								<a-menu slot="overlay">
									<a-menu-item>
										<a @click="handleChange(record, 'withdraw')">撤回</a>
									</a-menu-item>
									<a-menu-item v-if="record.state === '未开始'">
										<a @click="handleChange(record, 'Held')">召开</a>
									</a-menu-item>
									<a-menu-item v-if="record.state === '未开始'">
										<a @click="handleNotice(record, 'send')">发出通知</a>
									</a-menu-item>
								</a-menu>
							</a-dropdown> -->
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<accessory-info ref="accessoryModal" :url="urlFile" tag="fds" label="fds"  :model="rows" :type="1" :params="queryParamSub"></accessory-info>
					</a-tab-pane>
				</a-tabs>
			</div>
			<detail-form ref="detailModal" :meetingList="typeList" :securityList="securityList" @cancel="handleCancelDetail()"
			 :visible="visibleDetail" />
		</div>
	</div>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGrid
	} from "@/components";
	import moment from 'moment';
	import detailForm from './detail.vue'
	import accessoryInfo from '@/components/TopVUI/accessory/index'
	const columns = [
		{
			title: '会议名称',
			dataIndex: 'nameOfProposedMeeting',
			ellipsis: true,
		},
		{
			title: '会议地点',
			dataIndex: 'conferenceRoomName',
			ellipsis: true,
		},
		{
			title: '会议负责单位',
			dataIndex: 'applicationDepartmentName',
			ellipsis: true,
		},
		{
			title: '会议类型',
			dataIndex: 'typees',
			width: 100,
		},
		{
			title: '开会时间',
			dataIndex: 'startTime',
			width: 300,
			ellipsis: true,
				scopedSlots: {
					customRender: 'startTime'
				}
		},
		{
			title: '主持人',
			dataIndex: 'hostess',
		},
		{
			title: '操作',
			dataIndex: 'operate',
			width: 120,
			fixed: 'right',
			scopedSlots: {
				customRender: 'operate'
			}
		}
	]
	export default {
		name: 'TableList',
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			detailForm,
			accessoryInfo
		},
		data() {
			return {
				columns,
				queryParam: {type : 'myMeeting'},
				queryParamSub: {},
				url: {
					getPageSet: '/office/oaMeetingApplication/getPageSet',
					save: '/office/oaMeetingMeeting/save',
					update: '/office/oaMeetingApplication/update',
					deleteBatch: '/office/oaMeetingMeeting/deleteBatch',
					getDicItemByCode: '/system/dicSet/getDicItemByCode',
					holdMeeting: '/office/oaMeetingMeeting/holdMeeting',
				},
				urlFile: {
					webUpload: '/document/fdfs/upload',
					getPageSet: '/document/fastdfs/getPageSet',
					deleteBatch: '/document/fdfs/delete',
					update: '/document/fastdfs/update'
				},
				mdlUserPost: null,
				mdl: null,
				selectedRowKeys: [],
				rows: '',
				masterUuids: '',
				statusList: [],
				titleList: [],
				securityList: [],
				organList: [],
				typeList: [],
				visibleDetail: false,
			}
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: '空闲',
					1: '使用中',
				}
				return statusMap[status]
			},
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				}
			}	
		},
		mounted() {
			this.getCodeList()
		},
		methods: {
			moment,
			rowClassName(row) {
				return row.uuid === this.masterUuids ? 'bg-bray' : ''
			},
			masterRowClick(record, index) {
				this.rows = record
				this.masterUuids = record.uuid
				this.queryParamSub.puuid = record.uuid
				this.$refs.accessoryModal.refreshList(this.queryParamSub) 
			},
			handleDetail(record) {
				this.visibleDetail = true
				this.$refs.detailModal.onLoadData(record)
			},
			handleCancelDetail() {
				this.visibleDetail = false
			},
			getCodeList(){
				// 获取会议类型
				this.$post(this.url.getDicItemByCode, {
					code: 'meetingsType'
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.typeList = res
					}
				})
				// 会议保障类型
				this.$post(this.url.getDicItemByCode, {
					code: 'security'
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.securityList = res
					}
				})
			},
			handleChange(record, type) {
				var that = this
				var tips = type === 'withdraw' ? '确定执行此操作？' : '会议到点后自动召开，确定要现在召开吗？'
				var state = type === 'withdraw' ? 'withdraw' : 'Held'
				that.$confirm({
					title: '警告',
					content: tips,
					okText: '确定',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						that.$post(that.url.holdMeeting, {
							uuid: record.uuid,
							isRelease: state
						}).then((res) => {
							if (res === 1 || res.statusCode === 200) {
								that.$refs.table.refresh()
								that.$refs.accessoryModal.refreshList()
								that.$message.success(res.message ? res.message : '操作成功')
							} else {
								that.$message.error(res.message)
							}
						})
					},
					onCancel() {
						console.log('Cancel')
					}
				})
			},
			handleNotice(record) {
				var that = this
				that.$confirm({
					title: '警告',
					content: '确定执行此操作',
					okText: '确定',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						that.$message.error('发起通知失败')
					},
					onCancel() {
						console.log('Cancel')
					}
				})
			},
			refreshOnload(){
				this.$refs.accessoryModal.refreshList({})
			},
			resetSearchForm() {
				this.$refs.table.refresh()
				this.queryParamSub = {}
				this.$refs.accessoryModal.refreshList(this.queryParamSub)
			},
			resetForm() {
				this.queryParam = {}
				this.resetSearchForm()
			},
		}
	}
</script>
