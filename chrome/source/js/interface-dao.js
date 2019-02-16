// 渲染接口
function queryInterfaceDAO(moduleId, callBack) {
    httpPost(MY_INTERFACE_LIST_URL, {"moduleId" : moduleId}, true, drawInterfaceDAO, moduleId);
}

function getInterfaceDAO(id) {
    return httpPost(MY_INTERFACE_DETAIL_URL, {"id" : id}, false, null, null);
}

function drawInterfaceDAO(response, moduleId) {
    var interfaceText = "";
    var interfaces = response.data;
    tip(response, 3, "接口加载成功！");
    for (var j = 0; j < interfaces.length; j++) {
        var interface = interfaces[j];
        interfaceText += interfaceDiv.replace(/ca_name/g, interface.interfaceName)
            .replace(/ca_id/g, interface.id)
            .replace(/ca_moduleId/g, interface.moduleId);

        // TODO 多种请求方式
        if (interface.method.indexOf("POST") >= 0) {
            interfaceText = interfaceText.replace("ca_methodIcon", "&#xe6c4;");
            interfaceText = interfaceText.replace("ca_method", "POST");
        } else {
            interfaceText = interfaceText.replace("ca_methodIcon", "&#xe645;");
            interfaceText = interfaceText.replace("ca_method", "GET");
        }
    }
    if(interfaces.length == 0){
        interfaceText = "<div class='interface pl30 pr20 f14 rel'>~尚未创建接口~</div>"
    }
    setHtml(ID_MODULE_INTERFACE + moduleId, interfaceText);
    setAttr(ID_MODULE_INTERFACE + moduleId, ATTR_HAS_LOAD_INTERFACE, true);
}