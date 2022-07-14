<!--
 * @Description: 树形
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-05 16:55:27
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-tree :treeData="data" show-line>
    <!-- <span slot="switcherIcon" class="icon-plus"><a-icon type="edit" /></span> -->
    <template slot="custom" slot-scope="item">
      <!-- 如果是新节点 -->
      <span v-if="item.isNewItem">
        <a-input
          type="text"
          class="editInput"
          v-model="item.name"
          @change="
            (e) => {
              onDefaultValueInput(e.target, item);
            }
          "
        />
        <span class="tree-cancle_icon edit-require_icon">
          <a-icon type="delete" class="margin-left-sm" @click="remove(item)" />
        </span>
        <span class="tree-save_icon edit-require_icon">
          <a-icon
            type="check-circle"
            class="margin-left-sm"
            @click="addTreeData(item)"
          />
        </span>
      </span>
      <div v-else>
        <!-- 编辑时展示输入框 -->
        <div v-if="item.isEdit">
          <a-input
            type="text"
            v-model="item.label"
            class="editInput"
            @change="
              (e) => {
                onDefaultValueInput(e.target, item);
              }
            "
          />
          <span class="tree-cancle_icon edit-require_icon">
            <a-icon
              type="close-circle"
              class="margin-left-sm"
              @click="cancleTreeData(item)"
            />
          </span>
          <span class="tree-save_icon edit-require_icon">
            <a-icon
              type="check-circle"
              class="margin-left-sm"
              @click="cancleTreeData(item)"
            />
          </span>
        </div>
        <!-- 否则展示原来的节点信息 -->
        <div v-else>
          <span class="node-title">{{ item.label }} </span>
          <span class="icon-wrap">
            <a-icon type="delete" class="margin-left-sm" @click="del(item)" />
          </span>
          <span class="icon-wrap">
            <a-icon type="edit" class="margin-left-sm" @click="edit(item)" />
          </span>
          <span class="icon-wrap">
            <a-icon type="plus" class="margin-left-sm" @click="add(item)" />
          </span>
        </div>
      </div>
    </template>
  </a-tree>
</template>

<script>
export default {
  name: "ImgTurnPage",
  data() {
    return {
      // 数据集
      // treeData: [{
      //   id: 1,
      //   key: 1,
      //   isEdit: false, // 是否处于编辑状态
      //   isNewItem: false, // 该节点是否是新增节点
      //   title: "节点名字",
      //   depth: 1, // 该节点的层级
      //   scopedSlots: {
      //     title: "custom"
      //   }, // 自定义组件需要绑定
      //   children: [{
      //     id: 2,
      //     key: 2,
      //     isEdit: false, // 是否处于编辑状态
      //     isNewItem: false, // 该节点是否是新增节点
      //     title: "子节点名字",
      //     depth: 2, // 该节点的层级
      //     scopedSlots: {
      //       title: "custom"
      //     }
      //   }]
      // }]
      data: [],
    };
  },
  props: {
    treeData: Array,
  },
  created() {},
  mounted() {
    this.data = this.treeData;
  },
  watch: {
    treeData(val) {
      console.log(val);
    },
  },
  methods: {
    add(item) {
      // item为点击添加按钮时的节点
      let newItem = {
        id: Math.ceil(Math.random() * 10000), // 避免和已有的id冲突
        key: Math.ceil(Math.random() * 10000), // 避免和已有的key冲突
        isEdit: false,
        name: "",
        isNewItem: true,
        label: "",
        depth: item.depth + 1, // 如果需要添加顶级节点，值为0
        scopedSlots: {
          label: "custom",
        },
        children: [],
      };
      // index 是点击节点的位置
      if (!item.children) item.children = [];
      item.children.push(newItem);
      this.$emit("change", item);
    },
    onDefaultValueInput(e, item) {
      item.dataRef.name = e.value;
      item.dataRef.label = e.value;
    },
    // 递归查找
    searchOption(option, arr, type = "delect") {
      console.log(option, arr);
      for (let s = 0; s < arr.length; s++) {
        console.log(arr[s].key, option.key);
        if (arr[s].key === option.key) {
          if (type === "delect") {
            arr.splice(s, 1);
          } else {
            //这是模拟数据编辑数据
            this.$set(arr, s, {
              label: "12121212",
              key: "12121212",
              scopedSlots: {
                label: "custom",
              },
            });
          }
          this.$emit("change", arr);
          break;
        } else if (arr[s].children && arr[s].children.length > 0) {
          // 递归条件
          this.searchOption(option, arr[s].children);
        } else {
          continue;
        }
      }
    },
    addTreeData(item) {
      item.dataRef.isNewItem = false;
    },
    edit(item) {
      item.dataRef.isEdit = true;
    },
    remove(node, data) {
      this.searchOption(node, this.data);
    },
    del(data) {
      this.searchOption(data, this.data);
    },
    cancleTreeData(data) {
      data.dataRef.isEdit = false;
    },
  },
};
</script>

<style scoped>
/* /deep/ .ant-tree-switcher.ant-tree-switcher_open {
  .icon-plus {
    background-image: url("~@/assets/minus.png"); 
  }
}
/deep/ .ant-tree-switcher.ant-tree-switcher_close {
  .icon-plus {
    background-image: url("~@/assets/plus.png"); 
  }
} */
</style>
