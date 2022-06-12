<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-07-09 09:14:57
 * @LastEditTime: 2021-07-09 13:40:27
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-vue\src\pages\system\sysAppBasics\listPage.vue
-->
<template>
	<div class="padding">
		<a-row :gutter="16" type="flex" justify="center">
			<a-col :span="16" >
				<a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
					<a-form-item label="列表布局" class="margin-bottom-xl">
					  <a-radio-group :value="listData.basicLayout" button-style="solid" @change="handleChange($event.target.value,'basicLayout')"> 
							<a-radio-button value="default">
								新建表
							</a-radio-button>
							<a-radio-button value="data">
								单表布局
							</a-radio-button>
							<!-- <a-radio-button value="masterData">
								主-子表格	
							</a-radio-button>
							<a-radio-button value="masterTree">
								主树-子表格
							</a-radio-button> -->
						</a-radio-group>
					</a-form-item>
					
					<a-form-item label="父级模块">
					  <tree-select 
							v-decorator="[ 'id', { initialValue: pid, rules: [{ required: true, message: '必填！' }],}, ]"
					    placeholder="请选择菜单"
					    :parameter="parameter"
					    :url="url"
					    :data="treeData"
					    idfield="id"
					    textfield="text"
					  />
					</a-form-item>
					<a-form-item label="排序">
					  <a-input-number v-decorator="[ 'sort',{ rules: [{ required: true, message: '必填！' }] }, ]" :min="0" :max="9999" />
					</a-form-item>
					
					<template v-if="listData.basicLayout == 'default'">
						<a-form-item label="表类型">
							<!-- <a-input v-decorator="[ 'tableName',{ rules: [{ required: true, message: '不能为空' }]}]" type="hidden"/> -->
						  <a-select v-decorator="[ 'tableType', { rules: [{ required: true, message: '必填！' }] }, ]" >
						    <a-select-option value="datagrid">
						      数据表格
						    </a-select-option>
						    <!-- <a-select-option value="treegrid">
									树形表格
								</a-select-option> -->
						  </a-select>
						</a-form-item>
						<a-form-item label="新建表名">
							<a-input v-decorator="[ 'tableName',{ rules: [{ required: true, message: '不能为空' }]}]" type="hidden"/>
						  <a-input v-model="listData.tableName"/>
						</a-form-item>
						<a-form-item label="描述">
							<a-input v-decorator="[ 'tableDesc',{ rules: [{ required: true, message: '不能为空' }]}]" type="hidden"/>
						  <a-textarea :row="4" v-model="listData.tableDesc"/>
						</a-form-item>
					</template>
					
					<template v-if="listData.basicLayout != 'default'">
						<a-divider orientation="center" v-if="listData.basicLayout == 'masterTree' || listData.basicLayout == 'masterData'">
							左侧数据
						</a-divider>
						<a-form-item label="数据连接" v-if="listData.basicLayout != 'default'">
							<a-input v-decorator="['leftDataSourse',{ rules: [{ required: true, message: '不能为空' }]}]" type="hidden"/>
							<TDictSelectTag
								type="select"
								dataType="dynamic"
								method="post"
								url="/system/sysGenTable/getAll"
								params="{}"
								valueFeild="tableName"
								textFeild="tableName"
								v-model="listData.leftDataSourse"
							></TDictSelectTag>
						</a-form-item>
						<a-form-item label="子级获取参数" v-if="listData.basicLayout == 'masterTree'">
							<a-textarea :row="4" v-decorator="['masterParma']" placeholder="接口参数"></a-textarea>
						</a-form-item>
						
						<template v-if="listData.basicLayout == 'masterTree' || listData.basicLayout == 'masterData'">
							<a-divider orientation="center" >	
								右侧数据
							</a-divider>	
							<a-form-item label="数据连接" >
								<a-input v-decorator="['rightDataSourse',{ rules: [{ required: true, message: '不能为空' }]}]" type="hidden"/>
								<TDictSelectTag
									type="select"
									dataType="dynamic"
									method="post"
									url="/system/sysGenTable/getAll"
									params="{}"
									valueFeild="tableName"
									textFeild="tableName"
									v-model="listData.rightDataSourse"
								></TDictSelectTag>
							</a-form-item>
							<a-form-item label="关联主表字段" >
								<a-input v-decorator="['leftAssField',{ rules: [{ required: true, message: '不能为空' }]}]" type="hidden"/>
								<TDictSelectTag
									type="select"
									dataType="static"
									url="/system/generator/getColumns"
									:dataList="dataAssList"
									valueFeild="columnName"
									textFeild="columnName"
									v-model="listData.leftAssField"
								></TDictSelectTag>
							</a-form-item>
						</template>
					</template>
				</a-form>
			</a-col>
		</a-row>
	</div>
</template>

<script>
	import pick from 'lodash.pick';
	import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
	import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
	const fields = ['basicLayout', 'leftDataSourse', 'masterParma', 'leftAssField', 'rightDataSourse'
		,'tableType','tableName','id','sort','tableDesc'];
	export default {
		components:{TreeSelect,TDictSelectTag},
		props: {
			basicData: Object,
			record:Object
		},
		data() {
			return {
				listData: {},
				dataAssList: [],
				oldVal: null,
				form: this.$form.createForm(this),
				treeData: [],
				pid: 1,
				url: {
				  fathersUrl: "/form/formModule/getListByLevelId",
				  expandUrl: "/form/formModule/getListByPid",
				},
				parameter: {
				  father: {
				    levelId: 1,
				  },
				  children: {},
				},
			};
		},	
		computed: {
		},
		watch: {
			record: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.$nextTick(()=>{
						this.form.setFieldsValue(pick(newVal, fields))
					})
				}
			},
			basicData: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.oldVal = null
					this.listData = Object.assign(newVal,this.record)
				}
			},
			listData: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					if(newVal.leftDataSourse && newVal.rightDataSourse && newVal.leftDataSourse == newVal.rightDataSourse){
						newVal.rightDataSourse = null
						return this.$message.info('子表数据源不应与主表数据源一致', 1.5)
					}
					if(newVal.basicLayout != 'default')this.getAssData(newVal.rightDataSourse)
					this.$nextTick(()=>{
						this.form.setFieldsValue(pick(newVal, fields))
						this.$forceUpdate()
					})
				}
			}
		},
		methods: {
			init(data){
				this.form.resetFields() //重置
				this.$nextTick(()=>{
					this.form.setFieldsValue(pick(this.record, fields))
				})
				this.pid = this.record.id ? this.record.id : '1'
				this.listData = data
				console.log("data",data,this.record)
			},
			validateData(){
				let data = {}
				this.form.validateFields((errors, values) => {
					console.log(values)
					if (!errors) {
						data = values
					} else {
						data = null;
					}
				})
				return data;
			},
			getBasicData(){
				return this.listData;
			},
			handleChange(e,key){
				this.listData[key] = e
				console.log(this.listData)
			},
			getAssData(newVal){
				if(this.oldVal != newVal){
					this.$post(
					  "/system/generator/getColumns",
					  { tableName: newVal },
					  null
					).then((res) => {
					  if (res) {
					    this.dataAssList = res;
					  }
					});
				}
				this.oldVal = this.oldVal ? this.oldVal : newVal
			},
		},
		created() {
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
		},
	}
</script>

<style lang="scss" scoped>
	.ant-form{
		border-radius: 10px;
		min-height: 500px;
		margin: 0 auto;
		padding: 30px 20px 50px 20px;
		box-shadow: 1px 2px 8px #e8e8e8;;
	}
</style>
