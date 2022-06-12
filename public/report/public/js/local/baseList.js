var mockUrl = 'https://mock.ewsd.cn/mock/5eba47d2050f39336097c451/report'
var baseList = [{
	"label": '图表',
	"icon": 'icon-tubiao',
	"charData": [{
		"label": '柱形图',
		"icon": 'icon-icon-',
		"listImg": [{
				"img": './report/public/img/chart/bar2.png',
				"text": '堆叠式柱状图',
				"icon": 'icon-icon-',
				"option": {
					"xAxisRotate": 0, //刻度标签旋转的角图
					"name": "柱状图",
					"title": "柱状图",
					"data": barData,
					"dataType": 0,
					"dataMethod": 'get',
					"url": mockUrl + "/stackBar",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1200,
						"height": 600,
						"name": "bar",
						"prop": "bar",
						"option": {
							"switchTheme": true,
							"refreshTime": 5000,
							"title": '访问来源',
							"titlePostion": '',
							"titleFontSize": 24,
							"titleColor": 'rgb(37,52,229)',
							"titleLink": "http://demo.topjui.com",
							"info": '访问来源',
							"gridX": 105,
							"gridY": 50,
							"gridX2": 80,
							"gridY2": 100,
							'nameColor': '#fff',
							"lineColor": '#fff',
							"xNameFontSize": 16,
							'yNameFontSize': 16,
							"labelShow": false,
							"labelShowFontSize": 14,
							"labelShowFontWeight": 300,
							"yAxisInverse": false,
							'xAxisInverse': false,
							"xAxisShow": true,
							"yAxisShow": true,
							'xAxisSplitLineShow': false,
							"yAxisSplitLineShow": false,
							"refresh": 3000,
							"barWidth": 30,
							"barRadius": 0,
							"barColor": [{
								"color1": '#a3f0f6',
								"color2": '#0ff0a6',
								'postion': 90
							}, {
								"color1": '#23B7E5',
								"color2": '#564AA3',
								"postion": 50
							}],
							"barMinHeight": 2,
						}
					}
				}
			},
			{
				"img": './report/public/img/chart/bar3.png',
				"text": '渐变柱状图',
				"icon": 'icon-icon-',
				"option": {
					"xAxisRotate": 0, //刻度标签旋转的角图
					"name": "渐变柱状图",
					"title": "渐变柱状图",
					"data": barData,
					"dataType": 0,
					"dataMethod": 'get',
					"url": mockUrl + "/gradualBar",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1200,
						"height": 600,
						"name": "bar",
						"prop": "bar",
						"option": {
							"itemWidth": 15, //图例宽度
							"itemHeight": 15, //图例高度
							"gridX": 105,
							"gridY": 50,
							"gridX2": 80,
							"gridY2": 100,
							"nameColor": "#fff",
							"lineColor": "#fff",
							"xNameFontSize": 16,
							"yNameFontSize": 16,
							"labelShow": false,
							"labelShowFontSize": 14,
							"labelShowFontWeight": 300,
							"yAxisInverse": false,
							"xAxisInverse": false,
							"xAxisShow": true,
							"yAxisShow": true,
							"xAxisSplitLineShow": false,
							"yAxisSplitLineShow": false,
							"barWidth": 30,
							"barRadius": 0,
							"barColor": [{
								"color1": "#1adef6",
								"color2": "#5504f0",
								"postion": 90,
								"$index": 0,
								"_show": true
							}, {
								"color1": "#e5c372",
								"color2": "rgba(255,133,32,1)",
								"postion": 50,
								"$index": 1,
								"_show": true
							}],
							"barMinHeight": 2
						}
					}
				}
			},
			{
				"img": './report/public/img/chart/bar.png',
				"text": '柱状图(Array)',
				"icon": 'icon-icon-',
				"option": {
					"xAxisRotate": 0, //刻度标签旋转的角图
					"name": "柱状图(Array)",
					"title": "柱状图(Array)",
					"data": barData,
					"dataType": 0,
					"dataMethod": 'get',
					"url": mockUrl + "/bar",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1200,
						"height": 600,
						"name": "bar",
						"prop": "bar",
						"option": {
							"itemWidth": 15, //图例宽度
							"itemHeight": 15, //图例高度
							"gridX": 105,
							"gridY": 50,
							"gridX2": 80,
							"gridY2": 100,
							"nameColor": "#eee",
							"lineColor": "#eee",
							"xNameFontSize": 16,
							"yNameFontSize": 16,
							"labelShow": false,
							"labelShowFontSize": 14,
							"labelShowFontWeight": 300,
							"yAxisInverse": false,
							"xAxisInverse": false,
							"xAxisShow": true,
							"yAxisShow": true,
							"xAxisSplitLineShow": false,
							"yAxisSplitLineShow": false,
							"barWidth": 30,
							"barRadius": 8,
							"barColor": [{
								"color1": "rgb(176,42,34)",
								"color2": "rgb(167,36,33)",
								"postion": 90,
								"$index": 0,
								"_show": true
							}, {
								"color1": "#1d197a",
								"color2": "#1d197a",
								"postion": 50,
								"$index": 1,
								"_show": true
							}],
							"barMinHeight": 2
						}
					}
				}
			}
		]
	}, {
		"label": '折线图',
		"icon": 'icon-tubiaozhexiantu',
		"listImg": [{
			"img": './report/public/img/chart/line1.png',
			"text": '堆叠区域图',
			"icon": 'icon-tubiaozhexiantu',
			"option": {
				"xAxisRotate": 0, //刻度标签旋转的角图
				"name": "堆叠区域图",
				"title": "堆叠区域图",
				"data": barData,
				"dataType": 0,
				"dataMethod": 'get',
				"url": mockUrl + "/line",
				"parameter": '',
				"time": 5000,
				"component": {
					"width": 1200,
					"height": 600,
					"name": "line",
					"prop": "line",
					"option": {
						switchTheme: true,
						refreshTime: 5000,
						title: '访问来源',
						titlePostion: '',
						titleFontSize: 24,
						titleColor: 'rgb(115, 170, 229)',
						titleLink: "http://demo.topjui.com",
						info: '访问来源',
						gridX: 105,
						gridY: 50,
						gridX2: 80,
						gridY2: 100,
						nameColor: '#fff',
						lineColor: '#fff',
						xNameFontSize: 16,
						yNameFontSize: 16,
						labelShow: false,
						labelShowFontSize: 14,
						labelShowFontWeight: 300,
						yAxisInverse: false,
						xAxisInverse: false,
						xAxisShow: true,
						yAxisShow: true,
						xAxisSplitLineShow: false,
						yAxisSplitLineShow: false,
						refresh: 3000,
						barWidth: 30,
						barRadius: 0,
						barColor: [{
							color1: '#f66923',
							color2: '#f02628',
							postion: 90
						}, {
							color1: '#4de5c4',
							color2: '#0affbe',
							postion: 50
						}],
						barMinHeight: 2,
						areaStyleOpacity: 0,
						areaStyle: true
					}
				}
			}
		}, {
			"img": './report/public/img/chart/line2.png',
			"text": 'line-marker',
			"icon": 'icon-tubiaozhexiantu',
			"option": {
				"xAxisRotate": 0, //刻度标签旋转的角图
				"name": "line-marker",
				"title": "line-marker",
				"data": barData,
				"dataType": 0,
				"dataMethod": 'get',
				"url": mockUrl + "/oneLine",
				"parameter": '',
				"time": 5000,
				"component": {
					"width": 1200,
					"height": 600,
					"name": "line",
					"prop": "line",
					"option": {
						"switchTheme": true,
						"refreshTime": 5000,
						"title": '访问来源',
						"titlePostion": '',
						"titleFontSize": 24,
						"titleColor": 'rgb(115, 170, 229)',
						"titleLink": "http://demo.topjui.com",
						"info": '访问来源',
						"gridX": 105,
						"gridY": 50,
						'gridX2': 80,
						"gridY2": 100,
						'nameColor': '#fff',
						"lineColor": '#fff',
						"xNameFontSize": 16,
						"yNameFontSize": 16,
						"labelShow": false,
						"labelShowFontSize": 14,
						"labelShowFontWeight": 300,
						"yAxisInverse": false,
						"xAxisInverse": false,
						'xAxisShow': true,
						"yAxisShow": true,
						"xAxisSplitLineShow": false,
						"yAxisSplitLineShow": false,
						"refresh": 3000,
						"barWidth": 30,
						"barRadius": 0,
						"barColor": [{
							"color1": '#f66923',
							"color2": '#80f03f',
							"postion": 90
						}, {
							"color1": '#4de5c4',
							'color2': '#0affbe',
							"postion": 50
						}],
						"barMinHeight": 2,
						"areaStyleOpacity": 0,
						"areaStyle": true
					}
				}
			}
		}, {
			"img": './report/public/img/chart/line5.png',
			"text": '折线图',
			"icon": 'icon-tubiaozhexiantu',
			"option": {
				"name": "折线图",
				"title": "折线图",
				"data": barData,
				"dataType": 0,
				"dataMethod": 'get',
				"url": mockUrl + "/bar",
				"parameter": '',
				"time": 5000,
				"component": {
					"width": 1200,
					"height": 600,
					"name": "line",
					"prop": "line",
					"option": {
						"itemWidth": 15, //图例宽度
						"itemHeight": 15, //图例高度
						"symbol": true, // 标记点显图/隐藏
						"smooth": true, //平滑曲线设置
						"gridX": 105,
						"gridY": 50,
						"gridX2": 80,
						"gridY2": 100,
						"nameColor": "#fff",
						"lineColor": "#fff",
						"lineWidth": 5,
						"xNameFontSize": 16,
						"yNameFontSize": 16,
						"labelShow": true,
						"labelShowFontSize": 14,
						"labelShowFontWeight": 300,
						"yAxisInverse": false,
						"xAxisInverse": false,
						"xAxisShow": true,
						"yAxisShow": true,
						"xAxisSplitLineShow": false,
						"yAxisSplitLineShow": false,
						"barWidth": 30,
						"barRadius": 8,
						"barColor": [{
							"color1": "#f6acf0",
							"color2": "#c530f0",
							"postion": 90,
							"$index": 0,
							"_show": true
						}, {
							"color1": "#a096e5",
							"color2": "#5e27ff",
							"postion": 50,
							"$index": 1,
							"_show": true
						}],
						"barMinHeight": 2
					}
				},
			}
		}]
	}, {
		"label": '折柱图',
		"icon": 'icon-zhezhutu',
		"listImg": [{
			"img": './report/public/img/chart/line3.png',
			"text": '折柱图',
			"icon": 'icon-zhezhutu',
			"option": {
				"name": "折柱图",
				"title": "折柱图",
				"dataType": 0,
				"data": lineBarData2,
				"dataMethod": 'get',
				"url": mockUrl + "/protal",
				"parameter": '',
				"time": 5000,
				"component": {
					"width": 1200,
					"height": 800,
					"name": "terminal",
					"prop": "terminal",
					"option": {
						"itemWidth": 15, //图例宽度
						"itemHeight": 15, //图例高度
						"symbol": true, // 标记点显图/隐藏
						"smooth": true, //平滑曲线设置
						"gridX": 105,
						"gridY": 50,
						"gridX2": 80,
						"gridY2": 100,
						"nameColor": "#fff",
						"lineColor": "#fff",
						"lineWidth": 5,
						"xNameFontSize": 16,
						"yNameFontSize": 16,
						"labelShow": true,
						"labelShowFontSize": 14,
						"labelShowFontWeight": 300,
						"yAxisInverse": false,
						"xAxisInverse": false,
						"xAxisShow": true,
						"yAxisShow": true,
						"xAxisSplitLineShow": false,
						"yAxisSplitLineShow": false,
						"barWidth": 30,
						"barRadius": 8,
						"barColor": [{
							"color1": "#f6acf0",
							"color2": "#c530f0",
							"postion": 90,
							"$index": 0,
							"_show": true
						}, {
							"color1": "#a096e5",
							"color2": "#5e27ff",
							"postion": 50,
							"$index": 1,
							"_show": true
						}],
						"barMinHeight": 2
					}
				},
			}
		}, {
			"img": './report/public/img/chart/line6.png',
			"text": '折柱图',
			"icon": 'icon-zhezhutu',
			"option": {
				"name": "折柱图",
				"title": "折柱图",
				"dataType": 0,
				"data": lineBarData,
				"dataMethod": 'get',
				"url": mockUrl + "/cross",
				"parameter": '',
				"time": 5000,
				"component": {
					"width": 1200,
					"height": 800,
					"name": "terminal",
					"prop": "terminal",
					"option": {
						"legend": true,
						"xAxisShow": true,
						"yAxisShow": true,
					}
				},
			}
		}]
	}, {
		"label": '饼图',
		"icon": 'icon-shujutubiaobingtu-',
		"listImg": [{
				"img": './report/public/img/chart/pie.png',
				"text": '玫瑰图',
				"icon": 'icon-shujutubiaobingtu-',
				"option": {
					"xAxisRotate": 0, //刻度标签旋转的角图
					"name": "饼图",
					"title": "饼图",
					"data": pieData,
					"dataType": 0,
					"dataMethod": 'get',
					"url": mockUrl + "/pie",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1200,
						"height": 600,
						"name": "pie",
						"prop": "pie",
						"option": {
							"itemWidth": 15, //图例宽度
							"itemHeight": 15, //图例高度
							"isRadius": false, //是否是环图
							"radius": "40%,55%", //半径设置
							"pieLabelPosition": "outside", //饼图标签的位图,默认外侧
							"labelShow": true,
							"barColor": [{
									"color1": "#a84239"
								},
								{
									"color1": "#a84239"
								},
								{
									"color1": "rgb(168,66,57)"
								},
								{
									"color1": "#a84239"
								},
								{
									"color1": "#a84239"
								}
							],
							"roseType": true
						}
					}
				}
			},
			{
				"img": './report/public/img/chart/pie2.png',
				"text": '饼图',
				"icon": 'icon-shujutubiaobingtu-',
				"option": {
					"xAxisRotate": 0, //刻度标签旋转的角图
					"name": "饼图",
					"title": "饼图",
					"data": pieData,
					"dataType": 0,
					"dataMethod": 'get',
					"url": mockUrl + "/pie",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1200,
						"height": 600,
						"name": "pie",
						"prop": "pie",
						"option": {
							"itemWidth": 15, //图例宽度
							"itemHeight": 15, //图例高度
							"isRadius": true, //是否是环图
							"radius": "40%,55%", //半径设置
							"pieLabelPosition": "outside", //饼图标签的位图,默认外侧
							"labelShow": true,
							"barColor": [{
									"color1": "rgba(158,255,176,1)"
								},
								{
									"color1": "#ff6a7b"
								},
								{
									"color1": "rgb(255,183,20)"
								},
								{
									"color1": "#ff9ad8"
								},
								{
									"color1": "#56caff"
								}
							],
							"roseType": false,
							"legend": true
						}
					}
				}
			}, {
				"img": './report/public/img/chart/pie3.png',
				"text": '环饼图',
				"icon": 'icon-shujutubiaobingtu-',
				"option": {
					"name": "饼图",
					"title": "饼图",
					"dataType": 0,
					"dataMethod": 'get',
					"time": 5000,
					"url": mockUrl + "/pie",
					"parameter": '',
					"data": pieData,
					"resize": false,
					"component": {
						"width": 588,
						"height": 340,
						"name": "pie",
						"prop": "pie",
						"option": {
							"itemWidth": 15, //图例宽度
							"itemHeight": 15, //图例高度
							"isRadius": false, //是否是环图
							"radius": "40%,55%", //半径设置
							"pieLabelPosition": "outside", //饼图标签的位图,默认外侧
							"labelShow": true,
							"barColor": [{
									"color1": "#ffcda7"
								},
								{
									"color1": "#e5a1a4"
								},
								{
									"color1": "rgb(175,212,157)"
								},
								{
									"color1": "#bda3f0"
								},
								{
									"color1": "#91caff"
								}
							]
						}
					},
				}
			}
		]
	}, {
		"label": '环形图',
		"icon": 'icon-shujutubiaobingtu-',
		"listImg": [{
			"img": './report/public/img/chart/line4.png',
			"text": '环形图',
			"icon": 'icon-shujutubiaobingtu-',
			"option": {
				"xAxisRotate": 0, //刻度标签旋转的角图
				"name": "环形图",
				"title": "环形图",
				"data": {
					"label": "人数增涨",
					"value": 40,
					"data": 80
				},
				"dataType": 0,
				"dataMethod": 'get',
				"url": mockUrl + "/ring",
				"parameter": '',
				"time": 5000,
				"component": {
					"width": 620,
					"height": 665,
					"option": {
						"type": "line",
						"strokeWidth": 30,
						"color": "rgba(154, 168, 212, 1)",
						"fontSize": 120,
						"fontWeight": "normal",
						"suffixColor": "rgba(154, 168, 212, 1)",
						"suffixFontSize": 80,
						"suffixFontWeight": "normal",
						"borderColor": "#564AA3",
						"split": 20,
						"width": 400,
						"height": 80
					},
					"name": "progress",
					"prop": "progress"
				},
				"index": 25
			}
		}, {
			"img": './report/public/img/chart/ring.png',
			"text": '环形图',
			"icon": 'icon-DoughnutPie',
			"option": {
				"title": "环形图",
				"name": "环形图",
				"top": 0,
				"left": 0,
				"dataType": 0,
				"time": 5000,
				"dataMethod": 'get',
				"url": mockUrl + "/ring",
				"parameter": '',
				"data": {
					"label": "人数增涨",
					"value": 40,
					"data": 80
				},
				"component": {
					"width": 620,
					"height": 665,
					"option": {
						"type": "circle",
						"strokeWidth": 30,
						"color": "rgba(154, 168, 212, 1)",
						"fontSize": 120,
						"fontWeight": "normal",
						"suffixColor": "rgba(154, 168, 212, 1)",
						"suffixFontSize": 80,
						"suffixFontWeight": "normal",
						"borderColor": "#564AA3",
						"split": 20,
						"width": 400,
						"height": 80
					},
					"name": "progress",
					"prop": "progress"
				},
				"index": 25
			}
		}],

	}, {
		"label": '象形图',
		"icon": "icon-zujian-xiangxingzhuzhuangtu",
		"listImg": [{
			"img": './report/public/img/chart/xiang.png',
			"text": '条形',
			"icon": "icon-zujian-xiangxingzhuzhuangtu",
			"option": {
				"title": "象形图",
				"name": "象形图",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/pie",
				"parameter": '',
				"data": pieData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "pictorialbar",
					"prop": "pictorialbar",
					"option": {
						"valueShow": true,
						"symbolSize": 30,
						"symbol": 'data:image/png;base64,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',
						"split": 30,
						"fontSize": '24',
						"xAxisShow": false,
						"yAxisShow": true,
						"color": '#4dffff',
						"nameColor": '#fff',
						"xNameFontSize": '24',
						"yNameFontSize": '24',
					}
				}
			}
		}, {
			"img": './report/public/img/chart/xiang2.png',
			"text": '条形',
			"icon": "icon-zujian-xiangxingzhuzhuangtu",
			"option": {
				"title": "象形图",
				"name": "象形图",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/pie",
				"parameter": '',
				"data": pieData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "pictorialbar",
					"prop": "pictorialbar",
					"option": {
						"valueShow": true,
						"symbolSize": 30,
						"symbol": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAA2CAYAAADUOvnEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5tJREFUeNrcWE1oE0EUnp0kbWyUpCiNYEpCFSpIMdpLRTD15s2ePHixnj00N4/GoyfTg2fbiwdvvagHC1UQ66GQUIQKKgn1UAqSSFua38b3prPJZDs7s5ufKn0w7CaZ2W/fe9/73kyMRqNB3Nrj1zdn4RJ6du9T2u1a2iHYSxjP4d41oOHGQwAIwSUHIyh8/RA8XeiXh0kLGFoaXiTecw/hoTG4ZCSAaFkY0+BpsZceLtiAoV2FkepZSDk5EpppczBvpuuQCqx0YnkYcVVoqQYMyeCG+lFdaGkXeVOFNu4aEBalOBk6sbQrQF7gSdK5JXjuHXuYVIVyr0TZ0FjKDeCs6km7JYMUdrWAUVmZUBtmRnVPK+x6nIR2xomH06R35ggwJPeofWphr/W5UjPIxq8B2bKgE8C4HVHWvg+2gZjXj19PkdFztY7bk9TDCH/g6oafDPpaoMvZIRI5WyMB/0Hv++HkpTKE0kM+A+h20cPAfN4GuRyp9G+LMTW+z8rCLI8b46XO9zRcYZTde/j0AZm8WGb3Y2F9KLlE2nqYkjFLJAsDOl/lea0q55mqxXcL7YBc++bsCPMe8mUyU2ZIpnCoblca6TZA/ga2Co8PGg7UGUlEDd0ueptglbrRZLLE7poti6pCaWUo2pu1oaYI1CF9b9cCZPO3F8ikJQ/rPpQT5YETht26ss+uCIL2Y8vHwJGpA96GI5mjOlaKhowUy6BcNcgIhDviTGWCGFaqEuufWz4pgcbCh+w0gEOyOjTlTtYYlIWPYWKEsLDzOs+nhzaO1KEpd+MXpOoTUgKiNyhdy5aSMPNVqxtSsJFgza5EWA4zKtCJ2OGbLn0JSLu8+SL4G86p1Fpr7ABXdGFF/UTD4rfmFYFw4G9VAJ9SM3aF8l3yok4/J6IV9sDVb36ynmtJ2M5+CwxTYBdKNMBaocKGV2nYgkz6r+cHBP30MzAfi4Sy+BebSoPIOi8PW1PpCCvr/KOD4k9Zu0WSH0Y0+SxJ2awp/nlwKtcGyHOJ8vNHtRJzhPlsHr8MogtlVtwUU0tSM1x58upSKbfJnSKUR07GVMKkDNfXpzpv0RTHy3nZMVx5IOWdZIaPabGFvfpwpjnvfmJHXLaEvZUTseu/TeLc+xgAPhEAb/PbjO6PBaOTf6LQRh/dERde23zxLtOXbaKNhfq2L/1fAOPHDUhOpIf5485h7l+GNHHiSYPKE3Myz9sFxoJuAyazvwIMAItferha5LTqAAAAAElFTkSuQmCC',
						"split": 30,
						"fontSize": '24',
						"xAxisShow": false,
						"yAxisShow": true,
						"color": '#4dffff',
						"nameColor": '#fff',
						"xNameFontSize": '24',
						"yNameFontSize": '24',
					}
				}
			}
		}, {
			"img": './report/public/img/chart/xiang3.png',
			"text": '条形',
			"icon": "icon-zujian-xiangxingzhuzhuangtu",
			"option": {
				"title": "象形图",
				"name": "象形图",
				"icon": "icon-zujian-xiangxingzhuzhuangtu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/pie",
				"parameter": '',
				"data": pieData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "pictorialbar",
					"prop": "pictorialbar",
					"option": {
						"valueShow": true,
						"symbolSize": 30,
						"split": 30,
						"fontSize": '24',
						"xAxisShow": false,
						"yAxisShow": true,
						"color": '#4dffff',
						"nameColor": '#ff6f19',
						"xNameFontSize": '24',
						"yNameFontSize": '24',
					}
				}
			}
		}],

	}, {
		"label": '雷达图',
		"icon": "icon-leidatu",
		"listImg": [{
			"img": './report/public/img/chart/rada.png',
			"text": '雷达图',
			"icon": "icon-leidatu",
			"option": {
				"title": "雷达图",
				"name": "雷达图",
				"icon": "icon-leidatu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/radar",
				"parameter": '',
				"data": radaData,
				"component": {
					"width": 970,
					"height": 500,
					"name": "radar",
					"prop": "radar",
					"option": {
						"itemWidth": 5, //图例宽度
						"itemHeight": 5, //图例高度
						"shape": 'polygon', //circle
						"radius": "75%",
						"splitNumber": 4,
						"radarNameColor": '#fff',
						"areaOpacity": 1,
						"radarNameSize": 15,
						"titleFontSize": 14,
						"legendShow": true,
						"labelShow": true,
						"barColor": [{
							"color1": "rgba(255,20,183,0.06)",
							"color2": "#f9b8b4",
							"color3": "#e96069",
							"postion": 90
						}]
					}
				}
			}
		}, {
			"img": './report/public/img/chart/rada2.png',
			"text": '雷达图',
			"icon": "icon-leidatu",
			"option": {
				"title": "雷达图",
				"name": "雷达图",
				"icon": "icon-leidatu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/radar",
				"parameter": '',
				"data": radaData,
				"component": {
					"width": 970,
					"height": 500,
					"name": "radar",
					"prop": "radar",
					"option": {
						"itemWidth": 5, //图例宽度
						"itemHeight": 5, //图例高度
						"shape": 'circle', //circle
						"radius": "75%",
						"splitNumber": 4,
						"radarNameColor": '#fff',
						"areaOpacity": 1,
						"radarNameSize": 15,
						"titleFontSize": 14,
						"legendShow": true,
						"labelShow": true,
						"barColor": [{
							"color1": "rgba(255,20,183,0.06)",
							"color2": "#f9b8b4",
							"color3": "#e96069",
							"postion": 90
						}]
					}
				}
			}
		}],
	}, {
		"label": '散点图',
		"icon": "icon-sandiantu",
		"listImg": [{
			"img": './report/public/img/chart/dot.png',
			"text": '散点图',
			"icon": "icon-sandiantu",
			"option": {
				"title": "散点图",
				"name": "散点图",
				"icon": "icon-sandiantu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/scatter",
				"parameter": '',
				"data": scatterData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "scatter",
					"prop": "scatter",
					"option": {
						"symbolSize": 30, //气泡大小
						"lineSize": 25,
						"xAxisShow": false, //x轴是否显图
						"yAxisShow": false, //y轴是否显图
						"xAxisSplitLineShow": true,
						"yAxisSplitLineShow": true,
						"scatterLabelPosition": "top", //标签位置
						"labelFormatter": "", //显示内容格式图
						"barColor": [{
							"postion": 0.2,
							"color1": '#ff9e97'
						}]
					}
				}
			}
		}, {
			"img": './report/public/img/chart/dot2.png',
			"text": '散点图',
			"icon": "icon-sandiantu",
			"option": {
				"title": "散点图",
				"name": "散点图",
				"icon": "icon-sandiantu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/scatter",
				"parameter": '',
				"data": scatterData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "scatter",
					"prop": "scatter",
					"option": {
						"symbolSize": 15, //气泡大小
						"lineSize": 25,
						"xAxisShow": true, //x轴是否显图
						"yAxisShow": true, //y轴是否显图
						"xAxisSplitLineShow": true,
						"yAxisSplitLineShow": true,
						"scatterLabelPosition": "top", //标签位置
						"labelFormatter": "", //显示内容格式图
						"barColor": [{
							"postion": 0.2,
							"color1": '#91c7ae'
						}]
					}
				}
			}
		}],

	}, {
		"label": '漏斗图',
		"icon": "icon-loudoutu",
		"listImg": [{
			"img": './report/public/img/chart/funnel.png',
			"text": '漏斗图',
			"option": {
				"title": "漏斗图",
				"name": "漏斗图",
				"icon": "icon-loudoutu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/funnel",
				"parameter": '',
				"data": funnelData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "funnel",
					"prop": "funnel",
					"option": {
						"switchTheme": true,
						"titleColor": '#666',
						"titleFontSize": 18,
						// legendShow: true,
						"labelShow": true,
						"radius": true,
						"width": '40%',
						"height": '45%',
						"left": '5%',
						"top": '5%',
						"sort": 'ascending',
						"funnelAlign": 'right',
						"center": ['25%', '75%'], // for pie
						"barColor": [{
								"color1": "#f6c5cf",
							},
							{
								"color1": "#e58b7c",
							},
							{
								"color1": "rgb(212,92,96)",
							},
							{
								"color1": "#f06845",
							},
							{
								"color1": "#a3220c",
							}
						]
					}
				}
			}
		}, {
			"img": './report/public/img/chart/funnel2.png',
			"text": '漏斗图',
			"icon": "icon-loudoutu",
			"option": {
				"title": "漏斗图",
				"name": "漏斗图",
				"icon": "icon-loudoutu",
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/funnel",
				"parameter": '',
				"data": funnelData,
				"component": {
					"width": 970,
					"height": 400,
					"name": "funnel",
					"prop": "funnel",
					"option": {
						"switchTheme": true,
						"width": '100%',
						"height": 600,
						"titleColor": '#666',
						"titleFontSize": 18,
						// legendShow: true,
						"labelShow": true,
						"radius": true,
						"sort": 'descending',
						'funnelAlign': 'center',
						"barColor": [{
								"color1": "#83bff6",
							},
							{
								"color1": "#23B7E5",
							},
							{
								"color1": "rgba(154, 168, 212, 1)",
							},
							{
								"color1": "#188df0",
							},
							{
								"color1": "#564AA3",
							}
						]
					}
				}
			}

		}],
	}]
}, {
	"label": '地图',
	"icon": 'icon-ditu',
	"charData": [{
			"label": '地图',
			"icon": "icon-chinamap-chart",
			"listImg": [{
				"img": './report/public/img/chart/map01.png',
				"text": '世界地图',
				"option": {
					"name": "世界地图",
					"title": "世界地图",
					"icon": "icon-chinamap-chart",
					"data": [],
					"dataMethod": "",
					"url": "",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1350,
						"height": 970,
						"name": "map",
						"prop": "map",
						"option": {
							"mapSelect": {
								"label": "世界地图",
								"name": "world"
							},
							"mapList": world_list,
							"borderWidth": 1,
							"scale": 100,
							"type": 0,
							"borderColor": "#0dffff",
							"areaColor": "#061d33",
							"banner": true,
							"bannerTime": 3000,
							"fontSize": 8,
							"zoom": 1,
							"empAreaColor": "rgba(35, 183, 229, 0.42)",
							"empColor": "#fff",
							"color": "rgba(13, 255, 255, 1)",
						}
					},
				},
			}, {
				"img": './report/public/img/chart/map2.png',
				"text": '中国地图',
				"icon": 'icon-ditu',
				"option": {
					"name": "地图",
					"title": "地图",
					"icon": "icon-chinamap-chart",
					"data": [],
					"dataMethod": "",
					"url": "",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1350,
						"height": 970,
						"name": "map",
						"prop": "map",
						"option": {
							"mapSelect": {
								"label": "中国",
								"name": "china"
							},
							"mapList": map_china,
							"borderWidth": 1,
							"scale": 87,
							"type": 0,
							"borderColor": "#0dffff",
							"areaColor": "#061d33",
							"banner": true,
							"bannerTime": 3000,
							"fontSize": 14,
							"zoom": 1,
							"empAreaColor": "rgba(35, 183, 229, 0.42)",
							"empColor": "#fff",
							"color": "rgba(13, 255, 255, 1)",
						}
					},
				},
			}],

		},
		{
			"label": "gallery",
			"icon": 'icon-zuobiao',
			"listImg": [{
				"img": './report/public/img/chart/map3.png',
				"text": '标记点地图',
				"option": {
					"name": "标记点地图",
					"title": "标记点地图",
					"icon": 'icon-zuobiao',
					"dataType": 0,
					"data": markGeoCoordMap,
					"dataMethod": "get",
					"url": mockUrl + "/markmap",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1200,
						"height": 800,
						"name": "markMap",
						"prop": "markMap",
						"option": {
							"borderColor": "#0dffff",
							"areaColor": "#061d33",
						}
					},
				}
			}, {
				"img": './report/public/img/chart/map6.png',
				"text": '出差图',
				"icon": 'icon-jiqiren',
				"option": {
					"title": "出差图",
					"name": "出差图",
					"icon": 'icon-jiqiren',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"time": 5000,
					"url": mockUrl + "/wuliu/list",
					"parameter": '',
					"dataMethod": 'get',
					"data": [
						//湖南
						[{
							name: '昆明'
						}, {
							name: '长沙',
							value: 162
						}],
						[{
							name: '昆明'
						}, {
							name: '张家界',
							value: 28
						}],
						[{
							name: '昆明'
						}, {
							name: '常德',
							value: 12
						}],
						[{
							name: '昆明'
						}, {
							name: '衡阳',
							value: 15
						}],
						[{
							name: '昆明'
						}, {
							name: '岳阳',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '湘潭',
							value: 6
						}],
						//云南
						[{
							name: '昆明'
						}, {
							name: '保山',
							value: 131
						}],
						[{
							name: '昆明'
						}, {
							name: '西双版纳',
							value: 101
						}],
						[{
							name: '昆明'
						}, {
							name: '临沧',
							value: 69
						}],
						[{
							name: '昆明'
						}, {
							name: '迪庆',
							value: 65
						}],
						[{
							name: '昆明'
						}, {
							name: '德宏',
							value: 80
						}],
						[{
							name: '昆明'
						}, {
							name: '普洱',
							value: 56
						}],
						[{
							name: '昆明'
						}, {
							name: '昭通',
							value: 74
						}],
						[{
							name: '昆明'
						}, {
							name: '丽江',
							value: 53
						}],
						[{
							name: '昆明'
						}, {
							name: '大理',
							value: 8
						}],
						[{
							name: '昆明'
						}, {
							name: '怒江',
							value: 14
						}],
						[{
							name: '昆明'
						}, {
							name: '文山',
							value: 12
						}],
						[{
							name: '昆明'
						}, {
							name: '玉溪',
							value: 2
						}],
						//单独
						[{
							name: '昆明'
						}, {
							name: '上海',
							value: 33
						}],
						[{
							name: '昆明'
						}, {
							name: '北京',
							value: 338
						}],
						[{
							name: '昆明'
						}, {
							name: '长春',
							value: 11
						}],
						[{
							name: '昆明'
						}, {
							name: '天津',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '银川',
							value: 4
						}],
						[{
							name: '昆明'
						}, {
							name: '乌鲁木齐',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '兰州',
							value: 6
						}],
						[{
							name: '昆明'
						}, {
							name: '重庆',
							value: 47
						}],
						//安徽
						[{
							name: '昆明'
						}, {
							name: '合肥',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '芜湖',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '六安',
							value: 2
						}],
						[{
							name: '昆明'
						}, {
							name: '淮南',
							value: 2
						}],
						//内蒙古
						[{
							name: '昆明'
						}, {
							name: '呼和浩特',
							value: 4
						}],
						[{
							name: '昆明'
						}, {
							name: '鄂尔多斯',
							value: 1
						}],
						[{
							name: '昆明'
						}, {
							name: '赤峰',
							value: 1
						}],
						[{
							name: '昆明'
						}, {
							name: '呼伦贝尔',
							value: 1
						}],
						[{
							name: '昆明'
						}, {
							name: '锡林郭勒',
							value: 1
						}],
						//四川
						[{
							name: '昆明'
						}, {
							name: '成都',
							value: 275
						}],
						[{
							name: '昆明'
						}, {
							name: '凉山',
							value: 31
						}],
						[{
							name: '昆明'
						}, {
							name: '宜宾',
							value: 2
						}],
						[{
							name: '昆明'
						}, {
							name: '德阳',
							value: 2
						}],
						[{
							name: '昆明'
						}, {
							name: '绵阳',
							value: 4
						}],
						//山东
						[{
							name: '昆明'
						}, {
							name: '威海',
							value: 4
						}],
						[{
							name: '昆明'
						}, {
							name: '青岛',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '济南',
							value: 28
						}],
						//山西
						[{
							name: '昆明'
						}, {
							name: '大同',
							value: 24
						}],
						[{
							name: '昆明'
						}, {
							name: '太原',
							value: 43
						}],
						[{
							name: '昆明'
						}, {
							name: '运城',
							value: 18
						}],
						[{
							name: '昆明'
						}, {
							name: '吕梁',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '长治',
							value: 5
						}],
						//广东
						[{
							name: '昆明'
						}, {
							name: '广州',
							value: 228
						}],
						[{
							name: '昆明'
						}, {
							name: '深圳',
							value: 20
						}],
						[{
							name: '昆明'
						}, {
							name: '梅州',
							value: 40
						}],
						[{
							name: '昆明'
						}, {
							name: '东莞',
							value: 6
						}],
						[{
							name: '昆明'
						}, {
							name: '清远',
							value: 3
						}],
						[{
							name: '昆明'
						}, {
							name: '珠海',
							value: 6
						}],
						[{
							name: '昆明'
						}, {
							name: '揭阳',
							value: 5
						}],
						//广西
						[{
							name: '昆明'
						}, {
							name: '南宁',
							value: 54
						}],
						[{
							name: '昆明'
						}, {
							name: '钦州',
							value: 20
						}],
						[{
							name: '昆明'
						}, {
							name: '桂林',
							value: 12
						}],
						[{
							name: '昆明'
						}, {
							name: '柳州',
							value: 6
						}],
						[{
							name: '昆明'
						}, {
							name: '北海',
							value: 5
						}],
						//江苏
						[{
							name: '昆明'
						}, {
							name: '南京',
							value: 81
						}],
						[{
							name: '昆明'
						}, {
							name: '苏州',
							value: 10
						}],
						[{
							name: '昆明'
						}, {
							name: '南通',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '无锡',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '常州',
							value: 7
						}],
						//江西
						[{
							name: '昆明'
						}, {
							name: '南昌',
							value: 58
						}],
						[{
							name: '昆明'
						}, {
							name: '吉安',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '赣州',
							value: 15
						}],
						[{
							name: '昆明'
						}, {
							name: '抚州',
							value: 7
						}],
						[{
							name: '昆明'
						}, {
							name: '萍乡',
							value: 6
						}],
						//河北
						[{
							name: '昆明'
						}, {
							name: '保定',
							value: 3
						}],
						[{
							name: '昆明'
						}, {
							name: '廊坊',
							value: 14
						}],
						[{
							name: '昆明'
						}, {
							name: '石家庄',
							value: 9
						}],
						[{
							name: '昆明'
						}, {
							name: '秦皇岛',
							value: 3
						}],
						//河南
						[{
							name: '昆明'
						}, {
							name: '南阳',
							value: 4
						}],
						[{
							name: '昆明'
						}, {
							name: '信阳',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '焦作',
							value: 4
						}],
						[{
							name: '昆明'
						}, {
							name: '郑州',
							value: 31
						}],
						//浙江
						[{
							name: '昆明'
						}, {
							name: '宁波',
							value: 4
						}],
						[{
							name: '昆明'
						}, {
							name: '杭州',
							value: 51
						}],
						[{
							name: '昆明'
						}, {
							name: '温州',
							value: 2
						}],
						//海南
						[{
							name: '昆明'
						}, {
							name: '三亚',
							value: 3
						}],
						[{
							name: '昆明'
						}, {
							name: '东方',
							value: 32
						}],
						[{
							name: '昆明'
						}, {
							name: '海口',
							value: 14
						}],
						//湖北
						[{
							name: '昆明'
						}, {
							name: '宜昌',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '武汉',
							value: 64
						}],
						//福建
						[{
							name: '昆明'
						}, {
							name: '厦门',
							value: 7
						}],
						[{
							name: '昆明'
						}, {
							name: '福州',
							value: 2
						}],
						//西藏
						[{
							name: '昆明'
						}, {
							name: '拉萨',
							value: 24
						}],
						[{
							name: '昆明'
						}, {
							name: '日喀则',
							value: 5
						}],
						[{
							name: '昆明'
						}, {
							name: '昌都',
							value: 14
						}],
						[{
							name: '昆明'
						}, {
							name: '阿里',
							value: 3
						}],
						//贵州
						[{
							name: '昆明'
						}, {
							name: '毕节',
							value: 7
						}],
						[{
							name: '昆明'
						}, {
							name: '贵阳',
							value: 20
						}],
						[{
							name: '昆明'
						}, {
							name: '黔东南',
							value: 7
						}],
						[{
							name: '昆明'
						}, {
							name: '兴义',
							value: 6
						}],
						//辽宁
						[{
							name: '昆明'
						}, {
							name: '大连',
							value: 3
						}],
						[{
							name: '昆明'
						}, {
							name: '沈阳',
							value: 15
						}],
						[{
							name: '昆明'
						}, {
							name: '阜新',
							value: 5
						}],
						//陕西
						[{
							name: '昆明'
						}, {
							name: '榆林',
							value: 16
						}],
						[{
							name: '昆明'
						}, {
							name: '西安',
							value: 42
						}],
						//青海
						[{
							name: '昆明'
						}, {
							name: '西宁',
							value: 3
						}],
						[{
							name: '昆明'
						}, {
							name: '海西',
							value: 1
						}],
						//哈尔滨
						[{
							name: '昆明'
						}, {
							name: '哈尔滨',
							value: 9
						}],
						[{
							name: '昆明'
						}, {
							name: '鹤岗',
							value: 3
						}],

					],
					"component": {
						"width": 1200,
						"height": 1000,
						"name": "markPointMap",
						"prop": "markPoint-map",
						"option": {
							"geoPointType": 1,
							"pointProvince": {
								"label": "昆明",
								"value": 100
							} //全国物流城市默认图
						},
					}
				},
			}, {
				"img": './report/public/img/chart/map5.png',
				"text": '迁徙地图',
				"icon": 'icon-jiqiren',
				"option": {
					"title": "迁徙地图",
					"name": "迁徙地图",
					"icon": 'icon-jiqiren',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"time": 5000,
					"url": mockUrl + "/wuliu/list",
					"parameter": '',
					"dataMethod": 'get',
					"data": [{
							"name": "四川省",
							"value": 100
						},
						{
							"name": "海南省"
						},
						{
							"name": "内蒙古自治区"
						}
					],
					"component": {
						"width": 1200,
						"height": 1000,
						"name": "coolrdMap",
						"prop": "coolrd-map",
						"option": {
							"geoCoordType": 1,
							"coolrdProvince": {
								"label": "昆明",
								"value": 100
							} //全国物流城市默认图
						},
					}

				}
			}],

		},
		{
			"label": '省份地图',
			"icon": "icon-chinamap-chart",
			"listImg": [{
				"img": './report/public/img/chart/map.png',
				"text": '湖南省',
				"option": {
					"name": "湖南省",
					"title": "湖南省",
					"icon": "icon-chinamap-chart",
					"data": [],
					"dataMethod": "",
					"url": "",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 1350,
						"height": 970,
						"name": "map",
						"prop": "map",
						"option": {
							"mapSelect": {
								"label": "湖南省",
								"name": "hunan"
							},
							"mapList": hunan_list,
							"borderWidth": 1,
							"scale": 87,
							"type": 0,
							"borderColor": "#0dffff",
							"areaColor": "#061d33",
							"banner": true,
							"bannerTime": 3000,
							"fontSize": 8,
							"zoom": 1,
							"empAreaColor": "rgba(35, 183, 229, 0.42)",
							"empColor": "#fff",
							"color": "rgba(13, 255, 255, 1)",
						}
					},
				},
			}, {
				"img": './report/public/img/chart/map4.png',
				"text": '北京市',
				"icon": 'icon-paijianwangdian',
				"option": {
					"title": "省份地图",
					"name": "省份地图",
					"icon": 'icon-paijianwangdian',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"dataMethod": 'get',
					"url": mockUrl + "/list",
					"parameter": '',
					"time": 10000,
					"data": [{
							"name": "东城区",
							"value": 120057.34
						},
						{
							"name": "西城区",
							"value": 15477.48
						}, {
							"name": "朝阳区",
							"value": 131686.1
						}
					],
					"component": {
						"width": 900,
						"height": 700,
						"name": "virualMap",
						"prop": "virual-map",
						"option": {
							"selectProvince": {
								"label": "北京",
								"name": "beijing"
							},
							"borderColor": "#0dffff",
							"areaColor": "#061d33",
							"banner": true,
							"bannerTime": 3000,
							"fontSize": 25,
							"zoom": 1,
							"empAreaColor": "rgba(35, 183, 229, 0.42)",
							"empColor": "#ff756b",
							"color": "rgba(13, 255, 255, 1)",
						},

					}

				}
			}],

		},
	]
}, {
	"label": '文字',
	"icon": 'icon-wenzi',
	"charData": [{
		"label": '文本图',
		"icon": 'icon-wenben',
		"listImg": [{
			"img": './report/public/img/chart/txt.png',
			"text": '文本图',
			"icon": 'icon-wenben',
			"option": {
				"title": "文本图",
				"name": "文本图",
				"icon": 'icon-wenben',
				"data": "文本图",
				"component": {
					"width": 100,
					"height": 50,
					"option": {
						"textAlign": "center",
						"fontSize": 26,
						"fontWeight": "normal",
						"color": "#fff"
					},
					"name": "text",
					"prop": "text"
				},
			},
		}],

	}, {
		"label": '跑马灯',
		"icon": 'icon-paomadeng',
		"listImg": [{
			"img": './report/public/img/chart/txt2.png',
			"text": '文本图',
			"option": {
				"title": "跑马灯",
				"name": "跑马灯",
				"icon": 'icon-paomadeng',
				"top": 0,
				"left": 0,
				"data": "跑马灯",
				"component": {
					"width": 100,
					"height": 50,
					"option": {
						"scroll": true,
						"speed": 70,
						"textAlign": "center",
						"fontSize": 26,
						"fontWeight": "normal",
						"color": "#fff"
					},
					"name": "text",
					"prop": "text"
				},
			},
		}],

	}, {
		"label": '超链接',
		"icon": 'icon-chaolianjie',
		"listImg": [{
			"img": './report/public/img/chart/txt3.png',
			"text": '文本图',
			"option": {
				"title": "超链接",
				"name": "超链接",
				"icon": 'icon-chaolianjie',
				"top": 0,
				"left": 0,
				"data": "超链接",
				"component": {
					"width": 100,
					"height": 50,
					"option": {
						"link": true,
						"linkHref": 'http://demo.topjui.com',
						"linkTarget": '_self',
						"textAlign": "center",
						"fontSize": 26,
						"fontWeight": "normal",
						"color": "#fff"
					},
					"name": "text",
					"prop": "text"
				},
			},
		}],

	}, {
		"label": '日期时间',
		"icon": 'icon-shijian',
		"listImg": [{
			"img": './report/public/img/chart/date.png',
			"text": '文本图',
			"option": {
				"name": "日期时间",
				"title": "日期时间",
				"icon": 'icon-shijian',
				"top": 78,
				"left": 1604,
				"zIndex": 31,
				"component": {
					"width": 250,
					"height": 50,
					"name": "datetime",
					"prop": "datetime",
					"option": {
						"format": 'yyyy-MM-dd hh:mm:ss',
						"color": "#fff",
						'textAlign': 'left',
						"fontSize": 24,
						"fontWeight": "normal"
					}
				}
			},
		}],
	}]
}, {
	"label": '媒体',
	"icon": 'icon-meiti',
	"charData": [{
			"label": '图片',
			"icon": 'icon-tupian',
			"listImg": [{
				"img": './report/public/img/chart/mei.png',
				"text": '图片',
				"icon": 'icon-tupian',
				"option": {
					"data": "./report/public/img/border/border45.png",
					"title": "图片",
					"name": "图片",
					"icon": 'icon-tupian',
					"top": 0,
					"left": 0,
					"component": {
						"width": 140,
						"height": 140,
						"name": "img",
						"prop": "img",
						"option": {
							"duration": '1000',
						}
					},
				}
			}],

		}, {
			"label": '图片框',
			"icon": 'icon-tupiankuang',
			"listImg": [{
				"img": './report/public/img/chart/mei2.png',
				"text": '图片框',
				"icon": 'icon-tupiankuang',
				"option": {
					"data": "./report/public/img/border/border37.png",
					"title": "图片框",
					"name": "图片框",
					"icon": 'icon-tupiankuang',
					"top": 0,
					"left": 0,
					"component": {
						"width": 140,
						"height": 140,
						"name": "imgborder",
						"prop": "imgborder",
						"option": {
							"backgroundColor": 'rgba(180, 181, 198, 0.1)',
						}
					},
				}
			}],
		}, {
			"label": '轮播图',
			"icon": 'icon-lunbotu',
			"listImg": [{
				"img": './report/public/img/chart/mei3.png',
				"text": '轮播图',
				"icon": 'icon-lunbotu',
				"option": {
					"title": "轮播图",
					"name": "轮播图",
					"icon": 'icon-lunbotu',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"dataMethod": 'get',
					"time": 5000,
					"url": mockUrl + "/swiper",
					"parameter": '',
					"data": [],
					"component": {
						"width": 670,
						"height": 370,
						"option": {
							"type": '',
							"interval": 5000,
							"opacity": 100,
							"indicator": 'none'
						},
						"name": "swiper",
						"prop": "swiper"
					},
				}
			}],

		}, {
			"label": '滑动组件',
			"icon": 'icon-slide-top',
			"listImg": [{
				"img": './report/public/img/chart/mei4.png',
				"text": '滑动组件',
				"icon": 'icon-slide-top',
				"option": {
					"title": "滑动组件",
					"name": "滑动组件",
					"icon": 'icon-slide-top',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"dataMethod": 'get',
					"time": 5000,
					"url": mockUrl + "/swiper",
					"parameter": '',
					"data": [],
					"component": {
						"width": 800,
						"height": 650,
						"option": {
							"bannData": `[
                                      {img_url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3406909267,3125948866&fm=26&gp=0.jpg'},
                                      {img_url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3406909267,3125948866&fm=26&gp=0.jpg'},
                                      {img_url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3406909267,3125948866&fm=26&gp=0.jpg'},
                                      {img_url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3406909267,3125948866&fm=26&gp=0.jpg'},
                                      {img_url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3406909267,3125948866&fm=26&gp=0.jpg'},
                                  ]`
						},
						"name": "slippage",
						"prop": "slippage"
					},
				}
			}],
		},
		{
			"label": 'iframe',
			"icon": 'icon-iframe',
			"listImg": [{
				"img": './report/public/img/chart/mei5.png',
				"text": 'iframe',
				"icon": 'icon-iframe',
				"option": {
					"title": "iframe",
					"name": "iframe",
					"icon": 'icon-iframe',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"data": {
						value: 'https://www.baidu.com'
					},
					"dataMethod": 'get',
					"url": mockUrl + "/iframe",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 670,
						"height": 370,
						"option": {},
						"name": "iframe",
						"prop": "iframe"
					},
				}
			}],
		}, {
			"label": 'video',
			"icon": 'icon-shipin',
			"listImg": [{
				"img": './report/public/img/chart/mei6.png',
				"text": 'video',
				"icon": 'icon-shipin',
				"option": {
					"title": "video",
					"name": "video",
					"icon": 'icon-shipin',
					"top": 0,
					"left": 0,
					"dataType": 0,
					"data": {
						"value": 'http://www.w3school.com.cn/i/movie.ogg'
					},
					"dataMethod": 'get',
					"url": mockUrl + "/video",
					"parameter": '',
					"time": 5000,
					"component": {
						"width": 670,
						"height": 370,
						"option": {},
						"name": "video",
						"prop": "video"
					},
				}
			}],

		}
	]
}, {
	"label": '指标',
	"icon": 'icon-zhibiao',
	"charData": [{
		"label": '翻牌器',
		"icon": 'icon-fanpaiqi',
		"listImg": [{
			"img": './report/public/img/chart/point.png',
			"text": 'video',
			"icon": 'icon-fanpaiqi',
			"option": {
				"title": "翻牌器",
				"name": "翻牌器",
				"icon": 'icon-fanpaiqi',
				"top": 0,
				"left": 0,
				"dataType": 0,
				"time": 5000,
				"dataMethod": 'get',
				"url": mockUrl + "/flop",
				"parameter": '',
				"data": {
					"value": '12345'
				},
				"component": {
					"width": 350,
					"height": 200,
					"name": "flop",
					"prop": "flop",
					"option": {
						"type": "img",
						"suffixText": "",
						"suffixTextAlign": "",
						"suffixSplit": '',
						"suffixColor": "",
						"suffixFontSize": '',
						"borderColor": "#fff",
						"borderWidth": 3,
						"backgroundBorder": "./img/border/border31.png",
						"fontSize": 42,
						"fontWeight": "normal",
						"splitx": 0,
						"splity": 0,
						"backgroundColor": "",
						"color": "#fff"
					}
				},
				"index": 10
			}
		}],

	}, {
		"label": '进度条',
		"icon": 'icon-jindutiao1',
		"listImg": [{
			"img": './report/public/img/chart/point2.png',
			"text": '进度条',
			"icon": 'icon-jindutiao1',
			"option": {
				"title": "进度条",
				"name": "进度条",
				"icon": 'icon-jindutiao1',
				"top": 0,
				"left": 0,
				"dataType": 0,
				"dataMethod": 'get',
				"url": mockUrl + "/progress",
				"parameter": '',
				"time": 5000,
				"data": {
					"label": "人数增涨",
					"value": 40,
					"data": 80
				},
				"component": {
					"width": 400,
					"height": 80,
					"option": {
						"type": "line",
						"color": "rgba(154, 168, 212, 1)",
						"fontSize": 24,
						"strokeWidth": 18,
						"fontWeight": "normal",
						"borderColor": "#564AA3",
						"width": 400,
						"height": 80
					},
					"name": "progress",
					"prop": "progress"
				},
				"index": 25
			}
		}],
	}, {
		"label": '仪表盘',
		"icon": 'icon-yibiaopan',
		"listImg": [{
			"img": './report/public/img/chart/point3.png',
			"text": '仪表盘',
			"icon": 'icon-yibiaopan',
			"option": {
				"title": "仪表盘",
				"icon": 'icon-yibiaopan',
				"name": "仪表盘",
				"data": {
					"min": 1,
					"max": 10,
					"label": "名称",
					"value": 2,
					"unit": "%"
				},
				"dataType": 0,
				"dataMethod": 'get',
				"time": 5000,
				"url": mockUrl + "/gauge",
				"parameter": '',
				"component": {
					"width": 390,
					"height": 314,
					"option": {
						"lineSize": 15,
						"axisLabelShow": false,
						"axisLabelFontSize": 25,
						"nameFontSize": 20,
						"valueFontSize": 30,
						"nameColor": "",
						"lineColor": "#eee",
						"barColor": [{
								"color1": "rgb(212,208,132)",
								"postion": "0.2",
							},
							{
								"color1": "#e5c55b",
								"postion": "0.8",
							},
							{
								"color1": "#ff800a",
								"postion": "1",
							}
						]
					},
					"name": "gauge",
					"prop": "gauge"
				},
			},
		}],
	}, {
		"label": '字符云',
		"icon": "icon-zifu",
		"listImg": [{
			"img": './report/public/img/chart/point4.png',
			"text": '字符云',
			"icon": "icon-zifu",
			"option": {
				"title": "字符云",
				"name": "字符云",
				"icon": "icon-zifu",
				"top": 725,
				"left": 3780,
				"dataType": 0,
				"dataMethod": 'get',
				"url": mockUrl + "/wordCloud",
				"parameter": '',
				"data": wordCloudData,
				"time": 5000,
				"component": {
					"name": "wordcloud",
					"prop": "wordcloud",
					"width": 955,
					"height": 565,
					"option": {
						"minFontSize": 30,
						"maxFontSize": 80,
						"split": 30,
						"rotate": true,
					}
				},
			}
		}],
	}]
}, {
	"label": '表格',
	"icon": 'icon-biaoge',
	"charData": [{
		"label": '表格',
		"icon": "icon-biaoge1",
		"listImg": [{
			"img": './report/public/img/chart/table.png',
			"text": '表格',
			"option": {
				"title": "表格",
				"name": "表格",
				"icon": "icon-biaoge1",
				"top": 220,
				"left": 196.25,
				"dataType": 0,
				"time": 5000,
				"dataMethod": "get",
				"url": mockUrl + "/table",
				"parameter": '',
				"data": [{
						"type1": "李元芳",
						"type2": "1"
					},
					{
						"type1": "刘志远",
						"type2": "2"
					},
					{
						"type1": "李元芳",
						"type2": "1"
					},
					{
						"type1": "刘志远",
						"type2": "2"
					},
					{
						"type1": "李元芳",
						"type2": "1"
					},
					{
						"type1": "刘志远",
						"type2": "2"
					},
					{
						"type1": "李元芳",
						"type2": "1"
					},
					{
						"type1": "刘志远",
						"type2": "2"
					},
					{
						"type1": "李元芳",
						"type2": "1"
					},
					{
						"type1": "刘志远",
						"type2": "2"
					}
				],
				"component": {
					"width": 915,
					"height": 688.75,
					"name": "table",
					"prop": "table",
					"option": {
						"headerBackground": "#E8D2FC",
						"headerColor": "#9AA8D4",
						"headerShow": true,
						"headerTextAlign": "center",
						"bodyBackground": "",
						"bodyColor": "#9AA8D4",
						"borderColor": "#33416B",
						"bodyTextAlign": "center",
						"lineHeight": 50,
						"nthColor": "#D2F8CA",
						"othColor": "#F9D8D8",
						"column": [{
								"label": "姓名",
								"prop": "type1",
								"$index": 0
							},
							{
								"label": "年龄",
								"prop": "type2",
								"$index": 1
							}
						],
						"menu": false,
						"align": "center",
						"headerAlign": "center",
						"header": false,
						"index": true
					}
				},
				"zIndex": 0,
				"index": 0
			}
		}],
	}, {
		"label": '选项卡',
		"icon": "icon-xuanxiangqia",
		"listImg": [{
			"img": './report/public/img/chart/tab.png',
			"text": '选项卡',
			"icon": "icon-xuanxiangqia",
			"option": {
				"title": "选项卡",
				"name": "选项卡",
				"icon": "icon-xuanxiangqia",
				"child": {
					"index": [],
					"paramName": ""
				},
				"dataType": 0,
				"data": [{
						"label": "标题一",
						"value": "1"
					},
					{
						"label": "标题二",
						"value": "2"
					}
				],
				"dataMethod": 'get',
				"time": 5000,
				"parameter": '',
				"url": mockUrl + "/tab",
				"component": {
					"width": 356.9128919860628,
					"height": 46.209059233449096,
					"option": {
						"type": 'tabs',
						"color": "#eee",
						"empColor": "#4dffff",
						"fontSize": 20,
						"split": 8,
						"empBackgroundImage": "./report/public/img/banner/banner5.png",
						"backgroundImage": "./report/public/img/banner/banner4.png"
					},
					"name": "tabs",
					"prop": "tabs"
				},
				"index": 36,
				"zIndex": 1
			},
		}],
	}]
}]
