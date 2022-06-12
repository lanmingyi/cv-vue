/**
 * 把对象按照 js配置文件的格式进行格式化
 * @param obj 格式化的对象
 * @param dep 层级，此项无需传值
 * @returns {string}
 */
function formatConfig(obj, dep) {
    dep = dep || 1
    const LN = '\n',
        TAB = '  '
    let indent = ''
    for (let i = 0; i < dep; i++) {
        indent += TAB
    }
    let isArray = false,
        arrayLastIsObj = false
    let str = '',
        prefix = '{',
        subfix = '}'
    if (Array.isArray(obj)) {
        isArray = true
        prefix = '['
        subfix = ']'
        str = obj.map((item, index) => {
            let format = ''
            if (typeof item == 'function') {
                //
            } else if (typeof item == 'object') {
                arrayLastIsObj = true
                format = `${LN}${indent}${formatConfig(item,dep + 1)},`
            } else if ((typeof item == 'number' && !isNaN(item)) || typeof item == 'boolean') {
                format = `${item},`
            } else if (typeof item == 'string') {
                format = `'${item}',`
            }
            if (index == obj.length - 1) {
                format = format.substring(0, format.length - 1)
            } else {
                arrayLastIsObj = false
            }
            return format
        }).join('')
    } else if (typeof obj != 'function' && typeof obj == 'object') {
        str = Object.keys(obj).map((key, index, keys) => {
            const val = obj[key]
            let format = ''
            if (typeof val == 'function') {
                //
            } else if (typeof val == 'object') {
                format = `${LN}${indent}${key}: ${formatConfig(val,dep + 1)},`
            } else if ((typeof val == 'number' && !isNaN(val)) || typeof val == 'boolean') {
                format = `${LN}${indent}${key}: ${val},`
            } else if (typeof val == 'string') {
                format = `${LN}${indent}${key}: '${val}',`
            }
            if (index == keys.length - 1) {
                format = format.substring(0, format.length - 1)
            }
            return format
        }).join('')
    }
    const len = TAB.length
    if (indent.length >= len) {
        indent = indent.substring(0, indent.length - len)
    }
    if (!isArray || arrayLastIsObj) {
        subfix = LN + indent + subfix
    }
    return `${prefix}${str}${subfix}`
}


/**
 * 表单设计的json数据处理
 * @param item 表单组件
 * @returns {obj}
 */

//新增处理表单组件数据
function loadTypeList(item) {
    if (item.type === 'cascader' || item.type === 'checkbox' || (item.type === 'date' && item.options.range) ||
        item.type === 'uploadFile' || item.type === "uploadImg") {
        if (item.type === 'date' && item.options.range) {
            // item.options.rangeDefaultValue = []
            // item.options.disabled = false
        } else {
            // item.options.defaultValue = []
            // item.options.disabled = false
        }
    } else if (item.type === 'batch') {
        item.list.forEach(e => {
                if (e.type === 'cascader' || e.type === 'checkbox' || e.type === 'uploadFile' || e.type === "uploadImg") {
                    // e.options.defaultValue = []
                    // e.options.disabled = false
                } else if (e.type === 'date' && e.options.range) {
                    // e.options.rangeDefaultValue = []
                    // e.options.disabled = false
                } else if (e.type === 'number' || e.type === 'rate' || e.type === 'slider') {
                    // e.options.defaultValue = 0
                    // e.options.disabled = false
                } else {
                    // e.options.defaultValue = ''
                    // e.options.disabled = false
                }
            })
            // item.options.defaultValue = ''
            // item.options.disabled = false
    } else if (item.type === 'table') {
        loadTableData(item)
    } else if (item.type === 'grid' || item.type === 'tabs') {
        loadTableGridAndTabs(item)
    } else if (item.type === 'card' || item.type === 'bath') {
        loadCardData(item)
    } else if (item.type === 'number' || item.type === 'rate' || item.type === 'slider') {
        // item.options.defaultValue = 0
        // item.options.disabled = false
    } else if (item.type === 'select') {
        if (item.options.multiple) {
            // item.options.defaultValue = []
            // item.options.disabled = false
        } else {
            // item.options.defaultValue = ''
            // item.options.disabled = false
        }

    } else {
        // item.options.defaultValue = ''
        // item.options.disabled = false
    }
    return item
}

function loadBathData(data) {
    data.list.forEach(m => {
        loadTypeList(m)
    })
    return data
}

function loadTableData(data) {
    data.trs.forEach(r => {
        r.tds.forEach(d => {
            d.list.forEach(lts => {
                loadTypeList(lts)
            })

        })
    })
    return data
}

function loadTableGridAndTabs(data) {
    data.columns.forEach(t => {
        t.list.forEach(ts => {
            loadTypeList(ts)
        })
    })
    return data
}

function loadCardData(data) {
    data.list.forEach(m => {
        loadTypeList(m)
    })
    return data
}

// 提交时处理表单组件数据
function setTypeList(item, listInfo) {
    if (item.type === 'batch') {
        let arr = listInfo[item.model]
        if (arr) arr = typeof(arr) === 'string' ? JSON.parse(arr) : arr
        item.list.forEach(e => {
            if (arr && arr.length != 0) {
                arr.forEach(m => {
                    if (m[e.model]) e.options.defaultValue = m[e.model]
                })
            }
        })
        item.options.defaultValue = listInfo[item.model]
        listInfo[item.model] = typeof(listInfo[item.model]) !== 'string' ? JSON.stringify(listInfo[item.model]) : listInfo[item.model]
    } else if (item.type === 'cascader' || item.type === 'checkbox' || item.type === 'uploadFile' || item.type === "uploadImg") {
        item.options.defaultValue = listInfo[item.model]
        listInfo[item.model] = typeof(listInfo[item.model]) !== 'string' ? JSON.stringify(listInfo[item.model]) : listInfo[item.model]
    } else if (item.type === 'date' && item.options.range) {
        item.options.rangeDefaultValue = typeof(listInfo[item.model]) !== 'string' ? JSON.stringify(listInfo[item.model]) : listInfo[item.model]
        listInfo[item.model] = item.options.rangeDefaultValue
    } else if (item.type === 'select') {
        if (item.options.multiple) {
            item.options.defaultValue = listInfo[item.model]
            listInfo[item.model] = typeof(listInfo[item.model]) !== 'string' ? JSON.stringify(listInfo[item.model]) : listInfo[item.model]
        } else {
            item.options.defaultValue = listInfo[item.model]
        }
    } else if (item.type === 'table') {
        setTableData(item, listInfo)
    } else if (item.type === 'grid' || item.type === 'tabs') {
        setTableGridAndTabs(item, listInfo)
    } else if (item.type === 'card') {
        setCardData(item, listInfo)
    } else {
        item.options.defaultValue = listInfo[item.model]
    }
    return { e: item, list: listInfo }
}

function setTableData(data, list) {
    data.trs.forEach(r => {
        r.tds.forEach(d => {
            d.list.forEach(lts => {
                lts = setTypeList(lts, list).e
                list = setTypeList(lts, list).list
            })

        })
    })
    return { e: data, list: list }
}

function setTableGridAndTabs(data, list) {
    data.columns.forEach(t => {
        t.list.forEach(ts => {
            ts = setTypeList(ts, list).e
            list = setTypeList(ts, list).list
        })
    })
    return { e: data, list: list }
}

function setCardData(data, list) {
    data.list.forEach(m => {
        m = setTypeList(m, list).e
        list = setTypeList(m, list).list
    })
    return { e: data, list: list }
}

// 编辑时处理表单组件数据
function getTypeList(item, info) {
    if (item.type === 'cascader' || item.type === 'checkbox') {
        // if (info[item.model]) item.options.defaultValue = JSON.parse(info[item.model])
        if (info[item.model]) item.options.defaultValue = info[item.model]
    } else if (item.type === 'date' && item.options.range) {
        item.options.defaultValue = info[item.model].substr(1, info[item.model].length - 2)
    } else if (item.type === 'number' || item.type === 'rate' || item.type === 'slider') {
        item.options.defaultValue = Number(info[item.model])
    } else if (item.type === 'select') {
        if (item.options.multiple) {
            console.log(item.options.defaultValue, info[item.model])
            item.options.defaultValue = info[item.model] ? info[item.model] : []
        } else {
            item.options.defaultValue = info[item.model]
        }
    } else if (item.type === 'table') {
        getTableData(item, info)
    } else if (item.type === 'grid' || item.type === 'tabs') {
        getTableGridAndTabs(item, info)
    } else if (item.type === 'card') {
        getCardData(item, info)
    } else if (item.type === 'batch') {
        let arr1 = info[item.model] ? JSON.parse(info[item.model]) : []
        item.list.forEach(e => {
            if (arr1.length != 0) {
                console.log(arr1)
                arr1.forEach(m => {
                    if (m[e.model]) e.options.defaultValue = m[e.model]
                })
            }
        })
        item.options.defaultValue = info[item.model]
    } else {
        item.options.defaultValue = info[item.model]
    }
    return item
}

function changeformItemOption(item, list) {
    let arr = list.filter(val => {
        return val.filed === item.model
    })
    console.log(item)
    if (arr.length > 0) {
        item.options.disabled = !arr[0].edit
        item.options.hidden = !arr[0].look
    } else {
        item.options.disabled = false
        item.options.hidden = false
    }
    return item
}

// 流程办理表单组件数据,判断组件的显示与可编辑状态
function getTypeListByFiled(item, list) {
    // console.log(item, info)
    if (item.type === 'cascader' || item.type === 'checkbox' || item.type === 'uploadFile' || item.type === "uploadImg") {
        if (item.type === 'uploadFile' || item.type === 'uploadImg') {
            if (list) changeformItemOption(item, list)
        } else {
            // item.options.defaultValue = typeof(item.options.defaultValue) === 'string' ? JSON.parse(item.options.defaultValue) : item.options.defaultValue
            item.options.defaultValue = item.options.defaultValue
            if (list) changeformItemOption(item, list)
        }
    } else if (item.type === 'batch') {
        let arr1 = typeof(item.options.defaultValue) === 'string' ? JSON.parse(item.options.defaultValue) : item.options.defaultValue
            // if (list) changeformItemOption(item, list)
        item.list.forEach(e => {
                if (arr1 && arr1.length != 0) {
                    arr1.forEach(m => {
                        if (m[e.model]) {
                            e.options.defaultValue = m[e.model]
                                // if (list) changeformItemOption(item, list)
                        }
                    })
                }
                if (list) changeformItemOption(e, list)
            })
            // item.options.defaultValue = info[item.model]
    } else if (item.type === 'date' && item.options.range) {
        item.options.rangeDefaultValue = JSON.parse(item.options.rangeDefaultValue)
        if (list) changeformItemOption(item, list)
    } else if (item.type === 'number' || item.type === 'rate' || item.type === 'slider') {
        item.options.defaultValue = Number(item.options.defaultValue)
        if (list) changeformItemOption(item, list)
    } else if (item.type === 'select') {
        if (item.options.multiple) {
            item.options.defaultValue = typeof(item.options.defaultValue) === 'string' ? JSON.parse(item.options.defaultValue) : item.options.defaultValue
        } else {
            item.options.defaultValue = item.options.defaultValue
        }
        if (list) changeformItemOption(item, list)
    } else if (item.type == 'table') {
        getTableDataByFiled(item, list)
    } else if (item.type === 'grid' || item.type === 'tabs') {
        getTableGridAndTabsByFiled(item, list)
    } else if (item.type === 'card') {
        getCardDataByFiled(item, list)
    } else {
        if (list) changeformItemOption(item, list)
    }
    return item
}

function getTableData(data, model) {
    data.trs.forEach(r => {
        r.tds.forEach(d => {
            d.list.forEach(lts => {
                getTypeList(lts, model)
            })
        })
    })
    return data
}

function getTableGridAndTabs(data, model) {
    data.columns.forEach(t => {
        t.list.forEach(ts => {
            getTypeList(ts, model)
        })
    })
    return data
}

function getCardData(data, model) {
    data.list.forEach(m => {
        getTypeList(m, model)
    })
    return data
}

function getBatchData(data, model) {
    console.log(data.defaultValue)
    data.defaultValue.forEach(m => {
        getTypeList(m, model)
    })
    return data
}

function getTableDataByFiled(data, model) {
    data.trs.forEach(r => {
        r.tds.forEach(d => {
            d.list.forEach(lts => {
                getTypeListByFiled(lts, model)
            })
        })
    })
    return data
}


function getTableGridAndTabsByFiled(data, model) {
    data.columns.forEach(t => {
        t.list.forEach(ts => {
            getTypeListByFiled(ts, model)
        })
    })
    return data
}

function getCardDataByFiled(data, model) {
    data.list.forEach(m => {
        getTypeListByFiled(m, model)
    })
    return data
}

// 获取表格列
function getColumns(e, columns) {
    if (e.type === 'table') {
        getColumnsByTable(e, columns)
    } else if (e.type === 'grid' || e.type === 'tabs') {
        getColumnsByTabsAndGrid(e, columns)
    } else if (e.type === 'card') {
        getColumnsByCard(e, columns)
    } else {
        columns.push({
            dataIndex: e.model,
            title: e.label,
            ellipsis: true
        })
    }
    return columns
}
// 获取表单表格列
function getFormColumns(e, columns) {
    if (e.type === 'table') {
        getColumnsByTable(e, columns)
    } else if (e.type === 'grid' || e.type === 'tabs') {
        getColumnsByTabsAndGrid(e, columns)
    } else if (e.type === 'card') {
        getColumnsByCard(e, columns)
    } else {
        columns.push({
            filed: e.model,
            filedName: e.label,
            isEdit: false,
            isLook: false
        })
    }
    return columns
}

function getColumnsByCard(e, columns) {
    e.list.forEach(m => {
        getColumns(m, columns)
    })
    return columns
}

function getColumnsByTabsAndGrid(e, columns) {
    e.columns.forEach(t => {
        t.list.forEach(ts => {
            getColumns(ts, columns)
        })
    })
    return columns
}

function getColumnsByTable(e, columns) {
    e.trs.forEach(m => {
        m.tds.forEach(ts => {
            ts.list.forEach(lts => {
                getColumns(lts, columns)
            })
        })
    })
    return columns
}


// 解析嵌套数组为一维数组,主要用于流程表单
function getAnalysisByList(e, arr) {
    if (e.type === 'table') {
        getAnalysisByTable(e, arr)
    } else if (e.type === 'grid' || e.type === 'tabs') {
        getAnalysisByTabsAndGrid(e, arr)
    } else if (e.type === 'card') {
        getAnalysisByCard(e, arr)
    } else if (e.type === 'batch') {
        getAnalysisByBatch(e, arr)
    } else {
        // 过滤不需要添加数据字段的表单组件类型
        let typeList = [
            "table",
            "grid",
            "tabs",
            "card",
            "alert",
            "text",
            "html",
            "divider"
        ];
        if (!typeList.includes(e.type)) {
            arr.push({
                filed: e.model,
                filedName: e.label,
                isEdit: false,
                isLook: false
            })
        }
        return arr
    }
}

function getAnalysisByCard(e, arr) {
    e.list.forEach(m => {
        getAnalysisByList(m, arr)
    })
}

function getAnalysisByTabsAndGrid(e, arr) {
    e.columns.forEach(t => {
        t.list.forEach(ts => {
            getAnalysisByList(ts, arr)
        })
    })
}

function getAnalysisByTable(e, arr) {
    e.trs.forEach(m => {
        m.tds.forEach(ts => {
            ts.list.forEach(lts => {
                getAnalysisByList(lts, arr)
            })
        })
    })
}

function getAnalysisByBatch(e, arr) {
    e.list.forEach(m => {
        getAnalysisByList(m, arr)
    })
}


/*******
 * @description:门户页数据解析
 * @param {*} e
 * @param {*} list
 * @return {*}
 */
function getPortalByList(e, list) {
    list.forEach((child) => {
        if (e.type === child.type) {
            if (e.type === 'grid' || e.type === 'tabs') {
                e.columns.forEach((m) => {
                    getPortalByGridAndTabs(m.list, list);
                });
            } else {
                child.children.push(e);
            }
        }
    });
    return list
}
// 解析布局组件
function getPortalByGridAndTabs(columns, colList) {
    columns.forEach((child) => {
        colList.forEach((e) => {
            if (e.type === child.type) {
                e.children.push(child);
            }
        });
    });
}

module.exports = { formatConfig, setTypeList, getTypeList, getColumns, loadTypeList, getTypeListByFiled, getAnalysisByList, getPortalByList, getFormColumns }