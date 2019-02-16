// 渲染历史数据
function daoDrawHistory(){
    var historyArray = getLocalJson(DATA_HISTORY);
    var historyText = "";
    for(var i=0 ; i<historyArray.length; i++){
        var title =  historyArray[i].name;
        if( handerStr(title) == ""){
            title = handerStr(historyArray[i].url);
        }
        historyText += "<div class='history-div' crap-data='"+JSON.stringify(historyArray[i])+"'>" + title +"</div>";
    }
    $("#history").html(historyText);
}