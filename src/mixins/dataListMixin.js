/* 
/**
 * 新增修改完成调用 handleOk方法 编辑弹框组件主表ref定义为masterModal，子表ref定义为subrModal
 $ @Description: 主子表
 $ @Author: 黄婷
 $ @Date: 2021-01-18 15:17:28
 $ @LastEditTime: 2021-05-21 14:34:17
 $ @LastEditors: 黄婷
 $ @FilePath: \misboot-cloud-topvui\src\mixins\dataListMixin.js
 $/ */
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { baseUrl } from '@/services/baseUrl.js'

export const dataListMixin = {
    data() {
        return {
            // token header
            tokenHeader: {
                'token': Vue.ls.get(ACCESS_TOKEN)
            },
        }
    },
    methods: {
        /* -------------------------------- ----主子表操作开始----- ----------------------------------- */
        // 新增
        handleAdd: function(e, param) {
            let form = {}
            if (e === 'master') {
                this.$refs.masterModal.title = '新增'
                this.masterVisible = true
                form = this.$refs.masterModal.form
                form.resetFields() // 清理表单数据（可不做)
                if (this.$refs.masterModal.add) this.$refs.masterModal.add(this.masterMdl)
                this.masterMdl = null
            } else {
                if (this.masterRows === null) {
                    this.$message.warn('请先选中需要操作的数据', 1.5)
                    return true
                }
                form = this.$refs.subModal.form
                form.resetFields() // 清理表单数据（可不做)
                this.$refs.subModal.title = '新增'
                this.subVisible = true
                this.subMdl = this.subQueryParam
                if (this.$refs.subModal.add) this.$refs.subModal.add(this.subMdl)
            }
        },
        // 编辑
        handleEdit: function(record, type) {
            if (type === 'master') {
                this.$refs.masterModal.title = '编辑'
                if (record === 'all') {
                    if (this.masterRows) {
                        this.masterVisible = true
                        this.masterMdl = this.masterRows
                        if (this.$refs.masterModal) this.$refs.masterModal.edit(this.masterMdl)
                    } else {
                        this.$message.warn('请先选中需要操作的数据', 1.5)
                        return true
                    }
                } else {
                    this.masterVisible = true
                    this.masterMdl = record


                    if (this.$refs.masterModal) this.$refs.masterModal.edit(this.masterMdl)
                }
            } else {
                if (record === 'all') {
                    if (this.subRows) {
                        this.subVisible = true
                        this.subMdl = this.subRows
                        if (this.$refs.subModal) this.$refs.subModal.edit(this.subMdl)
                    } else {
                        this.$message.warn('请先选中需要操作的数据', 1.5)
                        return true
                    }
                } else {
                    this.subVisible = true
                    this.subMdl = record
                    if (this.$refs.subModal) this.$refs.subModal.edit(this.subMdl)
                }
                this.$refs.subModal.title = '编辑'
            }
        },
        // 提交表单
        handleOk: function(e, paramar) {
            let form = {}
            let url = ''
            if (e === 'master') {
                form = this.$refs.masterModal.form
            } else {
                form = this.$refs.subModal.form
            }
            console.log(e, paramar)
            form.validateFields((errors, values) => {
                let fromValue = {...values, ...paramar }
                if (!errors) {
                    if (e === 'master') {
                        this.masterConfirmLoading = true
                        if (values.uuid) {
                            url = this.url.masterUpdate
                        } else {
                            url = this.url.masterAdd
                        }
                    } else {
                        this.subConfirmLoading = true
                        if (values.uuid) {
                            url = this.url.subUpdate
                        } else {
                            url = this.url.subAdd
                        }
                    }
                    this.$post(url, fromValue).then((res) => {
                        if (res === 1 || res.statusCode === 200) {
                            if (e === 'master') {
                                this.masterRows = null
                                this.masterVisible = false
                                this.uuids = ''
                                    // 刷新表格
                                if (this.$refs.masterList.refresh) {
                                    this.$refs.masterList.refresh()
                                }
                                if (this.fetch) {
                                    this.data = []
                                    this.fetch(this.queryParam)
                                }
                            } else {
                                this.subRows = null
                                this.subVisible = false
                                this.$refs.subList.refresh()
                            }
                            this.$message.success(res.message ? res.message : '操作成功', 1.5)
                        } else {
                            this.$message.error(res.message ? res.message : '操作失败', 1.5)
                        }
                    }).finally(() => {
                        this.masterConfirmLoading = false
                        this.subConfirmLoading = false
                    })
                }
            })
        },
        handleSignOk: function(e, type) {
            let form = {}
            let url = ''
            if (e === 'master') {
                form = this.$refs.masterModal.form
            } else {
                form = this.$refs.subModal.form
            }
            form.validateFields((errors, values) => {
                values.isRelease = type
                if (!errors) {
                    if (e === 'master') {
                        this.masterConfirmLoading = true
                        if (values.uuid) {
                            url = this.url.masterUpdate
                        } else {
                            url = this.url.masterAdd
                        }
                    } else {
                        this.subConfirmLoading = true
                        if (values.uuid) {
                            url = this.url.subUpdate
                        } else {
                            url = this.url.subAdd
                        }
                    }
                    this.$post(url, values).then((res) => {
                        if (res === 1 || res.statusCode === 200) {
                            if (e === 'master') {
                                this.masterVisible = false
                                    // 刷新表格
                                this.$refs.masterList.refresh()
                            } else {
                                this.subVisible = false
                                this.$refs.subList.refresh()
                            }
                            this.$message.success(res.message ? res.message : '操作成功', 1.5)
                        } else {
                            this.$message.success(res.message ? res.message : '操作失败', 1.5)
                        }
                    }).finally(() => {
                        this.masterConfirmLoading = false
                        this.subConfirmLoading = false
                    })
                }
            })
        },
        handleJsonOk(e) {
            let form = {}
            let url = ''
            form = this.$refs.masterModal.form
            this.masterConfirmLoading = true
            form.validateFields((errors, values) => {
                const fileData = {
                    jsonDataFormmyDialogApplication: JSON.stringify(values),
                    haveUserArr: values.divWhether01,
                    noUserArr: values.divWhether02
                }
                if (!errors) {
                    if (values.uuid) {
                        url = this.url.jsonUpdate
                    } else {
                        url = this.url.jsonSave
                    }
                    this.$post(url, fileData).then((res) => {
                        if (res === 1 || res.statusCode === 200) {
                            this.$message.success(res.message, 1.5)
                        } else {
                            this.$message.error(res.message, 1.5)
                        }
                        // 刷新表格
                        this.$refs.masterList.refresh()
                    }).finally(() => {
                        this.masterVisible = false
                        this.masterConfirmLoading = false
                    })
                } else {
                    this.masterConfirmLoading = false
                }
            })
        },
        // 勾选事件
        onSelectChangeMaster(selectedRowKeys, selectedRows) {
			console.log("onSelectChangeMaster()",selectedRowKeys, selectedRows);
            this.masterSelectedRowKeys = selectedRowKeys
            this.masterSelectedRows = selectedRows
        },
        onSelectChangeSub(selectedRowKeys, selectedRows) {
            this.subSelectedRowKeys = selectedRowKeys
            this.subSelectedRows = selectedRows
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        // 删除
        handleSub(record, type) {
			console.log("handleSub()");
			// console.log(record);
            const that = this
            let uuids = ''
            let url = ''
            if (record === 'all') {
                if (type === 'master') {
                    if (that.masterSelectedRowKeys.length === 0) {
                        that.$message.warn('请先勾选需要的删除的数据', 1.5)
                        return true
                    } else {
                        uuids = that.masterSelectedRowKeys.toString()
                        url = that.url.masterDelete
                    }
                } else if (type === 'sub') {
                    if (that.subSelectedRowKeys.length === 0) {
                        that.$message.warn('请先勾选需要的删除的数据', 1.5)
                        return true
                    } else {
                        uuids = that.subSelectedRowKeys.toString()
                        url = that.url.subDelete
                    }
                }
            } else {
                uuids = record.uuid
                if (type === 'master') {
                    url = that.url.masterDelete
                } else if (type === 'sub') {
                    url = that.url.subDelete
                }
            }
            that.$confirm({
                title: '警告',
                content: `确定要执行该操作吗?`,
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    // 在这里调用删除接口
                    that.$post(url, {
                        uuid: uuids
                    }).then((res) => {
                        if (res.statusCode === 200 || res === 1) {
                            that.$message.success('删除成功', 1.5)
                            if (type === 'master') {
                                if (that.$refs.masterList.refresh) {
                                    that.$refs.masterList.refresh()
                                }
                                if (that.fetch) {
                                    that.data = []
                                    that.fetch(that.queryParam)
                                }
                                if (that.refreshOnload) that.refreshOnload()
                                that.masterRows = ''
                                that.masterSelectedRowKeys = []
                            } else {
                                that.$refs.subList.refresh()
                                that.subRows = ''
                                that.subSelectedRowKeys = []
                            }
                        } else {
                            that.$message.error(res.message, 1.5)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                }
            })
        },
        // 取消
        handleCancel(e) {
            if (e === 'master') {
                this.masterMdl = null
                this.masterVisible = false
                this.masterConfirmLoading = false
            } else {
                this.subMdl = null
                this.subVisible = false
                this.SubConfirmLoading = false
            }
        },
        // 表格行事件
        masterRowClick(record, index, param) {
            console.log(record, index, param)
            this.masterRows = record
                // this.masterMdl = record
            if (this.$refs.subList) {
                for (var i in param) {
                    this.subQueryParam[i] = record[param[i]]
                }
                this.$refs.subList.refresh()
            }
        },
        subRowClick(record, index) {
            const that = this
            return {
                on: {
                    click: () => {
                        that.subRows = record
                    }
                }
            }
        },
        // 查询
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        // 清空表单
        resetSearchForm() {
            this.queryParam = {}
        },
        masterRowClassName(row) {
            return row.uuid === (this.masterRows?.uuid)?'bg-bray':'' // 每条数据的唯一识别值
        },
        subRowClassName(row) {
            return row.uuid === (this.subRows?.uuid)?'bg-bray':'' // 每条数据的唯一识别值
        },
        /* -------------------------------- ----主子表操作结束----- ----------------------------------- */

        /* -------------------------------- ----单元格编辑操作开始----- ----------------------------------- */
        handleOpenModal: function(obj) {
            this.$refs.obj.show()
        },
        handleEdiTableEdit: function(record) {
            this.$post(this.interface.masterUpdate, record).then((res) => {
                if (res === 1 || res.statusCode === 200) {
                    this.$message.success('修改成功', 1.5)
                } else {
                    this.$message.error('修改失败', 1.5)
                }
            })
        },

        handleEdiTableAdd: function(record) {
            this.$post(this.interface.masterAdd, record).then((res) => {
                if (res === 1 || res.statusCode === 200) {
                    this.$message.success('新增成功')
                    this.refresh()
                } else {
                    this.$message.error('新增失败')
                }
            })
        },
        handleEdiTableDel: function(record, type) {
            const that = this
            let uuids = ''
            if (record === 'all') {
                if (that.masterSelectedRowKeys.length === 0) {
                    that.$message.warn('请先勾选需要的删除的数据')
                    return true
                } else {
                    uuids = that.masterUuids
                }
            } else {
                uuids = record.uuid
            }
            that.$confirm({
                title: '警告',
                content: `确定要执行该操作吗?`,
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    // 在这里调用删除接口
                    that.$post(that.interface.masterDelete, {
                        uuid: uuids
                    }).then((res) => {
                        if (res.statusCode === 200 || res === 1) {
                            that.$message.success('删除成功', 1.5)
                            that.refresh()
                            that.masterUuids = ''
                        } else {
                            that.$message.success(res.message, 1.5)
                        }
                    })
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
                    }).catch(() => console.log('Oops errors!'))
                },
                onCancel() {
                    console.log('Cancel')
                }
            })
        },

        /* -------------------------------- ----单元格编辑操作结束----- ----------------------------------- */

        /* 导出 */
        handleExportXls(columns, tablesName, type, status) {
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
            } else {
                url = `${baseUrl}${this.url.exportExcelTemplate}`
            }
            if (status === '1' || status === '0') {
                window.location.href = encodeURI(url + '?tablesName=' + tablesName + '&fieldName=' + field + '&textName=' + text +
                    '&type=' + status + '&token=' + Vue.ls.get(ACCESS_TOKEN))
            } else {
                window.location.href = encodeURI(url + '?tablesName=' + tablesName + '&fieldName=' + field + '&textName=' + text +
                    '&token=' + Vue.ls.get(ACCESS_TOKEN))
            }
        },
        handleExportXls2(fileName) {
            if (!fileName || typeof fileName != "string") {
                fileName = "导出文件"
            }
            let param = {...this.queryParam
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
        handleImportExcel(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                if (info.file.response.statusCode) {
                    if (info.file.response.statusCode === 200) {
                        let url = `${this.url.importExcelUrl}`
                        this.$post(url, {
                            address: info.file.response.filePath
                        }).then((res) => {
                            if (res.statusCode === 200 || res === 1) {
                                this.$message.success(res.message, 1.5)
                            } else {
                                this.$message.error(res.message, 1.5)
                            }
                        })
                    } else {
                        this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`, 1.5)
                    }
                } else {
                    this.$message.error(`${info.file.name} ${info.file.response.message}.`, 1.5);
                }
            } else if (info.file.status === 'error') {
                this.$message.error(`文件上传失败: ${info.file.msg} `, 1.5);
            }
        },
        handleImportExcelXS2(info) {
            console.log("info", info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                if (info.file.response.statusCode) {
                    if (info.file.response.statusCode === 200) {
                        let url = `${this.url.importExcelUrl}`
                        this.$post(url, { address: info.file.response.filePath, orgId: this.queryParam.orgId }).then((res) => {
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
                } else {
                    this.$message.error(`${info.file.name} ${info.file.response.message}.`, 1.5);
                }
            } else if (info.file.status === 'error') {
                this.$message.error(`文件上传失败: ${info.file.msg} `, 1.5);
            }
        },
        /* 图片预览 */
        getImgView(text) {
            if (text && text.indexOf(",") > 0) {
                text = text.substring(0, text.indexOf(","))
            }
            return getFileAccessHttpUrl(text)
        },
        /* 文件下载 */
        // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
        downloadFile(text) {
            if (!text) {
                this.$message.warning("未知的文件", 1.5)
                return;
            }
            if (text.indexOf(",") > 0) {
                text = text.substring(0, text.indexOf(","))
            }
            let url = getFileAccessHttpUrl(text)
            window.open(url);
        },
    }
}