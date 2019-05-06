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

/**
 * 引用共通js
 */

//MUI框架
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/mui.js'></script>");

//系统常量定义类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/constants.js'></script>");

//JQuery
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/jquery/3.4.1/jquery-3.4.1.min.js'></script>");

//MUI弹出选择框插件
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/mui/poppicker/mui.picker.js'></script>");
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/mui/poppicker/mui.poppicker.js'></script>");

//ARTTMPL插件
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/libs/arttmpl/arttmpl.js'></script>");

//共通处理函数定义
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/sysUtils.js'></script>");

//系统工具类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/utils.js'></script>");

//系统自定义处理类
document.writeln("<script type='text/javascript' src='" + getContextPath() + "/js/app.js'></script>");
