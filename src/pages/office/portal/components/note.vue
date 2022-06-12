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
					>{{ child.title }}</ellipsis
				>
			</a-list-item>
		</a-list>
		<detail-view
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
import detailView from '../../noticeOn/detail.vue';
export default {
	data() {
		return {
			newsList: [],
			visibleDetail: false,
			model: null,
			loading: true,
		};
	},
	components: { detailView, Ellipsis },
	mounted() {
		this.getNewsList();
	},
	methods: {
		getNewsList() {
			this.$post('/office/officePublicAnnouncement/getPageSetPublic', { pageSize: 5 })
				.then((res) => {
					this.newsList = res.rows;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		showDetail(item) {
			this.visibleDetail = true;
			this.$refs.detailModal.onLoadData(item);
		},
		getTime(val) {
			return val.substr(0, 11);
		},
	},
};
</script>

<style></style>
