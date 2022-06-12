/**
 * 新增修改完成调用 handleOk方法 编辑弹框组件ref定义为createModal
 * /$$
 $ @Description: 单表
 $ @Author: 黄婷
 $ @Date: 2021-01-18 15:17:28
 $ @LastEditTime: 2021-05-21 14:40:42
 $ @LastEditors: 黄婷
 $ @FilePath: \misboot-cloud-topvui\src\mixins\simpleListMixin.js
 $/
 */
import {
	ACCESS_TOKEN
} from '@/store/mutation-types'
import Vue from 'vue'
import {
	baseUrl
} from '@/services/baseUrl'
export const dataGridMixin = {
	data() {
		return {}
	},
	created() {},
	methods: {
		/* -------------------------------- ----单个数据表格操作开始----- ----------------------------------- */
		// 新增
		handleAdd: function(parame) {
			const form = this.$refs.createModal.form
			form.resetFields() // 清理表单数据（可不做)
			if (parame) {
				if (JSON.stringify(parame) === "{}") {
					this.$message.warn('请选择需要操作的数据', 1.5)
					return
				} else {
					this.mdl = parame
					this.visible = true
					if (this.$refs.createModal.add) this.$refs.createModal.add(this.mdl)
				}
			} else {
				this.mdl = {}
				this.visible = true
				if (this.$refs.createModal.add) this.$refs.createModal.add(this.mdl)
			}
		},
		// 插入
		handleInsert: function(parame) {
			const form = this.$refs.createModal.form
			form.resetFields() // 清理表单数据（可不做)
			if (parame.orderNo) {
				this.mdl = parame
				this.visible = true
				if (this.$refs.createModal.add) this.$refs.createModal.add(this.mdl)
			} else {
				// if (JSON.stringify(parame) === "{}") {
					this.$message.warn('请选择需要操作的数据行', 1.5)
					return
				// }
			}
		},
		// 编辑
		handleEdit: function(record, paramar) {
			// const form = this.$refs.createModal.form
			// form.resetFields() // 清理表单数据（可不做）
			if (!record) {
				this.$message.warn('请选择需要操作的数据', 1.5)
			} else {
				this.visible = true
				this.mdl = {
					...record,
					...paramar
				}
				if (this.$refs.createModal.edit) this.$refs.createModal.edit(this.mdl)
			}
		},
		handleMap: function(record, paramar) {
			if (!record) {
				this.$message.warn('请选择需要操作的数据', 1.5)
			} else {
				this.mapVisible = true
				this.map = {
					...record,
					...paramar
				}
				// if (this.$refs.createMapModal.map) this.$refs.createMapModal.map(this.map)
			}
		},
		// 提交表单
		handleOk: function(paramar) {
			const form = this.$refs.createModal.form
			this.confirmLoading = true
			let url = ''
			form.validateFields((errors, values) => {
				// if(type)fromValue.isRelease = type
				let fromValue = {
					...values,
					...paramar
				}
				if (!errors) {
					if (values.uuid) {
						// 修改 e.g.
						url = this.url.update
					} else {
						url = this.url.save
					}
					console.log("================", url)
					this.$post(url, fromValue).then((res) => {
						if (res.statusCode === 200 || res === 1) {
							this.$refs.table.rows = null
							this.$refs.table.rowKeys = null
							this.visible = false
							// 刷新表格
							if (this.fetch) {
								this.fetch(this.queryParam)
							} else {
								this.$refs.table.refresh()
							}
							this.$message.success(res.message || '操作成功', 1.5)
						} else {
							this.$message.success(res.message || '操作失败', 1.5)
						}
					}).finally(() => {
						this.confirmLoading = false
					})
				} else {
					this.confirmLoading = false
				}
			})
		},
		// 保存提交并导入线路点的表单
		handleImportOk: function(paramar) {
			const form = this.$refs.createModal.form
			this.confirmLoading = true
			let url = ''
			form.validateFields((errors, values) => {
				// if(type)fromValue.isRelease = type
				let fromValue = {
					...values,
					...paramar
				}
				if (!errors) {
					if (values.uuid) {
						// 修改 e.g.
						url = this.url.update
					} else {
						url = this.url.save
					}
					console.log("================", url)
					this.$post(url, fromValue).then((res) => {
						if (res.statusCode === 200 || res === 1) {
							this.$refs.table.rows = null
							this.$refs.table.rowKeys = null
							this.visible = false
							// 刷新表格
							if (this.fetch) {
								this.fetch(this.queryParam)
							} else {
								this.$refs.table.refresh()
							}
							this.$message.success(res.message || '操作成功', 1.5)
						} else {
							this.$message.success(res.message || '操作失败', 1.5)
						}
					}).finally(() => {
						this.confirmLoading = false
					})
				} else {
					this.confirmLoading = false
				}
			})
		},
		// 导入线路点
		importLocationPoint: function(paramar) {
			const form = this.$refs.createModal.form
			this.confirmLoading = true
			let url = ''
			form.validateFields((errors, values) => {
				// if(type)fromValue.isRelease = type
				let fromValue = {
					...values,
					...paramar
				}
				if (!errors) {
					// if (values.uuid) {
					// 	// 修改 e.g.
					// 	url = this.url.update
					// } else {
					// 	url = this.url.save
					// }
					url = this.url.importLocationPoint;
					if(fromValue.type === '线路组件导入') {
						fromValue.type = '1';
						fromValue.lineGroupId = fromValue.importPoint;
						fromValue.pid = '';
					}else if(fromValue.type === '复制线路位置点') {
						fromValue.type = '2';
						fromValue.lineGroupId = '';
						fromValue.pid = fromValue.importPoint
					}
					console.log("================", url);
					this.$post(url, fromValue).then((res) => {
						if (res.statusCode === 200 || res === 1) {
							this.$refs.table.rows = null
							this.$refs.table.rowKeys = null
							// this.visible = true
							// 刷新表格
							if (this.fetch) {
								this.fetch(this.queryParam)
							} else {
								this.$refs.table.refresh()
							}
							this.$message.success(res.message || '操作成功', 1.5)
						} else {
							this.$message.success(res.message || '操作失败', 1.5)
						}
					}).finally(() => {
						this.confirmLoading = false
					})
				} else {
					this.confirmLoading = false
				}
			})
		},
		// 删除
		handleSub(record, paramar) {
			const that = this
			let uuids = ''
			if (!record || record.length === 0) {
				this.$message.warn('请勾选需要删除的数据', 1.5)
				return
			} else if (record && record[0]) {
				uuids = record.toString()
			} else {
				uuids = record.uuid
			}
			let value = {
				uuid: uuids,
				...paramar
			}
			that.$confirm({
				title: '警告',
				content: `确定要执行该操作吗?`,
				okText: '删除',
				okType: 'danger',
				cancelText: '取消',
				onOk() {
					// 在这里调用删除接口
					that.$post(that.url.deleteBatch, value).then((res) => {
						if (res.statusCode === 200 || res === 1) {
							that.$message.success(res.message, 1.5)
							if (that.fetch) {
								that.fetch(that.queryParam)
							} else {
								that.$refs.table.refresh()
							}
						} else {
							that.$message.error(res.message, 1.5)
						}
					})
				},
				onCancel() {}
			})
		},
		// 取消
		handleCancel() {
			// console.log("-------------------------------");
			this.mdl = null
			this.visible = false
			// let form = {}
			// form = this.$refs.createModal.form
			// form.resetFields()
		},
		// 取消
		handleCancelMap() {
			// console.log("-------------------------------");
			this.map = null
			this.mapVisible = false
			// let form = {}
			// form = this.$refs.createModal.form
			// form.resetFields()
		},
		/* -------------------------------- ----单个数据表格操作结束----- ----------------------------------- */

		// 生成随机字符串 + 时间戳
		randomString(len) {
			len = len || 8;
			let timestamp = new Date().getTime().toString();
			/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/

			let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			let maxPos = $chars.length;
			let randomStr = '';
			for (let i = 0; i < len; i++) {
				randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			//随机数11位

			return randomStr + timestamp.substring(10);
		},

		//合同导出测试
		handleExportXlsTest(columns, tablesName, type, record, paramar) {
			// console.log("record", record);
			const that = this
			let uuids = ''
			let text = '',
				field = ''
			let len = columns.length
			columns.forEach((e, index) => {
				if (index === 0 || index === (len - 1)) return
				text += e.title + ','
				let f = e.dataIndex.replace(/([A-Z])/g, "_$1").toLowerCase();
				field += f + ','
			})
			let url = '';
			if (type === 1) {
				url = `${baseUrl}${this.url.exportExcelUrl}`
				// url = `${baseUrl}`
			} else {
				url = `${baseUrl}`
			}
			if (!record || record.length === 0) {

			} else if (record && record[0]) {
				uuids = record.toString()
			} else {
				uuids = record.uuid
			}
			window.location.href = encodeURI(url + '?tablesName=' + tablesName + '&fieldName=' + field +
				'&textName=' + text +
				'&token=' + Vue.ls.get(ACCESS_TOKEN) + '&ids=' + uuids)
		},


		/* 导出 */
		handleExportXls(columns, tablesName, type) {
			let text = '',
				field = ''
			let len = columns.length
			columns.forEach((e, index) => {
				if (index === 0 || index === (len - 1)) return
				text += e.title + ','
				let f = e.dataIndex.replace(/([A-Z])/g, "_$1").toLowerCase();
				field += f + ','
			})
			let url = '';
			if (type === 1) {
				url = `${baseUrl}${this.url.exportExcelUrl}`
				// url = `${baseUrl}`
			} else {
				url = `${baseUrl}`
			}
			// const test = url + '?tablesName=' + tablesName + '&fieldName=' + field + '&textName=' + text +
			// 	'&token=' + Vue.ls.get(ACCESS_TOKEN)
			// const test = url + '/line/lineLocationPoint/export?token=' + Vue.ls.get(ACCESS_TOKEN)
			// console.log('url:', test);
			window.location.href = encodeURI(url + '?tablesName=' + tablesName + '&fieldName=' + field +
				'&textName=' + text +
				'&token=' + Vue.ls.get(ACCESS_TOKEN))
			// window.location.href = encodeURI(url + '/line/lineLocationPoint/export?token=' + Vue.ls.get(ACCESS_TOKEN))
		},
		handleExportXls2(fileName) {
			if (!fileName || typeof fileName != "string") {
				fileName = "导出文件"
			}
			let param = {
				...this.queryParam
			};
			if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
				param['selections'] = this.selectedRowKeys.join(",")
			}
			downFile(this.url.exportXlsUrl, param).then((data) => {
				if (!data) {
					this.$message.warning("文件下载失败", 1.5)
					return
				}
				if (typeof window.navigator.msSaveBlob !== 'undefined') {
					window.navigator.msSaveBlob(new Blob([data], {
						type: 'application/vnd.ms-excel'
					}), fileName + '.xls')
				} else {
					let url = window.URL.createObjectURL(new Blob([data], {
						type: 'application/vnd.ms-excel'
					}))
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = url
					link.setAttribute('download', fileName + '.xls')
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link); //下载完成移除元素
					window.URL.revokeObjectURL(url); //释放掉blob对象
				}
			})
		},
		/* 导入 */
		handleImportExcel(info, type) {
			if (info.file.status === 'done') {
				if (info.file.response.statusCode) {
					if (info.file.response.statusCode === 200) {
						let url = `${this.url.importExcelUrl}`
						this.$post(url, {
							address: info.file.response.filePath
						}).then((res) => {
							if (res.statusCode === 200 || res === 1) {
								this.$message.success(res.message, 1.5)
								if (type) {
									this.$refs[type].refresh()
								} else {
									this.$refs.table.refresh()
								}
							} else {
								this.$message.error(res.message, 1.5)
							}
						})
					} else {
						this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
					}
					// this.$refs.table.refresh()
				} else {
					this.$message.error(`${info.file.name} ${info.file.response.message}.`);
				}
			} else if (info.file.status === 'error') {
				this.$message.error(`文件上传失败: ${info.file.msg} `);
			}
		},
		handleImportExcelXS2(info) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				if (info.file.response.statusCode) {
					if (info.file.response.statusCode === 200) {
						let url = `${this.url.importExcelUrl}`
						this.$post(url, {
							address: info.file.response.filePath,
							orgId: this.queryParam.orgId
						}).then((res) => {
							console.log(res)
							if (res.statusCode === 200 || res === 1) {
								this.$message.success("导入成功", 1.5)
								if (this.$refs.table) this.$refs.table.refresh()
							} else {
								this.$message.info(res.message, 1.5)
							}
						})
					} else {
						this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`, 1.5)
					}
					// this.loadData()
				} else {
					this.$message.error(`${info.file.name} ${info.file.response.message}.`, 1.5);
				}
			} else if (info.file.status === 'error') {
				this.$message.error(`文件上传失败: ${info.file.msg} `, 1.5);
			}
		},
		/* 图片预览 */
		// getImgView(text){
		//   if(text && text.indexOf(",")>0){
		//     text = text.substring(0,text.indexOf(","))
		//   }
		//   return getFileAccessHttpUrl(text)
		// },
		// /* 文件下载 */
		// // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
		// downloadFile(text){
		//   if(!text){
		//     this.$message.warning("未知的文件")
		//     return;
		//   }
		//   if(text.indexOf(",")>0){
		//     text = text.substring(0,text.indexOf(","))
		//   }
		//   let url = getFileAccessHttpUrl(text)
		//   window.open(url);
		// },
	}
}
