function adapterGetInterface(interfaceInfo) {
    if (!interfaceInfo){
        return getNewInterface();
    }
    interfaceInfo = interfaceInfo.data;
    var paramStr = interfaceInfo.param;
    // 服务器端参数和插件参数相互转换
    if (interfaceInfo.paramType == 'FORM'){
        var paramArray = interfaceInfo.crShowParamList;
        var bulkParams = "";
        for(var i=0; i<paramArray.length; i++){
            var p = paramArray[i].realName + ":" + paramArray[i].def;
            if( p != ":"){
                bulkParams += p + "\n";
            }
        }
        paramStr = bulkParams;
    }

    // 服务器请求头和插件请求头互相转换
    var headerArray = interfaceInfo.crShowHeaderList;
    var headerStr = "";
    var paramType = (interfaceInfo.paramType == 'FORM' ? "x-www-form-urlencoded;charset=UTF-8" : "application/json");
    for(var i=0; i<headerArray.length; i++){
        var p = headerArray[i].realName + ":" + headerArray[i].def;
        if( p != ":"){
            // TODO 服务器支持paramType 存储
            // 取请求头中的 content-type
            if (headerArray[i].realName.toUpperCase() == 'CONTENT-TYPE' && headerArray[i].def){
                paramType = headerArray[i].def;
            }
            headerStr += p + "\n";
        }
    }


    return {
        "paramType": paramType,
        "moduleId": interfaceInfo.moduleId,
        "id": interfaceInfo.id,
        "name": handerStr(interfaceInfo.interfaceName),
        "method": interfaceInfo.method,
        "url": interfaceInfo.fullUrl,
        "params": paramStr,
        "headers": headerStr
    };
}

function getNewInterface() {
    return {
        "paramType": null,
        "moduleId": null,
        "id": "-1",
        "name": null,
        "method": null,
        "url": null,
        "params": null,
        "headers": null
    };
}

