<!--
 * @Description: 流程节点配置
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 10:27:07
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\NodePropertyPanel.vue
-->
<template>
  <div class="margin-top-sm">
    <a-form
      :inline="false"
      label-width="100px"
      size="small"
      label-position="right"
      v-if="!~['bpmn:CallActivity', 'bpmn:SubProcess'].indexOf(formData.type)"
    >
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="节点类型"
      >
        <a-input v-model="formData.type" disabled></a-input>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节点ID">
        <a-input
          v-model="formData.id"
          @change="
            (e) => {
              updateId(e.target.value);
            }
          "
          :disabled="true"
        ></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="节点名称"
      >
        <a-input
          v-model="formData.name"
          @change="
            (e) => {
              updateName(e.target.value);
            }
          "
        ></a-input>
      </a-form-item>
      <!--usertask-->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="formData.type == 'bpmn:UserTask'"
        label="节点人员"
      >
        <a-select
          v-model="formData.userType"
          placeholder="请选择"
          @change="changeUserType"
        >
          <a-select-option value="assignee">指定人员</a-select-option>
          <a-select-option value="candidateUsers">候选人员</a-select-option>
          <a-select-option value="candidateGroups">指定角色</a-select-option>
          <a-select-option value="processInitiator">流程发起人</a-select-option>
          <a-select-option value="department">岗位</a-select-option>
        </a-select>
      </a-form-item>
      <!-- 指定人员 -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="指定人员"
        v-if="
          formData.type == 'bpmn:UserTask' && formData.userType === 'assignee'
        "
      >
        <a-input
          key="1"
          v-model="formData.assigneeName"
          placeholder="请选择"
          @change="
            (e) =>
              setUser({
                assignee: formData.assigneeName,
                assigneeName: formData.assigneeName,
              })
          "
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="() => (isUserPopup = true)"
          />
        </a-input>
        <user-popup
          :visible="isUserPopup"
          style="width: 100%;"
          :typeForm="true"
          :typeNum="1"
          @change="(value) => addUser(value, 1)"
          @close="() => (isUserPopup = false)"
        />
      </a-form-item>
      <!-- 候选人员 -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="候选人员"
        v-else-if="
          formData.type == 'bpmn:UserTask' &&
            formData.userType === 'candidateUsers'
        "
      >
        <a-input
          @click="() => (isUserPopups = true)"
          key="2"
          v-model="formData.candidateUsersName"
          placeholder="请选择"
          @change="
            (e) =>
              setUser({
                candidateUsers: formData.candidateUsersName,
                candidateUsersName: formData.candidateUsersName,
              })
          "
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="() => (isUserPopups = true)"
          />
        </a-input>
        <user-popup
          :userList="formData.candidateUsers"
          :visible="isUserPopups"
          style="width: 100%;"
          :typeNum="2"
          @change="(value) => addUser(value, 2)"
          @close="() => (isUserPopups = false)"
        />
      </a-form-item>
      <!-- 指定角色 -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="指定角色"
        v-else-if="
          formData.type == 'bpmn:UserTask' &&
            formData.userType === 'candidateGroups'
        "
      >
        <a-input
          key="3"
          v-model="formData.candidateGroupsName"
          placeholder="请选择"
          @change="
            (e) =>
              setUser({
                candidateGroups: formData.candidateGroupsName,
                candidateGroupsName: formData.candidateGroupsName,
              })
          "
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="() => (isUserPopups = true)"
          />
        </a-input>
        <role-popup
          :userList="formData.candidateGroups"
          :visible="isUserPopups"
          style="width: 100%;"
          :typeNum="2"
          @change="(value) => addUser(value, 3)"
          @close="() => (isUserPopups = false)"
        />
      </a-form-item>
      <!-- 流程发起人 -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="流程发起人"
        v-else-if="
          formData.type == 'bpmn:UserTask' &&
            formData.userType === 'processInitiator'
        "
      >
        <a-input
          v-model="formData.processInitiator"
          :default-value="'${startUserNameId}'"
          disabled
        ></a-input>
      </a-form-item>
      <!-- 岗位 -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="岗位"
        v-else-if="
          formData.type == 'bpmn:UserTask' && formData.userType === 'department'
        "
      >
        <a-input
          key="3"
          v-model="formData.candidateGroupsName"
          placeholder="请选择"
          @change="
            (e) =>
              setUser({
                candidateGroups: formData.candidateGroupsName,
                candidateGroupsName: formData.candidateGroupsName,
              })
          "
        >
          <a-icon
            slot="addonAfter"
            type="user"
            @click="() => (isUserPopups = true)"
          />
        </a-input>
        <t-department
          :userList="formData.candidateGroups"
          :visible="isUserPopups"
          style="width: 100%;"
          :typeNum="2"
          @change="(value) => addUser(value, 4)"
          @close="() => (isUserPopups = false)"
        />
      </a-form-item>
      <!-- 按钮配置 -->
      <template v-if="formData.type == 'bpmn:UserTask'">
        <a-divider>按钮配置</a-divider>
				<div v-for="(item, index) in btnGroup" :key="index">
					<div class="select-item" v-if="item.nodeButtonCode">
					  <div class="select-line-icon option-drag">
					    <a-icon type="menu" />
					  </div>
					  <a-input
					    readOnly
					    v-model="item.nodeButtonName"
					    placeholder="选项名"
					  />
					  <a-input
					    readOnly
					    placeholder="选项值"
					    v-model="item.nodeButtonCode"
					    type="hidden"
					  />
					  <div class="close-btn select-line-icon"  @click="setBtnGroupItem(index)">
					    <a-icon type="minus-circle" />
					  </div>
					</div>
				</div>
        <div style="margin-left: 20px;">
          <!-- <a-button style="padding-bottom: 0" icon="plus-circle" type="link" @click="setBtnGroupItem()">
            添加选项
          </a-button> -->
          <a-button
            style="padding-bottom: 0"
            icon="plus-circle"
            type="link"
            @click="openBtnPop()"
          >
            快速添加
          </a-button>
        </div>
        <button-popup
          ref="btnPopList"
          :btnList="btnGroup"
          :visible="btnPopups"
          style="width: 100%;"
          @change="(value) => setBtnGroupItem(value, 'list')"
          @cancel="() => (btnPopups = false)"
        />
        <a-divider></a-divider>
      </template>
      <!-- bpmn:TimerEventDefinition定时器 -->
      <!-- <template v-if="~['bpmn:StartEvent','bpmn:IntermediateCatchEvent','bpmn:EndEvent'].indexOf(formData.type)&&nodeElement.businessObject.get('eventDefinitions').length!=0">
	  		<template v-for="item in nodeElement.businessObject.get('eventDefinitions')">
	  			<template v-if="item.$type==='bpmn:SignalEventDefinition'">
	  				<a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="信号定义">
	  				  <a-select style="width: 100%">
	  				      <div slot="dropdownRender" slot-scope="menu">
	  				        <v-nodes :vnodes="menu" />
	  				        <a-divider style="margin: 4px 0;" />
	  				        <div
	  				          style="padding: 4px 8px; cursor: pointer;"
	  				          @mousedown="e => e.preventDefault()"
	  				          @click="showSignal('signal')"
	  				        >
	  				          <a-icon type="plus" /> 添加
	  				        </div>
	  				      </div>
	  				      <a-select-option v-for="(item,index) in formData.signalRefList" :key="index" :value="item.id" @click="changeSignalRef(item,'signal')">
	  				        {{ item.name }}
	  				      </a-select-option>
	  				    </a-select>
	  				</a-form-model-item>
	  				<signal ref="signal" :visible="signalVisible" :element="nodeElement" :refType="refType" :signalRefList="formData.signalRefList" :messageRefList="formData.signalRefList" :modeler="modeler" @ok="finishSignal" @close="()=>{signalVisible = false}"></signal>
	  			</template>
	  			<template v-if="item.$type==='bpmn:MessageEventDefinition'">
	  				<a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="消息定义">
	  				  <a-select style="width: 100%">
	  				      <div slot="dropdownRender" slot-scope="menu">
	  				        <v-nodes :vnodes="menu" />
	  				        <a-divider style="margin: 4px 0;" />
	  				        <div
	  				          style="padding: 4px 8px; cursor: pointer;"
	  				          @mousedown="e => e.preventDefault()"
	  				          @click="showSignal('msg')"
	  				        >
	  				          <a-icon type="plus" /> 添加
	  				        </div>
	  				      </div>
	  				      <a-select-option v-for="(item,index) in formData.messageRefList" :key="index" :value="item.id" @click="changeSignalRef(item,'msg')">
	  				        {{ item.name }}
	  				      </a-select-option>
	  				    </a-select>
	  				</a-form-model-item>
	  			</template>
	  			<template v-if="item.$type==='bpmn:TimerEventDefinition'">
	  				<a-divider>边界时间属性设置</a-divider>
	  				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="定时类型">
	  					<a-select v-model="formData.timer" placeholder="请选择" @change="changeTimer">
	  					  <a-select-option value="timeDate">Date(采用ISO-8601日期时间)</a-select-option>
	  					  <a-select-option value="timeDuration">Duration(持续时间)</a-select-option>
	  					  <a-select-option value="timeCycle">Cycle(时间周期)</a-select-option>
	  					</a-select>
	  				</a-form-item>
	  				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="值">
	  				  <a-input v-model="formData.timerValue" @change="(val)=>changeTimerValue(val.target.value)"></a-input>
	  				</a-form-item>
	  			</template>
	  			<template v-if="item.$type==='bpmn:ConditionalEventDefinition'">
	  				<a-divider>条件属性设置</a-divider>
	  				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="条件类型">
	  					<a-select default-value="expression" v-model="formData.conditionalExpressionType" placeholder="请选择" @change="(e)=>{conditionalType(e,'expression')}">
	  					  <a-select-option value="expression">表达式</a-select-option>
	  					  <a-select-option value="script">脚本</a-select-option>
	  					</a-select>
	  				</a-form-item>
	  				<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="表达式">
	  				  <a-input v-model="formData.conditionalExpression" @change="(e)=>{setConditionalValue(e.target.value,'expression')}"></a-input>
	  				</a-form-item>
	  				<template v-if="formData.conditionalExpressionType==='script'">
	  					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="条件类型">
	  						<a-select default-value="script" v-model="formData.conditionalScriptType" placeholder="请选择" @change="(e)=>{conditionalType(e,'script')}">
	  						  <a-select-option value="script">内联脚本</a-select-option>
	  						  <a-select-option value="scriptResource">脚本资源</a-select-option>
	  						</a-select>
	  					</a-form-item>
	  					<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="脚本">
	  						<a-input v-model="formData.conditionalScript" @change="(e)=>{setConditionalValue(e.target.value,'script')}"></a-input>
	  					</a-form-item>
	  				</template>
	  			</template>
	  		</template>
	  </template> -->
      <a-divider
        v-if="formData.type == 'bpmn:UserTask' && formDesinType === 'custom'"
        >表单配置</a-divider
      >
      <!-- 表单设置 -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="表单配置"
        v-if="formData.type == 'bpmn:UserTask' && formDesinType === 'custom'"
      >
        <a-radio-group v-model="formData.formModuleType">
          <!-- <a-radio-button value="dynamic">
            动态表单
          </a-radio-button> -->
          <a-radio-button value="extraposition">
            外置表单
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <template v-if="formData.formModuleType == 'dynamic'">
        <table-form
          :formData="formData"
          :nodeElement="nodeElement"
          :modeler="modeler"
        ></table-form>
      </template>
      <template
        v-if="
          formData.type == 'bpmn:UserTask' &&
            formDesinType === 'custom' &&
            formData.formModuleType == 'extraposition'
        "
      >
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="外置表单"
        >
          <a-input-search
            placeholder="请选择表单"
            @search="
              () => {
                externalFormVisible = true;
              }
            "
            ><a-button slot="enterButton">
              选择表单
            </a-button></a-input-search
          >
        </a-form-item> -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="外置表单"
        >
          <!-- <a-input v-model="formDesignUrl" placeholder="表单页面路径"></a-input> -->
          <a-input-search
            placeholder="表单页面路径"
            v-model="formDesignUrl"
            @search="
              () => {
                externalFormVisible = true;
              }
            "
          >
            <a-button slot="enterButton" type="primary">
              选择
            </a-button>
          </a-input-search>
        </a-form-item>
        <a-form-item
          :labelCol="{
            xs: {
              span: 24,
            },
            sm: {
              span: 8,
            },
          }"
          :wrapperCol="{
            xs: {
              span: 24,
            },
            sm: {
              span: 15,
            },
          }"
          label="表单保存接口"
        >
          <a-input
            v-model="nodeFormSavePathUrl"
            placeholder="表单保存接口地址"
          ></a-input>
        </a-form-item>
        <a-form-item
          :labelCol="{
            xs: {
              span: 24,
            },
            sm: {
              span: 8,
            },
          }"
          :wrapperCol="{
            xs: {
              span: 24,
            },
            sm: {
              span: 15,
            },
          }"
          label="表单详情接口"
        >
          <a-input
            v-model="formDesignDetailUrl"
            placeholder="表单详情接口地址"
          ></a-input>
        </a-form-item>
        <a-form-item
          :labelCol="{
            xs: {
              span: 24,
            },
            sm: {
              span: 8,
            },
          }"
          :wrapperCol="{
            xs: {
              span: 24,
            },
            sm: {
              span: 15,
            },
          }"
          label="表单更新接口"
        >
          <a-input
            v-model="nodeFormUpdatePathUrl"
            placeholder="表单更新接口地址"
          ></a-input>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="表单可编辑"
        >
          <a-checkbox v-model="formData.formEditable"></a-checkbox>
        </a-form-item>
      </template>
      <a-divider>其他配置</a-divider>
      <!-- 通知配置 -->
      <template v-if="formData.type == 'bpmn:UserTask'">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="通知类型"
        >
          <a-select
            v-model="formData.notification"
            placeholder="请选择"
            mode="multiple"
            @change="changeNotification"
          >
						<a-select-option value="message">短信</a-select-option>
						<a-select-option value="mail">邮件</a-select-option>
						<a-select-option value="note">站内信</a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <!-- 跳过表达式 -->
      <!-- <template v-if="formData.type == 'bpmn:UserTask'">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="跳过表达式"
        >
          <a-input v-model="formData.skipExpression"></a-input>
        </a-form-item>
      </template> -->
      <!-- 优先级 -->
      <!-- <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="formData.type == 'bpmn:UserTask'"
        label="优先级"
      >
        <a-select
          v-model="formData.priority"
          placeholder="请选择"
          @change="updatePriority"
        >
          <a-select-option value="50">无</a-select-option>
          <a-select-option value="150">高</a-select-option>
          <a-select-option value="100">中</a-select-option>
          <a-select-option value="80">低</a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="执行监听器"
      >
        <a-button type="primary" size="small" @click="showExecute(1)"
          >编辑</a-button
        >
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="formData.type == 'bpmn:UserTask'"
        label="任务监听器"
      >
        <a-button type="primary" size="small" @click="showExecute(2)"
          >编辑</a-button
        >
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="
          !~[
            'bpmn:StartEvent',
            'bpmn:SequenceFlow',
            'bpmn:EndEvent',
            'bpmn:ExclusiveGateway',
          ].indexOf(formData.type)
        "
        label="多实例"
      >
        <a-button type="primary" size="small" @click="showMultiInstance()"
          >编辑</a-button
        >
        <multiInstance
          ref="multiInstance"
          :visible="multiInstanceVisible"
          :element="nodeElement"
          :modeler="modeler"
          @close="finishMultiInstance"
        ></multiInstance>
      </a-form-item>
      <!-- <a-form-item
        v-if="
          ~[
            'bpmn:UserTask',
            'bpmn:ReceiveTask',
            'bpmn:SendTask',
            'bpmn:ManualTask',
            'bpmn:BusinessRuleTask',
            'bpmn:ServiceTask',
            'bpmn:ScriptTask',
            'bpmn:ExclusiveGateway',
          ].indexOf(formData.type)
        "
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="异步"
      >
        <a-switch v-model="formData.async" />
      </a-form-item> -->
      <!-- <a-form-item
        v-if="
          !~[
            'bpmn:StartEvent',
            'bpmn:SequenceFlow',
            'bpmn:EndEvent',
            'bpmn:ExclusiveGateway',
            'bpmn:UserTask',
          ].indexOf(formData.type)
        "
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="是否为补偿"
      >
        <a-switch v-model="formData.isForCompensation" />
      </a-form-item> -->
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="到期时间"
        v-if="formData.type == 'bpmn:BusinessRuleTask'"
      >
        <t-date
          v-model="formData.dueDate"
          placeholder="请选择日期"
          style="width: 100%"
          @change="(value) => updateDueDate(value)"
        ></t-date>
      </a-form-item>
      <!--sequenceFlow-->
      <template v-if="formData.type == 'bpmn:SequenceFlow'">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流转条件"
          v-if="formDesinType !== 'custom'"
        >
          <a-radio-group
            v-model="formData.conditionType"
            @change="changeConditionType"
          >
            <a-radio-button value="form">
              表单字段
            </a-radio-button>
            <a-radio-button value="expression">
              表达式
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="
            formData.conditionType == 'expression' || formDesinType === 'custom'
          "
          label="分支条件"
        >
          <a-input
            v-model="formData.sequenceFlow"
            @change="
              (e) => {
                updateSequenceFlow(e.target.value);
              }
            "
          ></a-input>
        </a-form-item>
        <template v-if="formData.conditionType == 'form'">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="分支条件"
          >
            <a-input
              v-model="formData.sequenceFlow"
              @click="
                () => {
                  conditionVisible = true;
                }
              "
              readOnly
              placeholder="分支条件"
              @change="
                (e) => {
                  updateSequenceFlow(e.target.value);
                }
              "
            ></a-input>
          </a-form-item>
          <conditions
            ref="condition"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
            :visible="conditionVisible"
            :element="nodeElement"
            :modeler="modeler"
            @ok="finishConditionVisible"
            @close="
              () => {
                conditionVisible = false;
              }
            "
          ></conditions>
        </template>
      </template>
      <!-- 业务规则任务 -->
      <!-- <template v-if="formData.type=='bpmn:BusinessRuleTask'">
	    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="输入变量">
	      <a-input v-model="formData.ruleVariablesInput"></a-input>
	    </a-form-item>
		<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="规则">
		  <a-input v-model="formData.rules"></a-input>
		</a-form-item>
		<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结果变量">
		  <a-input v-model="formData.resultVariable"></a-input>
		</a-form-item>
		<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排除">
		  <a-switch v-model="formData.exclude"/>
		</a-form-item>
	  </template> -->
      <!-- 脚本任务 -->
      <!-- <template v-if="formData.type=='bpmn:ScriptTask'">
	    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="自动存储变量">
		  <a-switch v-model="formData.autoStoreVariables"/>
	    </a-form-item>
	  </template> -->
      <!-- 服务任务 -->
      <!-- <template v-if="formData.type=='bpmn:ServiceTask'">
	    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="服务任务可触发">
	  		<a-switch v-model="formData.triggerable"/>
	    </a-form-item>
	  </template> -->
      <!-- bpmn:MessageEventDefinition 消息事件 -->
      <!-- <template v-if="formData.type=='bpmn:StartEvent'&&nodeElement.businessObject.get('eventDefinitions').length!=0">
	  		<a-divider>边界时间属性设置</a-divider>
	    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="定时类型">
	  		<a-select v-model="formData.timer" placeholder="请选择" @change="changeTimer">
	  		  <a-select-option value="timeDate">Date(采用ISO-8601日期时间)</a-select-option>
	  		  <a-select-option value="timeDuration">Duration(持续时间)</a-select-option>
	  		  <a-select-option value="timeCycle">Cycle(时间周期)</a-select-option>
	  		</a-select>
	    </a-form-item>
	  		<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="值">
	  		  <a-input v-model="formData.timerValue" @change="(val)=>changeTimerValue(val.target.value)"></a-input>
	  		</a-form-item>
	  </template> -->
    </a-form>
    <!-- 监听器 -->
    <execute-property-panel
      ref="execute"
      :visible="visible"
      :type="type"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      :executionListener="executionListener"
      :taskListener="taskListener"
      @addExecute="addExecute"
    ></execute-property-panel>
    <!-- 表单 -->
    <external-form
      :visible.sync="externalFormVisible"
      @ok="handleChangeForm"
    ></external-form>
  </div>
</template>

<script>
import ExecutePropertyPanel from "./executePropertyPanel.vue"
import userPopup from '@/components/TopVUI/custom/userPopup';
import rolePopup from '@/components/TopVUI/custom/rolePopup';
import TDepartment from '@/components/TopVUI/custom/TDepartment';
import buttonPopup from './modal/buttonModal.vue';
import multiInstance from './modal/multiInstance.vue';
import signal from './modal/signal';
import tableForm from './modal/tableForm.vue';
import conditions from './modal/conditions.vue';
import processUser from './modal/processUser.vue';
import externalForm from './modal/externalForm.vue';
import { message } from 'ant-design-vue';
export default {
  name: "NodePropertyPanel",
  components: {
    ExecutePropertyPanel,
    userPopup,
    buttonPopup,
    multiInstance,
    rolePopup,
    TDepartment,
    signal,
    tableForm,
    conditions,
    processUser,
    externalForm,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      externalFormVisible:false,//外置表单
      isUserPopup: false,
      isUserPopups: false,
      isRolePopups: false,
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 17
        }
      },
      visible: false,
      confirmLoading: false,
      type: 0,
      mdl: null,
      btnGroup: [],
      btnPopups:false,
      btnList:[],
      executionListener:[],
      taskListener:[],
      multiInstanceVisible:false,
      eventDefinitions:[],
      signalVisible:false,
      refType:'',
      conditionVisible:false,
      extensionElements:[],
      formDesignUrl:'',
      formDesignDetailUrl:'',
      nodeFormUpdatePathUrl:'',
      nodeFormSavePathUrl:''
    }
  },
  props: {
    modeler: {
      type: Object,
      required: true
    },
    nodeElement: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    formDesinType:{
      type:String
    },
    formFieldLists:{
      type: Array
    },
    updateList:{
      type: Array
    }
  },
  watch: {
    nodeElement: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.executionListener = []
        this.taskListener = []
        const bpmnModeler = this.modeler
        const modeling = bpmnModeler.get('modeling')
        const businessObject = newVal.businessObject
        this.formDesignUrl=businessObject?.formDesignUrl
        this.formDesignDetailUrl= businessObject?.formDesignDetailUrl
        this.nodeFormUpdatePathUrl=businessObject?.nodeFormUpdatePathUrl
        this.nodeFormSavePathUrl=businessObject?.nodeFormSavePathUrl
        if (newVal.type == 'bpmn:UserTask'||newVal.type == 'bpmn:EndEvent') {
          // this.eventDefinitions = businessObject.eventDefinitions
          this.btnGroup = businessObject.btnGroup?JSON.parse(businessObject.btnGroup):[];
        }
        if (this.nodeElement.type == "bpmn:StartEvent") {
          this.updateName("开始");
        }
        if (this.nodeElement.type == "bpmn:EndEvent") {
          this.updateName("结束");
        }
        if(newVal.businessObject?.extensionElements){
          // 执行监听器
          this.executionListener = newVal.businessObject.extensionElements?.values
          .filter(item => item.$type === 'flowable:ExecutionListener')
          .map(item => {
          let type
          if ('class' in item) type = 'class'
          if ('expression' in item) type = 'expression'
          if ('delegateExpression' in item) type = 'delegateExpression'
          return {
            event: item.event,
            type: type,
            className: item[type],
            params: item.fields?.map(field => {
            let fieldType
            if ('stringValue' in field) fieldType = 'stringValue'
            if ('expression' in field) fieldType = 'expression'
            return {
              name: field.name,
              type: fieldType,
              value: field[fieldType],
              editable:false
            }
            }) ?? []
          }
          }) ?? []
          // 任务监听器
          this.taskListener = businessObject.extensionElements?.values
          .filter(item => item.$type === 'flowable:TaskListener')
          .map(item => {
            let type
            if ('class' in item) type = 'class'
            if ('expression' in item) type = 'expression'
            if ('delegateExpression' in item) type = 'delegateExpression'
            return {
              event: item.event,
              type: type,
              className: item[type],
              params: item.fields?.map(field => {
                let fieldType
                if ('stringValue' in field) fieldType = 'stringValue'
                if ('expression' in field) fieldType = 'expression'
                return {
                  name: field.name,
                  type: fieldType,
                  value: field[fieldType],
              editable:false
                }
              }) ?? []
            }
          }) ?? []
        }
      }
    },
    'formData.async': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:async': val })
      this.$emit('setFormBtnData', 'async',val);
    },
    'formData.isForCompensation': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'isForCompensation': val })
    this.$emit('setFormBtnData', 'isForCompensation',val);
    },
    'formData.ruleVariablesInput': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:ruleVariablesInput': val })
    this.$emit('setFormBtnData', 'ruleVariablesInput',val);
    },
    'formData.rules': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:rules': val })
    this.$emit('setFormBtnData', 'rules',val);
    },
    'formData.resultVariable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:resultVariable': val })
    this.$emit('setFormBtnData', 'resultVariable',val);
    },
    'formData.exclude': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:exclude': val })
    this.$emit('setFormBtnData', 'exclude',val);
    },
    'formData.autoStoreVariables': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:autoStoreVariables': val })
      this.$emit('setFormBtnData', 'autoStoreVariables',val);
    },
    'formData.triggerable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:triggerable': val })
      this.$emit('setFormBtnData', 'triggerable',val);
    },
    'formData.skipExpression': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:skipExpression': val })
      this.$emit('setFormBtnData', 'skipExpression',val);
    },
    'formDesignUrl':function(val) {
      if (val === '') val = null
      this.updateProperties({ 'formDesignUrl': val })
      this.$emit('setFormBtnData', 'formDesignUrl',val);
      this.changeFormModuleBtn()
    },
    'formDesignDetailUrl':function(val) {
      if (val === '') val = null
      this.updateProperties({ 'formDesignDetailUrl': val })
      this.$emit('setFormBtnData', 'formDesignDetailUrl',val);
      this.changeFormModuleBtn()
    },
    'nodeFormUpdatePathUrl':function(val) {
      if (val === '') val = null
      this.updateProperties({ 'nodeFormUpdatePathUrl': val })
      this.$emit('setFormBtnData', 'nodeFormUpdatePathUrl',val);
      this.changeFormModuleBtn()
    },
    'nodeFormSavePathUrl':function(val) {
      if (val === '') val = null
      this.updateProperties({ 'nodeFormSavePathUrl': val })
      this.$emit('setFormBtnData', 'nodeFormSavePathUrl',val);
      this.changeFormModuleBtn()
    },
    'formData.formModuleType':function(val) {
      if (val === '') val = null
      this.updateProperties({ 'formModuleType': val })
      this.$emit('setFormBtnData', 'formModuleType',val);
    },
    'formData.formEditable':function(val) {
      if (val === ''){ val = null} else {val = Number(val)}
      this.updateProperties({ 'formEditable': val })
      this.$emit('setFormBtnData', 'formEditable',val);
      this.changeFormModuleBtn()
    }
  },
  methods: {
    // 选择外置表单
    handleChangeForm(val){
      console.log(val)
      if(val.length>0){
        this.formDesignUrl=val[0].nodeFormPath
        this.formDesignDetailUrl=val[0].nodeFormEditPath
        this.nodeFormUpdatePathUrl=val[0].nodeFormUpdatePath
        this.nodeFormSavePathUrl=val[0].nodeFormSavePath
        this.externalFormVisible = false
      } else {
        this.$message.warn('请选择需要配置的表单！')
      }

    },
  finishConditionVisible(){
    this.conditionVisible = false
  },
  getFomatar(e){
    console.log(e,Boolean(e))
    return Boolean(e)
  },
  changeConditionType(e){
    let conditionExpression = this.nodeElement.businessObject.get('conditionExpression')
    // if(conditionExpression) delete this.nodeElement.businessObject.conditionExpression
    let val = e.target.value
    this.updateProperties({ 'conditionType': val })
    this.$emit('setFormBtnData', 'conditionType', val)
  },
  //按钮
  changeFormModuleBtn(){
    // console.log(11111111111111)
    let businessObject = this.nodeElement.businessObject
    let btnFormList = businessObject.btnGroup?JSON.parse(businessObject.btnGroup):[];
    let formBtnList = this.btnGroup.filter(obj => obj.id != businessObject.id)
    if(btnFormList.length===0){
      formBtnList.push({
      id: businessObject.id,
      modalKey: businessObject.$parent.id,
      nodeFormPath:businessObject.formDesignUrl,
      nodeFormEditPath: businessObject.formDesignDetailUrl,
      whetherUpdate: businessObject.formEditable,
      nodeFormUpdatePath:businessObject.nodeFormUpdatePathUrl,
      nodeFormSavePath:businessObject.nodeFormSavePathUrl,
      })
    } else {
      btnFormList.forEach(e=>{
      e.id = businessObject.id,
      e.modalKey = businessObject.$parent.id
      e.nodeFormPath = businessObject.formDesignUrl
      e.nodeFormEditPath = businessObject.formDesignDetailUrl
      e.whetherUpdate = businessObject.formEditable
      e.nodeFormUpdatePath = businessObject.nodeFormUpdatePathUrl
      e.nodeFormSavePath=businessObject.nodeFormSavePathUrl,
      formBtnList.push(e)
      })
    }
    this.updateProperties({
      btnGroup: JSON.stringify(formBtnList)
    });
    this.$emit('setFormBtnData', 'btnGroup',formBtnList)
  },
  // 信号定义
 finishSignal(data,type){
 	this.signalVisible = false
	if(type==='msg'){
		this.$emit('setFormBtnData', 'messageRefList',data);
	}else{
		this.$emit('setFormBtnData', 'signalRefList',data);
	}
 },
 showSignal(type){
this.refType = type
 	this.signalVisible = true
// if(this.$refs.signal) this.$refs.signal.getFormData()
 },
 // 信号
 changeSignalRef(e,type){
  let eventDefinitions = this.nodeElement.businessObject.get('eventDefinitions')
  if (!eventDefinitions) {
    if(type==='msg'){
		eventDefinitions = this.modeler.get('moddle').create('bpmn:SignalEventDefinition')
	}else{
		eventDefinitions = this.modeler.get('moddle').create('bpmn:MessageEventDefinition')
	}
  }
  eventDefinitions.forEach(item=>{
  	if(item.$type==='bpmn:SignalEventDefinition'||item.$type==='bpmn:MessageEventDefinition'){
		let refList ={}
		// let signalRef = this.modeler.get('moddle').create('bpmn:signal')
  		refList.id=e.id,
  		refList.name=e.name,
  		refList.scope=e.scope
		if(type==='msg'){
			refList.$type='bpmn:Message',
			item['messageRef'] = refList
		} else {
			refList.$type='bpmn:signal',
			item['signalRef'] = refList
		}
  	}
  })
  this.updateProperties({ eventDefinitions: eventDefinitions })
 },
 /* 条件属性配置*/
 conditionalType(e,type){
  let eventDefinitions = this.nodeElement.businessObject.get('eventDefinitions')
  if (!eventDefinitions) {
    eventDefinitions = this.modeler.get('moddle').create('bpmn:ConditionalEventDefinition')
  }
  eventDefinitions.forEach(item=>{
  	if(item.$type==='bpmn:ConditionalEventDefinition'){
  		if(type==='script') {
			item.condition.language= ''
			this.updateProperties({ conditionalScriptType: e })
			this.$emit('setFormBtnData', 'conditionalScriptType',e);
		} else {
			item.condition.body=''
			this.updateProperties({ conditionalExpressionType: e })
			this.$emit('setFormBtnData', 'conditionalExpressionType',e);
		}
  	}
  })
  this.updateProperties({ eventDefinitions: eventDefinitions })
 },
 /* 条件*/
 setConditionalValue(val,type){
  console.log(val,type)
  let eventDefinitions = this.nodeElement.businessObject.get('eventDefinitions')
  if (!eventDefinitions) {
    eventDefinitions = this.modeler.get('moddle').create('bpmn:ConditionalEventDefinition')
  }
  eventDefinitions.forEach(item=>{
  	if(item.$type==='bpmn:ConditionalEventDefinition'){
  		// item.condition['$type']= 'bpmn:FormalExpression'
		if(type==='script') {
			item.condition.language= val
			this.updateProperties({ conditionalScript: val })
			this.$emit('setFormBtnData', 'conditionalScript',val);
		} else {
			item.condition.body = val
			this.updateProperties({ conditionalExpression: val })
			this.$emit('setFormBtnData', 'conditionalExpression',val);
		}
			console.log(item.condition)
  	}
  })
  this.updateProperties({ eventDefinitions: eventDefinitions })
 },
 // 按钮配置
    openBtnPop(){
      this.btnPopups = true
      this.$refs.btnPopList.getBtnList(this.btnGroup)
    },
 // 按钮数据处理
    setBtnGroupItem(index,type) {
  let businessObject = this.nodeElement.businessObject
      if(type==='list'){
        this.btnGroup = []
        index.forEach(e=>{
          this.btnGroup.push({
            nodeButtonCode: e.buttonCode,
            nodeButtonName: e.buttonName,
	  id: businessObject.id,
	  modalKey: businessObject.$parent.id,
	  nodeFormPath: businessObject.formDesignUrl,
	  nodeFormEditPath: businessObject.formDesignDetailUrl,
	  nodeFormUpdatePath: businessObject.nodeFormUpdatePathUrl,
    nodeFormSavePath:businessObject.nodeFormSavePathUrl,
	  whetherUpdate: businessObject.formEditable
          })
        })
      }
      else if (index>=0) {
        this.btnGroup.splice(index, 1)
      } else {
        if(!this.btnGroup) this.btnGroup = []
        this.btnGroup.push({
          nodeButtonCode: '',
          nodeButtonName: '',
	id: businessObject.id,
	modalKey: businessObject.$parent.id,
	nodeFormPath: businessObject.formDesignUrl,
	nodeFormEditPath: businessObject.formDesignDetailUrl,
	nodeFormUpdatePath:businessObject.nodeFormUpdatePathUrl,
  nodeFormSavePath:businessObject.nodeFormSavePathUrl,
	whetherUpdate: businessObject.formEditable
        })
      }
      this.updateProperties({
        btnGroup: JSON.stringify(this.btnGroup)
      });
      this.$emit('setFormBtnData', 'btnGroup',this.btnGroup)
    },
    // 通知
    changeNotification(val){
			console.log(val)
      if (val === '') val = null
      this.updateProperties({ 'notification': val.toString() })
      this.$emit('setFormBtnData', 'notification',val.toString());
    },
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.nodeElement, properties);
    },
    updateId(name) {
      this.updateProperties({
        id: name
      });
    },
    updateName(name) {
      this.updateProperties({
        name: name
      });
    },
    updateDueDate(val) {
      this.updateProperties({
        dueDate: val
      });
      this.$emit('setFormBtnData', 'dueDate',val);
    },
    updatePriority(val) {
      this.updateProperties({
        priority: val
      });
      this.$emit('setFormBtnData', 'priority',val);
    },
    showMultiInstance(){
      this.multiInstanceVisible = true
      if(this.$refs.multiInstance) this.$refs.multiInstance.getFormData()
    },
    finishMultiInstance(){
      this.multiInstanceVisible = false
    },
 // 节点处理人类型
    changeUserType(e) {
      this.isUserPopup = false
      this.updateProperties({
        userType: e
      });
      this.$emit('modifyFormData', {userType:e});
      if (e === 'processInitiator') {
        this.addUser(e,0)
      }
    },
 // 更新节点
    updateSequenceFlow(val) {
      let newCondition = this.modeler.get("moddle").create('bpmn:FormalExpression', {
        body: val
      });
      this.updateProperties({
        conditionExpression: newCondition
      });
    },
    // 设置节点处理人
    setUser(properties){
      console.log(properties)
          this.updateProperties(properties);
          Object.assign(properties, {
            userType: Object.keys(properties)[0]
          });
          this.$emit('modifyFormData', properties);
    },
    // 设置节点处理人
    addUser(properties, type) {
        if(this.nodeElement.businessObject?.processInitiator) delete this.nodeElement.businessObject.processInitiator
        if(this.nodeElement.businessObject?.assignee) delete this.nodeElement.businessObject.assignee
        if(this.nodeElement.businessObject?.assigneeName) delete this.nodeElement.businessObject.assigneeName
        if(this.nodeElement.businessObject?.candidateUsers) delete this.nodeElement.businessObject.candidateUsers
        if(this.nodeElement.businessObject?.candidateUsersName) delete this.nodeElement.businessObject.candidateUsersName
        if(this.nodeElement.businessObject?.candidateGroups) delete this.nodeElement.businessObject.candidateGroups
        if(this.nodeElement.businessObject?.candidateGroupsName) delete this.nodeElement.businessObject.candidateGroupsName
      if (properties === 'processInitiator') {
        properties = {
          userType:'processInitiator',
          processInitiator:'${startUserNameId}',
          assignee: '${startUserNameId}',
        }
      } else {
        var ret = {
          1: {
              userType:'assignee',
              assignee: properties.userNameId,
              assigneeName: properties.userName
            },
          2: {
            userType:'candidateUsers',
            candidateUsers: properties.userNameId,
            candidateUsersName: properties.userName
          },
          3: {
            userType:'candidateGroups',
            candidateGroups: properties.uuid,
            candidateGroupsName: properties.userName
          },
          4:{
            userType:'department',
            candidateGroups: properties.value,
            candidateGroupsName: properties.text
          }
        };
        properties =  ret[type] ? ret[type] : '';
      }

      this.updateProperties(properties);
      console.log(properties)
      console.log()
      this.$emit('modifyFormData', properties);
    },
    showExecute(e) {
      this.visible = true
      this.$refs.execute.getData(e)
    },
 // 定时器
 changeTimer(e){
this.formData.timer = e
 	let eventDefinitions = this.nodeElement.businessObject.get('eventDefinitions')
 	eventDefinitions.forEach(item=>{
	if(item.$type==='bpmn:TimerEventDefinition'){
		delete item['timeDate']
		delete item['timeDuration']
		delete item['timeCycle']
		item[this.formData.timer] = this.modeler.get('moddle').create('bpmn:FormalExpression')
		item[this.formData.timer].$parent = item
	}
})
this.updateProperties({ eventDefinitions: eventDefinitions })
 },
 /* 定时器*/
 changeTimerValue(e){
this.formData.timerValue = e
let eventDefinitions = this.nodeElement.businessObject.get('eventDefinitions')
eventDefinitions.forEach(item=>{
	if(item.$type==='bpmn:TimerEventDefinition'){
		delete item['timeDate']
		delete item['timeDuration']
		delete item['timeCycle']
		item[this.formData.timer] = this.modeler.get('moddle').create('bpmn:FormalExpression')
		item[this.formData.timer].body=e
		item[this.formData.timer].$parent = item
	}
})
this.updateProperties({ eventDefinitions: eventDefinitions })
 },
 // 监听器
    addExecute(e,type) {
      if (e?.length) {
        let extensionElements = this.nodeElement.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        if(type===1){
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener')
        } else {
           extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener')
        }
        e.forEach(item => {
          let executionListener = ''
          if(type===1){
            executionListener = this.modeler.get('moddle').create('flowable:ExecutionListener')
          } else {
            executionListener = this.modeler.get('moddle').create('flowable:TaskListener')
          }
          executionListener['event'] = item.event
          executionListener[item.type] = item.className
          if (item.params && item.params.length) {
            item.params.forEach(field => {
              const fieldElement = this.modeler.get('moddle').create('flowable:Field')
              fieldElement['name'] = field.name
              fieldElement[field.type] = field.value
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: `<![CDATA[${field.value}]]>` })
              // fieldElement[field.type] = valueElement
              executionListener.get('fields').push(fieldElement)
            })
          }
          extensionElements.get('values').push(executionListener)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.nodeElement.businessObject[`extensionElements`]
        if (extensionElements) {
          if(type===1){
            extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener')
          } else {
             extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener')
          }
        }
      }
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    updateElement() {

    },
  }
}
</script>

<style lang="less" scoped="scoped">
.select-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  .select-line-icon {
    margin: 0 5px;
  }
}
// .bpmn-panel .ant-form-item-control{
// 		line-height: 40px !important;
// }
</style>
