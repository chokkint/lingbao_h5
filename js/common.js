/**
 * 构建获取app资源根目录函数
 */
function getContextPath() {
	var url = document.location.toString();
		
	//Android手机获取项目根目录
	if (url.indexOf("www") != -1) {
		url = url.substring(0, url.lastIndexOf("www") + 3);
	}else{
		//浏览器获取项目根目录
		var a = document.location.pathname.substring(1);
		var b = a.indexOf("/");
		var c =a.substring(0,b);
		url = document.location.origin + "/" + c;
	}
	return url;
}

var app_config = {
	version: '1.0.0',
}

/**
 * 引用共通js
 */

//MUI框架
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/mui.js?version=" + app_config.version + "'></script>");

//系统常量定义类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/constants.js?version=" + app_config.version + "'></script>");

//JQuery
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/jquery/3.4.1/jquery-3.4.1.min.js?version=" + app_config.version + "'></script>");

//MUI弹出选择框插件
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/mui/poppicker/mui.picker.js?version=" + app_config.version + "'></script>");
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/mui/poppicker/mui.poppicker.js?version=" + app_config.version + "'></script>");

//ARTTMPL插件
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/arttmpl/arttmpl.js?version=" + app_config.version + "'></script>");

//MD5加密插件
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/lib/md5.min.js?version=" + app_config.version + "'></script>");

//共通处理函数定义
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/sysUtils.js?version=" + app_config.version + "'></script>");

//系统工具类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/utils.js?version=" + app_config.version + "'></script>");

//系统自定义处理类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/app.js?version=" + app_config.version + "'></script>");
