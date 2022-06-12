<template>
	<t-modal
		okText="同步"
		cancelText="关闭"
		title="同步数据库"
		:width="340"
		:visible="visible"
		:confirmLoading="loading"
		@ok="handleSubmit()"
		@cancel="
			() => {
				$emit('cancel');
			}
		"
	>
		<a-radio-group v-model="value">
			<a-radio :style="radioStyle" :value="1">
				普通同步(不删除表，保留数据)
			</a-radio>
			<a-radio :style="radioStyle" :value="2">
				强制同步(删除表，删除数据)
			</a-radio>
		</a-radio-group>
	</t-modal>
</template>

<script>

export default {
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		loading: {
			type: Boolean,
			default: () => false,
		},
		model: {
			type: Object,
			default: () => null,
		},
	},
	data() {
		return {
			value: 1,
			radioStyle: {
				display: 'block',
				height: '30px',
				lineHeight: '30px',
			},
			url: {
				synchronizationSave: '/system/sysGenTable/synchronizationSave',
			},
		};
	},
	methods: {
		handleSubmit() {
			let fruit = 'Orange';
			if (this.value === 1) {
				fruit = 'Apple';
			}
			this.$post(this.url.synchronizationSave, {
				fruit: fruit,
				uuid: this.model.uuid,
				tableName: this.model.className,
				database: this.model.database,
			}).then((res) => {
				if (res.statusCode === 200) {
					this.$emit('cancel');
					this.$message.info(res.message);
				} else {
					this.$message.info(res.message);
				}
			});
		},
	},
};
</script>
