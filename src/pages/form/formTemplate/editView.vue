<!--
 * @Description: 表单设计模板页
 * @Author: 张夕雅s
-->
<template>
  	<t-modal
		:title="titleType"
		:width="1000"
		:visible="visible"
		:confirmLoading="loading"
		:cancelText="cancelText"
		:okText="okText"
		@ok="handleOk"
		@cancel="() => {$emit('cancel')}"
	>
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 普通布局 
					type: 布局模式  可选defalut、flex
					justify\align: 仅在flex 布局下存在   水平垂直方式
					gutter： 栅格间距
				-->
				<a-row >
					<a-form-item>
					<!-- 分割线
						orientation: 标题位置  可选left、right
						dashed:  是否是虚线
					-->
					<a-divider
						orientation="left"
						:dashed="false"
						>普通布局</a-divider
						>
					</a-form-item>
				</a-row>
				<a-row :gutter="rowGutter" type="flex" justify="start" align="top">
					<a-col :span="colSpan">
						<!-- a-form-item
						label: 标签名
						labelCol: 标签布局 当layout='horizontal' 返回labelCol值,否则返回{}  
						wrapperCol: 标签布局 当layout='horizontal' 返回wrapperCol值,否则返回{}
						-->
						<a-form-item label="输入框" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 输入框
							input:  字段名
							placeholder: 占位符
							type: 输入框类型
							initialValue: 默认值
							rules: 验证规则
							disabled: 禁用
							allowClear: 是否显示清除按钮
							maxLength: 最大长度
							addonBefore: 前置标签 String
							addonAfter: 后置标签 String
						-->
						<a-input 
							type="text"
							v-decorator="['input',{	initialValue: 'input', rules: [{ required: true, message: '请输入' }] }]" 
							placeholder="请输入"
							:disabled="type == 'view'? true : false"
							:allowClear="false"
							:maxLength="140"
							addonBefore=""
							addonAfter=""/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="密码框" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 密码框
							input:  字段名
							placeholder: 占位符
							type: 输入框类型
							initialValue: 默认值	
							rules: 验证规则
							disabled: 禁用
							allowClear: 是否显示清除按钮
							maxLength: 最大长度
							addonBefore: 前置标签 String
							addonAfter: 后置标签 String
						-->
						<a-input 
							type="password"
							v-decorator="['password',{	initialValue: '123456', rules: [{ required: true, message: '请输入' }] }]" 
							placeholder="请输入"
							:disabled="type == 'view'? true : false"
							:allowClear="false"
							:maxLength="140"
							addonBefore=""
							addonAfter=""/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="多行文本" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 多行文本
							placeholder: 占位符
							initialValue: 默认值
							rules: 验证规则
							disabled: 禁用
							allowClear: 是否显示清除按钮
							maxLength: 最大长度
							autoSize: 自适应内容高度 优先级高
							rows:  默认几行
						-->
						<a-textarea
							:autoSize="{
								minRows: 2,
								maxRows: 8,
							}"
							placeholder="请输入"
							:disabled="type == 'view'? true : false"
							:allowClear="false"
							:maxLength="200"
							:rows="4"
							v-decorator="['textarea',{	initialValue: 'textarea', rules: [{ required: true, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="数字输入框" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 数字输入框
							min: 最小值
							max: 最大值
							step: 步长
							placeholder: 占位符
							initialValue: 默认值
							rules: 验证规则
							disabled: 禁用
							allowClear: 是否显示清除按钮
						-->
						<a-input-number
							:min="0"
							:max="100"
							placeholder="请输入"
							:disabled="type == 'view'? true : false"
							:allowClear="false"
							v-decorator="['number',{	initialValue: 0, rules: [{ required: true, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="下拉选择单选" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 下拉选择单选
							type: select
							placeholder: 占位符
							initialValue: 默认值
							rules: 验证规则
							dataList：静态资源数组 ；
							dataType：数据类型（static/dynamic/dictCode）；
							valueFeiled：文本字段；
							textFeiled： 数据字段；
							params：接口参数；
							dictCode：code值；
							url：动态url;
							disabled: 禁用
							allowClear: 是否显示清除按钮
							showSearch: 是否可搜索
						-->
						<TDictSelectTag
							type="select"
							:disabled="type == 'view'? true : false"
							placeholder="单选"
							url="/system/dicSet/getDicItemByCode"
							:dataList="sexList"
							method="post"
							params="code:sex"
							dictCode="sex"
							dataType="dynamic"
							valueFeild="value"
							textFeild="text"
							:allowClear="false"
							:showSearch="false"
							@change="(e)=>{handleChange(e,'select')}"
							v-decorator="['select',{ initialValue:'unknown',rules: [{ required: true, message: '请输入' }] }]" 
						></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="下拉选择多选" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 下拉选择多选
							placeholder: 占位符
							initialValue: 默认值
							rules: 验证规则
							dataList：静态资源数组 ；
							dataType：数据类型（static/dynamic/dictCode）；
							params：接口参数；
							dictCode：code值；
							url：动态url;
							disabled: 禁用
							allowClear: 是否显示清除按钮
						-->
						<TMultiSelectTag
							type="select"
							:disabled="type == 'view'? true : false"
							placeholder="多选"
							url="/system/dicSet/getDicItemByCode"
							:dataList="sexList"
							params="code:sex"
							dictCode="sex"
							dataType="dynamic"
							:allowClear="false"
							@change="(e)=>{handleChange(e,'multiSelect')}"
							v-decorator="['multiSelect',{ initialValue:'unknown,female',rules: [{ required: true, message: '请输入' }] }]" 
						></TMultiSelectTag>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="单选框" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 单选框
							type: radio
							placeholder: 占位符
							initialValue: 默认值
							rules: 验证规则
							dataList：静态资源数组 ；
							dataType：数据类型（static/dynamic/dictCode）；
							valueFeiled：文本字段；
							textFeiled： 数据字段；
							params：接口参数；
							dictCode：code值；
							url：动态url;
							disabled: 禁用
							allowClear: 是否显示清除按钮
						-->
						<TDictSelectTag
							type="radio"
							:disabled="type == 'view'? true : false"
							placeholder="单选"
							url="/system/dicSet/getDicItemByCode"
							:dataList="sexList"
							method="post"
							params="code:sex"
							dictCode="sex"
							dataType="dynamic"
							valueFeild="value"
							textFeild="text"
							:allowClear="false"
							@change="(e)=>{handleChange(e,'radio')}"
							v-decorator="['radio',{initialValue:'unknown', rules: [{ required: true, message: '请输入' }] }]" 
						></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="多选框" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 多选框
							type: checkbox
							placeholder: 占位符
							initialValue: 默认值
							rules: 验证规则
							dataList：静态资源数组 ；
							dataType：数据类型（static/dynamic/dictCode）；
							valueFeiled：文本字段；
							textFeiled： 数据字段；
							params：接口参数；
							dictCode：code值；
							url：动态url;
							disabled: 禁用
							allowClear: 是否显示清除按钮
						-->
						<TMultiSelectTag
							type="checkbox"
							:disabled="type == 'view'? true : false"
							placeholder="多选"
							url="/system/dicSet/getDicItemByCode"
							:dataList="sexList"
							params="code:sex"
							dictCode="sex"
							dataType="dynamic"
							valueFeild="value"
							textFeild="text"
							:allowClear="false"
							@change="(e)=>{handleChange(e,'checkbox')}"
							v-decorator="['checkbox',{ initialValue:'unknown,female',rules: [{ required: true, message: '请输入' }] }]" 
						></TMultiSelectTag>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="日期选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 日期选择
							record: 集合参数
							parentDisabled: 是否禁用
							allowClear: 是否清除
							initialValue: 默认值  为空时 值为null
								record.range == true ->  initialValue  String  '2021-09-12 12:22:10'
								record.range == false ->  initialValue  Array  ['2021-08-20','2021-09-24']
							rules: 验证规则
						-->
						<KDatePicker
							:record="datePicker"
							:parentDisabled="type == 'view'? true : false"
							:allowClear="false"
							@change="(e)=>{handleChange(e,'datePicker')}"
							v-decorator="['datePicker',{	initialValue: defaultDataValue, rules: [{ required: true, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="时间选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 时间选择
							record: 集合参数
							parentDisabled: 是否禁用
							allowClear: 是否清除
							initialValue: 默认值  为空时 值为null
							rules: 验证规则
						-->
						<KTimePicker
							:record="timePicker"
							:parentDisabled="type == 'view'? true : false"
							:allowClear="false"
							@change="(e)=>{handleChange(e,'timePicker')}"
							v-decorator="['timePicker',{	initialValue: '17:40:57', rules: [{ required: true, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="评分" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 时间选择
							count: start总数
							allowHalf:  是否允许半选
							disabled: 是否禁用
							allowClear: 是否清除
							initialValue: 默认值
							rules: 验证规则
						-->
						<a-rate
							:count="5"
							:disabled="type == 'view'? true : false"
							:allowHalf="true"
							:allowClear="false"
							@change="(e)=>{handleChange(e,'rate')}"
							v-decorator="['rate',{	initialValue: 2, rules: [{ required: false, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="滑动输入条" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 滑动输入条-->
						<a-row type="flex" justify="start">
							<a-col :span="16" style="min-height: 30px;">
							<!-- 滑动条
								min: 最小值
								max:  最大值
								step: 步长
								disabled: 是否禁用
								vertical: 展示方向->true：垂直  false：水平
							-->
							<a-slider
								:disabled="type == 'view'? true : false"
								:min="0"
								:max="100"
								:step="1"
								:vertical="false"
								v-decorator="['slider',{	initialValue: 10, rules: [{ required: false, message: '请输入' }] }]" 
							/>
							</a-col>
							<a-col class="margin-left-sm" :span="4" v-if="showSliderInput">
							<!-- 输入框
								min: 最小值
								max:  最大值
								step: 步长
								disabled: 是否禁用
							-->
							<a-input-number
								style="width:100%"
								:disabled="type == 'view'? true : false"
								:min="0"
								:max="100"
								:step="1"
								@change="(e)=>{handleChange(e,'slider')}"
								v-decorator="['slider',{	initialValue: 10, rules: [{ required: false, message: '请输入' }] }]" 
							/>
							</a-col>
						</a-row>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="上传文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 上传文件
							record: 参数集合
							config: 请求数据集合
							parentDisabled: 是否禁用
							dynamicData: 是否清除
							initialValue: 默认值 为空时 值为[]
						-->
						<UploadFile
							:record="upLoadFileData"
							:config="upLoadFileConfigData"
							:dynamicData="dynamicData"
							:parentDisabled="type == 'view'? true : false"
							@change="(e)=>{handleChange(e,'uploadFile')}"
							v-decorator="['uploadFile',{	initialValue: [], rules: [{ required: false, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="上传图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 上传图片
							record: 参数集合
							config: 请求数据集合
							parentDisabled: 是否禁用
							dynamicData: 是否清除
							initialValue: 默认值 为空时 值为[]
							rules: 验证规则
						-->
						<UploadImg
							:record="upLoadImgData"
							:config="upLoadImgConfigData"
							:parentDisabled="type == 'view'? true : false"
							@change="(e)=>{handleChange(e,'uploadImg')}"
							v-decorator="['uploadImg',{	initialValue: [], rules: [{ required: false, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="树选择器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 树选择器
							placeholder: 占位符
							multiple: 是否可以多选
							showSearch: 是否可搜索
							treeCheckable: 是否可勾选
							disabled: 是否禁用
							allowClear: 清除按钮
							treeData：数据列表
							fathersUrl：第一层级接口
							expandUrl：展开数据接口
							fathersParma：第一层级接口请求参数
							childParma：展开数据接口请求参数
							initialValue: 默认值 为空时 值为[]
							rules: 验证规则
						-->
						<TreeSelect
							placeholder="树选择器"
							:multiple="false"
							:showSearch="false"
							:treeCheckable="false"
							:treeData="treeData"
							:disabled="type == 'view'? true : false"
							:allowClear="false"
							url="/mockXHR/portal/getTreeData"
							parameter=""
							method="post"
							@change="(e)=>{handleChange(e,'treeSelect')}"
							v-decorator="['treeSelect',{	initialValue: [], rules: [{ required: false, message: '请输入' }] }]" 
						></TreeSelect>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="级联选择器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 级联选择器
							placeholder: 占位符
							showSearch: 是否可搜索
							disabled: 是否禁用
							allowClear: 清除按钮
							options：数据列表
							initialValue: 默认值 为空时 值为[]
							rules: 验证规则
						-->
						<a-cascader
							placeholder="请选择"
							:showSearch="false"
							:options="cascaderList"
							:disabled="type == 'view'? true : false"
							:allowClear="true"
							url="/mockXHR/portal/getCascaderData"
							parameter=""
							method="post"
							@change="(e)=>{handleChange(e,'cascader')}"
							v-decorator="['cascader',{	initialValue: [], rules: [{ required: false, message: '请输入' }] }]" 
						/>
						<!-- <Tcascader
							placeholder="请选择"
							:multiple="true"
							:showSearch="false"
							:treeCheckable="false"
							:treeData="cascaderList"
							:disabled="false"
							:allowClear="true"
							fathersUrl="/mdata/organization/getListByLevelId"
							expandUrl="/mdata/organization/getListByPid"
							fathersParma="levelId:1"
							childParma=""
							text-feild="text"
							value-feild="id"
							@change="(e)=>{handleChange(e,'cascader')}"
							v-decorator="['cascader',{	initialValue: [], rules: [{ required: false, message: '请输入' }] }]" 
							></Tcascader> -->
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="开关" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 开关
							editorValue: 文本数据
							parentDisabled: 是否禁用
							width: 宽度
							height：高度
							initialValue: 默认值 为空时 值为[]
							rules: 验证规则
						-->
						<a-switch
							:disabled="type == 'view'? true : false"
							@onchange="(e)=>{handleChange(e,'switch')}"
							v-decorator="['switch',{	initialValue: true,valuePropName: 'checked', rules: [{ required: false, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="按钮" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 按钮
							buttonText: 按钮文字
							type: 设置按钮类型，可选值为 primary dashed danger link 或者不设
							disabled: 是否禁用
							ghost: 幽灵属性，使按钮背景透明
							icon：设置按钮的图标类型
							shape: 设置按钮形状，可选值为 circle、 round 或者不设
							size: 设置按钮大小，可选值为 small large 或者不设
							block: 将按钮宽度调整为其父宽度的选项
							html-type：设置 button 原生的 type 值,handle属性值为'submit'时值为submit，否则值为undefined
						-->
						<a-button
							:disabled="type == 'view'? true : false"
							@click="handleButton('reset')"
							type="primary"
							:ghost="false"
							:icon="null"
							:shape="null"
							size="default"
							:block="false"
							html-type='submit'
							v-text="buttonText"
							></a-button>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="警告提示" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 警告提示
							message: 警告提示内容
							description: 警告提示的辅助性文字介绍
							type: 指定警告提示的样式，有四种选择 success、info、warning、error
							showIcon: 是否显示辅助图标
							closable: 默认不显示关闭按钮
							banner: 是否用作顶部公告
						-->
						<a-alert
							message="警告提示"
							description=""
							type="success"
							:showIcon="false"
							:closable="false"
							:banner="false"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="文字" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 文字
							editorValue: 标签值
							textAlign: 文字对齐方式，可选left、center、right
							width: 宽度
							lineHeight: 文字行高
							showRequiredMark: 显示必选标记
							textBold: 加粗
							textItalic: 斜体
							textUnderline: 下划线
							textStrikethrough: 删除线
							fontSize: 字体大小
							color：字体颜色
						-->
						<div
							:style="{
							textAlign: 'left',
							width: '100%',
							lineHeight: '',
							}"
							>
							<label
							:class="{
								'ant-form-item-required': false,
								'text-bold': false,
								'text-italic': false,
								'text-decoration': false,
								'text-strikethrough': false,
								}"
							:style="{
								fontSize: '14' + 'px',
								color: 'rgba(0,0,0,.65)',
								}"
							v-text="editorValue"
							></label>
						</div>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="HTML" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- HTML
							HtmlValue: 显示值
						-->
						<div
							v-html="HtmlValue"
						>
							{{ HtmlValue }}
						</div>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="图标选择器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 图标选择器
							disabled: 是否禁用
							placeholder：占位符
						-->
						<iconFontPicker
							:disabled="type == 'view'? true : false"
							placeholder="图标选择器"
							@onchange="(e)=>{handleChange(e,'icon')}"
							v-decorator="['icon',{	initialValue: 'bug', rules: [{ required: false, message: '请输入' }] }]" 
						></iconFontPicker>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="颜色选择器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 颜色选择器
							value: 默认值
							disabled: 是否禁用
							placeholder：占位符
							showprecolor：显示预制颜色
							showhistorycolor：显示历史颜色记录
							showPalette：显示色盘
							canMove：可拖拽
							size：大小  可选default、large、small
							format：颜色类型 可选rgba、hex、hsla
						-->
							<colorPicker 
								:disabled="type == 'view'? true : false"
								value="#924848"	
								placeholder="请选择颜色"
								:showprecolor="false"
								:showhistorycolor="true"	
								format="hex"
								:showPalette="true"
								size="default"
								:canMove="true"
								v-decorator="['color',{	 rules: [{ required: false, message: '请输入' }] }]" 
								></colorPicker>
								<!-- initialValue: 'rgba(85, 170, 255, 0.5)', -->
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="人员选择器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 人员选择器
							disabled: 是否禁用
							placeholder：占位符
							multiple:  是否可以多选
						-->
						<t-select-user-by-dep
							:multiple="true"
							:disabled="type == 'view'? true : false"
							placeholder="人员选择器"
							v-decorator="['userPop',{	initialValue: '', rules: [{ required: false, message: '请输入' }] }]" 
							></t-select-user-by-dep>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="字典选择器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 字典选择器
							disabled: 是否禁用
							placeholder：占位符
							multiple:  是否可以多选
							dictCode: 字典值
						-->
						<t-dict-select-tag
							:multi="true"
							:disabled="type == 'view'? true : false"
							placeholder="字典选择"
							dictCode="sex"
							@change="(e) => {handleChange(e, 'code');}"
							v-decorator="['code',{	initialValue: '', rules: [{ required: false, message: '请输入' }] }]" 
							></t-dict-select-tag>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="组织机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 组织机构
							multi: 选择父机构勾选全部子机构  默认为true
							disabled: 是否禁用
							placeholder：占位符
							multiple:  是否可以多选
						-->
						<t-select-depart
							:multi="true"
							:disabled="type == 'view'? true : false"
							placeholder="请选择组织"
							@onchange="(e)=>{handleChange(e,'depart')}"
							v-decorator="['depart',{	initialValue: '', rules: [{ required: false, message: '请选择组织' }] }]" 
							></t-select-depart>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="省市区" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 省市区
							type: 展示类型  可选select、cascader
							disabled: 是否禁用
							placeholder：占位符
							dictCode:  是否可以多选
						-->
						<TAreaLinkage	
							type="cascader"
							:disabled="type == 'view'? true : false"
							placeholder="请选择"
							@onchange="(e)=>{handleChange(e,'area')}"
							v-decorator="['area',{	initialValue: '120104', rules: [{ required: false, message: '请选择' }] }]" 
							></TAreaLinkage>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="倒计时" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 倒计时
							disabled: 是否禁用
							placeholder：占位符
							format:  格式化倒计时展示,
							initialValue: 时间戳格式 Number
						-->
						<a-statistic-countdown
							:disabled="type == 'view'? true : false"
							placeholder="倒计时"
							format="HH:mm:ss"
							v-decorator="['countdown',{	initialValue: 1629861152116, rules: [{ required: false, message: '请选择' }] }]" 
							>
							</a-statistic-countdown>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<!-- uuid  数据必需一般不显示 type="hidden"-->
						<a-form-item>	
						<a-input v-decorator="['uuid']" disabled type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
				<!-- 栅格布局
					type: 布局模式  可选defalut、flex
					justify\align: 仅在flex 布局下存在   水平垂直方式
					gutter： 栅格间距
				-->
				<a-row >
					<a-form-item>
					<a-divider
						orientation="left"
						:dashed="false"
						>栅格布局</a-divider>
					</a-form-item>
				</a-row>
				<a-row 
					:gutter="gridList.options.gutter" 
					:type="gridList.options.type" 
					:justify="gridList.options.justify" 
					:align="gridList.options.align">
					<a-col :span="item.span" v-for="(item,index) in gridList.columns" :key="index">
						<a-form-item v-for="(formItem,formindex) in item.list" :key="formindex" :label="formItem.label">
								<a-input
									type="text"
									v-decorator="['formItem.options.text',{	initialValue: '栅格', rules: [{ required: true, message: '请输入' }] }]" 
									placeholder="请输入"
									:disabled="type == 'view'? true : false"
									:allowClear="false"
									:maxLength="140"
									:border="gridList.options.formBorder || false"
									addonBefore=""
									addonAfter=""/>
						</a-form-item>
					</a-col>
				</a-row>
				<!-- 标签Tabs布局 
					tabBarGutter: 标签间距
					type: 页签类型  可选line、card、editable-card
					tabPosition：页面位置  可选top、left、right、bottom
					size: 标签大小 可选small、default、large
					animated: 是否动画切换
				-->
				<a-row >
					<a-form-item>
					<!-- 分割线
						orientation: 标题位置  可选left、right
						dashed:  是否是虚线
					-->
					<a-divider
						orientation="left"
						:dashed="false"
						>标签Tabs布局</a-divider
						>
					</a-form-item>
				</a-row>
				<a-tabs
					:default-active-key="0"
					:tabBarGutter="null"
					type="line"
					size="default"
					tabPosition="top"
					:animated="false"
					>
					<a-tab-pane
						v-for="(tabItem, index) in tabList"
						:key="index"
						:tab="tabItem.label"
					>
						<!-- 动态表格
							kbatchRecord: 所需参数
							parentDisabled: 是否禁用
						-->
						<a-form-item :label="tabItem.label" :labelCol="labelCol" :wrapperCol="wrapperCol">	
						<KBatch
							ref="dynamicTable"
							style="width:100%"
							:record="kbatchRecord"
							:parentDisabled="type == 'view'? true : false"
							:dynamicData="dynamicData"
							@change="(e)=>{handleChange(e,'kbatch')}"
							v-decorator="['kbatch',{rules: [{ required: false, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</a-tab-pane>
				</a-tabs>
				<!-- 卡片布局 
					title: 标签名称
					bordered: 是否显示边框
				-->
				<a-card
					class="grid-row"
					title="卡片布局"
					:bordered="false"
					>
					<div class="grid-col">
						<a-form-item label="富文本编辑器" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<!-- 富文本编辑器
							editorValue: 文本数据
							parentDisabled: 是否禁用
							width: 宽度
							height：高度
							initialValue: 默认值 为空时 值为[]
							rules: 验证规则
						-->
						<editor
							ref="KEditor"
							:disable="type == 'view'? true : false"
							width='100%'
							:height="300"
							placeholder="富文本编辑器"
							@onchange="(e)=>{handleChange(e,'editor')}"
							v-decorator="['editor',{	initialValue: editorValue, rules: [{ required: false, message: '请输入' }] }]" 
						/>
						</a-form-item>
					</div>
				</a-card>
				<!-- 表格布局 
					bright: 鼠标经过点亮
					small: 紧凑型
					bordered: 显示边框
					formBorder: 隐藏组件边框,
					customStyle: 表格样式
				-->
				<a-row >
					<a-form-item>
					<!-- 分割线
						orientation: 标题位置  可选left、right
						dashed:  是否是虚线
					-->
					<a-divider
						orientation="left"
						:dashed="false"
						>表格布局</a-divider
						>
					</a-form-item>
				</a-row>
				<table
					class="table-layout kk-table-9136076486841527"
					:class="{
						bright: false,
						small: true,
						bordered: true,
						formBorder: false,
					}"
					:style="{}"
					>
					<tr v-for="(trItem, trIndex) in tableList" :key="trIndex">
						<td
						class="table-td"
						v-for="(tdItem, tdIndex) in trItem.tds"
						:key="tdIndex"
						:colspan="tdItem.colspan"
						:rowspan="tdItem.rowspan">
							<a-form-item label="单行文本" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input 
									type="text"
									v-decorator="['input',{	initialValue: 'input', rules: [{ required: true, message: '请输入' }] }]" 
									placeholder="请输入"
									:disabled="false"
									:allowClear="false"
									:maxLength="140"
									addonBefore=""
									addonAfter=""/>
							</a-form-item>
						</td>
					</tr>
				</table>
			</a-form>
	  </a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick'

import KBatch from "@/components/TopVUI/k-form-design/packages/KBatch/batch.vue";
import KDatePicker from '@/components/TopVUI/k-form-design/packages/KDatePicker';
import KTimePicker from '@/components/TopVUI/k-form-design/packages/KTimePicker';
import UploadFile from '@/components/TopVUI/k-form-design/packages/UploadFile';
import UploadImg from '@/components/TopVUI/k-form-design/packages/UploadImg';
import TSelectUserByDep from "@/components/TopVUI/custom/TSelectUserByDep";
import TSelectDepart from "@/components/TopVUI/custom/TSelectDepart";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
import TreeSelect from "@/components/TopVUI/k-form-design/packages/components/formTreeSelect.vue";
import editor from "@/components/TopVUI/custom/Editor/index.vue";
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker.vue";
import colorPicker from "@/components/TopVUI/color/colorPicker.vue";
import Tcascader from '@/components/TopVUI/k-form-design/packages/components/Tcascader.vue';

// 表单字段
const fields = [
	'uuid',
	'input',
	'password',
	'textarea',
	'number',
	'select',
	'multiSelect',
	'radio',
	'checkBox',
	'datePicker',
	'timePicker',
	'rate',
	'slider',
	'uploadFile',
	'uploadImg',
	'treeSelect',
	'cascader',
	'editor',
	'switch',
	'icon',
	'color',
	'userPop',
	'depart',
	'area',
	'countdown',
	'code',
	'kbatch'
]
export default {
 	components: {
		KBatch,
		KDatePicker,
		KTimePicker,
		UploadFile,
		UploadImg,
		TDictSelectTag,
		TMultiSelectTag,
		TSelectUserByDep,
		TSelectDepart,
		TAreaLinkage,
		TreeSelect,
		editor,
		iconFontPicker,
		colorPicker, 
		Tcascader
 	},
  	props: {
			visible: {
				type: Boolean,
				required: true,
			},
			loading: {
				type: Boolean,
				default: () => false
			},
			model: {
				type: Object,
				default: () => null
			}
  	},
 	data() {
    	return {
			cancelText: '取消',//取消按钮文本
			okText: '确定',//确定按钮文本
			// 普通布局--start
			rowGutter:0,
			colSpan:12,
			labelCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 7,
				},
			},
			wrapperCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 13,
				},
			},
			// 普通布局--end
			// 栅格--start
			gridList:{
				columns:[{
					span: 12,
					list: [{
						type:'input',
						label: 'input1',
						options:{
							type: 'text1',
							text: '1'
						}
					},{
						type:'input',
						label: 'input2',
						options:{
							type: 'text2',
							text: '2'
						}
					}]
				},{
					span: 12,
					list: [{
						type:'input',
						label: 'input3',
						options:{
							type: 'text3',
							text: '3'
						}
					},{
						type:'input',
						label: 'input4',
						options:{
							type: 'text4',
							text: '4'
						}
					}]
				}],
				options: {
					type: "flex",
					gutter: 20,
					justify: "start",
					align: "top",
					tableStyle: false,
					formBorder: false,
				}
			},
			// 栅格--end
			// 标签页布局--start
			tabList:[{
				value: "1",
				label: "选项1",
			},{
				value: "2",
				label: "选项2",
			}],
			// 标签页布局--end
			// 表格布局--start
			tableList: [{
				tds: [{
					colspan: 1,
					rowspan: 1,
					list: []
				},{
					colspan: 1,
					rowspan: 1,
					list: []
				}]
			},{
				tds: [{
					colspan: 1,
					rowspan: 1,
					list: []
				},{
					colspan: 1,
					rowspan: 1,
					list: []
				}]
			}],
			// 表格布局--end
			type:'edit',//是编辑还是预览 edit、view
			form: this.$form.createForm(this),
			dynamicData:{},
			sexList:[],//数组
			datePicker:{//日期选择器数据参数
				type:'date', //选择类型 data
				options:{
					width:'100%', //选择框宽度
					range: false,  // 是否能选择日期范围
					showTime:false,  //是否能选择时间
					format: 'yyyy-MM-DD'  ,//日期格式
					clearable: false,//显示清除按钮
					disabled: false,// 是否禁用
					placeholder: '请选择',  // range为false时  占位符
					rangePlaceholder: [	 //range为true时  占位符
						"开始时间",
						"结束时间"
					],
				},
			},
			defaultDataValue: [//日期选择器range: true默认时间格式
				"2021-08-20",
				"2021-08-27"
			],
			timePicker:{//时间选择器数据格式
				options:{
					width:'100%', //选择框宽度
					format: 'HH:mm:ss'  ,//时间格式
					clearable: false,//显示清除按钮
					placeholder: '请选择',  // 占位符
					disabled: false,// 是否禁用
					use12Hours: false,  //是否显示12小时制
				},
			},
			showSliderInput:true,//滑块组件是否显示输入框
			upLoadFileData:{//上传文件数据
				options: {
					width: '100%',//宽度
					drag :  false , //是否可拖拽
					fileName: 'file' , //文件参数名
					multiple: false, //是否支持多选
					limit: 3, //上传最大数量
					disabled: false , //是否禁用
					data: '{}',//额外参数（json格式）
					action: '/system/attachment/upload',//上传请求地址
					headers: {} ,//请求头部
					downloadWay: 'a',//下载方式  可选a、ajax	
					dynamicFun: '',//动态函数名
					placeholder: '上传',//上传区文字提示
					defaultValue: [] ,//默认值
				}
			},
			upLoadFileConfigData:{},//上传文件数据
			upLoadImgData:{//上传图片数据
				options: {
					width: '100%',//宽度
					drag :  false , //是否可拖拽
					fileName: 'file' , //文件参数名
					multiple: false, //是否支持多选
					limit: 3, //上传最大数量
					disabled: false , //是否禁用
					data: '{}',//额外参数（json格式）
					listType: 'picture',//上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
					action: '/system/attachment/upload',//上传请求地址
					headers: {} ,//请求头部
					downloadWay: 'a',//下载方式  可选a、ajax	
					dynamicFun: '',//动态函数名
					placeholder: '上传',//上传区文字提示
					defaultValue: [] ,//默认值
				}
			},
			upLoadImgConfigData: {},//上传图片数据
			treeData:[],//数选择器数据
			cascaderList:[//级联选择器数据格式
				{"value": "1","label": "选项1","children": [
						{"value": "11","label": "选项11"}]
				},
				{"value": "2","label": "选项2","children": [
						{"value": "22","label": "选项22"}]
				}
			],
			editorValue:'今天天气真晴朗',//富文本默认值
			buttonText: '按钮', //按钮默认值
			HtmlValue: '<p>今天天气真晴朗</p>',  //HTML默认值
			kbatchRecord:{ //动态表单值
				list:[{ //表格内插入的表头数据
					type: "input", // 表单类型
					label: "姓名", // 标题文字
					icon: "icon-write",
					options: {
						type: "text",
						width: "100%", // 宽度
						defaultValue: "", // 默认值
						placeholder: "请输入", // 没有输入时，提示文字
						clearable: false,
						maxLength: null,
						hidden: false, // 是否隐藏，false显示，true隐藏
						disabled: false // 是否禁用，false不禁用，true禁用
					},
					model: "input_1629714430728", // 数据字段 
					oldModel: "input_1629714430728",
					key: "input_1629714430728",
					prefix: "",
					suffix: "",
					rules: [//验证规则
						{
							required: true, // 必须填写
							message: "必填项"
						}
					]
				}],
				options: {
					scrollY: 300,  //竖向滚动条
					disabled: false,  //禁用
					hidden: false,//隐藏
					showLabel: false, //显示label
					hideSequence: false,  //隐藏序号
					width: "100%",  //宽度
					defaultValue: "[{\"switch_1629706863761\":\"\",\"key\":1629706888941}]",  //默认值
				},
				model: "batch_1629706860169",
				oldModel: "batch_1629706860169",
				key: "batch_1629706860169"
			}
    	};
 	},
	created() {
		// 防止表单未注册
		fields.forEach(v => this.form.getFieldDecorator(v))

		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
		this.model && this.form.setFieldsValue(pick(this.model, fields))
		})
		//获取数据字典数据
		// this.getDicItemByCode()
	},
	computed: {
		titleType() {
			if(this.type=='edit'){
				return '新增/编辑'
			} else{
				return '详情'
			}
		},
	},
  	methods: {
		add(m){
			console.log("123")
			this.type = 'edit' 
		},
		edit(m,type){
			console.log('type', type)
			this.type = type 
		},
		//选择回调
		handleChange(e,key){
			this.$nextTick(()=>{
				if(key == 'editor')this.editorValue = e
				console.log("e",e,key)
				this.form.setFieldsValue({
					key: e
				});
			})
		},
		// 按钮事件回调
		handleButton(type){
			if(type == 'reset'){
				console.log('重置')
			}
		},
   	 	// 提交
		handleOk() {
      		// 测试
			var that = this
			that.$nextTick(()=>{
				that.confirmLoading = true
				let validate;
				console.log('validate', that.$refs.dynamicTable)

				if (!that.$refs.dynamicTable){
					validate = true
				} else {
					validate = that.$refs.dynamicTable[0].validationSubform()
				}
				if(validate){
					that.$emit('ok')
				}
			})
		},
		//获取数据字典值
		getDicItemByCode(){
			let that = this
			let url = '/system/dicSet/getDicItemByCode'
			//下拉框
			that.$post(url, {code : 'sex'}).then(res => {
					that.sexList = res.data
				}).catch(err => {});
		},
  	},
};
</script>

<style>
</style>
