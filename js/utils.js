//api连接前缀
var APP_DOMAIN = '';

//为true输出日志
var debug = true;

/**
 * 打印日志
 */
function log(data) {
	if (debug) {
		if (typeof(data) == "object") {
			console.log(JSON.stringify(data));
		} else {
			console.log(data);
		}
	}
}


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
		} else {
			//浏览器获取项目根目录
			var a = document.location.pathname.substring(1);
			var b = a.indexOf("/");
			var c = a.substring(0, b);
			url = document.location.origin + "/" + c;
		}
		return url;
	}

	/**
	 * @description 打开新窗口,并传递参数
	 * @param {Object} url 新窗口URL
	 * @param {Object} params 传递的参数
	 */
	owner.openWebView = function(url, params) {
		var option = {};
		option.show = {
			aniShow: 'pop-in'
		}
		option.url = url;
		option.id = url;
		if (params && $.type(params) == "object") {
			option.extras = params;
		}
		$.openWindow(option);
	}

	/**
	 * @description 打开新画面时显示Loading样式
	 */
	owner.waitingStyle = {
		style: "black",
		color: "#FF0000",
		background: "rgba(0,0,0,0)",
		loading: {
			icon: "../images/loading.gif",
			display: "inline"
		}
	}

	/**
	 * @description 新开窗口
	 * @param {URIString} target  需要打开的页面的地址
	 * @param {Object} parm 传递的对象
	 * @param {Boolean} autoShow 是否自动显示
	 * @example openNew({URIString});
	 * */
	owner.openNewWindow = function(target, parm, autoShow) {
		var currPageId = plus.webview.currentWebview().id;
		var id = "index.html"; //除了一级目录，其它目录id组成结构为：二级文件夹/页面.html
		if (currPageId != undefined) {
			var sp_xg = target.split("/");
			if (sp_xg.length == 3) //target结构为 ../二级文件夹/页面.html,表示跨文件夹打开页面
			{
				id = sp_xg[1] + "/" + sp_xg[2];
			} else if (sp_xg.length == 2) { //target结构为 二级文件夹/页面.html，表示html下一级目录打开页面
				id = target;
			} else { //同级打开页面，需从currpageid中拿取二级文件夹名
				var curr_sp_xg = currPageId.split("/");
				id = curr_sp_xg[0] + "/" + sp_xg[0];
			}
		}
		var isAutoShow = autoShow || true;
		log("currPageId=" + currPageId + " target=" + target + " id=" + id + " parm=" + JSON.stringify(parm) + " isAutoShow=" + isAutoShow);
		$.openWindow({
			url: target,
			id: id,
			show: {
				autoShow: isAutoShow, //页面loaded事件发生后自动显示，默认为true
				aniShow: 'pop-in',
				duration: 200
			},
			waiting: {
				autoShow: true,
				options: owner.waitingStyle
			},
			extras: {
				info: parm
			}
		})
	}


	owner.md5sign = function(parm) {
		var signstr = "";
		for (var p in parm) {
			signstr += "+" + parm[p];
		}
		signstr = signstr.replace("+", "");
		//log(signstr);
		var md5str = md5(signstr);
		return md5str;
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
					record.duration = duration > 3600 ? new Date(duration * 1000).Format("HH:mm:ss") : new Date(duration * 1000).Format(
						"mm:ss");
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

//ui设置
var appUI = {
	showWaiting: function() {
		plus.nativeUI.showWaiting();
	},
	closeWaiting: function() {
		plus.nativeUI.closeWaiting()
	},
	setDisabled: function(self) {
		self.setAttribute("disabled", "disabled");
	},
	removeDisabled: function(self) {
		self.removeAttribute("disabled");
	},
	countDown: function(date) {
		if (!date) {
			var obj = {
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			};
			return obj;
		}

		var arydates = new Array();
		arydates = date.split(' ')[0].split('-');
		var arytimes = new Array();
		arytimes = date.split(' ')[1].split(':');
		var date1 = new Date(arydates[0], parseInt(arydates[1]) - 1, arydates[2], arytimes[0], arytimes[1], arytimes[2]);

		var timediff = Math.floor(date1.getTime() - new Date().getTime()) / 1000;

		if (timediff < 0) {
			var obj = {
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			};
			return obj;
		}

		var days = Math.floor(timediff / 86400);
		timediff -= days * 86400;
		var hours = Math.floor(timediff / 3600) % 24;
		timediff -= hours * 3600;
		var minutes = Math.floor(timediff / 60) % 60;
		timediff -= minutes * 60;
		var seconds = Math.floor(timediff % 60);

		var obj = {
			day: days,
			hour: hours + days * 24,
			minute: minutes,
			second: seconds
		};
		return obj;
	},
	showTopTip: function(msg) { //头部显示提示信息
		if (msg && msg != "") {
			var tip = document.getElementById("toptip");
			var haveTip = tip != undefined;
			if (haveTip) {
				tip.setAttribute("class", "showend");
			} else {
				tip = document.createElement("div");
				tip.id = "toptip";
				var node;
				if (document.body.children[0]) {
					node = document.body.children[0];
					document.body.insertBefore(tip, node); //插入到body第一个元素之前
				} else {
					document.body.appendChild(tip);
				}
			}
			tip.innerText = msg;
			tip.setAttribute("class", "show");
			setTimeout(function() {
				tip.setAttribute("class", "showend");
			}, "3000");
		}
	}

}

//页面对象
var appPage = {
	//获取页面参数
	getParam: function(name) {
		var currPage = plus.webview.currentWebview();
		if (mui.os.plus) {
			//log(currPage.id + "的全部参数=" + JSON.stringify(currPage));
			if (currPage.info)
				return currPage.info[name] || null;
			else
				return null;
		} else {
			return null;
		}
	},
	//关闭当前页
	close: function() {
		var currPage = plus.webview.currentWebview();
		plus.webview.close(currPage);
	},
	//关闭当前页，并跳转到指定页
	closeAndBackUrl: function(url, param) {
		var currPage = plus.webview.currentWebview();
		plus.webview.close(currPage);
		openNew(url, param);
	},
	registerCheckLoginEvent: function() { //需检测登录状态并绑定事件的地方
		this.initCheckLoginEvent(); //初始化检测登录事件	

		//var ckpageid=["mine/user.html","","","","",""];

	},
	initCheckLoginEvent: function() { //初始化检测登录事件	
		var self = this;
		mui("body").off("tap", ".ckecklogin"); //清除原来事件
		mui("body").on("tap", ".ckecklogin", function() {
			storageUser = kidstorageuser.getInstance();
			var backid = this.getAttribute("data-loginbackid");
			var loginevent = this.getAttribute("data-loginevent");
			if (!storageUser.IsLogin) { //未登录	
				if (backid) {
					self.openLogin({
						backid: backid
					});
				}

			} else { //已登录
				if (loginevent)
					eval(loginevent);
				//openNew(backid.replace("mine/",""))
			}
		});
	},
	closeLogin: function() { //验证登录的页，window initpage事件里要检测关闭登录页
		var _login = plus.webview.getWebviewById("login/login.html");
		var _mobileLogin = plus.webview.getWebviewById("login/mobileLogin.html");
		var _reg = plus.webview.getWebviewById("login/reg.html");
		var _setPwd = plus.webview.getWebviewById("login/setPwd.html");
		var _forgetPwd = plus.webview.getWebviewById("login/forgetPwd.html");
		var needClose = _login || _mobileLogin || _reg || _setPwd || _forgetPwd;

		if (needClose) {
			//setTimeout(function() {
			if (_login) {
				_login.close();
				log("关闭了:_login");
			}
			if (_mobileLogin) {
				_mobileLogin.close();
				log("关闭了:_mobileLogin");
			}
			if (_reg) {
				_reg.close();
				log("关闭了:_reg");
			}
			if (_setPwd) {
				_setPwd.close();
				log("关闭了:_setPwd");
			}
			if (_forgetPwd) {
				_forgetPwd.close();
				log("关闭了:_forgetPwd");
			}

			//}, 1000);
		}

	},
	openLogin: function(param) { //打开登录页
		openNew("../login/login.html", param);
	},
	loginBack: function(backid, backurl) { //登录成功，执行跳转或刷新页面操作

		storageUser = kidstorageuser.getInstance();
		storageUser.log();

		if (storageUser.IsLogin) {

			var backpage = plus.webview.getWebviewById(backid);
			log("backid=" + backid + " backurl" + backurl);
			if (backpage) { //存在，先刷新
				log("存在:" + backurl)
				mui.fire(backpage, 'refreshPage', {
					comepage: "login"
				});
			} else {
				log("不存在" + backurl)
			}
			//页面刷新完，执行跳转或重新打开
			if (backid == "mine/user.html" || backid == "services/bbsChannel.html") {
				mui.back();
			} else {
				log("不存在打开我:" + backurl)
				openNew(backurl, {
					comepage: "login"
				});
			}
			mui.fire(plus.webview.getWebviewById("customer/pk.html"), 'refreshPage');
			mui.fire(plus.webview.getWebviewById("home/tool.html"), 'refreshPage');
			mui.fire(plus.webview.getWebviewById("mine/user.html"), 'refreshPage');
			mui.fire(plus.webview.getWebviewById("services/bbs.html"), 'refreshPage');
			mui.fire(plus.webview.getWebviewById("services/bbsIndex.html"), 'refreshPage');
			mui.fire(plus.webview.getWebviewById("services/bbsChannel.html"), 'refreshPage');
			//appPage.closeAllPage(backid, true);

			//return false;
		}
	},
	closeAllPage: function(backid, ckprevpage) { //退出登录，关闭所有打开的二级页面，main下打开的二级除外

		var allpage = plus.webview.all(),
			pageid, str, currpage = plus.webview.currentWebview();
		ckprevpage = ckprevpage || false; //是否检测前一页，如果关闭时候是前一页，延迟关闭，否则会导致未打开新页面，就已关闭前一页，打开页面也会失败
		for (var i = 0; i < allpage.length; i++) {
			pageid = allpage[i].id;
			log("webview" + i + ": " + pageid);

			if (pageid == "HBuilder" || pageid == "cn.kayou110.kidapp") {
				//alert(pageid)
			} else if (pageid == "index/home.html" || pageid == "main.html") {

			} else if (pageid == "customer/pk.html" || pageid == "home/tool.html" || pageid == "mine/user.html" || pageid ==
				"services/bbs.html" || pageid == "services/bbsIndex.html" || pageid == "services/bbsChannel.html") {
				log("刷新了：" + pageid);
				mui.fire(plus.webview.getWebviewById(pageid), 'refreshPage');
			} else {
				log("关闭了：" + pageid);
				allpage[i].close();
			}
		}
	},
	imgInit: function() { //图片加载
		var url, wh, arr, w, h, isok, isdefuserimg, cls, whstr, src, model;
		mui(".loadthumb").each(function() {
			cls = this.getAttribute("class") || "";
			isok = cls.replace(/\s/g, '').length != 0 && cls.indexOf("loadok") != -1;
			isdefuserimg = cls.replace(/\s/g, '').length != 0 && cls.indexOf("defuserimg") != -1;
			if (isok)
				return;
			this.setAttribute("onerror", "javascript:this.src='../../images/nopic.jpg';");

			url = this.getAttribute("data-url");
			if (isdefuserimg && url.trim() == "") {
				this.src = "../../images/defuser.jpg";
				return;
			} else if (url.trim() == "") {
				this.src = "../../images/nopic.jpg";
				return;
			}
			wh = this.getAttribute("data-wh");
			model = this.getAttribute("data-model") || "m_mfit";
			arr = wh.split(",");
			w = arr[0];
			h = arr[1];
			whstr = "", src = "";
			if (w != "") {
				whstr += ',w_' + w;
			}
			if (h != "") {
				whstr += ',h_' + h;
			}
			if (whstr == "") {
				src = url;
			} else if (url.indexOf(".aliyuncs.com") != -1) {
				if (w != "" && h != "") { //表示固定尺寸
					model = 'm_pad';
				}
				src = url + '?x-oss-process=image/resize,' + model + whstr;
			} else {
				src = url;
			}
			this.setAttribute("onload", "javascript:appPage.imgLoadCallback(this,'" + cls + "');");
			this.src = src;
			log("," + w + "," + h + " " + this.src)
		});
	},
	imgLoadCallback: function(obj, cls) {
		//alert(cls);
		obj.setAttribute("class", cls.replace("loadthumb", "loadok")); //移除缩略图处理样式，添加处理完成样式
	},
	imgPreviewInit: function() { //图片预览初始化
		mui(".preview").each(function() {

		});
	},
	endPullRefresh: function(stopup, id) { //上拉加载、下拉刷新动画结束
		//stopup 上拉加载
		//stopdown 下拉刷新
		//是否重置插件
		//id 容器id
		if (id == undefined) //容器id
			id = "pullrefresh";

		setTimeout(function() {
			//停止下拉刷新
			mui('#' + id).pullRefresh().endPulldownToRefresh(true);
			//重置
			mui('#' + id).pullRefresh().refresh(true);
			if (stopup != undefined) { //不为空表示，页面包含 上拉加载事件
				//停止上拉加载
				mui('#' + id).pullRefresh().endPullupToRefresh(stopup);
			}

		}, 1000);
	},
	enablePullRefresh: function(enable, id) { //禁用、启用上拉加载、下拉刷新
		if (id == undefined) //容器id
			id = "pullrefresh";
		if (enable) { //禁用
			//mui('#' + id).pullRefresh().endPulldown(true);
			mui('#' + id).pullRefresh().disablePullupToRefresh(); //禁用上拉加载			
		} else { //启用
			mui('#' + id).pullRefresh().enablePullupToRefresh(); //启用上拉加载
			mui('#' + id).pullRefresh().refresh(true);
		}
	}
};
