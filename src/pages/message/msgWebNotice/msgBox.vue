<!--
 * @Description: 
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-08-30 17:03:17
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\message\msgWebNotice\msgBox.vue
-->
<template>
	<t-modal class="mL" :title="tableRecord.title ? tableRecord.title : ''" :width="640" :visible="visible" @cancel="
      () => {
        $emit('cancel');
      }
    " @ok="
      () => {
        $emit('ok');
      }
    ">
		<template>
			<p>{{ tableRecord.content }}</p>
		</template>
	</t-modal>
</template>

<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				required: true,
			},
			tableRecord: {
				type: Object,
				default: () => {},
			},
		},
		// computed: {
		// 	// 默认情况下不同路由引入同一个组件 不触发created 数据作用域是同一个，加一个可以加以区别。
		// 	key() {
		// 		return this.$route.name !== undefined ? this.$route.name : this.$route
		// 	}
		// }
		data() {
			return {
				showContent: false,
				webCommon: '',
				webUrl: '/system/portal/index',
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 7
					},
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 13
					},
				},
			};
		},
		mounted() {},
	};
</script>

<style scoped="scoped">
	.mL .ant-modal-footer button+button {
		display: none;
	}
</style>
