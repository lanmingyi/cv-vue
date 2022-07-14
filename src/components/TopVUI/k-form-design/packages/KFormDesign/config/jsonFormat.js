/*** 
 * @Description: 默认导入json数据格式
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:50:02
 * @LastEditors: lmy
 * @FilePath:
 */
export default `{
	"list": [
		{
			"type": "input",
			"label": "输入框",
			"options": {
				"type": "text",
				"width": "100%",
				"defaultValue": "",
				"placeholder": "请输入",
				"clearable": false,
				"maxLength": null,
				"hidden": false,
				"disabled": false
			},
			"model": "input_1603939737389",
			"key": "input_1603939737389",
			"rules": [
				{
					"required": false,
					"message": "必填项"
				}
			]
		}
	],
	"config": {
		"layout": "horizontal",
		"labelCol": {
			"xs": 4,
			"sm": 4,
			"md": 4,
			"lg": 4,
			"xl": 4,
			"xxl": 4
		},
		"wrapperCol": {
			"xs": 18,
			"sm": 18,
			"md": 18,
			"lg": 18,
			"xl": 18,
			"xxl": 18
		},
		"hideRequiredMark": false,
		"customStyle": "",
		"cancelText" :"取消",
		"okText" :"确定",
	}
}`;