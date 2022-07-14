<!--
 * @Description: 可拖拽窗口，暂未使用
 * @Author: lmy
 * @Date: 2021-01-19 11:37:58
 * @LastEditTime: 2021-05-21 14:23:06
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<a-modal
		:visible="visible"
		:class="[getClass(modalClass), simpleClass]"
		:style="getStyle(modalStyle)"
		v-bind="_attrs"
		v-on="$listeners"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<slot></slot>
		<template v-if="!isNoTitle" slot="title">
			<a-row class="t-modal-title-" type="flex">
				<a-col class="left">
					<slot name="title">{{ title }}</slot>
				</a-col>
				<a-col v-if="switchFullscreen" class="right" @click="toggleFullscreen">
					<a-button
						class="ant-modal-close ant-modal-close-x"
						ghost
						type="link"
						:icon="fullscreenButtonIcon"
					/>
				</a-col>
			</a-row>
		</template>
		<!-- 处理 scopedSlots -->
		<template v-for="slotName of scopedSlotsKeys" :slot="slotName">
			<slot :name="slotName"></slot>
		</template>
		<!-- 处理 slots -->
		<template v-for="slotName of slotsKeys" v-slot:[slotName]>
			<slot :name="slotName"></slot>
		</template>
	</a-modal>
</template>
<script>
import props from './props.js';
import { getClass, getStyle } from '@/utils/props-util';
import { triggerWindowResizeEvent } from '@/utils/util';
var mouseDownX = 0;
var mouseDownY = 0;
var deltaX = 0;
var deltaY = 0;
var sumX = 0;
var sumY = 0;

var header = null;
var contain = null;
var modalContent = null;

var onmousedown = false;
export default {
	name: 'DragerModal',
	mixins: [props],
	props: {
		visible: {
			type: Boolean,
			default: () => {
				return false;
			},
		},
		title: {
			type: String,
			default: () => {
				return undefined;
			},
		},
		footer: {
			type: Boolean,
			default: () => {
				return true;
			},
		},
		// 是否全屏弹窗，当全屏时无论如何都会禁止 body 滚动。可使用 .sync 修饰符
		fullscreen: {
			type: Boolean,
			default: false,
		},
		// 是否允许切换全屏（允许后右上角会出现一个按钮）
		switchFullscreen: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// 内部使用的 slots ，不再处理
			usedSlots: ['title'],
			// 实际控制是否全屏的参数
			innerFullscreen: this.fullscreen,
		};
	},
	computed: {
		// 一些未处理的参数或特殊处理的参数绑定到 t-modal 上
		_attrs() {
			let attrs = { ...this.$attrs };
			// 如果全屏就将宽度设为 100%
			if (this.innerFullscreen) {
				attrs['width'] = '100%';
			}
			return attrs;
		},
		simpleClass() {
			console.log(
				Math.random()
					.toString(36)
					.substring(2)
			);
			return Math.random()
				.toString(36)
				.substring(2);
		},
		modalClass() {
			return {
				't-modal-box': true,
				fullscreen: this.innerFullscreen,
				'no-title': this.isNoTitle,
				'no-footer': this.isNoFooter,
			};
		},
		modalStyle() {
			let style = {};
			// 如果全屏就将top设为 0
			if (this.innerFullscreen) {
				style['top'] = '0';
			}
			return style;
		},
		isNoTitle() {
			return !this.title && !this.allSlotsKeys.includes('title');
		},
		isNoFooter() {
			return this._attrs['footer'] === null;
		},
		slotsKeys() {
			return Object.keys(this.$slots).filter((key) => !this.usedSlots.includes(key));
		},
		scopedSlotsKeys() {
			return Object.keys(this.$scopedSlots).filter((key) => !this.usedSlots.includes(key));
		},
		allSlotsKeys() {
			return this.slotsKeys.concat(this.scopedSlotsKeys);
		},
		// 切换全屏的按钮图标
		fullscreenButtonIcon() {
			return this.innerFullscreen ? 'fullscreen-exit' : 'fullscreen';
		},
	},
	watch: {
		visible() {
			if (this.visible) {
				this.$nextTick(() => {
					this.initialEvent(this.visible);
				});
				this.innerFullscreen = this.fullscreen;
			}
		},
		innerFullscreen(val) {
			this.$emit('update:fullscreen', val);
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.initialEvent(this.visible);
		});
		triggerWindowResizeEvent();
	},
	created() {},
	beforeDestroy() {
		this.removeMove();
		window.removeEventListener('mouseup', this.removeUp, false);
		triggerWindowResizeEvent();
	},
	methods: {
		getClass(clazz) {
			return { ...getClass(this), ...clazz };
		},
		getStyle(style) {
			return { ...getStyle(this), ...style };
		},

		/** 切换全屏 */
		toggleFullscreen() {
			this.innerFullscreen = !this.innerFullscreen;
			triggerWindowResizeEvent();
		},
		handleOk(e) {
			this.resetNum();
			this.$emit('ok', e);
		},
		handleCancel(e) {
			this.resetNum();
			this.$emit('cancel', e);
		},
		resetNum() {
			mouseDownX = 0;
			mouseDownY = 0;
			deltaX = 0;
			deltaY = 0;
			sumX = 0;
			sumY = 0;
		},
		handleMove(event) {
			const delta1X = event.pageX - mouseDownX;
			const delta1Y = event.pageY - mouseDownY;

			deltaX = delta1X;
			deltaY = delta1Y;
			// console.log('delta1X:' + delta1X, 'sumX:' + sumX, 'delta1Y:' + delta1Y, 'sumY:' + sumY)
			modalContent.style.transform = `translate(${delta1X + sumX}px, ${delta1Y + sumY}px)`;
		},
		initialEvent(visible) {
			// console.log('--------- 初始化')
			// console.log('simpleClass===>', this.simpleClass)
			// console.log('document===>', document)
			if (visible) {
				setTimeout(() => {
					window.removeEventListener('mouseup', this.removeUp, false);
					contain = document.getElementsByClassName(this.simpleClass)[0];
					header = contain.getElementsByClassName('ant-modal-header')[0];
					modalContent = contain.getElementsByClassName('ant-modal-content')[0];

					modalContent.style.left = 0;
					modalContent.style.transform = 'translate(0px,0px)';

					// console.log('初始化-header:', header)
					// console.log('初始化-contain:', contain)
					// console.log('初始化-modalContent:', modalContent)

					header.style.cursor = 'all-scroll';

					// contain.onmousedown = (e) => {
					header.onmousedown = (e) => {
						onmousedown = true;
						mouseDownX = e.pageX;
						mouseDownY = e.pageY;
						document.body.onselectstart = () => false;
						window.addEventListener('mousemove', this.handleMove, false);
					};

					window.addEventListener('mouseup', this.removeUp, false);
				}, 0);
			}
		},
		removeMove() {
			window.removeEventListener('mousemove', this.handleMove, false);
		},
		removeUp(e) {
			// console.log('removeUp')
			document.body.onselectstart = () => true;

			if (onmousedown && !(e.pageX === mouseDownX && e.pageY === mouseDownY)) {
				onmousedown = false;
				sumX = sumX + deltaX;
				sumY = sumY + deltaY;
				console.log('sumX:' + sumX, 'sumY:' + sumY);
			}
			this.removeMove();
		},
	},
};
</script>
<style lang="less">
.t-modal-box {
	&.fullscreen {
		top: 0 !important;
		left: 0 !important;
		padding: 0;

		// 兼容1.6.2版本的antdv
		&.ant-modal {
			top: 0 !important;
			padding: 0;
			height: 100vh;
		}

		&.ant-modal-content {
			height: 100vh;
			border-radius: 0;

			&.ant-modal-body {
				/* title 和 footer 各占 55px */
				min-height: 500px;
				height: calc(100% - 55px - 41px) !important;
				overflow: auto;
			}
		}

		&.no-title,
		&.no-footer {
			.ant-modal-body {
				height: calc(100% - 55px);
			}
		}

		&.no-title.no-footer {
			.ant-modal-body {
				height: 100%;
			}
		}
	}

	.t-modal-title- {
		.left {
			width: calc(100% - 56px - 56px);
		}

		.right {
			width: 56px;
			position: inherit;

			.ant-modal-close {
				right: 56px;
				color: rgba(0, 0, 0, 0.45);

				&:hover {
					color: rgba(0, 0, 0, 0.75);
				}
			}
		}
	}
}

@media (max-width: 767px) {
	.t-modal-box.fullscreen {
		margin: 0;
		max-width: 100vw;
	}
}
</style>
