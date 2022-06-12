<!--
 * @Description: 行省略
 * @Author: 黄婷
 * @Date: 2021-04-27 17:02:50
 * @LastEditTime: 2021-05-21 14:26:57
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\custom\TEllipsis.vue
-->
<template>
	<a-tooltip placement="topLeft">
		<template slot="title">
			<span>{{ value }}</span>
		</template>
		<template v-if="$slots.content">
			<slot name="content"></slot>
		</template>
		<template v-else>
			{{ value | ellipsis(length) }}
		</template>
	</a-tooltip>
</template>

<script>
import '@/utils/filter'; // base filter
export default {
	name: 'TEllipsis',
	props: {
		value: {
			type: String,
			required: false,
		},
		length: {
			type: Number,
			required: false,
			default: 25,
		},
	},
	computed: {
		slots() {
			console.log(Object.keys(this.$slots));
			return Object.keys(this.$slots);
		},
	},
};
</script>

<style scoped></style>
