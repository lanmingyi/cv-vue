<template>
  <t-modal
    title="新增编辑"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item
          label="父级机构"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="type === '2'"
        >
          <tree-select
            v-decorator="[
              'pid',
              { initialValue: pid },
              { rules: [{ required: false, message: '必填' }] },
            ]"
            placeholder="请选择菜单"
            :parameter="parameter"
            :url="url"
            :data="treeData"
            idfield="id"
            textfield="text"
          />
        </a-form-item>
        <template v-else>
          <a-form-item class="hiddenItem">
            <a-input
              v-decorator="['pid', { initialValue: 1 }]"
              disabled
              type="hidden"
            />
          </a-form-item>
        </template>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'text',
              { rules: [{ required: true, min: 1, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'code',
              { rules: [{ required: true, min: 1, message: '必填' }] },
            ]"
          />
        </a-form-item>
				<a-form-item
				  label="负责人"
				  :labelCol="labelCol"
				  :wrapperCol="wrapperCol"
				>
				  <a-select
				    @change="principalChange"
				    v-decorator="[

				      'leaderId',
				      { rules: [{ required: false, min: 1, message: '必填' }] },
				    ]"
				  >
				    <a-select-option
				      v-for="(item, index) in principal"
				      :key="index"
				      :value="item.userNameId"
				    >
				      {{ item.userName }}({{ item.userNameId }})
            </a-select-option>
				  </a-select>
				</a-form-item>
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <TDictSelectTag
            placeholder="类型"
            dictCode="orgType"
            v-decorator="['orgType']"
          ></TDictSelectTag>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            id="inputNumber"
            style="width: 100%;"
            :min="1"
            :max="100"
            v-decorator="['sort']"
          />
        </a-form-item>
        <a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <icon-font-picker
            v-decorator="['iconCls', { initialValue: '' }]"
            @change="handleIconChoose"
          ></icon-font-picker>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            name="radioGroup"
            v-decorator="['status', { initialValue: '1' }]"
          >
            <a-radio value="1">
              启用
            </a-radio>
            <a-radio value="0">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="是否有子节点"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="['state', { initialValue: 'closed' }]"
          >
            <a-radio value="closed">
              是
            </a-radio>
            <a-radio value="open">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input
            v-decorator="['leader', { initialValue: leader }]"
            type="hidden"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input
            v-decorator="['levelId', { initialValue: levelId }]"
            type="hidden"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

// 表单字段
const fields = [
  "uuid",
  "orgType",
  "leaderId",
  "leader",
  "code",
  "id",
  "remark",
  "pid",
  "levelId",
  "state",
  "text",
  "status",
  "sort",
  "iconCls",
];
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
import TreeSelect from "@/components/TopVUI/custom/TreeSelect";
import iconFontPicker from "@/components/TopVUI/font/iconFontPicker";

export default {
  props: {
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
    type: {
      type: String,
    },
  },
  components: {
    TDictSelectTag,
    TreeSelect,
    iconFontPicker,
  },
  data() {
    return {
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
      form: this.$form.createForm(this),
      leader: "",
      principalIndex: "",
      treeData: [],
      levelId: 1,
      pid: 1,
      principal: [],
      url: {
        fathersUrl: "/mdata/organization/getListByLevelId",
        expandUrl: "/mdata/organization/getListByPid",
        getListByKeywords: "/mdata/user/getListByKeywords",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
    };
  },
  methods: {
    // 负责人
    getPrincipal() {
      this.$post(this.url.getListByKeywords).then((res) => {
        this.principal = res;
      });
    },
    add(m, data) {
      this.getPrincipal();
      this.treeData = data ? data : [];
      this.pid = m ? m.id : "";
    },
    edit(m, data) {
      this.getPrincipal();
      // this.form.setFieldsValue(pick(m, fields));
      this.treeData = data;
      this.pid = m.pid;
    },
    // 负责人改变事件
    principalChange(value) {
      this.principal.forEach((e) => {
        if (e.userNameId == value) {
          this.leader = e.userName;
        }
      });
      this.form.setFieldsValue({
        leader: this.leader,
      });
    },
    // 图标选择事件
    handleIconChoose(value) {
      this.form.setFieldsValue({
        iconCls: value,
      });
    },
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));

    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
};
</script>
