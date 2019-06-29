// 监听消息
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if(request.contentType == false || request.contentType == 'application/octet-stream'){
            sendResponse({event:'result.complete',data:{
                type:'error',
                readyState:500,
                statusText:'500',
                responseText:'不支持文件上传'
            }});
            return false;
        }
        request.beforeSend = function (xhr) {
            xhr.beginTime = Date.now();
        };
        request.complete = function (xhr, requestStatus) {
            var useTime = Date.now() - xhr.beginTime;
            sendResponse({
                event:'result.complete',
                data:{
                    requestStatus: requestStatus,
                    text: (xhr.responseText || xhr.statusText),
                    headers: xhr.getAllResponseHeaders(),
                    readyState: xhr.readyState,
                    responseText: xhr.responseText,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    useTime: useTime,
                    url: request.url
                }
            });
        };
        $.ajax(request);
        return true;
    });

