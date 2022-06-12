/**
 * 新增修改完成调用 handleOk方法 编辑弹框组件主表ref定义为masterModal，子表ref定义为subrModal
 * /$$
 $ @Description: 树形表格
 $ @Author: 黄婷
 $ @Date: 2021-01-18 15:17:28
 $ @LastEditTime: 2021-05-21 14:36:19
 $ @LastEditors: 黄婷
 $ @FilePath: \misboot-cloud-topvui\src\mixins\dataTreeMixin.js
 $/
 */
import {
    ACCESS_TOKEN
} from '@/store/mutation-types'
import Vue from 'vue'

export const treeGridMixin = {
    data() {
        return {}
    },
    methods: {

        /* ------------------------------------主表操作开始----- ----------------------------------- */
        // 新增
        handleAdd: function(key, treeData, e) {
            this.key = key
            let form = {}
            this.masterMdl = null
            if (e === 'master' || !e) {
                form = this.$refs.masterModal.form
                form.resetFields() // 清理表单数据（可不做）
                if (key === '1') {
                    this.masterVisible = true
                } else {
                    if (!this.$refs.masterList.rows) {
                        this.$message.warn('请先选择所要操作的数据', 1.5)
                        return true
                    } else {
                        this.masterVisible = true
                        this.masterMdl = {
                            id: this.$refs.masterList.rows.id,
                            levelId: this.$refs.masterList.rows.levelId
                        }

                    }
                }
                if (this.$refs.masterModal.add) this.$refs.masterModal.add(this.masterMdl, treeData)
            } else {
                form = this.$refs.subModal.form
                form.resetFields() // 清理表单数据（可不做）
                const flag = typeof this.$refs.masterList == 'undefined' ? !this.masterRows : !this.$refs.masterList.rows
                if (flag) {
                    this.$message.warn('请先选择所要操作的数据', 1.5)
                    return true
                } else {
                    this.subVisible = true
                    this.subMdl = this.subQueryParam
                    console.log(this.subMdl)
                    if (this.$refs.subModal.add) this.$refs.subModal.add(this.subMdl, treeData)
                }

            }
        },
        // 编辑
        handleEdit: function(record, data, type, paramar) {
            this.key = '2'
            if (type === 'master' || !type) {
                this.$refs.masterModal.title = '编辑'
                if (record) {
                    if (record.levelId === 1 || record.pid === 1) this.key = '1'
                    this.masterVisible = true
                    this.masterMdl = record
                    if (this.$refs.masterModal.edit) this.$refs.masterModal.edit(this.masterMdl, data)
                } else {
                    this.$message.warn('请先选中需要操作的数据', 1.5)
                    return true
                }
            } else {
                if (record) {
                    this.subVisible = true
                    this.subMdl = record
                    if (paramar) {
                        for (var i in paramar) {
                            this.subMdl[i] = paramar[i]
                        }
                        if (this.$refs.subModal.edit) this.$refs.subModal.edit(this.subMdl, data)
                    } else {
                        if (this.$refs.subModal.edit) this.$refs.subModal.edit(this.subMdl, data)
                    }
                } else {
                    this.$message.warn('请先选中需要操作的数据', 1.5)
                    return true
                }
            }
        },
        // 提交表单
        handleOk: function(e) {
            let url = ''
            let form = {}
            if (e === 'master' || !e) {
                form = this.$refs.masterModal.form
            } else {
                form = this.$refs.subModal.form
            }
            form.validateFields((errors, values) => {
                if (!errors) {
                    if (e === 'master' || !e) {
                        this.masterConfirmLoading = true
                        if (!values.uuid && this.key === '1') {
                            url = this.url.masterSaveRoot
                        } else if (!values.uuid && this.key === '2') {
                            url = this.url.masterSave
                        } else {
                            url = this.url.masterUpdate
                        }

                    } else {
                        this.subConfirmLoading = true
                        if (values.uuid) {
                            url = this.url.subUpdate
                        } else {
                            url = this.url.subSave
                        }
                    }
                    this.$post(url, values).then((res) => {
                        if (res === 1 || res.statusCode === 200) {
                            if (e === 'master' || !e) {
                                this.masterVisible = false
                                this.handleRefreshList(values, values.uuid)
                                    // this.$refs.masterList.getListByLevelId()
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
        handleRefreshList(values, uuid) {
            if (!values.uuid) {
                if ((this.$refs.masterList.rows && values.levelId != 1) || (values.levelId == 1 && this.key == 2)) {
                    // this.$refs.masterList.refreshChildList(this.$refs.masterList.rows.id)
                    this.$refs.masterList.refreshChildList(values.pid)
                } else {
                    this.$refs.masterList.refresh()
                }
            } else {
                if (this.$refs.masterList.rows && values.levelId != 1) {
                    if (this.$refs.masterList.rows.pid != values.pid) {
                        this.$refs.masterList.refreshChildList(this.$refs.masterList.rows.pid)
                        this.$refs.masterList.refreshChildList(values.pid)
                    } else {
                        let index = this.$refs.masterList.expandedRowKeys.indexOf(values.uuid)
                        if (index >= 0) {
                            this.$refs.masterList.expandedRowKeys.splice(this.$refs.masterList.expandedRowKeys.indexOf(values.uuid), 1)
                        }
                        console.log(this.$refs.masterList.expandedRowKeys, this.$refs.masterList.expandedRowKeys.indexOf(values.uuid))

                        // console.log(this.expandedRowKeys)
                        this.$refs.masterList.refreshChildList(this.$refs.masterList.rows.pid)
                    }
                    // this.$refs.masterList.refreshChildList(this.masterRows.id)
                } else {
                    this.$refs.masterList.refresh()
                }
            }
            // this.masterRows = null
            // this.masterRowClassName(this.masterRows)
        },
        // 删除
        handleSub: function(record, type) {
            const that = this
            let uuids = ''
            let url = ''
            if (!record || record.length === 0) {
                this.$message.warn('请勾选需要删除的数据', 1.5)
                return
            } else if (record && record[0]) {
                uuids = record.toString()
            } else {
                uuids = record.uuid
            }
            if (type === 'master' || !type) {
                url = that.url.masterDelete
            } else if (type === 'sub') {
                url = that.url.subDelete
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
                            if (type === 'master' || !type) {
                                that.$refs.masterList.refresh()
                            } else {
                                that.$refs.subList.refresh()
                            }
                        } else {
                            that.$message.error(res.message)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                }
            })
        },
        // 取消
        handleCancel(type) {
            if (type === 'master' || !type) {
                this.masterMdl = null
                this.masterVisible = false
            } else {
                this.subMdl = null
                this.subVisible = false
            }
        },
        // 行点击
        masterRowClick(record, param) {
					this.$refs.masterList.rows = record
            if (this.$refs.subList) {
                for (var i in param) {
                    this.subQueryParam[i] = record[param[i]]
                    this.subMdl = this.subQueryParam
                }
                this.$refs.subList.refresh()
            }
        },
        // /* 树形选中事件 */
        // selectTree(record, key, param) {
        //     this.masterRows = record
        //     this.masterMdl = record
        //     if (this.$refs.subList) {
        //         for (var i in param) {
        //             this.subQueryParam[i] = record[param[i]]
        //             this.subMdl = this.subQueryParam
        //         }
        //         this.$refs.subList.refresh()
        //     }
        // },
        /* -------------------------------- ----主表操作结束----- ----------------------------------- */
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
            } else {
                url = `${baseUrl}${this.url.exportExcelTemplate}`
            }
            window.location.href = encodeURI(url + '?tablesName=' + tablesName + '&fieldName=' + field + '&textName=' + text +
                '&token=' + Vue.ls.get(ACCESS_TOKEN))
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
                        this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
                    }
                    this.loadData()
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
                this.$message.warning("未知的文件")
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