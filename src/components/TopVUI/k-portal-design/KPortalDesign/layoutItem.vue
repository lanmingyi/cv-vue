<!--
 * @Description: 使用递归组件调用自己，生成布局结构及组件
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-06-03 15:36:13
 * @LastEditors: 黄婷
 * @FilePath: \vue-antd-admine:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\layoutItem.vue
-->
<template>
	<div
		:class="{
			'layout-width': ['grid', 'table', 'card', 'divider', 'html'].includes(record.type),
		}"
	>
		<!-- 栅格布局 start -->
		<template v-if="record.type === 'grid'">
			<div
				class="grid-box"
				:class="{ active: record.key === selectItem.key }"
				@click.stop="handleSelectItem(record)"
			>
				<a-row class="grid-row" :gutter="[record.options.gutters, record.options.vgutters]">
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
								group: 'index-draggable',
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
				<div
					class="delete"
					:class="record.key === selectItem.key ? 'active' : 'unactivated'"
					@click.stop="$emit('handleDelete')"
				>
					<a-icon type="delete" />
				</div>
			</div>
		</template>
		<!-- 栅格布局 end -->
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
					<a-tab-pane v-for="(tabItem, index) in record.columns" :key="index" :tab="tabItem.label">
						<div class="grid-col">
							<draggable
								tag="div"
								class="draggable-box"
								v-bind="{
									group: 'index-draggable',
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
				<div
					class="delete"
					:class="record.key === selectItem.key ? 'active' : 'unactivated'"
					@click.stop="$emit('handleDelete')"
				>
					<a-icon type="delete" />
				</div>
			</div>
		</template>
		<template v-else>
			<list-item
				:key="record.key"
				:selectItem.sync="selectItem"
				:record="record"
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
import draggable from 'vuedraggable';
import listItem from './listNode';
export default {
	name: 'layoutItem',
	props: {
		record: {
			type: Object,
			required: true,
		},
		selectItem: {
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
		draggable,
		listItem,
	},
	methods: {
		handleShowRightMenu(e, record, trIndex, tdIndex) {
			this.$emit('handleShowRightMenu', e, record, trIndex, tdIndex);
		},
		handleSelectItem(record) {
			this.$emit('handleSelectItem', record);
		},
		handleColAdd(e, list) {
			console.log(e, list, 'e, list====');
			this.$emit('handleColAdd', e, list);
		},
	},
};
</script>
