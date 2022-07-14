<!--
 * @Description: 用户选择
 * @Author: lmy
 * @Date: 2021-03-23 09:58:27
 * @LastEditTime: 2021-05-21 14:29:52
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div>
		<a-input @click="show" v-model="userNames" placeholder="请选择" readOnly>
			<a-icon slot="addonAfter" type="user" @click="show" />
		</a-input>
		<t-select-user-modal
			:visible="visible"
			style="width: 100%;"
			:typeNum="typeNum"
			:user-ids="userIds"
			@change="(value) => changeUser(value)"
			@close="close"
		/>
	</div>
</template>

<script>
import TSelectUserModal from './modal/TSelectUserModal.vue';
export default {
	name: 'TSelectUser',
	components: { TSelectUserModal },
	props: {
		typeNum: {
			type: Number,
			required: false,
			default: 2,
		},
		value: {
			type: String,
			required: false,
			default: '',
		},
		visible: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			isUserPopups: false,
			userNames: '',
			userIds: '',
		};
	},
	watch: {
		value: {
			deep: true,
			immediate: true,
			handler(newVal, oldVal) {
				console.log(newVal, oldVal);
				this.userIds = newVal;
			},
		},
	},
	mounted() {
		this.userIds = this.value;
	},
	methods: {
		initComp(userNames) {
			this.userNames = userNames;
		},
		changeUser(val) {
			console.log(val);
			this.userNames = val.userName;
			this.$emit('change', val.uuid);
			console.log(this.userNames);
		},
		show() {
			this.$emit('show');
		},
		close() {
			this.$emit('update:visible', false);
		},
	},
};
</script>

<style scoped></style>
