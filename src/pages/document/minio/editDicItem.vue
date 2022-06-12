<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-08-10 14:54:20
 * @LastEditTime: 2021-08-19 11:03:43
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\document\minio\editDicItem.vue
-->
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
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" disabled type="hidden" />
        </a-form-item>
        <a-form-item
          label="存储空间"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['bucket']" disabled />
        </a-form-item>
        <a-form-item
          label="文件名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['objectName']" disabled />
        </a-form-item>
        <a-form-item
          label="有效期(天)"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-number
            :max="7"
            :min="1"
            placeholder="有效期最大为七天"
            v-decorator="[
              'days',
              {
                rules: [
                  {
                    required: true,
                    message: '必填！',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="URL"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="value"
        >
          <a-input v-model="value" disabled>
            <a-icon
              slot="addonAfter"
              type="copy"
              @click="handleCopy()"
              data-clipboard-action="copy"
              :class="['copy-btn']"
              :data-clipboard-text="value"
            />
          </a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
// 剪切板组件
import Clipboard from "clipboard";
import pick from "lodash.pick";
// 表单字段
const fields = ["uuid", "bucket", "objectName", "days"];

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
      value: "",
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    handleCopy() {
      // 复制数据
      let clipboard = new Clipboard(".copy-btn");
      clipboard.on("success", () => {
        this.$message.success("复制成功");
        this.$emit("cancel");
      });
      clipboard.on("error", () => {
        this.$message.error("复制失败");
      });
      setTimeout(() => {
        // 销毁实例
        clipboard.destroy();
      }, 122);
    },
  },
};
</script>
