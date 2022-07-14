/**
 * 新增修改完成调用 handleOk方法 编辑弹框组件ref定义为createModal
 * /$$
 $ @Description: 单表
 $ @Author: lmy
 $ @Date: 2021-01-18 15:17:28
 $ @LastEditTime: 2021-05-21 14:40:42
 $ @LastEditors: lmy
 $ @FilePath:
 $/
 */
import { filterObj } from '@/utils/util'

import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { baseUrl } from '@/services/baseUrl'
import { filterObject } from '@/utils/TopVUI'
export const simpleListMixin = {
    data() {
        return {
            // token header
            tokenHeader: {
                'token': Vue.ls.get(ACCESS_TOKEN)
            },
        }
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
        // 编辑
        handleEdit: function(record, paramar) {
            // const form = this.$refs.createModal.form
            // form.resetFields() // 清理表单数据（可不做）
            if (record === 'all' || record === '1') {
                if (this.rows) {
                    this.visible = true
                    this.mdl = {...this.rows, ...paramar }
                    if (this.$refs.createModal.edit) this.$refs.createModal.edit(this.mdl)
                } else {
                    this.$message.warn('请选择需要操作的数据', 1.5)
                }
            } else {
                this.visible = true
                this.mdl = {...record, ...paramar }
                if (this.$refs.createModal.edit) this.$refs.createModal.edit(this.mdl)
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
                console.log("fromValue",fromValue)
                if (!errors) {
                    if (values.uuid) {
                        // 修改 e.g.
                        url = this.url.update
                    } else {
                        url = this.url.save
                    }
                    this.$post(url, fromValue).then((res) => {
                        if (res.statusCode === 200 || res === 1) {
                            this.rows = null
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
                        this.rows = null
                        this.uuid = ''
                        this.selectedRowKeys = []
                    })
                } else {
                    this.confirmLoading = false
                }
            })
        },
        // 勾选事件
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        // 删除
        handleSub(record, paramar) {
            const that = this
            let uuids = ''
            if (record === 'all') {
                if (that.selectedRowKeys.length === 0) {
                    this.$message.warn('请勾选需要删除的数据', 1.5)
                    return
                } else {
                    uuids = that.selectedRowKeys.toString()
                }
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
                            if (that.refreshOnload) that.refreshOnload() //删除成功的回调
                            that.rows = ''
                            that.selectedRowKeys = []
                        } else {
                            that.$message.error(res.message, 1.5)
                        }
                    })
                    return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
                    }).catch(() => console.log('Oops errors!'))
                },
                onCancel() {}
            })
        },
        // 取消
        handleCancel() {
            this.mdl = null
            this.visible = false
                // let form = {}
                // form = this.$refs.createModal.form
                // form.resetFields()
        },
        // 行点击
        rowClick(record, index) {
            const that = this
            return {
                on: {
                    click: () => {
                        that.rows = record
                    }
                }
            }
        },
        customClick(record, index, parmar) {
            this.rows = record
        },
        // 查询
        toggleAdvanced() {
            this.advanced = !this.advanced
        },
        rowClassName(row) {
            return row.uuid === this.rows?.uuid ? 'bg-bray' : '' // 每条数据的唯一识别值
        },
        /* -------------------------------- ----操作结束----- ----------------------------------- */

        /* -------------------------------- ----可编辑表格----- ----------------------------------- */
        // 分页数据获取
        handleTableChange(pagination, filters, sorter) {
            const pager = {...this.pagination }
            pager.current = pagination.current
            this.pagination = pager
            if (this.queryParam.rows || this.queryParam.page) {
                this.fetch({
                    rows: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters
                })
            } else {
                this.fetch({
                    pageSize: pagination.pageSize,
                    pageNo: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters
                })
            }
            this.isNew = false
        },

        // 分页
        onShowSizeChange(current, pageSize) {
            const pager = {...this.pagination }
            pager.pageSize = pageSize
            this.pagination = pager
            if (this.queryParam.rows || this.queryParam.page) {
                this.fetch({
                    rows: pageSize,
                    page: current,
                })
            } else {
                this.fetch({
                    pageSize: pageSize,
                    pageNo: current,
                })
            }
            this.isNew = false
        },
        // 行编辑数据
        handleChange(value, key, column) {
            const newData = [...this.dataSource]
            const target = newData.filter(item => key === item.uuid)[0]
            if (target) {
                target[column] = value
                this.dataSource = newData
            }
        },
        // 编辑
        edit(key) {
            const newData = [...this.dataSource]
            const target = newData.filter(item => key === item.uuid)[0]
            this.editingKey = key
            if (target) {
                target.editable = true
                this.dataSource = newData
            }
        },
        // 保存
        saveRows(key, parame) {
            const newData = [...this.dataSource]
            const newCacheData = [...this.cacheData]
            const target = newData.filter(item => key === item.uuid)[0]
            const targetCache = newCacheData.filter(item => key === item.uuid)[0]
            let url = ''
            if (!target.uuid) {
                url = this.url.save
            } else {
                url = this.url.update
                if (target && targetCache) {
                    delete target.editable
                    this.dataSource = newData
                    Object.assign(targetCache, target)
                    this.cacheData = newCacheData
                    if (parame && parame.length !== 0) {
                        parame.forEach(val => {
                            values[val] = this.queryParam[val]
                        })
                    }
                }
            }
            let values = filterObject(target)
            this.$post(url, values).then((res) => {
                if (res.statusCode === 200 || res === 1) {
                    this.rows = null
                    this.isNew = false
                        // 刷新表格
                    this.fetch(this.queryParam)
                    this.$message.success(res.message || '操作成功', 1.5)
                } else {
                    if (this.isNew) this.dataSource.splice(0, 1)
                    this.isNew = false
                    this.$message.error(res.message || '操作成功', 1.5)
                }
            })
            this.editingKey = ''
        },
        save(key, parame) {
            if (this.edForm) {
                this.edForm.validateFields((errors, values) => {
                    if (!errors) {
                        this.saveRows(key, parame)
                    } else {
                        return false
                    }
                })
            } else {
                this.saveRows(key, parame)
            }
        },
        // 取消
        cancel(key) {
            const newData = [...this.dataSource]
            if (!key) {
                if (this.isNew) {
                    this.isNew = false
                    this.dataSource.splice(0, 1)
                }
            } else {
                const target = newData.filter(item => key === item.uuid)[0]
                this.editingKey = ''
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.uuid)[0])
                    delete target.editable
                    this.dataSource = newData
                    if (this.isNew) {
                        this.isNew = false
                        this.dataSource.splice(0, 1)
                    }
                }
            }
        },
        // 保存数据
        handleOkRow() {
            const form = this.$refs.filterModal.form
            this.confirmLoading = true
            this.queryParam.advanceFilter = []
            form.validateFields((errors, values) => {
                this.visible = false
                this.confirmLoading = false
                this.queryParam.pageNo = 1
                this.queryParam.advanceFilter = '[' + JSON.stringify(values) + ']'
                this.fetch(this.queryParam)
            })
        },
        // 新增
        handleAddRow(parame) {
            let newData = {}
            if (parame && parame.length !== 0) {
                parame.forEach(e => {
                    if (!this.queryParam[e]) {
                        this.isNew = true
                        this.$message.warn('请选择需要操作的数据', 1.5)
                        return;
                    } else {
                        this.isNew = false
                        newData[e] = this.queryParam[e]
                        newData.editable = true
                    }
                })
            } else {
                newData.uuid = ''
                newData.editable = true
            }
            if (!this.isNew) {
                this.isNew = true
                this.dataSource.splice(0, 0, newData)
            }
        },
        // 编辑
        handleEditRow() {
            if (this.rows.uuid) {
                this.edit(this.rows.uuid)
            } else {
                this.$message.warn('请先选中需要修改的数据', 1.5)
                return true
            }
        },
        handleFilter() {
            this.visible = true
        },
        // 删除
        handleSubRow(record, paramar) {
            const that = this
            let uuids = ''
            if (record === 'all') {
                if (that.selectedRowKeys.length === 0) {
                    that.$message.warn('请先勾选需要的删除的数据', 1.5)
                    return true
                } else {
                    uuids = that.selectedRowKeys.toString()
                }
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
                            that.$message.success(res.message || '操作成功', 1.5)
                            that.rows = ''
                            that.editingKey = ''
                            that.dataSource = []
                            that.selectedRowKeys = []
                            that.fetch(that.queryParam)
                        } else {
                            that.$message.error(res.message || '操作成功', 1.5)
                        }
                    })
                },
                onCancel() {
                    console.log('Cancel')
                }
            })
        },
        // 查询
        searchForm() {
            this.queryParam.pageNo = 1
            this.fetch(this.queryParam)
        },
        //重置
        resetSearchForm(param) {
            this.queryParam = {
                pageNo: 1
            }
            console.log(param);
            if (param) {
                for (var i in param) {
                    this.queryParam[i] = param[i]
                }
            }
            this.fetch(this.queryParam)
        },
        /* -------------------------------- ----可编辑表格操作开始----- ----------------------------------- */

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