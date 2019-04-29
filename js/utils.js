/**
 * 系统共通方法定义
 * 引用该JS时必须先引用mui.js
 **/
(function($, owner) {
	/**
	* 构建获取app资源根目录函数
	*/
	owner.getContextPath = function() {
		var url = document.location.toString();				
		if(url.indexOf("/") != -1){
			url = url.substring(0,  url.lastIndexOf("/")) ;
		}
		return url;
	}
	
	/**
	 * ajax调用
	 * 使用POST方式,返回Json数据
	 **/
	owner.JAjax = function() {
		var result, url, data, onSuccess;
		for (var i = 0; i < arguments.length; i++) {
			var param = arguments[i];
			if (i == 0) {
				url = param;
			} else if($.type(param) == "object") {
				data = param;
			} else if($.type(param) == "function"){
				onSuccess = param;
			} else if (i == 1) {
				data = param;
			}
		}
		
		$.ajax({
			url : url,
			cache : false,
			async : false,
			type : "POST",
			data : data || "",
			dataType : "json",
			timeout : 300000,
			success : function(jsonResult) {
				console.log("11111111111");
				console.log(jsonResult);
				if (!jsonResult) {
					return;
				}
				if ((jsonResult[SysConstants.ERROR_CODE_KEY] == SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_SESSION_TIMEOUT)) {
					$.toast("登陆已经过期，即将重新登陆");
					return false;
				} else if ((jsonResult[SysConstants.ERROR_CODE_KEY] == SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_NO_ACCESS)) {
					$.alert("您没有权限访问此链接");
					return false;
				} else if ((jsonResult[SysConstants.ERROR_CODE_KEY] == SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_UNKNOWN_EXCEPTIONS)) {
					$.alert(jsonResult[SysConstants.ERROR_MESSAGE_KEY]);
					return false;
				}
				if (jsonResult) {
					result = jsonResult;
					if (onSuccess && $.type(onSuccess) == "function")
						onSuccess(jsonResult);
				} else {
					$.toast("no result");
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 400
						|| XMLHttpRequest.status == 500
						|| XMLHttpRequest.status == 404) {
					result = {error : "Connection Error"};
				} else {
					result = {error : "System Error"};
				}
			}
		});
		return result;
	};
}(mui, window.Utils = {}));