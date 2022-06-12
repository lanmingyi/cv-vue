/*** 
 * @Description: 表单设计HTML代码生成函数
 * @Author: 黄婷
 * @Date: 2021-07-06 14:41:16
 * @LastEditTime: 2021-08-27 11:01:57
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\generator\html.js
 */
let confGlobal
let someSpanIsNot24
    // 生成弹窗
export function dialogWrapper(str, config) {
    // console.log(str, config)
    return `<t-modal
		title="新增/编辑"
		:width="${config.width}"
		:visible="visible"
		:model="model"
		:confirmLoading="loading"
		@ok="$emit('ok');"
		@cancel="
			() => {
				$emit('cancel');
			}
		"
	>
    ${str}
  </t-modal>`
}

// vue html模板
export function vueTemplate(str) {
    return `<template>
      ${str}
  </template>`
}

// vue js模板
export function vueScript(str) {
    return `<script>
    ${str}
  </script>`
}

// vue css模板
export function cssStyle(cssStr) {
    return `<style>
    ${cssStr}
  </style>`
}

// 表单
function buildFormTemplate(scheme, child, type) {
    let str = `<a-form :form="form" layout="${scheme.config.layout}">
      ${child}
      ${buildFromBtns(scheme, type)}
    </a-form>`
    return str
}

// Form.btn #
function buildFromBtns(scheme, type) {
    let str = ''
    if (scheme.formBtns && type === 'file') {
        str = `<a-form-item size="large">
          <a-button type="primary" @click="submitForm">提交</a-button>
          <a-button @click="resetForm">重置</a-button>
        </a-form-item>`
        if (someSpanIsNot24) {
            str = `<a-col :span="24">
          ${str}
        </a-col>`
        }
    }
    return str
}

// tab面板
function tabPane(scheme) {
    const children = scheme.list.map(el => layouts['formItem'] ? layouts['formItem'](el) : null)
    return `<a-tab-pane tab="${scheme.label}" key="${scheme.value}>
      ${children.join('\n')}
    </a-tab-pane>`
}

// 表格布局行
function createTR(scheme) {
    const children = scheme.tds.map(el => createTD(el))
    return `<tr >
      ${children.join('\n')}
    </tr>`
}
// 表格布局列
function createTD(scheme) {
    const children = scheme.list.map(el => layouts['formItem'] ? layouts['formItem'](el) : null)
    return `<td class="table-td" :colspan="${scheme.colspan}" :rowspan="${scheme.rowspan}">
      ${children.join('\n')}
    </td>`
}

// 布局模板
const layouts = {
        // 表单Item
        formItem(scheme) {
            // console.log(scheme)
            let classTag = scheme.options.hidden ? 'class="hiddenItem"' : ''
            let label = scheme.options.hidden ? '' : `label="${scheme.label}"`
            let wrapperCol = scheme.options.hidden ? '' : ':wrapper-col="wrapperCol"'
            let labelCol = scheme.options.hidden ? '' : ':label-col="labelCol"'
            let tagDom = null
            if (scheme.type === 'grid') {
                tagDom = layouts['rowFormItem'] ? layouts['rowFormItem'](scheme) : null
            } else if (scheme.type === 'card') {
                tagDom = layouts['cardItem'] ? layouts['cardItem'](scheme) : null
            } else if (scheme.type === 'tabs') {
                tagDom = layouts['tabItem'] ? layouts['tabItem'](scheme) : null
            } else if (scheme.type === 'table') {
                tagDom = layouts['tableItem'] ? layouts['tableItem'](scheme) : null
            } else {
                tagDom = tags[scheme.type] ? tags[scheme.type](scheme) : null
            }

            let str = `<a-form-item ${wrapperCol} ${labelCol} ${classTag} ${label}>
            ${tagDom}
        </a-form-item>`
            return str
        },
        // 栅格布局  列COL
        colFormItem(scheme) {
            const children = scheme.list.map(el => layouts['formItem'] ? layouts['formItem'](el) : null)
            return `<a-col :span="${scheme.span}">
            ${children}
        </a-col>`
        },
        // 栅格布局 行ROW
        rowFormItem(scheme) {
            const options = scheme.options
            const type = options.type === 'default' ? '' : `type="${options.type}"`
            const justify = options.type === 'default' ? '' : `justify="${options.justify}"`
            const align = options.type === 'default' ? '' : `align="${options.align}"`
            const gutter = options.gutter ? `:gutter="${options.gutter}"` : ''
            const children = scheme.columns.map(el => layouts['colFormItem'] ? layouts['colFormItem'](el) : null)
            let str = `<a-row ${type} ${justify} ${align} ${gutter}>
            ${children.join('\n')}
        </a-row>`
            return str
        },
        // 卡片布局
        cardItem(scheme) {
            const options = scheme.options
            const bordered = `:bordered="${options.bordered}"`
            const title = options.title ? `title="${options.title}"` : null
            const children = scheme.list.map(el => layouts['formItem'] ? layouts['formItem'](el) : null)
            let str = `<a-card ${bordered} ${title}>
            ${children.join('\n')}
        </a-card>`
            return str
        },
        //tabs布局
        tabItem(scheme) {
            const options = scheme.options
            const type = options.type ? `type="${options.type}` : null
            const tabBarGutter = options.tabBarGutter ? `:tabBarGutter="${options.tabBarGutter}"` : null
            const size = options.size ? `:size="${options.size}"` : null
            const tabPosition = options.tabPosition ? `:tabPosition="${options.tabPosition}"` : null
            const animated = options.animated ? `:animated="${options.animated}"` : null
            const children = scheme.columns.map(el => tabPane(el))
            let str = `<a-tabs :default-active-key="0" ${type} ${tabBarGutter} ${size} ${tabPosition} ${animated}>
            ${children.join('\n')}
        </a-tabs>`
            return str
        },
        // 表格布局
        tableItem(scheme) {
            const options = scheme.options
            const classStyle = `class="kk-table-9136076486841527 ${options.bright?'bright':''} ${options.small?'small':''} ${options.bordered?'bordered':''} ${options.formBorder? 'formBorder':''}"`
            const children = scheme.trs.map(el => createTR(el))
            let str = `<table ${classStyle}>
            ${children.join('\n')}
        </table>`
            return str
        }
    }
    // 表单组件
const tags = {
    // 按钮
    'button': el => {
        const {
            disabled
        } = attrBuilder(el)
        const options = el.options
        const type = options.type ? `type="${options.type}"` : ''
        const icon = options.icon ? `icon="${options.icon}"` : ''
        const shape = options.shape ? `shape="${options.shape}"` : ''
        const ghost = options.size ? `ghost = "${options.ghost}" ` : ''
        const block = options.block ? 'block' : ''
        const size = options.size ? `size = "${options.size}" ` : ''
        const htmlType = options.handle !== 'dynamic' ? `htmlType = "${options.handle}"` : ''
        const dynamicFun = options.handle === 'dynamic' ? `@click="${options.dynamicFun}"` : ''
        return `<a-button ${type} ${icon} ${shape}  ${size}  ${disabled} ${ghost} ${block} ${htmlType} ${dynamicFun}> </a-button>`
    },
    // 输入框
    'input': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const maxlength = options.maxlength ? `:maxlength="${options.maxlength}"` : ''
        const readonly = options.readonly ? 'readonly' : ''
        const prefix = options.prefix ? `addonBefore="${options.prefix}"` : ''
        const suffix = options.suffix ? `addonAfter="${options.suffix}"` : ''
        const type = options.type ? `type="${options.type}"` : ''
        return `<a-input ${vModel} ${type} ${placeholder}  ${maxlength} ${readonly} ${disabled} ${allowClear} ${prefix} ${suffix} ></a-input>`
    },
    // 文本框
    'textarea': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const maxlength = options.maxlength ? `:maxlength="${options.maxlength}"` : ''
        const readonly = options.readonly ? 'readonly' : ''
        const autoSize = options.minRows || options.maxRows ? `autoSize = "{minRows: ${options.minRows},maxRows: ${options.maxRows}}"` : ''

        return `<a-textarea ${vModel} ${placeholder}  ${maxlength} ${readonly} ${disabled} ${allowClear} ${autoSize}></a-textarea>`
    },
    // 数字输入框
    'number': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const min = options.min ? `:min='${options.min}'` : ''
        const max = options.max ? `:max='${options.max}'` : ''
        const step = options.step ? `:step='${options.step}'` : ''
        const precision = el.precision ? `:precision='${el.precision}'` : ''

        return `<a-input-number ${vModel} ${placeholder} ${step} ${precision} ${min} ${max} ${disabled} ${allowClear}></a-input-number>`
    },
    // 下拉选择器
    'select': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const dataType = `dataType="${options.dataType}"`
        const dictCode = options.dataType === 'code' ? `:dictCode="${options.dictCode}"` : ''
        const url = options.dataType === 'dynamic' ? `:url="${options.url}"` : ''
        const params = options.dataType === 'dynamic' ? `params="${options.dynamicKey}"` : ''
        const method = options.dataType === 'dynamic' ? `:method="${options.method}"` : ''
        const dataList = options.dataType === 'static' ? `:dataList="${el.model}List"` : ''
        const textFeild = options.dataType === 'dynamic' ? `textFeild="${options.textFeild}"` : ''
        const valueFeild = options.dataType === 'dynamic' ? `valueFeild="${options.valueFeild}"` : ''
        const type = `type="select"`
        if (!options.multiple) {
            return ` <t-dict-select-tag ${ vModel } ${url} ${params} ${method} ${dataList} ${textFeild} ${valueFeild} ${ placeholder } ${ disabled } ${ allowClear } ${type} ${dictCode} ${dataType}></t-dict-select-tag>`
        } else {
            return ` <t-multi-select-tag ${ vModel } ${url} ${params} ${method} ${dataList} ${textFeild} ${valueFeild} ${ placeholder } ${ disabled } ${ allowClear } ${type} ${dictCode} ${dataType}></t-multi-select-tag>`
        }
    },
    // 单选按钮
    'radio': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const dataType = `dataType="${options.dataType}"`
        const dictCode = options.dataType === 'code' ? `:dictCode="${options.dictCode}"` : ''
        const url = options.dataType === 'dynamic' ? `:url="${options.url}"` : ''
        const params = options.dataType === 'dynamic' ? `params="${options.dynamicKey}"` : ''
        const method = options.dataType === 'dynamic' ? `:method="${options.method}"` : ''
        const dataList = options.dataType === 'static' ? `:dataList="${el.model}List"` : ''
        const textFeild = options.dataType === 'dynamic' ? `textFeild="${options.textFeild}"` : ''
        const valueFeild = options.dataType === 'dynamic' ? `valueFeild="${options.valueFeild}"` : ''
        const type = `type="radio"`
        return `<t-dict-select-tag ${ vModel } ${url} ${params} ${method} ${dataList} ${ placeholder } ${textFeild} ${valueFeild} ${ disabled } ${ allowClear } ${type} ${dictCode} ${dataType}></t-dict-select-tag>`
    },
    // 复选框
    'checkbox': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const dataType = `dataType="${options.dataType}"`
        const dictCode = options.dataType === 'code' ? `:dictCode="${options.dictCode}"` : ''
        const url = options.dataType === 'dynamic' ? `:url="${options.url}"` : ''
        const params = options.dataType === 'dynamic' ? `params="${options.dynamicKey}"` : ''
        const method = options.dataType === 'dynamic' ? `:method="${options.method}"` : ''
        const dataList = options.dataType === 'static' ? `:dataList="${el.model}List"` : ''
        const textFeild = options.dataType === 'dynamic' ? `textFeild="${options.textFeild}"` : ''
        const valueFeild = options.dataType === 'dynamic' ? `valueFeild="${options.valueFeild}"` : ''
        const type = `type="checkbox"`
        return ` <t-multi-select-tag ${ vModel } ${url} ${params} ${method} ${dataList} ${textFeild} ${valueFeild} ${ placeholder } ${ disabled } ${ allowClear } ${type} ${dictCode} ${dataType}></t-multi-select-tag>`
    },
    // 开关
    'switch': el => {
        const { disabled, vModel } = attrBuilder(el)
        return `<a-switch ${vModel} ${disabled}></a-switch>`
    },
    // 级联
    'cascader': el => {
        const {
            disabled,
            vModel,
            clearable,
            placeholder
        } = attrBuilder(el)
        const options = el.options
        const props = options.props ? `:props="${options.model}Props"` : ''
        const showAllLevels = options['show-all-levels'] ? '' : ':show-all-levels="false"'
        const filterable = options.filterable ? 'filterable' : ''
        const separator = options.separator === '/' ? '' : `separator="${options.separator}"`

        return `<a-cascader ${vModel} ${options} ${props} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></a-cascader>`
    },
    // 进度条 组件
    'slider': el => {
        const { disabled, vModel } = attrBuilder(el)
        const options = el.options
        const min = options.min ? `:min='${options.min}'` : ''
        const max = options.max ? `:max='${options.max}'` : ''
        const step = options.step ? `:step='${options.step}'` : ''
        const range = options.range ? 'range' : ''
        const dots = options.dots ? `:dots="${options.dots}"` : ''

        return `<a-slider ${min} ${max} ${step} ${vModel} ${range} ${dots} ${disabled}></a-slider>`
    },
    // 时间选择器
    'time': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const use12Hours = options.use12Hours ? `:use12Hours="${options.use12Hours}"` : ''
        const format = options.format ? `format="${options.format}"` : ''

        return `<t-date type="time" ${vModel} ${format} ${placeholder} ${use12Hours} ${disabled} ${allowClear}></t-date>`
    },
    // 日期选择器
    'date': el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const type = options.range ? `type="rangePicker"` : (options.format === 'YYYY-MM ' ? `type = "month"` : `type = "date"`)
        const rangePlaceholder = options.range ? `:placeholder="${JSON.stringify(options.rangePlaceholder).replace(/\"/g, "'")}"` : placeholder
        const format = el.format ? `format="${el.format}"` : ''
        const readonly = el.readonly ? 'readonly' : ''

        return `<t-date ${type} ${vModel} ${format} ${rangePlaceholder} ${allowClear} ${readonly} ${disabled}></t-date>`
    },
    // 评分
    'rate': el => {
        const { disabled, vModel, allowClear } = attrBuilder(el)
        const options = el.options
        const count = options.max ? `:count='${options.max}'` : ''
        const allowHalf = options.options ? 'allow-half' : ''
        return `<a-rate ${vModel} ${count} ${allowHalf} ${disabled} ${allowClear}></a-rate>`
    },
    // 上传文件
    'uploadFile': el => {
        const {
            disabled,
            vModel,
        } = attrBuilder(el)
        const options = el.options
        const action = options.action ? `action="${options.action}"` : ''
        const multiple = options.multiple ? 'multiple' : ''
        const headers = options.headers ? `:headers="${JSON.stringify(options.headers).replace(/\"/g, "'")}"` : ''
        const uploadFileData = options.data ? `:data="${options.data}"` : ''
        const accept = options.accept ? `accept="${options.accept}"` : ''
        const name = options.name ? `name="${options.fileName}"` : ''
        const drag = options.drag ? `:drag="${options.drag}"` : ''
        const limit = options.limit ? `:limit="${options.limit}"` : ''
        const downloadWay = options.downloadWay ? `downloadWay="${options.downloadWay}"` : ''
        return `<TUploadFile style="width:${options.width}"  ${vModel} ${uploadFileData} ${drag} ${limit} ${action} ${multiple} ${accept} ${name} ${disabled} ${downloadWay}></TUploadFile>`
    },
    // 上传图片
    'uploadImg': el => {
        const {
            disabled,
            vModel,
        } = attrBuilder(el)
        const options = el.options
        const action = options.action ? `action="${options.action}"` : ''
        const multiple = options.multiple ? 'multiple' : ''
        const headers = options.headers ? `:headers="${JSON.stringify(options.headers).replace(/\"/g, "'")}"` : ''
        const uploadFileData = options.data ? `:data="${options.data}"` : ''
        const accept = options.accept ? `accept="${options.accept}"` : ''
        const name = options.name ? `name="${options.fileName}"` : ''
        const limit = options.limit ? `:limit="${options.limit}"` : ''
        const listType = options.listType ? `:listType="${options.listType}"` : ''
        const text = options.placeholder ? `:text="${options.placeholder}"` : ''
        return `<TUploadImg style="width:${options.width}" ${text} ${vModel} ${uploadFileData} ${limit} ${action} ${multiple} ${accept} ${name} ${disabled} ${listType}></TUploadImg>`
    },
    // 编辑器
    editor: el => {
        const { vModel, placeholder } = attrBuilder(el)
        const options = el.options
        const height = options.height ? `:height="${options.height}"` : ''
        return `<editor ${vModel} ${placeholder} ${height} @change="change${el.model}Value"></editor>`
    },
    // 图标选择器
    icon: el => {
        const { vModel, placeholder, disabled } = attrBuilder(el)
        const options = el.options
            // const height = options.height ? `:height="${options.height}"` : ''
        return `<icon-fontPicker ${vModel} ${placeholder} ${disabled} @change="change${el.model}"></icon-fontPicker>`
    },
    // 颜色选择器
    'color': el => {
        const { disabled, vModel } = attrBuilder(el)
        const options = el.options
        const size = `size="${options.size}"`
        const formatType = options.formatType ? `:formatType="${options.formatType}"` : ''
        const showprecolor = options.showprecolor ? `:showprecolor="${options.showprecolor}"` : ''
        const showhistorycolor = options.showhistorycolor ? `:showhistorycolor="${options.showhistorycolor}"` : ''
        const showPalette = options.showPalette ? `:showPalette="${options.showPalette}"` : ''
        const canMove = options.showPalette ? `:canMove="${options.canMove}"` : ''
        return `<color-picker ${vModel} ${size} ${formatType} ${showprecolor} ${canMove} ${showhistorycolor} ${showPalette} ${disabled}></color-picker>`
    },
    // 人员选择器
    userPop: el => {
        const { disabled, vModel } = attrBuilder(el)
        const options = el.options
        const multiple = `:multiple="${options.multiple}"`
        return `<t-select-user-bydep ${vModel} ${multiple}  ${disabled}></t-select-user-bydep>`
    },
    // 组织机构选择器
    depart: el => {
        const { disabled, vModel } = attrBuilder(el)
        const options = el.options
        return `<t-select-depart ${vModel}  ${disabled} :multi="true"></t-select-depart>`
    },
    // 省市区
    area: el => {
        const { disabled, vModel } = attrBuilder(el)
        const options = el.options
        const type = `:type="${options.type}"`
        return `<t-area-linkage ${vModel} ${type} ${disabled}></t-area-linkage>`
    },

    alert: el => {
        const { disabled, vModel } = attrBuilder(el)
        const options = el.options
        const message = `:message="${el.label}"`
        const type = `:type="${options.type}"`
        const showIcon = `:showIcon="${options.showIcon}"`
        const closable = `:closable="${options.closable}"`
        const banner = `:banner="${options.banner}"`
        const description = `:description="${options.description}"`

        return `<a-alert ${vModel} ${message} ${type} ${showIcon} ${closable} ${banner} ${description} ${disabled}></a-alert>`
    },
    // 省市区
    treeSelect: el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const multiple = options.multiple ? `:multiple="${options.multiple}"` : ''
        const showSearch = options.showSearch ? `:showSearch="${options.showSearch}"` : ''
        const treeCheckable = options.treeCheckable ? `:treeCheckable="${options.treeCheckable}"` : ''
        const treeData = `:treeData="${el.model}Data"`
        const url = options.url ? `url="${options.url}"` : ''
        const parameter = options.parameter ? `parameter="${options.parameter}"` : 'parameter="{}"'
        const method = options.method ? `method="${options.method}"` : ''
        return `<tree-select ${vModel} ${multiple} ${disabled} ${allowClear} ${placeholder} ${showSearch} ${treeCheckable} ${treeCheckable} ${treeData} ${url} ${parameter} ${method}></tree-select>`
    },
    cascader: el => {
        const {
            disabled,
            vModel,
            allowClear,
            placeholder,
        } = attrBuilder(el)
        const options = el.options
        const url = options.url ? `url="${options.url}"` : ''
        const parameter = options.parameter ? `parameter="${options.parameter}"` : 'parameter="{}"'
        const method = options.method ? `method="${options.method}"` : ''
        return `<t-cascader ${vModel} ${disabled} ${allowClear} ${placeholder} ${url} ${parameter} ${method}></t-cascader>`
    }
}

function attrBuilder(el) {
    const defaultValue = el.options.defaultValue ? `initialValue: ${el.options.defaultValue},` : ''
    const rules = el.rules ? `rules: ${JSON.stringify(el.rules).replace(/\"/g,"'")}` : ''
    return {
        vModel: `v-decorator = "['${el.model}', { ${defaultValue}${rules} }]"`,
        allowClear: el.options.clearable ? 'allowClear' : '',
        placeholder: el.options.placeholder ? `placeholder="${el.options.placeholder}"` : '',
        disabled: el.options.disabled ? ':disabled=\'true\'' : ''
    }
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig, type) {
    // console.log(formConfig)
    const htmlList = []
    confGlobal = formConfig
        // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
    someSpanIsNot24 = false
        // 遍历渲染每个组件成html
    formConfig.list.forEach(el => {
        if (el.type === 'grid') {
            htmlList.push(layouts['rowFormItem'](el, formConfig.config))
        } else if (el.type === 'card') {
            htmlList.push(layouts['cardItem'](el, formConfig.config))
        } else if (el.type === 'tabs') {
            htmlList.push(layouts['tabItem'](el, formConfig.config))
        } else if (el.type === 'table') {
            htmlList.push(layouts['tableItem'](el, formConfig.config))
        } else {
            htmlList.push(layouts['formItem'](el, formConfig.config))
        }
    })
    const htmlStr = htmlList.join('\n')
        // 将组件代码放进form标签
    let temp = buildFormTemplate(formConfig, htmlStr, type)
        // dialog标签包裹代码
    if (type === 'dialog') {
        temp = dialogWrapper(temp, formConfig.config)
    }
    confGlobal = null
    return temp
}