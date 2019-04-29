/**
 * 构建获取app资源根目录函数
 */
function getContextPath() {
	var url = document.location.toString();				
	if(url.indexOf("/") != -1){
		url = url.substring(0,  url.lastIndexOf("/")) ;
	}
	return url;
}

/**
 * 引用共通js
 */

//MUI框架
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/mui.js'></script>");

//系统常量定义类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/constants.js'></script>");

//系统工具类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/utils.js'></script>");

//系统自定义处理类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/app.js'></script>");
