<!--
 * @Description: 人员节点表单
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 09:26:07
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <a-card class="l-card" title="批量全选">
      <div slot="extra" href="#">
        <a slot="actions">
          <a-checkbox
            v-model="allLook"
            @change="
              (e) => {
                onChangeEditAll(e.target.checked, 0);
              }
            "
          >
            可查看
          </a-checkbox></a
        >
        <a-divider type="vertical" />
        <a slot="actions">
          <a-checkbox
            v-model="allEdit"
            :disabled="!allDisabled"
            @change="
              (e) => {
                onChangeEditAll(e.target.checked, 1);
              }
            "
          >
            可编辑
          </a-checkbox></a
        >
      </div>
      <a-list class="demo-loadmore-list" :data-source="formFieldList">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a slot="actions">
            <a-checkbox v-model="item.isLook" @change="onChangeEdit(item, 0)">
              可查看
            </a-checkbox></a
          >
          <a slot="actions">
            <a-checkbox
              v-model="item.isEdit"
              :disabled="!item.isLook"
              @change="onChangeEdit(item, 1)"
            >
              可编辑
            </a-checkbox></a
          >
          <div class="margin-left-sm" style="height: 20px;overflow: hidden;">
            <a-tooltip effect="dark" :title="item.filedName" placement="bottom">
              <ellipsis :length="8">{{ item.filedName }}</ellipsis>
            </a-tooltip>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from "@/components";
export default {
  data() {
    return {
      formFieldList: [],
      allLook: false,
      allEdit: false,
      allDisabled: false,
    };
  },
  components: { Ellipsis },
  props: {
    nodeElement: {
      type: Object,
      required: true,
    },
    modeler: {
      type: Object,
      required: true,
    },
    formFieldLists: {
      type: Array,
    },
    updateList: {
      type: Array,
    },
  },
  mounted() {
    console.log(this.formData);
  },
  watch: {
    //   监听节点变化，获取表单配置
    nodeElement: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal.type == "bpmn:UserTask") {
          const bpmnModeler = this.modeler;
          const modeling = bpmnModeler.get("modeling");
          const businessObject = newVal.businessObject;
          let updateList = [];
          // 更新 表单数据
          if (this.updateList.length != 0 && businessObject.formFieldList) {
            JSON.parse(businessObject.formFieldList.replace(/'/g, '"')).forEach(
              (e) => {
                this.updateList.forEach((m) => {
                  if (e.filed === m.filed) {
                    e.filedName = m.filedName;
                    updateList.push(e);
                  }
                });
              }
            );
            this.formFieldList = updateList;
            this.updateProperties({
              formFieldList: JSON.stringify(updateList),
            });
            this.getStatus(updateList);
          } else {
            if (businessObject.formFieldList) {
              this.formFieldList = JSON.parse(
                businessObject.formFieldList.replace(/'/g, '"')
              );
              this.formFieldLists.forEach((e) => {
                let index = (
                  JSON.parse(businessObject.formFieldList.replace(/'/g, '"')) ||
                  []
                ).findIndex((profile) => profile.filed === e.filed);
                if (index === -1) {
                  this.formFieldList.push(e);
                }
              });
            } else {
              this.formFieldList = this.formFieldLists;
            }
            this.getStatus(this.formFieldList);
          }
        }
        console.log(this.formFieldList);
      },
    },
    // 表单数据发生变化是，更新表单属性
    updateList(val) {
      if (val.length != 0) {
        let obj = this.nodeElement.businessObject;
        let updateList = [];
        if (obj.formFieldList) {
          JSON.parse(obj.formFieldList.replace(/'/g, '"')).forEach((e) => {
            this.updateList.forEach((m) => {
              if (e.filed === m.filed) {
                e.filedName = m.filedName;
                updateList.push(e);
              }
            });
          });
          this.formFieldList = updateList;
          this.updateProperties({
            formFieldList: JSON.stringify(updateList),
          });
        } else {
          this.formFieldList = val;
        }
        this.getStatus(this.formFieldList);
      }
    },
    // 表单字段
    formFieldLists(val) {
      console.log(val);
      if (val.length != 0) {
        // this.formFieldList = val
        let obj = this.nodeElement.businessObject;
        if (obj.formFieldList) {
          this.formFieldList = JSON.parse(obj.formFieldList.replace(/'/g, '"'));
          val.forEach((e) => {
            let index = (
              JSON.parse(obj.formFieldList.replace(/'/g, '"')) || []
            ).findIndex((profile) => profile.filed === e.filed);
            console.log(index);
            if (index === -1) {
              this.formFieldList.push(e);
            }
          });
          this.updateProperties({
            formFieldList: JSON.stringify(this.formFieldList),
          });
        } else {
          this.formFieldList = val;
        }
        this.getStatus(this.formFieldList);
      }
    },
  },
  methods: {
    // 获取编辑、查看
    getStatus(list) {
      // console.log(list)
      const flagLook = list.some((item) => {
        return item.isLook === false;
      });
      const flagEdit = list.some((item) => {
        return item.isEdit === false;
      });
      if (flagLook) {
        this.allLook = false;
        this.allDisabled = false;
      } else {
        this.allLook = true;
        this.allDisabled = true;
      }
      if (flagEdit) {
        this.allEdit = false;
      } else {
        this.allEdit = true;
      }
    },
    // 全选
    onChangeEditAll(data, type) {
      this.formFieldList.forEach((e) => {
        if (data && type === 0)
          (e.isLook = true), this.getStatus(this.formFieldList);
        if (data && type === 1) e.isEdit = true;
        if (!data && type === 0)
          (e.isLook = false),
            (e.isEdit = false),
            this.getStatus(this.formFieldList);
        if (!data && type === 1) e.isEdit = false;
      });
      this.updateProperties({
        formFieldList: JSON.stringify(this.formFieldList),
      });
    },
    // 编辑查看设置
    onChangeEdit(data, type) {
      if (type === 1 && data.isEdit) {
        data.isLook = true;
      }
      let formFieldList = this.formFieldList;
      this.updateProperties({
        formFieldList: JSON.stringify(formFieldList),
      });
      this.getStatus(formFieldList);
    },
    // 更新流程属性
    updateProperties(properties) {
      this.modeler
        .get("modeling")
        .updateProperties(this.nodeElement, properties);
    },
  },
};
</script>

<style>
.l-card {
  margin-top: 20px !important;
}
.l-card .ant-card-head {
  padding: 0 18px !important;
}
</style>
