<!--
 * @Description: 树形
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-09-09 13:50:54
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-tree
    v-if="data.length"
    :load-data="onLoadData"
    :tree-data="data"
    @select="selectTree"
    default-expand-all
    :show-icon="showIcon"
  >
    <template slot="title" slot-scope="{ title, iconCls }">
      <span>
        <icon-fonts
          :icon="'icon-' + iconCls"
          type="small"
          v-if="iconCls"
          style="margin-right:5px"
        ></icon-fonts
        >{{ title }}</span
      >
    </template>
    <template :slot="slot" v-for="slot in slots">
      <slot :name="slot"></slot>
    </template>
  </a-tree>
</template>

<script>
export default {
  name: "ZTree",
  props: {
    url: Object,
    parameter: Object,
    showIcon: Boolean,
  },
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.getListByLevelId();
  },
  computed: {
    slots() {
      return Object.keys(this.$slots).filter((slot) => slot !== "title");
    },
  },
  methods: {
    getListData() {
      return this.data;
    },
    // 获取父级
    getListByLevelId() {
      const that = this;
      that.$post(that.url.fathersUrl, that.parameter.father).then((res) => {
        const arr = [];
        res.forEach(function(item, index) {
          item.title = item.text;
          item.label = item.text;
          item.index = index;
          item.key = item.id;
          item.levelId = item.levelId;
          item.slots = { icon: "meh" };
					if(item.state === "open"){
						item.isLeaf = true
					}
          arr.push({
            ...item,
            children: item.state === "closed" ? [] : "",
          });
        });
        that.data = arr;
      });
    },
    // 加载树形子级数据
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        // 判断是否有子级
        let parameter = this.parameter.children;
        parameter.pid = treeNode.dataRef.id;
        this.$post(this.url.expandUrl, parameter)
          .then((res) => {
            const data = res;
            data.forEach((e, index) => {
              data[index].title = e.text;
              data[index].index = index;
              data[index].key = e.id;
              data[index].levelId = e.levelId;
							if(e.state === "open"){
								data[index].isLeaf = true
							}
            });
						treeNode.dataRef.children = data;
            this.data = [...this.data];
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    selectTree(value, node, extra) {
      let tree = node.node.dataRef;
      this.$emit("rowClick", tree, value, extra);
    },
  },
};
</script>

<style></style>
