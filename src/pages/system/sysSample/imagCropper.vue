<template>
  <a-card title="树形结构图片翻页查看" style="min-width: 800px;overflow-x:auto ">
    <a-row>
      <!-- 左侧文件树 -->
      <a-col :span="5">
        <a-tree
          showLine
          :treeData="treeData"
          :expandedKeys="[expandedKeys[0]]"
          :selectedKeys="selectedKeys"
          :style="{'height':'500px','border-right':'2px solid #c1c1c1','overflow-y':'auto'}"
          @expand="onExpand"
          @select="this.onSelect"
        >
        </a-tree>
      </a-col>
      <!--右侧缩略图-->
      <a-col :span="19">
        <a-row style="margin-top: 10px">
          <a-col :span="24" style="padding-left: 2%;margin-bottom: 10px">
            <a-button @click="prev" type="primary"><a-icon type="left" />上一页</a-button>
            <a-button @click="next" type="primary" style="margin-left: 8px">下一页<a-icon type="right" /></a-button>
            <span style="margin-left: 15%;font-weight: bolder">{{ navName }}</span>
          </a-col>
          <a-col :span="24" style="padding-left: 2%;">
            <img :src="imgUrl" preview>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'ImgTurnPage',
    components: {
      draggable
    },
    data() {
      return {
        description: '图片翻页',
        // 数据集
        treeData: [{
          id: 1,
          key: 1,
          isEdit: false, // 是否处于编辑状态
          isNewItem: false, // 该节点是否是新增节点
          title: "节点名字",
          depth: 1, // 该节点的层级
          scopedSlots: {
            title: "custom"
          }, // 自定义组件需要绑定
          children: [{
            id: 2,
            key: 2,
            isEdit: false, // 是否处于编辑状态
            isNewItem: false, // 该节点是否是新增节点
            title: "子节点名字",
            depth: 2, // 该节点的层级
            scopedSlots: {
              title: "custom"
            }
          }]
        }],
        selectedKeys: [],
        expandedKeys: [],
        sort: 0,
        imgUrl: '',
        navName: '',
        imgList: []
      }
    },
    created() {
      this.getImgList()
    },
    methods: {
      getImgList() {
        var count = 0
        for (var i = 0; i < this.treeData.length; i++) {
          for (var j = 0; j < this.treeData[i].children.length; j++) {
            this.imgList.push({
              key: this.treeData[i].children[j].key,
              pkey: this.treeData[i].key,
              sort: count++,
              imgUrl: this.treeData[i].children[j].imgUrl,
              navName: this.treeData[i].title + '/' + this.treeData[i].children[j].title
            })
          }
        }
        this.setValue(this.imgList[this.sort])
      },
      onSelect(selectedKeys, info) {
        for (var i = 0; i < this.imgList.length; i++) {
          if (this.imgList[i].key === selectedKeys[0]) {
            this.sort = this.imgList[i].sort
            this.setValue(this.imgList[i])
            break
          }
        }
      },
      onExpand(expandedKeys) {
        this.expandedKeys = []
        if (expandedKeys !== null && expandedKeys !== '') {
          this.expandedKeys[0] = expandedKeys[1]
        }
      },
      prev() {
        if (this.sort === 0) {
          this.sort = this.imgList.length - 1
        } else {
          this.sort = this.sort - 1
        }
        this.setValue(this.imgList[this.sort])
      },
      next() {
        if (this.sort === this.imgList.length - 1) {
          this.sort = 0
        } else {
          this.sort = this.sort + 1
        }
        this.setValue(this.imgList[this.sort])
      },
      // 设置受控节点值
      setValue(value) {
        this.selectedKeys = []
        this.imgUrl = value.imgUrl
        this.selectedKeys[0] = value.key
        this.expandedKeys[0] = value.pkey
        this.navName = value.navName
      }
    }
  }
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
