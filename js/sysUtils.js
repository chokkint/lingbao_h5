/**
 * @description 重写日期格式化类
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份  
		"d+": this.getDate(), //日  
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时  
		"H+": this.getHours(),
		"m+": this.getMinutes(), //分  
		"s+": this.getSeconds(), //秒  
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度  
		"f": this.getMilliseconds() //毫秒  
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * @description 为Array扩展contains方法
 * @param {String} str 需要是否已经在数组中存在的那个值
 * @example if(Arr.contains('str')); //返回true||false
 * */
Array.prototype.contains = function(str) {
	var i = this.length;
	while(i--) {
		if(this[i] === str) {
			return true;
		}
	}
	return false;
}
/*替换空格*/
　
String.prototype.trim = function() {　　
	return this.replace(/(^\s*)|(\s*$)/g, "");　　
}　　
String.prototype.ltrim = function() {　　
	return this.replace(/(^\s*)/g, "");　　
}　　
String.prototype.rtrim = function() {　　
	return this.replace(/(\s*$)/g, "");　　
}