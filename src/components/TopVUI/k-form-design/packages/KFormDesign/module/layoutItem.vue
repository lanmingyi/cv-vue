<!--
 * @Description: 布局
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 11:27:53
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormDesign\module\layoutItem.vue
-->
<template>
  <div
    :class="{
      'layout-width': ['grid', 'table', 'card', 'divider', 'html'].includes(
        record.type
      ),
    }"
  >
    <!-- 动态表格设计模块 start -->
    <template v-if="record.type === 'batch'">
      <div
        class="batch-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record, record.options.tableName)"
      >
        <div class="batch-label">动态表格</div>
        <draggable
          tag="div"
          class="draggable-box"
          v-bind="{
            group: insertAllowed ? 'form-draggable' : '',
            ghostClass: 'moving',
            animation: 180,
            handle: '.drag-move',
          }"
          v-model="record.list"
          @start="$emit('dragStart', $event, record.list)"
          @add="$emit('handleColAdd', $event, record.list)"
        >
          <transition-group tag="div" name="list" class="list-main">
            <p
              v-if="record.list.length === 0"
              :key="record.type"
              style="width: 100%;
                    color: #999;
                    text-align: center;
                    font-size: 14px;"
            >
              请将组件拖拽到此处（可拖拽多个组件）
            </p>
            <formNode
              v-else
              v-for="item in record.list"
              :key="item.key"
              class="drag-move"
              :selectItem.sync="selectItem"
              :record="item"
              :hideModel="hideModel"
              :config="config"
              @handleSelectItem="
                (e) => {
                  handleSelectItem(e, record.options.tableName);
                }
              "
              @handleColAdd="handleColAdd"
              @handleCopy="$emit('handleCopy')"
              @handleShowRightMenu="handleShowRightMenu"
              @handleDelete="$emit('handleDelete')"
            />
          </transition-group>
        </draggable>
        <div
          class="copy"
          :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          @click.stop="$emit('handleCopy')"
        >
          <a-icon type="copy" />
        </div>
        <!-- <div
				  class="delete"
				  :class="record.key === selectItem.key ? 'active' : 'unactivated'"
				  @click.stop="$emit('handleDelete')"
				>
				  <a-icon type="delete" />
				</div> -->
        <a-popconfirm
          placement="bottomRight"
          ok-text="是"
          cancel-text="否"
          @confirm="$emit('handleDelete')"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <template slot="title">
            <p>是否删除该组件？</p>
          </template>
          <div
            class="delete"
            :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          >
            <a-icon type="delete" />
          </div>
        </a-popconfirm>
      </div>
    </template>
    <!-- 动态表格设计模块 end -->
    <!-- 标签Tabs布局 start -->
    <template v-else-if="record.type === 'tabs'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <a-tabs
          class="grid-row"
          :default-active-key="0"
          :tabBarGutter="record.options.tabBarGutter || null"
          :type="record.options.type"
          :size="record.options.size"
          :tabPosition="record.options.tabPosition"
          :animated="record.options.animated"
        >
          <a-tab-pane
            v-for="(tabItem, index) in record.columns"
            :key="index"
            :tab="tabItem.label"
          >
            <div class="grid-col">
              <draggable
                tag="div"
                class="draggable-box"
                v-bind="{
                  group: 'form-draggable',
                  ghostClass: 'moving',
                  animation: 180,
                  handle: '.drag-move',
                }"
                v-model="tabItem.list"
                @start="$emit('dragStart', $event, tabItem.list)"
                @add="$emit('handleColAdd', $event, tabItem.list)"
              >
                <transition-group tag="div" name="list" class="list-main">
                  <layoutItem
                    class="drag-move"
                    v-for="item in tabItem.list"
                    :key="item.key"
                    :selectItem.sync="selectItem"
                    :startType="startType"
                    :insertAllowedType="insertAllowedType"
                    :record="item"
                    :hideModel="hideModel"
                    :config="config"
                    @handleSelectItem="handleSelectItem"
                    @handleColAdd="handleColAdd"
                    @handleCopy="$emit('handleCopy')"
                    @handleShowRightMenu="handleShowRightMenu"
                    @handleDelete="$emit('handleDelete')"
                  />
                </transition-group>
              </draggable>
            </div>
          </a-tab-pane>
        </a-tabs>

        <div
          class="copy"
          :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          @click.stop="$emit('handleCopy')"
        >
          <a-icon type="copy" />
        </div>
        <a-popconfirm
          placement="bottomRight"
          ok-text="是"
          cancel-text="否"
          @confirm="$emit('handleDelete')"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <template slot="title">
            <p>是否删除该组件？</p>
          </template>
          <div
            class="delete"
            :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          >
            <a-icon type="delete" />
          </div>
        </a-popconfirm>
      </div>
    </template>
    <!-- 标签Tabs布局 end -->
    <!-- 栅格布局 start -->
    <template v-else-if="record.type === 'grid'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <a-row
          class="grid-row"
          :gutter="record.options.gutter"
          v-bind="{
            type: record.options.type === 'default' ? null : 'flex',
            align:
              record.options.type === 'default' ? null : record.options.align,
            justify:
              record.options.type === 'default' ? null : record.options.justify,
          }"
        >
          <a-col
            class="grid-col"
            v-for="(colItem, idnex) in record.columns"
            :key="idnex"
            :span="colItem.span || 0"
          >
            <draggable
              tag="div"
              class="draggable-box"
              v-bind="{
                group: 'form-draggable',
                ghostClass: 'moving',
                animation: 180,
                handle: '.drag-move',
              }"
              v-model="colItem.list"
              @start="$emit('dragStart', $event, colItem.list)"
              @add="$emit('handleColAdd', $event, colItem.list)"
            >
              <transition-group tag="div" name="list" class="list-main">
                <layoutItem
                  class="drag-move"
                  v-for="item in colItem.list"
                  :key="item.key"
                  :selectItem.sync="selectItem"
                  :startType="startType"
                  :insertAllowedType="insertAllowedType"
                  :record="item"
                  :hideModel="hideModel"
                  :config="config"
                  @handleSelectItem="handleSelectItem"
                  @handleColAdd="handleColAdd"
                  @handleCopy="$emit('handleCopy')"
                  @handleShowRightMenu="handleShowRightMenu"
                  @handleDelete="$emit('handleDelete')"
                />
              </transition-group>
            </draggable>
          </a-col>
        </a-row>

        <div
          class="copy"
          :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          @click.stop="$emit('handleCopy')"
        >
          <a-icon type="copy" />
        </div>
        <a-popconfirm
          placement="bottomRight"
          ok-text="是"
          cancel-text="否"
          @confirm="$emit('handleDelete')"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <template slot="title">
            <p>是否删除该组件？</p>
          </template>
          <div
            class="delete"
            :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          >
            <a-icon type="delete" />
          </div>
        </a-popconfirm>
      </div>
    </template>
    <!-- 栅格布局 end -->
    <!-- 卡片布局 start -->
    <template v-else-if="record.type === 'card'">
      <div
        class="grid-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <a-card
          class="grid-row"
          :title="record.label"
          :bordered="record.options.bordered ? record.options.bordered : false"
        >
          <div class="grid-col">
            <draggable
              tag="div"
              class="draggable-box"
              v-bind="{
                group: 'form-draggable',
                ghostClass: 'moving',
                animation: 180,
                handle: '.drag-move',
              }"
              v-model="record.list"
              @start="$emit('dragStart', $event, record.list)"
              @add="$emit('handleColAdd', $event, record.list)"
            >
              <transition-group tag="div" name="list" class="list-main">
                <!-- <p
                  v-if="record.list.length === 0"
                  :key="record.type"
                  style="width: 100%;
                          color: #999;
                          text-align: center;
                          font-size: 14px;"
                >
                  请将组件拖拽到此处（可拖拽多个组件）
                </p> -->
                <layoutItem
                  class="drag-move"
                  v-for="item in record.list"
                  :key="item.key"
                  :selectItem.sync="selectItem"
                  :startType="startType"
                  :insertAllowedType="insertAllowedType"
                  :record="item"
                  :hideModel="hideModel"
                  :config="config"
                  @handleSelectItem="handleSelectItem"
                  @handleColAdd="handleColAdd"
                  @handleCopy="$emit('handleCopy')"
                  @handleShowRightMenu="handleShowRightMenu"
                  @handleDelete="$emit('handleDelete')"
                />
              </transition-group>
            </draggable>
          </div>
        </a-card>

        <div
          class="copy"
          :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          @click.stop="$emit('handleCopy')"
        >
          <a-icon type="copy" />
        </div>
        <a-popconfirm
          placement="bottomRight"
          ok-text="是"
          cancel-text="否"
          @confirm="$emit('handleDelete')"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <template slot="title">
            <p>是否删除该组件？</p>
          </template>
          <div
            class="delete"
            :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          >
            <a-icon type="delete" />
          </div>
        </a-popconfirm>
      </div>
    </template>
    <!-- 卡片布局 end -->
    <!-- 表格布局 start -->
    <template v-else-if="record.type === 'table'">
      <div
        class="table-box"
        :class="{ active: record.key === selectItem.key }"
        @click.stop="handleSelectItem(record)"
      >
        <table
          class="table-layout kk-table-9136076486841527"
          :class="{
            bright: record.options.bright,
            small: record.options.small,
            bordered: record.options.bordered,
            formBorder: record.options.formBorder,
          }"
          :style="record.options.customStyle"
        >
          <tr v-for="(trItem, trIndex) in record.trs" :key="trIndex">
						<!-- v-show -->
            <td
              class="table-td"
              v-for="(tdItem, tdIndex) in trItem.tds"
              v-show="tdItem.colspan && tdItem.rowspan"
              :key="tdIndex"
              :colspan="tdItem.colspan"
              :rowspan="tdItem.rowspan"
              @contextmenu.prevent="
                $emit('handleShowRightMenu', $event, record, trIndex, tdIndex)
              "
            >
              <draggable
                tag="div"
                class="draggable-box"
                v-bind="{
                  group: 'form-draggable',
                  ghostClass: 'moving',
                  animation: 180,
                  handle: '.drag-move'
                }"
                v-model="tdItem.list"
                @start="$emit('dragStart', $event, tdItem.list)"
                @add="$emit('handleColAdd', $event, tdItem.list)"
              >
                <transition-group tag="div" name="list" class="list-main">
                  <layoutItem
                    class="drag-move"
                    v-for="item in tdItem.list"
                    :key="item.key"
                    :selectItem.sync="selectItem"
                    :startType="startType"
                    :insertAllowedType="insertAllowedType"
                    :record="item"
                    :hideModel="hideModel"
                    :config="config"
                    @handleSelectItem="handleSelectItem"
                    @handleColAdd="handleColAdd"
                    @handleCopy="$emit('handleCopy')"
                    @handleShowRightMenu="handleShowRightMenu"
                    @handleDelete="$emit('handleDelete')"
                  />
                </transition-group>
              </draggable>
            </td>
          </tr>
        </table>

        <div
          class="copy"
          :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          @click.stop="$emit('handleCopy')"
        >
          <a-icon type="copy" />
        </div>
        <a-popconfirm
          placement="bottomRight"
          ok-text="是"
          cancel-text="否"
          @confirm="$emit('handleDelete')"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <template slot="title">
            <p>是否删除该组件？</p>
          </template>
          <div
            class="delete"
            :class="record.key === selectItem.key ? 'active' : 'unactivated'"
          >
            <a-icon type="delete" />
          </div>
        </a-popconfirm>
      </div>
    </template>
    <!-- 表格布局 end -->
    <template v-else>
      <formNode
        :key="record.key"
        :selectItem.sync="selectItem"
        :record="record"
        :config="config"
        :hideModel="hideModel"
        @handleSelectItem="handleSelectItem"
        @handleCopy="$emit('handleCopy')"
        @handleDelete="$emit('handleDelete')"
        @handleShowRightMenu="$emit('handleShowRightMenu')"
      />
    </template>
  </div>
</template>
<script>
/*
 * author 黄婷
 * date 2019-11-20
 * description 使用递归组件调用自己，生成布局结构及表单
 */
import draggable from "vuedraggable";
import formNode from "./formNode";
export default {
  name: "layoutItem",
  props: {
    record: {
      type: Object,
      required: true,
    },
    selectItem: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    startType: {
      type: String,
      required: true,
    },
    insertAllowedType: {
      type: Array,
      required: true,
    },
    hideModel: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    insertAllowed() {
      return this.insertAllowedType.includes(this.startType);
    },
  },
  components: {
    formNode,
    draggable,
  },
  methods: {
    handleShowRightMenu(e, record, trIndex, tdIndex) {
      this.$emit("handleShowRightMenu", e, record, trIndex, tdIndex);
    },
    handleSelectItem(record, batchName) {
      this.$emit("handleSelectItem", record, batchName);
    },
    handleColAdd(e, list) {
      this.$emit("handleColAdd", 112, list);
    },
  },
};
</script>
