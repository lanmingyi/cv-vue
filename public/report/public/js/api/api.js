
function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params}).then(response => {
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    })
}

function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(response => {
            resolve(response.data)
        }, (err) => {
            console.log(err);
            reject(err)
        })
    })
}