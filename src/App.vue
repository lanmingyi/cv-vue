<!--
 * @Description:应用入口组件
 * @Author:
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-08-06 13:47:11
 * @LastEditors:
 * @FilePath:
-->
<template>
	<a-config-provider :locale="locale">
		<!-- <router-view /> -->
		<router-view v-if="isRouterShow" />
	</a-config-provider>
</template>

<script>
	import {
		enquireScreen
	} from "./utils/util";
	import {
		mapState,
		mapMutations
	} from "vuex";
	import themeUtil from "@/utils/themeUtil";
	import {
		getI18nKey
	} from "@/utils/routerUtil";
	import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

	export default {
		name: "App",
		provide() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				locale: zhCN,
				isRouterShow: true
			};
		},
		created() {
			enquireScreen((isMobile) => this.setDevice(isMobile));
		},
		mounted() {
			this.setWeekModeTheme(this.weekMode);
		},
		watch: {
			weekMode(val) {
				this.setWeekModeTheme(val);
			},
			$route() {
				this.setHtmlTitle();
			},
			"theme.mode": function(val) {
				let closeMessage = this.$message.loading(
					`您选择了主题模式 ${val}, 正在切换...`
				);
				themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage);
			},
			"theme.color": function(val) {
				let closeMessage = this.$message.loading(
					`您选择了主题色 ${val}, 正在切换...`
				);
				themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage);
			},
		},
		computed: {
			...mapState("setting", ["theme", "weekMode"]),
		},
		methods: {
			...mapMutations("setting", ["setDevice"]),
			setWeekModeTheme(weekMode) {
				if (weekMode) {
					document.body.classList.add("week-mode");
				} else {
					document.body.classList.remove("week-mode");
				}
			},
			// 设置浏览器标题
			setHtmlTitle() {
				const route = this.$route;
				const key =
					route.meta &&
					typeof route.meta.title !== "undefined" &&
					route.meta.title;
				// document.title = this.$t(key) + " | " + process.env.VUE_APP_NAME;
				document.title = process.env.VUE_APP_NAME;
			},
			async reload() {
				this.isRouterShow = false
				await this.$nextTick()
				this.isRouterShow = true
			}
		},
	};
</script>

<style lang="less">
	#documentFile {
		height: 70vh;
	}

	#wps-iframe {
		height: 100%;
	}
</style>
