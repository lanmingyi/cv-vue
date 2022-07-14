<!--
 * @Description: 天气
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-06-07 10:30:30
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div :id="weaterId" :style="{ height: height + 'px' }">
		<div :id="domId" class="he-plugin-standard-box" :style="{ height: height + 'px' }"></div>
	</div>
</template>
<script>
	import {
		isInclude,
		removejscssfile
	} from '@/utils/util';
	export default {
		name: 'Weather',
		data() {
			return {
				weaterId: 'weater-' + new Date().valueOf(),
				domId: 'he-plugin-standard-' + new Date().valueOf()
			};
		},
		props: {
			height: {
				type: Number | String,
				required: true,
			},
			layout: {
				type: Number | String,
				default: '1',
			},
		},
		watch: {
		},
		mounted() {
			if (isInclude('weather/weather.js')) {
				this.removeData();
			}
			window.WIDGET = {
				CONFIG: {
					layout: this.layout,
					width: '450',
					height: this.height,
					background: '1',
					container: this.domId,
					dataColor: 'FFFFFF',
					key: 'f1f392ea72084fb2a0b52dbc69ecf6c6',
				},
			}; // 将WIDGET前边加上window 否则读取不到此变量
			this.getWeather()
		},
		methods: {
			removeData() {
				removejscssfile('weather/weather.js', 'js');
				removejscssfile('weather/weather.css', 'css');
				// this.removejscssfile('https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0', 'css');
				// this.removejscssfile('https://widget.heweather.net/standard/static/css/he-standard.css?v=1.4.0', 'css');
				// this.removejscssfile('https://widget.heweather.net/standard/static/js/he-standard.js?v=1.4.0', 'js');
			},
			getWeather() {
				//本地资源
				(function(d) {
					var c = d.createElement('link')
					c.rel = 'stylesheet'
					c.href = './weather/weather.css'
					var s = d.createElement('script')
					s.type = 'text/javascript';
					s.src = './weather/weather.js'
					var sn = d.getElementsByTagName('script')[0]
					sn.parentNode.insertBefore(c, sn)
					sn.parentNode.insertBefore(s, sn)
				})(document)
				// 线上资源
				// let s = document.createElement('script');
				// s.type = 'text/javascript';
				// s.src = 'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0';
				// document.body.appendChild(s);
				// console.log("s", s)
			}
		},
	};
</script>
<style>
	
</style>
