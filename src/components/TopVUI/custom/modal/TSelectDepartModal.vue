<template>
  <t-modal
    title="选择组织机构"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    switchFullscreen
    cancelText="取消"
  >
    <a-spin tip="Loading..." :spinning="false">
      <!-- <a-input-search style="margin-bottom: 1px" placeholder="请输入部门名称按回车进行搜索" @search="onSearch" /> -->
      <a-tree
        v-if="treeData.length"
        checkable
        :multiple="multi"
        :tree-data="treeData"
        @check="onCheck"
        @select="onSelect"
        :expandedKeys.sync="defaultExpandedRowKeys"
        :checkedKeys="checkedKeys"
      >
        <template slot="title" slot-scope="{ title }">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </a-spin>
  </t-modal>
</template>

<script>
import { getFilter } from "@/utils/TopVUI";
export default {
  name: "JSelectDepartModal",
  props: ["modalWidth", "multi", "rootOpened", "departId"],
  data() {
    return {
      visible: false,
      confirmLoading: false,
      treeData: [],
      autoExpandParent: true,
      expandedKeys: [],
      dataList: [],
      checkedKeys: [],
      checkedRows: [],
      searchValue: "",
      defaultExpandedRowKeys: [],
    };
  },
  created() {
    this.loadDepart();
  },
  watch: {
    departId: {
      immediate: true,
      handler() {
        this.initDepartComponent();
      },
    },
  },
  methods: {
    show() {
      this.visible = true;
      this.checkedRows = [];
      this.checkedKeys = [];
    },
    // 加载组织机构数据
    loadDepart() {
      let that = this;
      that.$post("/mdata/organization/getOrgList").then((res) => {
        if (res) {
          let subData = [];
          let child = [];
          res.forEach((e) => {
            if (e.pid == 1 && e.id != 1) {
              e.key = e.id;
              e.children = e.state === "closed" ? [] : "";
              subData.push(e);
              that.defaultExpandedRowKeys.push(e.id);
            } else {
              child.push(e);
            }
          });
          that.treeData = this.getFilter(subData, child);
        }
      });
    },
    // 根据组织机构ID获取机构名
    initDepartComponent() {
      let names = "";
      if (this.departId) {
        this.checkedKeys = this.departId.split(",").map(Number);
        this.$post("/mdata/organization/getOrgList").then((res) => {
          for (let item of res) {
            if (this.checkedKeys.indexOf(item.id) != -1) {
              names += "," + item.title;
            }
          }
          if (names) {
            names = names.substring(1);
          }
          this.$emit("initComp", names);
        });
      } else {
        this.checkedKeys = [];
        this.$emit("initComp", "");
      }
    },
    // 过滤
    getFilter(sourceData, children) {
      let arr = [];
      if (sourceData) {
        sourceData.forEach((e, index) => {
          children.forEach((c, index) => {
            if (e.id == c.pid) {
              c.key = c.id;
              c.children = c.state === "closed" ? [] : "";
              if (e.children) e.children.push(c);
            } else {
              c.key = c.id;
            }
          });
          if (e.children) {
            // 子级有数据的时候 循环添加数据
            getFilter(e.children, children);
          }
        });
        arr = sourceData;
      }
      return arr;
    },
    reWriterWithSlot(arr) {
      for (let item of arr) {
        if (item.children && item.children.length > 0) {
          this.reWriterWithSlot(item.children);
          let temp = Object.assign({}, item);
          temp.children = {};
          this.dataList.push(temp);
        } else {
          this.dataList.push(item);
          item.scopedSlots = { title: "title" };
        }
      }
    },
    initExpandedKeys(arr) {
      if (arr && arr.length > 0) {
        let keys = [];
        for (let item of arr) {
          if (item.children && item.children.length > 0) {
            keys.push(item.id);
          }
        }
        this.expandedKeys = [...keys];
      } else {
        this.expandedKeys = [];
      }
    },
    onCheck(checkedKeys, info) {
      if (!this.multi) {
        let arr = checkedKeys.checked.filter(
          (item) => this.defaultCheckedKeys.indexOf(item) < 0
        );
        this.checkedKeys = [...arr];
        this.checkedRows =
          this.checkedKeys.length === 0 ? [] : [info.node.dataRef];
      } else {
        this.checkedKeys = checkedKeys;
        this.checkedRows = this.getCheckedRows(this.checkedKeys);
      }
    },
    // 选择事件
    onSelect(selectedKeys, info) {
      let keys = [];
      keys.push(selectedKeys[0]);
      if (!this.checkedKeys || this.checkedKeys.length === 0 || !this.multi) {
        this.checkedKeys = [...keys];
        this.checkedRows = [info.node.dataRef];
      } else {
        let currKey = info.node.dataRef.key;
        if (this.checkedKeys.indexOf(currKey) >= 0) {
          this.checkedKeys = this.checkedKeys.filter(
            (item) => item !== currKey
          );
        } else {
          this.checkedKeys.push(...keys);
        }
      }
      this.checkedRows = this.getCheckedRows(this.checkedKeys);
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 提交
    handleSubmit() {
      if (!this.checkedKeys || this.checkedKeys.length == 0) {
        this.$emit("ok", "");
      } else {
        this.$emit("ok", this.checkedRows, this.checkedKeys.join(","));
      }
      this.handleClear();
    },
    handleCancel() {
      this.handleClear();
    },
    handleClear() {
      this.visible = false;
      this.checkedKeys = [];
    },
    getParentKey(currKey, treeData) {
      let parentKey;
      for (let i = 0; i < treeData.length; i++) {
        const node = treeData[i];
        if (node.children) {
          if (node.children.some((item) => item.key === currKey)) {
            parentKey = node.key;
          } else if (this.getParentKey(currKey, node.children)) {
            parentKey = this.getParentKey(currKey, node.children);
          }
        }
      }
      return parentKey;
    },
    // 查询
    onSearch(value) {
      const expandedKeys = this.dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    },
    // 根据 checkedKeys 获取 rows
    getCheckedRows(checkedKeys) {
      const forChildren = (list, key) => {
        for (let item of list) {
          if (item.id === key) {
            return item;
          }
          if (item.children instanceof Array) {
            let value = forChildren(item.children, key);
            if (value != null) {
              return value;
            }
          }
        }
        return null;
      };

      let rows = [];
      for (let key of checkedKeys) {
        let row = forChildren(this.treeData, key);
        if (row != null) {
          rows.push(row);
        }
      }
      return rows;
    },
  },
};
</script>

<style scoped></style>
