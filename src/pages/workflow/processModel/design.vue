<template>
	<t-modal title="流程设计" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<vue-bpmn style="overflow: hidden;height: 700px;" product="flowable" @processSave="processSave"></vue-bpmn>
		</a-spin>
	</t-modal>
</template>

<script>
	import VueBpmn from "@/components/TopVUI/bpmn/VueBpmn"
	export default {
		name: "design",
		props: {
			visible: {
				type: Boolean,
				required: true
			},
			loading: {
				type: Boolean,
				default: () => false
			},
			model: {
				type: Object,
				default: () => null
			}
		},
		data() {
			return {}
		},
		components: {
			VueBpmn
		},
		methods: {
			processSave(data) {

			},
			deploy() {

			}
		}
	}
</script>

<style scoped>
</style>
