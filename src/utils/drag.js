import Vue from 'vue'
// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {

        //弹框可拉伸最小宽高
        let minWidth = 520;

        let minHeight = 300;

        let isFullScreen = false

        //当前宽高

        let nowWidth = 0;

        let nowHight = 0;

        //当前顶部高度

        let nowMarginTop = 0;

        // 自定义属性，判断是否可拖拽　
        if (!binding.value) return
            //获取弹框头部
        const dialogHeaderEl = el.querySelector('.ant-modal-header')
            //获取弹框
        const dragDom = el.querySelector('.ant-modal') ? el.querySelector('.ant-modal') : el.querySelector('.ant-modal-content')

        //获取弹框
        const dragDomBody = el.querySelector('.ant-modal-body');

        const fullscreenBox = el.querySelector('.fullscreenBox');

        const fullscreen = el.querySelector('.fullscreen');
        const title = el.querySelector('.ant-modal-title');
        const footer = el.querySelector('.ant-modal-footer');


        if (dialogHeaderEl) dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';'

        //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；

        dragDom.style.overflow = "auto";

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = (function() {
            if (document.body.currentStyle) {
                // 在ie下兼容写法
                return (dom, attr) => dom.currentStyle[attr]
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr]
            }
        })()
        console.log(fullscreen)
        if (fullscreen) {

            nowHight = 0;

            nowMarginTop = "131px";

            nowWidth = 640;

            dragDom.style.left = 0;

            dragDom.style.top = 0;
            console.log(dragDom.style.top)

            dragDom.style.height = "100VH";

            dragDom.style.width = "100VW";

            let theight = ''
            if (title && footer) {
                theight = document.body.clientHeight - 96 + 'px';
            } else if (title && !footer) {
                theight = document.body.clientHeight - 53 + 'px';
            } else if (!title && footer) {
                theight = document.body.clientHeight - 43 + 'px';
            } else {
                theight = document.body.clientHeight - 20 + 'px'
            }
            dragDomBody.style.minHeight = theight

            dragDom.style.marginTop = 0;

            isFullScreen = true;

            dialogHeaderEl.style.cursor = 'initial';

            dialogHeaderEl.onmousedown = null;
        }

        let moveDown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft
            const disY = e.clientY - dialogHeaderEl.offsetTop

            const screenWidth = document.body.clientWidth // body当前宽度
            const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

            const dragDomWidth = dragDom.offsetWidth // 对话框宽度
            const dragDomheight = dragDom.offsetHeight // 对话框高度

            const minDragDomLeft = dragDom.offsetLeft
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

            const minDragDomTop = dragDom.offsetTop
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

            // 获取到的值带px 正则匹配替换
            let styL = sty(dragDom, 'left')
                // 为兼容ie　
            if (styL === 'auto') styL = '0px'
            let styT = sty(dragDom, 'top')

            // console.log(styL)
            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
                styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
            } else {
                styL = +styL.replace(/px/g, '')
                styT = +styT.replace(/px/g, '')
            };

            document.onmousemove = function(e) {

                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX
                let top = e.clientY - disY
                    // console.log(top,maxDragDomTop)
                    // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -(minDragDomLeft)
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }

                if (-(top) > minDragDomTop) {
                    top = -(minDragDomTop)
                } else if (top > maxDragDomTop) {
                    // top = maxDragDomTop
                    // console.log(dragDomheight+maxDragDomTop < screenHeight)
                    if (maxDragDomTop > 0) {
                        top = maxDragDomTop
                    } else { top = 0 }
                    // console.log(dragDomheight,maxDragDomTop , screenHeight)
                }
                // console.log(top,maxDragDomTop)

                // 移动当前元素
                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
            }
            document.onmouseup = function(e) {
                document.onmousemove = null
                document.onmouseup = null
            }
            return false
        }

        if (dialogHeaderEl) dialogHeaderEl.onmousedown = moveDown;

        if (fullscreenBox) {
            fullscreenBox.onclick = (e) => {
                if (!isFullScreen) {

                    nowHight = dragDom.clientHeight;

                    nowWidth = dragDom.clientWidth;

                    nowMarginTop = dragDom.style.top;

                    dragDom.style.left = 0;

                    dragDom.style.top = 0;

                    dragDom.style.height = "100VH";

                    dragDom.style.width = "100VW";

                    let theight = ''
                    if (title && footer) {
                        theight = document.body.clientHeight - 96 + 'px';
                    } else if (title && !footer) {
                        theight = document.body.clientHeight - 53 + 'px';
                    } else if (!title && footer) {
                        theight = document.body.clientHeight - 43 + 'px';
                    } else {
                        theight = document.body.clientHeight - 0.3 + 'px'
                    }

                    dragDomBody.style.minHeight = theight

                    dragDom.style.marginTop = 0;

                    isFullScreen = true;

                    dialogHeaderEl.style.cursor = 'initial';

                    dialogHeaderEl.onmousedown = null;

                } else {

                    dragDom.style.height = "auto";

                    dragDom.style.width = nowWidth + 'px';

                    dragDom.style.top = nowMarginTop;

                    isFullScreen = false;

                    dragDomBody.style.minHeight = nowHight === 0 ? "auto" : nowHight - 96 + 'px';

                    dialogHeaderEl.style.cursor = 'move';

                    dialogHeaderEl.onmousedown = moveDown;

                }
            }
        }

        dragDom.onmousemove = function(e) {
            let moveE = e;
            if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
                dragDom.style.cursor = 'w-resize';
            } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 40) {
                dragDom.style.cursor = 's-resize';
            } else {
                dragDom.style.cursor = 'default';
                dragDom.onmousedown = null;
            }

            dragDom.onmousedown = (e) => {

                const clientX = e.clientX;

                const clientY = e.clientY;

                let elW = dragDom.clientWidth;

                let elH = dragDom.clientHeight;

                let EloffsetLeft = dragDom.offsetLeft;

                let EloffsetTop = dragDom.offsetTop;

                dragDom.style.userSelect = 'none';

                let ELscrollTop = el.scrollTop;

                //判断点击的位置是不是为头部

                if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {
                    //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
                    //左侧鼠标拖拽位置
                    if (clientY > EloffsetTop && clientY < EloffsetTop + 10) {
                        //往左拖拽
                        if (clientY > e.clientY) {
                            dragDom.style.height = elH + (clientY - e.clientY) * 2 + 'px';
                        }
                        //往右拖拽
                        if (clientY < e.clientY) {
                            if (dragDom.clientHeight < minHeight) {} else {
                                dragDom.style.height = elH - (e.clientY - clientY) * 2 + 'px';
                            }
                        }
                    }
                } else {
                    document.onmousemove = function(e) {
                        // e.preventDefault(); // 移动时禁用默认事件
                        //左侧鼠标拖拽位置
                        if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                            //往左拖拽
                            if (clientX > e.clientX) {
                                dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
                            }
                            //往右拖拽
                            if (clientX < e.clientX) {
                                console.log(dragDom.clientWidth < minWidth)
                                if (dragDom.clientWidth < minWidth) {} else {
                                    dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
                                }
                            }
                        }
                        //右侧鼠标拖拽位置
                        if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
                            //往左拖拽
                            if (clientX > e.clientX) {
                                if (dragDom.clientWidth < minWidth) {} else {
                                    dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
                                }
                            }
                            //往右拖拽
                            if (clientX < e.clientX) {
                                dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
                            }
                        }
                        // //底部鼠标拖拽位置
                        // if (ELscrollTop + clientY > EloffsetTop + elH - 50 && ELscrollTop + clientY < EloffsetTop + elH) {
                        //     //往上拖拽
                        //     console.log(dragDom.clientHeight, minHeight, dragDomheight)
                        //     if (clientY > e.clientY) {
                        //         if (dragDom.clientHeight - 30 < minHeight) {
                        //             return false
                        //         } else {
                        //             // dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px';
                        //             dragDomBody.style.height = elH + e.clientY - clientY + 10 - 95 + 'px'; //改变弹窗的主体内容
                        //         }
                        //     }
                        //     //往下拖拽
                        //     if (clientY < e.clientY) {
                        //         dragDomBody.style.height = elH + e.clientY - clientY - 95 + 'px'; //改变弹窗的主体内容
                        //         // dragDom.style.height = elH + e.clientY - clientY - 50 + 'px';
                        //         // console.log(dragDom.style.height,elH ,e.clientY,clientY)
                        //     }
                        // }
                    };
                    //拉伸结束
                    document.onmouseup = function(e) {

                        document.onmousemove = null;

                        document.onmouseup = null;
                    };
                }
            }
        }
    }
})