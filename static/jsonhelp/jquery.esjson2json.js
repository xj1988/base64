(function($) {
	$.esjson2json = function(json, options) {
		initDefault();
		loopEnterResults(json,null,0);
		return JSON.stringify(sortArray(result));
	};
	var result;
	var depthIpre;
	var now;
	var preRoot;
	var nowIndex;
	function initDefault() {
		result = [];
		depthIpre = [0,0];
		now = {};
		preRoot = {};
		nowIndex = 0;
	}

	function sortArray(result) {
		var maxL = Object.keys(result[0]).length;
		for (var i = 1; i < result.length; i++) {
			if(Object.keys(result[i]).length == maxL) {
				continue;
			}
			var pad = result[i];
			for (var j = i-1; j > 0; j--) {
				var keys = Object.keys(result[j]);
				for (var k = 0; k < keys.length; k++) {
					if(!pad[keys[k]]) {
						pad[keys[k]] = result[j][keys[k]];
					}
				}
				if(Object.keys(result[i]).length == maxL) {
					break;
				}
			}
		}
		var keyMap = {};
		for(var index in result) {
			for (var key in result[index]) {
				if(!keyMap[key]) {
					keyMap[key] = "1";
				}
			}
		}
		var formatResult = [];
		for (var i = 0; i < result.length; i++) {
			var newO = {};
			var keys = Object.keys(keyMap);
			for (var j = 0; j < keys.length; j++) {
				if(result[i][keys[j]]) {
					newO[keys[j]] = result[i][keys[j]];
				} else {
					newO[keys[j]] = "";
				}
			}
			formatResult[i] = newO;
		}
		return formatResult;
	}

	function recordAdd(depth,i) {
		var paddingFlag = false;
		if(result.length < (nowIndex+1)) {
			result[nowIndex] = preRoot = {}
		}
		if(depthIpre[0]>=depth) {
			paddingFlag = true;
			if(Object.keys(now).length != 0)
				preRoot = now;
			result[++nowIndex] = now = {};
		}
		depthIpre = [depth,i];
		return paddingFlag;
	}

	function paddingResult(paddingFlag) {
		if(paddingFlag && Object.keys(preRoot).length != 0) {
			var to = now;
			var from = preRoot;
			for (var key in from) {
				if(!to[key]) {
					to[key] = from[key];
				}
			}
		}
	}

	function loopEnterResults(parse,pName,depth) {
		if(parse instanceof Array) {
			for (var i = 0; i < parse.length; i++) {
				var paddingFlag = recordAdd(depth,i);
				loopEnterResults(parse[i],pName,depth);
				paddingResult(paddingFlag);
			}
		} else if(parse instanceof Object) {
			var keys =  Object.keys(parse);
			if(keys.length == 1) {
				if("buckets" == keys[0]) {
					loopEnterResults(parse["buckets"],pName,depth+1);
				} else {
					if(!pName) {
						pName =  keys[0];
					}
					var o1 = parse[keys[0]];
					if(o1 instanceof Object) {
						loopEnterResults(parse[pName],pName,depth+1);
					} else {
						if(result[nowIndex]) {
							result[nowIndex][pName] = o1;
						}
					}
				}
			} else {
				var key_as_string  = parse["key_as_string"];
				var key  = parse["key"];
				var doc_count  = parse["doc_count"];
				var other_count  = parse["sum_other_doc_count"];

				if(key_as_string) {
					result[nowIndex][pName] = key_as_string;
				} else if(key != null) {
					result[nowIndex][pName] = key;
				}

				if(other_count) {
					if(nowIndex != -1) {
						// result[nowIndex][pName+"otherCount"] = other_count;
					}
				} else if(doc_count) {
					result[nowIndex][pName+"count"] = doc_count;
				}

				for (var i = 0; i < keys.length; i++) {
					var cFalg = false;
					for (var j = 0; j < fixString.length; j++) {
						if(keys[i] == fixString[j]) {
							cFalg = true;
							break;
						}
					}
					var o1 = parse[keys[i]];
					if(!cFalg) {
						if(o1 instanceof Object && !(parse instanceof Array)) {
							if("buckets" != keys[i]) {
								pName = pName+"-"+keys[i].toString();
							}
							loopEnterResults(o1,pName,depth+1);
						} else {
							for (var j = 0; j < stats.length; j++) {
								if(stats[j] == keys[i]) {
									result[nowIndex][pName+stats[j]]  = o1;
								}
							}
						}
					}
				}
			}
		}

	}

	var fixString = ["key_as_string","key","doc_count"];
	var stats = ["min","avg","max","sum"];

})(jQuery);