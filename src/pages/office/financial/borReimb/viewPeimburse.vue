<template>
	<a-form :form="form">
		<div class="account-center-avatarHolder">
			<table class="table-ant" style="table-layout: fixed; word-break: break-all;">
				<thead>
					<tr>
						<th colspan="6" style="text-align: center;padding-bottom: 30px;">支出报销单</th>
					</tr>
				</thead>
				<tr>
					<td style="text-align: center;">流水号:</td>
					<td colspan="2">
						<a-form-item>
							<a-input
								style="border-bottom: 1px solid #e7e7e7;border-radius: inherit;"
								v-decorator="['serialNumber']"
								placeholder="自动生成"
								readOnly
							/>
						</a-form-item>
					</td>
					<td style="text-align: center;">填报日期:</td>
					<td colspan="2">
						<a-form-item>
							<t-date
								v-decorator="['fillingDate']"
								style="width: 100%;"
								:showTime="true"
								dateFormat="YYYY-MM-DD HH:mm:ss"
								allowClear
							/>
						</a-form-item>
					</td>
				</tr>
				<tr class="table_tr">
					<td>报销类型</td>
					<td colspan="5">
						<a-form-item>
							<a-select
								v-decorator="['reimbursementType', { rules: [{ required: true, message: '必填！' }] }]"
								style="width: 200px"
							>
								<a-select-option v-for="item in typeList" :key="item.text" @click="typeChange(item)">
									{{ item.text }}
								</a-select-option>
							</a-select>
							<a-select
								v-decorator="[
									'reimbursementTypeSon',
									{ rules: [{ required: true, message: '必填！' }] },
								]"
								style="width: 200px;padding-left: 20px;"
							>
								<a-select-option v-for="items in typeSonList" :key="items.text">
									{{ items.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</td>
				</tr>
				<tr class="table_tr">
					<td>报销单位</td>
					<td colspan="2">
						<a-form-item>
							<tree-select
								v-decorator="[
									'loanDepartmentName',
									{ initialValue: loanDepartmentName, rules: [{ required: true, message: '必填' }] },
								]"
								:treeValueText="loanDepartmentName"
								placeholder="报销单位"
								:parameter="parameterOrg"
								:url="urlOrg"
								:data="treeData"
								idfield="id"
								textfield="text"
								@change="selectOrg"
							/>
						</a-form-item>
					</td>
					<td>填报人</td>
					<td colspan="2">
						<a-form-item>
							<user-popup
								:visible="visiblePopup"
								style="width: 100%;"
								@change="(value, other) => popupCallback(value, other)"
								@close="() => (visiblePopup = false)"
								:typeNum="1"
							/>
							<a-input
								@click="() => (visiblePopup = true)"
								v-decorator="[
									'loanUser',
									{ initialValue: loanUser, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="填报人"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</td>
				</tr>
				<tr class="table_tr">
					<td>报销是由</td>
					<td colspan="5">
						<a-form-item>
							<a-input
								v-decorator="['subjectMatter', { rules: [{ required: true, message: '必填！' }] }]"
							/>
						</a-form-item>
					</td>
				</tr>
				<tr class="table_tr">
					<td colspan="6">报销明细</td>
				</tr>
				<tr class="table_tr">
					<td style="text-align: center;">分类</td>
					<td style="text-align: center;">事由</td>
					<td style="text-align: center;">单据(张)</td>
					<td style="text-align: center;">关联借款流水号</td>
					<td style="text-align: center;">金额(元)</td>
					<td style="text-align: center;">操作/<a @click="addline()">新增行</a></td>
				</tr>
				<tr class="table_tr" v-for="(item, index) in detailData" :key="index">
					<td style="text-align: center;">
						<a-input v-model="item.classification" />
					</td>
					<td style="text-align: center;">
						<a-input v-model="item.subjectMatter" />
					</td>
					<td style="text-align: center;">
						<a-input v-model="item.bill" />
					</td>
					<td style="text-align: center;">
						<a-input v-model="item.loanSerialNumber" />
					</td>
					<td style="text-align: center;">
						<a-input v-model="item.amountOfMoney" @change="changeNum" />
					</td>
					<td style="text-align: center;" class="no-print">
						<a>上传凭据</a>
						<a-divider type="vertical" />
						<a @click="deleteBtn(item, index)">删除</a>
					</td>
				</tr>
				<tr class="table_tr">
					<td>共计</td>
					<td colspan="2">
						<a-form-item>
							<a-input
								v-decorator="['reimbursementMoney', { initialValue: reimbursementMoney }]"
								readOnly
							/>
						</a-form-item>
					</td>
					<td>金额大写</td>
					<td colspan="2">
						<a-form-item>
							<a-input
								v-decorator="[
									'reimbursementMoneyCapitalization',
									{ initialValue: reimbursementMoneyCapitalization },
								]"
								readOnly
							/>
						</a-form-item>
					</td>
				</tr>
				<tr class="table_tr" v-if="approvalList">
					<td :rowspan="approvalList.length">审批意见</td>
					<td colspan="2" style="text-align: center;">流程环节</td>
					<td style="text-align: center;">状态</td>
					<td colspan="2" style="text-align: center;">审批意见</td>
				</tr>
				<tr class="table_tr line-height-80" v-for="(item, index) in approvalList.slice(1)" :key="index">
					<td colspan="2" style="text-align: center;">{{ item.activityName }}</td>
					<td style="text-align: center;">
						{{ item.comment.typeName }}
					</td>
					<td colspan="2" style="text-align: center;">{{ item.comment.message }}</td>
				</tr>
				<tr class="table_tr">
					<td height="150">备注</td>
					<td height="150" colspan="5">
						<a-form-item>
							<a-input
								type="textarea"
								style="width: 100%;height: 100%;margin-top: 5px;"
								v-decorator="['remarks']"
							/>
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['loanUserId']" type="hidden" />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['reimbursementTypeUuid']" type="hidden" />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['loanDepartmentId']" type="hidden" />
						</a-form-item>
					</td>
				</tr>
			</table>
		</div>
	</a-form>
</template>

<script>
import pick from 'lodash.pick';
import moment from 'moment';

import Editor from '@/components/TopVUI/custom/Editor/index.vue';
import UserPopup from '@/components/TopVUI/custom/userPopup';
import TreeSelect from '@/components/TopVUI/custom/TreeSelect';
// 表单字段
const fields = [
	'uuid',
	'serialNumber',
	'fillingDate',
	'loanUser',
	'loanUserId',
	'loanDepartmentName',
	'subjectMatter',
	'loanMoney',
	'loanMoneyCapitalization',
	'agentName',
	'finaAudit',
	'leaderReview',
	'cashName',
	'remarks',
	'loanRepaymentDateStr',
	'loanDepartmentId',
];

export default {
	components: {
		Editor,
		UserPopup,
		TreeSelect,
	},
	props: {
		loading: {
			type: Boolean,
			default: () => false,
		},
		organList: {
			type: Array,
			default: () => [],
		},
		isView: {
			type: Boolean,
		},
		drawingList: {
			type: Object,
			default: () => null,
		},
	},
	data() {
		return {
			form: this.$form.createForm(this),
			url: {
				getDetailByUuid: '/office/officeFinance/getDetailByUuid',
				getListCommentsByBusinessKey: '/workflow/apiFlowableProcessInstance/getListCommentsByBusinessKey',
				//获取审批步骤数据 businessKey
			},
			urlOrg: {
				fathersUrl: '/mdata/organization/getListByLevelId?levelId=1',
				expandUrl: '/mdata/organization/getListByPid',
			},
			parameterOrg: {
				father: {
					levelId: 1,
				},
				children: {},
			},
			isClear: true,
			uuid: '',
			trainContent: '',
			loanMoneyCapitalization: '',
			loanMoney: '',
			visiblePopupNotice: false,
			loanUser: '',
			showSave: false,
			treeData: [],
			approvalList: [],
			approvalSplitList: [],
		};
	},
	watch: {
		loanMoney(val) {
			console.log('val', val);
		},
	},
	methods: {
		moment,
		changeNum() {
			this.$nextTick(() => {
				this.form.validateFields((errors, values) => {
					if (values.loanMoney) {
						this.loanMoneyCapitalization = this.changeCapital(Number(values.loanMoney));
					} else {
						this.loanMoneyCapitalization = '';
					}
					this.form.setFieldsValue({
						loanMoneyCapitalization: this.loanMoneyCapitalization,
					});
				});
			});
		},
		changeCapital(n) {
			if (n == 0) {
				return '零';
			}
			if (!/^(\+|-)?(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法';
			var unit = '仟佰拾亿仟佰拾万仟佰拾元角分',
				str = '';
			n += '00';
			var a = parseFloat(n);
			if (a < 0) {
				n = n.substr(1);
			}
			var p = n.indexOf('.');
			if (p >= 0) {
				n = n.substring(0, p) + n.substr(p + 1, 2);
			}
			unit = unit.substr(unit.length - n.length);
			for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
			if (a > 0) {
				return str
					.replace(/零(仟|佰|拾|角)/g, '零')
					.replace(/(零)+/g, '零')
					.replace(/零(万|亿|元)/g, '$1')
					.replace(/(亿)万|壹(拾)/g, '$1$2')
					.replace(/^元零?|零分/g, '')
					.replace(/元$/g, '元整');
			} else {
				return (
					'负' +
					str
						.replace(/零(仟|佰|拾|角)/g, '零')
						.replace(/(零)+/g, '零')
						.replace(/零(万|亿|元)/g, '$1')
						.replace(/(亿)万|壹(拾)/g, '$1$2')
						.replace(/^元零?|零分/g, '')
						.replace(/元$/g, '元整')
				);
			}
		},
		popupCallNoticeback(value, other) {
			this.$nextTick(() => {
				console.log('value', value);
				this.loanUser = value.userName;
				this.form.setFieldsValue({
					loanUser: this.loanUser,
					loanUserId: value.userNameId,
					loanDepartmentName: value.orgName,
					loanDepartmentId: value.orgId,
				});
			});
		},
		add(m) {
			console.log('add', m);
			this.amountWord = '';
			this.loanUser = '';
			this.loanMoney = '';
			this.loanMoneyCapitalization = '';
			this.form.setFieldsValue(pick(m, fields));
			this.showSave = false;
		},
		edit(m) {
			console.log('edit', m);
			this.amountWord = '';
			this.loanUser = '';
			this.showSave = true;
			this.form.setFieldsValue(pick(m, fields));
			this.form.setFieldsValue({
				loanRepaymentDateStr: moment(m.loanRepaymentDateStr).format('YYYY-MM-DD HH:mm:ss'),
			});
		},
		changeEditor(e) {
			this.trainContent = e;
			this.form.setFieldsValue({
				trainContent: e,
			});
		},
		selectOrg(value, node) {
			this.$nextTick(() => {
				this.loanDepartmentId = value;
				this.loanDepartmentName = node ? node.toString() : '';
				this.form.setFieldsValue({
					loanDepartmentId: this.loanDepartmentId,
					loanDepartmentName: this.loanDepartmentName,
				});
			});
		},
	},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));
		// 当 model 发生改变时，为表单设置值
		console.log('this.drawingList', this.drawingList);
		if (this.drawingList) {
			this.$post(this.url.getListCommentsByBusinessKey, {
				businessKey: this.drawingList.uuid,
			}).then((res) => {
				if (res.statusCode == 200) {
					this.approvalList = res.commentBeans;
				}
			});
		}
		this.form.setFieldsValue(pick(this.drawingList, fields));
		this.$post(this.urlOrg.fathersUrl).then((res) => {
			this.treeData = res;
			this.treeData.forEach((e, index) => {
				this.treeData[index].title = e.text;
				this.treeData[index].label = e.text;
				this.treeData[index].index = index;
				this.treeData[index].value = e.text;
				this.treeData[index].key = e.id;
				this.treeData[index].levelId = e.levelId;
			});
		});
	},
};
</script>

<style lang="less" scoped>
/deep/.ant-form-item-control-wrapper {
	width: 100%;
	height: 100%;
}

.tab_table {
	width: 100%;
	min-height: 100px;
	background: #ffffff;
	border-radius: 8px;
	border: 1px solid #e7e7e7;
	margin-right: 10px;
	padding: 5px 5px 0 5px;
	max-height: 300px;
	overflow: auto;

	& span {
		padding: 3px 8px;
		margin-bottom: 5px;
	}
}

.item-box {
	display: flex;
	align-items: flex-start;
}

.account-center-avatarHolder {
	padding-top: 20px;
}

.table-ant {
	width: 80%;
	margin: 0 auto;
	padding: 10px 20px 10px;

	thead {
		font-size: 20px;
		font-weight: bold;
	}

	.table_tr {
		height: 40px;
		line-height: 40px;
		border: 1px solid #e7e7e7;
	}

	.line-height-80 {
		line-height: 80px;
	}

	.table_tr > td {
		border-right: 1px solid #e7e7e7;
		text-align: center;
		width: 100%;
	}

	input {
		border: none;
		width: 100%;
		height: 100%;
		outline: none;
		background: transparent;
	}

	textarea {
		border: none;
		width: 100%;
		height: 100%;
		outline: none;
		background: transparent;
	}

	.table_tr > td:nth-child(2n) {
		text-align: left;
		// padding-left: 20px;
	}
}

.ant-form-item {
	display: flex;
	margin-bottom: 0 !important;
}

.ant-input:focus {
	border: none;
	box-shadow: none;
	background: transparent;
}

textarea,
textarea.ant-input:hover,
textarea:focus {
	// border: 1px solid #DAE2F3;
	-webkit-box-shadow: none;
	box-shadow: none;
	background: transparent;
}

/*去除页眉页脚*/
@page {
	size: auto;
	/* auto is the initial value */
	margin: 3mm;
	/* this affects the margin in the printer settings */
}

html {
	background-color: #ffffff;
	margin: 0;
	/* this affects the margin on the html before sending to printer */
}

body {
	border: solid 1px blue;
	margin: 10mm 15mm 10mm 15mm;
	/* margin you want for the content */
}

/*去除页眉页脚*/
</style>
