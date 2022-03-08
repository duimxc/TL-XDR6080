function NiceScroll(targetId)
{
	this.taId = targetId;
	this.ta = id(this.taId);
	if (this.ta.nodeType != 1)
	{
		return null;
	}
	this.st = el("label");		// scroll tip
	this.sb = el("div");		// scroll bar
	this.sbH = 0;
	this.scH = 0;
	this.stH = 0;
	this.avg = 0;
	this.sbcH = 0;
	this.n = 20;
	this.enabled = true;
	this.mousePos = null;
	this.isScroll = false;
	this.onSb = false;
	this.show = false;
	this.checkTt = null;

	/* 滚动条动画效果相关 */
	this.wtId = null;			//动画timer的ids
	this.wtCounter = 0;			//timer循环次数
	this.wSpeed = 0;			//timer执行一次滚动条移动的距离
	this.woSpeed = 0;			//用于检测是否反向滚动
	/* endof 滚动条动画效果相关 */

	/* scrollBar的相关样式 */
	this.sbStyle = {
		"position":"absolute",
		"zIndex":1001,
		"width":"0.583em",
		"mTop":0,
		"mLeft":0
	};

	/* scrollTip的相关样式 */
	this.stStyle = {
		"width":"0.583em",
		"display":"inline-block",
		"background":"#34A9DA",
		"borderRadius":"3px",
		"position":"relative",
		"cursor":"pointer"
	};

	/* scrollTip的opacity */
	this.stOpacity = 0.1;

	if (typeof this.init != "function")
	{
		NiceScroll.prototype.init = function(){
			var obj = this;

			this.sb.id = this.taId + "niceScrollSb" + new Date().getTime();

			setStyle(this.sb, {"backgroundColor":(this.sbStyle.background || "transparent")});

			/* 将scrollTip添加到scrollBar中 */
			this.sb.appendChild(this.st);

			/* 将scrollBar添加到body中 */
			document.body.appendChild(this.sb);

			/* 设置scrollBar和scrollTip的静态样式 */
			setStyle(this.sb, this.sbStyle);
			setStyle(this.st, this.stStyle);

			/* 设置scrollBar和scrollTip的动态样式 */
			this._reset();

			/* 如果是PC浏览器设置target的overflow为hidden */
			if (false == OS.portable)
			{
				setStyle(this.ta, {"overflow":"hidden"});
			}
			else
			{
				setStyle(this.ta, {"overflow":"scroll"});
			}

			this._shSb();
			this._bind();
			this._scrollCheck();
		};

		NiceScroll.prototype._scrollCheck = function(){
			var obj = this;

			this.checkTt = window.setTimeout(function(){
				obj._scrollCheck();
			}, 10);
			this._check();
		};

		/* 设置scrollBar的样式 */
		NiceScroll.prototype.scrollBarSet = function(styles){
			if (typeof styles == "object")
			{
				for(var propy in styles)
				{
					this.sbStyle[propy] = styles[propy];
				}
			}
		};

		/* 设置scrollTip的样式 */
		NiceScroll.prototype.scrollTipSet = function(styles){
			if (typeof styles == "object")
			{
				for(var propy in styles)
				{
					this.stStyle[propy] = styles[propy];
				}
			}
		};

		/* 设置scrollTip的opacity */
		NiceScroll.prototype.scrollTipOpacity = function(opacity){
			this.stOpacity = opacity;
		};

		/* 滚动到指定的位置 */
		NiceScroll.prototype.scrollTo = function(hPos){
			var scollTop = parseFloat(hPos);

			if (true == isNaN(scollTop))
			{
				return false;
			}

			/* 设置scrollTip初始样式 */
			this.ta.scrollTop = scollTop;
		};

		/* 动态设置scrollBar和scrollTip的样式，主要是位置 */
		NiceScroll.prototype._reset = function(){
			var pos = $(this.ta).offset();
			var width = this.ta.offsetWidth;
			var height = this.ta.offsetHeight - this.sbStyle.mTop;
			var sHeight = this.ta.scrollHeight - this.sbStyle.mTop;
			var bdTWidth = parseFloat(getNodeDefaultView(this.ta, "borderTopWidth")) || 0;
			var bdBWidth = parseFloat(getNodeDefaultView(this.ta, "borderBottomWidth")) || 0;
			var bdRWidth = parseFloat(getNodeDefaultView(this.ta, "borderRightWidth")) || 0;
			var bdLWidth = parseFloat(getNodeDefaultView(this.ta, "borderLeftWidth")) || 0;

			this.scH = sHeight - height + bdTWidth + bdBWidth;
			this.stH = parseInt(height/sHeight*height*0.7);
			this.sbcH = height - (this.stH + 2);
			this.avg = this.scH/this.sbcH;

			if (sHeight - height <= 0)
			{
				setStyle(this.sb, {"visibility":"hidden", "top":"-9999px"});
				this.show = false;
				return;
			}
			else
			{
				this.show = true;
				setStyle(this.sb, {"visibility":"visible"});
			}

			/* 设置scrollBar初始样式 */
			setStyle(this.sb, {"height":height + "px"});
			/* 修复在某些品牌手机浏览器下，滚动条不跟随页面滚动的问题 */
			$(this.sb).offset({
				top: parseInt(pos.top + bdTWidth + this.sbStyle.mTop),
				left: parseInt(pos.left - this.sbStyle.mLeft + width - bdRWidth - parseInt(this.sb.offsetWidth))
			});

			/* 设置scrollTip初始样式 */
			setStyle(this.st, {"top":(this.ta.scrollTop/this.scH)*this.sbcH + "px",
							   "height":this.stH + "px"});

			/* fadeTo在此处会导致内存泄漏 */
			/*if (this.isScroll == false)
			{
				$("#"+this.sb.id).fadeTo(1000, this.stOpacity);
			}*/
		};

		NiceScroll.prototype._bind = function(){
			var obj = this;

			if (document.attachEvent)
			{
				this.ta.attachEvent("onmousewheel",  function(event){
					event = event || window.event;obj._scroll(event)});
				this.sb.attachEvent("onmousewheel",  function(event){
					event = event || window.event;obj._scroll(event)});
			}
			else
			{
				this.ta.addEventListener("mousewheel",
					function(event){event = event || window.event;obj._scroll(event)}, false);
				this.ta.addEventListener("DOMMouseScroll",
					function(event){event = event || window.event;obj._scroll(event)}, false);
				this.sb.addEventListener("mousewheel",
					function(event){event = event || window.event;obj._scroll(event)}, false);
				this.sb.addEventListener("DOMMouseScroll",
					function(event){event = event || window.event;obj._scroll(event)}, false);
			}

			/* 触屏移动的处理函数 */
			function touchMoveHd(event)
			{
				event = event || window.event;
				var mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
				var len = mousePos.y - obj.mousePos.y;
				var top = parseFloat(obj.st.style.top) - len;

				top = (top >= obj.sbcH?obj.sbcH:(top <= 0?0:top));
				obj.st.style.top = top + "px";
				obj.mousePos.y = mousePos.y;
				obj.isScroll = true;

				if (false == OS.portable)
				{
					obj.ta.scrollTop = obj.scH*(top/obj.sbcH);
					eventPreventDefault(event);
				}

				clearSelection(event);
			}

			/* 触屏结束移动的处理函数 */
			function touchEndHd(event)
			{
				detachEvnt(document, "touchmove", touchMoveHd);
				detachEvnt(document, "touchend", touchEndHd);

				if (obj.onSb == false)
				{
					obj.isScroll = false;
				}
			}

			/* 触屏移动开始的处理函数 */
			attachEvnt(this.ta, "touchstart", function(event){
				event = event || window.event;
				obj.mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
				attachEvnt(document, "touchmove", touchMoveHd);
				attachEvnt(document, "touchend", touchEndHd);
			});

			/* 对滑动块绑定鼠标函数 */
			this.st.onmousedown = function(event){
				obj.mousePos = getMousePos(event);
				document.onmouseup = function(event){
					document.onmousemove = null;
					document.onmouseup = null;
					if (obj.onSb == false)
					{
						obj.isScroll = false;
					}
				};
				document.onmousemove = function(event){
					var mousePos = getMousePos(event);
					var len = mousePos.y - obj.mousePos.y;
					var top = parseFloat(obj.st.style.top) + len;

					top = (top >= obj.sbcH?obj.sbcH:(top <= 0?0:top));
					obj.st.style.top = top + "px";
					obj.mousePos.y = mousePos.y;
					obj.ta.scrollTop = obj.scH*(top/obj.sbcH);
					obj.isScroll = true;
					clearSelection(event);
				};
			};

			/* 在scrollBar上绑定鼠标事件 */
			$("#"+this.sb.id)[0].onmouseover = function(event){
				event = event || window.event;
				obj.onSb = true;
				if (obj.show == true)
				{
					obj._scrollShow(event);
				}
			};
			$("#"+this.sb.id)[0].onmouseout = function(){
				obj.onSb = false;
				obj.isScroll = false;
			};
		};

		NiceScroll.prototype._close = function(){
			this.sb.style.visibility = "hidden";
			this.enabled = false;
		};

		NiceScroll.prototype._open = function(){
			this.enabled = true;
		};

		NiceScroll.prototype._shSb = function(){
			if (this.ta.style.display == "none" ||
				this.ta.visibility == "hidden")
			{
				this.sb.style.visibility = "hidden";
			}
			else
			{
				this.sb.style.visibility = "visible";
			}
		};

		NiceScroll.prototype._check = function(){
			if (id(this.taId) == null)
			{
				window.clearTimeout(this.checkTt);
				this.sb.parentNode.removeChild(this.sb);
				return;
			}
			if (this.enabled == false)
			{
				return;
			}

			if (checkInHorize(this.ta) == false)
			{
				this.sb.style.display = "none";
				return;
			}
			else
			{
				this.sb.style.display = "block";
			}

			if (parseInt(this.ta.offsetHeight) <= 0)
			{
				this.sb.style.visibility = "hidden";
			}
			this._reset();
		};

		NiceScroll.prototype._getWheelDelta = function(event){
			event = event || window.event;
			if (event.wheelDelta)
			{
				return window.opera&&window.opera.version < 9.5?-event.wheelDelta:event.wheelDelta;
			}
			else
			{
				return -event.detail*40;
			}
		};

		NiceScroll.prototype._wheelAnimateHandle = function ()
		{
			var temp = 0;
			var obj = this;

			obj.wtId = window.setTimeout(function(){
				obj._wheelAnimateHandle();
			}, 5);

			if (obj.wtCounter < 0)
			{
				clearTimeout(obj.wtId);
				obj.wtId = null;
				if (obj.onSb == false)
				{
					obj.isScroll = false;
				}
				return;
			}

			var newTop = parseFloat(obj.ta.scrollTop) + parseInt(obj.wSpeed);
			if (newTop >= obj.scH || newTop <= 0)
			{
				obj.wtCounter = 0;
			}

			obj.ta.scrollTop = newTop;
			temp = (obj.ta.scrollTop/obj.scH)*obj.sbcH;

			if (!isNaN(temp))
			{
				obj.st.style.top = temp + "px";	/* 同步滚动条 */
			}

			obj.wtCounter--;
		};

		NiceScroll.prototype._wheelAnimate = function(speed, counter){
			var oppsite = false;
			if (this.wtId)	/* 连续触发 */
			{
				oppsite = (this.woSpeed ^ speed) < 0;
				this.wtCounter = oppsite ? counter : (this.wtCounter + counter < 50 ? this.wtCounter + counter : 50);
				this.wSpeed = oppsite? speed : this.wSpeed*1.05;		/* 加速 */
				return;
			}
			this.wtCounter = counter;
			this.woSpeed = this.wSpeed = speed;
			this._wheelAnimateHandle();
		};

		NiceScroll.prototype._scrollShow = function(event){
			$("#"+this.sb.id).stop(true).css("visibility", "visible").css("opacity", 1);
			this.isScroll = true;
			eventPreventDefault(event);
		};

		NiceScroll.prototype._scroll = function(event){
			event = event || window.event;
			var delta = this._getWheelDelta(event);
			var st = this.ta.scrollTop;
			var result = delta > 0?-1:1;
			if (this.show == true && this.enabled == true)
			{
				this._scrollShow(event);
				this._wheelAnimate(5 * result, 7);
			}

			// 阻止滚动事件冒泡以避免外部滚动条同时相应滚动，导致内外同时滚动
			stopProp(event);
		};
	}
}
function DateControl(dateConId, options)
{
	this.table;
	this.weekList;
	this.hourList;
	this.dateCon = id(dateConId);
	this.weekIsMouseDown = false;
	this.selDate = [0, 0, 0, 0, 0, 0, 0];
	this.dateArray = [0, 0, 0, 0, 0, 0, 0];
	this.cellHeight = 22;
	this.cellWidth = 22;
	this.cellSeColor = "#A0D468";
	this.cellDeColor = "#FCFCFC";
	this.cellPadding = 1;

	if (DateControl.prototype.init == undefined)
	{
		DateControl.prototype.hourStr = label.lHour;
		DateControl.prototype.weekDayNum = 7;
		DateControl.prototype.lineStr = "-";
		DateControl.prototype.selTag = "selTag";
		DateControl.prototype.cellBorderWidth = 1;
		DateControl.prototype.iCellIndex = 0;
		DateControl.prototype.weekArray = [label.Mon, label.Tue, label.Wen,
										   label.Thu, label.Fri, label.Sta, label.Sun];

		/* Date的初始化 */
		DateControl.prototype._init = function()
		{
			this._initOptions();
			this._dateConInit();
			this._hourListInit();
			this._weekListInit();
			this._dateTableInit();
		};

		/* 重新设置显示的时间 */
		DateControl.prototype.reset = function(dateArray)
		{
			var dayMask, tr, td, iCell, iCellIndex = this.iCellIndex;
			var objThis = this;

			if (dateArray instanceof Array == false ||
				dateArray == undefined ||
				dateArray.length != this.weekDayNum)
			{
				return;
			}

			for(var j = 0; j < this.weekDayNum; j++)
			{
				tr = this.table.rows[j];
				dayMask = dateArray[j];

				for (var i = 0; i < 24; i++)
				{
					td = tr.cells[i];
					iCell = td.childNodes[iCellIndex];

					if (dayMask != undefined)
					{
						this._setSel(iCell, dayMask%2);
						dayMask = (dayMask >> 1);
					}
					else
					{
						this._setSel(iCell, 0);
					}
				}
			}
		};

		/* 初始化options */
		DateControl.prototype._initOptions = function()
		{
			for (var propty in options)
			{
				if (typeof this[propty] != "undefined")
				{
					this[propty] = options[propty];
				}
			}
		};

		/* 获取已选择的时间 */
		DateControl.prototype.getSelDate = function()
		{
			var cell, selectNum, row, iCell;
			var weekDayNum = this.weekDayNum;
			var rows = this.table.rows;
			this.selDate = [0, 0, 0, 0, 0, 0, 0];

			for(var j = 0; j < weekDayNum; j++)
			{
				row = rows[j];

				for (var i = 0; i < 24; i++)
				{
					cell = row.cells[i];
					iCell = cell.childNodes[0];
					selectNum = parseInt(iCell.getAttribute("sel"));

					if (selectNum == 1)
					{
						this.selDate[j] += Math.pow(2, i);
					}
				}
			}

			return this.selDate;
		};

		DateControl.prototype._dateConInit = function()
		{
			this.dateCon.style.overflow = "hidden";
		};

		/* 时刻列表初始化 */
		DateControl.prototype._hourListInit = function()
		{
			var hourList = document.createElement("ul");
			var li, text, iCell, thisObj = this, span;

			hourList.className = "hourList";

			for(var i = 0; i <= 24; i++)
			{
				li = document.createElement("li");
				if (i != 24)
				{
					iCell = document.createElement("span");
					iCell.innerHTML = i;
					li.appendChild(iCell);
					li.style.width = this.cellWidth + this.cellPadding*2 + this.cellBorderWidth + "px";
					iCell.onclick = (function(index){
						return function(){
							var rows = thisObj.table.rows;
							var len = rows.length;
							var iCellIndex = thisObj.iCellIndex;
							var selMask = 1;

							for (var j = 0; j < len; j++)
							{
								selMask = selMask&parseInt(rows[j].cells[index].childNodes[iCellIndex].getAttribute("sel"));
								if (0 == selMask)
								{
									break;
								}
							}

							selMask = 1 - selMask;

							for (var j = 0; j < len; j++)
							{
								thisObj._setSel(rows[j].cells[index].childNodes[iCellIndex], selMask);
							}

							clearSelection();
						};
					})(i);
				}
				else
				{
					li.style.color = "#6EBFD9";
					li.innerHTML = this.hourStr;
				}

				hourList.appendChild(li);
			}

			this.dateCon.appendChild(hourList);
			this.hourList = hourList;
		};

		/* 星期列表初始化 */
		DateControl.prototype._weekListInit = function()
		{
			var weekList = document.createElement("ul");
			var li, thisObj = this;

			weekList.className = "weekList";

			for(var i = 0, len = this.weekDayNum; i < len; i++)
			{
				li = document.createElement("li");
				li.style.height = this.cellHeight + this.cellPadding*2 + this.cellBorderWidth + "px";
				li.style.lineHeight = this.cellHeight + this.cellPadding*2 + this.cellBorderWidth + "px";
				li.innerHTML = this.weekArray[i];
				li.onclick = (function(index){
					return function(){
						var cells = thisObj.table.rows[index].cells;
						var iCellIndex = thisObj.iCellIndex;
						var selMask = 1;

						for (var j = 0, len = cells.length; j < len; j++)
						{
							selMask = selMask&parseInt(cells[j].childNodes[iCellIndex].getAttribute("sel"));
							if (0 == selMask)
							{
								break;
							}
						}

						selMask = 1 - selMask;

						for (var j = 0, len = cells.length; j < len; j++)
						{
							thisObj._setSel(cells[j].childNodes[iCellIndex], selMask);
						}

						clearSelection();
					};
				})(i);
				weekList.appendChild(li);
			}

			this.dateCon.appendChild(weekList);
			this.weekList = weekList;
		};

		/* 设置时间块是否被选择 */
		DateControl.prototype._setSel = function(obj, num){
			obj.setAttribute("sel", num);
			obj.style.backgroundColor = (num == 1 ? this.cellSeColor : this.cellDeColor);
		};

		/* 生成时间cell */
		DateControl.prototype._dateCellCreate = function()
		{
			var dayMask, tr, td, iCell, index;
			var objThis = this;

			for (var j = 0, len = this.weekDayNum; j < len; j++)
			{
				tr = this.table.insertRow(-1);

				if (this.dateArray != undefined)
				{
					dayMask = this.dateArray[j];
				}

				for (var i = 0; i < 24; i++)
				{
					td = tr.insertCell(-1);
					td.style.padding = this.cellPadding + "px";
					td.className = "weekTd";

					iCell = document.createElement("i");
					iCell.className = "tableICell";
					iCell.style.height = this.cellHeight + "px";
					iCell.style.width = this.cellWidth + "px";
					td.appendChild(iCell);

					this._setSel(iCell, 0);

					if (dayMask != undefined)
					{
						this._setSel(iCell, dayMask%2);
						dayMask = (dayMask >> 1);
					}
					else
					{
						this._setSel(iCell, 0);
					}

					iCell.onmouseover = function (event){
						if (objThis.weekIsMouseDown == true)
						{
							objThis._setSel(this, 1 - parseInt(this.getAttribute("sel")));
						}
					};

					iCell.onmousedown = function (event){
						objThis._setSel(this, 1 - parseInt(this.getAttribute("sel")));
					};
				}
			}

			if (this.table.rows[0].cells[0].nodeType == 3)
			{
				this.iCellIndex = 1;
			}
		};

		/* 添加处理函数 */
		DateControl.prototype._dateCellBind = function()
		{
			var objThis = this;
			this.table.onmousedown = function (event){
				objThis.weekIsMouseDown = true;
				document.onmouseup = function (event){
					objThis.weekIsMouseDown = false;
				}
			};

			this.table.onmouseup = function (event){
				objThis.weekIsMouseDown = false;
			};
		};

		/* 生成时间表 */
		DateControl.prototype._dateTableCreate = function()
		{
			this.table = document.createElement("table");
			this.table.className = "tableWeek";
			this.table.cellspacing = "0px";
			this.table.cellpadding = "0px";
			this.dateCon.appendChild(this.table);
		};

		/* 初始化具体的时间表格 */
		DateControl.prototype._dateTableInit = function()
		{
			this._dateTableCreate();
			this._dateCellCreate();
			this._dateCellBind();
		};
	}

	this._init();
}
function PageFunc()
{
    this.pathStr = "../";
	this.htmlPathStr = this.pathStr + "pc/";
	this.detectPathStr = "/../web-static/images/logo.png";
	this.loginId = "Login";
	this.coverId = "Cover";
	this.cloudPageId = "CloudAccountPage";
	this.loadPageData = {url:"", id:"", options:{}, handle:{}, handlePre:{}};
    this.loginPageData = {url:"", id:""}; /* added by WuWeier */
	this.showLoginHideNodesDelayHd;
	this.helpIdStr = "helpStr";
	this.helpTopClassStr = "helpTopClass";
	this.LGUSRSTR = "lgUsr";
	this.LGKEYSTR = "lgKey";
	this.LGKEYLEN = "lgKeyLen";
	this.LGKEYTIMESTR = "lgKeyTime";
	this.gDomainDNS = "tplogin.cn";
	this.gDomainDetectArr = null;
	this.g_cur_host_mac = "00-00-00-00-00-00";

	/* 因为暂时无法在认证前从后台获取是否支持用户名，暂时先在此设置用户名支持为false */
	this.gUsernameSupport = false;

	this.$Init = function()
	{
		Load.call(jQuery);
		$.getExplorer();
		$.initUrl();
	};

	/* 刷新session */
	this.refreshSession = function(callBack)
	{
		$.refreshSession(this.htmlPathStr + "Content.htm", callBack);
	};

	this.loadPageHandleBg = function()
	{
		var helpBtns = $("i.helpBtn");
		var idStr, helpBtn, hpTopClass;

		/* bind input hover */
		//initHoverBd();

		/* bind help */
		for (var i = 0, len = helpBtns.length; i < len; i++)
		{
			helpBtn = helpBtns[i];
			idStr = "";
			idStr = helpBtn.getAttribute(helpIdStr);
			hpTopClass = helpBtn.getAttribute(helpTopClassStr);

			if (idStr != null)
			{
				helpBind(helpBtns[i], idStr, hpTopClass);
			}
		}
	};

	this.loadLgLessPage = function(url, id, callBack, options)
	{
		var opts = (options == undefined ? {} : options);

		opts.htmlPathStr = this.pathStr + "loginLess/";
		this.loadPage(url, id, callBack, opts);
	};

	this.loadAppPage = function(url, id, callBack, options)
	{
		var opts = (options == undefined ? {} : options);
		if ($.local) {
			url = '../pc/' + url;
		}

		opts.htmlPathStr = "";
		this.loadPage(url, id, callBack, opts);
	};

	/* load page to the target container */
	this.loadPage = function(url, id, callBack, options, callBackPre)
	{
		var obj = this;

		/* for the bug of IE6.0 ~ IE8.0 */
		window.setTimeout(function(){
			var htmlPathStr = obj.htmlPathStr;

			helpClose();
			closeAlert();
			closeConfirm();
			closeLoading();
			basicAppUpgradeInfoClose();

			options = options == undefined ? {} : options;
			htmlPathStr = options.htmlPathStr == undefined ? htmlPathStr : options.htmlPathStr;

			if (false !== options.bRecordLoadPage)
			{
				/* 设置上下文环境参数 */
				setLoadPage(url, id, options, callBack, callBackPre);
			}

			$.load(htmlPathStr + url, function(result){
				typeof callBack == "function" && callBack(result);
			}, id, options, function(result){
				closeProgBar();
				typeof callBackPre == "function" && callBackPre(result);
			});
		}, 0);
	};

	this.unloadDetail = function(canvasId)
	{
		var detail = id(canvasId);
		if (detail)
		{
			emptyNodes(detail);
		}
	};

	this.detailShow = function(conId, callBack)
	{
		$("#"+conId).fadeIn(800, callBack);
	};

	this.detailHide = function(conId, canvasId)
	{
		$("#"+conId).fadeOut(800, function(){
			$("#"+conId).css("display", "none");
			window.unloadDetail(canvasId);
		});
	};

	this.selectChange = function(objId, obj)
	{
		id(objId).value = obj.options[obj.selectedIndex].text;
	};

	this.showCon = function(idStr){
		var con = id(idStr);
		var node, nodes = document.body.childNodes;
		var conDis, otherDis;

		for(var index in nodes)
		{
			node = nodes[index];
			if (node.nodeName != undefined
				&& node.nodeName.toUpperCase() == "DIV"
				&& node.id != idStr)
			{
				setStyle(node, {"display":"none"});
			}
		}

		setStyle(con, {"display":"block"});
	};

	this.loginChange = function(showTag)
	{
		var loginCon = this.id(this.loginId);
		var other = "block", login = "none";
		var node, nodes = document.body.childNodes;
		var obj = this;

		if (showTag == true)
		{
			other = "none";
			login = "block";
		}

		emptyNodes(loginCon);

		function hideNodes()
		{
			for(var index in nodes)
			{
				node = nodes[index];
				if (node.nodeName != undefined
					&& node.nodeName.toUpperCase() == "DIV"
					&& node.id != obj.loginId && node.id != obj.coverId)
				{
					obj.setStyle(node, {"display":other});
				}
			}

			obj.setStyle(loginCon, {"display":login});
			typeof showLoginHideNodesDelayHd == "function" && showLoginHideNodesDelayHd();
		}

		if (showTag == true)
		{
			var authCode = $.authRltObj["code"];

			if (ESYSRESET == authCode)
			{
				if (OS.portable == true && OS.iPad == false)
				{
					loadLgLessPage("PhoneSetPwd.htm", "Con", undefined, {bRecordLoadPage:false});
				}
				else
				{
					loadPage("LoginChgPwd.htm", "Login", hideNodes, {bRecordLoadPage:false});
				}

				emptyNodes(id("Con"));
				setLoadPage("Content.htm", "Con");
			}
			else if (ESYSLOCKEDFOREVER == authCode || ESYSLOCKED == authCode)
			{
				$.queryAuthLog(function(result){
					$.authRltObj["authLog"] = result["unauth_log_list"];
					$.authRltObj["client"] = result["curIP"];
					hideNodes();
					loadLgLessPage("LoginAuthLog.htm", "Login", undefined, {bRecordLoadPage:false});
				});
			}
			else
			{
				if (OS.portable == true && OS.iPad == false && phoneSet["bContinuePCSet"] == false)
				{
					loadLgLessPage("PhoneApp.htm", "Con", undefined, {bRecordLoadPage:false});
				}
				else
				{
					loadPage("Login.htm", "Login", hideNodes, {bRecordLoadPage:false});
				}
			}
		}
		else
		{
			this.loadPageData.options = this.loadPageData.options || {};
			this.loadPageData.options.bRecordLoadPage = false;
			this.loadPage(this.loadPageData.url, this.loadPageData.id, function(){
				typeof obj.loadPageData.handle == "function" && obj.loadPageData.handle();
			}, this.loadPageData.options, function(){
				hideNodes();
				typeof obj.loadPageData.handlePre == "function" && obj.loadPageData.handlePre();
			});
		}
	};

	this.setLoadPage = function(url, idStr, options, handle, handlePre)
	{
		this.loadPageData.url = url;
		this.loadPageData.id = idStr;
		this.loadPageData.options = options;
		this.loadPageData.handle = handle;
		this.loadPageData.handlePre = handlePre;
	};

	this.localSgInit = function()
	{
		try
		{
			this.sessionLS.init();
			if (true == isIE && false == isIENormal)
			{
				(function(){
					sessionLS.setExpire(3*1000);
					window.setTimeout(arguments.callee, 1*1000);
				})();
			}
		}catch(ex){}

		if (typeof this.gUsernameSupport != "undefined" && this.gUsernameSupport)
		{
			this.getLgUsr();
		}

		this.getLgPwd();
	};

	this.auth = function()
	{
		$.auth($.pwd);
	};

	this.getLgUsr = function()
	{
		try
		{
			$.usr = sessionLS.getItem(this.LGUSRSTR);
		}catch(ex){};
	}

	this.getLgPwd = function()
	{
		try
		{
			$.pwd = sessionLS.getItem(this.LGKEYSTR);
			if (gCloudAccountBR["pwdLen"] == 0)
			{
				gCloudAccountBR["pwdLen"] = parseInt(sessionLS.getItem(this.LGKEYLEN));
			}
		}catch(ex){};
	};

	this.showLogin = function(func)
	{
		this.showLoginHideNodesDelayHd = func;
		this.loginChange(true);
	};

	this.unloadLogin = function()
	{
		this.loginChange(false);
	};

	this.ifrmOrgUrl = function(code)
	{
		return ("/stok=" + encodeURIComponent($.session) + "?code=" + code);
	};

	this.iFrmOnload = function (idStr, callBack, unAuthHandle)
	{
		var data = {}, errorno = ENONE;
		var ifrm = id(idStr);
		var isNum = false, j, ret;

		try
		{
			if (ifrm.contentWindow)
			{
				data.responeText = ifrm.contentWindow.document.body ? ifrm.contentWindow.document.body.innerHTML : null;
				data.responeXML = ifrm.contentWindow.document.XMLDocument ? ifrm.contentWindow.document.XMLDocument : ifrm.contentWindow.document;
			}
			else
			{
				data.responeText = ifrm.contentDocument.document.body ? ifrm.contentDocument.document.body.innerHTML : null;
				data.responeXML = ifrm.contentDocument.document.XMLDocument ? ifrm.contentDocument.document.XMLDocument : ifrm.contentDocument.document;
			}

			if (/(<pre>)?(.+)(<\/pre>)+/.test(data.responeText) ||
				/(<pre>)?(.+)/.test(data.responeText))
			{
				j = RegExp["$2"];
			}

			ret = JSON.parse(j);
			errorno = ret[ERR_CODE];

			/* 错误。直接退出 */
			if (errorno != ENONE)
			{
				closeProgBar();
			}

			callBack(errorno, ret);
		}
		catch(ex)
		{
			closeProgBar();
			callBack(EINVFMT);
		}
	};

	this.windowSleep = function(milliSeconds)
	{
		var now = new Date();
		var exitTime = now.getTime() + milliSeconds;
		while (true)
		{
			now = new Date();
			if (now.getTime() > exitTime)
			{
				return;
			}
		}
	};

	/* 获取本机MAC地址 */
	this.getCurrPcMac = function()
	{
		var pos, result = $.getPeerMac();

		if (ENONE != result.errorno || "" == result.data)
		{
			return "00-00-00-00-00-00";
		}

		pos = result.data.indexOf("\r\n");
		return result.data.substring(0, pos);
	};

	/* 克隆本机MAC地址 */
	this.cloneLocalMac = function(){
		var system = $.readEx(SYSTEM_DATA_ID);
		var localMac = this.getCurrPcMac();
		var errNo = ENONE;

		if (system.mac[1] != localMac)
		{
			system.mac[1] = localMac;
			errNo = $.write($.toText(system), $.block);
		}

		return errNo;
	};

	/* 获取log */
	this.logSave = function()
	{
		var url = "/syslog.txt?disposition=1";
		var domain = $.domainUrl;

		if (domain.lastIndexOf("/") == (domain.length - 1))
		{
			domain = domain.substring(0, domain.length - 1);
		}

		location.href = domain + $.orgURL(url);

		return true;
	};

	/* check for dns redirect */
	this.pageRedirect = function()
	{
		var url = window.top.location.href;

		var ipv4Rex = /^((https?:\/\/)*(\d{1,3}\.){3}\d{1,3})/g;
		var ipv6Rex = /^((https?:\/\/)*\[\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\])/g;

		/* 处理DNS重定向 */
		if ((typeof MULTI_DOMAIN_SUPPORT == "undefined" || !MULTI_DOMAIN_SUPPORT) &&
			USER_GROUP_REMOTE != $.authRltObj["group"] &&
			false == ipv4Rex.test(url) &&
			false == ipv6Rex.test(url) &&
			url.indexOf(gDomainDNS) < 0 && false == $.local)
		{
			var protocol = window.top.location.protocol;
			window.top.location.href = protocol + "//" + gDomainDNS;
		}
	};

	this.lanConnectTestTimer = null;
	this.lanDetectFailCount = 0;
	this.lanConnectTest = function()
	{
		var MAX_FAIL_COUNT = 5;
		var DETECT_INTERVAL_TIME = 1000;
		var DETECT_TIMEOUT_VAL = 5000;
		var TEST_LAN_CONNECT_TIMEOUT = 30000;

		var detectSuccessHandle = function()
		{
			lanDetectFailCount = 0;
			clearInterval(lanDetectInterval);

			if ($("#Error .detail").html() == label.disconnectWarning)
			{
				closeAlert();
			}
		};

		var detectFailedHandle = function()
		{
			lanDetectFailCount++;
			console.log(lanDetectFailCount)

			if (lanDetectFailCount >= MAX_FAIL_COUNT)
			{
				lanDetectFailCount = 0;
				clearInterval(lanDetectInterval);
				clearTimeout(lanConnectTestTimer);

				if ((id("Cover") !== null && id("Cover").style.display !== "none") ||
					(id("CoverB") !== null && id("CoverB").style.display !== "none") ||
					(id("CoverC") !== null && id("CoverC").style.display !== "none"))
				{
					return;
				}

				showAlert(label.disconnectWarning, undefined, undefined, function(){
					window.location.reload();
				}, btn.refresh, false);
			}
		}

		var lanDetectInterval = setInterval(function(){
			$.detect(detectSuccessHandle, DETECT_TIMEOUT_VAL, detectFailedHandle);
		}, DETECT_INTERVAL_TIME);

		// 30秒检测一次是否还保持着连接
		lanConnectTestTimer = setTimeout(function(){
			clearInterval(lanDetectInterval);
			lanConnectTest();
		}, TEST_LAN_CONNECT_TIMEOUT);
	}

	this.resizeWindow = function(){
		var pageWidth = $(window).width();

		var BROWSER_SCROLLBAR_WIDTH = 20;
		var CONTENT_WIDTH = 980;
		var LEFT_CONTENT_WIDTH = 235;
		var RIGHT_CONTENT_WIDTH = 745;
		var pageLeftWidth;
		var pageRightWidth;

		if (pageWidth > 980)
		{
			pageLeftWidth = (pageWidth - CONTENT_WIDTH) / 2 + LEFT_CONTENT_WIDTH;
			pageRightWidth = (pageWidth - CONTENT_WIDTH) / 2 + RIGHT_CONTENT_WIDTH - BROWSER_SCROLLBAR_WIDTH;  // 预留浏览器原生滚动条的宽度

			if (typeof pageLeftWidth == "number" && pageLeftWidth % 1 != 0)
			{
				pageLeftWidth = parseInt(pageLeftWidth) + 1;
				pageRightWidth = parseInt(pageRightWidth);
			}
		}
		else
		{
			pageLeftWidth = LEFT_CONTENT_WIDTH;
			pageRightWidth = RIGHT_CONTENT_WIDTH;
		}

		$("#resizeStyle").remove();
		$(document.body).append('<style id="resizeStyle">' +
			'div.bConfLCnt{width:' + pageLeftWidth + 'px;}' +
			'div.bConfRCnt{width:' + pageRightWidth + 'px;}' +
			'#headLCnt{width:' + pageLeftWidth + 'px;}' +
			'#headRCnt{width:' + pageRightWidth + 'px;}' +
		'</style>');
	}

	this.pageOnload = function()
	{
		var links = [{tag:"link", url:"../web-static/dynaform/DataGrid.css"},
		             {tag:"link", url:"../web-static/dynaform/PortConfig.css"}];

		var scripts = [{tag:"script", url:"../web-static/dynaform/DataGrid.js"},
					   {tag:"script", url:"../web-static/dynaform/PortConfig.js"},
					   {tag:"script", url:"../web-static/dynaform/menu.js"}];

		var delayscripts = [{tag:"script", url:"../web-static/lib/ajax.js"},
							{tag:"script", url:"../web-static/dynaform/uci.js"},
							{tag:"script", url:"../web-static/language/cn/str.js"},
							{tag:"script", url:"../web-static/language/cn/error.js"},
							{tag:"script", url:"../web-static/lib/verify.js"},
							{tag:"script", url:"../web-static/dynaform/macFactory.js"},
							{tag:"script", url:"../web-static/dynaform/settings.js"},
							{tag:"script", url:"../web-static/dynaform/qrcode.js"}];

		var prescripts = [{tag:"script", url:"../web-static/lib/json.js"},
						  {tag:"script", url:"../web-static/lib/jquery-1.10.1.js"}];

		this.loadExternResource({scripts:prescripts, callBack:function(){
			this.loadExternResource({scripts:delayscripts, callBack:function()
			{
				var url = window.top.location.href;

				$Init();

				/* 注册相应处理函数 */
				$.setexternJSP(replaceJSP);
				$.setExternPageHandle(loadPageHandleBg);
				$.setLoginErrHandle(showLogin);
				$.setPRHandle(pageRedirect);

				//window.authInfo = [];
				this.loadExternResource({scripts:scripts, links:links});
				this.compatibleShow();
				this.localSgInit();

				/* 探测LAN连通性 */
				/* Portal页面不进行连通性检测 */
				if (false == OS.portable) {
					this.lanConnectTest();
				}

				// 绑定窗口左右部分宽度动态调整
				$(window).resize(resizeWindow);

				if (true == $.local)
				{
					this.loadPage("Content.htm", "Con");
					return;
				}

				if (false == /^((https?:\/\/)*(\d{1,3}\.){3}\d{1,3})/g.test(url) &&
					url.indexOf(gDomainDNS) >= 0)
				{
					var reqData = {};

					reqData[uciSystem.actionName.getDomainArray] = null;
					$.action(reqData, function(result){
						if (ENONE == result[ERR_CODE])
						{
							var dataArry = result[uciSystem.dynData.domainArray];

							if (dataArry.length > 1)
							{
								this.gDomainDetectArr = dataArry;
								this.loadLgLessPage("RouterSelect.htm", "Con", undefined, {bRecordLoadPage:false});
							}
							else
							{
								this.loadPage("Content.htm", "Con");
							}
						}
						else
						{
							this.loadPage("Content.htm", "Con");
						}
					});
				}
				else
				{
					this.loadPage("Content.htm", "Con");
				}
			}});
		}});

		document.oncontextmenu = function(event){
			return false;
		};

		if (isIESix)
		{
			try{document.execCommand('BackgroundImageCache', false, true);}catch(e){};
		}
	};

	/* 异步加载资源 */
	this.loadExternResource = function(obj)
	{
		var elem, links, scripts, callBack, hasReadyState;
		var head = document.getElementsByTagName("head")[0];
		var ObjOrg = {links:null, scripts:null, callBack:null};

		/* 初始化参数列表 */
		for(var prop in obj)
		{
			ObjOrg[prop] = obj[prop];
		}

		links = ObjOrg.links;
		scripts = ObjOrg.scripts;
		callBack = ObjOrg.callBack;

		/* 加载CSS */
		if (links != undefined)
		{
			for (var i in links)
			{
				elem = document.createElement("link");
				elem.rel = "stylesheet";
				elem.href = links[i].url;
				head.appendChild(elem);
			}
		}

		/* 加载js */
		if (scripts != undefined)
		{
			var load, loadHandle, loadCallBack;

			elem = document.createElement("script");
			elem.type = "text/javascript";

			if (callBack != undefined)
			{
				hasReadyState = (elem.readyState != undefined);
				loadCallBack = function(index)
				{
					scripts[index].loadState = true;

					for (var j in scripts)
					{
						if (false == scripts[j].loadState)
						{
							return;
						}
					}

					callBack();
				};

				for (var i in scripts)
				{
					scripts[i].loadState = false;
				}
			}

			for (var i in scripts)
			{
				elem = document.createElement("script");
				elem.type = "text/javascript";

					if (callBack != undefined)
					{
						if (hasReadyState)
						{
							elem.onreadystatechange = (function(index){
								return function(){
									if (this.readyState == "loaded" || this.readyState == "complete")
									{
										this.onreadystatechange = null;
										loadCallBack(index);
									}
								};
							})(i);
						}
						else
						{
							elem.onload = (function(index){
								return function(){
									loadCallBack(index);
								};
							})(i);
						}
					}

				elem.src = scripts[i].url;
				head.appendChild(elem);
			}
		}
	};
}
function Cover()
{
	Style.call(this);
	this.CoverId = "Cover";
	this.CoverIdB = "CoverB";
	this.CoverIdC = "CoverC";

	this.hideCover = function(callBack, externStyles)
	{
		var cover = id(this.CoverId);

		this.setStyle(cover, {"display":"none", "visibility":"hidden"});
		this.setStyle(cover, externStyles);

		if (typeof callBack == "function")
		{
			callBack(cover);
		}

		emptyNodes(cover);
	};

	this.showCover = function(callBack, externStyles)
	{
		var cover = id(this.CoverId);

		this.setStyle(cover, {"display":"block", "visibility":"visible"});
		this.setStyle(cover, externStyles);
		$(cover).css("opacity", "0.8");

		if (typeof callBack != "undefined")
		{
			callBack(cover);
		}
	};

	/* 此Cover不随着loadPage消除 */
	this.showCoverB = function(callBack, externStyles)
	{
		var cover = id(this.CoverIdB);

		if (undefined == cover)
		{
			cover = document.createElement("div");
			cover.id = this.CoverIdB;
			document.body.appendChild(cover);
		}

		this.setStyle(cover, {"display":"block", "visibility":"visible"});
		this.setStyle(cover, externStyles);
		$(cover).css("opacity", "0.8");

		if (typeof callBack != "undefined")
		{
			callBack(cover);
		}
	};

	this.hideCoverB = function(callBack, externStyles)
	{
		var cover = id(this.CoverIdB);

		if (undefined != cover)
		{
			this.setStyle(cover, {"display":"none", "visibility":"hidden"});
			this.setStyle(cover, externStyles);

			if (typeof callBack == "function")
			{
				callBack(cover);
			}

			emptyNodes(cover);
		}
	};

	this.showCoverC = function(callBack, externStyles)
	{
		var cover = id(this.CoverIdC);

		if (undefined == cover)
		{
			cover = document.createElement("div");
			cover.id = this.CoverIdC;
			document.body.appendChild(cover);
		}

		this.setStyle(cover, {"display":"block", "visibility":"visible"});
		this.setStyle(cover, externStyles);
		$(cover).css("opacity", "0.8");

		if (typeof callBack != "undefined")
		{
			callBack(cover);
		}
	};

	this.hideCoverC = function(callBack, externStyles)
	{
		var cover = id(this.CoverIdC);

		if (undefined != cover)
		{
			this.setStyle(cover, {"display":"none", "visibility":"hidden"});
			this.setStyle(cover, externStyles);

			if (typeof callBack == "function")
			{
				callBack(cover);
			}

			emptyNodes(cover);
		}
	};
}
function Style()
{
	this.disableCol = "#b2b2b2";

	/* set the element styles with the styles */
	this.setStyle = function (ele, styles)
	{
		if (ele == null || styles == null || ele.nodeType != 1)
		{
			return;
		}

		for (var property in styles)
		{
			try
			{
				ele.style[property] = styles[property];
			}catch(ex){}
		}
	};

	/* get the default style of the element*/
	this.getNodeDefaultView = function(element, cssProperty)
	{
		var dv = null;
		if (!(element))
		{
			return null;
		}

		try{
			if (element.currentStyle)
			{
				dv = element.currentStyle;
			}
			else
			{
				dv = document.defaultView.getComputedStyle(element, null);
			}

			if (cssProperty != undefined)
			{
				return dv[cssProperty];
			}
			else
			{
				return dv;
			}
		}catch(ex){}
	};
}
function LocalStorageSD()
{
	try
	{
		if (null == this.sessionStorage)
		{
			this.sessionLS = {
				file_name:"user_data_default_SD",
				dom:null,
				init:function()
				{
					var dom = document.createElement('input');

					dom.type = "hidden";
					dom.addBehavior("#default#userData");
					document.body.appendChild(dom);
					dom.save(this.file_name);
					this.dom = dom;
				},
				setItem:function(k, v)
				{
					this.dom.setAttribute(k,v);
					this.dom.save(this.file_name);
				},
				getItem:function(k, file_name)
				{
					this.dom.load(this.file_name);
					return this.dom.getAttribute(k);
				},
				removeItem:function(k)
				{
					this.dom.removeAttribute(k);
					this.dom.save(this.file_name);
				},
				setExpire:function(timeSecond)
				{
				   var now = new Date();

				   now = new Date(now.getTime() + timeSecond);
				   this.dom.load(this.file_name);
				   this.dom.expires = now.toUTCString();
				   this.dom.save(this.file_name);
				}
			};
		}
		else
		{
			this.sessionLS = sessionStorage;
		}
	}catch(ex){};
}
function Explorer()
{
	this.isIE = false;
	this.isIESix = false;
	this.isIESeven = false;
	this.isIENormal = false;
	this.isIETenLess = false;
	this.explorerInfo = navigator.userAgent;

	this.getIEInfo = function ()
	{
		isIE = /msie ((\d+\.)+\d+)/i.test(explorerInfo)?(document.mode || RegExp["$1"]):false;
		if (isIE != false)
		{
			if (isIE <= 6)
			{
				this.isIESix = true;
			}
			else if (isIE == 7)
			{
				this.isIESeven = true;
			}
			else if (isIE >= 9)
			{
				this.isIENormal = true;
			}

			if (isIE <= 10)
			{
				this.isIETenLess = true;
			}

			this.isIE = true;
		}
	};

	this.compatibleShow = function(){
		if (true == this.isIESix)
		{
			var posDiv, conDiv, i, span, spanClose;
			var closeKey = "ieSixClosed";

			if (document.cookie.indexOf(closeKey) >= 0)
			{
				return;
			}

			posDiv = $("div.ieSixCompatible");
			if (undefined == posDiv[0])
			{
				posDiv = el("div");
				posDiv.className = "ieSixCompatible";

				conDiv = el("div");
				conDiv.className = "ieSixCpCon";

				i = el("i");

				span = el("span");
				span.className = "spanNote";
				span.innerHTML = label.IESixCpTip;

				spanClose = el("span");
				spanClose.className = "spanClose";
				spanClose.innerHTML = label.iknown;
				spanClose.onclick = function(){
					document.cookie = closeKey + "=true";
					posDiv.style.visibility = "hidden";
					posDiv.style.top = "-9999px";
				};

				conDiv.appendChild(i);
				conDiv.appendChild(span);
				conDiv.appendChild(spanClose);
				posDiv.appendChild(conDiv);
				document.body.appendChild(posDiv);
			}
		}
	};

	this.createGroupRadio = function(name){
		var raidoEl;

		if (undefined == name)
		{
			return raidoEl;
		}

		if (this.isIE == true && this.isIENormal == false)
		{
			raidoEl = document.createElement("<input name='"+ name +"' />");
		}
		else
		{
			raidoEl = document.createElement("input");
			raidoEl.name = name;
		}

		return raidoEl;
	};

	this.getIEInfo();
}
function Tool()
{
	this.gAppPreUrl = "";
	Style.call(this);

	/* get element by id */
	this.id = function(idStr)
	{
		if (idStr != undefined)
		{
			return document.getElementById(idStr);
		}
	};

	/* create element */
	this.el = function(str)
	{
		try
		{
			return document.createElement(str);
		}catch(ex){return null;}
	};

	/* replace {%....%} to realize multi languages */
	/* replace {#appPreUrl#} to realize app url */
	this.replaceJSP = function(str)
	{
		var matches = null, strRepace;
		var tagL = "{%", tagR = "%}";
		var rp = /{%(\w+)\.(\w+)%}/i;
		var appPreUrlExg = /{#appPreUrl#}/g;

		matches = rp.exec(str);
		try
		{
			while(matches != null)
			{
				strRepace = language[matches[1]][matches[2]];
				str = str.replace(tagL + matches[1] + "." + matches[2] + tagR, strRepace);
				matches = rp.exec(str);
			}
		}catch(ex){}

		/* replace app url */
		try
		{
			if (true == $.local)
			{
				appPreUrlExg = /{#appPreUrl#}\//g;
			}

			str = str.replace(appPreUrlExg, gAppPreUrl);
		}catch(ex){}

		return str;
	};

	/* get the offsetLeft and offsetTop to the border of the container(default is browser) */
	this.getoffset = function(obj, container)
	{
		var tempObj = obj;
		var relPo = {
			top:0,
			left:0
		};

		while(true)
		{
			if (tempObj == container)
			{
				break;
			}

			relPo.left += parseInt(tempObj.offsetLeft);
			relPo.top += parseInt(tempObj.offsetTop);
			tempObj = tempObj.offsetParent;
		}

		return relPo;
	};

	this.attachEvnt = function(target, event, handle)
	{
		if (event.indexOf("on") == 0)
		{
			event = event.substring(2);
		}

		if (document.body.attachEvent)
		{
			target.attachEvent("on"+event, handle);
		}
		else
		{
			target.addEventListener(event, handle, false);
		}
	};

	this.detachEvnt = function(target, event, handle){
		if (event.indexOf("on") == 0)
		{
			event = event.substring(2);
		}

		if (document.body.attachEvent)
		{
			target.detachEvent("on" + event, handle);
		}
		else
		{
			target.removeEventListener(event, handle, false);
		}
	};

	/* stop propagation of event */
	this.stopProp = function (event)
	{
		event = event || window.event;
		if (undefined == event)
		{
			return;
		}

		if (event.stopPropagation)
		{
			event.stopPropagation();
		}
		else
		{
			event.cancelBubble = true;
		}
	};

	/* prevent defaut operation of event */
	this.eventPreventDefault = function (event)
	{
		event = event || window.event;
		if (undefined == event)
		{
			return;
		}

		if (event.preventDefault)
		{
			event.preventDefault();
		}
		else
		{
			event.returnValue = false;
		}
	};

	/* clear selection produced width mouse move */
	this.clearSelection = function ()
	{
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
	};

	/* 设置dom上range的光标位置 */
	this.setDomCursorPos = function (dom, pos)
	{
		if (dom.setSelectionRange)
		{
			dom.focus();
			dom.setSelectionRange(pos, pos);
		}
		else if (dom.createTextRange)
		{
			var range = dom.createTextRange()
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	/* get the pos of the mouse width the event */
	this.getMousePos = function (event)
	{
		event = event || window.event;
		var doc = document;
		var pos = (event.pageX || event.pageY) ? {x:event.pageX,y:event.pageY}:
				{x:event.clientX + doc.documentElement.scrollLeft - doc.documentElement.clientLeft,
				 y:event.clientY + doc.documentElement.scrollTop - doc.documentElement.clientTop};
		return pos;
	};

	/* 判断对象是否是数组 */
	this.isArray = function (obj)
	{
		return Object.prototype.toString.call(obj) === '[object Array]';
	};

	/* create up down */
	this.upDown = function (con, taId, classNameUp, classNameDown, callBack)
	{
		if (classNameUp == undefined || classNameDown == undefined)
		{
			return;
		}

		var lbl = this.el("label");

		lbl.className = classNameDown;
		lbl.onclick = function(){
			$("#"+taId).slideToggle("normal", function(){
				lbl.className = (lbl.className == classNameUp?classNameDown:classNameUp);
				if (callBack)
				{
					try
					{
						callBack();
					}catch(ex){}
				}
			});
		};
		con.appendChild(lbl);

		return lbl;
	};

	this.arrowUpDown = function (con, taId, callBack){
		this.upDown(con, taId, "arrowUp", "arrowDown", callBack);
	};

	/* 获取dom节点下指定类型的节点，index可选, filter:"input checkbox" */
	this.getChildNode = function(parent, filter, index){
		var childs = parent.childNodes;
		var nodes = [], count = 0, tempNode;
		var paras = filter.split(" ");
		var nodeName = paras[0], type = paras[1];

		for(var i = 0, len = childs.length;i < len; i++)
		{
			tempNode = childs[i];
			if (tempNode.nodeType == 1 && tempNode.tagName.toLowerCase() == nodeName)
			{
				if (type != undefined && tempNode["type"] == type)
				{
					nodes[count] = tempNode;
					count++;
				}
				else if (type == undefined)
				{
					nodes[count] = tempNode;
					count++;
				}
			}
		}
		if (index != undefined)
		{
			return nodes[index];
		}

		return nodes[0];
	};

	/* 检查节点是否可见 */
	this.checkInHorize = function(ta){
		var node = ta;
		while(node != null && node.nodeName.toUpperCase() != "HTML")
		{
			if (this.getNodeDefaultView(node, "visibility") == "hidden" ||
				this.getNodeDefaultView(node, "display") == "none")
			{
				return false;
			}
			node = node.parentNode;
		}

		return true;
	};

	this.setUrlHash = function(key, value)
	{
		var strH, strT, pos, tag ="";
		var url = location.href;
		var hash = location.hash;

		if (key == undefined ||
			value == undefined ||
			key.length == 0)
		{
			return;
		}

		if (hash.length != 0)
		{
			pos = hash.indexOf(key);
			if (pos >= 0)
			{
				strH = hash.substring(0, pos);
				strT = hash.substring(pos);
				pos = strT.indexOf("#");
				if (pos > 0)
				{
					strT = strT.substring(pos);
					hash = strH + key + "=" + value + strT;
				}
				else
				{
					hash = strH + key + "=" + value;
				}
			}
			else
			{
				if (hash.substring(hash.length - 1) != "#")
				{
					tag = "#";
				}
				hash += (tag + key + "=" + value);
			}

			location.href = url.substring(0, url.indexOf("#")) + hash;
		}
		else
		{
			if (url.lastIndexOf("#") == (url.length - 1))
			{
				location.href += (key + "=" + value);
			}
			else
			{
				location.href += ("#" + key + "=" + value);
			}
		}
	};

	this.getUrlHash = function(key)
	{
		var hash = location.hash;
		var pos = hash.indexOf(key);
		var strArr, tempArr, value = "";

		if (pos > 0)
		{
			strArr = hash.substring(1).split("#");
			for(var index in strArr)
			{
				tempArr = strArr[index].split("=");
				if (tempArr[0] == key)
				{
					value = tempArr[1];
					break;
				}
			}
		}

		return value;
	};

	this.changeUrlHash = function(str)
	{
		var url = location.href;
		var pos = url.indexOf("#");

		if (str == undefined)
		{
			return;
		}

		if (pos > 0)
		{
			location.href = url.substring(0, pos + 1) + str;
		}
		else
		{
			location.href = url + "#" +str;
		}
	};

	/* 设置输入框的光标的位置 */
	this.setInputCursor = function(input){
		var len = input.value.length;

		this.setDomCursorPos(input, len);
	};

	/* 获取字符串的长度 */
	this.getCNStrLen = function(str){
		return str.replace(/[^\x00-\xFF]/g, "xxx").length;	// modified by xiesimin: SLP采用UTF-8编码
	};

	/* BEGIN: added by xiesimin */
	/* SLP采用UTF-8编码，存储中文时每个中文占3个字节，但页面显示时，每个中文字符的宽度还是按2个字符计算 */
	this.getDisplayStrLen = function(str) {
		return str.replace(/[^\x00-\xFF]/g, "xx").length;	// modified by xiesimin: SLP采用UTF-8编码
	};
	/* END: added by xiesimin */

	/* 截取字符串，如果超过maxNum则以...结束 */
	this.getStrInMax = function(value, maxNum){
		var str = "", strTemp, j = 0;
		var tmpStr = value.replace(/[A-Z]/g, "xx");

		if (getDisplayStrLen(tmpStr) <= maxNum)
		{
			return value;
		}

		for(var count = 1; count <= maxNum; count++)
		{
			strTemp = value.charAt(j);
			if (strTemp == "")
			{
				break;
			}

			/*BEGIN: modified by xiesimin, SLP采用UTF-8编码*/
			if (getDisplayStrLen(strTemp) > 1)
			{
				count+=(getDisplayStrLen(strTemp)-1);
				str += strTemp;
				beCut = true;
			}
			else if (/[A-Z]/g.test(strTemp) == true)
			{
				count++;
				str += strTemp;
				beCut = true;
			}
			else
			{
				str += strTemp;
			}
			/*END: modified by xiesimin, SLP采用UTF-8编码*/

			j++;
		}
		return str + "...";
	};

	this.EncodeURLIMG = document.createElement("img");

	/* 对多字节字符编码 */
	this.escapeDBC = function(s)
	{
		var img = this.EncodeURLIMG;

		if (!s)
		{
			return "";
		}

		if (window.ActiveXObject)
		{
			/* 如果是IE, 使用vbscript */
			execScript('SetLocale "zh-cn"', 'vbscript');
			return s.replace(/[\d\D]/g, function($0) {
				window.vbsval = "";
				execScript('window.vbsval=Hex(Asc("' + $0 + '"))', "vbscript");
				return "%" + window.vbsval.slice(0,2) + "%" + window.vbsval.slice(-2);
			});
		}

		/* 其它浏览器利用浏览器对请求地址自动编码的特性 */
		img.src = "nothing.png?separator=" + s;

		return img.src.split("?separator=").pop();
	};

	/* 对URL的参数进行GBK或UTF-8编码 */
	this.encodeURL = function(s)
	{
		return encodeURIComponent(s);

		/* 把 多字节字符 与 单字节字符 分开，分别使用 escapeDBC 和 encodeURIComponent 进行编码 */
		/*return s.replace(/([^\x00-\xff]+)|([\x00-\xff]+)/g, function($0, $1, $2) {
			return escapeDBC($1) + encodeURIComponent($2 || '');
		});*/
	};

	this.doNothing = function()
	{
		return true;
	};

	/* 转换特殊的HTML标记 */
	this.htmlEscape = function(str)
	{
		var escapseStr = str;

		if (undefined != escapseStr)
		{
			escapseStr = escapseStr.toString().replace(/[<>&"]/g, function(match){
				switch(match)
				{
				case "<":
					return "&lt;";
				case ">":
					return "&gt;";
				case "&":
					return "&amp;";
				case "\"":
					return "&quot;";
				}
			});
		}

		return escapseStr;
	};

	this.orgAuthPwd = function(pwd)
	{
		var strDe = "RDpbLfCPsJZ7fiv";
		var dic = "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciX"+
				  "TysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgML"+
				  "wygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3"+
				  "sfQ1xtXcPcf1aT303wAQhv66qzW";

		return this.securityEncode(pwd, strDe, dic);
	};

	this.securityEncode = function(input1, input2, input3)
	{
		var dictionary = input3;
		var output = "";
		var len, len1, len2, lenDict;
		var cl = 0xBB, cr = 0xBB;

		len1 = input1.length;
		len2 = input2.length;
		lenDict = dictionary.length;
		len = len1 > len2 ? len1 : len2;

		for (var index = 0; index < len; index++)
		{
			cl = 0xBB;
			cr = 0xBB;

			if (index >= len1)
			{
				cr = input2.charCodeAt(index);
			}
			else if (index >= len2)
			{
				cl = input1.charCodeAt(index);
			}
			else
			{
				cl = input1.charCodeAt(index);
				cr = input2.charCodeAt(index);
			}

			output += dictionary.charAt((cl ^ cr)%lenDict);
		}

		return output;
	};

	/* 模拟鼠标点击操作 */
	this.simulateMouseC = function (target)
	{
		if (true == isIE && false == isIENormal)
		{
			simulateMouseC = function(target){
				var event = document.createEventObject();

				event.sceenX = 100;
				event.sceenY = 0;
				event.clientX = 0;
				event.clientY = 0;
				event.ctrlKey = false;
				event.altKey = false;
				event.shiftKey = false;
				event.button = 0;

				target.fireEvent("onclick", event);
			};
		}
		else
		{
			simulateMouseC = function(){};
		}

		simulateMouseC(target);
	};

	this.emptyNodes = function(node)
	{
		/* for the bug of MSIE 6.0 */
		/*if (node)
		{
			node.innerHTML = "";
			return;
		}*/

		while(node && node.firstChild)
		{
			node.removeChild(node.firstChild);
		}
	};

	this.netSpeedTrans = function(speed)
	{
		var kSpeed = 1024;
		var mSpeed = kSpeed * 1024;
		var gSpeed = mSpeed * 1024;

		speed = parseInt(speed);

		if (speed >= gSpeed)
		{
			speed = (speed/gSpeed).toFixed(0) + "GB/s";
		}
		else if (speed >= mSpeed)
		{
			speed = (speed/mSpeed).toFixed(0) + "MB/s";
		}
		else
		{
			speed = (speed/kSpeed).toFixed(0) + "KB/s";
		}

		return speed.toString();
	};

	this.debugInfo = function(arg){
		console.log(arg);
	};

	this.compareObj = function(objS, objT){
		var tag = true;

		for (var item in objS)
		{
			if ("object" == typeof objS[item])
			{
				if (undefined != objT[item])
				{
					tag = compareObj(objS[item], objT[item]);
					if (tag == false)
					{
						return false;
					}
				}
				else
				{
					return false;
				}
			}
			else
			{
				if (objS[item] != objT[item])
				{
					return false;
				}
			}
		}

		return tag;
	};

	/* 将unicode中的空格替换成ASCII空格（值为32） */
	this.replaceUnicodeBlank = function(obj)
	{
		if (undefined == obj || undefined == obj.value)
		{
			return;
		}

		var reg = /[\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]/gi;
		var val = obj.value;
		var replaceStr = val.replace(reg, " ");

		if (val !== replaceStr)
		{
			obj.value = replaceStr;
		}

		return replaceStr;
	}

	/* 修复IOS系统CNA浏览器默认使用第三方输入法无法输入的问题 */
	this.adaptCNABrowserInput = function(idStr){
		try
		{
			/* 仅为CNA浏览器时进行该处理 */
			if ("NO" == gBeInCNA)
			{
				return;
			}

			id(idStr).onfocus = function(){
				var input = this;
				var value = input.value;

				input.value = "";
				input.type = "password";
				$.setTimeout(function(){
					input.type = "text";
					input.value = value;
				}, 0);
			};
		}
		catch(ex)
		{}
	};
}
function Switch(switchId, state, callback)
{
	this.switchCon = id(switchId);
	this.switchBall = $("#" + switchId + " i.switchBall")[0];
	this.switchBg = $("#" + switchId + " i.switchBg")[0];
	this.callback = callback;
	this.state = state;
	this.rightPos;

	if (typeof Switch.prototype.switchInit != "function")
	{
		Switch.prototype.switchInit = function(){
			var objThis = this;
			var state = this.state;
			var switchBall = this.switchBall;
			var switchCon = this.switchCon;
			var switchBg = this.switchBg;

			if (switchCon == null || switchBall == null)
			{
				return;
			}

			this.rightPos = switchCon.offsetWidth - switchBall.offsetWidth;
			this.setState(state);
			this.callback&&this.callback(state);
			switchBall.onmousedown = this.draggableBind();
			switchBg.onclick = this.switchBgClick();
		};

		/* 设置状态 */
		Switch.prototype.setState = function(state){
			var switchCon = this.switchCon;
			var switchBall = this.switchBall;

			this.state = state;
			switchCon.value = state;
			switchBall.style.left = state*this.rightPos + "px";

			if (state == 1)
			{
				switchBall.style.backgroundColor = "#FEEB1A";
			}
			else
			{
				switchBall.style.backgroundColor = "#D9D9D9";
			}
			//hsSwitchState(switchCon.id, state);
		};

		/* 状态修改 */
		Switch.prototype.switchChgState = function(state){
			state = 1 - state;
			this.setState(state);
			this.callback&&this.callback(state);
		};

		/* 点击的响应函数 */
		Switch.prototype.switchCHandle = function(){
			/* 1为on, 0 为off */
			var state = this.state;
			var switchBall = this.switchBall;
			var tag = (state == 1 ? -1 : 1);
			var left = parseInt(switchBall.style.left);
			var width = this.rightPos;
			var obj = this;

			/* on to off */
			if ((state == 1 && left <= 0) || (state == 0 && left >= width))
			{
				this.switchChgState(state);
				return;
			}

			switchBall.style.left = left + tag*width/8 + "px";
			window.setTimeout(function(){obj.switchCHandle()}, 20);
		};

		Switch.prototype.msMove = function(ta, currMousePos, distance)
		{
			var taWidth = ta.offsetWidth;
			var posX = currMousePos.x - distance.x;
			var maxX = this.switchCon.offsetWidth - taWidth;

			posX = posX > 0 ? posX:0;
			posX = posX > maxX ? maxX:posX;
			ta.style.left = posX + "px";
		};

		/* switchBg的点击处理函数 */
		Switch.prototype.switchBgClick = function(){
			var objThis = this;

			return function(event){
				event = event || window.event;
				var target = event.target || event.srcElement;

				if (objThis.switchBg == target)
				{
					objThis.switchCHandle();
				}
			};
		};

		Switch.prototype.draggableBind = function()
		{
			var thisObj = this;

			return function(event){
				event = event ? event : window.event;
				var currMousePos = getMousePos(event);
				var ta = event.target || event.srcElement;

				/* 记录鼠标按下瞬间鼠标与控件左上角的距离 */
				var distance = {x:currMousePos.x - ta.offsetLeft};

				document.onmousemove = function(event)
				{
					event = event ? event : window.event;
					var currMousePos = getMousePos(event);

					clearSelection();
					thisObj.msMove(ta, currMousePos, distance);
				};

				document.onmouseup = function(event)
				{
					clearSelection();
					document.onmousemove = null;
					document.onmouseup = null;
					thisObj.switchCHandle();
				};

				stopProp(event);
			};
		};
	}

	this.switchInit();
}
function HighSet()
{
	this.IMG_HS_LOADING_GREEN = "IMG_HS_LOADING_GREEN";
	this.IMG_HS_LOADING_BLUE = "IMG_HS_LOADING_BLUE";
	this.IMG_HS_LOADING_RED = "IMG_HS_LOADING_RED";
	this.IMG_HS_LOADING_YELLOW = "IMG_HS_LOADING_YELLOW";
	this.IMG_HS_LOADING_WZD = "IMG_HS_LOADING_WZD";

	/* 存储提交按钮的Id */
	this.hsLoadingObj = {
		subBtnId:"",
		handleLoad:"",
		handleDelayHd:null,
		loadImgKey:IMG_HS_LOADING_BLUE,
		loadImgCol:{
			"IMG_HS_LOADING_GREEN":"hsLoadingGreen.gif",
			"IMG_HS_LOADING_BLUE":"hsLoadingBlue.gif",
			"IMG_HS_LOADING_RED":"hsLoadingRed.gif",
			"IMG_HS_LOADING_YELLOW":"hsLoadingYellow.gif",
			"IMG_HS_LOADING_WZD":"wzdDetecting.gif"
		}
	};

	/* 用于设置页面的链接等的状态 */
	this.hsStatSet = function(state, des, idStr)
	{
		var handleRelCon, image, info;

		if (undefined == idStr)
		{
			handleRelCon = $("ul.gridStatus")[0];
			info = $("ul.gridStatus label")[0];
			statPic = $("ul.gridStatus i")[0];
		}
		else
		{
			handleRelCon = $("#" + idStr)[0];
			info = $("#" + idStr + " label")[0];
			statPic = $("#" + idStr + " i")[0];
		}

		switch(state)
		{
		case "null":
			handleRelCon.style.visibility = "hidden";
			break;
		case "correct":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -353px -122px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		case "error":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -306px -209px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		case "link":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -372px -123px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		case "exception":
			info.innerHTML = des;
			statPic.style.background = "url(../web-static/images/routerBg.png) -334px -123px no-repeat";
			handleRelCon.style.visibility = "visible";
			break;
		default:
			handleRelCon.style.visibility = "hidden";
			break;
		}
	};

	/* 用于设置输入框中的图标的显示 */
	this.disInputTip = function(target, tag)
	{
		if (target == null || tag == undefined)
		{
			return;
		}

		if (tag.toLowerCase() == "error")
		{
			this.setStyle(target, {"visibility":"visible", "background":"url(../../web-static/images/wzd.png) no-repeat -116px -243px"});
		}
		else if (tag.toLowerCase() == "ok")
		{
			this.setStyle(target, {"visibility":"visible", "background":"url(../../web-static/images/wzd.png) no-repeat -95px -243px"});
		}
		else if (tag.toLowerCase() == "warn")
		{
			this.setStyle(target, {"visibility":"visible", "background":"url(../../web-static/images/wzd.png) no-repeat -137px -243px"});
		}
		else
		{
			target.style.visibility = "hidden";
		}
	};

	/* 设置编辑时输入框的样式 */
	this.initHoverBd = function()
	{
		$("input.hoverBd").bind("focus", function(){
			this.parentNode.style.border = "1px solid #A0D468";
		}).bind("blur", function(){
			this.parentNode.style.border = "1px solid #FFFFFF";
		});
	};

	/* 修改输入框的“启用”和禁用状态 */
	this.disableInput = function(target, disable){
		var input = (typeof target == "object" ? target : id(target));

		input.disabled = disable ? true : false;
		input.style.color =  disable ? "#B2B2B2" : "#FFFFFF";
	};

	/* 修改输入框的“启用”和禁用状态 */
	this.disableBtn = function(target, disable){
		var input = (typeof target == "object" ? target : id(target));
		var className = input.className;

		if (input.disabled == disable)
		{
			return;
		}

		input.disabled = disable ? true : false;
		input.className = disable ? className.replace("subBtn", "subBtnDis") : className.replace("subBtnDis", "subBtn");
	};

	/* Added by XieSimin */
	this.disableClick = function(target, disable, func)
	{
		var input = (typeof target == "object" ? target : id(target));
		var origFunc = null;

		if (input.disableTimes == null)
		{
			input.disableTimes = 0;
		}

		if (disable == true)
		{
			if (input.disableTimes <= 0)
			{
				input.oldOnClick = input.onclick;
				input.onclick = null;
			}

			origFunc = input.oldOnClick;
			input.disableTimes++;

			return origFunc;
		}
		else
		{
			input.disableTimes--;

			if (input.disableTimes <= 0)
			{
				/* 如果已经重新设置了onclick，则不覆盖后来设置的值 */
				if (input.onclick == null)
				{
					input.onclick = input.oldOnClick;
				}

				input.oldOnClick = null;
			}

			return null;
		}
	};

	/* 设置 subBtnId 的值*/
	this.setLoadingId = function(idStr, loadImgKey){
		this.hsLoadingObj.subBtnId = idStr;
		this.hsLoadingObj.loadImgKey = loadImgKey == undefined ? IMG_HS_LOADING_BLUE:loadImgKey;
		this.hsLoadingObj.subBtnObj = id(idStr);
	};

	/* 控制subLoading的显示和不显示的状态切换 */
	this.hsLoading = function(state, callback){
		var hsLoadingObj = this.hsLoadingObj;
		var isBasic = hsLoadingObj.isBasic;
		var isWl = hsLoadingObj.isWl;
		var subBtn = id(hsLoadingObj.subBtnId);
		var btnLeft, btnHeight, btnTop, btnWidth;
		var con, subLoading, loadingCon;

		if ((subBtn == null) || (subBtn != hsLoadingObj.subBtnObj))
		{
			return;
		}

		con = subBtn.parentNode;
		con.style.position = "relative";
		btnWidth = subBtn.offsetWidth;
		btnLeft = subBtn.offsetLeft;
		btnTop = subBtn.offsetTop;
		btnHeight = subBtn.offsetHeight;
		loadingCon = $("#" + hsLoadingObj.subBtnId + " ~ div.hsLoadingCon")[0];
		subLoading = $("#" + hsLoadingObj.subBtnId + " ~ div.hsLoadingCon img")[0];

		window.clearTimeout(hsLoadingObj.handleDelayHd);

		/* 通过判断state的值，设置subLoading控件的显示情况 */
		if (true == state)
		{
			subBtn.style.visibility = "hidden";

			/* 如果subLoading控件没有加载过，则进行加载 */
			if (loadingCon == undefined)
			{
				loadingCon = el("div");
				loadingCon.className = "hsLoadingCon";
				con.appendChild(loadingCon);
				loadingCon.style.width = btnWidth + "px";
				loadingCon.style.height = btnHeight + "px";
				loadingCon.style.top = btnTop + "px";
				loadingCon.style.left = btnLeft + "px";

				subLoading = el("img");
				loadingCon.appendChild(subLoading);

				subLoading.onload = function(){
					subLoading.style.height = btnHeight + "px";
					loadingCon.style.visibility = "visible";
				};
				subLoading.src = "../web-static/images/" + hsLoadingObj.loadImgCol[hsLoadingObj.loadImgKey];
			}
			else
			{
				subLoading.style.height = btnHeight + "px";
				loadingCon.style.height = btnHeight + "px";
				loadingCon.style.width = btnWidth + "px";
				loadingCon.style.top = btnTop + "px";
				loadingCon.style.left = btnLeft + "px";
				loadingCon.style.visibility = "visible";
			}
		}
		else
		{
			hsLoadingObj.handleDelayHd = window.setTimeout(function(){
				hsLoadingObj.subBtnId = "";
				subBtn.style.visibility = "visible";
				if (undefined != loadingCon)
				{
					loadingCon.style.visibility = "hidden";
				}

				if (typeof callback == "function")
				{
					callback();
				}
			}, 500);
		}
	};

	this.hsSwitchState = function(conId, state)
	{
		var hsBCSwitchState = $("#" + conId + " ~ span.hsSwitchState")[0];

		if (hsBCSwitchState == null)
		{
			return;
		}

		if (1 == state)
		{
			hsBCSwitchState.innerHTML = statusStr.opened;
			hsBCSwitchState.style.color = "#86B157";
		}
		else
		{
			hsBCSwitchState.innerHTML = statusStr.closed;
			hsBCSwitchState.style.color = "#FB6E52";
		}
	};
}
function Basic()
{
	this.NET_STATE_INDEX = 0;
	this.LINK_EPTMGT_INDEX = 1;
	this.APPS_MGT_INDEX = 2;
	this.ROUTE_SET_INDEX = 3;

	/* Content.htm页面的处理函数 */
	this.contentPageLoad = function(){
		loadBasic();
	};

	/* 加载具体的APP页面 */
	this.gLoadAppDetail = {appId:"", uri:""};

	this.gSetLoadAppDetail = function(appId, uri){
		this.gLoadAppDetail["appId"] = appId == undefined ? this.gLoadAppDetail["appId"] : appId;
		this.gLoadAppDetail["uri"] = uri == undefined ? this.gLoadAppDetail["uri"] : uri;

		if ("" !== appId && "" !== uri)
		{
			this.setBasicSubMenuUrl("AppsInstalled.htm");
		}
	};

	/* 设置页面加载的菜单的序号 */
	this.gBasicMenu = {menuIndex:NET_STATE_INDEX, subMenuUrl:""};

	this.setBasicMenu = function(menuIndex, subMenuUrl){
		this.gBasicMenu["menuIndex"] = (menuIndex == undefined ? this.gBasicMenu["menuIndex"] : menuIndex);
		this.gBasicMenu["subMenuUrl"] = (subMenuUrl == undefined ? this.gBasicMenu["subMenuUrl"] : subMenuUrl);
	};

	this.setBasicSubMenuUrl = function(subMenuUrl){
		this.gBasicMenu["subMenuUrl"] = subMenuUrl;
	};

	/* 加载Basic的页面 */
	this.loadBasic = function(menuIndex, subMenuUrl, callBack){
		this.setBasicMenu(menuIndex, subMenuUrl);
		loadPage("Basic.htm", "Con", callBack);
	};
}
function ShowTips()
{
	this.alertTimeHd;
	this.shAltObjOrId;

	/* 用于显示错误的提示信息 */
	this.showAlert = function(errStr, objOrId, screenMiddle, func, okBtnText, autoHide){
		this.showCover(function(){
			var error = id("Error");
			var hsErr = id("hsErr");
			var p, input;
			var objThis = this;

			if (true == isIESix)
			{
				alert(errStr);
				return;
			}

			this.shAltObjOrId = objOrId;
			input = $("div.hsTip input.subBtn")[0];

			if (hsErr == null)
			{
				hsErr = document.createElement("div");
				hsErr.id = "hsErr";
				hsErr.className = "hsTip";
				p = document.createElement("p");
				p.className = "detail";
				hsErr.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = okBtnText || btn.ok;
				hsErr.appendChild(input);
				error.appendChild(hsErr);
			}

			getChildNode(hsErr, "p").innerHTML = errStr;

			if (screenMiddle)
			{
				hsErr.style.marginLeft = "280px";
			}

			input.onclick = function(){
				typeof func == "function" && func();
				objThis.closeAlert(true);
			};

			error.style.visibility = "visible";
			error.style.display = "block";
			error.style.top = "90px";

			/* 如果是移动设备设置error的position为absolute */
			if (false == OS.portable)
			{
				setStyle(error, {"position":"fixed"});
			}
			else
			{
				setStyle(error, {"position":"absolute"});
			}

			if (false == OS.iPhone && false == OS.iPad)
			{
				input.focus();
			}

			if (typeof autoHide == "undefined" || autoHide)
			{
				this.alertTimeHd = $.setTimeout(function(){objThis.closeAlert()}, 30000);
			}
		});
	};

	/* 用于关闭错误的提示信息 */
	this.closeAlert = function(btnClick){
		this.hideCover(
			function(){
				var error = id("Error");
				var objOrId = this.shAltObjOrId;

				if (error == null)
				{
					return;
				}

				error.style.top = "-9999px";
				error.style.visibility = "hidden";
				clearTimeout(this.alertTimeHd);
				this.alertTimeHd = null;

				if (true == btnClick && undefined != objOrId && (typeof objOrId == "object" || 0 != objOrId.length))
				{
					try
					{
						if (typeof objOrId != "object")
						{
							objOrId = id(objOrId);
						}

						objOrId.focus();
						objOrId.select();
					}catch(ex){};
				}
				else
				{
					this.shAltObjOrId = "";
				}
			}
		);
	};

	this.shAltBaObjOrId;

	/* 用于显示错误的提示信息 */
	this.showAlertB = function(errStr, objOrId){
		showCover(function (cover){
			var i, input, p, span, divCon, div;

			this.shAltBaObjOrId = objOrId;

			divCon = document.createElement("div");
			divCon.className = "baConfirmCon";
			document.body.appendChild(divCon);

			div = document.createElement("div");
			div.className = "baConfirm";
			divCon.appendChild(div);

			i = document.createElement("i");
			i.className = "baConfirmLogo";
			div.appendChild(i);

			span = document.createElement("span");
			span.className = "baConfirmQuestion";
			span.innerHTML = errStr;
			div.appendChild(span);

			input = document.createElement("input");
			input.className = "subBtn ok";
			input.value = btn.confirm;
			input.type = "button";
			input.onclick = function(){
				closeAlertB(true);
			};

			div.appendChild(input);
		});
	};

	this.closeAlertB = function(btnClick){
		var objOrId = this.shAltBaObjOrId;

		hideCover(function(){
			var divCon = $("div.baConfirmCon")[0];

			document.body.removeChild(divCon);

			if (true == btnClick && undefined != objOrId && (typeof objOrId == "object" || 0 != objOrId.length))
			{
				try
				{
					if (typeof objOrId != "object")
					{
						objOrId = id(objOrId);
					}

					objOrId.focus();
					objOrId.select();
				}catch(ex){};
			}
		});
	};

	/* 用于显示提示信息 */
	this.showAlertC = function(errStr, objOrId, screenMiddle, func){
		this.showCover(function(){
			var error = id("Error");
			var hsErr = id("hsErr");
			var img, p, input;
			var objThis = this;

			if (true == isIESix)
			{
				alert(errStr);
				return;
			}

			this.shAltObjOrId = objOrId;
			input = $("div.hsTip input.subBtn")[0];

			if (hsErr == null)
			{
				hsErr = document.createElement("div");
				hsErr.id = "hsErr";
				hsErr.className = "hsTip";
				img = document.createElement("i");
				img.className = "alertImg";
				hsErr.appendChild(img);
				p = document.createElement("p");
				p.className = "detailImg";
				hsErr.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btn.ok;
				hsErr.appendChild(input);
				error.appendChild(hsErr);
			}

			getChildNode(hsErr, "p").innerHTML = errStr;

			if (screenMiddle) {
				hsErr.style.marginLeft = "280px";
			}
			input.onclick = function(){
				func && func();
				objThis.closeAlertC(true);
			};
			error.style.visibility = "visible";
			error.style.display = "block";
			error.style.top = "90px";

			/* 如果是移动设备设置error的position为absolute */
			if (false == OS.portable)
			{
				setStyle(error, {"position":"fixed"});
			}
			else
			{
				setStyle(error, {"position":"absolute"});
			}

			if (false == OS.iPhone && false == OS.iPad)
			{
				input.focus();
			}

			this.alertTimeHd = $.setTimeout(function(){objThis.closeAlertC()}, 5000);
		});
	};

	/* 用于关闭错误的提示信息 */
	this.closeAlertC = function(btnClick){
		this.hideCover(
			function(){
				var error = id("Error");
				var objOrId = this.shAltObjOrId;

				if (error == null)
				{
					return;
				}

				error.style.top = "-9999px";
				error.style.visibility = "hidden";
				clearTimeout(this.alertTimeHd);
				this.alertTimeHd = null;

				if (true == btnClick && undefined != objOrId && (typeof objOrId == "object" || 0 != objOrId.length))
				{
					try
					{
						if (typeof objOrId != "object")
						{
							objOrId = id(objOrId);
						}

						objOrId.focus();
						objOrId.select();
					}catch(ex){};
				}
				else
				{
					this.shAltObjOrId = "";
				}
			}
		);
	};

	/* 用于显示错误的提示信息 */
	this.showAlertD = function(errStr, func){
		this.showCover(function(){
			var error = id("Error");
			var hsErr = id("hsErr");
			var p, input;
			var objThis = this;

			if (true == isIESix)
			{
				alert(errStr);
				return;
			}

			input = $("div.hsTip input.subBtn")[0];

			if (hsErr == null)
			{
				hsErr = document.createElement("div");
				hsErr.id = "hsErr";
				hsErr.className = "hsTip";
				p = document.createElement("p");
				p.className = "detail";
				hsErr.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btn.ok;
				hsErr.appendChild(input);
				error.appendChild(hsErr);
			}

			getChildNode(hsErr, "p").innerHTML = errStr;

			input.onclick = function(){
				typeof func == "function" && func();
				objThis.closeAlertD(true);
			};

			error.style.visibility = "visible";
			error.style.display = "block";
			error.style.top = "90px";

			/* 如果是移动设备设置error的position为absolute */
			if (false == OS.portable)
			{
				setStyle(error, {"position":"fixed"});
			}
			else
			{
				setStyle(error, {"position":"absolute"});
			}

			if (false == OS.iPhone && false == OS.iPad)
			{
				input.focus();
			}
		});
	};

	/* 用于关闭错误的提示信息 */
	this.closeAlertD = function(btnClick){
		this.hideCover(
			function(){
				var error = id("Error");

				if (error == null)
				{
					return;
				}

				error.style.top = "-9999px";
				error.style.visibility = "hidden";
			}
		);
	};

	/* 用于显示“确认信息” */
	this.showConfirm = function(confStr, callBack, okStr, noStr){
		this.showCover(function(){
			var conf = id("Confirm");
			var hsConf = id("hsConf");
			var p, input, inputCol;
			var objThis = this;
			var result;
			var btnOkStr = (okStr != undefined) ? okStr : btn.ok;
			var btnNoStr = (noStr != undefined) ? noStr : btn.cancel;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConf";
				hsConf.className = "hsTip";
				p =  document.createElement("p");
				p.className = "detail";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btnOkStr;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn cancel";
				input.value = btnNoStr;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConf input");
			inputCol[0].value = btnOkStr;
			inputCol[0].onclick = function(){
				objThis.closeConfirm();
				callBack(true);
			};

			inputCol[1].value = btnNoStr;
			inputCol[1].onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			getChildNode(hsConf, "p").innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "90px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	/* 用于关闭“确认信息” */
	this.closeConfirm = function(){
		this.hideCover(function(){
			var conf = id("Confirm");

			if (conf == null)
			{
				return;
			}

			conf.style.top = "-9999px";
			conf.style.visibility = "hidden";
		});
	};

	/* 用于显示“确认信息”,显示图片 */
	this.showConfirmB = function(confStr, callBack){
		this.showCover(function(){
			var conf = id("Confirm");
			var hsConf = id("hsConf");
			var img, p, input, inputCol;
			var objThis = this;
			var result;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConf";
				hsConf.className = "hsTip";
				img =  document.createElement("i");
				img.className = "confirmImg";
				hsConf.appendChild(img);
				p =  document.createElement("p");
				p.className = "detailImg";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btn.cloudRetry;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn cancel";
				input.value = btn.cloudBack;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConf input");
			inputCol[0].onclick = function(){
				objThis.closeConfirm();
				callBack(true);
			};

			inputCol[1].onclick = function(){
				objThis.closeConfirm();
				callBack(false);
			};

			getChildNode(hsConf, "p").innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "90px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	/* 用于关闭“确认信息” */
	this.closeConfirmB = function(){
		this.hideCover(function(){
			var conf = id("Confirm");

			if (conf == null)
			{
				return;
			}

			conf.style.top = "-9999px";
			conf.style.visibility = "hidden";
		});
	};

	/* For "skip wzd" prompt after changing default password */
	this.showConfirmC = function(confStr, callBack, okStr, noStr){
		this.showCoverC(function(){
			var conf = id("ConfirmC");
			var hsConf = id("hsConfC");
			var p, input, inputCol, pCol;
			var objThis = this;
			var result;
			var btnOkStr = (okStr != undefined) ? okStr : btn.ok;
			var btnNoStr = (noStr != undefined) ? noStr : btn.cancel;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (conf == null)
			{
				conf = document.createElement("div");
				conf.id = "ConfirmC";
				document.body.appendChild(conf);
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConfC";
				hsConf.className = "hsTip hsTipCh";
				p =  document.createElement("p");
				p.className = "cancel";
				hsConf.appendChild(p);
				p = document.createElement("p");
				p.className = "detail detailCh";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btnOkStr;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btnNoStr;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			inputCol = $("#hsConfC input");
			inputCol[0].value = btnOkStr;
			inputCol[0].onclick = function(){
				objThis.closeConfirmC();
				callBack(true);
			};

			inputCol[1].value = btnNoStr;
			inputCol[1].onclick = function(){
				objThis.closeConfirmC();
				callBack(false);
			};

			pCol = $("#hsConfC p");
			pCol[1].innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "90px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	this.closeConfirmC = function(){
		this.hideCoverC(function(){
			var conf = id("ConfirmC");

			if (conf == null)
			{
				return;
			}

			conf.style.top = "-9999px";
			conf.style.visibility = "hidden";
		});
	};

	/* For providing choices for user when changing from bridge mode to route mode */
	this.showConfirmChoice = function(confStr, callBack, choiceStr1, choiceStr2){
		this.showCoverC(function(){
			var conf = id("ConfirmCh");
			var hsConf = id("hsConfCh");
			var p, input, inputCol, span, i, pCol, iCol;
			var objThis = this;
			var result;
			var btnOkStr = (choiceStr1 != undefined) ? choiceStr1 : btn.ok;
			var btnNoStr = (choiceStr2 != undefined) ? choiceStr2 : btn.cancel;

			if (true == isIESix)
			{
				result = confirm(confStr);
				this.closeConfirm();
				callBack(result);
				return;
			}

			if (conf == null)
			{
				conf = document.createElement("div");
				conf.id = "ConfirmCh";
				document.body.appendChild(conf);
			}

			if (hsConf == null)
			{
				hsConf = document.createElement("div");
				hsConf.id = "hsConfCh";
				hsConf.className = "hsTip hsTipCh";
				p = document.createElement("p");
				p.className = "cancel";
				i = document.createElement("i");
				i.className = "cancelImg";
				p.appendChild(i);
				hsConf.appendChild(p);
				p = document.createElement("p");
				p.className = "detail detailCh";
				hsConf.appendChild(p);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btnOkStr;
				hsConf.appendChild(input);
				input = document.createElement("input");
				input.type = "button";
				input.className = "subBtn ok";
				input.value = btnNoStr;
				hsConf.appendChild(input);
				conf.appendChild(hsConf);
			}

			iCol = $("#hsConfCh i");
			iCol[0].onclick = function(){
				objThis.closeConfirmChoice();
				callBack();
			};

			inputCol = $("#hsConfCh input");
			inputCol[0].value = btnOkStr;
			inputCol[0].onclick = function(){
				objThis.closeConfirmChoice();
				callBack(true);
			};

			inputCol[1].value = btnNoStr;
			inputCol[1].onclick = function(){
				objThis.closeConfirmChoice();
				callBack(false);
			};

			pCol = $("#hsConfCh p");
			pCol[1].innerHTML = confStr;
			conf.style.visibility = "visible";
			conf.style.display = "block";
			conf.style.top = "90px";

			/* 如果是移动设备设置conf的position为absolute */
			if (false == OS.portable)
			{
				setStyle(conf, {"position":"fixed"});
			}
			else
			{
				setStyle(conf, {"position":"absolute"});
			}
		});
	};

	this.closeConfirmChoice = function(){
		this.hideCoverC(function(){
			var conf = id("ConfirmCh");

			if (conf == null)
			{
				return;
			}

			conf.style.top = "-9999px";
			conf.style.visibility = "hidden";
		});
	};

	/* 用于显示提示信息 */
	this.showNote = function(idStr, noteStr){
		var noteCon = id(idStr);

		if (undefined == noteCon)
		{
			return;
		}

		if (undefined != noteStr)
		{
			$("#" + idStr + " div.noteCon p")[0].innerHTML = noteStr;
		}

		noteCon.style.visibility = "visible";
	};

	/* 用于显示提示信息 */
	this.showNoteB = function(idStr, noteStr, className){
		var noteCon = id(idStr);
		var span, tip;

		if (undefined == noteCon)
		{
			return;
		}

		tip = $("#" + idStr + " i.tip")[0];
		span = $("#" + idStr + " span")[0];
		if (undefined != noteStr)
		{
			span.innerHTML = noteStr;
		}

		if (undefined != className)
		{
			span.className = className;
		}
		else
		{
			span.className = "note";
		}

		tip.style.visibility = "visible";
		noteCon.style.visibility = "visible";
	};

	/* 用于关闭提示信息 */
	this.closeNote = function(idStr){
		var noteCon = id(idStr);

		if (undefined != noteCon)
		{
			noteCon.style.visibility = "hidden";
		}

		try
		{
			$("#" + idStr + " i.tip").css("visibility", "hidden");
		}catch(ex){}
	};

	/* 显示正在loading的状态 */
	this.showLoading = function(noteStr, closeCallBack, classObj, showBtn)
	{
		closeLoading();
		showCover(function(cover){
			var coverId = cover.id;
			var loadCon, load, loadCover;
			var loadImg, detail, close;
			var cover$ = $("#" + coverId);
			var loadConClass, loadClass;
			var coverLoadingClass, detailClass;
			var coverOpacity = 0.7;

			if (undefined != classObj)
			{
				loadConClass = classObj.loadConClass;
				loadClass = classObj.loadClass;
				coverLoadingClass = classObj.coverLoadingClass;
				detailClass = classObj.detailClass;
				coverOpacity = classObj.coverOpacity || 0;
			}

			/* 将cover设置为透明的 */
			cover$.css("opacity", coverOpacity);

			loadCover = el("div");
			loadCover.className = "LoadConCover";
			document.body.appendChild(loadCover);

			loadCon = el("div");
			loadCon.className = loadConClass || "coverLoadCon";
			loadCover.appendChild(loadCon);

			load = el("div");
			load.className = loadClass || "coverLoad";
			loadCon.appendChild(load);

			if (undefined == coverLoadingClass)
			{
				loadImg = el("i");
				loadImg.className = "coverLoading";
				load.appendChild(loadImg);
			}
			else
			{
				loadImg = el("i");
				loadImg.className = coverLoadingClass;
				load.appendChild(loadImg);
			}

			detail = el("p");
			detail.className = detailClass || "coverLoadNote";
			detail.innerHTML = (noteStr == undefined ? label.checkingWait : noteStr);
			load.appendChild(detail);

			showBtn = (undefined == showBtn) ? true : showBtn;
			if (true == showBtn)
			{
				close = el("input");
				close.type = "button";
				close.className = "coverLoadClose cancelBtn";
				close.value = btn.cancel;
				close.onclick = function(){
					closeLoading(closeCallBack);
				};
				load.appendChild(close);
			}
		});
	};

	/* 关闭正在loading的状态 */
	this.closeLoading = function(closeCallBack)
	{
		var loadCover = $("div.LoadConCover")[0];

		if (null == loadCover)
		{
			return;
		}

		$("#" + this.CoverId).css("opacity", "");
		document.body.removeChild(loadCover);
		hideCover(closeCallBack);
	};

	/* 在设置向导中显示弹出框 */
	this.showPhWzdAlert = function(errStr, callBack)
	{
		this.showCover(function(){
			var con, img, p, lbl;
			var conId = "phWzdAlertCon";
			var objThis = this;

			con = id(conId);
			if (null == con)
			{
				con = document.createElement("div");
				con.className = "phWzdAlertCon";
				con.id = conId;
				document.body.appendChild(con);

				img = document.createElement("img");
				img.src = "../web-static/images/redWarn.png";
				con.appendChild(img);

				p = document.createElement("p");
				con.appendChild(p);

				lbl = document.createElement("label");
				con.appendChild(lbl);
				lbl.innerHTML = btn.confirm;
			}
			else
			{
				p = $("#" + conId +" p")[0];
				lbl = $("#" + conId +" label")[0];
			}

			con.style.top = "150px";
			con.style.visibility = "visible";
			p.innerHTML = errStr;
			lbl.onclick = function(){
				typeof callBack == "function" && callBack();
				objThis.closePhWzdAlert();
			};
		});
	};

	this.closePhWzdAlert = function()
	{
		this.hideCover(function(){
			var con = id("phWzdAlertCon");
			if (null != con)
			{
				con.style.top = "-9999px";
			}
		});
	};

	/* 在设置向导中显示弹出框 */
	this.showPhConfirm = function(confStr, callBack, okStr, noStr)
	{
		this.showCover(function(){
			var con, img, p, btnY, btnN;
			var conId = "phConfirmCon";
			var objThis = this;
			var btnOkStr = (okStr != undefined) ? okStr : btn.ok;
			var btnNoStr = (noStr != undefined) ? noStr : btn.cancel;

			con = id(conId);
			if (null == con)
			{
				con = document.createElement("div");
				con.className = "phWzdAlertCon";
				con.id = conId;
				document.body.appendChild(con);

				img = document.createElement("img");
				img.src = "../web-static/images/redWarn.png";
				con.appendChild(img);

				p = document.createElement("p");
				con.appendChild(p);

				btnN = document.createElement("label");
				btnN.className = "btnN";
				con.appendChild(btnN);

				btnY = document.createElement("label");
				btnY.className = "btnY";
				con.appendChild(btnY);

			}
			else
			{
				p = $("#" + conId +" p")[0];
				btnN =  $("#" + conId +" label")[0];
				btnY =  $("#" + conId +" label")[1];
			}

			p.innerHTML = confStr;
			btnN.innerHTML = btnNoStr;
			btnY.innerHTML = btnOkStr;
			con.style.top = "120px";
			con.style.visibility = "visible";

			btnN.onclick = function(){
				objThis.closePhConfirm();
				typeof callBack == "function" && callBack(false);
			};

			btnY.onclick = function(){
				objThis.closePhConfirm();
				typeof callBack == "function" && callBack(true);
			};
		});
	};

	this.closePhConfirm = function()
	{
		this.hideCover(function(){
			var con = id("phConfirmCon");
			if (null != con)
			{
				con.style.top = "-9999px";
				con.style.visibility = "hidden";
			}
		});
	};

	this.showDFSPopUpWindow = function(callback, timeout) {
		var countdown = timeout;
		var countdownHandle;

		function changeCountDownText(callback) {
			countdownHandle = setInterval(function () {
				countdown--;
				id("DFScountdown").innerHTML = countdown + "s";
				if (countdown <= 0) {
					clearInterval(countdownHandle);
					var loadCover = $("div.LoadConCover")[0];
					$("#Cover").css("opacity", "");
					document.body.removeChild(loadCover);
					hideCover();
					typeof callback != "undefined" && callback();
					return;
				}
			}, 1000);
		}

		showCover(function(){
			var coverId = "DFSWindow";
			var DFSCon, container, DFSCover;
			var radarImg, detail;
			var cover$ = $("#" + coverId);
			var coverOpacity = 0.7;

			/* 将cover设置为透明的 */
			cover$.css("opacity", coverOpacity);

			DFSCover = el("div");
			DFSCover.className = "LoadConCover";
			document.body.appendChild(DFSCover);

			DFSCon = el("div");
			DFSCon.className = "coverLoadCon";
			DFSCover.appendChild(DFSCon);

			container = el("div");
			container.className = "coverLoad coverLoadDFS";
			DFSCon.appendChild(container);

			radarImg = el("img");
			radarImg.className = "radarImg";
			radarImg.src = "../web-static/images/radar.gif";
			container.appendChild(radarImg);

			detail = el("p");
			detail.className = "coverLoadNote";
			detail.innerHTML = "遵照国家法律法规，路由器正在做退避雷达信号探测，<br />Wi-Fi信号要 <span id='DFScountdown'>" + countdown +"s</span> 后才能上线，请稍候...";
			container.appendChild(detail);

			changeCountDownText(callback);
		});
	}
}
function Select()
{
	// 下拉框在滚动容器底部时自动(垂直)居中选项
	var defaultAutoMiddleOption = {
		enable: false,					// 启用
		outerScrollContainerId: "",		// 外部滚动容器id
		bottomVal: 0					// 底部定义值，用小于1的小数来定义从容器的哪个点开始为底部
	}

	this.selectInitExtern = function(idStr, options, value, callback, maxSize, confirmCbk)
	{
		var classObj = {
			className:"appSelOptsUl",
			colorN:"#FFFFFF",
			colorC:"#95AE31",
			fontColorN:"#3C3E43",
			fontColorC:"#FFFFFF",
			valueColor:"#FFFFFF",
			valueDisColor:"#95AE31",
			scrollBg:"#95AE31",
			scrollZIndex:"1009"
		};

		selectInit(idStr, options, value, callback, maxSize, classObj, confirmCbk);
	};

	this.selectInitEptMgt = function(idStr, options, value, callback, maxSize)
	{
		var classObj = {
			className:"eptMgtSelOptsUl",
			colorN:"#FFFFFF",
			colorC:"#F17E50",
			fontColorN:"#3C3E43",
			fontColorC:"#FFFFFF",
			valueColor:"#FFFFFF",
			valueDisColor:"#F17E50",
			scrollBg:"#F17E50",
			scrollZIndex:"1009"
		};

		selectInit(idStr, options, value, callback, maxSize, classObj);
	};

	this.selectInit = function(idStr, options, value, callback, maxSize, classObj, confirmCbk)
	{
		var li, tmp, parent, valueCon, visible = "hidden";
		var ul;
		var con = id(idStr), className = "selOptsUl";
		var colorN = "#FFFFFF", colorC = "#2BA2D8";
		var fontColorN = "#3C3E43", fontColorC = "#FFFFFF";
		var valueColor = "#FFFFFF", valueDisColor = "#B2B2B2";
		var valueConTmp, showSize, valueConWidth, fontSize;
		var escapeStr, listScroll, valueDef = value;
		var scrollBg = "#34A9DA";
		var scrollZIndex = 1001;
		var scrollMLeft = 3;
		var scrollMTop = 3;

		if (undefined != classObj)
		{
			className = classObj.className;
			colorN = classObj.colorN;
			colorC = classObj.colorC;
			fontColorN = classObj.fontColorN;
			fontColorC = classObj.fontColorC;
			valueColor = classObj.valueColor;
			valueDisColor = classObj.valueDisColor;
			scrollBg = classObj.scrollBg == undefined ? scrollBg : classObj.scrollBg;
			scrollZIndex = classObj.scrollZIndex == undefined ? scrollZIndex : classObj.scrollZIndex;
			scrollMLeft = classObj.scrollMLeft == undefined ? scrollMLeft : classObj.scrollMLeft;
			scrollMTop = classObj.scrollMTop == undefined ? scrollMTop : classObj.scrollMTop;
		}

		parent = con.parentNode;
		valueConTmp = $("#"+idStr+" span.value");
		//fontColorN = valueConTmp.css("color");  /* 此处不再需要 */
		valueCon = valueConTmp[0];
		valueCon.value = 0;
		valueConWidth = parseInt(valueConTmp.css("width"));
		fontSize = (parseInt(valueConTmp.css("fontSize"))*0.61).toFixed(1);
		showSize = (maxSize == undefined ? parseInt(valueConWidth/fontSize) : maxSize);
		con.value = 0;
		if (id(className + idStr) == null) {
			ul = document.createElement("ul");
			ul.className = className;
			ul.id = className + idStr;
		} else {
			ul = id(className + idStr);
			ul.innerHTML = '';
		}
		parent.appendChild(ul);

		function hiddenSelect(ul)
		{
			var visibilityVal, li;
			var options = ul.childNodes;

			for (var i = 0, len = options.length; i < len; i++)
			{
				li = options[i];
				visibilityVal = li.childNodes[0].style.visibility;
				li.style.backgroundColor = (visibilityVal == "visible"?colorC:colorN);
				li.style.color = (visibilityVal == "visible"?fontColorC:fontColorN);
			}

			ul.style.visibility = "hidden";
			ul.style.top = "-9999px";
			ul.parentNode.style.position = "static";
		}

		attachEvnt(document.body, "click", function(){
			var ul = $("#"+className + idStr)[0];

			if (typeof ul == "undefined")
			{
				return;
			}

			hiddenSelect(ul);
		});

		function optionClick(li)
		{
			var con = id(idStr)
			var target = li;
			var parent = target.parentNode;
			var options = parent.childNodes;
			var valueCon = $("#"+idStr+" span.value")[0];
			var span;

			if (target.childNodes[0].nodeType == 3)
			{
				return;
			}

			con.value = target.valueStr;
			valueCon.value = target.valueStr;

			for (var i = 0, len = options.length; i < len; i++)
			{
				options[i].childNodes[0].style.visibility = "hidden";
				options[i].style.backgroundColor = colorN;
				options[i].style.color = fontColorN;
			}

			if (target.childNodes[0].style.visibility != "visible" &&
				typeof callback != "undefined")
			{
				callback(target.valueStr, con);
			}

			target.childNodes[0].style.visibility = "visible";
			target.style.backgroundColor = colorC;
			target.style.color = fontColorC;
			span = getChildNode(target, "span");
			span.className = "selCross";
			valueCon.innerHTML = htmlEscape(target.childNodes[1].nodeValue);
			parent.style.visibility = "hidden";
			parent.style.top = "-9999px";
			parent.parentNode.style.position = "static";
		}

		function optionInit(options)
		{
			for (var i = 0, len = options.length; i < len; i++)
			{
				tmp = options[i];
				escapeStr = htmlEscape(getStrInMax(tmp.str.toString(), showSize));
				escapeStr = tmp.staCount == undefined ? escapeStr : escapeStr + " (" + tmp.staCount + ")";
				visible = "hidden";

				li = document.createElement("li");

				if ((tmp.value == undefined && i == valueDef) || (valueDef == tmp.value))
				{
					visible = "visible";
					valueCon.innerHTML = escapeStr;
					valueCon.value = valueDef;
					con.value = valueDef;
					li.style.backgroundColor = colorC;
					li.style.color = fontColorC;
					li.innerHTML = "<span class='selCross' style='visibility:" + visible + "'></span>" + escapeStr;
				}
				else
				{
					li.style.color = fontColorN;
					li.innerHTML = "<span class='selCrossOut' style='visibility:" + visible + "'></span>" + escapeStr;
				}

				li.title = tmp.title == undefined ? tmp.str : tmp.title;
				li.valueStr = (tmp.value != undefined ? tmp.value : i);
				li.className = "option";
				li.onclick = function(event)
				{
					event = event || window.event;
					optionClick(this);
					stopProp(event);
				};

				li.onmousemove = function(event){
					event = event || window.event;
					var target = event.srcElement || event.target;
					var options, span, item;

					if (target.tagName.toLowerCase() == "span")
					{
						return;
					}

					options = target.parentNode.childNodes;

					for (var i = 0, len = options.length; i < len; i++)
					{
						item = options[i];
						item.style.backgroundColor = colorN;
						item.style.color = fontColorN;
						span = getChildNode(item, "span");
						span.className = "selCrossOut";
					}

					span = getChildNode(target, "span");
					span.className = "selCross";
					target.style.backgroundColor = colorC;
					target.style.color = fontColorC;
				};

				ul.appendChild(li);
			}
		}

		function selectClick(event)
		{
			var target = $("#"+ className + idStr);
			var sel = $("ul."+ className);

			function doClick(choose)
			{
				if (!choose)
				{
					return;
				}

				/* 先隐藏其他下拉列表 */
				sel.each(function(){
					if (this.style.visibility == "visible")
					{
						hiddenSelect(this);
					}
					return true;
				});

				target.css("visibility", "visible").css("top", "-1px");
				target[0].parentNode.style.position = "relative";
				stopProp(event);
			}

			if (typeof confirmCbk != "undefined")
			{
				confirmCbk(doClick);
			}
			else
			{
				doClick(true);
			}

			// 点击滚动容器底部的下拉框时，自动滚动使下拉框居中
			if (defaultAutoMiddleOption.enable)
			{
				var $outerScrollContainer = $("#" + defaultAutoMiddleOption.outerScrollContainerId);
				var bSelectInContainer = $.contains($outerScrollContainer.get(0), target.get(0));

				if ($outerScrollContainer.length > 0 && bSelectInContainer)
				{
					if (($("#" + idStr).offset().top - $outerScrollContainer.offset().top) > $outerScrollContainer.height() * defaultAutoMiddleOption.bottomVal)
					{
						$outerScrollContainer.animate({
							scrollTop: $outerScrollContainer.scrollTop() + $outerScrollContainer.height() / 2
						}, 500);
					}
				}
			}
		}

		optionInit(options);

		con.onclick = selectClick;
		con.disable = function(value){
			con.onclick = (value == true ? null : selectClick);
			valueCon.style.color = (value == true ? valueDisColor : valueColor);
		};
		con.changeSel = function(value){
			var selOptions = $("#"+ className + idStr+" li");

			$("#"+ className + idStr+" li").each(function(){
				if (this.valueStr == value)
				{
					optionClick(this);
					return false;
				}
			});
		};
		con.resetOptions = function(options, value){
			ul.innerHTML = "";
			valueDef = value || 0;
			optionInit(options);
		};

		listScroll = new NiceScroll(ul.id);
		listScroll.scrollTipOpacity(1);
		listScroll.scrollTipSet({background:scrollBg});
		listScroll.scrollBarSet({zIndex:scrollZIndex, mLeft:scrollMLeft, mTop:scrollMTop});
		listScroll.init();
	};

	this.setSelectAutoMiddleOption = function(option)
	{
		defaultAutoMiddleOption = option;
	}
}
function Help()
{
	var objThis = this;

	this.help = "Help";
	this.helpDetail = "helpDetail";
	this.helpContent = "helpContent";
	this.helpURL = "Help.htm";

	/* added By WuWeier, date 20140124 */
	this.setHelpURL = function(url)
	{
		this.helpURL = url;
	};
	this.helpInit = function()
	{
		var hp = id(this.help);
		var p, span, i, div;
		var objThis = this;

		if (hp.innerHTML.length != 0)
		{
			loadPage(this.helpURL, this.helpContent);
			return;
		}

		p = document.createElement("p");
		p.className = "helpTop";
		p.onmousedown = this.draggableBind(this.help);
		hp.appendChild(p);
		span = document.createElement("span");
		span.className = "helpDes";
		span.innerHTML = label.help;
		p.appendChild(span);
		i = document.createElement("i");
		i.onclick = function (){
			objThis.helpClose();
		};
		i.className = "helpClose";
		p.appendChild(i);
		div = document.createElement("div");
		div.id = "helpDetail";
		hp.appendChild(div);

		div = document.createElement("div");
		div.style.display = "none";
		div.id = this.helpContent;
		document.body.appendChild(div);
		loadPage(this.helpURL, this.helpContent);

		if (false)
		{
			/* 触屏移动开始的处理函数 */
			attachEvnt(p, "touchstart", function(event){
				event = event || window.event;
				objThis.mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
				attachEvnt(document, "touchmove", touchMoveHd);
				attachEvnt(document, "touchend", touchEndHd);
			});
		}
	};

	/* 触屏移动的处理函数 */
	this.touchMoveHd = function(event)
	{
		event = event || window.event;
		var mousePos = {x:event.touches[0].clientX, y:event.touches[0].clientY};
		var hp = id(objThis.help);
		var divWidth = hp.offsetWidth;
		var divHeight = hp.offsetHeight;
		var posX = mousePos.x - objThis.mousePos.x;
		var posY = mousePos.y - objThis.mousePos.y;
		var maxX = document.body.clientWidth - divWidth;
		var maxY = document.documentElement.scrollHeight - divHeight;

		posX = posX > 0 ? posX:0;
		posY = posY > 0 ? posY:0;
		posX = posX > maxX ? maxX:posX;
		posY = posY > maxY ? maxY:posY;
		hp.style.left = posX + "px";
		hp.style.top = posY + "px";
		eventPreventDefault(event);
		clearSelection(event);
	};

	/* 触屏结束移动的处理函数 */
	this.touchEndHd = function(event)
	{
		detachEvnt(document, "touchmove", touchMoveHd);
		detachEvnt(document, "touchend", touchEndHd);
	};
	this.helpBind = function(btn, helpIdStr, hpTopClass)
	{
		btn&&(btn.onclick = function(event){
			event = event || window.event;
			var target = event.target || event.srcElement;

			helpShow(helpIdStr, target, hpTopClass);
		});
	};
	this.helpClose = function()
	{
		var hp = id(this.help);
		var hpDe = id(this.helpDetail);

		if (hpDe == null || hp == null)
		{
			return;
		}

		setStyle(hp, {"visibility":"hidden", "top":"-9999px"});
		hpDe.innerHTML = "";
	};

	this.helpVisible = function(btn)
	{
		var hp = id(this.help);
		var pos = $(btn).offset();
		var posTop = $("#basicContent").offset();
		var width = hp.offsetWidth;
		var height = hp.offsetHeight;
		var helpBtnHeight = btn.offsetHeight;
		var helpBtnWidth = btn.offsetWidth;
		var top, left;

		top = posTop.top + "px";
		left = pos.left - width + helpBtnWidth + "px";
		setStyle(hp, {"visibility":"visible", "top":top, "left":left});
	};
	this.helpDetailAppend = function(helpIdStr)
	{
		var hpDe,helpCon,helpIdArray;
		hpDe = id(this.helpDetail);
		helpIdArray = helpIdStr.split(" ");
		for(var i=0; i < helpIdArray.length; i++)
		{
			helpCon = id(helpIdArray[i]);
			if (null == helpCon)
			{
				return;
			}
			hpDe.innerHTML += helpCon.outerHTML;
		}
	};
	this.helpShow = function(helpIdStr, btn, hpTopClassName)
	{
		var hpTop = $("#" + this.help +" p.helpTop");

		this.helpClose();
		hpTopClassName = hpTopClassName == undefined ? "helpTop" : ("helpTop " + hpTopClassName);
		hpTop.attr("class", hpTopClassName);
		this.helpVisible(btn);
		helpDetailAppend(helpIdStr);
	};
	this.msMove = function(helpDiv, currMousePos, distance)
	{
		var divWidth = helpDiv.offsetWidth;
		var divHeight = helpDiv.offsetHeight;
		var posX = currMousePos.x - distance.x;
		var posY = currMousePos.y - distance.y;
		var maxX = document.body.clientWidth - divWidth;
		var maxY = document.documentElement.scrollHeight - divHeight;

		posX = posX > 0 ? posX:0;
		posY = posY > 0 ? posY:0;
		posX = posX > maxX ? maxX:posX;
		posY = posY > maxY ? maxY:posY;
		helpDiv.style.left = posX + "px";
		helpDiv.style.top = posY + "px";
	};
	this.draggableBind = function(divPaId)
	{
		var inFrame = 1;
		var inSetFrame = 2;
		var outChild = 0;
		var helpDiv = id(divPaId);

		return function(event){
			event = event ? event : window.event;
			var currMousePos = getMousePos(event);

			/* 记录鼠标按下瞬间鼠标与DIV控件左上角的距离 */
			var distance = {x:currMousePos.x - helpDiv.offsetLeft,
							y:currMousePos.y - helpDiv.offsetTop};

			document.onmousemove = function(event)
			{
				event = event ? event : window.event;
				var currMousePos = getMousePos(event);

				clearSelection();
				msMove(helpDiv, currMousePos, distance);
			};

			document.onmouseup = function()
			{
				clearSelection();
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	};

	this.basicAppUpgradeInfoShow = function(btn, info, top)
	{
		var infoConId = "basicAppUpgradeInfo";
		var infoCon = id(infoConId);
		var p, span, i, div;
		var $btn = $(btn);
		var pos = $btn.offset();
		var appNiceScroll;

		if (null == infoCon)
		{
			infoCon = document.createElement("div");
			infoCon.id = infoConId;
			document.body.appendChild(infoCon);

			p = document.createElement("p");
			p.className = "appsHelpTop";
			p.onmousedown = this.draggableBind(this.help);
			infoCon.appendChild(p);
			span = document.createElement("span");
			span.className = "helpDes";
			span.innerHTML = label.updateNoteStr;
			p.appendChild(span);
			i = document.createElement("i");
			i.onclick = function (){
				infoCon.style.display = "none";
				infoCon.style.top = "-9999px";
			};
			i.className = "helpClose";
			p.appendChild(i);
			div = document.createElement("div");
			div.id = "basicAppUpgradeInfoDetail";
			div.className = "basicAppUpgradeInfoDetail";
			infoCon.appendChild(div);

			appNiceScroll = new NiceScroll("basicAppUpgradeInfoDetail");
			appNiceScroll.scrollTipOpacity(1);
			appNiceScroll.scrollTipSet({"background":"#B0CB33"});
			appNiceScroll.scrollBarSet({"zIndex":"1004", "mLeft":"10"});
			appNiceScroll.init();
		}

		top = top || 0;
		infoCon.style.top = pos.top + $btn[0].offsetHeight + top + "px";
		infoCon.style.left = "515px";
		infoCon.style.display = "block";
		id("basicAppUpgradeInfoDetail").innerHTML = "<pre>" + info + "</pre>";
	}

	this.basicAppUpgradeInfoClose = function()
	{
		var infoCon = id("basicAppUpgradeInfo");

		if (null != infoCon)
		{
			infoCon.style.display = "none";
			infoCon.style.top = "-9999px";
		}
	}
}

/* 检测LAN是否可以连接DUT */
function LanDetect()
{
	this.lanDetectSuccess = false;
	this.LAN_DETECT_TIME = 1000;
	this.lanDetectTimeHd = null;

	this.lanDetectHandle = function(callBack)
	{
		if (false == $.result.timeout && false == this.lanDetectSuccess)
		{
			this.lanDetectSuccess = true;
			clearTimeout(this.lanDetectTimeHd);
			typeof callBack != "undefined" && callBack();
		}
	}

	this.lanDetecting = function(callBack)
	{
		this.lanDetectSuccess = false;
		$.detect(function(){
			lanDetectHandle(callBack);
		});

		this.lanDetectTimeHd = $.setTimeout(function(){
			lanDetecting(callBack);
		}, this.LAN_DETECT_TIME);
	}
}

function ProgressBar()
{
	this.progressBar = null;
	this.progressDeWidth = null;
	this.progressBarHd = null;

	this.initProgBar = function()
	{
		var rebootCon = id("ProgressBar");
		var con, div, p;

		if (null == rebootCon)
		{
			rebootCon = document.createElement("div");
			rebootCon.id = "ProgressBar";
			document.body.appendChild(rebootCon);

			con = document.createElement("div");
			con.className = "progressBarCon";
			rebootCon.appendChild(con);

			/* percent con */
			div = document.createElement("div");
			div.className = "progressBarPCon";
			con.appendChild(div);

			p = document.createElement("p");
			p.className = "progressBarPercent";
			div.appendChild(p);

			/* degree con */
			div = document.createElement("div");
			div.className = "progressBarBg";
			con.appendChild(div);

			p = document.createElement("p");
			p.className = "progressBarDe";
			div.appendChild(p);

			p = document.createElement("p");
			p.className = "progressBarDes";
			con.appendChild(p);
		}

		this.progressBar = rebootCon;
		this.progressDeWidth = 0;
	};

	this.progRunning = function(showPercent, duration, callBack){
		var progressBarBg = $("div.progressBarBg");
		var progressBarDe = $("p.progressBarDe");
		var progressBarPercent = $("p.progressBarPercent");
		var deWidth = this.progressDeWidth + 2;
		var width = parseInt(progressBarBg.css("width")) - deWidth -
					parseInt(progressBarDe.css("paddingRight"));
		var time = duration/100, count = 0;
		var thisObj = this;

		function proRun()
		{
			if (count > 100)
			{
				if (undefined != callBack)
				{
					callBack();
				}

				return;
			}

			if (showPercent == true)
			{
				progressBarPercent[0].innerHTML = count + "%";
			}
			progressBarDe.css("width", deWidth + width*count + "px");
			count++;
			thisObj.progressBarHd = $.setTimeout(arguments.callee, time);
		}

		progressBarDe.css("width", deWidth + "px");
		width = parseFloat(width/100);
		proRun();
	};

	this.showProgBar = function(duration, noteStr, callBack, showPercent)
	{
		this.showCover(function(){
			this.initProgBar();
			setStyle(this.progressBar, {"display":"block", "visibility":"visible", "top":"0px"});

			if (undefined == noteStr)
			{
				noteStr = statusStr.rebooting;
			}

			showPercent = (showPercent == undefined ? true : showPercent);
			$("div.progressBarPCon").css("visibility", (showPercent == true ? "visible" : "hidden"));
			$("p.progressBarDes")[0].innerHTML = noteStr;
			this.progRunning(showPercent, duration, callBack);
		});
	};

	this.initProgBarApps = function(progBarCon)
	{
		var rebootCon, div, p;

		if (null != this.progressBar)
		{
			this.progressBar.parentNode.removeChild(this.progressBar);
		}

		rebootCon = document.createElement("div");
		rebootCon.className = "ProgressBarApps";
		progBarCon.appendChild(rebootCon);

		p = document.createElement("p");
		p.className = "progressBarPercent";
		rebootCon.appendChild(p);

		/* degree con */
		div = document.createElement("div");
		div.className = "progressBarBg";
		rebootCon.appendChild(div);

		p = document.createElement("p");
		p.className = "progressBarDe";
		div.appendChild(p);

		this.progressBar = rebootCon;
		this.progressDeWidth = parseInt($(p).css("width"));
	};

	this.showProgBarApps = function(progBarCon, callBack, complete)
	{
		var objThis = this;

		showCover(function(cover){
			$(cover).css("opacity", "0");
			objThis.initProgBarApps(progBarCon);
			setStyle(objThis.progressBar, {"display":"block", "visibility":"visible", "top":"0px"});
			objThis.progRunningP(true, callBack, complete, 1000);
		});
	};

	this.progRunningP = function(showPercent, callBack, complete, timeout){
		var node = this.progressBar;
		var progressBarPercent = $(node).find("p.progressBarPercent");
		var progressBarBg = $(node).find("div.progressBarBg");
		var progressBarDe = $(node).find("p.progressBarDe");
		var deWidth = this.progressDeWidth + 2;
		var width = parseInt(progressBarBg.css("width")) - deWidth -
					parseInt(progressBarDe.css("paddingRight"));
		var count = 0, rel = {}, code = ENONE;
		var obj = this;

		function run(rel)
		{
			count = parseInt(rel.count);
			code = rel[ERR_CODE];

			if (ERR_PERCENT == count)
			{
				obj.closeProgBar();
				(typeof complete == "function") && complete(false, code);
				return;
			}

			if (showPercent == true && false == isNaN(count))
			{
				if (count >= 100)
				{
					count = 100;
				}

				progressBarPercent[0].innerHTML = count + "%";
			}

			progressBarDe.css("width", deWidth + width*count + "px");

			if (count >= 100)
			{
				(typeof complete == "function") && complete(true);
			}
		}

		function proRun()
		{
			typeof callBack == "function" && callBack(run);
			obj.progressBarHd = $.setTimeout(arguments.callee, timeout);
		}

		progressBarDe.css("width", deWidth + "px");
		width = parseFloat(width/100);
		proRun();
	};

	this.showProgBarP = function(noteStr, callBack, showPercent, complete)
	{
		this.showCover(function(){
			this.initProgBar();
			setStyle(this.progressBar, {"display":"block", "visibility":"visible", "top":"0px"});

			if (undefined == noteStr)
			{
				noteStr = statusStr.rebooting;
			}

			showPercent = (showPercent == undefined ? true : showPercent);
			$("div.progressBarPCon").css("visibility", (showPercent == true ? "visible" : "hidden"));
			$("p.progressBarDes")[0].innerHTML = noteStr;
			this.progRunningP(showPercent, callBack, complete, 100);
		});
	};

	this.closeProgBar = function()
	{
		typeof hideCover == "function" && hideCover();
		setStyle(this.progressBar, {"display":"none", "visibility":"hidden", "top":"-9999px"});
		clearTimeout(this.progressBarHd);
	};
}

function BlockGrid()
{
	this._ops = {
		id:"",					/* 容器 ID */
		data:null,				/* 数据源 */
		dataInfo: []			/* 数据信息，每一项都是{str:"", value:"", unValue:""}*/
	};

	if (typeof BlockGrid.prototype.blockInit != "function")
	{
		BlockGrid.prototype.blockInit = function(options)
		{
			this._optionsInit(options);
			this.create();
		};

		BlockGrid.prototype._optionsInit = function(options)
		{
			var item;
			for(var prop in options)
			{
				item = options[prop];
				if (typeof this._ops[prop] == "undefined")
				{
					continue;
				}

				if (typeof item == "object" && !(item instanceof Array) && this._ops[prop] != null)
				{
					for(var p in item)
					{
						this._ops[prop][p] = item[p];
					}
				}
				else
				{
					this._ops[prop] = item;
				}
			}
		};

		BlockGrid.prototype.create = function()
		{
			var liNode, iNode;

			this.con = id(this._ops.id);
			emptyNodes(this.con);
			for (var i = 0; i < this._ops.dataInfo.length; i++)
			{
				var infoEntry = this._ops.dataInfo[i];
				var dataValue = this._ops.data[i];

				liNode = document.createElement("li");
				liNode.onclick = function() {
					var childNode = $(this).find("i")[0];
					var v = childNode.style.visibility;
					v = v == "visible" ? "hidden" : "visible";
					childNode.style.visibility = v;
				};
				liNode.innerHTML = infoEntry.str;

				iNode = document.createElement("i");
				liNode.appendChild(iNode);
				if (dataValue == infoEntry.value)
				{
					iNode.style.visibility = "visible";
				}

				this.con.appendChild(liNode);
			}
		};

		BlockGrid.prototype.getData = function()
		{
			var iNodeList = $("#" + this._ops.id).find("i");
			var data = [], v;
			for (var i = 0; i < iNodeList.length; i++)
			{
				var infoEntry = this._ops.dataInfo[i];
				var iNode = iNodeList[i];
				var style = iNode.style.visibility;

				if (style == "visible")
				{
					v = infoEntry.value;
				}
				else
				{
					v = infoEntry.unValue;
				}
				data.push(v);
			}

			return data;
		};
	}
}

function TimeControlSet()
{
	this.ENABLED = "1";
	this.DISABLED = "0";
	this.ACTION_ADD = 0;
	this.ACTION_EDIT = 1;
	this.blockGrid = null;
	this.gTimeLimitKeyName = null;
	this.gTimeLimitItem = null;
	this.gTimeLimitAction = this.ACTION_ADD;

	this.netCtrlListCreate = function(netCtrlList, delCallBack, saveCallBack, selInitCallback, isClock, cancelCallBack)
	{
		var divParent = id("netControlList");
		var ulNode, liNode, iNode, pNode, spanNode;
		var doc = document;
		var item, weekList, keyName, num = 0;

		var BNAME = uciHostsInfo.optName.name;
		var START_TIME = uciHostsInfo.optName.startTime;
		var END_TIME = uciHostsInfo.optName.endTime;
		var epWeekType = [label.Mon, label.Tue, label.Wen, label.Thu, label.Fri, label.Sta, label.Sun];

		emptyNodes(divParent);
		ulNode = doc.createElement("ul");
		divParent.appendChild(ulNode);
		isClock = (undefined == isClock) ? false : isClock;

		for (var i in netCtrlList)
		{
			var weekStr = "";

			num++;
			for (var key in netCtrlList[i])
			{
				keyName = key;
				item = netCtrlList[i][key];
			}

			liNode = doc.createElement("li");
			$(liNode).hover(
				function(){
					$(this).find("i").css("visibility", "visible");
				},
				function(){
					$(this).find("i").css("visibility", "hidden");
				});
			ulNode.appendChild(liNode);

			iNode = doc.createElement("i");
			iNode.onclick = (function(keyName, netCtrlList){
				return function() {
					delCallBack(keyName, netCtrlList);
				}
			})(keyName, netCtrlList);
			liNode.appendChild(iNode);
			if (true == isClock)
			{
				liNode.onclick = (function(item, iNode, keyName){
					return function(event){
						event = event || window.event;
						var target = event.target || event.srcElement;
						if (iNode == target)
						{
							return;
						}

						var name = item[BNAME];
						var startTime = item[START_TIME];
						var endTime = item[END_TIME];

						gTimeLimitAction = ACTION_EDIT;
						gTimeLimitItem = item;
						gTimeLimitKeyName = keyName;
						weekList = objToWeekList(item);

						setNetControlPanel(name, startTime, endTime, weekList, saveCallBack, selInitCallback, isClock, cancelCallBack);
						netControlPanelDis(true);
						beEdit = true;
					};
				})(item, iNode, keyName);
			}
			else
			{
				liNode.onclick = null;
			}

			pNode = doc.createElement("pre");
			pNode.innerHTML = htmlEscape(getStrInMax(item[BNAME], 16));
			liNode.appendChild(pNode);

			spanNode = doc.createElement("span");
			if (true == isClock)
			{
				spanNode.innerHTML = item[START_TIME] + label.wlanOn + " / " + item[END_TIME] + label.wlanOff;
			}
			else
			{
				spanNode.innerHTML = label.limitTime + label.colon + item[START_TIME] + " - " + item[END_TIME];
			}
			liNode.appendChild(spanNode);

			spanNode = doc.createElement("span");
			weekList = objToWeekList(item);
			for (var weekIndex in weekList)
			{
				if (weekList[weekIndex] == ENABLED)
				{
					weekStr += epWeekType[weekIndex] + label.sep;
				}
			}
			if (weekStr.length > 0)
			{
				weekStr = weekStr.substring(0, weekStr.length - 1);
			}
			spanNode.innerHTML = label.repeat + label.colon + weekStr;
			liNode.appendChild(spanNode);
		}

		divParent.num = num;
	};

	this.objToWeekList = function(item)
	{
		var MON = uciHostsInfo.optName.mon;
		var TUE = uciHostsInfo.optName.tue;
		var WED = uciHostsInfo.optName.wed;
		var THU = uciHostsInfo.optName.thu;
		var FRI = uciHostsInfo.optName.fri;
		var SAT = uciHostsInfo.optName.sat;
		var SUN = uciHostsInfo.optName.sun;

		var weekList = [];
		var keys = [MON, TUE, WED, THU, FRI, SAT, SUN];
		for (var i in keys)
		{
			var key = keys[i];
			if (item[key] == ENABLED)
			{
				weekList.push(ENABLED);
			}
			else
			{
				weekList.push(DISABLED);
			}
		}
		return weekList;
	};

	this.weekListToObj = function(obj, weekList)
	{
		var MON = uciHostsInfo.optName.mon;
		var TUE = uciHostsInfo.optName.tue;
		var WED = uciHostsInfo.optName.wed;
		var THU = uciHostsInfo.optName.thu;
		var FRI = uciHostsInfo.optName.fri;
		var SAT = uciHostsInfo.optName.sat;
		var SUN = uciHostsInfo.optName.sun;

		var keys = [MON, TUE, WED, THU, FRI, SAT, SUN];
		for (var i in weekList)
		{
			obj[keys[i]] = weekList[i];
		}
	};

	this.initTimeOptions = function(timeOptions, max)
	{
		var value, str, entry;

		for (var i = 0; i < max; i++) {
			str = i;
			if (i < 10)
			{
				str = "0" + i;
			}
			entry = {str: str, value: str};
			timeOptions.push(entry);
		}
	};

	this.setNetControlPanel = function(name, startTime, endTime, weekList, saveCallBack, selInitCallback, isClock, cancelCallBack)
	{
		var stTokens = startTime.split(":");
		var etTokens = endTime.split(":");
		var sHour = stTokens[0];
		var sMinute = stTokens[1];
		var eHour = etTokens[0];
		var eMinute = etTokens[1];
		var netControlName;

		netControlPanelInit(saveCallBack, selInitCallback, isClock, cancelCallBack);
		netControlName = id("netControlName");
		netControlName.value = name;
		id("beginHour").changeSel(sHour);
		id("beginMinute").changeSel(sMinute);
		id("endHour").changeSel(eHour);
		id("endMinute").changeSel(eMinute);

		blockGrid = new BlockGrid();
		blockGrid.blockInit({
			id:"netControlWeek",
			data: weekList,
			dataInfo: [{str: label.MonB, value: ENABLED, unValue:DISABLED},
						{str: label.TueB, value: ENABLED, unValue:DISABLED},
						{str: label.WenB, value: ENABLED, unValue:DISABLED},
						{str: label.ThuB, value: ENABLED, unValue:DISABLED},
						{str: label.FriB, value: ENABLED, unValue:DISABLED},
						{str: label.StaB, value: ENABLED, unValue:DISABLED},
						{str: label.SunB, value: ENABLED, unValue:DISABLED}]
		});
	};

	this.netControlPanelDis = function(tag)
	{
		var vigNetControlCon = id("VigNetControlCon");
		if (true === tag)
		{
			showCoverB(function(){
				vigNetControlCon.style.visibility = "visible";
				vigNetControlCon.style.top = "150px";
			});
		}
		else
		{
			hideCoverB(function(){
				vigNetControlCon.style.visibility = "hidden";
				vigNetControlCon.style.top = "-9999px";
			});
		}
	};

	this.netControlPanelInit = function(saveCallBack, selInitCallback, isClock, cancelCallBack)
	{
		var div, divCon = id("VigNetControlCon");
		var DEFAULT_TIME = "0";
		var hourOptions = [];
		var miniteOptions = [];
		var startTimeStr, endTimeStr;

		if (null == divCon)
		{
			divCon = document.createElement("div");
			divCon.className = "VigNetControlCon";
			divCon.id = "VigNetControlCon";
			document.body.appendChild(divCon);
		}
		else
		{
			emptyNodes(divCon);
		}

		isClock = (undefined == isClock) ? false : isClock;
		if (true == isClock)
		{
			startTimeStr = label.beginClock;
			endTimeStr = label.endClock;
		}
		else
		{
			startTimeStr = label.beginTime;
			endTimeStr = label.endTime;
		}

		divCon.innerHTML = '<div class="vigNetControl" id="vigNetControl">'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+label.periodDesc+'</label>'+
				'<input type="text" class="text timeDesc" id="netControlName" maxlength="32">'+
			'</ul>'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+startTimeStr+'</label>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="beginHour" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.hour+'</label>'+
				'</li>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="beginMinute" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.minute+'</label>'+
				'</li>'+
			'</ul>'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+endTimeStr+'</label>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="endHour" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.hour+'</label>'+
				'</li>'+
				'<li class="netControlText">'+
					'<span class="netSelectSpan"><span id="endMinute" class="select netSelect">'+
						'<span class="value hsTimeCon"></span>'+
						'<i class="arrow eptArrow"></i>'+
					'</span></span>'+
					'<label>'+label.minute+'</label>'+
				'</li>'+
			'</ul>'+
			'<ul class="netControlLine">'+
				'<label class="desc">'+label.repeat+'</label>'+
				'<ul class="netControlWeek" id="netControlWeek"></ul>'+
			'</ul>'+
			'<div class="netControlBtn">'+
				'<input type="button" class="subBtn eptBtnA" value="'+btn.ok+'" id="btnSaveWeek">'+
				'<input type="button" class="cancelBtn eptBtnA" value="'+btn.cancel+'" id="btnCancelWeek">'+
			'</div>'+
		'</div>';

		initTimeOptions(hourOptions, 24);
		initTimeOptions(miniteOptions, 60);

		/* 保存上网时间限制 */
		id("btnSaveWeek").onclick = saveCallBack;

		id("btnCancelWeek").onclick = function(){
			netControlPanelDis(false);
			beEdit = false;

			if (typeof cancelCallBack == "function")
			{
				cancelCallBack();
			}
		};

		if (typeof selInitCallback != "function")
		{
			selInitCallback = selectInitEptMgt;
		}

		selInitCallback("beginHour", hourOptions, DEFAULT_TIME);
		selInitCallback("beginMinute", miniteOptions, DEFAULT_TIME);
		selInitCallback("endHour", hourOptions, DEFAULT_TIME);
		selInitCallback("endMinute", miniteOptions, DEFAULT_TIME);
	};

	this.netCtrlListCreate5G = function(netCtrlList, delCallBack, saveCallBack, selInitCallback, isClock, cancelCallBack)
	{
		var divParent = id("netControlList5G");
		var ulNode, liNode, iNode, pNode, spanNode;
		var doc = document;
		var item, weekList, keyName, num = 0;

		var BNAME = uciHostsInfo.optName.name;
		var START_TIME = uciHostsInfo.optName.startTime;
		var END_TIME = uciHostsInfo.optName.endTime;
		var epWeekType = [label.Mon, label.Tue, label.Wen, label.Thu, label.Fri, label.Sta, label.Sun];

		emptyNodes(divParent);
		ulNode = doc.createElement("ul");
		divParent.appendChild(ulNode);
		isClock = (undefined == isClock) ? false : isClock;

		for (var i in netCtrlList)
		{
			var weekStr = "";

			num++;
			for (var key in netCtrlList[i])
			{
				keyName = key;
				item = netCtrlList[i][key];
			}

			liNode = doc.createElement("li");
			$(liNode).hover(
				function(){
					$(this).find("i").css("visibility", "visible");
				},
				function(){
					$(this).find("i").css("visibility", "hidden");
				});
			ulNode.appendChild(liNode);

			iNode = doc.createElement("i");
			iNode.onclick = (function(keyName, netCtrlList){
				return function() {
					delCallBack(keyName, netCtrlList);
				}
			})(keyName, netCtrlList);
			liNode.appendChild(iNode);
			if (true == isClock)
			{
				liNode.onclick = (function(item, iNode, keyName){
					return function(event){
						event = event || window.event;
						var target = event.target || event.srcElement;
						if (iNode == target)
						{
							return;
						}

						var name = item[BNAME];
						var startTime = item[START_TIME];
						var endTime = item[END_TIME];

						gTimeLimitAction5G = ACTION_EDIT;
						gTimeLimitItem5G = item;
						gTimeLimitKeyName5G = keyName;
						weekList = objToWeekList(item);

						setNetControlPanel5G(name, startTime, endTime, weekList, saveCallBack, selInitCallback, isClock, cancelCallBack);
						netControlPanelDis5G(true);
						beEdit = true;
					};
				})(item, iNode, keyName);
			}
			else
			{
				liNode.onclick = null;
			}

			pNode = doc.createElement("pre");
			pNode.innerHTML = htmlEscape(getStrInMax(item[BNAME], 16));
			liNode.appendChild(pNode);

			spanNode = doc.createElement("span");
			if (true == isClock)
			{
				spanNode.innerHTML = item[START_TIME] + label.wlanOn + " / " + item[END_TIME] + label.wlanOff;
			}
			else
			{
				spanNode.innerHTML = label.limitTime + label.colon + item[START_TIME] + " - " + item[END_TIME];
			}
			liNode.appendChild(spanNode);

			spanNode = doc.createElement("span");
			weekList = objToWeekList(item);
			for (var weekIndex in weekList)
			{
				if (weekList[weekIndex] == ENABLED)
				{
					weekStr += epWeekType[weekIndex] + label.sep;
				}
			}
			if (weekStr.length > 0)
			{
				weekStr = weekStr.substring(0, weekStr.length - 1);
			}
			spanNode.innerHTML = label.repeat + label.colon + weekStr;
			liNode.appendChild(spanNode);
		}

		divParent.num = num;
	};

	this.setNetControlPanel5G = function(name, startTime, endTime, weekList, saveCallBack, selInitCallback, isClock, cancelCallBack)
	{
		var stTokens = startTime.split(":");
		var etTokens = endTime.split(":");
		var sHour = stTokens[0];
		var sMinute = stTokens[1];
		var eHour = etTokens[0];
		var eMinute = etTokens[1];
		var netControlName;

		netControlPanelInit5G(saveCallBack, selInitCallback, isClock, cancelCallBack);
		netControlName = id("netControlName5G");
		netControlName.value = name;
		id("beginHour5G").changeSel(sHour);
		id("beginMinute5G").changeSel(sMinute);
		id("endHour5G").changeSel(eHour);
		id("endMinute5G").changeSel(eMinute);

		blockGrid5G = new BlockGrid();
		blockGrid5G.blockInit({
			id:"netControlWeek5G",
			data: weekList,
			dataInfo: [{str: label.MonB, value: ENABLED, unValue:DISABLED},
				{str: label.TueB, value: ENABLED, unValue:DISABLED},
				{str: label.WenB, value: ENABLED, unValue:DISABLED},
				{str: label.ThuB, value: ENABLED, unValue:DISABLED},
				{str: label.FriB, value: ENABLED, unValue:DISABLED},
				{str: label.StaB, value: ENABLED, unValue:DISABLED},
				{str: label.SunB, value: ENABLED, unValue:DISABLED}]
		});
	};

	this.netControlPanelDis5G = function(tag)
	{
		var vigNetControlCon = id("VigNetControlCon5G");
		if (true === tag)
		{
			showCoverB(function(){
				vigNetControlCon.style.visibility = "visible";
				vigNetControlCon.style.top = "150px";
			});
		}
		else
		{
			hideCoverB(function(){
				vigNetControlCon.style.visibility = "hidden";
				vigNetControlCon.style.top = "-9999px";
			});
		}
	};

	this.netControlPanelInit5G = function(saveCallBack, selInitCallback, isClock, cancelCallBack)
	{
		var div, divCon = id("VigNetControlCon5G");
		var DEFAULT_TIME = "0";
		var hourOptions = [];
		var miniteOptions = [];
		var startTimeStr, endTimeStr;

		if (null == divCon)
		{
			divCon = document.createElement("div");
			divCon.className = "VigNetControlCon";
			divCon.id = "VigNetControlCon5G";
			document.body.appendChild(divCon);
		}
		else
		{
			emptyNodes(divCon);
		}

		isClock = (undefined == isClock) ? false : isClock;
		if (true == isClock)
		{
			startTimeStr = label.beginClock;
			endTimeStr = label.endClock;
		}
		else
		{
			startTimeStr = label.beginTime;
			endTimeStr = label.endTime;
		}

		divCon.innerHTML = '<div class="vigNetControl" id="vigNetControl5G">'+
			'<ul class="netControlLine">'+
			'<label class="desc">'+label.periodDesc+'</label>'+
			'<input type="text" class="text timeDesc" id="netControlName5G" maxlength="32">'+
			'</ul>'+
			'<ul class="netControlLine">'+
			'<label class="desc">'+startTimeStr+'</label>'+
			'<li class="netControlText">'+
			'<span class="netSelectSpan"><span id="beginHour5G" class="select netSelect">'+
			'<span class="value hsTimeCon"></span>'+
			'<i class="arrow eptArrow"></i>'+
			'</span></span>'+
			'<label>'+label.hour+'</label>'+
			'</li>'+
			'<li class="netControlText">'+
			'<span class="netSelectSpan"><span id="beginMinute5G" class="select netSelect">'+
			'<span class="value hsTimeCon"></span>'+
			'<i class="arrow eptArrow"></i>'+
			'</span></span>'+
			'<label>'+label.minute+'</label>'+
			'</li>'+
			'</ul>'+
			'<ul class="netControlLine">'+
			'<label class="desc">'+endTimeStr+'</label>'+
			'<li class="netControlText">'+
			'<span class="netSelectSpan"><span id="endHour5G" class="select netSelect">'+
			'<span class="value hsTimeCon"></span>'+
			'<i class="arrow eptArrow"></i>'+
			'</span></span>'+
			'<label>'+label.hour+'</label>'+
			'</li>'+
			'<li class="netControlText">'+
			'<span class="netSelectSpan"><span id="endMinute5G" class="select netSelect">'+
			'<span class="value hsTimeCon"></span>'+
			'<i class="arrow eptArrow"></i>'+
			'</span></span>'+
			'<label>'+label.minute+'</label>'+
			'</li>'+
			'</ul>'+
			'<ul class="netControlLine">'+
			'<label class="desc">'+label.repeat+'</label>'+
			'<ul class="netControlWeek" id="netControlWeek5G"></ul>'+
			'</ul>'+
			'<div class="netControlBtn">'+
			'<input type="button" class="subBtn eptBtnA" value="'+btn.ok+'" id="btnSaveWeek5G">'+
			'<input type="button" class="cancelBtn eptBtnA" value="'+btn.cancel+'" id="btnCancelWeek5G">'+
			'</div>'+
			'</div>';

		initTimeOptions(hourOptions, 24);
		initTimeOptions(miniteOptions, 60);

		/* 保存上网时间限制 */
		id("btnSaveWeek5G").onclick = saveCallBack;

		id("btnCancelWeek5G").onclick = function(){
			netControlPanelDis5G(false);
			beEdit = false;

			if (typeof cancelCallBack == "function")
			{
				cancelCallBack();
			}
		};

		if (typeof selInitCallback != "function")
		{
			selInitCallback = selectInitEptMgt;
		}

		selInitCallback("beginHour5G", hourOptions, DEFAULT_TIME);
		selInitCallback("beginMinute5G", miniteOptions, DEFAULT_TIME);
		selInitCallback("endHour5G", hourOptions, DEFAULT_TIME);
		selInitCallback("endMinute5G", miniteOptions, DEFAULT_TIME);
	};
}

/*added by WuWeier, 适用于Slp的函数 */
function Slp()
{
	this.ROLE_LOCAL  = 0;		// 本地主机
	this.ROLE_REMOTE = 1;		// 远程主机
	this._gController = "";		// LuCI框架中的Controller
	this._gMedia = "";		// LuCI框架中的Media
	this._gRole = ROLE_LOCAL;	// 登录的用户角色

	/* 设置全局的controller变量 */
	this.setController = function (c) {
		_gController = c;
	};

	/* 获取全局的controller变量 */
	this.getController = function () {
		return _gController;
	};

	/* 设置全局的media变量 */
	this.setMedia = function (m) {
		_gMedia = m;
	};

	/* 获取全局的media变量 */
	this.getMedia = function () {
		return _gMedia;
	};

	/* 设置全局的Role变量 */
	this.setRole = function (role) {
		_gRole = role;
	};

	/* 获取全局的Role变量 */
	this.getRole = function () {
		return _gRole;
	};

	this.initImagePath = function(media)
	{
		for (var mindex in imagePath)
		{
			imagePath[mindex] = media + "/" + imagePath[mindex];
		}
	};

	this.cloneObj = function(obj)
	{
		var re = {};

		if (typeof (obj) != 'object')
		{
			return obj;
		}

		if (obj.constructor == Array)
		{
			re = [];
		}

		for ( var i in obj)
		{
			re[i] = cloneObj(obj[i]);
		}

		return re;
	};

	this.hideLeadingZeros = function(str)
	{
		return str.replace(/0*(\d+)/g, "$1");
	};

	this.calcNextIndex = function(array, pos)
	{
		if (array == null || !(array instanceof Array))
		{
			return -1;
		}

		var indexArr = [];
		for (var i in array)
		{
			var name = array[i][".name"];
			if (typeof name == "undefined" || typeof name != "string")
			{
				continue;
			}

			var index = name.replace(/^.*_(\d+)$/g, '$1');
			indexArr[index] = true;
		}

		var len = indexArr.length;
		if (!(/\D/g.test(pos)) && pos >= len)
		{
			return pos;
		}

		var i = (/\D/g.test(pos)) ? 1 : pos;
		for (; i <= len; i++)
		{
			if (typeof indexArr[i] == "undefined")
			{
				return i;
			}
		}

		return (len + 1);
	};

	this.formatTableData = function(array)
	{
		var re = [];
		if (array == null || !(array instanceof Array))
		{
			return re;
		}

		for (var i in array)
		{
			var obj = array[i];
			for (var prop in obj)
			{
				obj[prop][SEC_NAME] = prop;
				re[i] = obj[prop];
			}
		}

		return re;
	};
}

function CloudCommon()
{
	this.cloudAccountEmailList = [
		{key:"gmail.com",	value:"https://mail.google.com"},
		{key:"live.com",	value:"http://mail.live.com"},
		{key:"live.cn",		value:"http://mail.live.com"},
		{key:"hotmail.com",	value:"http://mail.live.com"},
		{key:"outlook.com",	value:"http://mail.live.com"},
		{key:"qq.com",		value:"http://mail.qq.com"},
		{key:"126.com",		value:"http://mail.126.com"},
		{key:"163.com",		value:"http://mail.163.com"},
		{key:"yeah.net",	value:"http://mail.yeah.net"},
		{key:"sina.com",	value:"http://mail.sina.com.cn"},
		{key:"sohu.com",	value:"http://mail.sohu.com"},
		{key:"21cn.com",	value:"http://mail.21cn.com"},
		{key:"sina.com.cn",	value:"http://mail.sina.com.cn"},
		{key:"tom.com",		value:"http://mail.tom.com"},
		{key:"sogou.com",	value:"http://mail.sogou.com"},
		{key:"foxmail.com",	value:"http://mail.foxmail.com"},
		{key:"188.com",		value:"http://mail.188.com"},
		{key:"wo.cn",		value:"http://mail.wo.cn"},
		{key:"189.cn",		value:"http://mail.189.cn"},
		{key:"139.com",		value:"http://mail.10086.cn"},
		{key:"eyou.com",	value:"http://www.eyou.com"},
		{key:"aliyun.com",	value:"http://mail.aliyun.com"},
		{key:"263.net",		value:"http://mail.263.net"},
		{key:"2980.com",	value:"http://www.2980.com"}
	];

	this.emailLinkCheck = function(emallAddr){
		for (var index in cloudAccountEmailList)
		{
			var item = cloudAccountEmailList[index];
			if (emallAddr.indexOf(item.key) > 0)
			{
				return item.value;
			}
		}

		return null;
	};

	this.gCloudColObj = {
		cloudBackHd:null,
		cloudBackBRHd:null,
		account:""
	};

	this.cloudSetBackHd = function(handle){
		gCloudColObj.cloudBackHd = handle;
	};

	this.cloudGoBack = function(){
		var goBack = gCloudColObj.cloudBackHd;

		typeof goBack == "function" && goBack();
	};

	this.cloudSetBackBRHd = function(handle){
		gCloudColObj.cloudBackBRHd = handle;
	};

	this.cloudGoBackBR = function(arg){
		var goBack = gCloudColObj.cloudBackBRHd;

		hideCloudPage();
		typeof goBack == "function" && goBack(arg);
	};

	this.gCloudAccountBR = {
		bodyHeight:0,
		account:"",
		pwd:"",
		CAPTCHAR:"",
		accountType:"",
		success:false,
		noteF:"",
		noteS:"",
		pwdLen:0,
		softVersion:"",
		bFWzd:false
	};

	this.showCloudPage = function(url)
    {
		var cloudAccountPage = id(this.cloudPageId);

		if (null == cloudAccountPage)
		{
			cloudAccountPage = el("div");
			cloudAccountPage.id = this.cloudPageId;
			document.body.appendChild(cloudAccountPage);
		}

        loadPage(url, "CloudAccountPage", function(result){
			if (ENONE == result[ERR_CODE])
			{
				cloudPageSetNodes(true);
			}
		}, {bClearPageTickArray:false});
    };

	this.hideCloudPage = function(){
		try
		{
			var cloudPageCon = id(this.cloudPageId);

			emptyNodes(cloudPageCon);
			cloudPageCon.style.height = "0px";
			cloudPageSetNodes(false);
		}catch(ex){}
	};

	this.cloudPageSetNodes = function(tag){
		var other = "none", cloudPage = "none";
		var node, nodes = document.body.childNodes;

		if (true == tag)
		{
			cloudPage = "block";
			other = "none";
			gCloudAccountBR.bodyHeight = parseInt(document.body.offsetHeight);
		}
		else
		{
			cloudPage = "none";
			other = "block";
		}

		/* 设置节点显隐 */
		for(var index in nodes)
		{
			node = nodes[index];
			if (node.nodeName != undefined &&
				node.nodeName.toUpperCase() == "DIV")
			{
				if (node.id == this.cloudPageId)
				{
					setStyle(node, {"display":cloudPage});
				}
				else if (node.id == "Con")
				{
					if (true == tag)
					{
						node.style.visibility = "hidden";
						node.style.position = "absolute";
						node.style.top = "-9999px";
					}
					else
					{
						node.style.visibility = "visible";
						node.style.position = "static";
						node.style.top = "0px";
					}
				}
				else if (node.id != this.loginId ||
					node.id != this.coverId)
				{
					setStyle(node, {"display":other});
				}
			}
		}

		id(this.loginId).style.display = "none";
		id(this.coverId).style.display = "none";
	};

	this.appendErrCode = function(str, code)
	{
		return str + label.lBrackets + label.errCode + label.colon + parseInt(code) + label.rBrackets;
	};

	this.cloudErrHandle = function(errCode)
	{
		var code = parseInt(errCode);

		switch(code)
		{
		case EINVCLOUDERRORPARSEJSON:
		case EINVCLOUDERRORPARSEJSONNULL:
		case EINVCLOUDERRORPARSEJSONID:
		case EINVCLOUDCLIENTGENERIC:
		case EINVCLOUDDNSQUERYERR:
		case EINVCLOUDTCPCONTERR:
		case EINVCLOUDCLIENTWANIPCHANGE:
		case EINVCLOUDCLIENTDISCONNECTFIN:
		case EINVCLOUDCLIENTDISCONNECTRST:
		case EINVCLOUDCLIENTDISCONNECT:
		case EINVCLOUDCLIENTDISCONNECTSOCKETERRNUM:
		case EINVCLOUDCLIENTWANPHYPORTLINKDOWN:
		case EINVCLOUDCLIENTDOWNLOADPARSEDNSREQUEST:
		case EINVCLOUDCLIENTDOWNLOADESTABLISHTCP:
		case EINVCLOUDCLIENTDOWNLOADHTTPNOTOK:
		case EINVCLOUDCLIENTDOWNLOADTIMEOUT:
			showStr = errStr.invNetworkErr; /* 网络异常，请稍后重试 */
			break;
		case EINVCLOUDERRORGENERIC:
		case EINVCLOUDERRORSERVERINTERNALERROR:
		case EINVCLOUDERRORPERMISSIONDENIED:
		case EINVCLOUDERRDENYPASSEDDEV:
		case EINVCLOUDCLIENTHEARTREQUESTTIMEOUT:
		case EINVCLOUDSTOPCONCT:
		case EINVCLOUDCLIENTHELLOCLOUD:
		case EINVCLOUDCLIENTPUSHPLUGININFO:
		case EINVCLOUDCLIENTGETFWLIST:
		case EINVCLOUDCLIENTGETINITFWLIST:
			showStr = errStr.invServerBusyRetry; /* 服务器繁忙，请稍后重试 */
			break;
		case EINVCLOUDDOMAINERR:
		case EINVCLOUDSSLSIGNERR:
		case EINVCLOUDSSLTIMEERR:
		case EINVCLOUDSSLENCRYPTIONERR:
			showStr = errStr.invConntServerFail; /* 连接服务器失败，请稍后重试 */
			break;
		case EINVCLOUDDEVICEILLEGAL:
			showStr = errStr.invCloudDeviceIdErr;
			break;
		case EINVERRORPERMISSIONDENIED:
			showStr = errStr.invPermissionDeny;
			break;
		case EINVCLOUDERRORMETHODNOTFOUND:
		case EINVCLOUDERRORPARAMSNOTFOUND:
		case EINVCLOUDERRORPARAMSWRONGTYPE:
		case EINVCLOUDERRORPARAMSWRONGRANGE:
		case EINVCLOUDERRORINVALIDPARAMS:
			showStr = errStr.invRequestFail;
			break;
		case EINVCLOUDERRORBINDDEVICEERROR:
			showStr = errStr.invTPIDLgFail;
			break;
		case EINVCLOUDERRORUNBINDDEVICEERROR:
			showStr = errStr.invTPIDUnBindFail;
			break;
		case EINVCLOUDERRORHWIDNOTFOUND:
		case EINVCLOUDERRORFWIDNOTSUPPORTDEVICE:
			showStr = label.cloudDeviceInfoExpt;
			break;
		case EINVCLOUDERRORDEVICEALIASFORMATERROR:
			showStr = errStr.invRouterNameFormat;
			break;
		case EINVCLOUDERRORACCOUNTUSERNAMEFORMATERROR:
			showStr = errStr.invCloudAccountFmtErr;
			break;
		case EINVCLOUDERRORACCOUNTACTIVEMAILSENDFAIL:
		case EINVCLOUDERRORRESETMAILSENDFAIL:
			showStr = errStr.invCAPTCHASendFail;
			break;
		case EINVCLOUDERRORTOKENEXPRIED:
		case EINVCLOUDERRORTOKENINCORRECT:
			showStr = errStr.invTPIDTimeout;
			break;
		case EINVCLOUDERRORACCOUNTACTIVEFAIL:
		case EINVCLOUDERRORACCOUNTACTIVETIMEOUT:
			showStr = errStr.invAccountCheckFail;
			break;
		case EINVCLOUDERRORRESETPWDTIMEOUT:
		case EINVCLOUDERRORRESETPWDFAIL:
			showStr = errStr.invAccountRstPwdFail;
			break;
		default:
			return {result:true};
		}

		showStr = appendErrCode(showStr, code);

		return {result:false, tip:showStr};
	};
}

function CloudAction()
{
	this.cloudActionQueryStatusHd = null;
	this.cloudActionQueryStatusWaitHd = null;
	this.cloudActionStatusQuering = false;
	this.cloudActionQueryStoped = false;
	this.CLOUD_STATUS_QUERY_TIMEOUT = 1000;
	this.CLOUD_STATUS_QUERY_TIMEOUT_WAIT = 20 * 1000;
	this.cloudCloseLoadingHandle = null;

	this._cloudExptStopHandle = function(){
		clearTimeout(cloudActionQueryStatusWaitHd);
		closeLoading();
		typeof cloudCloseLoadingHandle == "function" && cloudCloseLoadingHandle();
		_setCloudCloseLoadingHandle(null);
	};

	/* 云客户端动作执行结果查询的错误处理函数 */
	this._cloudQueryErrHandle = function(errNo, objOrId){
		var showStr = "";

		switch (parseInt(errNo))
		{
		case ENONE:
			return true;
		default:
			showStr = errStr.invRequestFail;
			break;
		}

		_cloudExptStopHandle();
		showAlert(showStr, objOrId);
		return false;
	};

	/* 云客户端动作执行和查询的错误处理函数 */
	this._cloudGetActnErrHandle = function(errNo, callBack){
		var showStr = "";
		var cloudErrRel;

		switch (parseInt(errNo))
		{
		case ENONE:		/* 执行成功 */
			return true;
		case EINVSENDREQMSGFAILED:		/* 发送失败 */
			showStr = errStr.invSendReqMsgFailed;
			break;
		case ESYSBUSY:
		case EINVLASTOPTIONISNOTFINISHED:		/* 上个动作执行中 */
			showStr = errStr.invLastOptionIsNotFinished;
			break;
		case ESYSTEM:
			showStr = errStr.invRequestFail;		/* 系统错误 */
			break;
		case ENOMEMORY:
			showStr = errStr.invMemoryOut;		/* 系统内存不足 */
			break;
		case EINVGETDATAFAILED:
			showStr = errStr.invGetDataFailed;		/* 获取数据失败 */
			break;
		case EINVPARAMETER:
			showStr = errStr.invParameter;		/* 请求参数非法 */
			break;
		case EINVREQUESTTIMEOUT:
			showStr = appendErrCode(errStr.invRequestTimeout, errNo);		/* 请求超时，服务器无响应 */
			break;
		case EINVDEVICEIDNOTEXIST:
		case EINVERRORDEVICEIDFORMATERROR:
		case EINVILLEGALDEVICE:
			showStr = appendErrCode(label.cloudDeviceInfoExpt, errNo);		/* 设备非法 */
			break;
		default:		/* 未知的错误 */
			cloudErrRel = cloudErrHandle(errNo)
			if (cloudErrRel.result == false)
			{
				showStr = cloudErrRel.tip;
				break;
			}

			if (typeof callBack == "function")
			{
				_cloudExptStopHandle();
				callBack(errNo);
				return false;
			}
			else
			{
				showStr = errStr.invRequestFail;
				break;
			}
		}

		_cloudExptStopHandle();
		showAlert(showStr);
		return false;
	};

	/* 强制停止正在进行的查询动作 */
	this.cloudAccountQueryStop = function(){
		cloudActionQueryStoped = true;
		cloudActionStatusQuering = false;
		clearTimeout(cloudActionQueryStatusHd);
		clearTimeout(cloudActionQueryStatusWaitHd);
		_cloudExptStopHandle();
	};

	this._cloudStatusDataOrg = function(secName){
		var data = {};
		var uciCS= cloudClientStatus;

		data[uciCS.fileName] = {};
		data[uciCS.fileName][KEY_NAME] = secName;

		return data;
	};

	this._setCloudCloseLoadingHandle = function(handle)
	{
		cloudCloseLoadingHandle = handle;
	};

	/* 查询获取TP-LINK ID的状态的结果 */
	this._cloudAccountStatus = function(secName, callBack, timeoutCallBack){
		cloudActionStatusQuering = true;
		$.query(_cloudStatusDataOrg(secName), function(result){
			if (_cloudGetActnErrHandle(result[ERR_CODE]))
			{
				var uciCS= cloudClientStatus;
				var status = parseInt(result[uciCS.fileName][secName][uciCS.optName.actionStatus]);
				var statusCC = uciCS.optValue.queryStatus;

				switch(status)
				{
				case statusCC.idle:
				case statusCC.max:
					_cloudGetActnErrHandle(EINVSENDREQMSGFAILED);
					break;
				case statusCC.timeout:
					if (typeof timeoutCallBack == "function")
					{
						timeoutCallBack();
					}
					else
					{
						_cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
					}
					break;
				case statusCC.prepare:
				case statusCC.trying:
					cloudActionQueryStatusHd = $.setTimeout(function(){
						_cloudAccountStatus(secName, callBack, timeoutCallBack);	/* 此处表示服务器有响应，交由具体的函数进行处理 */
					}, CLOUD_STATUS_QUERY_TIMEOUT);
					return;
				case statusCC.failed:		/* 此处成功和失败是相同的处理，区别在于具体的错误码不同，需要具体的调用者具体分析 */
				case statusCC.success:
					callBack(result);
					break;
				default:
					_cloudGetActnErrHandle(undefined);
					break;
				}

				closeLoading(cloudCloseLoadingHandle);
				_setCloudCloseLoadingHandle(null);
				cloudActionStatusQuering = false;
				clearTimeout(cloudActionQueryStatusWaitHd);
			}
		});
	};

	/* 开始执行查询的状态 */
	this._cloudActionQueryStatus = function(secName, callBack, forced, timeoutCallBack, queryStatusTimeout){
		/* 查询动作被手动关闭, 则直接退出 */
		if (true == cloudActionQueryStoped)
		{
			return;
		}

		if (true == cloudActionStatusQuering && false == forced)	/* 之前的动作正在执行 */
		{
			_cloudGetActnErrHandle(EINVLASTOPTIONISNOTFINISHED);
		}
		else
		{
			cloudActionStatusQuering = false;
			clearTimeout(cloudActionQueryStatusHd);
			clearTimeout(cloudActionQueryStatusWaitHd);

			/* 设置超时处理 */
			cloudActionQueryStatusWaitHd = $.setTimeout(function(){
				cloudActionStatusQuering = false;
				clearTimeout(cloudActionQueryStatusHd);
				if (typeof timeoutCallBack == "function")
				{
					timeoutCallBack();
				}
				else
				{
					_cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
				}
			}, CLOUD_STATUS_QUERY_TIMEOUT_WAIT);

			/* 开始查询 */
			_cloudAccountStatus(secName, callBack, function(){
				clearTimeout(cloudActionQueryStatusWaitHd);
				if (typeof queryStatusTimeout == "function")
				{
					queryStatusTimeout();
				}
				else
				{
					_cloudGetActnErrHandle(EINVREQUESTTIMEOUT);
				}
			});
		}
	};

	/* 获取TP-LINK ID的状态 */
	this.cloudAccountState = function(account, callBack){
		var data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		data[uciCC.fileName][uciCC.actionName.getAccountStat] = {};
		data[uciCC.fileName][uciCC.actionName.getAccountStat][uciCC.optName.username] = account;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS= cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getAccountStat, function(result){
					if (_cloudQueryErrHandle(result[uciCS.fileName][uciCS.secName.getAccountStat][uciCS.optName.errCode]))
					{
						var dataObj = {};

						dataObj[uciCC.fileName] = {};
						dataObj[uciCC.fileName][KEY_NAME] = uciCC.secName.deviceStatus;
						$.action(dataObj, function(result){
							if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
							{
								callBack(uciCC.optValue.regestStatus == result[uciCC.fileName][uciCC.secName.deviceStatus]);
							}
						}, true);
					}
				}, true);
			}
		}, true);
	};

	/* 检查重置(找回)密码的验证码是否正确 */
	this.cloudAccountRstPwdCheckCAPTCHA = function(account, CAPTCHA, callBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.checkResetPwdVerifyCode] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.verifyCode] = CAPTCHA;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.checkResetPwdVerifyCode, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.checkResetPwdVerifyCode][uciCS.optName.errCode]);
				}, true);
			}
		}, true);
	};

	/* 获取重置(找回)密码的验证码 */
	this.cloudAccountRstPwdAC = function(account, accountType, callBack, closeCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.getResetPwdVerifyCode] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.accountType] = accountType;
		cloudActionQueryStoped = false;
		_setCloudCloseLoadingHandle(closeCallBack);

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getResetPwdVerifyCode, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getResetPwdVerifyCode][uciCS.optName.errCode]);
				}, true);
			}
		}, true);
	};

	/* 重置（找回）TP-LINK ID的密码 */
	this.cloudAccountRstPwd = function(account, pwd, CAPTCHA, accountType, callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.resetPassword] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.verifyCode] = CAPTCHA;
		secObj[uciCC.optName.password] = pwd;
		secObj[uciCC.optName.accountType] = accountType;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.resetPassword, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.resetPassword][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 登录TP-LINK ID */
	this.cloudAccountBind = function(account, pwd, callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.bind] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.password] = pwd;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.bind, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.bind][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 获取创建TP-LINK ID的验证码 */
	this.cloudAccountGetRegistAC = function(account, accountType, callBack, closeCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.getRegVerifyCode] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.accountType] = accountType;
		cloudActionQueryStoped = false;
		_setCloudCloseLoadingHandle(closeCallBack);

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getRegVerifyCode, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getRegVerifyCode][uciCS.optName.errCode]);
				}, true);
			}
		}, true);
	};

	/* 创建TP-LINK ID */
	this.cloudAccountRegist = function(account, accountType, pwd, CAPTCHA, callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.register] = {};
		secObj[uciCC.optName.username] = account;
		secObj[uciCC.optName.accountType] = accountType;
		secObj[uciCC.optName.verifyCode] = CAPTCHA;
		secObj[uciCC.optName.password] = pwd;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.register, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.register][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 解绑TP-LINK ID */
	this.cloudAccountUnind = function(callBack, timeoutCallBack){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.unbind] = {};
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.unbind, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.unbind][uciCS.optName.errCode]);
				}, true, timeoutCallBack);
			}
		}, true);
	};

	/* 修改TP-LINK ID密码 */
	this.cloudAccountModifyPwd = function(oldpwd, newPwd, callBack, timeoutCallBack, queryStatusTimeout){
		var secObj, data = {};
		var uciCC = uciCloudConfig;

		data[uciCC.fileName] = {};
		secObj = data[uciCC.fileName][uciCC.actionName.modifyAccountPwd] = {};
		secObj[uciCC.optName.oldPassword] = oldpwd;
		secObj[uciCC.optName.newPassword] = newPwd;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.modifyAccountPwd, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.modifyAccountPwd][uciCS.optName.errCode]);
				}, true, timeoutCallBack, queryStatusTimeout);
			}
			else
			{
				hsLoading(false);
			}
		}, true);
	};

	/* 请求未安装插件信息 */
	this.getAppsUninstalledInfo = function (start, end, callBack, timeoutHandle, queryStatusTimeout){
		var secObj, data = {};

		data[uciAppInfo.fileName] = {};
		secObj = data[uciAppInfo.fileName][uciAppInfo.actionName.getUninstalledInfo] = {};
		secObj[uciAppInfo.dynOptName.start] = start;
		secObj[uciAppInfo.dynOptName.end] = end;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getNotInstalledApps, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getNotInstalledApps][uciCS.optName.errCode]);
				}, true, timeoutHandle, queryStatusTimeout);
			}
		}, true);
	};

	/* 请求可更新插件信息 */
	this.getAppsCanUpdateInfo = function (start, end, callBack, timeoutHandle, queryStatusTimeout){
		var secObj, data = {};

		data[uciAppInfo.fileName] = {};
		secObj = data[uciAppInfo.fileName][uciAppInfo.actionName.getUpdateInfo] = {};
		secObj[uciAppInfo.dynOptName.start] = start;
		secObj[uciAppInfo.dynOptName.end] = end;
		cloudActionQueryStoped = false;

		$.action(data, function(result){
			/* 查询动作被手动关闭, 则直接退出 */
			if (true == cloudActionQueryStoped)
			{
				return;
			}

			if (true == _cloudGetActnErrHandle(result[ERR_CODE], callBack))
			{
				var uciCS = cloudClientStatus;
				_cloudActionQueryStatus(uciCS.secName.getCanUpdateApps, function(result){
					callBack(result[uciCS.fileName][uciCS.secName.getCanUpdateApps][uciCS.optName.errCode]);
				}, true, timeoutHandle, queryStatusTimeout);
			}
		}, true);
	};

	/* 请在此处继续添加其他的处理 */
}

/* cloud push 函数 */
function CloudUpgradePush()
{
	this.pageCloudPush = true;	/* 登陆页面期间只弹出一处升级提示 */
	this.gOnlineUpgradeNote = "";
	this.upgradeErrCBCloudPush = null;
	this.gOnlineUpgradeFail = false;
	this.gOnlineUpgradeAuto = false;
	this.errHandleCloudPush = function(errNo)
	{
		var cloudErrRel;

		switch (parseInt(errNo))
		{
		case ENONE:
			return true;
		case EFWNOTSUPPORTED:
		case EFILETOOBIG:
		case EFWEXCEPTION:
			gOnlineUpgradeNote = errStr.fwFmtErr;
			break;
		case EFWNOTINFLANDBL:
		case EFWNEWEST:
			gOnlineUpgradeNote = errStr.invNotFoundNewFw;
			break;
		case EINVREQUESTTIMEOUT:
			gOnlineUpgradeNote = appendErrCode(errStr.fwDownLoadFailed, errNo);
			break;
		case EINVMEMORYOUT:
		case EINVDOWNLOADFWFAILED:
		case EINVSENDREQMSGFAILED:
		case EINVCONNECTTINGCLOUDSERVER:
		case EINVLASTOPTIONISNOTFINISHED:
		case ESYSBUSY:
			gOnlineUpgradeNote = errStr.fwDownLoadFailed;
			break;
		case EINVDEVICEIDNOTEXIST:
		case EINVERRORDEVICEIDFORMATERROR:
		case EINVILLEGALDEVICE:
			gOnlineUpgradeNote = appendErrCode(label.cloudDeviceInfoExpt, errNo);		/* 设备非法 */
			break;
		case EINVCLOUDCLIENTGENERIC:
		case EINVCLOUDCLIENTDOWNLOADPARSEDNSREQUEST:
		case EINVCLOUDCLIENTDOWNLOADESTABLISHTCP:
		case EINVCLOUDCLIENTDOWNLOADHTTPNOTOK:
		case EINVCLOUDCLIENTDOWNLOADTIMEOUT:
			gOnlineUpgradeNote = appendErrCode(errStr.invNetworkErr, errNo);	 /* 网络异常，请稍后重试 */
			break;
		case EINVFMT:
		case EFWRSAFAIL:
		case EFWHWIDNOTMATCH:
		case EFWZONECODENOTMATCH:
		case EFWVENDORIDNOTMATCH:
		case EINVUPGRADEFWFAILED:
		default:
			cloudErrRel = cloudErrHandle(errNo);
			if (cloudErrRel.result == false)
			{
				gOnlineUpgradeNote = cloudErrRel.tip;
			}
			else
			{
				gOnlineUpgradeNote = errStr.fwUpgradeFailed;
			}

			break;
		}

		$.setTimeout(upgradeFailHdCloudPush, 10);
		return false;
	};

	this.setUpgradeErrCBCloudPush = function(handle){
		this.upgradeErrCBCloudPush = handle;
	};

	this.upgradeFailHdCloudPush = function()
	{
		if (typeof this.upgradeErrCBCloudPush == "function")
		{
			this.upgradeErrCBCloudPush();
			this.upgradeErrCBCloudPush = null;
		}
	};

	/* 检查是否正在升级 */
	this.checkOnlineUpgrading = function(unUpgradingHd){
		var statusFile = cloudClientStatus.fileName;
		var downloadProg = {};

		downloadProg[statusFile] = {};
		downloadProg[statusFile][KEY_NAME] = cloudClientStatus.secName.clientInfo;

		if (true == $.local)
		{
			unUpgradingHd();
			return;
		}

		$.query(downloadProg, function(result){
			if (ENONE == result[ERR_CODE])
			{
				var cloudInfo = result[statusFile][cloudClientStatus.secName.clientInfo];
				var fwDownloadStatus = parseInt(cloudInfo[cloudClientStatus.optName.fwDownloadStatus]);

				if (uciCloudConfig.optValue.cloudDownloading == fwDownloadStatus ||
					uciCloudConfig.optValue.cloudComplete == fwDownloadStatus)
				{
					onlineUpgradeProgress(SYSUPGRADE_SECONDS);
				}
				else
				{
					unUpgradingHd();
				}
			}
			else
			{
				unUpgradingHd();
			}
		});
	};

	this.onlineUpgradeProgress = function(waitTime){
		var statusFile = cloudClientStatus.fileName;
		showProgBarP(
			statusStr.fwDownloading,
			function(callback){
				var downloadProg = {};
				var percent = 0;
				var rel = {};

				downloadProg[statusFile] = {};
				downloadProg[statusFile][KEY_NAME] = cloudClientStatus.secName.clientInfo;
				$.query(downloadProg, function(result){
					var code = result[ERR_CODE];

					if (true == errHandleCloudPush(code))
					{
						var cloudInfo = result[statusFile][cloudClientStatus.secName.clientInfo];
						var fwDownloadStatus = parseInt(cloudInfo[cloudClientStatus.optName.fwDownloadStatus]);

						if (uciCloudConfig.optValue.cloudDownloading == fwDownloadStatus ||
							uciCloudConfig.optValue.cloudComplete == fwDownloadStatus)
						{
							rel["count"] = parseInt(cloudInfo[cloudClientStatus.optName.fwDownloadProgress]);
							rel[ERR_CODE] = ENONE;
						}
						else if(uciCloudConfig.optValue.cloudOutline == fwDownloadStatus)
						{
							rel["count"] = ERR_PERCENT;
							rel[ERR_CODE] = ENONE;
						}
						/* 固件已完成下载，但固件检验错误 */
						else if(EFWNOTINFLANDBL == fwDownloadStatus)
						{
							rel["count"] = ERR_PERCENT;
							rel[ERR_CODE] = EFWNOTINFLANDBL
						}
						else
						{
							rel["count"] = 0;
							rel[ERR_CODE] = ENONE;
						}
					}
					else
					{
						rel["count"] = ERR_PERCENT;
						rel[ERR_CODE] = ENONE;
					}

					callback(rel);
				}, true);
			},
			true,
			function(success, downErrCode){
				closeProgBar();
				if (true == success)
				{
					showProgBar(waitTime, label.upgrading, function(){
						var url = window.location.href;
						var index = url.indexOf("?");

						if (index >= 0)
						{
							url = url.substring(0, index);
						}

						$.setTimeout(function(){
							lanDetecting(function(){location.href = url;});
						}, LAN_DETECT_TIME);
					});
				}
				else
				{
					if (downErrCode == ENONE)
					{
						gOnlineUpgradeNote = statusStr.fwDownLoadErr;
					}
					else if (downErrCode == EFWNOTINFLANDBL)
					{
						gOnlineUpgradeNote = errStr.fwNotInFLAndBL;
					}
					else
					{
						gOnlineUpgradeNote = appendErrCode(errStr.invNetworkErr, downErrCode);
					}
					upgradeFailHdCloudPush();
				}
			}
		);
	};

	this.checkFWVerSuccessCloudPush = function()
	{
		var uciFile = uciCloudConfig.fileName;
		var data = {};

		data[uciFile] = {};
		data[uciFile][uciCloudConfig.actionName.downloadFw] = null;

		$.action(data, function(dataObj){
			if (true == errHandleCloudPush(dataObj[ERR_CODE]))
			{
				var waitTime = dataObj["wait_time"]
					? parseInt(dataObj["wait_time"])*1000
					: SYSUPGRADE_SECONDS;
				onlineUpgradeProgress(waitTime);
			}
		});
	}

	this.onlineUpgradeCheck = function(checkErrHd, checkFwFailHd, checkFwSuccessHd)
	{
		var uciFile = uciCloudConfig.fileName;
		var statusFile = cloudClientStatus.fileName;
		var data = {};

		/* 查询检查升级信息的结果 */
		function checkFWVer()
		{
			var checkFwVerFail = 0;
			var checkFwVerOK = 4;
			var checkFwVerTimeout = 5;
			var data = {};

			data[statusFile] = {};
			data[statusFile][KEY_NAME] = cloudClientStatus.secName.checkFwVer;
			$.query(data, function(result){
				if (true == checkErrHd(result[ERR_CODE]))
				{
					var actionStatus = result[statusFile][cloudClientStatus.secName.checkFwVer][cloudClientStatus.optName.actionStatus];
					switch(parseInt(actionStatus))
					{
					case checkFwVerFail:
					case checkFwVerTimeout:
						typeof checkFwFailHd == "function" && checkFwFailHd(result[statusFile][cloudClientStatus.secName.checkFwVer][cloudClientStatus.optName.errCode]);
						break;
					case checkFwVerOK:
						typeof checkFwSuccessHd == "function" && checkFwSuccessHd();
						break;
					default:
						$.setTimeout(checkFWVer, 500);
						break;
					}
				}
				else
				{
					typeof checkFwFailHd == "function" && checkFwFailHd();
				}
			});
		}

		data[uciFile] = {};
		data[uciFile][uciCloudConfig.actionName.checkFwVersion] = null;

		/* 检查升级信息 */
		$.action(data, function(result){
			if (true == checkErrHd(result[ERR_CODE]))
			{
				checkFWVer();
			}
		});
	};

	this.onlineUpgrade = function(upgradeErrCallBack, checkFwSuccessHd)
	{
		this.upgradeErrCBCloudPush = upgradeErrCallBack;
		this.gOnlineUpgradeNote = "";
		this.onlineUpgradeCheck(errHandleCloudPush, function(errNo){
				if (undefined != errNo)
				{
					errHandleCloudPush(errNo);
				}
				else
				{
					if ("" == gOnlineUpgradeNote)
					{
						gOnlineUpgradeNote = errStr.fwUpgradeFailed;
						upgradeFailHdCloudPush();
					}
				}
			}, function(){
				typeof checkFwSuccessHd == "function" && checkFwSuccessHd();
				checkFWVerSuccessCloudPush();
			}
		);
	};
}

function Phone()
{
	this.OS = {
		windows:		false,
		windowsPhone:	false,
		unixPC:			false,
		iPad:			false,
		iPhone:			false,
		iMacPC:			false,
		iPod:			false,
		android:		false,
		nokia:			false,
		player:			false,
		Android_UC:		false,
		portable:		false,

		/* true is handled device; false is large device which is not for handler */
		checkDeviceMode:function ()
		{
			var pl = navigator.platform;
			var ua = navigator.userAgent;

			if (undefined != pl)
			{
				/* windows or windows phone */
				if (pl.indexOf("Win") >= 0)
				{
					if (ua.indexOf("Windows Phone") >= 0)
					{
						this.windowsPhone = true;
						this.windows = true;
						this.portable = true;
					}
					else
					{
						this.windows = true;
						this.portable = false;
					}

					return;
				}

				/* nokia */
				if (ua.indexOf("NOKIA") >= 0)
				{
					this.nokia = true;
					this.portable = true;
					return;
				}

				/* android */
				if (ua.indexOf("Android") >= 0)
				{
					this.android = true;
					this.portable = true;
					return;
				}

				/* iPad */
				if (pl.indexOf("iPad") >= 0)
				{
					this.iPad = true;
					this.portable = true;
					return;
				}

				/* iPhone */
				if (pl.indexOf("iPhone") >= 0)
				{
					this.iPhone = true;
					this.portable = true;
					return;
				}

				/* iPod */
				if (pl.indexOf("iPod") >= 0)
				{
					this.iPod = true;
					this.portable = true;
					return;
				}

				/* Wii or PLASTATION which is under version three */
				if ((ua.indexOf("Wii") >= 0) || (ua.indexOf("PLASTATION") >= 0))
				{
					this.player = true;
					this.portable = true;
					return;
				}

				/* MacBook of apple */
				if (pl.indexOf("Mac") >= 0)
				{
					this.iMacPC = true;
					this.portable = false;
					return;
				}

				/* unix include Linux */
				if ((pl.indexOf("X11") >= 0) || ((pl.indexOf("Linux") >= 0) && (pl.indexOf("arm") < 0)))
				{
					this.unixPC = true;
					this.portable = false;
					return;
				}

				return;
			}
			else if (ua.indexOf("Android") >= 0)
			{
				this.android = true;
				this.portable = true;
				return;
			}
			else
			{
				if (document.body.clientWidth >= 1024 || document.body.clientHeight >= 1024)
				{
					this.portable = false;
				}
				else
				{
					this.portable = true;
				}

				return;
			}
		}
	};

	this.phoneSet = {
		bContinuePCSet:false,
		bPhoneWizardSet:false
	};

	OS.checkDeviceMode();
}

function AddNewDevice() {
	this.scanedExtList = [];
	this.pollStatusHd;
	this.gGetHyFiListHandler;
	this.bAddingExt = false;
	this.bIsInStepTwo = false;
	this.bExtScanned = false;		// 是否扫描到扩展器
	this.bStopScan = false;
	this.notSuccessExtNum = 0;
	this.scanedExtGrid = null;

	this.POLL_TIME = 2000;
	this.WAITING_ADD = "1";
	this.ADDING = "2";

	this.chgExtContent = function (con) {
		var popTitle;
		switch(con)
		{
			case "resetCon":
				id("noMyExt").style.display = "none";
				id("noneExt").style.display = "none";
				id("stepOne").style.display = "none";
				id("resetCon").style.display = "block";
				popTitle = id("popTitle");
				popTitle.innerHTML = label.resetRouter;
				this.scanedExtList = [];
				break;
			case "stepOne":
				id("stepOne").style.display = "block";
				id("resetCon").style.display = "none";
				id("toReset").style.display = "block";
				id("stepOneImg").src = "../web-static/images/power.png";
				id("stepOneLabel").innerHTML = label.addNewDevTips1;
				id("startScan").value = label.easyExtendPressed;
				popTitle = id("popTitle");
				popTitle.innerHTML = label.addNewDev;
				break;
			case "stepTwo":
				id("noneExt").style.display = "none";
				id("stepOne").style.display = "none";
				id("stepTwo").style.display = "block";
				break;
			case "stepThree":
				id("noMyExt").style.display = "none";
				id("stepTwo").style.display = "none";
				id("stepThree").style.display = "block";
				break;
			case "noMyExt":
				clearTimeout(this.gGetHyFiListHandler);
				clearTimeout(this.pollStatusHd);
				id("noMyExt").style.display = "block";
				id("stepThree").style.display = "none";
				id("resetCon").style.display = "none";
				break;
			case "finished":
				this.bIsInStepTwo = false;
				clearTimeout(this.pollStatusHd);
				clearTimeout(this.gGetHyFiListHandler);
				closeLoading();

				if (this.bExtScanned){
					if (this.notSuccessExtNum != 0) {
						showConfirm("添加超时，您有" + this.notSuccessExtNum + "个设备未添加成功，请点击【网络状态】界面右上角的“添加新路由”按钮，重新添加", function () {
							setVigNetCtlConDis(false);
							$("#hsConf input.cancel").first().css('display', 'inline');
						},"知道了");
					} else {
						showConfirm(label.addExtTimeoutAlert, function () {
							setVigNetCtlConDis(false);
							$("#hsConf input.cancel").first().css('display', 'inline');
						},"知道了");
					}
					$("#hsConf input.cancel").first().css('display', 'none');
				}
				else{
					id("noneExt").style.display = "block";
					id("stepTwo").style.display = "none";
				}
				break;
			default:
				break;
		}
	}

	this.addHyFi = function (index) {
		var data = {};

		bAddingExt = true;
		clearTimeout(gGetHyFiListHandler);

		data[uciPlc.fileName] = {};
		data[uciPlc.fileName][uciPlc.actionName.addExt] = {};
		data[uciPlc.fileName][uciPlc.actionName.addExt][uciPlc.optName.mac] = scanedExtList[index].mac;

		$.action(data, function(result){
			bAddingExt = false;
			gGetHyFiListHandler = $.setTimeout(getSearchHyFiList, POLL_TIME);
		});
	}

	this.pollSearchStatus = function () {
		var arg = {};
		arg[uciPlc.fileName] = {};
		arg[uciPlc.fileName][KEY_NAME] = [uciPlc.secName.scanExtStatus];
		$.query(arg, function(result){
			if (bStopScan) { //手动结束扫描，直接返回
				return;
			}
			if (ENONE == result[ERR_CODE]){
				var status = result[uciPlc.fileName][uciPlc.secName.scanExtStatus][uciPlc.optName.status];
				if (uciPlc.optValue.status.doing == status){
					pollStatusHd = $.setTimeout(pollSearchStatus, POLL_TIME);
				}
				else if(uciPlc.optValue.status.idle == status){
					chgExtContent("finished");
				}
				else{
					/* 异常情况 */
					chgExtContent("finished");
				}
			}
			else{
				/* 出错 */
				chgExtContent("finished");
			}
		});
	}

	this.getSearchHyFiList = function () {
		var arg = {};
		arg[uciPlc.fileName] = {};
		arg[uciPlc.fileName][KEY_TABLE] = uciPlc.secType.scannedExt;
		$.query(arg, function(result){
			if (bStopScan) { //手动结束扫描，直接返回
				return;
			}

			if (bAddingExt){
				return;
			}

			scanedExtList = formatTableData(result[uciPlc.fileName][uciPlc.secType.scannedExt]);
			id("scanedExtNum").innerHTML = scanedExtList.length;
			if (scanedExtList.length > 0) {
				bIsInStepTwo = false;
				closeLoading();
				bExtScanned = true;
				if (id("stepThree").style.display === "none") {
					id("stepTwo").style.display = "none";
					id("stepThree").style.display = "block";
					scanedExtGrid = new DataGrid();
					scanedExtGrid.init({
						id:"scanedExtTbl",						// table ID
						data:scanedExtList,							// 数据源
						classCol:{gridClassName:"dataGrid2"},
						paging:{num:7, page:1},
						head:[{field:"路由器名称", width:100},	// 表头选项
							{field:label.mac, width:60},
							{field:label.operation, width:60}],
						list:[{name:"name", maxSize:40},
							{name:"mac", type:"mac",maxSize:30},	// 数据列选项
							{name:"status", type:"btn", value:"", click:addHyFi, subType:"addExt"}],
						hasSelBox:false,
						checkIndex:1,
						edit:false,
						toolBar:{id:"refresh", refresh:null}
					});
				}

				notSuccessExtNum = 0;
				for (var i = 0; i < scanedExtList.length; i++) {
					if (scanedExtList[i].status != 0 && scanedExtList[i].status != 3) { //0为未添加状态，3为添加成功。除此之外的状态都为未添加成功
						notSuccessExtNum += 1;
					}
				}

				scanedExtList.sort(function(x, y){
					if (x.mac > y.mac) {
						return 1;
					} else {
						return -1;
					}
				});

				scanedExtGrid.setDataSource(scanedExtList);
				scanedExtGrid.refresh()
			}

			gGetHyFiListHandler = $.setTimeout(getSearchHyFiList, POLL_TIME);
		});
	}

	this.startScan = function () {
		var req = {};
		scanedExtList = [];
		this.bStopScan = false;
		clearTimeout(this.gGetHyFiListHandler);
		clearTimeout(this.pollStatusHd);

		req[uciPlc.fileName] = {};
		req[uciPlc.fileName][uciPlc.actionName.scanExt] = null;
		$.action(req, function(ret){
			if (ENONE == ret[ERR_CODE]){
				/* 轮询扫描状态 */
				pollStatusHd = $.setTimeout(pollSearchStatus, POLL_TIME);

				/* 获取扫描列表 */
				gGetHyFiListHandler = $.setTimeout(getSearchHyFiList, POLL_TIME);
			}
			else{
				chgExtContent("finished");
			}
		});
	}

	this.onStartScan = function () {
		chgExtContent("stepTwo");
		bIsInStepTwo = true;
		bExtScanned = false;
		startScan();
	}

	this.stopScan = function () {
		this.bStopScan = true;
		clearTimeout(this.gGetHyFiListHandler);
		clearTimeout(this.pollStatusHd);

		var data = {};
		data[uciPlc.fileName] = {};
		data[uciPlc.fileName][uciPlc.actionName.stopScanExt] = null;
		$.action(data);

		this.scanedExtList = [];
	}

	this.onFinish = function () {
		var bAddingExt = false;
		var notAddedExtNum = 0;
		for (var i = 0; i < scanedExtList.length; i += 1) {
			if (WAITING_ADD == scanedExtList[i].status ||
				ADDING == scanedExtList[i].status) {
				bAddingExt = true;
				break;
			}
			if ("0" == scanedExtList[i].status) {
				notAddedExtNum += 1;
			}
		}

		if (bAddingExt) {
			showConfirm(label.addingExtConfirm, function(isConfirm){
				if (!isConfirm) {
					stopScan();
					setVigNetCtlConDis(false);
				}
			}, btn.continueAdding, btn.finishAdding);
		} else if (notAddedExtNum !== 0){
			showConfirm(label.youHave + notAddedExtNum + label.hyfiNotAddAllTip, function(isConfirm){
				if (!isConfirm) {
					stopScan();
					setVigNetCtlConDis(false);
				}
			}, btn.continueAdding, btn.finishAdding);
		} else {
			stopScan();
			setVigNetCtlConDis(false);
		}
	}

	this.setVigNetCtlConDis = function (tag) {
		var vigNetControlCon = id("VigNetControlCon");
		if (true === tag)
		{
			showCoverB(function(){
				vigNetControlCon.style.visibility = "visible";
				vigNetControlCon.style.top = "100px";
			});
		}
		else
		{
			hideCoverB(function(){
				vigNetControlCon.style.visibility = "hidden";
				vigNetControlCon.style.top = "-9999px";
				emptyNodes(vigNetControlCon);
			});
		}
	}

	this.addChildRt =function (showResetTips) {
		var imgClass, labelText, buttonText;
		if(showResetTips === true) {
			imgClass = "resetImg";
			labelText = label.addNewDevResetTips;
			buttonText = label.alreadyDoThose;
		} else {
			imgClass = "powerImg";
			labelText = label.addNewDevTips1;
			buttonText = label.easyExtendPressed;
		}

		var divCon = id("VigNetControlCon");
		if (null == divCon)
		{
			divCon = document.createElement("div");
			divCon.className = "VigNetControlCon";
			divCon.id = "VigNetControlCon";
			document.body.appendChild(divCon);
		}
		else
		{
			emptyNodes(divCon);
		}

		divCon.innerHTML =
			'<div class="addNewDevDiv" id="addNewDevDiv">'+
				'<div class="popHd">' +
					'<i class="closeImg" id="closePop"></i>' +
					'<label id="popTitle" class="title">'+ label.addNewDev + '</label>' +
				'</div>' +
				'<div id="stepOne">' +
					'<div class="desCon" style="margin-right: 64px;">' +
						'<i id="stepOneImg" class="' + imgClass + '"></i>' +
						'<label id="stepOneLabel">'+ labelText + '</label>' +
					'</div>' +
					'<div class="desCon">' +
						'<i class="easyExtend"></i>' +
						'<label>' + label.addNewDevTips2 + '</label>' +
					'</div>' +
					'<input id="startScan" type="button" class="btnW" value="' + buttonText +'" style="margin: 40px auto 0;">' +
					'<input id="toReset" type="button" class="btnW" value="'+ label.routerBeenUsed + '" style="margin: 8px auto 0;background: #D9D9D9;">' +
					'<p>' + label.extNoFlashTip + '</p>' +
				'</div>' +
				'<div id="stepTwo">' +
					'<img src="../web-static/images/loadingRouteSet.gif">' +
					'<p>' + label.searching + '</p>' +
				'</div>' +
				'<div id="stepThree" style="display: none;">' +
					'<span class="devNum">' + label.discover + '<span id="scanedExtNum">0</span>' + label.discoverSuffix + '</span>' +
					'<input id="refresh" class="button" type="button" value="' + btn.refresh + '" style="float: right;">' +
					'<div>' +
						'<table id="scanedExtTbl" class=""></table>' +
						'<p id="showNoMyExt">' + label.noYourExt + '</p>' +
					'</div>' +
					'<div class="btnCon">' +
						'<input id="finish" class="button" type="button" value="' + btn.finish + '">' +
						'<input id="addAll" class="button" type="button" value="' + btn.addAll + '" style="margin-left: 24px;">' +
					'</div>' +
				'</div>' +
				'<div id="resetCon">' +
					'<img src="../web-static/images/reset.png">' +
					'<p class="resetTips">请按以下步骤将<span>待添加的路由器</span>恢复出厂设置：</p>' +
					'<p class="des">1.请确保待添加的路由器已上电。<br>2.长按待添加路由器的RESET键3秒，直到指示灯快闪，路由器开始恢复出厂设置。<br>3.路由器恢复出厂设置成功后，设备指示灯会快闪2秒。<br>4.请避免将直接连接到猫或入户网口的路由器恢复出厂设置。</p>' +
					'<input id="toStepOne" type="button" class="btnW" value="我已将路由器恢复出厂设置" style="margin: 30px auto 0;">' +
					'<input id="goBack" type="button" class="btnW" value="返回" style="margin: 8px auto 0;background: #D9D9D9;">' +
				'</div>' +
				'<div id="noneExt">' +
					'<p class="tips">未发现可添加的路由器</p>' +
					'<p class="des">1.请确认您已按下待添加路由器的“易展”按键。<br>2.若您已多次按下“易展”按键，仍无法添加，<br>请将待添加的路由器<span id="resetSpan">恢复出厂设置</span>。</p>' +
					'<input id="searchAgain" type="button" class="btnW" value="重新搜索" style="margin: 30px auto 0;">' +
				'</div>'+
				'<div id="noMyExt">' +
					'<p class="tips">未发现您的路由器？</p>' +
					'<p class="des">1.请确认您已按下待添加路由器的“易展”按键。<br>2.若您已多次按下“易展”按键，仍无法添加，<br>请将待添加的路由器<span id="resetSpan1">恢复出厂设置</span>。</p>' +
					'<input id="toStepThree" type="button"class="btnW"  value="返回" style="margin: 30px auto 0;">' +
				'</div>'+
			'</div>';

		if (showResetTips === true) {
			id("toReset").style.display = "none";
		} else {
			id("toReset").style.display = "block";
		}
		id("startScan").onclick = onStartScan;
		id("searchAgain").onclick = onStartScan;
		id("closePop").onclick = function(){
			if (bIsInStepTwo) {
				showConfirm(label.discoveringExtConfirm, function(isConfirm) {
					if (isConfirm) {
						stopScan();
						setVigNetCtlConDis(false);
					}
				});
			} else {
				onFinish();
			}
		};
		id("finish").onclick = onFinish;
		id("refresh").onclick = function () {
			var bAdding = false;
			for (var i = 0; i < scanedExtList.length; i += 1) {
				if (scanedExtList[i].status == ADDING ||
					scanedExtList[i].status == WAITING_ADD ) {
					bAdding = true;
					break;
				}
			}

			if (bAdding) {
				showConfirm(label.refreshExtConfirm, function(isConfirm) {
					if (isConfirm) {
						startScan();
						showLoading(label.refreshing, undefined, undefined, false);
					}
				});
			} else {
				startScan();
				showLoading(label.refreshing, undefined, undefined, false);
			}
		};
		id("addAll").onclick = function () {
			var inputArr;
			var macArr = [];
			for (var i = 0; i < scanedExtList.length; i+=1) {
				if ("0" == scanedExtList[i].status) {
					macArr.push(scanedExtList[i].mac);
				}
			}

			bAddingExt = true;
			clearTimeout(gGetHyFiListHandler);

			var data = {};
			data[uciPlc.fileName] = {};
			data[uciPlc.fileName][uciPlc.actionName.addExt] = {};
			data[uciPlc.fileName][uciPlc.actionName.addExt][uciPlc.optName.mac] = macArr;

			$.action(data, function(){
				bAddingExt = false;

				inputArr = $("#scanedExtTbl input");
				for (i = 0; i < inputArr.length; i+=1) {
					if ("classNameBtn" === inputArr[i].className) {
						inputArr[i].className = "classNameLoading";
						inputArr[i].value = "";
					}
				}

				gGetHyFiListHandler = $.setTimeout(getSearchHyFiList, POLL_TIME);
			});
		};
		id("toReset").onclick = function () {
			chgExtContent("resetCon");
			id("goBack").onclick = function () {
				chgExtContent("stepOne");
			};
		};
		id("resetSpan").onclick = function () {
			chgExtContent("resetCon");
			id("goBack").onclick = function () {
				id("noneExt").style.display = "block";
				id("resetCon").style.display = "none";
			};
		};
		id("resetSpan1").onclick = function () {
			chgExtContent("resetCon");
			id("goBack").onclick = function () {
				chgExtContent("noMyExt");
			};
		};
		id("toStepOne").onclick = function () {
			chgExtContent("stepOne");
		};
		id("showNoMyExt").onclick = function (){
			chgExtContent("noMyExt");
		};
		id("toStepThree").onclick = function () {
			chgExtContent("stepThree");
			/* 轮询扫描状态 */
			pollStatusHd = $.setTimeout(pollSearchStatus, 0);

			/* 获取扫描列表 */
			gGetHyFiListHandler = $.setTimeout(getSearchHyFiList, 0);
		};

		/* 弹出扩展器添加框 */
		setVigNetCtlConDis(true);
	}
}

function RouterRelayConflict() {
	this.transRoleName = function (role, hasWanPhy, targetSysMode, isCap){
		var roleType = role.slice(0,3).toUpperCase();
		var roleName = "";
		switch(roleType){
			case "WAN":
				roleName = role.toUpperCase();
				break;
			case "LAN":
				//phy_info中没有WAN口 且 CAP 且 从中继切换到路由模式
				if (isCap && !hasWanPhy && targetSysMode == uciSystem.optValue.sysMode.routerMode) {
					roleName = "WAN/LAN";
				} else {
					roleName = role.toUpperCase();
				}
				break;
			case "DOW":
				roleName = "IPTV口";
				break;
			case "IPT":
				roleName = "IPTV口";
				break;
			case "LAG":
				roleName = "聚合口";
				break;
			case "GAM":
				roleName = "游戏专用口";
				break;
			case "UPL":
				roleName = "IPTV上联口";
				break;
			default:
				roleName = "LAN";
				break;
		}
		return roleName;
	};

	this.initPortData = function (phyInfoList, portData, targetSysMode, isCap){
		var i = 0;
		var hasWanPhy = false;		//有role为WAN的phy
		for(i = 0; i < phyInfoList.length; i++) {
			var roleType = phyInfoList[i]["role"].slice(0,3).toUpperCase();
			if (roleType == 'WAN') {
				hasWanPhy = true;
				break;
			}
		}

		for(i = 0; i < phyInfoList.length; i++) {
			portData[i] = {};
			portData[i].state = "disable";
			portData[i].name = transRoleName(phyInfoList[i]["role"], hasWanPhy, targetSysMode, isCap);
		}
	};

	this.showAlertDialog = function (innerHTML, callback) {
		var divCon = id("VigNetControlCon");
		if(divCon == null){
			divCon = document.createElement("div");
			divCon.className = "VigNetControlCon";
			divCon.id = "VigNetControlCon";
			document.body.appendChild(divCon);
		}else{
			emptyNodes(divCon);
		}
		divCon.innerHTML = innerHTML;
		var niceScroll = new NiceScroll("popCon");
		niceScroll.scrollTipOpacity(1);
		niceScroll.scrollTipSet({"background":"#E6E6E6"});
		niceScroll.scrollBarSet({zIndex:1010});
		niceScroll.init();
		callback();

		id("closePop").onclick = function() {
			setVigNetCtlConDis(false);
		};
		id("cancel").onclick = function() {
			setVigNetCtlConDis(false);
		};

		setVigNetCtlConDis(true);
	};

	this.generatePortLayout = function (targetSysMode, routerArr) {
		$.action({"port_manage":{"get_new_dev_info":{"sys_mode":targetSysMode}}}, function(result) {
			var deviceList = result.dev_info;
			for(var i = 0; i < deviceList.length; i++) {
				if (deviceList[i].phy_info.length == 0) continue;

				var isCap = deviceList[i].cap == 1;
				var portArr = [];
				initPortData(deviceList[i].phy_info, portArr, targetSysMode, isCap);

				var router = {};
				router.portArr = portArr;
				router.name = deviceList[i].name;
				router.powerPos = deviceList[i].power_pos;

				//CAP在第一行显示
				if(isCap) {
					routerArr.unshift(router);
				} else {
					routerArr.push(router);
				}
			}
		}, false);
	};

	this.changeSysModeAlert = function (opreate, targetSysMode, callback) {
		var hdTitle;
		var routerArr = [];
		var portCfgText = "";
		var changeModeTips = "";
		var bShowUnavailable = true;
		var bPortLayoutChanged = true;

		if (gSupportPortManage) {
			generatePortLayout(opreate == 'close' ? uciSystem.optValue.sysMode.routerMode : targetSysMode, routerArr);
		}

		if (0 == routerArr.length) {
			//routerArr为空 且 中继切换至路由模式时，不用弹框
			//opreate为close时，也是从中继模式切换至路由模式
			if (opreate == 'close' || uciSystem.optValue.sysMode.routerMode == targetSysMode) {
				callback();
				return;
			}

			bPortLayoutChanged = false;
		}

		switch (opreate) {
			case "switch":
				hdTitle = "切换上网方式";
				if (uciSystem.optValue.sysMode.routerMode == targetSysMode) {
					changeModeTips = "切换上网方式后，路由器端口配置会发生变化，确定切换吗？";
					bShowUnavailable = false;
				} else {
					changeModeTips = "切换为" + (uciSystem.optValue.sysMode.apMode == targetSysMode ? "AP（有线中继）" : "桥接（无线中继）") + "后，部分功能将无法使用" + (bPortLayoutChanged ? '，且路由器端口配置会发生变化' : '') + "。确定切换吗？";
				}
				break;
			case "open":
				hdTitle = "开启" + (uciSystem.optValue.sysMode.apMode == targetSysMode ? "AP（有线中继）" : "桥接（无线中继）");
				changeModeTips = "开启" + (uciSystem.optValue.sysMode.apMode == targetSysMode ? "AP（有线中继）" : "桥接（无线中继）") + "后，部分功能将无法使用" + (bPortLayoutChanged ? '，且路由器端口配置会发生变化' : '') + "。确定开启吗？";
				break;
			case "close":
				hdTitle = "关闭" + (uciSystem.optValue.sysMode.apMode == targetSysMode ? "AP（有线中继）" : "桥接（无线中继）");
				changeModeTips = "关闭" + (uciSystem.optValue.sysMode.apMode == targetSysMode ? "AP（有线中继）" : "桥接（无线中继）") + "后，路由器端口配置会发生变化。确定关闭吗？";
				bShowUnavailable = false;
				break;
			default:
				break;
		}

		if (gMulWanSupport && gIptvSupport) {
			portCfgText = "端口功能自定义（双WAN口、IPTV口不可用）、";
		} else if (gMulWanSupport) {
			portCfgText = "端口功能自定义（双WAN口不可用）、";
		} else if (gIptvSupport) {
			portCfgText = "端口功能自定义（IPTV口不可用）、";
		}

		var innerHTML = '<div class="relayAlertCon">' +
			'<div class="popHd">' +
				'<i class="closeImg" id="closePop"></i>' +
				'<label id="popTitle" class="title">'+ hdTitle + '</label>' +
			'</div>' +
			'<div class="popCon" id="popCon">' +
				'<p>' + changeModeTips + '</p>' +
				'<div id="unavailableDiv">' +
					'<p class="unavailable">不可用功能：</p>' +
					'<p>' + 'LAN口设置、' + portCfgText + (gIpv6Support ? 'IPv6设置、' : '') + 'DHCP服务器、DDNS、DMZ主机、IP与MAC绑定、虚拟服务器。' + '</p>' +
				'</div>' +
				'<div class="portLayoutDiv">' +
					'<p class="portTips">路由器端口配置将变为：</p>' +
				'</div>' +
			'</div>' +
			'<div class="popFoot">' +
				'<input id="changeMode" type="button" value="确定" class="btnA subBtn" />' +
				'<input id="cancel" type="button" value="取消" class="btnA subBtn cancel" />' +
			'</div>';
		showAlertDialog(innerHTML, function() {
			id("changeMode").onclick = function() {
				callback();
				setVigNetCtlConDis(false);
			};

			if (!bShowUnavailable) {
				$("#unavailableDiv").hide();
			}

			if (0 == routerArr.length) {
				$(".portLayoutDiv").hide();
			} else {
				for (var i = 0; i < routerArr.length; ++i) {
					$(".portLayoutDiv").append('<p style="margin: 8px auto;">'+ routerArr[i].name + '</p><div class="portLayoutContainer' + i + '" style="margin-bottom: 24px;"></div>');
					var portLayoutConf = new PortConfig();
					var portInitData = {
						element: $('.portLayoutContainer' + i)[0],
						type: 'setting',
						port: routerArr[i].portArr,
						powerPos: routerArr[i].powerPos,
						callback: null
					};
					portLayoutConf.init(portInitData);
				}
			}
		});
	};
}

function MeshHelp() {
	this.setMeshHelpConDisplay = function(tag) {
		var vigNetControlCon = id("meshHelpCon");
		if (true === tag)
		{
			showCoverB(function(){
				vigNetControlCon.style.visibility = "visible";
				vigNetControlCon.style.top = "100px";
			});
		}
		else
		{
			hideCoverB(function(){
				vigNetControlCon.style.visibility = "hidden";
				vigNetControlCon.style.top = "-9999px";
				emptyNodes(vigNetControlCon);
			});
		}
	}

	this.showMeshHelpDialog = function() {
		var divCon = id("meshHelpCon");
		if (null == divCon)
		{
			divCon = document.createElement("div");
			divCon.className = "VigNetControlCon";
			divCon.id = "meshHelpCon";
			document.body.appendChild(divCon);
		}
		else
		{
			emptyNodes(divCon);
		}

		divCon.innerHTML =
			'<div class="meshHelpDiv">'+
				'<div class="popHd">' +
					'<i class="closeImg" id="closePop"></i>' +
				'</div>' +
				'<div class="popBody">' +
					'<p>本路由器可作为“易展”子路由器扩展现有无线网络：</p>' +
					'<div class="desCon" style="margin-right: 64px;">' +
						'<i class="resetIcon"></i>' +
						'<label>先将本路由器恢复至出厂状态（按住“Reset按键”直到系统指示灯闪烁后松开）。</label>' +
					'</div>' +
					'<div class="desCon">' +
						'<i class="meshButton"></i>' +
						'<label>本路由器恢复出厂状态后，分别按下前端“易展”主路由器和本路由器的“易展”按键进行组网配对。</label>' +
					'</div>' +
				'</div>' +
			'</div>';
		id("closePop").onclick = function(){
			setMeshHelpConDisplay(false);
		};
		setMeshHelpConDisplay(true);
	}
}

(function(){
	Phone.call(window);
	Tool.call(window);
	PageFunc.call(window);
	Cover.call(window);
	Explorer.call(window);
	LocalStorageSD.call(window);
	HighSet.call(window);
	Basic.call(window);
	ShowTips.call(window);
	Select.call(window);
	LanDetect.call(window);
	ProgressBar.call(window);
	Help.call(window);
	BlockGrid.call(window);
	TimeControlSet.call(window);
	Slp.call(window);
	CloudUpgradePush.call(window);
	CloudAction.call(window);
	CloudCommon.call(window);
	AddNewDevice.call(window);
	RouterRelayConflict.call(window);
	MeshHelp.call(window);
})();
