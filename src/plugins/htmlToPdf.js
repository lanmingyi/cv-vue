import html2canvas from "html2canvas"
import JsPDF from "jspdf"

/**

 * @param ele要生成 pdf 的DOM元素（容器）

 * @param padfName     PDF文件生成后的文件名字

 * */

export default {

    install(Vue, options) {
        Vue.prototype.getPdfFromHtml = function(ele, pdfFileName) {
		    console.log(pdfFileName)

            html2canvas(ele, {
                scale:2,
                background: "#FFFFFF",//如果指定的div没有设置背景色会默认成黑色,这里是个坑
                useCORS:true//允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
            }).then(canvas=> {
  
                //未生成pdf的html页面高度
                var leftHeight = canvas.height;

                var a4Width = 190
                var a4Height = 277   //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
                //一页pdf显示html页面生成的canvas高度;
                var a4HeightRef = Math.floor(canvas.width / a4Width * a4Height);

                console.log(canvas.width,leftHeight,a4HeightRef)

                //pdf页面偏移
                var position = 0;

                var pageData = canvas.toDataURL('image/jpeg', 1.0);

                var pdf = new JsPDF('p', 'mm', 'a4');    //A4纸，纵向
                var index = 1,
                    canvas1 = document.createElement('canvas'),
                    height;
                pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

                function createImpl(canvas) {
                    console.log(leftHeight,a4HeightRef)
                    if (leftHeight > 0) {
                        index++;
                        var checkCount = 0;
                        if (leftHeight > a4HeightRef) {
                            var i = position + a4HeightRef;
                            for (i = position + a4HeightRef; i >= position; i--) {
                                var isWrite = true
                                for (var j = 0; j < canvas.width; j++) {
                                    var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data
                                    if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                                        isWrite = false
                                        break
                                    }
                                }
                                if (isWrite) {
                                    checkCount++
                                    if (checkCount >= 10) {
                                        break
                                    }
                                } else {
                                    checkCount = 0
                                }
                            }
                            height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
                            if(height<=0){
                                height = a4HeightRef;
                            }
                        } else {
                            height = leftHeight;
                        }
                        canvas1.width = canvas.width;
                        canvas1.height = height;

                        var ctx = canvas1.getContext('2d');
                        ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);

                        var pageHeight = Math.round(a4Width / canvas.width * height);
                        if(position != 0){
                            pdf.addPage();
                        }
                        pdf.addImage(canvas1.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4Width, a4Width / canvas1.width * height);
                        leftHeight -= height;
                        position += height;
                        if (leftHeight > 0) {
                            setTimeout(createImpl, 200, canvas);
                        } else {
                            pdf.save(pdfFileName + '.pdf');
                        }
                    }
                }

                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < a4HeightRef) {
                    pdf.addImage(pageData, 'JPEG', 10, 10, a4Width, a4Width / canvas.width * leftHeight);
                    pdf.save(pdfFileName + '.pdf')
                } else {
                    try {
                        pdf.deletePage(0);
                        setTimeout(createImpl, 200, canvas);
                    } catch (err) {
                    }
                }
            })
        }
        // 将base64转换为blob
        Vue.prototype.dataURLtoBlob = function(dataurl) {
            var arr = dataurl.split(',')
            var mime = arr[0].match(/:(.*?);/)[1]
            var bstr = atob(arr[1])
            var n = bstr.length
            var u8arr = new Uint8Array(n)
            while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: mime })
        }
        // 将blob转换为file
        Vue.prototype.blobToFile = function(theBlob,fileName) {
            theBlob.lastModifiedDate = new Date()
            theBlob.name = fileName
            return theBlob
        }
    }
}