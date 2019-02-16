// 常量
var paramsTr = "<tr class='last'>";
paramsTr += "<td><input type='text' class='form-control' data-stage='key'></td>";
paramsTr += "<td><input type='text' class='form-control' data-stage='value'></td>";
paramsTr += "<td class='w20'><i class='iconfont'>&#xe63f;</i></td>";
paramsTr += "</tr>";

var moduleDiv = "<div class='panel panel-info no-radius b0 mt0 left-menu-border-top'>";
moduleDiv += "      <div class='panel-heading no-radius rel' data-parent='#modules' crap-data-module-id='ca_moduleId'>";
moduleDiv += "          <div class='cursor' data-toggle='collapse' data-parent='#modules' href='#id-panel-ca_moduleId'>";
moduleDiv += "              <i class='iconfont color-main f16'>&#xe628;</i>&nbsp;&nbsp;  ca_moduleName";
moduleDiv += "          </div>";
moduleDiv += "      </div>";
moduleDiv += "      <div id='id-panel-ca_moduleId' class='panel-collapse BGEEE collapse out'>";
moduleDiv += "          <div id='id-module-interface-ca_moduleId' class='panel-body b0 p0' crap-data-has-load-interface='false'></div>";
moduleDiv += "       </div>";
moduleDiv += "   </div>";

var interfaceDiv = "<div crap-data-interface-id='ca_id' class='interface pl30 pr20 rel' title='ca_name'>";
interfaceDiv += "		<i class='iconfont ca_method'>ca_methodIcon</i>&nbsp;&nbsp;ca_name";
interfaceDiv += "	</div>";

var project_list_div = "<li><a href='javascript:void(0)' class='pl10 pr10'>切换项目</a></li>";
project_list_div += "<li role='separator' class='divider pl10 pr10'></li>";

// Custom param types
var customerTypes = ["text/plain", "application/json", "application/xml"];

/*************** 本地数据 ****************/
var BASE_PRE = "crap_debug_v1_"
var DATA_HISTORY = BASE_PRE + "history"; // 历史记录列表
var DATA_MODULE = BASE_PRE + "module"; // 模块列表
var DATA_INTERFACE = BASE_PRE + "interface_"; // 接口列表
var DATA_DEF_PROJECT_ID = BASE_PRE + "default_project_id"; // 默认项目ID
var DATA_DEF_PROJECT_NAME = BASE_PRE + "default_project_name"; // 默认项目名称

/*********** 服务器接口地址 **************/
var WEB_SITE_URL = "http://api.crap.cn";
var MY_PROJECT_URL = WEB_SITE_URL + "/user/project/list.do";
var MY_MODULE_URL = WEB_SITE_URL + "/user/module/list.do";
var MY_INTERFACE_LIST_URL = WEB_SITE_URL + "/user/interface/list.do";
var MY_INTERFACE_DETAIL_URL = WEB_SITE_URL + "/user/interface/detail.do";
var INIT_URL = WEB_SITE_URL + "/back/init.do";
var LOGOUT_URL = WEB_SITE_URL + "/back/loginOut.do";

/************** html id *****************/
var ID_DEF_PROJECT_NAME = "id-def-project-name";
var ID_USER_NAME = "id-user-name";
var ID_PROJECT_LIST = "id-project-list";
var ID_LOGIN = "id-login";
var ID_LOGOUT = "id-logout";
var ID_FLOAT = "id-float";
var ID_TIP = "id-tip";
var ID_MODULE_INTERFACE = "id-module-interface-";
var ID_MODULE = "id-module-";
var ID_URL = "id-url";
var ID_INTERFACE_ID = "id-interface-id";
var ID_INTERFACE_NAME = "id-interface-name";
var ID_MODULE_ID = "id-module-id";
var ID_HEADERS_BULK_VALUE = "id-headers-bulk-value";
var ID_METHOD = "id-method";
var ID_PARAM_TYPE = "id-param-type";
var ID_PARAMS_BULK_VALUE = "id-params-bulk-value";
var ID_CUSTOMER_TYPE = "id-customer-type";
var ID_CONTENT_TYPE = "id-content-type";
var ID_CUSTOMER_TYPE_SELECT = "id-customer-type-select";

/************* attr ***************/
var BASE_ATTR_PRE = "crap-data-";
var ATTR_PROJECT_ID = BASE_ATTR_PRE + "project-id";
var ATTR_PROJECT_NAME = BASE_ATTR_PRE + "project-name";
var ATTR_HAS_LOAD_INTERFACE = BASE_ATTR_PRE + "has-load-interface";
var ATTR_MODULE_ID = BASE_ATTR_PRE + "module-id";
var ATTR_INTERFACE_ID = BASE_ATTR_PRE + "interface-id";
var ATTR_HEADER_OR_PARAM = BASE_ATTR_PRE + "header-or-param";