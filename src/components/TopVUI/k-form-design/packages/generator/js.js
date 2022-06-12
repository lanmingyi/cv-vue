import { exportDefault, titleCase, deepClone, comList } from './utils'

const units = {
    KB: '1024',
    MB: '1024 / 1024',
    GB: '1024 / 1024 / 1024'
}
let confGlobal
const inheritAttrs = {
    file: '',
    dialog: 'inheritAttrs: false,'
}

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig, type) {
    // console.log(formConfig, type, 'formConfig, type=========')
    confGlobal = formConfig = deepClone(formConfig)
    const dataList = []
    const importList = []
    const optionsList = []
    const propsList = []
    const methodList = mixinMethod(type)
    const componentList = []
    const created = []

    formConfig.list.forEach(el => {
        buildAttributes(el, dataList, importList, optionsList, methodList, propsList, componentList, created, type)
    })
    if (type === 'dialog') {
        buildProps(propsList)
    }

    const script = buildexport(
        formConfig,
        type,
        dataList,
        importList.join('\n'),
        optionsList.join('\n'),
        componentList.join('\n'),
        propsList,
        methodList.join('\n'),
        created.join('\n')
    )
    confGlobal = null
    return script
}

// 构建组件属性
function buildAttributes(scheme, dataList, importList, optionsList, methodList, propsList, componentList, created, type) {
    // console.log(scheme, type, 'scheme=======')
    const config = scheme.options
        // 特殊处理options属性
    if (~['select', 'radio', 'checkbox', 'uploadFile', 'uploadImg', 'editor', 'icon', 'color', 'area', 'userPop', 'depart', 'treeSelect', 'cascader'].indexOf(scheme.type)) {
        if (config.dataType === 'static') {
            buildOptions(scheme, optionsList, 'dataType')
        }
        if (scheme.type === 'treeSelect' || scheme.type === 'cascader') {
            buildOptions(scheme, optionsList, 'data')
        }
        // 避免重复添加组件
        const list = comList.filter(res => {
            return res.type === scheme.type
        })
        let component = list[0].components
        if (scheme.type === 'select' && config.multiple) {
            component = 'TMultiSelectTag,'
        }
        const flag = componentList.includes(component)
        if (!flag) {
            console.log(componentList.indexOf('Editor,') < 0, '创建组件===========')
            buildComponents(componentList, scheme)
            buildImport(importList, scheme)
        }
    }
    if (scheme.type === 'editor') {
        const options = titleCase(scheme.model)
        const methodName = `change${options}Value`
        buildOptionMethod(methodName, options, methodList, scheme)
    }
    // 处理props

    // 构建子级组件属性
    if (scheme.type === 'grid' || scheme.type === 'tabs') {
        scheme.columns.forEach(e => {
            e.list.forEach(m => {
                buildAttributes(m, dataList, importList, optionsList, methodList, propsList, componentList, created, type)
            })
        })
    } else if (scheme.type === 'card') {
        scheme.list.forEach(e => {
            buildAttributes(e, dataList, importList, optionsList, methodList, propsList, componentList, created, type)
        })
    } else if (scheme.type === 'table') {
        scheme.trs.forEach(m => {
            m.tds.forEach(ts => {
                ts.list.forEach(lts => {
                    buildAttributes(lts, dataList, importList, optionsList, methodList, propsList, componentList, created, type)
                })
            })
        })
    } else {
        buildData(scheme, dataList)
    }
}

// 在Created调用函数
function callInCreated(methodName, created) {
    created.push(`this.${methodName}()`)
}

function buildComponents(componentList, scheme) {
    if (scheme.type === 'select' && !scheme.options.multiple) {
        componentList.push('TDictSelectTag,')
    } else if (scheme.type === 'select' && scheme.options.multiple) {
        componentList.push('TMultiSelectTag,')
    } else if (scheme.type === 'uploadFile') {
        componentList.push('TUploadFile,')
    } else if (scheme.type === 'uploadImg') {
        componentList.push('TUploadImg,')
    } else if (scheme.type === 'editor') {
        componentList.push('Editor,')
    } else if (scheme.type === 'icon') {
        componentList.push('iconFontPicker,')
    } else if (scheme.type === 'color') {
        componentList.push('colorPicker,')
    } else if (scheme.type === 'userPop') {
        componentList.push('TSelectUserByDep,')
    } else if (scheme.type === 'depart') {
        componentList.push('TSelectDepart,')
    } else if (scheme.type === 'area') {
        componentList.push('area,')
    } else if (scheme.type === 'treeSelect') {
        componentList.push('formTreeSelect,')
    } else if (scheme.type === 'cascader') {
        componentList.push('cascader,')
    }


    console.log([...new Set(componentList)]) //[1,2,3,4]
    console.log(scheme.type, scheme.type === 'area')
}

function buildImport(importList, scheme) {
    if (scheme.type === 'select' && !scheme.options.multiple) {
        importList.push(`import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag';`)
    } else if (scheme.type === 'select' && scheme.options.multiple) {
        importList.push(`import TMultiSelectTag from '@/components/TopVUI/dict/TMultiSelectTag';`)
    } else if (scheme.type === 'uploadFile') {
        importList.push(`import TUploadFile from '@/components/TopVUI/custom/TUploadFile';`)
    } else if (scheme.type === 'uploadImg') {
        importList.push(`import TUploadImg from '@/components/TopVUI/custom/TImageUpload';`)
    } else if (scheme.type === 'editor') {
        importList.push(`import Editor from '@/components/TopVUI/custom/Editor/index';`)
    } else if (scheme.type === 'icon') {
        importList.push(`import iconFontPicker from '@/components/TopVUI/font/iconFontPicker';`)
    } else if (scheme.type === 'color') {
        importList.push(`import colorPicker from '@/components/TopVUI/color/colorPicker';`)
    } else if (scheme.type === 'userPop') {
        importList.push(`import TSelectUserByDep from '@/components/TopVUI/custom/TSelectUserByDep';`)
    } else if (scheme.type === 'depart') {
        importList.push(`import TSelectDepart from '@/components/TopVUI/custom/TSelectDepart';`)
    } else if (scheme.type === 'area') {
        importList.push(`import TAreaLinkage from '@/components/TopVUI/custom/TAreaLinkage';`)
    } else if (scheme.type === 'treeSelect') {
        importList.push(`import TreeSelect from '@/components/TopVUI/k-form-design/packages/components/formTreeSelect';`)
    } else if (scheme.type === 'cascader') {
        importList.push(`import cascader from '@/components/TopVUI/k-form-design/packages/components/Tcascader';`)
    }
}

// 混入处理函数
function mixinMethod(type) {
    const list = [];
    const
        minxins = {
            file: confGlobal.formBtns ? {
                submitForm: `submitForm() {
                this.$refs['${confGlobal.formRef}'].validate(valid => {
                if(!valid) return
                // TODO 提交表单
                })
            },`,
                resetForm: `resetForm() {
                this.$refs['${confGlobal.formRef}'].resetFields()
            },`
            } : null,
            dialog: {}
        }

    const methods = minxins[type]
    if (methods) {
        Object.keys(methods).forEach(key => {
            list.push(methods[key])
        })
    }

    return list
}

// 构建data
// function buildChildData(scheme, dataList) {
//     if (~['gird', 'tabs', 'card'].indexOf(scheme.type)) {
//         buildData(scheme, dataList)
//     } else {
//         dataList.push(`'${scheme.model}'`)
//     }
// }

function buildData(scheme, dataList) {
    dataList.push(`'${scheme.model}'`)
}

// 构建options
function buildOptions(scheme, optionsList, type) {
    console.log(optionsList)
    if (type == 'dataType') {
        const str = `${scheme.model}List: ${JSON.stringify(scheme.options.options).replace(/\"/g, "'")},`
        optionsList.push(str)
    } else if (type == 'data') {
        const options = scheme.options
        if (scheme.type === 'treeSelect') {
            // let str = `${scheme.model}Url: "${options.url}",` + '\n'
            // str += `treeData: [],` + '\n'
            // str += `parameter: "${options.parameter}",` + '\n'
            // str += `method: "${options.method}",` + '\n'
            const str = `${scheme.model}Data: [],` + '\n'
            optionsList.push(str)
        }

    }
}

function buildProps(propsList) {
    const str = `{
		visible: {
			type: Boolean,
			required: true,
		},
		loading: {
			type: Boolean,
			default: () => false, 
		},
		model: {
			type: Object,
			default: () => null,
		},
	}`
    propsList.push(str)
}

// el-upload的BeforeUpload
function buildBeforeUpload(scheme) {
    const config = scheme.options
    const unitNum = units[config.sizeUnit];
    let rightSizeCode = '';
    let acceptCode = '';
    const
        returnList = []
    if (config.fileSize) {
        rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${config.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${config.fileSize}${config.sizeUnit}')
    }`
        returnList.push('isRightSize')
    }
    if (scheme.accept) {
        acceptCode = `let isAccept = new RegExp('${scheme.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${scheme.accept}类型的文件')
    }`
        returnList.push('isAccept')
    }
    const str = `${scheme.model}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
    return returnList.length ? str : ''
}

// el-upload的submit
function buildSubmitUpload(scheme) {
    const str = `submitUpload() {
    this.$refs['${scheme.model}'].submit()
  },`
    return str
}

function buildOptionMethod(methodName, model, methodList, scheme) {
    // const config = scheme.options
    const str = `${methodName}(val) {
        this.form.setFieldsValue({
          ${model}: val
        })
  },`
    methodList.push(str)
}

// function buildOptionMethod(methodName, model, methodList, scheme) {
//     const config = scheme.__config__
//     const str = `${methodName}() {
//     // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
//     this.$axios({
//       method: '${config.method}',
//       url: '${config.url}'
//     }).then(resp => {
//       var { data } = resp
//       this.${model} = data.${config.dataKey}
//     })
//   },`
//     methodList.push(str)
// }

// js整体拼接
function buildexport(json, type, data, importList, selectOptions, componentList, props, methods, created) {
    // console.log(json.config, props)
    const propsObj =
        JSON.stringify(props) !== "{}" ?
        `props:  ${props} ,` : '';
    console.log(propsObj)
    const str = `
    ${importList}
    import pick from 'lodash.pick';
    // 表单字段
    const fields = [${data}];

  ${exportDefault}{
  ${inheritAttrs[type]}
  components: {${componentList}},
  ${propsObj}
  data () {
    return {
        labelCol: ${JSON.stringify(json.config.labelCol).replace(/\"/g, "'")},
        wrapperCol: ${JSON.stringify(json.config.wrapperCol).replace(/\"/g, "'")},
        form: this.$form.createForm(this),
        ${selectOptions}
    }
  },
  computed: {},
  watch: {},
  created () {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
    ${created}

  },
  mounted () {},
  methods: {
    ${methods}
  }
}`
    return str
}