<template>
	<div>
		<!-- <a-table
			size="small"
			:columns="columns"
			:dataSource="dataSource"
			bordered
			:pagination="false"
			:rowKey="(record, index) => record.listClearly"
			:rowSelection="rowSelection"
			:scroll="{ y: 350 }"
		>
			<span slot="serial" slot-scope="text, record, index"> {{ index + 1 }} </span>
			<template
				v-for="(col, i) in ['listClearly', 'explain', 'javaType', 'javaFiled']"
				:slot="col"
				slot-scope="text, record"
			>
				<div v-if="~['listClearly', 'explain', 'javaFiled'].indexOf(col)">
					<a-input
						:key="col"
						style="margin: -5px 0;width: 100%;"
						:value="text"
						@change="(e) => handleChange(e.target.value, record.listClearly, col)"
					/>
				</div>
				<div v-else-if="~['javaType'].indexOf(col)">
					<a-select
						:key="col"
						style="margin: -5px 0;width: 100%;"
						:value="text"
						@change="(e) => handleChange(e, record.listClearly, col)"
					>
						<a-select-option v-for="(item, index) in javaType" :key="index" :value="item.value">
							{{ item.text }}
						</a-select-option>
					</a-select>
				</div>
				<div v-else-if="~['fieldType'].indexOf(col)">
					<a-select
						:key="col"
						style="margin: -5px 0;width: 100%;"
						:value="text"
						@change="(e) => handleChange(e, record.listClearly, col)"
					>
						<a-select-option v-for="(item, index) in fieldType" :key="index" :value="item.value">
							{{ item.text }}
						</a-select-option>
					</a-select>
				</div>
			</template>
		</a-table> -->
		<t-editable-table
			ref="tabel1"
			:columns="columns"
			:dataSource="dataSource"
			:maxHeight="300"
			:rowNumber="true"
			:rowSelection="true"
			:actionButton="true"
			@valueChange="valueChange"
		/>
	</div>
</template>

<script>
import TEditableTable from './genTable';
import { FormTypes, validateTable, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/TEditableTableUtil';
export default {
	name: 'UserForm',
	props: {
		data: {
			type: Array,
		},
	},
	components: { TEditableTable },
	data() {
		return {
			columns: [
				{
					title: '??????',
					dataIndex: 'listClearly',
					align: 'center',
					type: FormTypes.input,
					defaultValue: '',
					placeholder: '?????????${title}',
					validateRules: [{ required: true, message: '${title}????????????' }],
				},
				{
					title: '??????',
					dataIndex: 'explain',
					align: 'center',
					type: FormTypes.input,
					defaultValue: '',
					placeholder: '?????????${title}',
					validateRules: [{ required: true, message: '${title}????????????' }],
				},
				{
					title: 'java??????',
					dataIndex: 'javaType',
					align: 'center',
					type: FormTypes.select,
					defaultValue: '',
					placeholder: '?????????${title}',
					validateRules: [{ required: true, message: '${title}????????????' }],
					options: [
						{ text: 'String', value: 'String' },
						{ text: 'Integer', value: 'Integer' },
						{ text: 'Double', value: 'Double' },
						{ text: 'Date', value: 'Date' },
						{ text: 'BigDecimal', value: 'BigDecimal' },
						{ text: 'Text', value: 'Text' },
						{ text: 'Blob', value: 'Blob' },
					],
				},
				{
					title: 'java????????????',
					dataIndex: 'javaFiled',
					align: 'center',
					type: FormTypes.input,
					defaultValue: '',
					placeholder: '?????????${title}',
					validateRules: [{ required: true, message: '${title}????????????' }],
				},
			],
			formData: [],
			dataSource: [],
			javaType: [
				{ text: 'String', value: 'String' },
				{ text: 'Integer', value: 'Integer' },
				{ text: 'Double', value: 'Double' },
				{ text: 'Date', value: 'Date' },
				{ text: 'BigDecimal', value: 'BigDecimal' },
				{ text: 'Text', value: 'Text' },
				{ text: 'Blob', value: 'Blob' },
			],
			fieldType: [
				{ text: 'varchar', value: 'varchar' },
				{ text: 'int', value: 'int' },
				{ text: 'timestamp', value: 'timestamp' },
				{ text: 'datetime', value: 'datetime' },
				{ text: 'text', value: 'text' },
				{ text: 'tinyint', value: 'tinyint' },
			],
			formType: [
				{ text: 'textbox', value: 'textbox' },
				{ text: 'numberbox', value: 'numberbox' },
				{ text: 'datetimebox', value: 'datetimebox' },
				{ text: 'datetime', value: 'datetime' },
				{ text: 'text', value: 'text' },
				{ text: 'tinyint', value: 'tinyint' },
			],
			selectedRowKeys: [],
			validationList: [
				{ text: '??????', value: '/^([a-zA-Z]|[0-9])(\\w|\\-)+@[a-zA-Z0-9]+\\.([a-zA-Z]{2,4})$/' },
				// { text: '??????', value: '/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/' },
				// { text:'url', value: /^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$/ },
				{ text: '?????????', value: '/^1[3|4|5|7|8][0-9]\\d{8}$/' },
				// { text: '?????????', value: '/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/' },
				// { text:'????????????', value:/^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$/ },
				{ text: '?????????', value: '/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/' },
				{ text: '????????????', value: '/[1-9]\d{5}(?!\d)/' },
				{ text: '6???18???????????????', value: '/^.{6,18}$/' },
				{ text: '??????', value: '/^[A-Za-z]+$/' },
				{ text: '??????????????????????????????????????????', value: '/^\w+$/' },
				{ text: '?????????????????????', value: '/^[A-Za-z0-9]+$/' },
				{ text: '????????????', value: '/^\d{4}-\d{1,2}-\d{1,2}/' },
			],
		};
	},
	watch: {
		data: {
			immediate: true,
			handler: function(newValue) {
				this.dataSource = newValue;
			},
		},
	},
	mounted() {
		this.dataSource = this.data;
	},
	computed: {
		rowSelection() {
			return {
				selectedRowKeys: this.selectedRowKeys,
				onChange: this.onSelectChange,
			};
		},
	},
	methods: {
		getDataListByProp() {
			return this.dataSource;
		},
		getAllTable() {
			return Promise.all([getRefPromise(this, 'tabel1')]);
		},
		onLoadData(data) {
			this.dataSource = data;
			console.log(this.dataSource);
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		getDataList(val) {
			this.dataSource = val;
		},
		// ?????????????????????
		handleChange(value, key, column, index) {
			const newData = [...this.dataSource];
			const target = newData[index];
			if (target) {
				target[column] = value;
				this.dataSource = newData;
				this.$emit('changeRows', this.dataSource);
			}
		},
		valueChange(val) {
			this.handleChange(val.value, val.row.listClearly, val.column.key, val.index);
		},
	},
};
</script>

<style scoped></style>
