function getLoginInfoDAO(callBack) {
    httpPost(INIT_URL, {}, callBack);
}

function drawLoginInfoDAO(response) {
    if (response.success == 1){
        setHtml(ID_USER_NAME, "Hi, " + response.data.sessionAdminName + " !");
        showDiv(ID_USER_NAME);
        hiddenDiv(ID_LOGIN);
        showDiv(ID_LOGOUT);
    }
}

$("#" + ID_LOGOUT).click(function(){
    httpPost(LOGOUT_URL, {}, drawLogoutDAO);
});

function drawLogoutDAO(response) {
    tip(response, 5, "退出成功！");
    if (response.success == 1){
        hiddenDiv(ID_USER_NAME);
        showDiv(ID_LOGIN);
        hiddenDiv(ID_LOGOUT);
    }
}
