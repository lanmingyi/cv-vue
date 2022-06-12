<template>
  <t-modal
    title="任务详情"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
	@ok="() => { $emit('cancel') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-card :bordered="false">
      <table border="1">
        <tr>
          <th colspan="4" style="text-align: center;background-color: #f2f2f2;">
            {{model.title}}
          </th>
        </tr>
        <tr>
          <th>指派人：</th>
          <th> {{model.assigner}} </th>
          <th>任务类型：</th>
          <th> {{model.taskTypeText}} </th>
        </tr>
        <tr>
          <th>任务状态：</th>
          <th> {{model.status == '0' ? '未开始' : (model.status == '1' ? '已接受' : '已完成')}} </th>
          <th>优先级：</th>
          <th> {{model.priority == '1' ? '一级' : (model.priority == '2' ? '二级' : '三级')}} </th>
        </tr>
        <tr>
          <th>计划开始时间：</th>
          <th> {{model.planStartTime}} </th>
          <th>计划结束时间：</th>
          <th> {{model.planEndTime}} </th>
        </tr>
        <tr>
          <th>实际开始时间：</th>
          <th> {{model.actualStartTime}} </th>
          <th>实际结束时间：</th>
          <th> {{model.actualEndTime}} </th>
        </tr>
        <tr>
          <th>创建人：</th>
          <th> {{model.creator}} </th>
          <th>创建时间：</th>
          <th> {{model.createTime}} </th>
        </tr>
        <tr>
          <th>排序：</th>
          <th colspan="3">
            {{model.sort}}
          </th>
        </tr>
        <tr>
          <th>任务内容：</th>
          <th colspan="3">
            {{model.content}}
          </th>
        </tr>
      </table>
    </a-card>
  </t-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
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
  data () {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>
<style scoped="scoped">
  table tr th{
	min-width: 120px;
    min-height: 20px;
    padding: 10px;
    font-size: 14px;
    line-height: 20px;
    border-color: #e6e6e6;
  }
  table{
    width: 100%;
    border-color: #e6e6e6;
  }
</style>
