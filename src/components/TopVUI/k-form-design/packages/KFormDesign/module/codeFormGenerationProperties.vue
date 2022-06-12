<template>
  <div class="properties-centent kk-checkbox">
		<!-- <a-divider orientation="center">
			列表布局
		</a-divider> -->
    <div class="properties-body" v-if="selectItem">
      <a-divider orientation="center">	
      	分页设置
      </a-divider>
      <a-form-item label="列表分页">
        <a-switch v-model="selectItem.showPage" />
      </a-form-item>
      <a-form-item label="分页条数" v-if="selectItem.showPage">
        <a-radio-group v-model="selectItem.showPageSize" button-style="solid">
      		<a-radio-button :value="10">
      			10条
      		</a-radio-button>
      		<a-radio-button :value="20">
      			20条
      		</a-radio-button>	
					<a-radio-button :value="30">
						30条
					</a-radio-button>
      		<a-radio-button :value="40">
      			40条
      		</a-radio-button>
      	</a-radio-group>
      </a-form-item>
      <a-divider orientation="center">
      	按钮配置
      </a-divider>
      <a-form-item label="顶部按钮">
      	是否使用顶部按钮：<a-switch v-model="selectItem.showtopButton" />
      </a-form-item>
      <a-form-item v-if="selectItem.showtopButton">
      	<div class="flex align-center justify-between" v-for="(item,index) in selectItem.topButtonList" :key="index">
      		<a-checkbox :checked="item.checked" :disabled="item.disabled" @change="changeCheck(item)">{{item.label}}</a-checkbox>	
      		<a-input style="width: 200px;" v-model="item.name" :disabled="item.disabled"/>
      	</div>
      </a-form-item>
      <a-form-item label="行内按钮">
        是否使用行内按钮：<a-switch v-model="selectItem.showlineButton" />
      </a-form-item>
      <a-form-item v-if="selectItem.showlineButton">
        <div class="flex align-center justify-between" v-for="(item,index) in selectItem.lineButtonList" :key="index">
        	<a-checkbox :checked="item.checked" :disabled="item.disabled" @change="changeCheck(item)">{{item.label}}</a-checkbox>	
        	<a-input style="width: 200px;" v-model="item.name" :disabled="item.disabled"/>
        </div>
      </a-form-item>
    </div>
<!--    <div class="close-box" @click="$emit('handleHide')">
      <a-icon type="double-right" />
    </div> -->
  </div>
</template>
<script>
/*
 * author 黄婷
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
			columnNameArr: [],
    };
  },
  watch: {
    selectItem : {
			deep: true,
			immediate: true,
			handler(newVal, oldVal) {
				console.log("val",newVal)
			}
    },
  },
  props: {
    selectItem: {
      type: Object,
      required: true,
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
  methods: {
		changeCheck(item){
			item.checked = !item.checked
		},
		handleChange(e,record,key){
			record[key] = e
			this.$emit('change',e,key)
		},
		// 表格字段选择判断
		fieldChange(e) {
			let count = 0
			this.formData.find(item => {
				if (item.options.name === e) {
					count++
				}
			})
			if (count > 1) {
				this.options.name = ''
				this.$message.info('字段名已被选择', 1.5);
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
