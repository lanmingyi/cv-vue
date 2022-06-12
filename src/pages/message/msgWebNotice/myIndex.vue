<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-dropdown>
						<a-menu slot="overlay" @click="handleMenuClick">
							<a-menu-item v-for="(item, index) in status" :key="item.text">
								{{ item.text }}({{ item.amount }}条)
							</a-menu-item>
						</a-menu>
						<a-button> {{ stateText }}
							<a-icon type="down" />
						</a-button>
					</a-dropdown>
				</template>
			</tool-bar>
			<data-grid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<template slot="Title" slot-scope="{ text, record, index }">
					<a-icon style="margin-right: 5px;color: #f7D876;" theme="filled"
						:type="record.receiverStatus == '未读' ? 'folder' : 'folder-open'" />
					{{ text }}
				</template>
				<span slot="tags" slot-scope="{ tags, record }">
					<template>
						<a @click="examine(record)">查看</a>
						<a-divider type="vertical" />
						<a @click="handleSub(record)">删除</a>
					</template>
				</span>
			</data-grid>
			<msg-box :visible="masterVisible" :tableRecord="subRows" @cancel="handleOk" @ok="handleOk" />
		</div>
	</div>
</template>

<script>
	// import { msgMyPageSet, msgReadStatus, msgUpdateIsDel } from '@/services/msg.js'

	import {
		DataGrid,
		Ellipsis
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import msgBox from "./msgBox.vue";
	const columns = [{
			title: "标题",
			dataIndex: "title",
			width: 500,
			scopedSlots: {
				customRender: "Title"
			},
			sorter: false,
		},
		{
			title: "类型",
			width: 100,
			dataIndex: "type",
			sorter: false,
		},
		{
			title: "时间",
			dataIndex: "createTime",
			sorter: false,
		},
		{
			title: "操作",
			dataIndex: "tags",
			width: 100,
			scopedSlots: {
				customRender: "tags"
			},
		},
	];

	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			Ellipsis,
			msgBox,
		},
		data() {
			return {
				columns: columns,
				queryParam: {},
				masterRows: "",
				uuids: "",
				url: {
					getPageSet: "/message/msgWebNotice/getMyPageSet",
					deleteBatch: "/message/msgWebNoticeRelation/updateIsDel",
					msgReadStatus: "/message/msgWebNoticeRelation/getReadStatus",
					updateReadStatus: "/message/msgWebNotice/updateReadStatus",
					getContentByUuid: "/message/msgWebNotice/getContentByUuid",
				},
				status: [],
				stateText: "全部",
				masterVisible: false,
				subRows: {},
			};
		},
		watch: {
			queryParam: {
				deep: true,
				handler(newVal, oldVal) {
					this.getReadStatus();
				},
			},
		},
		created() {
			this.getReadStatus();
		},
		methods: {
			getReadStatus() {
				this.$post(this.url.msgReadStatus).then((res) => {
					this.status = res;
				});
			},
			handleMenuClick(e) {
				this.stateText = e.key;
				this.queryParam.type = e.key == "全部" ? "" : e.key;
				this.$refs.table.refresh();
			},
			examine(record) {
				if (!record.url) {
					this.subRows = {};
					this.subRows.title = record.title
					this.$get(`${this.url.getContentByUuid}?uuid=${record.uuid}`).then(
						(res) => {
							if (res.statusCode !== 300) {
								this.subRows.content = res.content;
								this.$refs.table.refresh();
								this.masterVisible = true;
								this.getReadStatus();
							}
						}
					);
				} else {
					this.$router.push(record.url)
					this.$refs.table.refresh();
					this.getReadStatus();
				}
			},
			handleOk() {
				this.masterVisible = false;
			},
			handleCancel() {
				this.masterVisible = false;
			},
		},
	};
</script>

<style lang="less">
	.ant-tag-blue {
		color: white;
		background: #009688;
		border-color: #009688;
	}

	.ant-tag-red {
		color: white;
		background: #ff5722;
		border-color: #ff5722;
	}
</style>
