<template>
	<div>
		<!-- <a-list itemLayout="vertical">
		  <a-list-item :key="index" v-for="(item,index) in taskInfo" v-if="index==0">
		  <div class="author flex justify-between flex-wrap margin-bottom-xs">
			<span>{{item.creator}}发布了一项任务</span>
			<em>{{item.createTime}}</em>
		  </div>
		    <div class="title">{{item.title}}</div>
		    <div class="content" >
		      <div class="detail"> <div class="detail-left">任务内容：</div><div class="detail-right">{{item.content}}</div> </div>
		      <div class="detail"> <div class="detail-left">任务周期：</div><div class="detail-right">{{item.planStartTime}} — {{item.planEndTime}}</div> </div>
		      <div class="action"><a-button block @click="showDetail(item)">查看详情</a-button></div>
		    </div>
		  </a-list-item>
		</a-list> -->
		<detail-view
			ref="detailModal"
			:model="model"
			@cancel="
				() => {
					visibleDetail = false;
				}
			"
			:visible="visibleDetail"
		/>
		<a-list class="demo-loadmore-list" :loading="loading" item-layout="horizontal" :data-source="taskInfo">
			<a-list-item
				slot="renderItem"
				slot-scope="child, indexChild"
				style="cursor: pointer;"
				@click="showDetail(child)"
				v-if="indexChild < 5"
			>
				<span slot="actions" style="font-size: 12px;">{{ getTime(child.createTime) }}</span>
				<ellipsis
					:length="42"
					style="color: #074e9e;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
					>{{ child.title }}</ellipsis
				>
			</a-list-item>
		</a-list>
	</div>
</template>

<script>
import detailView from '../../oaTaskBase/detail.vue';
import { Ellipsis } from '@/components';
export default {
	data() {
		return {
			taskInfo: [],
			visibleDetail: false,
			model: {},
			loading: true,
		};
	},
	components: { detailView, Ellipsis },
	mounted() {
		this.getTaskInfo();
	},
	methods: {
		getTaskInfo() {
			this.$post('/office/oaTaskBase/getMyTaskBaseByLevelId', { levelId: 1, pageSize: 5 })
				.then((res) => {
					// let taskList = {}
					// taskList.title = "公示公告"
					// taskList.children = res.rows
					this.taskInfo = res.rows;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		showDetail(item) {
			this.model = item;
			this.visibleDetail = true;
		},
		getTime(val) {
			return val.substr(0, 11);
		},
	},
};
</script>

<style lang="less" scoped="scoped">
.title {
	margin: 10px 0;
	font-weight: bold;
}
.content {
	.detail {
		line-height: 28px;
		max-width: 720px;
		display: flex;
		margin-bottom: 10px;
		.detail-left {
			width: 15%;
		}
		.detail-right {
			width: 80%;
		}
	}
	.author {
		color: @text-color-second;
		line-height: 22px;
		& > :global(.ant-avatar) {
			vertical-align: top;
			margin-right: 8px;
			width: 20px;
			height: 20px;
			position: relative;
			top: 1px;
		}
		& > em {
			color: @disabled-color;
			font-style: normal;
			margin-left: 16px;
		}
	}
	.action {
		width: 100%;
		text-align: center;
		// padding: 10px 0;
	}
}
</style>
