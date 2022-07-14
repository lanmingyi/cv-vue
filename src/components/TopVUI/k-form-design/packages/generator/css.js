/*** 
 * @Description:  表单设计css代码生成函数
 * @Author: lmy
 * @Date: 2021-07-06 14:41:16
 * @LastEditTime: 2021-07-19 09:21:55
 * @LastEditors: lmy
 * @FilePath:
 */
const styles = {
    'a-rate': '.a-rate{display: inline-block; vertical-align: text-top;}',
    'a-upload': '.a-upload__tip{line-height: 1.2;}'
}

function addCss(cssList, el) {
    const css = styles[el.options.tag]
    css && cssList.indexOf(css) === -1 && cssList.push(css)
    if (el.options.children) {
        el.options.children.forEach(el2 => addCss(cssList, el2))
    }
}

export function makeUpCss(conf) {
    const cssList = []
    conf.list.forEach(el => addCss(cssList, el))
    return cssList.join('\n')
}