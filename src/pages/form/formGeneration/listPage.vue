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
		<a-row :gutter="24">
			<!-- 操作 -->
			<div class="flex align-center">
				<a-button icon="play-circle" type="link" @click="handlePreview"> 预览</a-button>
				<!-- <a-button icon="eye" type="link" @click="handleOpenJsonModal">查看json</a-button> -->
			</div>
			<a-divider />
			<!-- 右侧数据面板 -->
			<a-col :span="18">
				<a-divider orientation="left">
					列表配置
				</a-divider>
				<a-table :columns="columnsList" rowKey="filed" :data-source="dataColumnField" :pagination="false" size="small">
					<template slot="sort" slot-scope="text,record,index">
						<a-icon type="arrow-up" class="margin-right-xs" :class="[index == 0 ? 'arrowHidden' : 'arrowShow']" @click="arrowButton(record,index,'up')"/>
						<a-icon type="arrow-down" :class="[index == dataField.length-1 ? 'arrowHidden' : 'arrowShow']"  @click="arrowButton(record,index,'down')"/>
					</template>
					<template slot="align" slot-scope="text,record,index">
						<a-select :default-value="text" style="width: 150px" @change="handleChange($event,record,'align')">
							<a-select-option value="left">
								左对齐
							</a-select-option>
							<a-select-option value="center">
								居中
							</a-select-option>
							<a-select-option value="right">
								右对齐
							</a-select-option>
						</a-select>
					</template>
					<template slot="width" slot-scope="text,record,index">
						<a-input-number style="width: 150px !important;" :value="text" :min="0" :max="300" @change="handleChange($event,record,'width')"/>
					</template>
					<template slot="fixed" slot-scope="text,record,index">
						<a-select v-model="text" style="width: 150px" @change="handleChange($event,record,'fixed')">
							<a-select-option value="left">左</a-select-option>
							<a-select-option value="right">右</a-select-option>
							<a-select-option value="">/</a-select-option>
						</a-select>					
					</template>
				</a-table>
				<a-divider orientation="left" class="margin-top">
					查询配置
				</a-divider>
				<a-table :columns="columnsSearch" rowKey="filed" :data-source="dataColumnSearch" :pagination="false" size="small"> </a-table>
			</a-col>
			<!-- 左侧操作面板 -->
			<a-col :span="6">
				<a-tabs :activeKey="activeKey" @change="e => $emit('activeKeyChange',e)">
					<a-tab-pane key="1" tab="列表字段">
						<a-table :columns="listField" rowKey="filed" :data-source="dataSource" :pagination="false"
							:rowSelection="rowSelection" size="small"></a-table>
					</a-tab-pane>
					<a-tab-pane key="2" tab="查询字段" rowKey="filed" force-render>
						<a-table :columns="searchField" :data-source="dataSourceSearch" :pagination="false"
							:rowSelection="rowSelectionSearch" size="small"></a-table>
					</a-tab-pane>
					<a-tab-pane key="3" tab="列表属性" force-render>
						<formGenPro ref="formGenPro" :selectItem="listProData" @change="onFormChange"></formGenPro>
					</a-tab-pane>
				</a-tabs>
			</a-col>
		</a-row>
		<preview-table
			ref="previewTable"
			:visible="tableVisible"
			:listData="dataColumnField"
			:searchData="dataColumnSearch"
			:listProData="listProData"
			:basicData="basicData"
		></preview-table>
	</div>
</template>

<script>
	import previewTable from './previewTable.vue'
	import {listPro} from '@/components/TopVUI/k-form-design/packages/KFormDesign/config/listPro'
	import formGenPro from '@/components/TopVUI/k-form-design/packages/KFormDesign/module/codeFormGenerationProperties.vue'
	const columnsList = [{
			dataIndex: 'sort',
			title: '排序',
			width: 80,
			align: 'center',
			scopedSlots: {
			  customRender: 'sort',
			},
		},{
			dataIndex: 'filedName',
			title: '列名',
		},{
			title: '字段',
			dataIndex: 'filed',
		},{
			title: '字体对齐',
			dataIndex: 'align',
			scopedSlots: {
			  customRender: 'align',
			},
		},{
			title: '宽度(px)',
			dataIndex: 'width',
			scopedSlots: {
			  customRender: 'width',
			},
		},{
			title: '左右固定',
			dataIndex: 'fixed',
			scopedSlots: {
			  customRender: 'fixed',
			},
		}
	];
	const columnsSearch = [{
			dataIndex: 'filedName',
			title: '列名',
		},
		{
			title: '字段',
			dataIndex: 'filed',
		},
	];
	const listField = [{
		dataIndex: 'filedName',
		title: '列表字段',
	}];
	const searchField = [{
		dataIndex: 'filedName',
		title: '查询字段',
	}];
	export default {
		props: {
			basicData: {
				type:Object
			},
			dataSource: {
				type: Array,
				default: () => [],
			},
			dataField: {
				type: Array,
				default: () => []
			},
			dataSearch: {
				type: Array,
				default: () => []
			},
			activeKey: {
				type: String || Number,
				default:3
			}
		},
		components:{formGenPro,previewTable},
		data() {
			return {
				columnsList,
				columnsSearch,
				listField,
				searchField,
				dataSourceSearch: [],
				selectedRowKeys: [],
				selectedRows: [],
				selectedRowKeysSearch: [],
				selectedRowsSearch: [],
				listProData: {},
				tableVisible: false,
				dataColumnField: [],
				dataColumnSearch: []
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
			rowSelectionSearch() {
				return {
					selectedRowKeys: this.selectedRowKeysSearch,
					onChange: this.onSelectChangeSearch,
				};
			},
		},
		watch: {
			dataSource: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					let data = newVal.filter((s)=>s.filed != 'action')
					this.dataSourceSearch = data
					this.listProData = this.basicData ? this.basicData : listPro
				},
			},
			dataField: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.dealWithData(newVal)
				}
			},
			dataSearch: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.dealWithSearch(newVal)
				}
			},
			listProData: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					let data = (this.dataSource || []).find((d) => d.filed === 'action')
					let datakey = (this.dataSource || []).findIndex((d) => d.filed === 'action')
					let rowkey = (this.selectedRows || []).findIndex((r) => r.filed === 'action')
					let rowkeys = (this.selectedRowKeys || []).findIndex((r) => r === 'action')
					if(newVal.showlineButton && rowkey == -1){
						this.selectedRows.push(data)
						this.selectedRowKeys.push(data.filed)
					} else if(!newVal.showlineButton && rowkeys != -1){
						this.selectedRows.splice(rowkey,1)
						this.selectedRowKeys.splice(rowkeys,1)
					}
					this.$emit('dataChange', this.selectedRows, 'list')
				}
			}
		},
		mounted() {
		},
		methods: {
			init(){//重置数据
				this.selectedRows = []
				this.selectedRowKeys = []
				this.selectedRowsSearch = []
				this.selectedRowKeysSearch = []
			},
			// 列表表格排序
			arrowButton(record,index,type){
				const listData = [...this.dataColumnField]
				let key = listData.findIndex(val=>val.filed == record.filed)
				if(type == 'up' && index != 0){
					// 左边是元素在数组中的原本的排列顺序 右边是自己希望的排列顺序。
					[listData[key-1],listData[key]] = [listData[key],listData[key-1]]
				} else if(type == 'down' && index != listData.length-1){
					[listData[key],listData[key+1]] = [listData[key+1],listData[key]]
				}
				this.dataColumnField = listData
				this.selectedRows = listData
			},
			// 处理列表表格数据
			dealWithData(newVal){
				let data = []
				this.dataColumnField = [...newVal]
				this.dataColumnField.forEach((item, index) => {
					let key = (this.dataSource || []).findIndex((j) => j.filed === item.filed)
					if(key != -1){
						item.filedName = this.dataSource[key].filedName
					} else {
						let rowkey = (this.selectedRows || []).findIndex((r) => r.filed === item.filed)
						let rowkeys = (this.selectedRowKeys || []).findIndex((r) => r === item.filed)
						this.selectedRows.splice(rowkey,1)
						this.selectedRowKeys.splice(rowkeys,1)
						data.push(item.filed)
					}
				})
				data.forEach(e=>{
					this.dataColumnField.splice(this.dataColumnField.findIndex(el=>el.filed == e),1)
				})
				this.$emit('dataChange', this.selectedRows, 'list')
			},
			// 处理搜索表格数据
			dealWithSearch(newVal){
				let data = []
				this.dataColumnSearch = [...this.dataSearch]
				this.dataColumnSearch.forEach((item,index) => {
					let key = (this.dataSource || []).findIndex((j) => j.filed === item.filed)
					if(key != -1){
						item.filedName = this.dataSource[key].filedName
					} else {
						let rowkey = (this.selectedRowsSearch || []).findIndex((r) => r.filed === item.filed)
						let rowkeys = (this.selectedRowKeysSearch || []).findIndex((r) => r === item.filed)
						this.selectedRowsSearch.splice(rowkey,1)
						this.selectedRowKeysSearch.splice(rowkeys,1)
						this.dataColumnSearch.splice(index,1)
						data.push(item.filed)
					}
				})
				data.forEach(e=>{
					this.dataColumnSearch.splice(this.dataColumnSearch.findIndex(el=>el.filed == e),1)
				})
				this.$emit('dataChange', this.selectedRowsSearch, 'search')
			},
			handlePreview(){
				console.log('预览')
				this.$refs.previewTable.visible = true
			},
			handleOpenJsonModal(){
				console.log('查看json')
			},
			onSelectChange(selectedRowKeys, selectedRows) {
				this.selectedRows = selectedRows;
				this.selectedRowKeys = selectedRowKeys;
				let key = selectedRows.findIndex((j) => j.filed == 'action')
				this.listProData.showlineButton = key == -1 ? false : true
				this.$emit('dataChange', selectedRows, 'list')
			},
			onSelectChangeSearch(selectedRowKeys, selectedRows) {
				this.selectedRowsSearch = selectedRows;
				this.selectedRowKeysSearch = selectedRowKeys;
				this.$emit('dataChange', selectedRows, 'search')
			},
			changeCheck(item){
				item.checked = !item.checked
			},
			handleChange(e,record,key){
				record[key] = e
			},
			onFormChange(e,key){
				this.listProData[key] = e
				console.log("e",e,this.listProData)
			},
			getListData() {
				return {
					listData: this.dataColumnField,
					searchData: this.dataColumnSearch,
					listProData: this.listProData
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
	.arrowHidden{
		color: #e7e7e7;
		
	}
	.arrowShow{
		color: #606266;
		&:hover{
			color: #1890ff;
		}
	}
</style>
