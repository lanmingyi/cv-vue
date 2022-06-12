<template>
	<t-modal title="新增/编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<!-- <a-divider orientation="left"> 基本信息 </a-divider> -->
					<a-col>
						<a-form-item class="hiddenItem">
							<!-- uuid隐藏 -->
							<a-input v-decorator="['uuid']" disabled type="hidden" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="休假标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['title',{rules:[{required:true,message:'休假标题'}]}]" :disabled="isView" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date v-decorator="['beginTime',{rules:[{required:true,message:'开始时间'}]}]" style="width: 100%;" :trigger-change="true" :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss" allowClear  :disabled="isView"/>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date v-decorator="['endTime',{rules:[{required:true,message:'结束时间'}]}]" style="width: 100%;" :trigger-change="true" :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss" allowClear  :disabled="isView"/>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="休假类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag v-decorator="['item',{rules:[{required:true,message:'休假类型'}]}]" dictCode="leaveType" :disabled="isView"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="请假天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number style="width: 100%;" v-decorator="['days',{rules:[{required:true,message:'休假标题'}]}]" :min="1"  :disabled="isView"/>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea :rows="4" v-decorator="['reason',{ rules: [{required: true,message: '备注'}]}]"  :disabled="isView"/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
		<template slot="footer">
			<!--<a-button v-if="state!='草稿'" @click="() => { $emit('storage') }">暂存</a-button>-->
			<a-button v-if="state!='草稿'&&!isView" type="primary" @click="() => { $emit('storage') }">暂存</a-button>
			<a-button v-if="!isView" type="primary" @click="() => { $emit('ok') }">提交</a-button>
			<a-button type="primary" @click="() => { $emit('cancel') }">关闭</a-button>
		</template>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick'
import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag'
// 表单字段
const fields = ['uuid', 'beginTime', 'endTime','item','reason','title','days']
export default {
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
	components: {
		TDictSelectTag
	},
	data() {
		return {
			title: '',
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 }
			},
			form: this.$form.createForm(this),
			state:true,
			isView:false
		}
	},
	methods: {
		add(m) {this.state = '';this.isView = m.isView},
		edit(m) { 
			this.form.setFieldsValue(pick(m, fields))
			this.state = m.state
			this.isView = m.isView
		}
	},
	created() {
		// 防止表单未注册
		fields.forEach(v => this.form.getFieldDecorator(v))
		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
			this.model && this.form.setFieldsValue(pick(this.model, fields))
		})
	}
}
</script>
