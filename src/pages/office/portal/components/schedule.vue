<template>
	<div>
		<a-timeline class="padding-sm" v-if="schedulerList.length > 0">
			<a-timeline-item v-for="(item, index) in schedulerList" :key="index">
				<p>{{ item.startDate }}——{{ item.endDate }}</p>
				<p>{{ item.text }}</p>
			</a-timeline-item>
		</a-timeline>
		<a-empty v-else style="minHeight: 309px;" />
	</div>
</template>

<script>

export default {
	data() {
		return {
			schedulerList: [],
		};
	},
	mounted() {
		this.getSchedulerList();
	},
	methods: {
		getSchedulerList() {
			this.$post('/office/scheduler/getMyScheduler', { pageSize: 5 }).then((res) => {
				this.schedulerList = res;
			});
		},
	},
};
</script>

<style></style>
