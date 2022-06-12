<!--
 * @Description: 节点人员设置
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:33:40
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\modal\userModal.vue
-->
<template>
  <t-modal
    title="节点人员设置"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-table :columns="columns" :dataSource="data" :pagination="false" bordered>
      <template
        v-for="col in ['type', 'name']"
        :slot="col"
        slot-scope="text, record"
      >
        <div v-if="col === 'name'" :key="col">
          <div v-if="record.editable">
            <!-- 流程发起人 -->
            <a-input
              :key="col"
              v-if="record.type === 'processInitiator'"
              style="margin: -5px 0"
              value="${startUserNameId}"
              readOnly
              @change="(e) => handleChange(e.target.value, record.key, col)"
            />
            <!-- 指定人员、候选人员 -->
            <template
              v-else-if="
                record.type === 'assignee' || record.type === 'candidateUsers'
              "
            >
              <a-input
                key="1"
                :value="text"
                placeholder="请选择"
                @change="(e) => handleChange(e.target.value, record.key)"
              >
                <a-icon
                  slot="addonAfter"
                  type="user"
                  @click="() => (assigneeVisible = true)"
                />
              </a-input>
              <user-popup
                :visible="assigneeVisible"
                style="width: 100%;"
                :typeForm="true"
                :typeNum="record.type === 'assignee' ? 1 : 2"
                @change="
                  (value) => setUser(value, record.key, col, record.type)
                "
                @close="() => (assigneeVisible = false)"
              />
            </template>
            <!-- 指定角色 -->
            <template v-else-if="record.type === 'candidateGroups'">
              <a-input
                key="3"
                :value="text"
                placeholder="请选择"
                @change="(e) => handleChange(e.target.value, record.key, col)"
              >
                <a-icon
                  slot="addonAfter"
                  type="user"
                  @click="() => (candidateVisible = true)"
                />
              </a-input>
              <role-popup
                :userList="text"
                :visible="candidateVisible"
                style="width: 100%;"
                :typeNum="2"
                @change="
                  (value) => setUser(value, record.key, col, record.type)
                "
                @close="() => (candidateVisible = false)"
              />
            </template>
            <template v-else-if="record.type === 'department'">
              <a-input
                key="3"
                :value="text"
                placeholder="请选择"
                @change="(e) => handleChange(e.target.value, record.key, col)"
              >
                <a-icon
                  slot="addonAfter"
                  type="user"
                  @click="() => (assigneeVisible = true)"
                />
              </a-input>
              <t-department
                :userList="text"
                :visible="assigneeVisible"
                style="width: 100%;"
                :typeNum="2"
                @change="
                  (value) => setUser(value, record.key, col, record.type)
                "
                @close="() => (assigneeVisible = false)"
              />
            </template>
            <template v-else-if="record.type === 'post'"> </template>
            <a-input v-else placeholder="请选择"></a-input>
          </div>

          <template v-else>{{ text }}</template>
        </div>
        <div v-else :key="col">
          <a-select
            v-if="record.editable"
            :value="text"
            placeholder="请选择"
            @change="(e) => handleChange(e, record.key, col, 'type')"
            style="width: 100%;"
          >
            <a-select-option value="assignee">指定人员</a-select-option>
            <a-select-option value="candidateUsers">候选人员</a-select-option>
            <a-select-option value="candidateGroups">指定角色</a-select-option>
            <a-select-option value="processInitiator"
              >流程发起人</a-select-option
            >
            <a-select-option value="department">岗位</a-select-option>
            <a-select-option value="post">部门</a-select-option>
          </a-select>
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="remove(record.key)">删除</a>
      </template>
    </a-table>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      @click="newMember"
      v-if="data.length < 1"
      >新增成员</a-button
    >
  </t-modal>
</template>

<script>
import userPopup from "@/components/TopVUI/custom/userPopup";
import rolePopup from "@/components/TopVUI/custom/rolePopup";
import TDepartment from "@/components/TopVUI/custom/TDepartment";
export default {
  name: "AdvancedForm",
  components: { userPopup, rolePopup, TDepartment },
  props: { visible: { type: Boolean } },
  data() {
    return {
      // table
      columns: [
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          align: "center",
          width: "45%",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
          align: "center",
          width: "45%",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "操作",
          key: "action",
          width: "10%",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
      data: [],
      assigneeVisible: false,
      candidateVisible: false,
    };
  },
  methods: {
    handleOk() {
      this.$emit("ok", this.data);
    },
    handleCancel() {
      this.$emit("update:visible");
    },
    handleSubmit(e) {
      e.preventDefault();
    },
    // 新增
    newMember() {
      const length = this.data.length;
      this.data.push({
        key:
          length === 0
            ? "1"
            : (parseInt(this.data[length - 1].key) + 1).toString(),
        name: "",
        type: "",
        value: "",
        editable: true,
        isNew: true,
      });
    },
    // 删除
    remove(key) {
      const newData = this.data.filter((item) => item.key !== key);
      this.data = newData;
    },
    // 保存
    saveRow(record) {
      const { key, name, type } = record;
      if (!name || !type) {
        this.$message.error("请填写完整成员信息。");
        return;
      }
      // 模拟网络请求、卡顿 800ms
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false });
        }, 800);
      }).then(() => {
        const target = this.data.find((item) => item.key === key);
        target.editable = false;
        target.isNew = false;
      });
    },
    toggle(key) {
      let target = this.data.filter((item) => item.key === key)[0];
      target.editable = !target.editable;
    },
    cancel(key) {
      const target = this.data.find((item) => item.key === key);
      Object.keys(target).forEach((key) => {
        target[key] = target._originalData[key];
      });
      target._originalData = undefined;
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      if (target) {
        target[column] = value;
        if (target.type === "processInitiator") {
          target.name = "${startUserNameId}";
          target.value = "${startUserNameId}";
        }
        console.log(target);
        this.data = newData;
      }
    },
    // 设置接地那人员
    setUser(value, key, column, type) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      if (target) {
        if (type === "department") {
          target[column] = value.text;
          target.value = value.value;
        } else {
          target[column] = value.userName;
          if (type !== "candidateGroups") {
            target.value = value.userNameId;
          } else {
            target[column] = value.userName;
            target.value = value.uuid;
          }
        }
        this.data = newData;
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
