<template>
    <a-modal title="终止流程" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="24">
                        <a-form-item label="终止原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <!-- <a-input v-decorator="['message',{rules:[{required:true,message:'请输入终止原因'}]}]" type="textarea"/> -->
							<a-textarea :rows="4" v-decorator="['message',{ rules: [{required: true,message: '请输入终止原因'}]}]"/>
                        </a-form-item>
						<a-form-item  class="hiddenItem">
							<a-input v-decorator="['processInstanceId']" type="hidden" />
						</a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    // 表单字段
    const fields = ['message', 'processInstanceId']
    export default {
        props: {
            visible: {
                type: Boolean,
                required: true
            },
            confirmLoading: {
                type: Boolean,
                default: () => false
            },
            model: {
                type: Object,
                default: () => null
            }
        },
        data() {
            return {
                title: '',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 5
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 16
                    }
                },
                form: this.$form.createForm(this)
            }
        },
        methods: {},
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
