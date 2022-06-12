<!--
 * @Description: 控件属性设置组件,因为配置数据是引用关系，所以可以直接修改/管理员界面
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-09 10:52:21
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\KPortalDesign\layoutItemProperties.vue
-->
<template>
	<div class="properties-centent kk-checkbox">
		<div class="head-title" v-show="!selectItem.key">
			控件属性设置
		</div>
		<div class="properties-body">
			<p class="hint-box" v-show="!selectItem.key">未选择控件</p>
			<a-form v-show="
          (selectItem.key && options.design) ||
            (selectItem.key && designer === 'admin')
        " labelAlign="left">
				<a-collapse v-model="activeKey">
					<!-- 基本配置 -->
					<a-collapse-panel key="1" header="控件基本属性">
						<!-- gird开始 -->
						<a-form-item v-if="~['grid', 'card', 'miniCard'].indexOf(selectItem.type)" label="栅格间距"
							:labelCol="labelCol" :wrapperCol="wrapperCol">
							<div class="flex">
								水平间距：
								<a-input-number style="width:70% !important;" :min="0" :max="48"
									v-model="options.gutters" placeholder="请输入水平间距：" />
							</div>
							<div class="flex">
								垂直间距：
								<a-input-number style="width:70% !important;" :min="0" :max="48"
									v-model="options.vgutters" placeholder="请输入垂直间距" />
							</div>
						</a-form-item>
						<a-form-item v-if="selectItem.type === 'grid'" label="列配置项" :labelCol="labelCol"
							:wrapperCol="wrapperCol">
							<KChangeOption v-model="selectItem.columns" type="colspan" />
						</a-form-item>
						<!-- grid结束 -->
						<a-form-item v-if="!~['grid', 'tabs'].indexOf(selectItem.type)" label="标签" :labelCol="labelCol"
							:wrapperCol="wrapperCol">
							<a-input v-model="selectItem.label" placeholder="请输入" />
						</a-form-item>
						<a-form-item v-if="
                !~['grid', 'tabs'].indexOf(selectItem.type) &&
                  designer === 'admin'
              " label="可编辑" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<kCheckbox v-model="options.design" label="可编辑" />
						</a-form-item>
						<!-- card开始 -->
						<template v-if="~['card', 'miniCard'].indexOf(selectItem.type)">
							<a-form-item label="标签间距" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<div class="change-col-box">
									<a-slider id="test" :max="24" :min="0" v-model="options.col.xs"
										@change="handleChangeCol" />
									<!-- <div>
                    <label>xs:</label>
                    <a-input-number :min="0" v-model="options.col.xs" />
                  </div>
                  <div>
                    <label>sm:</label>
                    <a-input-number :min="0" v-model="options.col.sm" />
                  </div>
                  <div>
                    <label>md:</label>
                    <a-input-number :min="0" v-model="options.col.md" />
                  </div>
                  <div>
                    <label>lg:</label>
                    <a-input-number :min="0" v-model="options.col.lg" />
                  </div>
                  <div>
                    <label>xl:</label>
                    <a-input-number :min="0" v-model="options.col.xl" />
                  </div>
                  <div>
                    <label>xxl:</label>
                    <a-input-number :min="0" v-model="options.col.xxl" />
                  </div> -->
								</div>
							</a-form-item>
							<a-form-item label="列配置项" v-if="selectItem.type === 'card'" :labelCol="labelCol"
								:wrapperCol="wrapperCol">
								<KChangeOption v-model="options.dataList" type="card" />
							</a-form-item>
						</template>
						<!-- card结束 -->
						<!-- tabs开始 -->
						<template v-if="selectItem.type === 'tabs'">
							<!-- 标签间距 start -->
							<a-form-item label="标签间距" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number v-model="options.tabBarGutter" placeholder="请输入" />
							</a-form-item>
							<!-- 页签位置 start -->
							<!-- tabs配置 start -->
							<a-form-item label="页签配置" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<KChangeOption v-model="selectItem.columns" type="tab" />
							</a-form-item>
							<!-- tabs配置 end -->
							<a-form-item label="页签位置">
								<a-radio-group buttonStyle="solid" v-model="options.tabPosition">
									<a-radio value="top">top</a-radio>
									<a-radio value="right">right</a-radio>
									<a-radio value="bottom">bottom</a-radio>
									<a-radio value="left">left</a-radio>
								</a-radio-group>
							</a-form-item>
							<!-- 页签位置 end -->
							<!-- 页签类型 start -->
							<a-form-item label="页签类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-radio-group buttonStyle="solid" v-model="options.type">
									<a-radio-button value="line">line</a-radio-button>
									<a-radio-button value="card">card</a-radio-button>
									<a-radio-button value="editable-card">editable-card</a-radio-button>
								</a-radio-group>
							</a-form-item>
							<!-- 页签类型 end -->
							<!-- 页签大小 start -->
							<a-form-item label="大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-radio-group buttonStyle="solid" v-model="options.size">
									<a-radio-button value="large">large</a-radio-button>
									<a-radio-button value="default">default</a-radio-button>
									<a-radio-button value="small">small</a-radio-button>
								</a-radio-group>
							</a-form-item>
							<!-- 页签大小 end -->
							<!-- 操作属性 start -->
							<a-form-item label="操作属性" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<KCheckbox v-model="options.animated" label="动画切换" />
							</a-form-item>
							<!-- 操作属性 end -->
						</template>
						<!-- tabs结束 -->
						<!-- 卡片列表布局开始 -->
						<template v-if="
                !~['grid', 'card', 'tabs', 'miniCard'].indexOf(selectItem.type)
              ">
							<a-form-item label="显示标题" v-if="typeof options.titleShow !== 'undefined'"
								:labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.titleShow" label="标题显示" />
							</a-form-item>
							<a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.title" placeholder="请输入" allowClear />
							</a-form-item>
							<a-form-item label="图标" v-if="!~['weather'].indexOf(selectItem.type)" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<icon-font-picker v-model="options.iconFont" @change="changeIcon"></icon-font-picker>
							</a-form-item>
							<a-form-item label="图标颜色" v-if="!~['weather'].indexOf(selectItem.type)" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<div class="flex">
									<colorPicker v-model="options.iconFontColor" label="" size="large" @change="
                      (val) => {
                        changeTextColor(val, 'iconFontColor');
                      }
                    "></colorPicker>
									<a-input v-model="options.iconFontColor" placeholder="请输入" readOnly
										class="margin-left-sm" />
								</div>
							</a-form-item>
							<a-form-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="
                  ~['timeLine', 'list', 'flowCard'].indexOf(
                    selectItem.type
                  )
                ">
								<a-input v-model="options.height" placeholder="请输入像素值或者百分比" allowClear />
							</a-form-item>
							<a-form-item label="布局" v-if="~['weather'].indexOf(selectItem.type)" :labelCol="labelCol"
								:wrapperCol="wrapperCol">
								<a-radio-group v-model="options.layout">
									<a-radio-button value="1">
										横版
									</a-radio-button>
									<a-radio-button value="2">
										竖版
									</a-radio-button>
								</a-radio-group>
							</a-form-item>
						</template>
						<!-- 卡片列表布局结束 -->
						<!-- 图形报表 -->
						<template v-if="~['bar', 'line', 'pie'].indexOf(selectItem.type)">
							<a-form-item label="宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<!-- <div class="flex"> -->
								<a-input v-model="options.width" placeholder="请输入" allowClear />
								<!-- </div> -->
							</a-form-item>
							<a-form-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.height" placeholder="请输入" allowClear />
							</a-form-item>
						</template>
						<a-form-item label="数据接口配置" v-if="
                !~['grid', 'tabs', 'miniCard', 'weather'].indexOf(
                  selectItem.type
                )
              " :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-group compact>
								<a-select v-model="options.method" style="width: 25%;">
									<a-select-option value="get">get</a-select-option>
									<a-select-option value="post">post</a-select-option>
								</a-select>
								<a-input style="width: 75%;" v-model="options.url" :title="options.url"
									placeholder="请输入接口地址" allow-clear />
							</a-input-group>
							<a-textarea v-model="options.parameter" placeholder="请输入参数">
							</a-textarea>
						</a-form-item>
						<template v-if="
                selectItem.type === 'list' || selectItem.type === 'flowCard'
              ">
							<a-form-item label="分页条数" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number placeholder="" v-model="options.pageSize" :min="0" :max="20" />
								<KCheckbox v-model="options.pagination" label="显示分页" />
							</a-form-item>
							<a-form-item label=" " :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.isShowList" label="跳转到列表" />
								<kCheckbox v-model="options.isShowDetail" v-if="selectItem.type === 'list'"
									label="跳转到详情" />
							</a-form-item>
							<a-form-item label="列表页地址" v-if="options.isShowList" :labelCol="labelCol"
								:wrapperCol="wrapperCol">
								<a-input v-model="options.listUrl" placeholder="请输入">
								</a-input>
							</a-form-item>
							<a-form-item label="详情页地址" v-if="options.isShowDetail && selectItem.type === 'list'"
								:labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.detailUrl" placeholder="请输入">
								</a-input>
							</a-form-item>
						</template>
						<template v-if="
                !~['grid', 'card', 'calendar', 'tabs', 'miniCard'].indexOf(
                  selectItem.type
                )
              ">
							<!--              <a-form-item label="显示操作组">
                <kCheckbox v-model="options.action" type="colspan" />
              </a-form-item> -->
							<template v-if="options.action">
								<a-form-item label="组件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-select v-model="options.formType" @change="changeFormType">
										<a-select-option value="text">文本框</a-select-option>
										<a-select-option value="combbox">下拉框</a-select-option>
										<a-select-option value="date">日期</a-select-option>
										<a-select-option value="radioButton">单选按钮</a-select-option>
									</a-select>
								</a-form-item>
								<a-form-item label="字段名" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-textarea v-model="options.formOptions.params" placeholder="请输入需要传递的字段名">
									</a-textarea>
								</a-form-item>
								<a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input v-model="options.formOptions.name" placeholder="请输入" allowClear />
								</a-form-item>
								<!-- combbox配置 -->
								<template v-if="options.formType === 'combbox'">
									<a-divider>下拉框基础配置</a-divider>
									<!-- <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
										<a-input v-model="options.formOptions.name" placeholder="请输入" allowClear />
									</a-form-item> -->
									<a-form-item label="选项配置" :labelCol="labelCol" :wrapperCol="wrapperCol">
										<a-radio-group buttonStyle="solid" v-model="options.formOptions.dynamic"
											class="margin-bottom-xs">
											<a-radio-button value="dynamic"> 动态 </a-radio-button>
											<a-radio-button value="static"> 静态 </a-radio-button>
											<a-radio-button value="code"> 字典 </a-radio-button>
										</a-radio-group>
										<a-input-group compact v-show="options.formOptions.dynamic === 'dynamic'">
											<a-select v-model="options.formOptions.method">
												<a-select-option value="get">get</a-select-option>
												<a-select-option value="post">post</a-select-option>
											</a-select>
											<a-input style="width: 72%;" v-model="options.formOptions.url"
												placeholder="请输入接口地址" allow-clearData />
										</a-input-group>
										<a-textarea v-show="options.formOptions.dynamic === 'dynamic'"
											v-model="options.formOptions.parameter" placeholder="请输入参数">
										</a-textarea>
										<a-input v-show="options.formOptions.dynamic === 'code'"
											v-model="options.formOptions.code" placeholder="参数名"></a-input>
										<KChangeOption v-show="options.formOptions.dynamic === 'static'"
											v-model="options.formOptions.staticList" />
									</a-form-item>
								</template>
								<!-- tab配置 -->
								<template v-if="~['radioButton'].indexOf(options.formType)">
									<a-form-item label="风格样式" :labelCol="labelCol" :wrapperCol="wrapperCol">
										<a-radio-group v-model="options.formOptions.radioStyle">
											<a-radio-button value="solid">
												填充
											</a-radio-button>
											<a-radio-button value="outline">
												描边
											</a-radio-button>
										</a-radio-group>
									</a-form-item>
									<a-form-item label="选项配置" :labelCol="labelCol" :wrapperCol="wrapperCol">
										<KChangeOption v-model="options.formOptions.tabList" />
									</a-form-item>
								</template>
								<!-- 日期时间配置 -->
								<template v-if="options.formType === 'date' && options.formOptions">
									<a-form-item label="日期格式" :labelCol="labelCol" :wrapperCol="wrapperCol">
										<a-select v-model="options.formOptions.dateType">
											<a-select-option value="date">年月日</a-select-option>
											<a-select-option value="month">月份</a-select-option>
											<a-select-option value="rang">时间范围</a-select-option>
										</a-select>
									</a-form-item>
									<a-form-item label="日期格式" :labelCol="labelCol" :wrapperCol="wrapperCol">
										<a-input v-model="options.formOptions.format" placeholder="请输入" allowClear />
									</a-form-item>
									<a-form-item label=" " :labelCol="labelCol" :wrapperCol="wrapperCol">
										<kCheckbox v-model="options.formOptions.clearable" label="可清除" />
										<kCheckbox v-model="options.formOptions.showTime" label="显示时间" />
									</a-form-item>
								</template>
							</template>
						</template>
					</a-collapse-panel>
					<!-- 图表 -->
					<template v-if="~['bar', 'line', 'pie'].indexOf(selectItem.type)">
						<a-collapse-panel key="3" header="标题设置">
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.textShow" label="标题显示" />
							</a-form-item>
							<a-form-item label="主标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.text" placeholder="请输入" allowClear />
							</a-form-item>
							<a-form-item label="字体大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number :min="0" v-model="options.textSize" placeholder="请输入" allowClear />
							</a-form-item>
							<a-form-item label="字体颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<div class="flex">
									<colorPicker v-model="options.textColor" label="" size="small" @change="
                      (val) => {
                        changeTextColor(val, 'textColor');
                      }
                    "></colorPicker>
									<a-input v-model="options.textColor" placeholder="请输入" readOnly
										class="margin-left-sm" />
								</div>
							</a-form-item>
							<a-form-item label="副标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.subtext" placeholder="请输入" allowClear />
							</a-form-item>
							<a-form-item label="字体大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<!-- <a-a-input-numbe v-model="options.textSize" placeholder="请输入" allowClear /> -->
								<a-input-number :min="0" v-model="options.subtextSize" placeholder="请输入" />
							</a-form-item>
							<a-form-item label="字体颜色" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<div class="flex">
									<colorPicker v-model="options.subtextColor" label="" size="small" @change="
                      (val) => {
                        changeTextColor(val, 'textColor');
                      }
                    "></colorPicker>
									<a-input v-model="options.subtextColor" placeholder="请输入" readOnly
										class="margin-left-sm" />
								</div>
							</a-form-item>
							<a-form-item label="位置">
								<div class="flex justify-between flex-wrap">
									<div style="width:45%" class="flex">
										上：<a-select v-model="options.position.top">
											<a-select-option value="auto">居中</a-select-option>>
											<a-select-option value="top">上</a-select-option>>
											<a-select-option value="middle">中</a-select-option>
											<a-select-option value="bottom">下</a-select-option>
										</a-select>
									</div>
									<div style="width:45%" class="flex">
										下：
										<a-input v-model="options.position.bottom" placeholder="请输入像素值或者百分比"
											allowClear />
									</div>
									<div style="width:45%" class="flex">
										左：<a-select v-model="options.position.left">
											<a-select-option value="auto">居中</a-select-option>>
											<a-select-option value="left">左</a-select-option>>
											<a-select-option value="center">中</a-select-option>
											<a-select-option value="right">右</a-select-option>
										</a-select>
									</div>
									<div style="width:45%" class="flex">
										右：
										<a-input v-model="options.position.right" placeholder="请输入像素值或者百分比"
											allowClear />
									</div>
								</div>
							</a-form-item>
						</a-collapse-panel>
						<a-collapse-panel key="4" header="图例操作">
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.legend.show" label="显示图例" />
							</a-form-item>
							<a-form-item label="图例类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-select v-model="options.legend.type">
									<a-select-option value="plain">普通图例</a-select-option>
									<a-select-option value="scroll">滚动图例</a-select-option>
								</a-select>
							</a-form-item>
							<a-form-item label="字体大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number :min="0" v-model="options.legend.textSize" placeholder="请输入"
									allowClear />
							</a-form-item>
							<a-form-item label="宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number :min="0" v-model="options.legend.itemWidth" placeholder="请输入"
									allowClear />
							</a-form-item>
							<a-form-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input-number :min="0" v-model="options.legend.itemHeight" placeholder="请输入"
									allowClear />
							</a-form-item>
							<a-form-item label="图例位置">
								<div class="flex justify-between flex-wrap">
									<div style="width:45%" class="flex">
										上：<a-select v-model="options.legend.top">
											<a-select-option value="auto">居中</a-select-option>>
											<a-select-option value="top">上</a-select-option>>
											<a-select-option value="middle">中</a-select-option>
											<a-select-option value="bottom">下</a-select-option>
										</a-select>
									</div>
									<div style="width:45%" class="flex">
										下：
										<a-input v-model="options.legend.bottom" placeholder="请输入像素值或者百分比" allowClear />
									</div>
									<div style="width:45%" class="flex">
										左：<a-select v-model="options.legend.left">
											<a-select-option value="auto">居中</a-select-option>>
											<a-select-option value="left">左</a-select-option>>
											<a-select-option value="center">中</a-select-option>
											<a-select-option value="right">右</a-select-option>
										</a-select>
									</div>
									<div style="width:45%" class="flex">
										右：
										<a-input v-model="options.legend.right" placeholder="请输入像素值或者百分比" allowClear />
									</div>
								</div>
							</a-form-item>
							<a-form-item label="布局朝向" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-select v-model="options.legend.orient">
									<a-select-option value="vertical">竖排</a-select-option>
									<a-select-option value="horizontal">横排</a-select-option>
								</a-select>
							</a-form-item>
						</a-collapse-panel>
						<a-collapse-panel key="5" v-if="selectItem.type === 'pie'" header="饼图设置">
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.ring" label="设置为环形" />
							</a-form-item>
							<a-form-item label="半径大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.radius" placeholder="请输入" allowClear />
							</a-form-item>
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.roseType" label="南丁格尔玫瑰" />
							</a-form-item>
							<a-form-item label="圆心位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-model="options.center" placeholder="请输入" allowClear />
							</a-form-item>
						</a-collapse-panel>
						<a-collapse-panel key="6" v-if="selectItem.type === 'line'" header="折线设置">
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.smooth" label="是否平滑" />
							</a-form-item>
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.areaStyle" label="面积堆积" />
							</a-form-item>
							<a-form-item label="线宽" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-slider id="line" :max="100" :min="0" v-model="options.linewidth" />
							</a-form-item>
							<a-form-item label="标记大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-slider id="line" :max="100" :min="0" v-model="options.symbolSize" />
							</a-form-item>
						</a-collapse-panel>
						<a-collapse-panel key="10" v-if="selectItem.type === 'bar'" header="柱体设置">
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.showBackground" label="显示背景" />
							</a-form-item>
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.emphasis" label="高亮样式" />
							</a-form-item>
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<kCheckbox v-model="options.stack" label="堆叠式" />
							</a-form-item>
							<a-form-item label="柱宽" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-slider id="line" :max="100" :min="0" v-model="options.barwidth" />
							</a-form-item>
							<a-form-item label="圆角" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-slider id="line" :max="100" :min="0" v-model="options.barBorderRadius" />
							</a-form-item>
							<a-form-item label="柱状间距" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input id="line" v-model="options.barGap" placeholder="请输入百分比" />
							</a-form-item>
						</a-collapse-panel>
						<template v-if="selectItem.type === 'line' || selectItem.type === 'bar'">
							<a-collapse-panel key="7" header="X轴设置">
								<a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input v-model="options.x.name" placeholder="请输入" allowClear />
								</a-form-item>
								<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<kCheckbox v-model="options.x.axisLine" label="显示坐标轴线" />
								</a-form-item>
								<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<kCheckbox v-model="options.x.splitLine" label="显示网格线" />
								</a-form-item>
								<a-form-item label="字体大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input-number :min="0" v-model="options.x.textSize" placeholder="请输入"
										allowClear />
								</a-form-item>
								<a-form-item label="字体角度" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-slider id="line" :max="100" :min="0" v-model="options.x.rotate" />
								</a-form-item>
							</a-collapse-panel>
							<a-collapse-panel key="8" header="Y轴设置">
								<a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input v-model="options.y.name" placeholder="请输入" allowClear />
								</a-form-item>
								<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<kCheckbox v-model="options.y.axisLine" label="显示坐标轴线" />
								</a-form-item>
								<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<kCheckbox v-model="options.y.splitLine" label="显示网格线" />
								</a-form-item>
								<a-form-item label="字体大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input-number :min="0" v-model="options.y.textSize" placeholder="请输入"
										allowClear />
								</a-form-item>
							</a-collapse-panel>
							<a-collapse-panel key="9" header="坐标轴边距">
								<a-form-item label="左边距" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input-number :min="0" v-model="options.grid.left" placeholder="请输入" allowClear />
								</a-form-item>
								<a-form-item label="右边距" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input-number :min="0" v-model="options.grid.right" placeholder="请输入"
										allowClear />
								</a-form-item>
								<a-form-item label="上边距" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input-number :min="0" v-model="options.grid.top" placeholder="请输入" allowClear />
								</a-form-item>
								<a-form-item label="下边距" :labelCol="labelCol" :wrapperCol="wrapperCol">
									<a-input-number :min="0" v-model="options.grid.bottom" placeholder="请输入"
										allowClear />
								</a-form-item>
							</a-collapse-panel>
						</template>
						<a-collapse-panel key="13" header="自定义配色">
							<a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<KChangeOption v-model="options.colorLost" type="color" />
							</a-form-item>
						</a-collapse-panel>
					</template>
					<!-- miniCard Start -->
					<a-collapse-panel key="12" v-if="selectItem.type === 'miniCard'" header="小卡片设置">
						<a-form-item label="布局" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-radio-group buttonStyle="solid" v-model="options.layout" class="margin-bottom-xs">
								<a-radio-button value="vertical"> 竖向 </a-radio-button>
								<a-radio-button value="horizontal"> 横向 </a-radio-button>
							</a-radio-group>
						</a-form-item>
						<a-form-item label="宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-model="options.width" placeholder="请输入" allowClear />
						</a-form-item>
						<a-form-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-model="options.height" placeholder="请输入" allowClear />
						</a-form-item>
						<a-form-item label="文字大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number :min="0" v-model="options.fontSize" placeholder="请输入" />
						</a-form-item>
						<a-form-item label="图标大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number :min="0" v-model="options.iconFontSize" placeholder="请输入" />
						</a-form-item>
						<a-form-item label="圆角" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-model="options.borderRadius" placeholder="请输入" allowClear />
						</a-form-item>
						<a-form-item label="列表项配置" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<KChangeOption v-model="options.columns" type="miniCard" />
						</a-form-item>
					</a-collapse-panel>
					<!-- miniCard End -->
				</a-collapse>
			</a-form>
			<p class="hint-box" v-show="
          selectItem.key !== '' &&
            !~['grid', 'tabs'].indexOf(selectItem.type) &&
            designer !== 'admin' &&
            !options.design
        ">
				选择控件无操作权限
			</p>
		</div>
		<!-- <div class="close-box" @click="$emit('handleHide')">
			<a-icon type="double-right" />
		</div> -->
	</div>
</template>
<script>
	import KChangeOption from "../KChangeOption/index.vue";
	import KCheckbox from "@/components/TopVUI/k-form-design/packages/KCheckbox/index.vue";
	import colorPicker from "@/components/TopVUI/color/colorPicker";
	import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";

	export default {
		name: "formItemProperties",
		data() {
			return {
				options: {},
				activeKey: 1,
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
				handler(newVal, oldVal) {
					this.options = newVal.options || {};
					console.log(this.options);
				},
			},
		},
		props: {
			selectItem: {
				type: Object,
				required: true,
			},
			hideModel: {
				type: Boolean,
				default: true,
			},
			designer: {
				type: String,
			},
		},
		components: {
			KChangeOption,
			KCheckbox,
			colorPicker,
			iconFontPicker,
		},
		methods: {
			changeDataType(e, ty) {
				// let type = '';
				// if (ty === 0) {
				// 	type = e;
				// } else {
				// 	type = e.target.value;
				// }
				// let optionsList = [];
				// if (type === 'static') {
				// 	this.options.options = this.options.staticList;
				// } else if (type === 'dynamic') {
				// 	this.fetchData();
				// } else {
				// 	this.$emit('get-code-data', this.selectItem);
				// }
				// this.$set(this.selectItem, 'options', this.options)
				this.fetchData();
			},
			changeTextColor(val, field) {
				this.selectItem.options[field] = val;
				console.log(this.selectItem, this.selectItem.options[field]);
			},
			fetchData() {
				// console.log(123);
				if (this.options.method && this.options.url) {
					this.$emit("fetch-data", this.selectItem);
				}
			},
			handleChangeCol(e) {
				this.options.col.xs = this.options.col.sm = this.options.col.md = this.options.col.lg = this.options.col
					.xl = this.options.col.xxl = e;

				// this.config.wrapperCol.xs = this.config.wrapperCol.sm = this.config.wrapperCol.md = this.config.wrapperCol.lg = this.config.wrapperCol.xl = this.config.wrapperCol.xxl =
				// 	24 - e;
			},
			changeFormType(val) {},
			changeIcon(val) {
				this.selectItem.options.iconFont = val;
			},
		},
	};
</script>
<style scoped="scoped">
	.right .ant-form-item-control {
		line-height: 32px !important;
	}
</style>
