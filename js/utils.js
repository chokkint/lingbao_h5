/**
 * 系统共通方法定义
 * 引用该JS时必须先引用mui.js
 **/
(function($, owner) {

	/**
	 * @description 构建获取app资源根目录函数
	 */
	owner.getContextPath = function() {
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
	 * @description 打开新窗口,并传递参数
	 * @param {Object} url 新窗口URL
	 * @param {Object} params 传递的参数
	 */
	owner.openWebView = function(url, params){
		var option = {};
		option.show = {
			aniShow: 'pop-in'
		}
		option.url = url;
		option.id = url;
		if(params && $.type(params) == "object"){
			option.extras = params;
		}
		$.openWindow(option);
	}

	/**
	 *@description ajax调用 使用POST方式,返回Json数据
	 **/
	owner.JAjax = function() {
		var result, url, data, onSuccess;
		for (var i = 0; i < arguments.length; i++) {
			var param = arguments[i];
			if (i == 0) {
				url = param;
			} else if ($.type(param) == "object") {
				data = param;
			} else if ($.type(param) == "function") {
				onSuccess = param;
			} else if (i == 1) {
				data = param;
			}
		}

		$.ajax({
			url: url,
			cache: false,
			async: false,
			type: "POST",
			data: data || "",
			dataType: "json",
			timeout: 300000,
			success: function(jsonResult) {
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
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 400 ||
					XMLHttpRequest.status == 500 ||
					XMLHttpRequest.status == 404) {
					result = {
						error: "Connection Error"
					};
				} else {
					result = {
						error: "System Error"
					};
				}
			}
		});
		return result;
	};

	/**
	 * @description 自动生成poppick控件
	 * @param {Object} domObj 绑定事件DOM对象 
	 * @param {Object} data 数据源
	 * @param {Object} valueColumn value字段名称
	 * @param {Object} textColumn 显示文本字段名称
	 * @param {function} callback 选择数据之后回调函数
	 * @param {Object} isMerge 是否将显示文本和value合并作为显示文本
	 */
	owner.generatePopPicker = function(domObj, data, valueColumn, textColumn, callback, isMerge) {
		isMerge = isMerge == undefined ? false : isMerge;
		var showUserPicker = new $.PopPicker();
		var pickerData = [];
		var obj = {};
		$.each(data, function(i, n) {
			obj = {};
			obj["value"] = n[valueColumn];
			if (isMerge) {
				obj["text"] = n[textColumn] + "_" + n[valueColumn];
			} else {
				obj["text"] = n[textColumn];
			}
			pickerData.push(obj);
		});
		showUserPicker.setData(pickerData);
		domObj.addEventListener("tap", function(event) {
			showUserPicker.show(function(items) {
				if ($.type(callback) == "function") {
					callback(items);
				}
			});
		}, false);
	};

	/**
	 * @description 获取手机通讯录
	 * @param {Object} callback 获取手机通讯录数据之后回调处理
	 */
	owner.getContactAddressBook = function(callback) {
		var result = {};
		plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
			addressbook.find(
				["displayName", "phoneNumbers"],
				function(contacts) {

					result[SysConstants.ERROR_CODE_KEY] = SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_SUCCESS;
					result[SysConstants.ERROR_MESSAGE_KEY] = "获取电话簿成功!";
					result[SysConstants.DATASET_KEY] = contacts;
					if ($.type(callback) == "function") {
						callback(result);
					}
				},
				function() {
					mui.toast("获取电话簿失败!");
					result[SysConstants.ERROR_CODE_KEY] = SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_ERROR;
					result[SysConstants.ERROR_MESSAGE_KEY] = "获取电话簿失败!";
					result[SysConstants.DATASET_KEY] = [];
					if ($.type(callback) == "function") {
						callback(result);
					}
				}, {
					multiple: true
				}
			);
		}, function(e) {
			mui.toast("获取电话簿失败:" + e.message);
			result[SysConstants.ERROR_CODE_KEY] = SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_ERROR;
			result[SysConstants.ERROR_MESSAGE_KEY] = "获取电话簿失败:" + e.message;
			result[SysConstants.DATASET_KEY] = [];
			if ($.type(callback) == "function") {
				callback(result);
			}
		});
	};

	/**
	 * @description 获取Android手机通话记录
	 * @param {Object} callback 获取Android手机通话记录后回调处理
	 */
	owner.getCallRecordLog = function(callback) {
		var result = {};
		try {
			var CallLog = plus.android.importClass("android.provider.CallLog");
			var main = plus.android.runtimeMainActivity();
			var obj = main.getContentResolver();
			plus.android.importClass(obj);
			//查询 
			var cursor = obj.query(CallLog.Calls.CONTENT_URI, null, null, null, null);
			plus.android.importClass(cursor);
			var count = 0;
			var data = [];
			if (cursor.moveToFirst()) {
				while (cursor.moveToNext()) {
					count++;
					//号码 
					var number = cursor.getString(cursor.getColumnIndex(CallLog.Calls.NUMBER));
					//呼叫类型 
					var type;
					switch (parseInt(cursor.getString(cursor.getColumnIndex(CallLog.Calls.TYPE)))) {
						case CallLog.Calls.INCOMING_TYPE:
							type = "呼入";
							break;
						case CallLog.Calls.OUTGOING_TYPE:
							type = "呼出";
							break;
						case CallLog.Calls.MISSED_TYPE:
							type = "未接";
							break;
						default:
							type = "挂断";
							break;
					}
					var date = new Date(parseInt(cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE))));
					var time = date.Format("yyyy-MM-dd HH:mm:ss:f");
					//联系人  
					var Name_Col = cursor.getColumnIndexOrThrow(CallLog.Calls.CACHED_NAME);
					var name = cursor.getString(Name_Col);
					//通话时间,单位:s 
					var Duration_Col = cursor.getColumnIndexOrThrow(CallLog.Calls.DURATION);
					var duration = cursor.getString(Duration_Col);

					var record = {};
					record.num = count;
					record.name = name;
					record.phone = number;
					record.time = time;
					record.type = type;
					record.duration = duration > 3600 ? new Date(duration * 1000).Format("HH:mm:ss") : new Date(duration * 1000).Format("mm:ss");
					data.push(record);
					// if (count > 50) {
					// 	break;
					// }
				}
				result[SysConstants.ERROR_CODE_KEY] = SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_SUCCESS;
				result[SysConstants.ERROR_MESSAGE_KEY] = "获取通话记录成功!";
				result[SysConstants.DATASET_KEY] = data.reverse();
				if ($.type(callback) == "function") {
					callback(result);
				}
			}
		} catch (e) {
			result[SysConstants.ERROR_CODE_KEY] = SysConstants.ERROR_CODE_OBJECT.ERROR_CODE_ERROR;
			result[SysConstants.ERROR_MESSAGE_KEY] = "获取通话记录失败:" + e.message;
			result[SysConstants.DATASET_KEY] = [];
			if ($.type(callback) == "function") {
				callback(result);
			}
		}
	};

	/**
	 * @description 根据传入的数据List和templateId对应的模板生成画面List列表
	 * @param {Object} domId 需要生成List的UL节点
	 * @param {Object} templateId 模板HTML代码
	 * @param {Object} records 数据List
	 * @param {Object} doc 当前文档对象
	 */
	owner.generateDataList = function(domId, templateId, records, doc) {
			var dom = doc.getElementById(domId);
			dom.innerHTML = "<p>数据加载中...</p>";
			var str = template(templateId, {
				"record": records
			});
			//将<li>标签添加在UL标签上
			dom.innerHTML = str;
	};
}(mui, window.Utils = {}));
