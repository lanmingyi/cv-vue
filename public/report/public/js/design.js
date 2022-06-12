$(function () {
    initSceneConfig()
})

function initSceneConfig() {
    var content = $("#content");

    // content.data("id", guid());
    // $("#scene").find('input[type=radio]').checkboxradio({
    //   icon: false
    // });
    $(".layout-Content").on('mousewheel', function (event) {
        var val = Math.abs(event.deltaFactor * event.deltaY) / 1000;
        var zoom = content.data("zoom") || 1
        if (event.deltaY > 0) { // 放大
            var temp = Number(zoom) + val;
            temp = temp > 5 ? 5 : temp;
            temp = temp.toFixed(1);
            content.css("transform", "scale(" + temp + ")");
            content.data("zoom", temp);
        } else {
            var temp = Number(zoom) - val;
            temp = temp < 0.2 ? 0.2 : temp;
            temp = temp.toFixed(1);
            content.css("transform", "scale(" + temp + ")");
            content.data("zoom", temp);
        }
    });
}