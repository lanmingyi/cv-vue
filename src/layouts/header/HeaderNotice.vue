<template>
	<div>
		<a-dropdown :trigger="['click']" v-model="show">
			<div slot="overlay">
				<a-spin :spinning="loading" class="dropdown">
					<a-tabs class="dropdown-tabs" :style="{ width: '297px' }">
						<a-tab-pane tab="通知" key="1">
							<a-list :data-source="messageData">
								<a-list-item slot="renderItem" slot-scope="item, index">
									<a-list-item-meta :title="item.title" :description="item.createTime">
									</a-list-item-meta>
									<a slot="extra" @click="examine(item)">查看</a>
								</a-list-item>
							</a-list>
						</a-tab-pane>
						<!-- <a-tab-pane tab="消息" key="2">
	          <a-list class="tab-pane"></a-list>
	        </a-tab-pane>
	        <a-tab-pane tab="待办" key="3">
	          <a-list class="tab-pane"></a-list>
	        </a-tab-pane> -->
					</a-tabs>
				</a-spin>
			</div>
			<a-badge class="notice-badge" :count="countNum">
				<a-icon :class="['header-notice-icon']" type="bell" />
			</a-badge>
		</a-dropdown>
		<msg-box :visible="masterVisible" :tableRecord="subRows" @cancel="cancel()" @ok="cancel()" />
		<!-- <audio id="audio" preload="auto" loop style="width: 50px;">
	  <source src="./tip.mp3" type="audio/ogg" />
	</audio> -->
	</div>
</template>

<script>
	import {
		dataListMixin
	} from "@/mixins/dataListMixin";
	import msgBox from "@/pages/message/msgWebNotice/msgBox.vue";
	export default {
		name: "HeaderNotice",
		mixins: [dataListMixin],
		components: {
			msgBox,
		},
		data() {
			return {
				loading: false,
				show: false,
				visiblePopover: false,
				messageData: [],
				masterVisible: false,
				subRows: {},
				queryParam: {
					type: "未读",
				},
				url: {
					masterList: "/message/msgWebNotice/getMyPageSet",
					masterDelete: "/message/msgWebNoticeRelation/updateIsDel",
					msgReadStatus: "/message/msgWebNoticeRelation/getReadStatus",
					updateReadStatus: "/message/msgWebNotice/updateReadStatus",
					getContentByUuid: "/message/msgWebNotice/getContentByUuid",
				},
				countNum: "",
				lastRunTime: "",
				isPlaying: false,
				currentTime: "",
			};
		},
		computed: {
			//  getWsMsg() {
			//   //在核心代码接收到的服务端信息存储到vuex的属性
			// return this.$store.state.webSocketMsg
			//   }
		},
		mounted() {
			//在需要使用服务端推送过来的消息时
			//在computed方法声明
			// this.$setWs.initWebSocket();
			this.getMessageList();
		},
		watch: {
			//在watch方法 监听 getWsMsg
			// getWsMsg: function (data, val) {
			//   console.log(data);
			//  //.......
			// }
		},
		methods: {
			play() {
				this.lastRunTime = Date.now();
				let audio = document.querySelector("#audio");
				if (!this.isPlaying) {
					audio.play();
					this.isPlaying = true;
				}
				let timeOut = setTimeout(() => {
					this.stop(timeOut);
				}, 15000);
			},
			stop(timeOut) {
				this.currentTime = Date.now();
				let audio = document.querySelector("#audio");
				if (this.currentTime - this.lastRunTime < 15000) {} else {
					if (this.isPlaying) {
						audio.currentTime = 0;
						audio.pause();
						this.isPlaying = false;
					}
				}
				clearTimeout(timeOut);
			},
			cancel() {
				this.messageData = [];
				this.getMessageList();
				this.visiblePopover = true;
				this.masterVisible = false;
			},
			getMessageList() {
				this.$post(this.url.masterList, this.queryParam).then((res) => {
					if (res.rows && res.rows.length > 0) {
						res.rows.forEach((val) => {
							this.messageData.push(val);
						});
						this.countNum = this.messageData.length;
					} else {
						this.countNum = 0;
					}
				});
			},
			examine(record) {
				this.show = false;
				this.subRows = {};
				this.subRows.title = record.title;
				// if (!record.url) {
				// 	this.$post(`${this.url.updateReadStatus}?uuid=${record.uuid}`).then(
				// 		(res) => {
				// 			this.subRows.content = res.content;
				// 			this.visiblePopover = false;
				// 			this.masterVisible = true;
				// 		}
				// 	);
				// } else {
				// 	this.$axios(
				// 		"GET",
				// 		`${this.url.getContentByUuid}?uuid=${record.uuid}`
				// 	).then((res) => {
				// 		this.subRows.content = res.content;
				// 		this.visiblePopover = false;
				// 		this.masterVisible = true;
				// 	});
				// }
				this.$axios(
					"GET",
					`${this.url.getContentByUuid}?uuid=${record.uuid}`
				).then((res) => {
					this.subRows.content = res.content;
					this.visiblePopover = false;
					this.masterVisible = true;
				});
			},
			fetchNotice() {
				if (!this.visiblePopover) {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
					}, 500);
				} else {
					this.loading = false;
				}
				this.visiblePopover = !this.visiblePopover;
			},
		},
	};
</script>

<style lang="less">
	.notice-badge {
		color: inherit !important;
		i {
			color: inherit;
		}
		.header-notice-icon {
			font-size: 16px;
			padding: 1px;
		}
	}

	.dropdown {
		.dropdown-tabs {
			max-height: calc(100vh - 150px);
			overflow: hidden !important;
			overflow-y: auto !important;
			background-color: @base-bg-color;
			box-shadow: 0 2px 8px @shadow-color;
			border-radius: 4px;
			padding: 0 10px !important;

			.tab-pane {
				padding: 0 24px 12px;
				min-height: 250px;
			}
		}
	}
</style>
