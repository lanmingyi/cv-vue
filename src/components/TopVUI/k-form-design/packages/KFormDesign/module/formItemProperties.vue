<!--
 * @Description: 表单组件右侧属性配置
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 11:19:51
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="properties-centent kk-checkbox">
    <!-- <div class="head-title">
      控件属性设置
    </div> -->
    <div class="properties-body">
      <p class="hint-box" v-show="!selectItem.key">未选择控件</p>
      <a-form v-show="selectItem.key" labelAlign="left">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof selectItem.label !== 'undefined'"
          label="标签"
        >
          <a-input
            v-model="selectItem.label"
            placeholder="请输入"
            @change="titleChange()"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            !hideModel &&
              typeof selectItem.model !== 'undefined' &&
              !~['table', 'grid', 'tabs', 'card', 'batch', 'text', 'alert', 'html'].indexOf(
                selectItem.type
              )
          "
          label="数据字段"
        >
         <!-- <a-input
            v-model="selectItem.model"
            placeholder="请输入字段名"
            @blur='(event) => {onSearch(event.target.value);}'
          >
						<a-button slot="enterButton">保存</a-button>
          </a-input> -->
					
					<a-input-search
						v-model="modelInput"
						placeholder="请输入字段名"
						@search="updateFields"
					>
						<a-button slot="enterButton">保存</a-button>
					</a-input-search>
          <a-input
            v-model="selectItem.oldModel"
            placeholder="请输入字段名"
            type="hidden"
          />
        </a-form-item>
        <!-- input type start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'input'"
          label="输入框type"
        >
          <!-- <a-input v-model="options.type" placeholder="请输入" /> -->
          <a-select v-model="options.type">
            <a-select-option value="text">普通文本框</a-select-option>
            <a-select-option value="password">密码框</a-select-option>
          </a-select>
        </a-form-item>
        <!-- input type end -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            typeof options.rangePlaceholder !== 'undefined' && options.range
          "
          label="占位内容"
        >
          <a-input placeholder="请输入" v-model="options.rangePlaceholder[0]" />
          <a-input placeholder="请输入" v-model="options.rangePlaceholder[1]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-else-if="typeof options.placeholder !== 'undefined'"
          label="占位内容"
        >
          <a-input placeholder="请输入" v-model="options.placeholder" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'textarea'"
          label="内容高度"
        >
          <a-input-number
            style="width:100%"
            v-model="options.minRows"
            :min="0"
            placeholder="最小高度"
          />
          <a-input-number
            :min="0"
            style="width:100%"
            v-model="options.maxRows"
            placeholder="最大高度"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.width !== 'undefined'"
          label="宽度"
        >
          <a-input
            placeholder="百分比或像素,如：100%/100px"
            v-model="options.width"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.height !== 'undefined'"
          label="高度"
        >
          <a-input-number :min="0" v-model="options.height" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.step !== 'undefined'"
          label="步长"
        >
          <a-input-number
            :min="1"
            v-model="options.step"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.min !== 'undefined'"
          label="最小值"
        >
          <a-input-number
            :min="0"
            :max="100"
            v-model="options.min"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.max !== 'undefined'"
          label="最大值"
        >
          <a-input-number
            :min="0"
            :max="100"
            v-model="options.max"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.tabBarGutter !== 'undefined'"
          label="标签间距"
        >
          <a-input-number
            :min="0"
            v-model="options.tabBarGutter"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.precision !== 'undefined'"
          label="数值精度"
        >
          <a-input-number
            :min="0"
            :max="50"
            v-model="options.precision"
            placeholder="请输入"
          />
        </a-form-item>
        <!-- 选项配置及动态数据配置 start -->

        <template v-if="selectItem.type == 'treeSelect' || selectItem.type == 'cascader'">
					<a-divider>选项配置</a-divider>
					<a-radio-group
						buttonStyle="solid"
						v-model="options.dataType"
						class="margin-bottom-xs"
						v-if="selectItem.type == 'treeSelect'"
					>
						<a-radio-button value="code"> 树形字典 </a-radio-button>
						<a-radio-button value="dynamic"> 动态数据 </a-radio-button>
					</a-radio-group>
					<a-input-group v-show="options.dataType === 'code'">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典项">
							<a-tree-select
								v-model="options.codeValue"
								tree-data-simple-mode
								style="width: 100%"
								:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
								placeholder="Please select"
								:tree-data="codeTreeData"
								:load-data="codeLoadData"
								:replaceFields="replaceFields"
								@change="codeTreeChange"
							/>
						</a-form-item>
					</a-input-group>
					<a-input-group compact v-show="options.dataType === 'dynamic'">
						<a-form-item
						  :labelCol="labelCol"
						  :wrapperCol="wrapperCol"
						  label="请求方式"
							style="width: 100%;"
						>
						  <a-select v-model="options.method" style="width: 100%;">
						    <a-select-option value="get">get</a-select-option>
						    <a-select-option value="post">post</a-select-option>
						  </a-select>
						</a-form-item>
						
						<a-form-item
						  :labelCol="labelCol"
						  :wrapperCol="wrapperCol"
						  label="数据接口"
						>
						  <a-input
						    v-model="options.url"
						    :title="options.url"
						    placeholder="请输入接口地址"
						    allow-clear
						  />
						  <a-textarea
						    :row="4"
						    v-model="options.parameter"
						    placeholder="接口参数"
						  ></a-textarea>
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="子级接口配置">
						  <a-input
						    v-model="options.expandUrl"
						    :title="options.expandUrl"
						    placeholder="请输入接口地址"
						    allow-clear
						  />
							<a-input
								v-model="options.childParams.key"
								:title="options.childParams.key"
								placeholder="参数名"
								style="width: 50%;"
							/>
							<a-select allow-clear placeholder="父级节点参数" v-model="options.childParams.parentNode" style="width: 50%;">
								<a-select-option v-for="item in options.parentKey" :key="item">
									{{ item }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-input-group>
        </template>
        <template
          v-if="~['select', 'radio', 'checkbox'].indexOf(selectItem.type)"
        >
          <a-divider>选项配置</a-divider>
          <a-form-item v-if="typeof options.options !== 'undefined'" label="">
            <a-radio-group
              buttonStyle="solid"
              v-model="options.dataType"
              class="margin-bottom-xs"
							@change="radioChange"
            >
              <a-radio-button value="dynamic"> 动态 </a-radio-button>
              <a-radio-button value="static"> 静态 </a-radio-button>
              <a-radio-button value="code">字典 </a-radio-button>
            </a-radio-group>
            <a-input-group
              compact
              v-show="
                options.dataType === 'dynamic' &&
                  selectItem.type != 'treeSelect'
              "
            >
              <a-select v-model="options.method">
                <a-select-option value="get">get</a-select-option>
                <a-select-option value="post">post</a-select-option>
              </a-select>
              <a-input
                style="width: 72%;"
                v-model="options.url"
                :title="options.url"
                placeholder="请输入接口地址"
                allow-clear
              />
            </a-input-group>
            <!-- <Tree :treeData="options.options" v-model="options.options"></Tree> -->
            <KChangeOption
              v-show="options.dataType === 'static'"
              v-model="options.options"
              :type="
                ~['cascader', 'treeSelect'].indexOf(selectItem.type)
                  ? 'tab'
                  : 'option'
              "
            />
            <a-input
              v-show="options.dataType === 'code'"
              v-model="options.dictCode"
              placeholder="接口参数"
            >
            </a-input>
            <a-textarea
              v-show="options.dataType === 'dynamic'"
              v-model="options.dynamicKey"
              placeholder="接口参数"
            ></a-textarea>
          </a-form-item>
          <!-- <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="
              typeof options.options !== 'undefined' &&
                !~['cascader', 'treeSelect'].indexOf(selectItem.type)
            "
            label="数据字段"
          >
            <a-input
              v-model="options.textFeild"
              placeholder="文本字段"
            ></a-input>
            <a-input
              v-model="options.valueFeild"
              placeholder="数据字段"
            ></a-input>
          </a-form-item> -->
        </template>
        <!-- 选项配置及动态数据配置 end -->
        <!-- tabs配置 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'tabs'"
          label="页签配置"
        >
          <KChangeOption v-model="selectItem.columns" type="tab" />
        </a-form-item>
        <!-- tabs配置 end -->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'grid'"
          label="表格样式"
        >
          <kCheckbox
            v-model="selectItem.options.tableStyle"
            label="启用表格样式"
          />
          <kCheckbox
            v-model="selectItem.options.formBorder"
            label="隐藏组件边框样式"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'grid'"
          label="栅格间距"
        >
          <a-input-number
            :min="0"
            v-model="selectItem.options.gutter"
            placeholder="请输入"
          />
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="selectItem.type === 'grid'" label="栅格高度">
          <div class="flex">
            <a-input-number
              :min="0"
              style="width: 80%;"
              v-model="selectItem.options.gridHeight"
              placeholder="请输入"
            />
            px
          </div>
        </a-form-item> -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'grid'"
          label="布局模式"
        >
          <a-radio-group
            buttonStyle="solid"
            v-model="options.type"
            class="margin-bottom-xs"
          >
            <a-radio-button value="default"> 默认 </a-radio-button>
            <a-radio-button value="flex"> 弹性布局 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'grid' && options.type === 'flex'"
          label="水平排列"
        >
          <a-select v-model="options.justify">
            <a-select-option value="start">start</a-select-option>
            <a-select-option value="end">end</a-select-option>
            <a-select-option value="center">center</a-select-option>
            <a-select-option value="space-around">space-around</a-select-option>
            <a-select-option value="space-between"
              >space-between</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'grid' && options.type === 'flex'"
          label="垂直排列"
        >
          <a-select v-model="options.align">
            <a-select-option value="top">top</a-select-option>
            <a-select-option value="middle">middle</a-select-option>
            <a-select-option value="bottom">bottom</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'grid'"
          label="列配置项"
        >
          <KChangeOption v-model="selectItem.columns" type="colspan" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'switch'"
          label="默认值"
        >
          <a-switch v-model="options.defaultValue" />
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            selectItem.type === 'uploadFile' || selectItem.type === 'uploadImg'
          "
          label="默认值"
        >
          <a-input v-model="options.defaultValue" />
        </a-form-item> -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'color'"
          label="默认值"
        >
          <div class="flex">
            <a-input
              style="width: 80% !important;"
              v-model="options.defaultValue"
            />
            <colorPicker
              style="margin-left: 5px;"
              v-model="options.defaultValue"
              :formatType="options.formatType"
              @change="changeDefaultValueColor"
            ></colorPicker>
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'userPop'"
          label="默认值"
        >
          <TSelectUserByDep
            v-model="options.defaultValue"
            :multiple="options.multiple"
          ></TSelectUserByDep>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'area'"
          label="默认值"
        >
          <TAreaLinkage v-model="options.defaultValue" :type="options.areaType">
          </TAreaLinkage>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'icon'"
          label="默认值"
        >
          <iconFontPicker v-model="options.defaultValue"> </iconFontPicker>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'depart'"
          label="默认值"
        >
          <TSelectDepart :multi="true" v-model="options.defaultValue">
          </TSelectDepart>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="['number', 'slider'].indexOf(selectItem.type) >= 0"
          label="默认值"
        >
          <a-input-number
            :step="options.step"
            :min="options.min || -Infinity"
            :max="options.max || Infinity"
            v-model="options.defaultValue"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'rate'"
          label="默认值"
        >
          <a-rate
            v-model="options.defaultValue"
            :allowHalf="options.allowHalf"
            :count="options.max"
          />
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'select'"
          label="默认值"
        >
          <TDictSelectTag
            v-if="!options.multiple"
            :dataType="options.dataType"
            :url="options.url"
            :dataList="options.options"
            :method="options.method"
            :params="options.dynamicKey"
            :dictCode="options.dictCode"
            :valueFeild="options.valueFeild"
            :textFeild="options.textFeild"
            type="select"
            v-model="options.defaultValue"
          ></TDictSelectTag>
          <TMultiSelectTag
            v-else
            :dataType="options.dataType"
            :url="options.url"
            :dataList="options.options"
            :method="options.method"
            :params="options.dynamicKey"
            :dictCode="options.dictCode"
            :valueFeild="options.valueFeild"
            :textFeild="options.textFeild"
            type="select"
            v-model="options.defaultValue"
          ></TMultiSelectTag>
        </a-form-item> -->
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'radio'"
          label="默认值"
        >
          <TDictSelectTag
            :dataType="options.dataType"
            :url="options.url"
            :dataList="options.options"
            :method="options.method"
            :params="options.dynamicKey"
            :dictCode="options.dictCode"
            :valueFeild="options.valueFeild"
            :textFeild="options.textFeild"
            type="radio"
            v-model="options.defaultValue"
          ></TDictSelectTag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'checkbox'"
          label="默认值"
        >
          <TMultiSelectTag
            :dataType="options.dataType"
            :url="options.url"
            :dataList="options.options"
            :method="options.method"
            :params="options.dynamicKey"
            :dictCode="options.dictCode"
            type="checkbox"
            v-model="options.defaultValue"
          ></TMultiSelectTag>
        </a-form-item> -->
        <!-- 日期选择器默认值 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'date'"
          label="默认值"
        >
          <a-input
            v-if="!options.range"
            v-model="options.defaultValue"
            :placeholder="
              typeof options.format === 'undefined' ? '' : options.format
            "
          />
          <a-input
            v-if="options.range"
            v-model="options.rangeDefaultValue[0]"
            :placeholder="
              typeof options.format === 'undefined' ? '' : options.format
            "
          />
          <a-input
            v-if="options.range"
            v-model="options.rangeDefaultValue[1]"
            :placeholder="
              typeof options.format === 'undefined' ? '' : options.format
            "
          />
        </a-form-item>
        <!-- 日期选择器默认值 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            ![
              'number',
              'radio',
              'checkbox',
              'date',
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
							'text',
							'treeSelect',
							'cascader',
							'alert'
            ].includes(selectItem.type) &&
              typeof options.defaultValue !== 'undefined'
          "
          label="默认值"
        >
          <a-input
            v-model="options.defaultValue"
            :placeholder="
              typeof options.format === 'undefined' ? '请输入' : options.format
            "
          />
        </a-form-item>
        <!-- 省市区级联选择器的类型 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'area'"
          label="类型"
        >
          <a-radio-group
            buttonStyle="solid"
            v-model="options.areaType"
            class="margin-bottom-xs"
          >
            <a-radio-button value="select"> 下拉框 </a-radio-button>
            <a-radio-button value="cascader"> 级联 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 修改html -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'html'"
          label="默认值"
        >
          <a-textarea
            v-model="options.defaultValue"
            :autoSize="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
        <!-- 前缀 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="['input'].includes(selectItem.type)"
          label="前缀"
        >
          <a-input v-model="options.prefix" placeholder="请输入" />
        </a-form-item>

        <!-- 后缀 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="['input'].includes(selectItem.type)"
          label="后缀"
        >
          <a-input v-model="options.suffix" placeholder="请输入" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.format !== 'undefined'"
          label="时间格式"
        >
          <a-input
            v-model="options.format"
            placeholder="时间格式如：YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            typeof options.formatType !== 'undefined' &&
              selectItem.type === 'color'
          "
          label="颜色类型"
        >
          <a-radio-group buttonStyle="solid" v-model="options.formatType">
            <a-radio-button value="rgba">rgba</a-radio-button>
            <a-radio-button value="hex">hex</a-radio-button>
            <a-radio-button value="hsla">hsla</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <template v-if="selectItem.type === 'divider'">
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
            <a-radio-group buttonStyle="solid" v-model="options.type">
              <a-radio-button value="horizontal">水平</a-radio-button>
              <a-radio-button value="vertical">垂直</a-radio-button>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="标题位置"
          >
            <a-radio-group buttonStyle="solid" v-model="options.orientation">
              <a-radio-button value="left">左边</a-radio-button>
              <a-radio-button value="right">右边</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否虚线"
          >
            <a-radio-group buttonStyle="solid" v-model="options.dashed">
              <a-radio-button :value="true">虚线</a-radio-button>
              <a-radio-button :value="false">实线</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </template>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'card'"
          label="边框"
        >
          <a-radio-group buttonStyle="solid" v-model="options.bordered">
            <a-radio-button :value="true">显示边框</a-radio-button>
            <a-radio-button :value="false">隐藏边框</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 页签位置 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'tabs'"
          label="页签位置"
        >
          <a-radio-group buttonStyle="solid" v-model="options.tabPosition">
            <a-radio value="top">上</a-radio>
            <a-radio value="right">右</a-radio>
            <a-radio value="bottom">下</a-radio>
            <a-radio value="left">左</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 页签位置 end -->
        <!-- 页签类型 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            typeof options.type !== 'undefined' && selectItem.type === 'tabs'
          "
          label="页签类型"
        >
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio-button value="line">line</a-radio-button>
            <a-radio-button value="card">card</a-radio-button>
            <a-radio-button value="editable-card">editable-card</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 页签类型 end -->
        <!-- 页签大小 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.size !== 'undefined'"
          label="大小"
        >
          <a-radio-group buttonStyle="solid" v-model="options.size">
            <a-radio-button value="large">大</a-radio-button>
            <a-radio-button value="default">中</a-radio-button>
            <a-radio-button value="small">小</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 页签大小 end -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'button'"
          label="类型"
        >
          <a-select v-model="options.type">
            <a-select-option value="primary">主按钮</a-select-option>
            <a-select-option value="default">次按钮</a-select-option>
            <a-select-option value="dashed">虚线按钮</a-select-option>
            <a-select-option value="danger">危险按钮</a-select-option>
            <a-select-option value="link">链接按钮</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 下载方式 start -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.downloadWay !== 'undefined'"
          label="下载方式"
        >
          <a-radio-group buttonStyle="solid" v-model="options.downloadWay">
            <a-radio-button value="a">a标签</a-radio-button>
            <a-radio-button value="ajax">ajax</a-radio-button>
            <!-- <a-radio-button value="dynamic">动态函数</a-radio-button> -->
          </a-radio-group>
          <a-input
            v-show="options.downloadWay === 'dynamic'"
            v-model="options.dynamicFun"
            placeholder="动态函数名"
          ></a-input>
        </a-form-item>
        <!-- 下载方式 end -->

        <!-- 按钮 -->
        <template v-if="selectItem.type === 'button'">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="按钮操作"
          >
            <a-radio-group buttonStyle="solid" v-model="options.handle">
              <a-radio-button value="submit">提交</a-radio-button>
              <a-radio-button value="reset">重置</a-radio-button>
              <!-- <a-radio-button value="dynamic">动态函数</a-radio-button> -->
            </a-radio-group>
            <a-input
              v-show="options.handle === 'dynamic'"
              v-model="options.dynamicFun"
              placeholder="动态函数名"
            >
            </a-input>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="按钮形状"
          >
            <a-radio-group buttonStyle="solid" v-model="options.shape">
              <a-radio-button value="circle">圆形</a-radio-button>
              <a-radio-button value="round">弧形 </a-radio-button>
              <a-radio-button value="">无</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="按钮图标">
            <a-input
              v-model="options.icon"
              @click="
                () => {
                  fontVisible = true;
                }
              "
            ></a-input>
            <font-picker
              :visible.sync="fontVisible"
              @choose="changeIconFont"
            ></font-picker>
          </a-form-item> -->
        </template>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'alert'"
          label="辅助描述"
        >
          <a-input v-model="options.description"></a-input>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'alert'"
          label="类型"
        >
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio value="success">成功</a-radio>
            <a-radio value="info">提示</a-radio>
            <a-radio value="warning">警告</a-radio>
            <a-radio value="error">错误</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-divider v-if="selectItem.type === 'alert'">操作属性</a-divider>
        <a-form-item v-if="selectItem.type === 'alert'" label="">
          <kCheckbox v-model="options.showIcon" label="显示图标" />
          <kCheckbox v-model="options.banner" label="无边框" />
          <kCheckbox v-model="options.closable" label="可关闭" />
        </a-form-item>
        <!-- 上传图片 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'uploadImg'"
          label="样式"
        >
          <a-radio-group buttonStyle="solid" v-model="options.listType">
            <a-radio-button value="text">文本</a-radio-button>
            <a-radio-button value="picture">图片</a-radio-button>
            <a-radio-button value="picture-card">卡片</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'uploadImg'"
          label="上传方式"
        >
          <a-select v-model="options.uploadWay" @change="changeUploadWay">
            <a-select-option value="archive">本地</a-select-option>
            <a-select-option value="fastdfs">分布式</a-select-option>
            <a-select-option value="oss">阿里云</a-select-option>
            <a-select-option value="minio">minio</a-select-option>
            <a-select-option value="custom">自定义</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 上传地址 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.action !== 'undefined'"
          label="上传地址"
        >
          <a-input v-model="options.action" placeholder="请输入"></a-input>
        </a-form-item>
        <!-- 上传数量 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.limit !== 'undefined'"
          label="最大上传数量"
        >
          <a-input-number :min="1" v-model="options.limit" />
        </a-form-item>

        <!-- scrollY -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.scrollY !== 'undefined'"
          label="竖向滚动条"
        >
          <a-input-number :min="0" v-model="options.scrollY" />
        </a-form-item>
        <!-- 文件name -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.fileName !== 'undefined'"
          label="文件name"
        >
          <a-input v-model="options.fileName" placeholder="请输入"></a-input>
        </a-form-item>
        <!-- 上传额外参数 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="typeof options.data !== 'undefined'"
          label="额外参数"
        >
          <a-textarea
            v-model="options.data"
            placeholder="严格JSON格式"
          ></a-textarea>
        </a-form-item>
        <!-- 文字对齐方式 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'text'"
          label="文字对齐方式"
        >
          <a-radio-group buttonStyle="solid" v-model="options.textAlign">
            <a-radio-button value="left">左</a-radio-button>
            <a-radio-button value="center">居中</a-radio-button>
            <a-radio-button value="right">右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'text'"
          label="字体大小"
        >
          <div>
            <a-input-number
              style="width: 80% !important;"
              v-model="options.textSize"
              :min="1"
							:max="50"
            />
            px
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'text'"
          label="字体颜色"
        >
          <div class="flex">
            <a-input
              style="width: 80% !important;"
              v-model="options.textColor"
            />
            <colorPicker
              style="margin-left: 5px;"
              v-model="options.textColor"
              @change="changeTextColor"
            >
            </colorPicker>
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'text'"
          label="字体样式"
        >
          <kCheckbox v-model="options.textBold" label="加粗" />
          <kCheckbox v-model="options.textItalic" label="斜体" />
          <kCheckbox v-model="options.textUnderline" label="下划线" />
          <kCheckbox v-model="options.textStrikethrough" label="删除线" />
        </a-form-item>
        <template
          v-if="
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
              typeof options.canMove !== 'undefined' ||
              typeof options.showRequiredMark !== 'undefined'
          "
        >
          <a-divider orientation="left"
            ><span class="text-bold">操作属性</span></a-divider
          >
          <a-form-item label="">
            <kCheckbox
              v-if="typeof options.hidden !== 'undefined'"
              v-model="options.hidden"
              label="隐藏"
            />
            <kCheckbox
              v-if="typeof options.disabled !== 'undefined'"
              v-model="options.disabled"
              label="禁用"
            />
            <kCheckbox
              v-if="typeof options.ghost !== 'undefined'"
              v-model="options.ghost"
              label="背景透明"
            />
            <kCheckbox
              v-if="typeof options.showRequiredMark !== 'undefined'"
              v-model="options.showRequiredMark"
              label="显示必选标记"
            />
            <kCheckbox
              v-if="typeof options.block !== 'undefined'"
              v-model="options.block"
              label="block"
            />
            <kCheckbox
              v-if="typeof options.readonly !== 'undefined'"
              v-model="options.readonly"
              label="只读"
            />
            <kCheckbox
              v-if="typeof options.clearable !== 'undefined'"
              v-model="options.clearable"
              label="可清除"
            />
            <kCheckbox
              v-if="typeof options.multiple !== 'undefined'"
              v-model="options.multiple"
              label="多选"
            />
            <kCheckbox
              v-if="typeof options.range !== 'undefined'"
              v-model="options.range"
              label="范围选择"
            />
            <kCheckbox
              v-if="typeof options.showTime !== 'undefined'"
              v-model="options.showTime"
              label="时间选择器"
              @input="changeShowTime"
            />
            <kCheckbox
              v-if="typeof options.use12Hours !== 'undefined'"
              v-model="options.use12Hours"
              @input="changeHour"
              label="12小时制"
            />
            <kCheckbox
              v-if="typeof options.allowHalf !== 'undefined'"
              v-model="options.allowHalf"
              label="允许半选"
            />
            <kCheckbox
              v-if="typeof options.showInput !== 'undefined'"
              v-model="options.showInput"
              label="显示输入框"
            />
            <kCheckbox
              v-if="typeof options.showLabel !== 'undefined'"
              v-model="options.showLabel"
              label="显示Label"
            />
            <!-- <kCheckbox
            v-if="typeof options.chinesization !== 'undefined'"
            v-model="options.chinesization"
            label="汉化"
          /> -->
            <kCheckbox
              v-if="typeof options.hideSequence !== 'undefined'"
              v-model="options.hideSequence"
              label="隐藏序号"
            />
            <kCheckbox
              v-if="typeof options.drag !== 'undefined'"
              v-model="options.drag"
              label="允许拖拽"
            />
            <kCheckbox
              v-if="typeof options.showSearch !== 'undefined'"
              v-model="options.showSearch"
              label="可搜索"
            />
            <kCheckbox
              v-if="typeof options.treeCheckable !== 'undefined'"
              v-model="options.treeCheckable"
              label="可勾选"
            />
            <kCheckbox
              v-if="typeof options.animated !== 'undefined'"
              v-model="options.animated"
              label="动画切换"
            />
            <kCheckbox
              v-if="typeof options.showprecolor !== 'undefined'"
              v-model="options.showprecolor"
              label="显示预制颜色"
            />
            <kCheckbox
              v-if="typeof options.showhistorycolor !== 'undefined'"
              v-model="options.showhistorycolor"
              label="显示历史记录"
            />
            <kCheckbox
              v-if="typeof options.showPalette !== 'undefined'"
              v-model="options.showPalette"
              label="显示色盘"
            />
            <kCheckbox
              v-if="typeof options.canMove !== 'undefined'"
              v-model="options.canMove"
              label="可拖拽"
            />
          </a-form-item>
        </template>

        <a-divider
          v-if="
            typeof selectItem.rules !== 'undefined' &&
              selectItem.rules.length > 0
          "
          orientation="left"
          ><span class="text-bold">校验</span></a-divider
        >
        <a-form-item
          v-if="
            typeof selectItem.rules !== 'undefined' &&
              selectItem.rules.length > 0
          "
          label=""
        >
          <kCheckbox v-model="selectItem.rules[0].required" label="必填" />
          <a-input
            v-model="selectItem.rules[0].message"
            placeholder="必填校验提示信息"
          />
          <KChangeOption v-model="selectItem.rules" type="rules" />
        </a-form-item>

        <!-- 表格选项 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'table'"
          label="表格样式CSS"
        >
          <a-input v-model="selectItem.options.customStyle" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'table'"
          label="属性"
        >
          <kCheckbox v-model="selectItem.options.bordered" label="显示边框" />
          <kCheckbox v-model="selectItem.options.bright" label="鼠标经过点亮" />
          <kCheckbox v-model="selectItem.options.small" label="紧凑型" />
          <kCheckbox
            v-model="selectItem.options.formBorder"
            label="隐藏组件边框"
          />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="selectItem.type === 'table'"
          label="提示"
        >
          <p>
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
import colorPicker from "@/components/TopVUI/color/colorPicker.vue";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
import TSelectUserByDep from "@/components/TopVUI/custom/TSelectUserByDep";
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";
import TSelectDepart from "@/components/TopVUI/custom/TSelectDepart";
import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
import fontPicker from "@/components/TopVUI/icon/Icons";
import Tree from "@/components/TopVUI/custom/tree";
import { format } from "date-fns";
export default {
  name: "formItemProperties",
  data() {
    return {
      options: {},
      fontVisible: false,
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
			codeTreeData: [],
			replaceFields: {
				children: "children",
				title: "text",
				key: "id",
				value: "id",
			},
			modelInput: ''
    };
  },
  watch: {
    selectItem(val) {
			if(~['select', 'checkbox', 'radio'].indexOf(val.type)){
				let arr = val.model.split('_')
				val.model = val.options.dataType == "code"?val.model:val.type+val.options.dataType+"_" + arr.splice(1).join('_')
			}
			this.modelInput = val.model
      this.options = val.options || {};
    },
		// 监听禁用和必填选项
		"options.disabled"(val){
			if(val){
				this.selectItem.rules[0].required = false
			}
		},
		"selectItem.rules": {
			deep: true,
			handler(newValue, oldValue) {
				if(newValue && newValue[0].required){
					this.options.disabled = false
				}
			}
		},
		"options.defaultValue":{
			deep: true,
			handler(newValue, oldValue) {
				if(~['html', 'editor'].indexOf(this.selectItem.type)){
					this.checkText(newValue)
				}
			}
		}
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
  },
  components: {
    KChangeOption,
    kCheckbox,
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
	mounted(){
		this.loadCodeTreeData()
	},
  methods: {
		checkText(text){//xss攻击特殊字符过滤
			var arr = ["alert","eval","onblur","onload","onfocus","onerror","onclick","onMouseOver",
					 "onMouseOut","onSelect","onChange","onSubmit","console","href",
					 "<iframe>","</iframe>","<img>","</img>","<iframe>","</iframe>","<video>","</video>",
					 "<canvas>","</canvas>","<label>","</label>","<span>","</span>","document","location","javascript"];
			for(let i=0;i<arr.length;i++){
				if(text.indexOf(arr[i])!=-1){
					this.$message.error("检测到非法字符！“"+arr[i]+"”");
					this.options.defaultValue = ""
					window.alert = function() {
					    return false;
					}
					break;
				}
			}
		},
    //修改数据字段
    updateFields(value,type) {
			let str = this.selectItem.oldModel.split("_")[0]
			let reg = new RegExp("^" + str + "_.*")
			if(!(reg.test(value)) && type != "radioChange"){
				this.modelInput = this.selectItem.oldModel
				return this.$message.error("字段名必须以“"+str+"_”开头！");
			}
      let pramer = {
        tableName: this.tName,
        newFieldName: value,
        oldFieldName: this.selectItem.oldModel,
        tagName: this.selectItem.type,
      };
      if (this.selectItem.oldModel != this.modelInput) {
				this.$store.state.loadding = true
        this.$post("/form/formField/updateFieldName", pramer).then((res) => {
          if (res.statusCode === 200) {
            this.$message.success(res.message);
            this.$emit("modelChange", this.selectItem);
            this.selectItem.model = value;
            this.selectItem.oldModel = value;
						this.$store.state.loadding = false
						this.$emit('saveForm')
          } else {
            this.$message.error(res.message);
            // this.selectItem.model = this.selectItem.oldModel;
						this.$store.state.loadding = false
          }
        });
      }
    },
		radioChange(e){
			let type = this.selectItem.type
			let arr = this.modelInput.split('_')
			if(e.target.value === "dynamic" && this.modelInput.split('_')[0] != type+"dynamic"){
				this.modelInput = type+"dynamic_" + arr.splice(1).join('_')
			}else if (e.target.value === "static" && this.modelInput.split('_')[0] != type+"static"){
				this.modelInput = type+"static_" + arr.splice(1).join('_')
				console.log(this.modelInput)
			}else if(e.target.value === "code" && this.modelInput.split('_')[0] != type){
				this.modelInput = type+"_" + arr.splice(1).join('_')
			}else{
				this.modelInput = e.target.value === "code"?(type+"_") + arr.join('_'):type+e.target.value+"_"+arr.join('_')
			}
			this.updateFields(this.modelInput,"radioChange")
		},
    titleChange() {
      this.$emit("titleChange", this.selectItem);
    },
    changeTextColor(val) {
      this.selectItem.options.textColor = val;
    },
    changeHour(val) {
      if (val) {
        this.selectItem.options.format = `h:mm:ss a`;
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
        this.selectItem.options.data = `{}`;
      } else if (val === "fastdfs") {
        // this.selectItem.options.action = "/document/fdfs/upload";
        // this.selectItem.options.data = `{}`;
				this.selectItem.options.action = "/document/minio/uploadfile";
				this.selectItem.options.data = `{bucket:zysd-test02}`;
      } else if (val === "oss") {
        this.selectItem.options.action = "/document/oss/multiUpload";
        this.selectItem.options.data = `{bucketName:zysd-test2,endpoint:oss-cn-beijing.aliyuncs.com}`;
      } else if (val === "minio") {
        this.selectItem.options.action = "/document/minio/uploadfile";
        this.selectItem.options.data = `{bucket:zysd-test02}`;
      } else if (val === "custom") {
        this.selectItem.options.action = "/system/attachment/upload";
        this.selectItem.options.data = `{}`;
      }
    },
    changeShowTime(val) {
      if (val) {
        this.selectItem.options.format = "YYYY-MM-DD HH:mm:ss";
      } else {
        this.selectItem.options.format = "YYYY-MM-DD";
      }
    },
		loadCodeTreeData(){
			this.$post("/system/codeItem/getListByLevelId", {levelId: 1}).then((res) => {
				if (res.statusCode !== 300 && res.length) {
					this.codeTreeData = res;
				}
			})
		},
		codeLoadData(treeNode) {
			return new Promise(resolve => {
				if (treeNode.$vnode.children) {
					resolve();
					return;
				}
				let pid = treeNode.dataRef.id
				this.$post("/system/codeItem/getListByPid", {pid: pid})
					.then((res) => {
						const treeData = res;
						treeNode.dataRef.children = treeData;
						this.codeTreeData = [...this.codeTreeData];
						resolve();
					})
					.catch((err) => {
						console.log(err);
					});
			});
		},
		codeTreeChange(value, label, extra){
			this.selectItem.options.codeParams = {
				codeSetId: extra.triggerNode.dataRef.codeSetId,
				levelId: extra.triggerNode.dataRef.levelId
			}
		}
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
</style>
