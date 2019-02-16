/*******网路请求*******/
function queryProjectDAO(callBack) {
    httpPost(MY_PROJECT_URL, {"myself":true, "pageSize": 100}, true, callBack);
}

// 渲染项目列表方法
function drawProjectDAO(response) {
    tip(response, 5);
    if (response.success == 0){
       // alert("错误码：" + response.error.code + "，错误信息" + response.error.message, 5, "error");
        return;
    }
    var projectArray = response.data;
    var projectListText = project_list_div;
    for (var i = 0; i < projectArray.length; i++) {
        var project = projectArray[i];
        projectListText += "<li><a href='#' id='id-def-project-id' class='pl10 pr10' " +
            "crap-data-project-name='" + project.name + "' crap-data-project-id='" + project.id+ "'>" + project.name + "</a></li>";
    }
    setHtml(ID_PROJECT_LIST, projectListText);
}