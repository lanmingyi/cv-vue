<template>
	<div>
		<a-list class="demo-loadmore-list" :loading="loading" item-layout="horizontal" :data-source="newsList">
			<a-list-item
				slot="renderItem"
				slot-scope="child, indexChild"
				style="cursor: pointer;"
				@click="showDetail(child)"
			>
				<span slot="actions" style="font-size: 12px;">{{ getTime(child.createTime) }}</span>
				<ellipsis
					:length="42"
					style="color: #074e9e;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
					>{{ child.newsTitle }}</ellipsis
				>
			</a-list-item>
		</a-list>
		<detail-form
			ref="detailModal"
			@cancel="
				() => {
					visibleDetail = false;
				}
			"
			:visible="visibleDetail"
		/>
	</div>
</template>

<script>

import { Ellipsis } from '@/components';
import detailForm from '../../news/detail.vue';
export default {
	data() {
		return {
			newsList: [],
			loading: true,
			visibleDetail: false,
		};
	},
	components: { Ellipsis, detailForm },
	mounted() {
		this.getNewsList();
	},
	methods: {
		getNewsList() {
			this.$post('/office/oaNewsBase/getPageSet', {
				pageSize: 7,
			})
				.then((res) => {
					let taskList = {};
					taskList.title = '公示公告';
					taskList.children = res.rows;
					this.newsList = res.rows;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getTime(val) {
			return val.substr(0, 11);
		},
		showDetail(record) {
			this.visibleDetail = true;
			this.$refs.detailModal.onLoadData(record);
		},
	},
};
</script>

<style></style>
