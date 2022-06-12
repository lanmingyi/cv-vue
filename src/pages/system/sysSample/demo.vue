<template>
	<a-card>
		<edatagrid
			ref="editableTable"
			size="small"
			:columns="columns"
			:dataSource="dataSource"
			:rowNumber="true"
			:rowSelection="true"
			:actionButton="true"
			:dragSort="true"
			style="margin-top: 8px;"
			:interface="url"
			@selectRowChange="handleSelectRowChange"
		>
			<template v-slot:action="props">
				<a @click="handleDelete(props)">删除</a>
			</template>
		</edatagrid>
	</a-card>
</template>

<script>
import moment from 'moment';
import { FormTypes } from '@/utils/TEditableTableUtil';
// import { randomUUID, randomNumber } from '@/utils/util'
import edatagrid from '@/components/TopVUI/custom/TEdataCell';
import { dataListMixin } from '@/mixins/dataListMixin';

export default {
	name: 'DefaultTable',
	mixins: [dataListMixin],
	components: { edatagrid },
	data() {
		return {
			loading: false,
			columns: [
				{
					title: '#',
					width: '50px',
					align: 'center',
					scopedSlots: {
						customRender: 'serial',
					},
				},
				{
					title: '名称',
					dataIndex: 'name',
					type: 'text',
					defaultValue: '',
					placeholder: '请输入${title}',
					ellipsis: true,
					scopedSlots: {
						customRender: 'name',
					},
				},
				{
					title: '年龄',
					dataIndex: 'age',
					type: 'numberbox',
					defaultValue: '',
					placeholder: '请输入${title}',
					ellipsis: true,
					scopedSlots: {
						customRender: 'age',
					},
					option: {
						min: 0,
					},
				},
				{
					title: '性别',
					dataIndex: 'sex',
					width: '400px',
					sorter: true,
					needTotal: true,
					type: 'combbox',
					defaultValue: '',
					placeholder: '请输入${title}',
					ellipsis: true,
					scopedSlots: {
						customRender: 'sex',
					},
					option: {
						list: [
							{ label: '男', value: 1 },
							{ label: '女', value: 2 },
						],
					},
				},
				{
					title: '生日',
					dataIndex: 'testDate',
					needTotal: true,
					type: 'datebox',
					defaultValue: '',
					placeholder: '请输入${title}',
					ellipsis: true,
					scopedSlots: {
						customRender: 'testDate',
					},
				},
				{
					title: '注册时间',
					dataIndex: 'testDatetime',
					sorter: true,
					type: 'dateTime',
					defaultValue: '',
					placeholder: '请输入${title}',
					ellipsis: true,
					scopedSlots: {
						customRender: 'testDatetime',
					},
				},
				{
					title: '排序',
					dataIndex: 'testCombobox',
					align: 'center',
					type: 'combbox',
					defaultValue: '',
					placeholder: '请输入${title}',
					ellipsis: true,
					scopedSlots: {
						customRender: 'testCombobox',
					},
					option: {
						list: [
							{ label: '排序', value: 1 },
							{ label: '不排序', value: 2 },
						],
					},
				},
			],
			dataSource: [],
			selectedRowIds: [],
			url: {
				masterList: '/system/testDemo/getPageSet',
				masterDelete: '/system/dicSet/delete',
				masterAdd: '/system/dicSet/save',
				masterUpdate: '/system/dicSet/update',
				subList: '/system/dicItem/getPageSet',
				subDelete: '/system/dicItem/delete',
				subAdd: '/system/dicItem/save',
				subUpdate: '/system/dicItem/update',
			},
		};
	},
	mounted() {
		// this.randomData(23, false)
		this.fetch();
	},
	methods: {
		fetch(params) {
			this.$post('/system/config/getPageSetData', params).then((res) => {
				const pager = { ...this.pagination };
				pager.total = res.totalCount;
				this.dataSource = res.rows;
			});
		},
		/** 表单验证 */
		handleTableCheck() {
			this.$refs.editableTable.getValues((error) => {
				if (error === 0) {
					this.$message.success('验证通过');
				} else {
					this.$message.error('验证未通过');
				}
			});
		},
		/** 获取值，忽略表单验证 */
		handleTableGet() {
			this.$refs.editableTable.getValues((error, values) => {
				console.log('values:', values);
			}, false);
			console.log('deleteIds:', this.$refs.editableTable.getDeleteIds());

			this.$message.info('获取值成功，请看控制台输出');
		},
		/** 模拟加载1000条数据 */
		handleTableSet() {
			this.randomData(1000, true);
		},

		handleSelectRowChange(selectedRowIds) {
			this.selectedRowIds = selectedRowIds;
		},

		/* 随机生成数据 */
		// randomData(size, loading = false) {
		//   if (loading) {
		//     this.loading = true
		//   }

		//   let randomDatetime = () => {
		//     let time = parseInt(randomNumber(1000, 9999999999999))
		//     return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
		//   }

		//   let begin = Date.now()
		//   let values = []
		//   for (let i = 0; i < size; i++) {
		//     values.push({
		//       id: randomUUID(),
		//       dbFieldName: `name_${i + 1}`,
		//       // dbFieldTxt: randomString(10),
		//       multipleSelect: ['string', ['int', 'double', 'boolean'][randomNumber(0, 2)]],
		//       dbFieldType: ['string', 'int', 'double', 'boolean'][randomNumber(0, 3)],
		//       dbLength: randomNumber(0, 233),
		//       datetime: randomDatetime(),
		//       isNull: ['Y', 'N'][randomNumber(0, 1)]
		//     })
		//   }

		//   this.dataSource = values
		//   let end = Date.now()
		//   let diff = end - begin

		//   if (loading && diff < size) {
		//     setTimeout(() => {
		//       this.loading = false
		//     }, size - diff)
		//   }

		// },

		handleDelete(props) {
			let { rowId, target } = props;
			target.removeRows(rowId);
		},
	},
};
</script>

<style scoped></style>
