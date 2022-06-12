<template>
	<a-list class="demo-loadmore-list" :loading="loading" item-layout="horizontal" :data-source="newsList">
		<a-list-item slot="renderItem" slot-scope="child, indexChild" style="cursor: pointer;">
			<span slot="actions" style="font-size: 12px;">{{ getTime(child.createTime) }}</span>
			<ellipsis
				:length="42"
				style="color: #074e9e;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
				>{{ child.newsTitle }}</ellipsis
			>
		</a-list-item>
	</a-list>
</template>

<script>

import { Ellipsis } from '@/components';
export default {
	data() {
		return {
			newsList: [],
			loading: true,
		};
	},
	components: { Ellipsis },
	mounted() {
		this.getNewsList();
	},
	methods: {
		getNewsList() {
			this.$post('/office/oaNewsBase/getPageSet', {
				pageSize: 5,
			})
				.then((res) => {
					this.newsList = res.rows;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getTime(val) {
			return val.substr(0, 11);
		},
	},
};
</script>

<style></style>
