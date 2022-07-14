<template>
	<div class="properties-centent kk-checkbox">
<!-- 		<div class="head-title">
			控件属性设置
		</div> -->
		<div class="properties-body">
			<p class="hint-box" v-show="selectItem.key === ''">未选择控件</p>
			<a-form v-show="selectItem.key !== ''" labelAlign="left">
				<!-- <a-form-item v-if="selectItem.type != 'grid'" :labelCol="labelCol" :wrapperCol="wrapperCol" label="控件栅格">
					<a-slider v-model="selectItem.grid" :min="6" :max="24" :step="2" />
				</a-form-item> -->
				<a-form-item v-if="(typeof selectItem.label) !== 'undefined'" label="标签" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="selectItem.label" placeholder="请输入" @change="titleChange()" />
				</a-form-item>

				<!-- 动态表格 -->
				<a-form-item v-if="selectItem.type === 'batch'" label="关联表" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TDictSelectTag type="select" dataType="dynamic" method="post" url="/system/sysGenTable/getAll"
						params="{}" valueFeild="tableName" textFeild="tableName" v-model="selectItem.options.tableName">
					</TDictSelectTag>
				</a-form-item>
				<template v-else-if="!~['table', 'grid', 'tabs', 'card', 'batch','divider'].indexOf(selectItem.type)">
					<a-form-item
						v-if="!hideModel && (typeof selectItem.model) !== 'undefined' && (!['default'].includes(basicData.basicLayout) || batchName)"
						label="数据字段" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-select v-model="selectItem.model" placeholder="请选择字段名" style="width: 100%"
							@change="fieldChange">
							<a-select-option v-for="item in columnNameArr" :key="item.columnName">
								{{`${item.columnName}(${item.columnComment})`}}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item v-else label="数据字段" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-if="
						    ~['table', 'grid', 'tabs', 'card', 'batch'].indexOf(
						      selectItem.type
						    )
						  " v-model="selectItem.model" placeholder="请输入" />
						<a-input-search v-else v-model="selectItem.model" placeholder="请输入字段名" @search="onSearch">
							<a-button slot="enterButton">保存</a-button>
						</a-input-search>
						<a-input v-model="selectItem.oldModel" placeholder="请输入字段名" type="hidden" />
					</a-form-item>
				</template>
				<!-- input type start -->
				<a-form-item v-if="selectItem.type === 'input'" label="输入框type" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<!-- <a-input v-model="options.type" placeholder="请输入" /> -->
					<a-select v-model="options.type">
						<a-select-option value="text">普通文本框</a-select-option>
						<a-select-option value="password">密码框</a-select-option>
					</a-select>
				</a-form-item>
				<!-- input type end -->
				<a-form-item v-if="
            typeof options.rangePlaceholder !== 'undefined' && options.range
          " label="占位内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="请输入" v-model="options.rangePlaceholder[0]" />
					<a-input placeholder="请输入" v-model="options.rangePlaceholder[1]" />
				</a-form-item>

				<a-form-item v-else-if="(typeof options.placeholder) !== 'undefined'" label="占位内容" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input placeholder="请输入" v-model="options.placeholder" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'textarea'" label="内容高度" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					Min：
					<a-input-number style="width:80% !important" addon-before="最小" v-model="options.minRows"
						placeholder="最小高度" />
					Max：
					<a-input-number style="width:80% !important" v-model="options.maxRows" placeholder="最大高度" />
				</a-form-item>
				<a-form-item v-if="(typeof options.width) !== 'undefined'" label="宽度" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input placeholder="请输入" v-model="options.width" />
				</a-form-item>
				<a-form-item v-if="(typeof options.height) !== 'undefined'" label="高度" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number v-model="options.height" />
				</a-form-item>
				<a-form-item v-if="(typeof options.step) !== 'undefined'" label="步长" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number v-model="options.step" placeholder="请输入" />
				</a-form-item>
				<a-form-item v-if="(typeof options.min) !== 'undefined'" label="最小值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number v-model="options.min" placeholder="请输入" />
				</a-form-item>
				<a-form-item v-if="(typeof options.max) !== 'undefined'" label="最大值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number v-model="options.max" placeholder="请输入" />
				</a-form-item>
				<a-form-item v-if="(typeof options.tabBarGutter) !== 'undefined'" label="标签间距" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number v-model="options.tabBarGutter" placeholder="请输入" />
				</a-form-item>
				<a-form-item v-if="(typeof options.precision) !== 'undefined'" label="数值精度" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number :min="0" :max="50" v-model="options.precision" placeholder="请输入" />
				</a-form-item>
				<!-- 选项配置及动态数据配置 start -->
				<template v-if="selectItem.type == 'treeSelect' || selectItem.type == 'cascader'">
					<a-form-item label="请求方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-select v-model="options.method">
							<a-select-option value="get">get</a-select-option>
							<a-select-option value="post">post</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="数据接口配置" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-model="options.url" :title="options.url" placeholder="请输入接口地址" allow-clear />
						<a-textarea :row="4" v-model="options.parameter" placeholder="接口参数"></a-textarea>
					</a-form-item>
				</template>
				<!-- 选项配置及动态数据配置 start -->
				<template v-if="~['select', 'radio', 'checkbox'].indexOf(selectItem.type)">
					<a-form-item v-if="typeof options.options !== 'undefined'" label="选项配置" :labelCol="labelCol"
						:wrapperCol="wrapperCol">
						<a-radio-group buttonStyle="solid" v-model="options.dataType" class="margin-bottom-xs">
							<a-radio-button value="dynamic"> 动态 </a-radio-button>
							<a-radio-button value="static"> 静态 </a-radio-button>
							<a-radio-button value="code">字典 </a-radio-button>
						</a-radio-group>
						<a-input-group compact
							v-show="options.dataType === 'dynamic' && selectItem.type != 'treeSelect'">
							<a-select v-model="options.method">
								<a-select-option value="get">get</a-select-option>
								<a-select-option value="post">post</a-select-option>
							</a-select>
							<a-input style="width: 72%;" v-model="options.url" :title="options.url"
								placeholder="请输入接口地址" allow-clear />
						</a-input-group>
						<KChangeOption v-show="options.dataType === 'static'" v-model="options.options" :type="
                ~['cascader', 'treeSelect'].indexOf(selectItem.type)
                  ? 'tab'
                  : 'option'
              " />
						<a-input v-show="options.dataType === 'code'" v-model="options.dictCode" placeholder="接口参数">
						</a-input>
						<a-textarea v-show="options.dataType === 'dynamic'" v-model="options.dynamicKey"
							placeholder="接口参数"></a-textarea>
					</a-form-item>
					<a-form-item v-if="
              typeof options.options !== 'undefined' &&
                !~['cascader', 'treeSelect'].indexOf(selectItem.type)
            " label="数据字段配置" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-model="options.textFeild" placeholder="文本字段"></a-input>
						<a-input v-model="options.valueFeild" placeholder="数据字段"></a-input>
					</a-form-item>
				</template>
				<!-- 选项配置及动态数据配置 end -->
				<!-- tabs配置 start -->
				<a-form-item v-if="selectItem.type === 'tabs'" label="页签配置" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<KChangeOption v-model="selectItem.columns" type="tab" />
				</a-form-item>
				<!-- tabs配置 end -->

				<a-form-item v-if="selectItem.type === 'grid'" label="表格样式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<kCheckbox v-model="selectItem.options.tableStyle" label="启用表格样式" />
					<kCheckbox v-model="selectItem.options.formBorder" label="隐藏组件边框样式" />
				</a-form-item>

				<a-form-item v-if="selectItem.type === 'grid'" label="栅格间距" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number v-model="selectItem.options.gutter" placeholder="请输入" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'grid'" label="栅格高度" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<div class="flex">
						<a-input-number style="width: 80%;" v-model="selectItem.options.gridHeight" placeholder="请输入" />
						px
					</div>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'grid'" label="布局模式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.type" class="margin-bottom-xs">
						<a-radio-button value="default"> default </a-radio-button>
						<a-radio-button value="flex"> flex </a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'grid' && options.type === 'flex'" label="水平排列"
					:labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-select v-model="options.justify">
						<a-select-option value="start">start</a-select-option>
						<a-select-option value="end">end</a-select-option>
						<a-select-option value="center">center</a-select-option>
						<a-select-option value="space-around">space-around</a-select-option>
						<a-select-option value="space-between">space-between</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'grid' && options.type === 'flex'" label="垂直排列"
					:labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-select v-model="options.align">
						<a-select-option value="top">top</a-select-option>
						<a-select-option value="middle">middle</a-select-option>
						<a-select-option value="bottom">bottom</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'grid'" label="列配置项" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<KChangeOption v-model="selectItem.columns" type="colspan" />
				</a-form-item>

				<a-form-item v-if="selectItem.type === 'switch'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-switch v-model="options.defaultValue" />
				</a-form-item>
				<!-- <a-form-item
          v-if="
            selectItem.type === 'uploadFile' || selectItem.type === 'uploadImg'
          "
          label="默认值" :labelCol="labelCol" :wrapperCol="wrapperCol"
        >
          <a-input v-model="options.defaultValue" />
        </a-form-item> -->
				<a-form-item v-if="selectItem.type === 'color'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<div class="flex">
						<a-input style="width: 80% !important;" v-model="options.defaultValue" />
						<colorPicker style="margin-left: 5px;" v-model="options.defaultValue"
							:formatType="options.formatType" @change="changeDefaultValueColor"></colorPicker>
					</div>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'userPop'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TSelectUserByDep v-model="options.defaultValue" :multiple="options.multiple"></TSelectUserByDep>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'area'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TAreaLinkage v-model="options.defaultValue" :type="options.areaType">
					</TAreaLinkage>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'icon'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<iconFontPicker v-model="options.defaultValue"> </iconFontPicker>
				</a-form-item>

				<a-form-item v-if="selectItem.type === 'depart'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TSelectDepart :multi="true" v-model="options.defaultValue">
					</TSelectDepart>
				</a-form-item>
				<a-form-item v-if="['number', 'slider'].indexOf(selectItem.type) >= 0" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number :step="options.step" :min="options.min || -Infinity" :max="options.max || Infinity"
						v-model="options.defaultValue" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'rate'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-rate v-model="options.defaultValue" :allowHalf="options.allowHalf" :count="options.max" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'select'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TDictSelectTag v-if="!options.multiple" :dataType="options.dataType" :url="options.url"
						:dataList="options.options" :method="options.method" :params="options.dynamicKey"
						:dictCode="options.dictCode" :valueFeild="options.valueFeild" :textFeild="options.textFeild"
						type="select" v-model="options.defaultValue"></TDictSelectTag>
					<TMultiSelectTag v-else :dataType="options.dataType" :url="options.url" :dataList="options.options"
						:method="options.method" :params="options.dynamicKey" :dictCode="options.dictCode"
						:valueFeild="options.valueFeild" :textFeild="options.textFeild" type="select"
						v-model="options.defaultValue"></TMultiSelectTag>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'radio'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TDictSelectTag :dataType="options.dataType" :url="options.url" :dataList="options.options"
						:method="options.method" :params="options.dynamicKey" :dictCode="options.dictCode"
						:valueFeild="options.valueFeild" :textFeild="options.textFeild" type="radio"
						v-model="options.defaultValue"></TDictSelectTag>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'checkbox'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TMultiSelectTag :dataType="options.dataType" :url="options.url" :dataList="options.options"
						:method="options.method" :params="options.dynamicKey" :dictCode="options.dictCode"
						type="checkbox" v-model="options.defaultValue"></TMultiSelectTag>
				</a-form-item>
				<!-- 日期选择器默认值 start -->
				<a-form-item v-if="selectItem.type === 'date'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<KDatePicker :record="selectItem" :allowClear="options.clearable"
						:value="!options.range ? options.defaultValue : options.rangeDefaultValue"
						@change="changeDatePicker" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'time'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<KTimePicker :record="selectItem" :allowClear="options.clearable" v-model="options.defaultValue"
						@change="handleChangeCommon($event,'defaultValue')" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'treeSelect'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<TreeSelect :placeholder="selectItem.options.placeholder" :multiple="selectItem.options.multiple"
						:showSearch="selectItem.options.showSearch" :treeCheckable="selectItem.options.treeCheckable"
						:treeData="selectItem.options.options" :allowClear="selectItem.options.clearable"
						:url="selectItem.options.url" :parameter="selectItem.options.parameter"
						:method="selectItem.options.method" v-model="options.defaultValue" @change="handleChangeTree">
					</TreeSelect>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'cascader'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<Tcascader :placeholder="selectItem.options.placeholder" :allowClear="selectItem.options.clearable"
						:url="selectItem.options.url" :parameter="selectItem.options.parameter"
						:method="selectItem.options.method" :record="selectItem"
						@change="handleChangeCommon($event,'defaultValue')" v-model="options.defaultValue"></Tcascader>
				</a-form-item>

				<!-- 其余默认值 start -->
				<a-form-item v-if="
            ![
              'number',
              'radio',
              'checkbox',
              'date',
							'time',
              'rate',
              'select',
              'switch',
              'slider',
              'html',
              'userPop',
              'depart',
              'area',
              'icon',
              'color',
              'uploadFile',
              'uploadImg',
							'batch',
							'divider',
							'treeSelect',
							'cascader'
            ].includes(selectItem.type) &&
              typeof options.defaultValue !== 'undefined'
          " label="默认值" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-model="options.defaultValue" :placeholder="
              typeof options.format === 'undefined' ? '请输入' : options.format
            " />
				</a-form-item>
				<!-- 省市区级联选择器的类型 -->
				<a-form-item v-if="selectItem.type === 'area'" label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.areaType" class="margin-bottom-xs">
						<a-radio-button value="select"> select </a-radio-button>
						<a-radio-button value="cascader"> cascader </a-radio-button>
					</a-radio-group>
				</a-form-item>
				<!-- 修改html -->
				<a-form-item v-if="selectItem.type === 'html'" label="默认值" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-textarea v-model="options.defaultValue" :autoSize="{ minRows: 4, maxRows: 8 }" />
				</a-form-item>
				<a-form-item v-if="(typeof options.format) !== 'undefined'" label="时间格式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="options.format" placeholder="时间格式如：YYYY-MM-DD HH:mm:ss" />
				</a-form-item>
				<a-form-item v-if="
            typeof options.formatType !== 'undefined' &&
              selectItem.type === 'color'
          " label="颜色类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.formatType">
						<a-radio-button value="rgba">rgba</a-radio-button>
						<a-radio-button value="hex">hex</a-radio-button>
						<a-radio-button value="hsla">hsla</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<template v-if="selectItem.type === 'divider'">
					<!-- <a-form-item label="类型">
            <a-radio-group buttonStyle="solid" v-model="options.type">
              <a-radio-button value="horizontal">水平</a-radio-button>
              <a-radio-button value="vertical">垂直</a-radio-button>
            </a-radio-group>
          </a-form-item> -->
					<a-form-item label="标题位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-radio-group buttonStyle="solid" v-model="options.orientation">
							<a-radio-button value="left">左边</a-radio-button>
							<a-radio-button value="right">右边</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<a-form-item label="是否虚线" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-radio-group buttonStyle="solid" v-model="options.dashed">
							<a-radio-button :value="true">虚线</a-radio-button>
							<a-radio-button :value="false">实线</a-radio-button>
						</a-radio-group>
					</a-form-item>
				</template>

				<a-form-item v-if="selectItem.type === 'card'" label="边框" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.bordered">
						<a-radio-button :value="true">显示边框</a-radio-button>
						<a-radio-button :value="false">隐藏边框</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<!-- 页签位置 start -->
				<a-form-item v-if="selectItem.type === 'tabs'" label="页签位置" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.tabPosition">
						<a-radio value="top">top</a-radio>
						<a-radio value="right">right</a-radio>
						<a-radio value="bottom">bottom</a-radio>
						<a-radio value="left">left</a-radio>
					</a-radio-group>
				</a-form-item>
				<!-- 页签位置 end -->
				<!-- 页签类型 start -->
				<a-form-item v-if="
            typeof options.type !== 'undefined' && selectItem.type === 'tabs'
          " label="页签类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.type">
						<a-radio-button value="line">line</a-radio-button>
						<a-radio-button value="card">card</a-radio-button>
						<a-radio-button value="editable-card">editable-card</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<!-- 页签类型 end -->
				<!-- 页签大小 start -->
				<a-form-item v-if="(typeof options.size) !== 'undefined'" label="大小" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.size">
						<a-radio-button value="large">large</a-radio-button>
						<a-radio-button value="default">default</a-radio-button>
						<a-radio-button value="small">small</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<!-- 页签大小 end -->
				<a-form-item v-if="selectItem.type === 'button'" label="类型" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.type">
						<a-radio value="primary">Primary</a-radio>
						<a-radio value="default">Default</a-radio>
						<a-radio value="dashed">Dashed</a-radio>
						<a-radio value="danger">Danger</a-radio>
					</a-radio-group>
				</a-form-item>
				<!-- 下载方式 start -->
				<a-form-item v-if="(typeof options.downloadWay) !== 'undefined'" label="下载方式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.downloadWay">
						<a-radio-button value="a">a标签</a-radio-button>
						<a-radio-button value="ajax">ajax</a-radio-button>
						<!-- <a-radio-button value="dynamic">动态函数</a-radio-button> -->
					</a-radio-group>
					<a-input v-show="options.downloadWay === 'dynamic'" v-model="options.dynamicFun"
						placeholder="动态函数名"></a-input>
				</a-form-item>
				<!-- 下载方式 end -->

				<!-- 按钮 -->
				<template v-if="selectItem.type === 'button'">
					<a-form-item label="按钮操作" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-radio-group buttonStyle="solid" v-model="options.handle">
							<a-radio-button value="submit">提交</a-radio-button>
							<a-radio-button value="reset">重置</a-radio-button>
							<a-radio-button value="dynamic">动态函数</a-radio-button>
						</a-radio-group>
						<a-input v-show="options.handle === 'dynamic'" v-model="options.dynamicFun" placeholder="动态函数名">
						</a-input>
					</a-form-item>
					<a-form-item label="按钮形状" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-radio-group buttonStyle="solid" v-model="options.shape">
							<a-radio-button value="circle">circle</a-radio-button>
							<a-radio-button value="round">round </a-radio-button>
							<a-radio-button value="">无</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<a-form-item label="按钮图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-model="options.icon" @click="
                () => {
                  fontVisible = true;
                }
              "></a-input>
						<font-picker :visible.sync="fontVisible" @choose="changeIconFont"></font-picker>
					</a-form-item>
				</template>

				<a-form-item v-if="selectItem.type === 'alert'" label="辅助描述" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="options.description"></a-input>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'alert'" label="类型" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.type">
						<a-radio value="success">success</a-radio>
						<a-radio value="info">info</a-radio>
						<a-radio value="warning">warning</a-radio>
						<a-radio value="error">error</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'alert'" label="操作属性" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<kCheckbox v-model="options.showIcon" label="显示图标" />
					<kCheckbox v-model="options.banner" label="无边框" />
					<kCheckbox v-model="options.closable" label="可关闭" />
				</a-form-item>
				<!-- 上传图片 -->
				<a-form-item v-if="selectItem.type === 'uploadImg'" label="样式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.listType">
						<a-radio-button value="text">text</a-radio-button>
						<a-radio-button value="picture">picture</a-radio-button>
						<a-radio-button value="picture-card">card</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'uploadImg'" label="上传方式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-select v-model="options.uploadWay" @change="changeUploadWay">
						<a-select-option value="archive">本地</a-select-option>
						<a-select-option value="fastdfs">分布式</a-select-option>
						<a-select-option value="oss">阿里云</a-select-option>
						<a-select-option value="minio">minio</a-select-option>
						<a-select-option value="custom">自定义</a-select-option>
					</a-select>
				</a-form-item>
				<!-- 上传地址 -->
				<a-form-item v-if="(typeof options.action) !== 'undefined'" label="上传地址" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="options.action" placeholder="请输入"></a-input>
				</a-form-item>
				<!-- 上传数量 -->
				<a-form-item v-if="(typeof options.limit) !== 'undefined'" label="最大上传数量" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number :min="1" v-model="options.limit" />
				</a-form-item>

				<!-- scrollY -->
				<a-form-item v-if="(typeof options.scrollY) !== 'undefined'" label="scrollY" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input-number :min="0" v-model="options.scrollY" />
				</a-form-item>
				<!-- 文件name -->
				<a-form-item v-if="(typeof options.fileName) !== 'undefined'" label="文件name" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="options.fileName" placeholder="请输入"></a-input>
				</a-form-item>
				<!-- 上传额外参数 -->
				<a-form-item v-if="(typeof options.data) !== 'undefined'" label="额外参数(JSON)" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-textarea v-model="options.data" placeholder="严格JSON格式"></a-textarea>
				</a-form-item>
				<!-- 文字对齐方式 -->
				<a-form-item v-if="selectItem.type === 'text'" label="文字对齐方式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="options.textAlign">
						<a-radio-button value="left">左</a-radio-button>
						<a-radio-button value="center">居中</a-radio-button>
						<a-radio-button value="right">右</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'text'" label="字体大小" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<div>
						<a-input-number style="width: 80% !important;" v-model="options.textSize" :min="1" />
						px
					</div>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'text'" label="字体颜色" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<div class="flex">
						<a-input style="width: 80% !important;" v-model="options.textColor" />
						<colorPicker style="margin-left: 5px;" v-model="options.textColor" @change="changeTextColor">
						</colorPicker>
					</div>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'text'" label="字体样式" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<kCheckbox v-model="options.textBold" label="加粗" />
					<kCheckbox v-model="options.textItalic" label="斜体" />
					<kCheckbox v-model="options.textUnderline" label="下划线" />
					<kCheckbox v-model="options.textStrikethrough" label="删除线" />
				</a-form-item>
				<!-- <a-form-item v-if="selectItem.type === 'text'" label="操作属性">
          <kCheckbox v-model="options.showRequiredMark" label="显示必选标记" />
        </a-form-item> -->
				<a-form-item v-if="
            typeof options.hidden !== 'undefined' ||
              typeof options.disabled !== 'undefined' ||
              typeof options.readonly !== 'undefined' ||
              typeof options.clearable !== 'undefined' ||
              typeof options.multiple !== 'undefined' ||
              typeof options.range !== 'undefined' ||
              typeof options.showTime !== 'undefined' ||
              typeof options.allowHalf !== 'undefined' ||
              typeof options.showInput !== 'undefined' ||
              typeof options.animated !== 'undefined' ||
              typeof options.showprecolor !== 'undefined' ||
              typeof options.showhistorycolor !== 'undefined' ||
              typeof options.showPalette !== 'undefined' ||
              typeof options.canMove !== 'undefined'
          ">
					 <!-- label="操作属性" :labelCol="labelCol" :wrapperCol="wrapperCol" -->
					<a-divider orientation="left"><span class="text-bold">操作属性</span></a-divider>
					<kCheckbox v-if="(typeof options.hidden) !== 'undefined'" v-model="options.hidden" label="隐藏" />
					<kCheckbox v-if="(typeof options.disabled) !== 'undefined'" v-model="options.disabled" label="禁用" />
					<kCheckbox v-if="(typeof options.ghost) !== 'undefined'" v-model="options.ghost" label="背景透明" />
					<kCheckbox v-if="(typeof options.block) !== 'undefined'" v-model="options.block" label="block" />
					<kCheckbox v-if="(typeof options.readonly) !== 'undefined'" v-model="options.readonly" label="只读" />
					<kCheckbox v-if="(typeof options.clearable) !== 'undefined'" v-model="options.clearable"
						label="可清除" />
					<kCheckbox v-if="(typeof options.multiple) !== 'undefined'" v-model="options.multiple" label="多选" />
					<kCheckbox v-if="(typeof options.range) !== 'undefined'" v-model="options.range" label="范围选择" />
					<kCheckbox v-if="(typeof options.showTime) !== 'undefined'" v-model="options.showTime" label="时间选择器"
						@input="changeShowTime" />
					<kCheckbox v-if="(typeof options.use12Hours) !== 'undefined'" v-model="options.use12Hours"
						@input="changeHour" label="12小时制" />
					<kCheckbox v-if="(typeof options.allowHalf) !== 'undefined'" v-model="options.allowHalf"
						label="允许半选" />
					<kCheckbox v-if="(typeof options.vertical) !== 'undefined'" v-model="options.vertical" label="垂直" />
					<kCheckbox v-if="(typeof options.showInput) !== 'undefined'" v-model="options.showInput"
						label="显示输入框" />
					<kCheckbox v-if="(typeof options.showLabel) !== 'undefined'" v-model="options.showLabel"
						label="显示Label" />
					<kCheckbox v-if="(typeof options.chinesization) !== 'undefined'" v-model="options.chinesization"
						label="汉化" />
					<kCheckbox v-if="(typeof options.hideSequence) !== 'undefined'" v-model="options.hideSequence"
						label="隐藏序号" />
					<kCheckbox v-if="(typeof options.drag) !== 'undefined'" v-model="options.drag" label="允许拖拽" />
					<kCheckbox v-if="(typeof options.showSearch) !== 'undefined'" v-model="options.showSearch"
						label="可搜索" />
					<kCheckbox v-if="(typeof options.treeCheckable) !== 'undefined'" v-model="options.treeCheckable"
						label="可勾选" />
					<kCheckbox v-if="(typeof options.animated) !== 'undefined'" v-model="options.animated"
						label="动画切换" />
					<kCheckbox v-if="typeof options.showprecolor !== 'undefined'" v-model="options.showprecolor"
						label="显示预制颜色" />
					<kCheckbox v-if="typeof options.showhistorycolor !== 'undefined'" v-model="options.showhistorycolor"
						label="显示历史记录" />
					<kCheckbox v-if="typeof options.showPalette !== 'undefined'" v-model="options.showPalette"
						label="显示色盘" />
					<kCheckbox v-if="typeof options.canMove !== 'undefined'" v-model="options.canMove" label="可拖拽" />
				</a-form-item>
				<!-- 前缀 -->
				<a-form-item v-if="['input'].includes(selectItem.type)" label="前缀" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="options.prefix" placeholder="请输入" />
				</a-form-item>

				<!-- 后缀 -->
				<a-form-item v-if="['input'].includes(selectItem.type)" label="后缀" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="options.suffix" placeholder="请输入" />
				</a-form-item>
				<!-- 校验 -->
				<a-form-item v-if="
            typeof selectItem.rules !== 'undefined' &&
              selectItem.rules.length > 0
          ">
					 <!-- label="校验" :labelCol="labelCol" :wrapperCol="wrapperCol" -->
					<a-divider orientation="left"><span class="text-bold">校验</span></a-divider>
					<kCheckbox v-model="selectItem.rules[0].required" label="必填" />
					<a-input v-model="selectItem.rules[0].message" placeholder="必填校验提示信息" />
					<KChangeOption v-model="selectItem.rules" type="rules" />
				</a-form-item>

				<!-- 表格选项 -->
				<a-form-item v-if="selectItem.type === 'table'" label="表格样式CSS" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-input v-model="selectItem.options.customStyle" />
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'table'" label="属性" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<kCheckbox v-model="selectItem.options.bordered" label="显示边框" />
					<kCheckbox v-model="selectItem.options.bright" label="鼠标经过点亮" />
					<kCheckbox v-model="selectItem.options.small" label="紧凑型" />
					<kCheckbox v-model="selectItem.options.formBorder" label="隐藏组件边框" />
				</a-form-item>

				<a-form-item v-if="selectItem.type === 'table'" label="提示" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<p style="line-height: 26px;">
						请点击右键增加行列，或者合并单元格
					</p>
				</a-form-item>
			</a-form>
		</div>
		<!-- <div class="close-box" @click="$emit('handleHide')">
			<a-icon type="double-right" />
		</div> -->
	</div>
</template>
<script>
	/*
	 * author lmy
	 * date 2019-11-20
	 * description 表单控件属性设置组件,因为配置数据是引用关系，所以可以直接修改
	 */
	import KChangeOption from "../../KChangeOption/index.vue";
	import kCheckbox from "../../KCheckbox/index.vue";
	import KDatePicker from "../../KDatePicker";
	import KTimePicker from "../../KTimePicker";
	import TreeSelect from "../../components/formTreeSelect.vue";
	import Tcascader from "../../components/Tcascader.vue";
	import colorPicker from "@/components/TopVUI/color/colorPicker.vue";
	import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
	import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
	import TSelectUserByDep from "@/components/TopVUI/custom/TSelectUserByDep";
	import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";
	import TSelectDepart from "@/components/TopVUI/custom/TSelectDepart";
	import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
	import fontPicker from "@/components/TopVUI/icon/Icons";
	import Tree from "@/components/TopVUI/custom/tree";
	import {
		format
	} from "date-fns";
	export default {
		name: "formItemProperties",
		data() {
			return {
				options: {},
				fontVisible: false,
				columnNameArr: [],
				TN: '',
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
						span: 17,
					},
				},
			};
		},
		watch: {
			selectItem: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					console.log("------", newVal)
					this.options = newVal.options || {};
					this.TN = this.tableName
				}
			},
			TN: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.columnNameArr = []
					let params = {}
					params = {
						tableName: newVal
					}
					this.getColumnName(params)
				}
			},
		},
		computed: {
			tableName() {
				let tableName = ''
				if (this.batchName) {
					tableName = this.batchName
				} else {
					tableName = this.basicData.leftDataSourse
				}
				return tableName;
			},
		},
		props: {
			selectItem: {
				type: Object,
				required: true,
			},
			hideModel: {
				type: Boolean,
				default: false,
			},
			tName: {
				type: String,
			},
			basicsUuid: {
				type: String,
				required: true
			},
			basicData: {
				type: Object,
				required: true
			},
			formData: {
				type: Array,
				required: true
			},
			batchName: {
				type: String,
			},
		},
		components: {
			KChangeOption,
			kCheckbox,
			KDatePicker,
			KTimePicker,
			TreeSelect,
			Tcascader,
			colorPicker,
			TDictSelectTag,
			TMultiSelectTag,
			TSelectDepart,
			fontPicker,
			Tree,
			TSelectUserByDep,
			TAreaLinkage,
			iconFontPicker,
		},
		methods: {
			onSearch(value) {
				let pramer = {
					tableName: this.tName,
					newFieldName: value,
					oldFieldName: this.selectItem.oldModel,
					tagName: this.selectItem.type
				};
				this.$post("/form/formField/updateFieldName", pramer).then((res) => {
					if (res.statusCode === 200) {
						this.$message.success("保存成功！");
						this.$emit("modelChange", this.selectItem);
						this.selectItem.oldModel = value;
					} else {
						this.$message.error(res.message);
					}
				});
			},
			titleChange() {
				this.$emit("titleChange", this.selectItem);
			},
			changeTextColor(val) {
				this.selectItem.options.textColor = val;
			},
			changeDatePicker(val) {
				if (!this.options.range) {
					this.selectItem.options.defaultValue = val
				} else {
					this.selectItem.options.rangeDefaultValue = val
				}
			},
			handleChangeTree(value, node) {
				this.selectItem.options.defaultValue = value
			},
			handleChangeCommon(val, key) {
				this.selectItem.options[key] = val;
			},
			changeShowTime(val) {
				if (val) {
					this.selectItem.options.format = "YYYY-MM-DD HH:mm:ss";
				} else {
					this.selectItem.options.format = "YYYY-MM-DD";
				}
			},
			changeHour(val) {
				if (val) {
					this.selectItem.options.format = `h:mm:ss a`;
				} else {
					this.selectItem.options.format = `HH:mm:ss`;
				}
			},
			changeIconFont(val) {
				this.fontVisible = false;
				this.selectItem.options.icon = val;
			},
			changeDefaultValueColor(val) {
				this.selectItem.options.defaultValue = val;
			},
			changeUploadWay(val) {
				if (val === "archive") {
					this.selectItem.options.action = "/system/attachment/upload";
				} else if (val === "fastdfs") {
					this.selectItem.options.action = "/document/fdfs/upload";
				} else if (val === "oss") {
					this.selectItem.options.action = "/document/oss/multiUpload";
				} else if (val === "minio") {
					this.selectItem.options.action = "/document/minio/uploadfile";
				} else if (val === "custom") {
					this.selectItem.options.action = "/system/attachment/upload";
				}
			},
			// 根据表名获取表字段
			getColumnName(params) {
				console.log("params", params)
				this.$post('/system/generator/getColumns', params).then((res) => {
					this.columnNameArr = res
				});
			},
			// 字段选择判断
			fieldChange(e) {
				console.log(e, this.formData)
				let key = this.formData.filter(val => val.model == e)
				console.log("key", key.length, key)
				if (key.length > 1) {
					this.$message.info('字段名已被选择', 1.5)
					this.selectItem.model = null
				} else {
					this.$emit("modelChange", this.selectItem);
					this.selectItem.oldModel = e
				}
			},
		},
	};
</script>
<style scoped="scoped">
	.right .ant-form-item-control {
		line-height: 32px !important;
	}

	/deep/.ew-color-picker {
		left: -100px;
	}

	/* 	/deep/.ant-form label{
		font-size: 13px !important;
	}
	/deep/.ant-input{
		font-size: 13px !important;
	}
	/deep/.ant-btn,.ant-select{
		font-size: 13px !important;
	} */
</style>
