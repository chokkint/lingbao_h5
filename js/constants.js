/**
 * 系统用共通常量定义
 **/
(function(owner) {
	
	/**
	 * KEY字段常量定义
	 */
	owner.DATASET_KEY = "DATASET";
	owner.ERROR_CODE_KEY = "ERROR_CODE";
	owner.ERROR_MESSAGE_KEY = "ERROR_MESSAGE";
	
	/**
	 * 操作代码常量定义
	 */
	owner.ERROR_CODE_OBJECT  =  {
		"ERROR_CODE_ERROR" : "ERROR",
		"ERROR_CODE_EXISTED" : "EXISTED",
		"ERROR_CODE_SUCCESS" : "SUCCESS",
		"ERROR_CODE_NO_ACCESS" : "NO_ACCESS",
		"ERROR_CODE_SESSION_TIMEOUT" : "SESSION_TIMEOUT",
		"ERROR_CODE_UNKNOWN_EXCEPTIONS" : "UNKNOWN_EXCEPTIONS"
	};
	
	/**
	 * 常用系统提示信息定义
	 */
	owner.ERROR_MESSAGE_OBJECT_CN  =  {
		"ERROR_MESSAGE_ERROR" : "操作失败",
		"ERROR_MESSAGE_EXISTED" : "数据已存在",
		"ERROR_MESSAGE_SUCCESS" : "操作成功",
		"ERROR_MESSAGE_NO_ACCESS" : "权限不足",
		"ERROR_MESSAGE_SESSION_TIMEOUT" : "系统超时,请重新登陆",
		"ERROR_MESSAGE_UNKNOWN_EXCEPTIONS" : "未知异常,请联系管理员"
	};
	owner.ERROR_MESSAGE_OBJECT_EN  =  {
		"ERROR_MESSAGE_ERROR" : "Operate Failed",
		"ERROR_MESSAGE_EXISTED" : "Record has been existed",
		"ERROR_MESSAGE_SUCCESS" : "Operate Success",
		"ERROR_MESSAGE_NO_ACCESS" : "NO_ACCESS",
		"ERROR_MESSAGE_SESSION_TIMEOUT" : "Session Timeout, Please Login",
		"ERROR_MESSAGE_UNKNOWN_EXCEPTIONS" : "Unknown Exceptions, Please Contract Your System Manager!"
	};
}(window.SysConstants = {}));