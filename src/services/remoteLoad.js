/*** 
 * @Description: 重载数据
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-15 09:53:17
 * @LastEditors: lmy
 * @FilePath:
 */
const remoteLoad = url => {
    return new Promise((resolve, reject) => {
        const existingScript = document.getElementById(url);
        //如果script不存在
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = url;
            script.src = url;
            script.async = true;
            document.body.appendChild(script);
            script.onload = function() {
                setTimeout(() => {
                    this.onerror = this.onload = null;
                    resolve();
                }, 500);
            };
            script.onerror = function() {
                this.onerror = this.onload = null;
                reject('加载失败' + url);
            };
        } else {
            setTimeout(() => {
                resolve();
            }, 500);
        }
    });
};

export default remoteLoad;