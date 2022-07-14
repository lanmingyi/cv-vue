<!--
 * @Description: 卡片头部
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-08-19 18:33:40
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <div
      class="flex justify-end align-center"
      v-if="~['date', 'combbox', 'text'].indexOf(formType)"
      style="width:300px"
    >
      <!-- <span style="margin-right:8px">{{ formOptions.name }}</span> -->
      <t-date
        v-model="selectValue"
        :type="formOptions.dateType"
        :dateFormat="formOptions.format"
        v-if="formType === 'date'"
        style="width: 65%;"
        :placeholder="'请输入' + formOptions.name"
        :showTime="formOptions.showTime"
      ></t-date>
      <template v-else-if="formType === 'combbox'">
        <a-select
          v-model="selectValue"
          style="width: 80%;"
          v-if="formOptions.dynamic === 'static'"
          :placeholder="'请输入' + formOptions.name"
          @change="
            (event) => {
              changeType(event);
            }
          "
        >
          <a-select-option
            v-for="(item, index) in formOptions.staticList"
            :key="index"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
        <a-select
          v-model="selectValue"
          style="width: 80%;"
          v-else-if="formOptions.dynamic === 'dynamic'"
          :placeholder="'请输入' + formOptions.name"
          @change="
            (event) => {
              changeType(event);
            }
          "
        >
          <a-select-option
            v-for="(item, index) in selectList"
            :key="index"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
        <t-dict-select-tag
          style="width: 80%;"
          v-else
          v-model="selectValue"
          :dictCode="formOptions.code"
          :placeholder="'请输入' + formOptions.name"
        ></t-dict-select-tag>
      </template>
      <template v-else-if="~['text'].indexOf(formType)">
        <a-input
          style="width: 80%;"
          v-model="currentType"
          allowClear
          @change="
            (event) => {
              changeType(event.target.value);
            }
          "
          :placeholder="'请输入' + formOptions.name"
        ></a-input>
      </template>
    </div>
    <!-- <template v-if="~['tab'].indexOf(formType)">
			<div class="sale-title flex">
				<slot name="title"></slot>
				<div class="sale-time">
					<span
						v-for="item in formOptions.tabList"
						class="time-item pointer"
						:key="item.value"
						:class="{ activeTime: currentType === item.value }"
						@click="changeType(item.value)"
					>
						{{ item.label }}
					</span>
				</div>
			</div>
		</template> -->
    <template v-else-if="~['radioButton'].indexOf(formType)">
      <a-radio-group
        v-model="currentType"
        :buttonStyle="formOptions.radioStyle"
        @change="
          (event) => {
            changeType(event.target.value);
          }
        "
      >
        <a-radio-button
          :value="item.value"
          v-for="(item, index) in formOptions.tabList"
          :key="index"
        >
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </template>
  </div>
</template>

<script>
import { getObjectByString } from "@/utils/util";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
export default {
  name: "saleTitle",
  props: { formType: { type: String }, formOptions: { type: Object } },
  components: { TDictSelectTag },
  data() {
    return {
      currentType: "",
      selectValue: "",
      selectList: [],
    };
  },
  created() {},
  watch: {
    formType: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal === "tab" || newVal === "radioButton")
          this.currentType = this.formOptions.tabList[0].value;
      },
    },
  },
  mounted() {
    if (this.formOptions.dynamic === "dynamic") {
      let params = getObjectByString(this.formOptions.params, ",", ":");
      this.$axios(this.formOptions.method, this.formOptions.url, params).then(
        (res) => {
          this.selectList = res;
        }
      );
    }
  },
  methods: {
    changeType(type) {
      this.currentType = type;
      this.$emit("sendCurrent", this.currentType);
    },
  },
};
</script>
<style lang="scss" scoped>
.sale-title {
  height: 41px;
  text-align: center;
  line-height: 41px;
  box-sizing: border-box;
  font-size: 1.1rem;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .sale-time {
    height: 100%;
    .time-item {
      color: #757575;
      font-size: 1rem;
      width: 60px;
      height: 100%;
      display: inline-block;
      background: #fff;
      text-align: center;
      &.activeTime {
        background: #1890ff;
        border-radius: 4px;
        box-sizing: border-box;
        color: #fff;
        box-shadow: -1px 5px 15px #abc3f2;
        &:hover {
          background: #1890ff;
        }
      }
      &:hover {
        background: rgba(0, 0, 0, 0.025);
        transition: all 0.3s, padding 0s;
      }
    }
  }
}
</style>
