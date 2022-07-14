<!--
 * @Description: 路由视图
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 12:00:26
 * @LastEditors: lmy
 * @FilePath:
-->
<!-- <template>
	<div>
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template> -->
<script>
export default {
  name: "RouteView",
  props: {
    keepAlive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  render() {
    const {
      $route: { meta },
      $store: { getters },
    } = this;
    const inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    );
    const notKeep = <router-view />;
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    // if (!getters.multiTab && !meta.keepAlive) {
    //   return notKeep;
    // }
    return this.keepAlive || getters.multiTab || meta.keepAlive
      ? inKeep
      : notKeep;
  },
};
</script>
