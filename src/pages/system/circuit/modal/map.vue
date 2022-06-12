<template>
	<t-modal title="地图" :width="640" :visible="mapVisible" :switchFullscreen="true" :confirmLoading="loading" @ok="
      () => {
        $emit('ok');
      }
    " @cancel="
      () => {
        $emit('cancel');
      }
    ">
		<a-spin :spinning="loading">
			<a-form :form="form">

				<baidu-map class="myMap" ak="Uv6oOe14kC2B2yprNHHVIlNFS7GyBXC3" :center="mapData.center"
					:zoom="mapData.zoom" :scroll-wheel-zoom="mapData.scroll" :mapStyle="mapStyle" @ready="handler">
					<!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
					<!-- <bm-driving :start="startPoint" :end="endPoint" :auto-viewport="true" :panel="false"></bm-driving> -->
					<bm-driving v-if='lineShow' :start="{lng: startPointLng, lat: startPointLat}"
						:end="{lng: endPointLng, lat: endPointLat}" :auto-viewport="true" :panel="false"></bm-driving>
					<div v-for="(item, index) in coordinateData" :key="index">
						<bm-marker :position="{ lng: item.lng, lat: item.lat }" @click="infoWindowOpen(index,item)">
							<bm-info-window :show="item.mapShow" @close="infoWindowClose(index,item)"
								@open="infoWindowOpen(index,item)">
								<div class="info-window">
									<!-- <div v-for="device in item.deviceInfo"> -->
									<div v-if='lineShow1' style="margin-top:5px">
										<span style="color: red">{{item.customizeName}}</span>
									</div>
									<div v-if='lineShow1' style="color: #000;width: 222px;white-space: pre-wrap;">位置:{{ item.content }}
									</div>
									<div v-if='lineShow1' class="address">坐标:{{item.lng}},{{item.lat}}</div>
									<div v-if='lineShow' style="color: #000;width: 222px;white-space: pre-wrap;">{{ item.content }}
									</div>
									<div v-if='lineShow' style="margin-top:5px">
										<span style="color: red"></span>
									</div>
									<el-divider></el-divider>
									<!-- </div> -->
									<div v-if='lineShow' class="address">坐标:{{item.lng}},{{item.lat}}</div>
								</div>
							</bm-info-window>
						</bm-marker>
					</div>
				</baidu-map>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from "lodash.pick";
	import bmMap from "vue-baidu-map";
	import BaiduMap from "@/components/vue-baidu-map/components/map/Map.vue";
	import BmMarker from "@/components/vue-baidu-map/components/overlays/Marker.vue";
	import BmLabel from "@/components/vue-baidu-map/components/overlays/Label.vue";
	import BmPolyline from "@/components/vue-baidu-map/components/overlays/Polyline.vue";
	import BmDriving from "@/components/vue-baidu-map/components/search/Driving.vue";
	import BmInfoWindow from '@/components/vue-baidu-map/components/overlays/InfoWindow.vue';
	// 表单字段
	const fields = [
		// "uuid",
		// "name",
		// "sex",
		// "age",
		// "testDate",
		// "testDatetime",
		// "testCombobox",
		// "puuid",
	];
	import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
	export default {
		props: {
			mapVisible: {
				type: Boolean,
				required: true,
			},
			loading: {
				type: Boolean,
				default: () => false,
			},
			model: {
				type: Object,
				default: () => null,
			},
		},
		components: {
			TDictSelectTag,
			BaiduMap,
			bmMap,
			BmMarker,
			BmLabel,
			BmPolyline,
			BmDriving,
			BmInfoWindow
		},
		data() {
			return {
				disp: false,
				mapData: {
					center: {
						lng: 120.663298,
						lat: 31.290251
					}, //'苏州',地图的中心点坐标
					zoom: 11, //1-18，数值越大离地面越近，地图实际面积越小
					scroll: true, //支持滚动鼠标缩放
				},
				mapStyle: { // 地图自定义样式
					styleJson: [{
							featureType: "highway", // 高速路
							elementType: "labels",
							stylers: {
								visibility: "off",
							},
						},
						{
							featureType: "district", // 地点名称
							elementType: "labels.text.stroke",
							stylers: {
								color: "#6fa8dcff",
							},
						},
						{
							featureType: "district",
							elementType: "labels.text.fill",
							stylers: {
								color: "#ffffffff",
							},
						},
						{
							featureType: "water", // 水系
							elementType: "all",
							stylers: {
								color: "#97c4fdff",
							},
						},
						{
							featureType: "land", // 地面
							elementType: "all",
							stylers: {
								color: "#fcfbf7ff",
							},
						},
						{
							featureType: "green", //  绿地
							elementType: "all",
							stylers: {
								visibility: "off",
							},
						},
					],
				},
				startPointLng: '',
				startPointLat: '',
				endPointLng: '',
				endPointLat: '',
				coordinateData: [],
				lineShow: false,
				lineShow1: false,
				// coordinateData: [{
				// 		lng: 121.0704147,
				// 		lat: 37.6891295,
				// 		content: "位置点：出发/到达点-公路货运-CD烟台0001-万华烟台工业园\n详细地址：山东省烟台市福山区经济技术开发区重庆大街59号",
				// 		mapShow: false,
				// 	},
				// 	{
				// 		lng: 121.0126799,
				// 		lat: 37.6375332,
				// 		content: "位置点：高速点-公路货运-GS烟台0001-福山区烟台机场收费站入口\n详细地址：山东省烟台市福山区烟台机场收费站G18荣乌高速入口",
				// 		mapShow: false,
				// 	},
				// 	{
				// 		lng: 120.1644505,
				// 		lat: 36.0574885,
				// 		content: "位置点：高速点-公路货运-GS青岛0001-黄岛S7602济南/日照出口\n详细地址：山东省青岛市黄岛区1号疏港高速S7602济南/日照出口",
				// 		mapShow: false,
				// 	},
				// 	{
				// 		lng: 120.1554839,
				// 		lat: 36.0095108,
				// 		content: "位置点：下道点-公路货运-XD青岛0003-黄岛区前湾港路与开拓路路口\n详细地址：山东省青岛市黄岛区前湾港路与开拓路路口",
				// 		mapShow: false,
				// 	},
				// 	{
				// 		lng: 120.150517,
				// 		lat: 36.0112746,
				// 		content: "位置点：出发/到达点-公路货运-CD青岛0001-青岛澳柯玛新材料\n详细地址：山东省青岛市黄岛区前湾港路315号澳柯玛工业园",
				// 		mapShow: false,
				// 	}
				// ],
				// 地图坐标点
				towerLines: [], // 地图行车路线
				title: "",
				labelCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 5,
					},
				},
				wrapperCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 16,
					},
				},
				form: this.$form.createForm(this),
			};
		},
		methods: {
			add(m, data) {
				console.log(m, data);
			},
			edit(m, data) {
				console.log(m, data);
			},
			handler({
				BMap,
				map
			}) {
				console.log('333')
				console.log(BMap, map)
				console.log(555)
				this.mapData.center.lng = 121.070
				this.mapData.center.lat = 37.689
				this.mapData.zoom = 15
			},
			infoWindowClose(index, item) {
				// console.log(index,item)
				item.mapShow = false
				this.$set(this.pointList, index, item)
			},
			infoWindowOpen(index, item) {
				console.log(888888)
				// console.log(index,item)
				item.mapShow = true
				this.$set(this.pointList, index, item)
			}
		},
		created() {
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
			// 当 model 发生改变时，为表单设置值
			this.$watch("model", () => {
				// this.model && this.form.setFieldsValue(pick(this.model, fields));
				console.log('exportMapInfo1:', this.model);
				this.startPointLng = this.model.trailVo.startPointLng;
				this.startPointLat = this.model.trailVo.startPointLat;
				this.endPointLng = this.model.trailVo.endPointLng;
				this.endPointLat = this.model.trailVo.endPointLat;
				if (this.startPointLng) {
					this.lineShow = true;
					this.lineShow1 = false;
				}else {
					this.lineShow1 = true;
					this.lineShow = false;
					this.mapData.center.lng = this.model.trailVo.pointList[0].lng;
					this.mapData.center.lat = this.model.trailVo.pointList[0].lat;
					console.log('中心点位置:',this.mapData.center.lng,this.mapData.center.lat);
				}
				this.coordinateData = this.model.trailVo.pointList;
				console.log('excoordinateData:', this.coordinateData);
			});
		},
	};
</script>
<style>
	.myMap {
		width: 100%;
		height: 900px;
	}

	.baidu-map {

		.BMap_bottom {
			display: none;
		}

		.BMap_pop {

			>div,
			>img:nth-child(10) {
				display: none;
				overflow: unset;
			}

			>div:nth-child(9) {
				display: block;
				overflow: unset;
				width: 340px !important;
			}

			>div:nth-child(8) {
				/*display: block;*/
			}

			.BMap_top {
				display: none;
			}

			.BMap_center {
				background: transparent;
				border: none;
				position: sticky !important;
				height: 100%;
			}
		}

		.BMap_bubble_content {
			background: rgba(0, 0, 0, .5);
			border-radius: 5px;
			padding: 20px;

			.info-window {
				padding-right: 8px;
				width: 100%;
				max-height: 280px;
				overflow: auto;

				.el-divider {
					background: #ccccccbf;
				}

				.address {
					color: #fff;
				}
			}

			//自定义滚动条样式
			.info-window::-webkit-scrollbar {
				width: 6px;
				height: 1px;
			}

			.info-window::-webkit-scrollbar-thumb {
				border-radius: 6px;
				-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
				background: #535353;
			}

			.info-window::-webkit-scrollbar-track {
				-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
				border-radius: 6px;
				background: #EDEDED;
			}
		}

	}
</style>
