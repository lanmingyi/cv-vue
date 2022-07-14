<!--
 * @Description: 预览代码
 * @Author: lmy
 * @Date: 2021-07-13 09:41:46
 * @LastEditTime: 2021-07-13 10:54:27
 * @LastEditors: lmy
 * @FilePath: \misboot-cloud-vue\src\pages\system\sysAppBasics\previewCode.vue
-->
<template>
	<t-modal title="预览代码" class="pre-code-1463235" :visible="visible" :confirmLoading="loading" :fullscreen="true" @ok="
      () => {
        $emit('ok');
      }
    " @cancel="
      () => {
        $emit('update:visible', false);
      }
    ">
		<a-tabs default-active-key="1" tabPosition="left">
			<a-tab-pane v-for="(item, index) in tablist" :key="index">
				<span slot="tab">
					<!-- <a-icon type="icon-daima" /> -->
					{{ getTabTitle(item.velocityKey) }}
				</span>
				<!-- index -->
				<previewCode :editorJson="item.velocityValue" :showFootBtn="false" :height="pHeight" />
				<!-- index -->
			</a-tab-pane>
		</a-tabs>
	</t-modal>
</template>

<script>
	import loadBeautifier from "@/utils/loadBeautifier";
	import previewCode from "@/components/TopVUI/k-form-design/packages/PreviewCode/index";
	import {
		exportDefault,
		beautifierConf,
		titleCase
	} from "@/utils/index";
	let beautifier;
	export default {
		components: {
			previewCode
		},
		props: {
			visible: {
				type: Boolean
			}
		},
		data() {
			return {
				loading: false,
				tablist: [],
			};
		},
		computed: {
			pHeight() {
				return `calc(100VH - 54px - 65px )`;
			},
		},
		methods: {
			getTabTitle(val) {
				let arr = val.split("/");
				return arr[arr.length - 1];
			},
			onOpen(uuid) {
				this.$post("/system/sysAppDetailed/getDetailBybasicsUuid", {
					basicsUuid: uuid,
					// basicsUuid: 'E5860058AD6B4F0FA58D2BC30F715E00',
				}).then((res) => {
					if (res.statusCode !== 300) {
						loadBeautifier((btf) => {
							beautifier = btf;
							res.forEach((e, index) => {
								if (index > 5) {
									e.velocityValue = beautifier.html(
										e.velocityValue,
										beautifierConf.html
									);
								} else {
									e.velocityValue = beautifier.js(
										e.velocityValue,
										beautifierConf.js
									);
								}
							});
							this.tablist = res;
						});
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.pre-code-1463235 {
		.ant-modal-body {
			padding: 0 !important;
		}

		.ant-tabs .ant-tabs-left-content {
			padding: 0 !important;
		}
	}

	/deep/ .ant-modal {
		top: 0 !important;
	}
</style>
