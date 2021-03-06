function DataGrid()
{
	this._ops = {
		id:"",					// table ID
		obj:null,				// table obj
		data:null,				// 数据源
		head:null,				// 表头选项
		list:null,				// 数据列选项
		toolBar:null,			// 功能区
		tdStyles:null,			// 额外的样式
		paging:{num:8, page:1},	// 分页选项
		edit:true,				// 是否可编辑
		click:null,				// 表格不可编辑时指定的点击响应函数
		fixed:false,			// 表格是否宽度固定
		bdCollapse:true,		// 表格的边是否塌陷
		headpadding:"0px",		// 表格头部高度
		checkIndex:0,			// 检查数据是否为空的index
		max:7992,				// 表格中最大的条目数
		cleanTip:"",			// 表格清空时的提示语
		pageTurnFunc:null,		// 分页跳转的回调
		hasID:false,			// 是否有ID列
		hasHead:true,			// 表格是否有表头
		hasSelBox:true,			// 是否有checkbox可选列
		spBlank:false,			// 是否支持显示空行：“您请求的数据为空”
		spAutoEdit:false,		// 是否支持自动切换编辑列
		sortFunc:null,			// 排序的回调函数
		sortType:"down",		// 排序的类型
		sortName:"",			// 排序的数据的name
		niceScroll:null,		// 表格所在区域的scroll控件
		selAllHd:null,			// 全选和取消全选的回调处理函数，处理某个条目是否被全选
		IDWidth: false,			// 勾选框的宽度是否需要重新设置
		classCol:{gridClassName:"dataGrid", 			// 表格的相关样式类的集合
				  gridPageListClassName:"pageListPo",
				  ListSpanClassName:"ListSpan",
				  headClassName:"dataGrid_header_tr"}
	};
	this._table = null;		// 用于记录当前的table的dom对象
	this._list = {	// 用于记录分页（list）的参数
		id:"",
		obj:""
	};
	this._set =	{	// 用于记录设置信息
		IDWidth: "50px",
		editWidth:"92px"
	};
	this._event = {
		editTr:-1,			// 用于记录处于编辑状态的tr（包括新添加的）
		sortName:"",		// 用于记录用于排序的数据名字
		sortable:false,		// 是否有可排序的列
		state:"default"		// default、edit、add
	};
	this._state = {
		isBlank:false,	// 用于记录表格是否为空
		colNum:0,
		headCells:[{width:0}],
		headWidth:0			// 存储表头的每个cell的width之和
	};
	this._types = {		// 标记列的类型
		str:"",
		ip:"0.0.0.0",
		mask:"0.0.0.0",
		dns:"0.0.0.0",
		gateway:"0.0.0.0",
		mac:"00-00-00-00-00-00"
	};
	this._pgList = {
		id:"",
		obj:"",
		num:5,
		page:1,					// 当前显示的页码
		listMarginLeft:25,
		macAddrIdPre:"macAddr",
		ipAddrIdPre:"ipAddr",
		selectPre:"selConGrid",
		listDivStr:"listDiv",
		listArrowLStr:"listArrowL",
		listArrowRStr:"listArrowR",
		ListSpanClassName:"ListSpan",
		ListSpanSClassName:"listSpanS",
		plcClassName:"pageListContent"
	};
	this._toolBar = {
		delSelBtn:null,
		clrSelBtn:null
	};

	if (typeof DataGrid.prototype.init != "function")
	{
		/* DataGrid初始化 */
		DataGrid.prototype.init = function(options){
			this._optionsInit(options);
			this._create();
		};

		/* 获取当前显示的页码 */
		DataGrid.prototype.getPageNum = function(){
			return this._pgList.page;
		};

		/* 获取分页表格每页的数据条目数 */
		DataGrid.prototype.getNumPerPage = function(){
			return this._ops.paging.num;
		};

		/* 获取当前数据源中数据长度 */
		DataGrid.prototype.getDataLen = function(){
			return this._getListLen();
		};

		/* 刷新表格 */
		DataGrid.prototype.refresh = function(pageNum){
			if (pageNum == undefined)
			{
				pageNum = 1;
			}

			this._refresh(pageNum);
		};

		/* 刷新单个页面数据 */
		DataGrid.prototype.refreshPage = function(data, dataLen, pageNum){
			if (dataLen == undefined)
			{
				dataLen = 0;
			}

			if (pageNum == undefined)
			{
				pageNum = 1;
			}

			if (data instanceof Array && dataLen >= data.length)
			{
				var list = this._ops.list;
				var name = list[this._ops.checkIndex].name;
				var dataSource = new Array(dataLen);
				var num = this._ops.paging.num;
				var shift = dataLen - (pageNum - 1) * num - data.length;

				/* 填充必要数据 */
				for (var i = 0; i < dataLen; i++)
				{
					if (i >= shift && i - shift < data.length)
					{
						dataSource[i] = data[i - shift];
					}
					else
					{
						dataSource[i] = {};
						dataSource[i][name] = " ";	// 赋值无具体含义，仅保证name有值即可
					}
				}

				this.setDataSource(dataSource);
			}

			this._refresh(pageNum);
		};

		/* 重定向数据源的接口 */
		DataGrid.prototype.setDataSource = function(dataSource){
			if (dataSource instanceof Array)
			{
				this._ops.data = dataSource;
			}
		};

		/* 获取正在被“编辑”或是“添加”的数据的行 */
		DataGrid.prototype.getActiveTr = function(){
			return this._getEditTr();
		};

		/* 获取正在被“编辑”或是“添加”的数据的行号 */
		DataGrid.prototype.getActiveTrIndex = function(){
			return this._getTrIndex(this._getEditTr());
		};

		/* 设置和创建表格 */
		DataGrid.prototype._create = function(){
			/* get the target table object */
			this._getTableObj();
			if (this._table == null)
			{
				return;
			}

			/* set tool bar */
			this._setToolBar();

			/* set target table */
			this._tableSet();

			/* create table head if needed */
			this._headCreate();

			/* create table table content */
			this._contentCreate(this._ops.paging.page);

			this._flushBtn();
		};

		/* 设置this._event.state的处理函数  */
		DataGrid.prototype._eventStateSet = function(state, forced){
			if (true != forced && this._event.state != "default")
			{
				return false;
			}

			this._event.state = state;
			return true;
		};

		/* 获取this._event.state的处理函数  */
		DataGrid.prototype._eventStateGet = function(){
			return this._event.state;
		};

		/* 获取处于编辑状态的tr */
		DataGrid.prototype._getEditTr = function(){
			return this._event.editTr;
		};

		/* 存储处于编辑状态的tr */
		DataGrid.prototype._setEditTr = function(tr){
			this._event.editTr = tr;
		};

		/* 获取空的数据对象 */
		DataGrid.prototype._getBlankDataObj = function(data){
			var list = this._ops.list;
			var dataObj = this._ops.data;

			for(var item in list)
			{
				data[list[item].name] = "";
			}
		};

		/* 以编辑状态填充tr的IP地址输入框 */
		DataGrid.prototype._fillEditRow_IP = function(td, itemIndex, index, value, listObj){
			var input = el("input");
			input.className = "ipInput text";
			input.id = this._pgList.ipAddrIdPre + itemIndex + this._ops.id + index;
			input.style.textAlign = "center";

			/* 如果有值传入，则进行初始化赋值 */
			if (value != undefined && value.length != 0)
			{
				input.value = value;
			}

			input.maxLength = listObj.maxLength ? listObj.maxLength : 15;
			if (undefined != listObj.size)
			{
				input.size = listObj.size;
			}

			td.appendChild(input);
		};

		/* 以编辑状态填充tr的IPs地址输入框 */
		DataGrid.prototype._fillEditRow_IPs = function(td, itemIndex, index, dataObj, listObj){
			var names = listObj.name.split(" "), label, br;
			var div = createAddrDiv(this._pgList.ipAddrIdPre + "Div" + itemIndex + this._ops.id + index + names[0]);
			td.appendChild(div);
			genAddrInput(div.id, this._pgList.ipAddrIdPre + itemIndex + this._ops.id + index + names[0], ipStr, dataObj[names[0]], smallAddrInputClassType);
			label = el("label");
			label.innerHTML = "-";
			td.appendChild(label);
			setStyle(label, {"cssFloat":"left", width:"5px", lineHeight:"18px", height:"10px", margin:"0px 0px 0px 1px"});
			div = createAddrDiv(this._pgList.ipAddrIdPre + "Div" + itemIndex + this._ops.id + index + names[1]);
			td.appendChild(div);
			genAddrInput(div.id, this._pgList.ipAddrIdPre + itemIndex + this._ops.id + index + names[1], ipStr, dataObj[names[1]], smallAddrInputClassType);
		};

		/* 以编辑状态填充tr的MAC地址输入框 */
		DataGrid.prototype._fillEditRow_MAC = function(td, itemIndex, index, value, listObj){
			var input = el("input");
			input.className = "ipMac text";
			input.id = this._pgList.macAddrIdPre + itemIndex + this._ops.id + index;
			input.style.textAlign = "center";

			/* 如果有值传入，则进行初始化赋值 */
			if (value != undefined && value.length != 0)
			{
				input.value = value.toUpperCase();
			}

			input.maxLength = listObj.maxLength ? listObj.maxLength : 17;
			if (undefined != listObj.size)
			{
				input.size = listObj.size;
			}

			td.appendChild(input);
		};

		/* 以编辑状态填充tr的Select输入框 */
		DataGrid.prototype._fillEditRow_Select = function(td, itemIndex, index, value, listObj, appSelect){
			var gridSelCon = el("div");
			var selCon = el("span");
			var selValCon = el("span");
			var arrow = el("i");
			var selId = this._pgList.selectPre + itemIndex + this._ops.id + index;
			var selWidth, blankWidth = 13;

			gridSelCon.className = "gridSelectCon " + listObj.className;
			td.appendChild(gridSelCon);

			selCon.id = selId;
			selCon.className = "select";
			gridSelCon.appendChild(selCon);

			selValCon.className = "value hsGridValue";
			selCon.appendChild(selValCon);

			arrow.className = "arrow";
			selCon.appendChild(arrow);

			selWidth = gridSelCon.offsetWidth - arrow.offsetWidth -
					   blankWidth - parseInt(getNodeDefaultView(selCon, "marginLeft"));

			selValCon.style.width = selWidth + "px";

			if (undefined == value || value.length == 0)
			{
				value = (listObj.defaultValue == undefined ? 0 : listObj.defaultValue);
			}

			if (appSelect)
			{
				selectInitExtern(selId, listObj.options, value, listObj.func, listObj.maxSelSize);
			}
			else
			{
				selectInit(selId, listObj.options, value, listObj.func, listObj.maxSelSize);
			}
		};

		/* 以编辑状态填充tr的Checkbox输入框 */
		DataGrid.prototype._fillEditRow_Checkbox = function(td, itemIndex, index, value, listObj){
			var input = el("input");
			input.type = "checkbox";
			input.className = "";
			td.appendChild(input);

			/* 如果有值传入，则进行初始化赋值 */
			if (value != undefined && value.length != 0)
			{
				input.checked = (value == true);
			}
		};

		/* 以编辑状态填充tr的Radio地址输入框 */
		DataGrid.prototype._fillEditRow_Radio = function(td, itemIndex, index, value, listObj){
			var input = el("input");
			input.type = "radio";
			input.className = "";
			td.appendChild(input);
			/* 如果有值传入，则进行初始化赋值 */
			if (value != undefined && value.length != 0)
			{
				input.checked = (value == true);
			}
		};

		/* 以编辑状态填充tr的ports输入框 */
		DataGrid.prototype._fillEdit_Ports = function(td, itemIndex, index, dataObj, listObj){
			var value, names = listObj.name.split(" ");
			var temp = dataObj[names[0]];

			if (typeof temp != "undefined")
			{
				if (dataObj[names[1]] != temp)
				{
					value = temp + "-" + dataObj[names[1]];
				}
				else
				{
					value = temp;
				}
			}

			this._fillEditRow_Str(td, itemIndex, index, value, listObj);
		};

		/* 创建单元格中输入框 */
		DataGrid.prototype._fillEditRow_Input = function(td, value, listObj, inputWidth){
			var input = el("input");

			input.className = "text";
			input.style.textAlign = "center";
			input.style.width = inputWidth == undefined ? "" : (inputWidth + "px");
			td.appendChild(input);

			/* 如果有值传入，则进行初始化赋值 */
			if (value != undefined && value.length != 0)
			{
				input.value = value;
			}
			if (listObj.maxLength != undefined)
			{
				input.maxLength = listObj.maxLength;
			}
			if (listObj.size != undefined)
			{
				input.size = listObj.size;
			}

			return input;
		};

		/* 以编辑状态填充tr的Str输入框 */
		DataGrid.prototype._fillEditRow_Str = function(td, itemIndex, index, value, listObj){
			var padding = parseInt(getNodeDefaultView(td, "paddingLeft")) + parseInt(getNodeDefaultView(td, "paddingRight"));
			var inputWidth = td.offsetWidth - padding - 40;

			this._fillEditRow_Input(td, value, listObj, inputWidth);
		};

		/* 以编辑状态填充tr的speed输入框 */
		DataGrid.prototype._fillEditRow_Speed = function(td, itemIndex, index, value, listObj){
			var label = el("label"), inputWidth, unit, fontSizeLbl = "10px", input, tdWidth;
			var padding = parseInt(getNodeDefaultView(td, "paddingLeft")) + parseInt(getNodeDefaultView(td, "paddingRight"));

			/* 设置速度单位 */
			unit = (listObj.unit == undefined ? " KB/s" : " "+listObj.unit);
			label.innerHTML = unit;

			label.style.fontSize = fontSizeLbl;
			tdWidth = td.offsetWidth;
			input = this._fillEditRow_Input(td, value, listObj);
			td.appendChild(label);
			inputWidth = tdWidth - padding - 40 - label.offsetWidth;
			input.style.width = inputWidth + "px";
		};

		DataGrid.prototype._fillEditRow_PopVig = function(td, itemIndex, index, valueIndex, listObj){
			var span, input, popObj = listObj.popObj;
			var showSize, value;

			if (valueIndex.length == 0)
			{
				input = el("input");
				input.className = "popVigBtn";
				input.value = btn.config;
				input.type = "button";
				input.onclick = function(){
					listObj.click(itemIndex);
				};
				td.appendChild(input);
			}
			else
			{
				/* added by songkaiqiang */
				if (!/^\d+$/.test(valueIndex))
				{
					for (var i in popObj.subList)
					{
						if (popObj.subList[i][".name"] == valueIndex)
						{
							valueIndex = i;
							break;
						}
					}
				}

				span = el("span");
				span.className = "dataGridPopVigDes";
				value = (popObj.subList[valueIndex])[popObj.name];
				span.title = value;
				showSize = this._calcShowSize(index, listObj);
				value = getStrInMax(value, showSize);
				span.innerHTML = htmlEscape(value);
				span.onclick = function(){
					listObj.click(itemIndex);
				};
				td.appendChild(span);
				td.setAttribute(popObj.indexDes, valueIndex);
			}
		};

		/*begin added by LiGuanghua : for type path */
		DataGrid.prototype._fillEditRow_Path = function(td, itemIndex, index, value, listObj){
			var span, input, obj = this, tr, indexInDataObj;

			tr = obj._getEditTr();
			indexInDataObj = obj._getTrIndexInDataObj(tr);

			if (value.length == 0)
			{
				input = el("input");
				input.className = "popVigBtn";
				input.value = btn.config;
				input.type = "button";
				input.onclick = function(){
					listObj.click(indexInDataObj);
				};
				td.appendChild(input);
			}
			else
			{
				span = el("span");
				span.className = "dataGridPopVigDes";
				span.title = value;
				span.innerHTML = htmlEscape(getStrInMax(value, 32));
				span.onclick = function(){
					listObj.click(indexInDataObj);
				};
				td.appendChild(span);
			}
		};
		/*end added by LiGuanghua : for type path */

		/* 添加“取消”和“保存”按钮在新添加的行上 */
		DataGrid.prototype._fillEditRow_EditBtns = function(dataObj, td, index){
			var save = document.createElement("input");
			var cancel = document.createElement("input");
			var toolBar = this._ops.toolBar;

			save.className = "edit editL";
			save.type = "button";
			save.value = btn.gridSave;
			this._toolSaveHandle(save, toolBar["save"], toolBar["asyn"]);
			cancel.className = "edit";
			cancel.type = "button";
			cancel.value = btn.gridCancel;
			this._toolCancelHandle(cancel);
			td.appendChild(save);
			td.appendChild(cancel);
		};

		/* 以编辑状态填充tr */
		DataGrid.prototype._fillEditRow = function(tr, itemIndex, data){
			var list = this._ops.list, item, value, type, name;
			var td, input, obj = this;

			this._setEditTr(tr);

			/* 判断是否需要选择列 */
			if (this._ops.hasSelBox == true)
			{
				td = tr.insertCell(-1);
				input = document.createElement("input");
				input.type = "checkbox";
				input.onclick = function(){
					obj._singelSelHandle(input, obj);
				};
				td.appendChild(input);

				if (this._ops.hasHead == false)
				{
					setStyle(td, {width:this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth});
				}
			}

			if (this._ops.hasID == true)
			{
				/* 生成ID列 */
				td = tr.insertCell(-1);
				td.innerHTML = this._getListLen() - itemIndex;
			}

			for (var index in list)
			{
				td = tr.insertCell(-1);
				item = list[index];
				type = item.type;
				value = data[item.name];

				/* 不可编辑的列直接显示 */
				if (item.edit == false)
				{
					td.innerHTML = value ? value : "";
					continue;
				}

				switch (type)
				{
				case "btn":
					break;
				case "mask":
				case "dns":
				case "gateway":
				case "ip":
					this._fillEditRow_IP(td, itemIndex, index, value, item);
					break;
				case "mac":
					this._fillEditRow_MAC(td, itemIndex, index, value, item);
					break;
				case "select":	// select 的组织形式是：options:[{str:"xx", value:"xx"}], func:onchangeHandle
					this._fillEditRow_Select(td, itemIndex, index, value, item);
					break;
				case "selectApp":	// select 的组织形式是：options:[{str:"xx", value:"xx"}], func:onchangeHandle
					this._fillEditRow_Select(td, itemIndex, index, value, item, true);
					break;
				case "checkbox":
					this._fillEditRow_Checkbox(td, itemIndex, index, value, item);
					break;
				case "radio":
					this._fillEditRow_Radio(td, itemIndex, index, value, item);
					break;
				case "ports":
					this._fillEdit_Ports(td, itemIndex, index, data, item);
					break;
				case "ips":
					this._fillEditRow_IPs(td, itemIndex, index, data, item);
					break;
				case "speed":
					this._fillEditRow_Speed(td, itemIndex, index, value, item);
					break;
				case "popVig":
					this._fillEditRow_PopVig(td, itemIndex, index, value, item);
					break;
				/*begin added by LiGuanghua : for type path */
				case "path":
					this._fillEditRow_Path(td, itemIndex, index, value, item);
					break;
				/*end added by LiGuanghua : for type path */
				case "time":
				case "timeP":
				case "str":
				default:
					this._fillEditRow_Str(td, itemIndex, index, value, item);
					break;
				}
			}

			/* 判断是否需要编辑列 */
			if (this._ops.edit == true)
			{
				/* 生成编辑列 */
				td = tr.insertCell(-1);
				this._fillEditRow_EditBtns(data, td, itemIndex);

				if (this._ops.hasHead == false)
				{
					setStyle(td, {width:this._set.editWidth});
				}
			}
		};

		/* 获取tr的dataObj的index值  */
		DataGrid.prototype._getTrIndexInDataObj = function(tr){
			var index = this._getTrIndex(tr);
			var datalen = this._getDRL() - 1;

			if (-1 == index)
			{
				return index;
			}

			index = (this._ops.hasHead == true ? (index - 1) : index);
			index = datalen - index;

			return index;
		};

		/* 重新设置tr的ID值  */
		DataGrid.prototype._resetID = function(){
			var rows = this._table.rows;
			var len = rows.length;
			var idIndex = 0, start = 0;
			var state = this._eventStateGet();
			var td;

			if (this._ops.hasID == false)
			{
				return;
			}

			idIndex = (this._ops.hasSelBox == true ? 1 : 0);
			if (this._ops.hasHead == true)
			{
				start++;
				len--;
			}

			if ("add" == state)
			{
				start++;
				len--;
			}

			for (var i = 0; i < len; i++)
			{
				td = rows[i + start].cells[idIndex]
				if (undefined == td)
				{
					continue;
				}

				td.innerHTML = i + 1;
			}
		};

		/* 获取表格中数据的个数，_getDataRowLength  */
		DataGrid.prototype._getDRL = function(){
			return (this._ops.hasHead == true ? (this._table.rows.length - 1) : this._table.rows.length);
		};

		/* 表格变动，则更新按钮的状态 */
		DataGrid.prototype._flushBtn = function(){
			var dataNum = this._getDRL();
			var btn;

			btn = this._toolBar.addBtn;
			if (btn != null)
			{
				btn.className = (this._ops.max == dataNum ? "addUn" : "add");
			}

			btn = this._toolBar.delAllBtn;
			if (btn != null)
			{
				btn.className = (dataNum > 0 ? "delAll" : "delAllUn");
			}
		};

		/* 设置数据源的第n个数据列 */
		DataGrid.prototype._blankData = function(index){
			var data = this._ops.data[index], temp;

			for(var prop in data)
			{
				temp = data[prop];
				if (temp instanceof Array)
				{
					data[prop].splice(0, temp.length);
				}
				else
				{
					data[prop] = "";
				}
			}
		};

		/* 设置toolBar中add的处理函数 */
		DataGrid.prototype._toolAddHandle = function(btn, func, asyn){
			var obj = this, pageNum;

			btn.onclick = function(){
				var table = obj._table, length, lastIndex, tr;
				var id = obj._ops.id, data = {}, rowIndex = 0;

				if (obj._eventStateSet("add") != true)
				{
					return;
				}

				if (obj._ops.max == obj._getDRL())
				{
					obj._event.state = "default";
					return;
				}

				obj._content_delete_blank();

				if (obj._ops.hasHead == true)
				{
					rowIndex = 1;
				}

				tr = table.insertRow(rowIndex);
				lastIndex = obj._getDRL() - 1;
				length = lastIndex + 1;
				tr.id = "dataGridAdd";
				tr.setAttribute("dataGridLastIndex", lastIndex);

				obj._getBlankDataObj(data);
				obj._fillEditRow(tr, rowIndex, data);

				function addHandle(result)
				{
					if (false == result)
					{
						return;
					}

					/* 判断是否有选择列 */
					if (obj._ops.hasSelBox == true)
					{
						tr.cells[0].innerHTML = "";
					}

					/* 判断是否有ID列 */
					if (obj._ops.hasID == true)
					{
						tr.cells[1].innerHTML = "";
					}

					obj._disableEditBtns();
					obj._flushBtn();

					/* 直接跳转至第一页 */
					obj._pageList(length, 1);
				}

				/* user指定的处理函数 */
				if (func != undefined)
				{
					if (true == asyn)
					{
						func(addHandle);
					}
					else
					{
						addHandle(func());
					}
				}
				else
				{
					addHandle(true);
				}
			};
		};

		/* 获取dom节点下指定类型的节点，index可选 */
		DataGrid.prototype._getDomChildNode = function(parent, filter, index){
			var childs = parent.childNodes;
			var nodes = [], count = 0, tempNode;
			var paras = filter.split(" ");
			var nodeName = paras[0], type = paras[1];

			for(var i = 0, len = childs.length;i < len; i++)
			{
				tempNode = childs[i];
				if (tempNode.tagName.toLowerCase() == nodeName)
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

		/* 设置toolBar中点击save后，edit情况的处理函数 */
		DataGrid.prototype._toolSaveHandle_Edit = function(tr, dataObj, targetIndex, backUpObj){
			return this._toolSaveHandle_SaveData(tr, dataObj, targetIndex, backUpObj);
		};

		/* 设置toolBar中点击save后，add情况的处理函数 */
		DataGrid.prototype._toolSaveHandle_SaveData = function(tr, dataObj, targetIndex, backUpObj){
			var list = this._ops.list, item, type, value, name;
			var inputId, names, values, temp, domTarget;
			var select, selCon, radio, checkbox, input;
			var cellIndex = 0, isChanged = false, result;
			var span, td;

			for(var index in list)
			{
				item = list[index];
				type = item.type;
				name = item.name;
				inputId = this._pgList.ipAddrIdPre + targetIndex + this._ops.id + index;

				if (this._ops.hasID == true)
				{
					cellIndex++;
				}

				if (this._ops.hasSelBox == true)
				{
					cellIndex++;
				}

				/* 不可编辑的列直接跳过 */
				if (false == item.edit)
				{
					continue;
				}

				switch(type)
				{
				case "ip":
					domTarget = id(inputId);
					value = $.trim(domTarget.value);
					if (ENONE != (result = checkIp(value)))
					{
						return {result:result, target:domTarget};
					}
					break;
				case "ips":
					names = name.split(" ");
					domTarget = id(inputId + names[0]);
					if (ENONE != (result = checkIp(domTarget.value)))
					{
						return {result:result, target:domTarget};
					}

					domTarget = id(inputId + names[1]);
					if (ENONE != (result = checkIp(domTarget.value)))
					{
						return {result:result, target:domTarget};
					}
					break
				case "mask":
					domTarget = id(inputId);
					value = $.trim(domTarget.value);
					if (ENONE != (result = checkMask(value)))
					{
						return {result:result, target:domTarget};
					}
					break;
				case "dns":
					domTarget = id(inputId);
					value = $.trim(domTarget.value);
					if (ENONE != (result = checkIp(value)))
					{
						return {result:result, target:domTarget};
					}
					break;
				case "gateway":
					domTarget = id(inputId);
					value = $.trim(domTarget.value);
					if (ENONE != (result = checkIp(value)))
					{
						return {result:result, target:domTarget};
					}
					break;
				case "mac":
					inputId = this._pgList.macAddrIdPre + targetIndex + this._ops.id + index;
					domTarget = id(inputId);
					value = domTarget.value;
					if (ENONE != (result = checkMac(value)))
					{
						return {result:result, target:domTarget};
					}
					break;
				case "popVig":
					td = tr.cells[cellIndex];
					span = this._getDomChildNode(td, "span");
					if (null == span)
					{
						value = "";
					}
					else
					{
						value = parseInt(td.getAttribute(item.popObj.indexDes));
					}
					break;
				/*begin added by LiGuanghua : for type path */
				case "path":
					td = tr.cells[cellIndex];
					span = this._getDomChildNode(td, "span");
					value = (null == span) ? "" : span.title;

					if (ENONE != (result = checkPath(value)))
					{
						return {result:result, target:span};
					}
					break;
				case "select":	// select 的组织形式是：options:[{str:"xx", value:"xx"}], func:onchangeHandle
				case "selectApp":
					selCon = this._getDomChildNode(tr.cells[cellIndex], "div");
					select = this._getDomChildNode(selCon, "span");
					domTarget = select;
					value = select.value;
					break;
				case "checkbox":
					checkbox = this._getDomChildNode(tr.cells[cellIndex], "input checkbox");
					domTarget = checkbox;
					value = checkbox.checked == true?1:0;
					break;
				case "radio":
					radio = this._getDomChildNode(tr.cells[cellIndex], "input radio");
					domTarget = radio;
					value = radio.checked == true?1:0;
					break;
				case "ports":
					input = this._getDomChildNode(tr.cells[cellIndex], "input");
					domTarget = input;
					value = $.trim(input.value);
					break;
				case "time":
				case "timeP":
				case "str":
				default:
					input = this._getDomChildNode(tr.cells[cellIndex], "input");
					domTarget = input;
					value = input.value;
					break;
				}

				if (type == "ports")
				{
					names = name.split(" ");	// 获取name的数组

					if (undefined != dataObj[names[0]])
					{
						backUpObj[names[0]] = dataObj[names[0]];
						backUpObj[names[1]] = dataObj[names[1]];
					}

					/* 获取用户输入的端口 */
					values = value.split("-");
					if (values.length == 2)
					{
						if (values[0] != values[0])
						{
							values[0] = "";
						}

						if (values[1] != values[1])
						{
							values[1] = "";
						}

						if (values[0].length == 0 || values[1].length == 0)
						{
							return {result:EINVPORTFMT, target:domTarget};
						}

						if (values[0].length != 0 && false == (/\D/g.test(values[0])))
						{
							values[0] = parseInt(values[0]);
						}

						if (values[1].length != 0 && false == (/\D/g.test(values[1])))
						{
							values[1] = parseInt(values[1]);
						}

						if (values[0] != dataObj[names[0]]
							|| values[1] != dataObj[names[1]])
						{
							isChanged = true;
						}

						dataObj[names[0]] = values[0] > values[1]?values[1]:values[0];
						dataObj[names[1]] = values[0] > values[1]?values[0]:values[1];
					}
					else if (values.length == 1)
					{
						temp = values[0];
						if (temp != temp)
						{
							temp = "";
						}

						if (0 != temp.length && false == (/\D/g.test(temp)))
						{
							temp = parseInt(temp);
						}

						if (temp != dataObj[names[0]] || temp != dataObj[names[1]])
						{
							isChanged = true;
						}

						dataObj[names[1]] = dataObj[names[0]] = temp;
					}
					else
					{
						return {result:EINVPORTFMT, target:domTarget};
					}
				}
				else if (type == "ips")
				{
					var valF = id(inputId + names[0]).value;
					var valS = id(inputId + names[1]).value;

					if (undefined != dataObj[names[0]])
					{
						backUpObj[names[0]] = dataObj[names[0]];
						backUpObj[names[1]] = dataObj[names[1]];
					}

					dataObj[names[0]] = valF > valS ? valS: valF;
					dataObj[names[1]] = valF > valS ? valF: valS;
				}
				else
				{
					if (dataObj[name] != undefined)
					{
						backUpObj[name] = dataObj[name];
					}

					if (value != dataObj[name])
					{
						isChanged = true;
					}

					dataObj[name] = value;	// 将value添加到数据结构中对应的属性
				}
			}

			return {result:ENONE, isChanged:isChanged, target:domTarget};
		};

		/* 设置toolBar中点击save后，add情况的处理函数 */
		DataGrid.prototype._toolSaveHandle_Add = function(tr, dataObj, backUpObj){
			if (tr == undefined)
			{
				return;
			}

			var targetIndex = this._getTrIndex(tr);

			this._state.isBlank = false;
			return this._toolSaveHandle_SaveData(tr, dataObj, targetIndex, backUpObj);
		};

		/* 设置toolBar中点击save后，变可编辑状态为非编辑状态 */
		DataGrid.prototype._toolSaveHandle_stateChange = function(tr, index){
			var checkbox, checked, hasSelBox;

			hasSelBox = (this._ops.hasSelBox == true && tr.cells[0].innerHTML.length != 0);

			if (hasSelBox == true)
			{
				checkbox = tr.cells[0].childNodes[0];
				checked = checkbox.checked;
			}

			this._trCleanCell(tr);
			this._contentFill(tr, this._ops.list, true, index, this._ops.data[index], this._getDRL());

			if (hasSelBox == true)
			{
				tr.cells[0].childNodes[0].checked = checked;
			}
		};

		/* 设置toolBar中save的处理函数 */
		DataGrid.prototype._toolSaveHandle = function(btn, func, asyn){
			var obj = this, state, mode, index, tr, result;
			var listobj = this._ops.data, backUpObj = {};
			var hasError = true;

			btn.onclick = function(){
				state = obj._eventStateGet();

				/* 失败的处理 */
				function failHandle()
				{
					var isBackUpObjNull = true;		/* added by SongKaiqiang 表格为空时，SLP读取时无备份数据 */

					/* edit失败后对数据进行还原 */
					for (var propty in backUpObj)
					{
						isBackUpObjNull = false;	/* added by SongKaiqiang */
						listobj[index][propty] = backUpObj[propty];
					}

					if (isBackUpObjNull == true && mode == "add")		/* added by SongKaiqiang 如果备份数据是空，那么就删除数据 */
					{
						listobj.splice(index, 1);
					}
				}

				switch(state)
				{
				case "default":	// 默认情况下不做处理
					return;
				case "edit":
					mode = "edit";
					tr = obj._getEditTr();
					index = obj._getTrIndexInDataObj(tr);
					backUpObj = {};
					result = obj._toolSaveHandle_Edit(tr, listobj[index], obj._getTrIndex(tr), backUpObj);
					break;
				case "add":
					mode = "add";
					index = obj._getDRL() - 1;
					tr = obj._getEditTr();
					listobj[index] = (listobj[index] == undefined ? {} : listobj[index]);
					backUpObj = {};
					result = obj._toolSaveHandle_Add(tr, listobj[index], backUpObj);
					break;
				}

				/* 检查出格式错误后，暂时在此处进行处理 */
				if (result.result != ENONE)
				{
					switch(result.result)
					{
					case EINVNET:
						showAlert(errStr.ipAddrNetErr, result.target);
						break;
					case EINVIP:
						showAlert(errStr.ipAddrErr, result.target);
						break;
					case EINVIPFMT:
						showAlert(errStr.ipAddrFmtErr, result.target);
						break;
					case EINVGROUPIP:
						showAlert(errStr.ipAddrGroupErr, result.target);
						break;
					case EINVLOOPIP:
						showAlert(errStr.ipAddrLoopErr, result.target);
						break;
					case EINVMACFMT:
						showAlert(errStr.macFmtErr, result.target);
						break;
					case EINVMACZERO:
						showAlert(errStr.macZeroErr, result.target);
						break;
					case EINVMACBROAD:
						showAlert(errStr.macBroadErr, result.target);
						break;
					case EINVMACGROUP:
						showAlert(errStr.macGroupErr, result.target);
						break;
					case EINVMASK:
						showAlert(errStr.maskErr, result.target);
						break;
					case EINVPORTFMT:
						showAlert(errStr.portIllegalFmtErr, result.target);
						break;

					/*begin added by LiGuanghua : for type path */
					case EINVPATHNULL:
						showAlert(errStr.pathIsNull);
						break;

					case EINVPATH:
						showAlert(errStr.invalidPath);
						break;
					/*end added by LiGuanghua : for type path */

					default:
						break;
					}

					failHandle();

					return;
				}

				/* 点击编辑但没有改变数据 */
				if (mode == "edit" && result.isChanged != true)
				{
					obj._toolSaveHandle_stateChange(tr, index);
					obj._event.state = "default";
					tr.id = "";
					obj._enableEditBtns();
					obj._setEditTr(null);

					return;
				}

				function saveHandle(successed)
				{
					if (successed == false)
					{
						failHandle();
					}
					else
					{
						/* 保存成功的处理 */
						obj._enableEditBtns();
						obj._setEditTr(null);
						obj._toolSaveHandle_stateChange(tr, index);
						obj._event.state = "default";
						tr.id = "";

						if (mode == "add")
						{
							obj._resetID();
							tr.removeAttribute("dataGridLastIndex");
						}
					}
				}

				/* user指定的处理函数 */
				if (func != undefined)
				{
					if (asyn == true)
					{
						func(mode, index, saveHandle);
					}
					else
					{
						saveHandle(func(mode, index));
					}
				}
				else
				{
					saveHandle(true);
				}
			};
		};

		/* 设置toolBar中saveAll的处理函数 */
		DataGrid.prototype._toolSaveAllHandle = function(btn, func, asyn){
			btn.onclick = function(){
				if (undefined != func)
				{
					func();
				}
			};
		};

		/* 设置toolBar中del的处理函数 */
		DataGrid.prototype._toolDelHandle = function(btn, func, asyn){
			var obj = this;
			btn.onclick = function(){
				var table = obj._table;
				var rows = obj._table.rows, isData;
				var temp, str = "", start, len;
				var rowslen = rows.length;
				var itemArr, rowArr = [];
				var tempIndex, pageNum = 0;
				var dataList = obj._ops.data;
				var editIndex = obj._getTrIndex(obj._getEditTr());
				var delEditRow = false, startIndex = 0;
				var length = 0, objCleanTip = "";

				function toolDelHandle()
				{
					function delHandle(result)
					{
						/* if delete fail then return */
						if (false == result)
						{
							return;
						}

						itemArr = str.split("-");

						/* 计算出删除后，应该显示的那一条数据的Index */
						startIndex = rowArr[0];
						if (len == itemArr.length + startIndex - 1)
						{
							startIndex--;
							startIndex = startIndex || 0;
						}
						else if (rows[startIndex].style.display == "none")
						{
							startIndex = rowArr[0];
						}

						for (var i = 0, len = itemArr.length; i < len; i++)
						{
							tempIndex = itemArr[i];
							rowArr[i] = rowArr[i] - i;
							table.deleteRow(rowArr[i]);
							obj._blankData(tempIndex);
							temp = dataList[tempIndex];
							dataList.push(temp);
							dataList.splice(tempIndex, 1);	// 删除数据
						}

						length = obj._ops.hasHead == true ? (rows.length - 1) : rows.length;

						/* 判断表格是否是空 */
						obj._state.isBlank = (length > 0 ? false : true);

						length = obj._eventStateGet() == "add" ? length - 1 : length;

						/* 计算出删除后，应该显示哪一条数据所在的页的页码 */
						pageNum = parseInt(startIndex/(obj._ops.paging.num)) + (startIndex%(obj._ops.paging.num) > 0?1:0);
						pageNum = pageNum < 1 ? 1:pageNum;
						obj._pageList(length, pageNum);

						/* 取消编辑状态 */
						if (delEditRow == true)
						{
							obj._eventStateSet("default", true);
							obj._setEditTr(null);
						}

						/* ID列重排序 */
						if (obj._ops.hasID == true)
						{
							obj._resetID();
						}

						obj._flushBtn();
						obj._refresh();	/* added by SongKaiqiang 删除数据后，重新刷新表格 */
					}

					if (undefined == func)
					{
						delHandle(true);
					}
					else
					{
						if (true == asyn)
						{
							func(str, delHandle);
						}
						else
						{
							delHandle(func(str));
						}
					}
				}

				/* "删除所选”按钮处于“灰化”状态，直接退出 */
				if (this.className == "delSelUn")
				{
					return;
				}

				start = (obj._ops.hasHead == true ? 1 : 0);
				len = rows.length - start;
				isData = (obj._eventStateGet() == "add" ? -1 : 0);
				len += isData;

				for(var index = start; index < rowslen; index++)
				{
					tr = rows[index];

					if (rows[index].cells.length == 1)
					{
						continue;
					}

					temp = rows[index].cells[0].childNodes[0];
					if (temp == null)
					{
						continue;
					}

					if (temp.checked == true)
					{
						str += (len - index - isData + "-");
						rowArr.push(index);
						if (editIndex == index)
						{
							delEditRow = true;
						}
					}
				}

				length = str.length;

				/* 没有选择，直接退出 */
				if (length == 0)
				{
					return;
				}

				str = str.substring(0, length - 1);
				objCleanTip = obj._ops.cleanTip;

				/* 如果全选并且需要提示，那么对用户进行提示 */
				if (0 != objCleanTip.length && undefined != objCleanTip && len == str.split("-").length)
				{
					showConfirm(objCleanTip, function(result){
						if (true == result)
						{
							toolDelHandle();
						}
					});
				}
				else
				{
					toolDelHandle();
				}
			};
		};

		/* 设置toolBar中cancel的处理函数 */
		DataGrid.prototype._toolCancelHandle = function(btn, func){
			var obj = this, state, length, pageNum;

			btn.onclick = function(){
				state = obj._eventStateGet();
				table = obj._table;
				switch(state)
				{
				case "default":
					break;
				case "edit":
					tr = obj._getEditTr();
					index = obj._getTrIndexInDataObj(tr);
					obj._toolSaveHandle_stateChange(tr, index);
					break;
				case "add":
					length = table.rows.length - 1;
					table.deleteRow((obj._ops.hasHead == true ? 1:0));
					length = (obj._ops.hasHead == true?(length - 1):length);

					/* 判断是否显示"空行" */
					if (length == 0)
					{
						obj._state.isBlank = true;
						obj._content_blank();
						break;
					}

					obj._pageList(length, 1);
					break;
				};

				obj._enableEditBtns();
				obj._setEditTr(null);
				obj._event.state = "default";
				obj._flushBtn();
			};
		};

		/* 设置toolBar中able的处理函数 */
		DataGrid.prototype._toolAbleHandle = function(btn, func, mode, asyn){
			var obj = this;
			btn.onclick = function(){
				var data = obj._ops.data;
				var list = obj._ops.list;
				var rows = obj._table.rows;
				var temp, name, len = 0, num, checkbox;

				function ableHandle(result)
				{
					if (false == result)
					{
						return;
					}

					/* 查找type=checkbox同时edit==false的选项中数据的name */
					for (var index in list)
					{
						temp = list[index];
						if (temp.type == "checkbox" && temp.edit == false)
						{
							name = temp.name;
							num = index;
							break;
						}
					}

					/* 如果找到了name，那么改变数据源中的值 */
					if (name != undefined)
					{
						len = obj._getListLen();
						for (var i = 0; i < len; i++)
						{
							data[i][name] = (mode == "enable"?1:0);
						}

						len = rows.length;
						if (obj._ops.hasID == true)
						{
							num++;
						}
						for (var index = (obj._ops.hasHead == true?1:0); index < len;index++)
						{
							checkbox = obj._getDomChildNode(rows[index].cells[num], "input checkbox");
							checkbox.checked = (mode == "enable"?true:false);
						}
					}
				}

				/* 如果数据为空，则直接退出 */
				if (obj._state.isBlank == true)
				{
					return;
				}

				if (func == undefined)
				{
					ableHandle(true);
				}
				else
				{
					if (true == asyn)
					{
						func(mode, ableHandle);
					}
					else
					{
						ableHandle(func(mode));
					}
				}
			};
		};

		/* 设置toolBar中enable的处理函数 */
		DataGrid.prototype._toolEnableHandle = function(btn, func, asyn){
			this._toolAbleHandle(btn, func, "enable", asyn);
		};

		/* 设置toolBar中disable的处理函数 */
		DataGrid.prototype._toolDisableHandle = function(btn, func, asyn){
			this._toolAbleHandle(btn, func, "disable", asyn);
		};

		/* 设置toolBar中clean的处理函数 */
		DataGrid.prototype._toolCleanHandle = function(btn, func, asyn){
			var obj = this;

			btn.onclick = function(){
				var data = obj._ops.data;
				var cleanTip, objClnTip;

				/* 如果数据为空，则直接退出 */
				if (((obj._state.isBlank == true) && (obj._event.state == "default")))
				{
					return;
				}

				cleanTip = label.delAllConfirm;
				objClnTip = obj._ops.cleanTip;
				if (undefined != objClnTip && 0 != objClnTip.length)
				{
					cleanTip = objClnTip;
				}

				function cleanHandle(result)
				{
					if (true == result)
					{
						obj._blankData(0);
						data.splice(1, data.length - 1);
						obj._state.isBlank == true;
						obj._refresh(1);
						obj._setEditTr(null);
						obj._event.state = "default";
						obj._flushBtn();
						obj._pageList(0, 1);
					}
				}

				showConfirm(cleanTip, function(result){
					if (obj._state.isBlank == false || obj._event.state != "add")
					{
						if (result == false)
						{
							return;
						}

						/* 如果没有回调函数，则直接删除全部 */
						if (func == undefined)
						{
							cleanHandle(true);
						}
						else
						{
							if (true == asyn)
							{
								func(cleanHandle);
							}
							else
							{
								cleanHandle(func());
							}
						}
					}
					else	/* added by songkaiqiang 修复添加但未保存数据时删除全部的问题 */
					{
						cleanHandle(true);
					}
				});
			};
		};

		/* 设置toolBar中refresh的处理函数 */
		DataGrid.prototype._toolRefreshHandle = function(btn, func, asyn){
			var obj = this;

			btn.onclick = function(){
				var data = obj._ops.data;

				function refreshHandle(result)
				{
					if (true == result)
					{
						obj._cleanList(obj._ops.id + "pagIngList");
						obj._refresh(1);
						obj._setEditTr(null);
						obj._event.state = "default";
						obj._flushBtn();
					}
				}

				if (undefined == func)
				{
					return;
				}

				if (true == asyn)
				{
					func(refreshHandle);
				}
				else
				{
					refreshHandle(func());
				}
			};
		};

		/* 设置toolBar中email的处理函数 */
		DataGrid.prototype._toolEmailHandle = function(btn, func, asyn){
			btn.onclick = function(){
				if (undefined != func)
				{
					func();
				}
			};
		};

		/* 设置toolBar中clrAll的处理函数 */
		DataGrid.prototype._toolClearAllHandle = function(btn, func, asyn){
			var obj = this;

			btn.onclick = function(){
				var data = obj._ops.data;

				function clearAllHandle(result)
				{
					if (false == result)
					{
						return;
					}

					obj._cleanList(obj._ops.id + "pagIngList");
					obj._refresh(1);
					obj._setEditTr(null);
					obj._event.state = "default";
					obj._flushBtn();
				}

				if (undefined == func)
				{
					clearAllHandle(true);
				}

				if (true == asyn)
				{
					func(clearAllHandle);
				}
				else
				{
					clearAllHandle(func());
				}
			};
		};

		/* 设置toolBar中clrSel的处理函数 */
		DataGrid.prototype._toolClearSelHandle = function(btn, func, asyn){
			var obj = this;

			btn.onclick = function(){
				var rows = obj._table.rows, isData;
				var str = "", start, len;
				var rowslen = rows.length;
				var itemArr, rowArr = [];
				var dataList = obj._ops.data;
				var opList = obj._ops.list;
				var editIndex = obj._getTrIndex(obj._getEditTr());
				var clrEditRow = false;
				var length = 0, listNameObj = {};
				var valueTmp, tmp, temp, tempIndex;

				/* "删除所选”按钮处于“灰化”状态，直接退出 */
				if (this.className == "clrUn")
				{
					return;
				}

				start = (obj._ops.hasHead == true ? 1 : 0);
				len = rows.length - start;
				isData = (obj._eventStateGet() == "add" ? -1 : 0);
				len += isData;

				for(var index = start; index < rowslen; index++)
				{
					tr = rows[index];

					if (rows[index].cells.length == 1)
					{
						continue;
					}

					temp = rows[index].cells[0].childNodes[0];
					if (temp == null)
					{
						continue;
					}

					if (temp.checked == true)
					{
						str += (len - index - isData + "-");
						rowArr.push(index);
					}
				}

				/* 没有选择，直接退出 */
				if (str.length == 0)
				{
					return;
				}

				str = str.substring(0, str.length - 1);

				function clearSelHandle(result)
				{
					if (false == result)
					{
						return;
					}

					/* 获取对应的name的条目是否需要clear */
					len = opList.length;
					for (var i = 0; i < len; i++)
					{
						tmp = opList[i];
						if (tmp.clear == true)
						{
							listNameObj[tmp.name] = {clear:true, clearValue:tmp.clearValue};
						}
					}

					/* clear被选中的数据条目中需要清空的数据 */
					itemArr = str.split("-");
					len = itemArr.length;
					for (var i = 0; i < len; i++)
					{
						temp = dataList[i];
						for (var propty in temp)
						{
							tmp = listNameObj[propty];
							if (tmp != undefined && tmp.clear == true)
							{
								temp[propty] = tmp.clearValue;
							}
						}
					}

					/* clear被选中行中需要清空的表格中的数据 */
					len = rowArr.length;
					start = 1;
					start += (obj._ops.hasID ? 1 : 0);

					for (var i = 0; i < len; i++)
					{
						temp = rowArr[i];
						length = rows[temp].cells.length;

						for (var j = start; j < length; j++)
						{
							tmp = listNameObj[opList[j - start].name];
							if (tmp != undefined && tmp.clear == true)
							{
								/* 处于编辑状态的行的处理 */
								if (editIndex == temp)
								{
									rows[temp].cells[j].value = tmp.clearValue;
								}
								else
								{
									rows[temp].cells[j].innerHTML = tmp.clearValue;
								}

								rows[temp].cells[0].childNodes[0].checked = false;
							}
						}
					}

					obj._selectAll();
					obj._flushBtn();
				}

				if (undefined == func)
				{
					clearSelHandle(true);
				}
				else
				{
					if (true == asyn)
					{
						func(str, clearSelHandle);
					}
					else
					{
						clearSelHandle(func(str));
					}
				}
			};
		};

		/* 设置toolBar */
		DataGrid.prototype._setToolBar = function(){
			var toolBarObj = this._ops.toolBar;
			var lis, gridType, btn, func, input, des, span, asyn;

			if (toolBarObj == null)
			{
				return;
			}

			lis = $("#"+toolBarObj.id+" li");

			for(var index = 0, len = lis.length; index < len; index++)
			{
				btn = lis[index];
				des = btn.innerHTML;
				gridType = btn.getAttribute("gridType");
				func = toolBarObj[gridType];
				asyn = toolBarObj["asyn"];

				switch(gridType)
				{
				case "add":
					btn.className = "add";
					this._toolBar.addBtn = btn;
					this._toolAddHandle(btn, func, asyn);
					break;
				case "save":
					this._toolSaveHandle(btn, func, asyn);
					break;
				case "saveAll":
					btn.className = "add";
					this._toolSaveAllHandle(btn, func, asyn);
					break;
				case "delAll":
					btn.className = "delAll";
					this._toolBar.delAllBtn = btn;
					this._toolCleanHandle(btn, func, asyn);
					break;
				case "delSel":
					btn.className = "delSelUn";
					this._toolBar.delSelBtn = btn;
					this._toolDelHandle(btn, func, asyn);
					break;
				case "cancel":
					this._toolCancelHandle(btn, func);
					break;
				case "enable":
					this._toolEnableHandle(btn, func, asyn);
					break;
				case "disable":
					this._toolDisableHandle(btn, func, asyn);
					break;
				case "refresh":
					btn.className = "refresh";
					this._toolRefreshHandle(btn, func, asyn);
					break;
				case "email":
					btn.className = "email";
					this._toolEmailHandle(btn, func, asyn);
					break;
				case "clrSel":
					btn.className = "clrUn";
					this._toolBar.clrSelBtn = btn;
					this._toolClearSelHandle(btn, func, asyn);
					break;
				case "clrAll":
					btn.className = "clrEn";
					this._toolClearAllHandle(btn, func, asyn);
					break;
				case "edit":
					break;
				}

				btn.innerHTML = "";
				input = el("input");
				input.value = des;
				input.type = "button";
				btn.appendChild(input);
			}
		};

		/* 获取数据长度 */
		DataGrid.prototype._getListLen = function(){
			var list = this._ops.list, data = this._ops.data, value, length = 0, temp;
			var name = list[this._ops.checkIndex].name;

			value = this._types[list[this._ops.checkIndex].type];
			for(var prop in data)
			{
				temp = data[prop][name];
				if (temp === value || temp === undefined || (temp.toString()).length == 0)
				{
					break;
				}
				length++;
			}

			return length;
		};

		/* 删除空行 */
		DataGrid.prototype._content_delete_blank = function(){
			var lastIndex;

			/* 判断表格是否支持空行 */
			if (this._ops.spBlank == false)
			{
				return;
			}

			if (this._state.isBlank == true)
			{
				this._state.isBlank = false;
				lastIndex = (this._ops.hasHead == true?1:0);
				this._table.deleteRow(lastIndex);
			}
		};

		/* 创建空行 */
		DataGrid.prototype._content_blank = function(){
			var tr, td , table = this._table, head = this._ops.head;
			var width = 0;

			/* 判断表格是否支持空行 */
			if (this._ops.spBlank == false)
			{
				return;
			}

			tr = table.insertRow(-1);
			td = tr.insertCell(-1);
			td.colSpan = this._state.colNum;

			if (this._ops.hasHead == false)
			{
				setStyle(td, {width:table.offsetWidth+"px"});
			}

			td.innerHTML = label.blankTable;
		};

		/* 获取是否有可编辑的列 */
		DataGrid.prototype._editable = function(){
			var list = this._ops.list, edit;

			if (this._ops.edit == false)
			{
				return false;
			}

			for(var index in list)
			{
				edit = list[index].edit;
				if (edit == true)
				{
					return true;
				}
			}
			return false;
		};

		/* 处理type="time" */
		DataGrid.prototype._timeHandle = function(time, td){
			if( 0xFFFFFFFF == time)
			{
				td.innerHTML = label.forever;
			}
			else
			{
				var dateTime = new Date();

				dateTime.setHours(parseInt(time/(60*60)), parseInt(time%(60*60)/60), parseInt(time%(60*60)%60), 0);
				td.innerHTML = dateTime.toTimeString().substring(0,8);
			}
		};

		/* 处理type="timeP" */
		DataGrid.prototype._timePHandle = function(time, td){
			if( 0xFFFFFFFF == time)
			{
				td.innerHTML = label.forever;
			}
			else
			{
				var hour, minute, second;

				hour = parseInt(time/(60*60));
				minute = parseInt(time%(60*60)/60);
				second = parseInt(time%(60*60)%60);

				if (hour < 10)
				{
					hour = "0" + hour;
				}
				if (minute < 10)
				{
					minute = "0" + minute;
				}
				if (second < 10)
				{
					second = "0" + second;
				}

				td.innerHTML = hour + ":" + minute + ":" + second;
			}
		};

		/* 处理type="select" */
		DataGrid.prototype._selectHandle = function(listObj, dataObj, td){
			var options = listObj.options;
			var val = dataObj[listObj.name];
			var blankStr = listObj.blankStr;
			var str;

			if (options[0].value != undefined)
			{
				for (var i = 0, len = options.length; i < len; i++)
				{
					if (options[i].value == val)
					{
						str = options[i].str;
						td.innerHTML = (str == blankStr ? "" : htmlEscape(str));

						return;
					}
				}
			}
			else
			{
				str = options[val].str;
				td.innerHTML = (str == blankStr ? "" : htmlEscape(str));
			}
		};
		DataGrid.prototype._selectEditHandle = function(listObj,dataObj,td,index){
			var options = dataObj[listObj.name]["selectList"];
			var val = dataObj[listObj.name]["value"];
			for (var i = 0, len = options.length; i < len; i++)
			{
				if (options[i].value == val)
				{
					str = options[i].str;
					td.innerHTML = '<ul class="gridLine">'+
										'<li class="textConA textCon">' + 
											'<span id="selectEdit' + index + '" class="selectEdit select">'+
												'<span class="selectEditValue value hsValueA"></span>'+
												'<i class="arrow"></i>'+
											'</span>'
										'</li>'
									'</ul>';
					selectInit("selectEdit" + index,options,val,listObj.func);
					return;
				}
			}
		}
		/* 处理type="strSelect" [{value:xx, str:xx}] */
		DataGrid.prototype._strSelectHandle = function(listObj, dataObj, td){
			var strOps = listObj.options, item;
			var value = parseInt(dataObj[listObj.name]), str = "";

			for (var ele in strOps)
			{
				item = strOps[ele];
				if (item.value != undefined)
				{
					if (value == parseInt(item.value))
					{
						str = item.str;
						break;
					}
				}
				else if (value == ele)
				{
					str = item.str;
					break;
				}
			}

			td.innerHTML = htmlEscape(str);
		};

		/* 处理type="checkbox" */
		DataGrid.prototype._checkBoxHandle = function(listObj, dataObj, td, index){
			var input = el("input"), value = dataObj[listObj.name], disabled = dataObj[listObj.checkDis];
			input.type = "checkbox";
			input.checked = (value == true);

			if (undefined != disabled)
			{
				input.disabled = disabled;
			}

			if (listObj.func != undefined)
			{
				input.onclick = function(event){
					event = event || window.event;
					var obj = this, temp = dataObj[listObj.name];

					dataObj[listObj.name] = this.checked == true?1:0;
					if (listObj.func(index, {obj:obj}) == false)
					{
						dataObj[listObj.name] = temp;
						this.checked = temp == 1?true:false;
					}

					stopProp(event);
				};
			}
			td.appendChild(input);
		};

		/* 处理type="radio" */
		DataGrid.prototype._radioHandle = function(listObj, dataObj, td, index){
			var input = el("input"), value = dataObj[listObj.name];
			input.type = "radio";
			input.checked = (value == true);
			if (listObj.func != undefined)
			{
				input.onclick = function(event){
					event = event || window.event;
					var obj = this, temp = dataObj[listObj.name];

					dataObj[listObj.name] = this.checked == true?1:0;
					if (listObj.func(index, {obj:obj}) == false)
					{
						dataObj[listObj.name] = temp;
						this.checked = temp == 1?true:false;
					}
				};
			}
			td.appendChild(input);
		};

		/* 处理type="btn" */
		DataGrid.prototype._btnHandle = function(listObj, dataObj, td, index){
			var subType = listObj.subType, value;
			var input = el("input"), objThis = this;

			input.type = "button";
			input.value = listObj.value?listObj.value:"";

			if (subType != undefined)
			{
				switch(subType)
				{
				case "bind":
					value = dataObj[listObj.name];
					if (value == true)
					{
						input.className = listObj.classNameUn;
						input.disabled = true;
					}
					else
					{
						input.className = listObj.className;
					}

					input.onclick = function()
					{
						listObj.click(index, {obj:this});
					};
					break;
				case "addExt"://Mesh添加新路由用
					var STATUS_ADD = 0;
					var STATUS_WAITING_FOR_ADDING = 1;
					var STATUS_ADDING = 2;
					var STATUS_ADD_SUCCESS = 3;
					var STATUS_ADD_FAIL = 4;
					var STATUS_ADD_TIMEOUT = 5;
					var STATUS_CANNOT_BE_ADDED = 6;

					value = dataObj[listObj.name];
					if (value == STATUS_ADD) // |+|
					{
						input.className = "classNameBtn";
						input.disabled = false;
						input.value = btn.add;
					}
					else if (value == STATUS_WAITING_FOR_ADDING)
					{
						input.className = "classNameText";
						input.disabled = true;
						input.value = statusStr.waitingForAdding;
					}
					else if (value == STATUS_ADDING)
					{
						input.className = "classNameText";
						input.disabled = true;
						input.value = statusStr.adding;
					}
					else if (value == STATUS_ADD_SUCCESS)
					{
						input.className = "classNameSuccess";
						input.disabled = true;
						input.value = statusStr.addSuccess;
					}
					else if (value == STATUS_ADD_FAIL)
					{
						input.className = "classNameFail";
						input.disabled = true;
						input.value = statusStr.addExtFail;
					}
					else if (value == STATUS_ADD_TIMEOUT)
					{
						input.className = "classNameFail";
						input.disabled = true;
						input.value = statusStr.addExtTimeout;
					}
					else if (value == STATUS_CANNOT_BE_ADDED)
					{
						input.className = "classNameFail";
						input.disabled = true;
						input.value = statusStr.cannotBeAdded;
					}
					else {
						input.className = "classNameText";
						input.disabled = true;
						input.value = statusStr.unknownStatus;
					}

					input.onclick = function()
					{
						this.className = "classNameLoading";
						this.value = "";
						this.disabled = true;
						listObj.click(index, {obj:this});
					};
					break;
				case "radio":
					value = dataObj[listObj.name];
					if (value == true)
					{
						input.className = listObj.className;
					}
					else
					{
						input.className = listObj.classNameUn;
					}

					input.onclick = function()
					{
						$("#" + objThis._ops.id + " input." + listObj.className).attr("class", listObj.classNameUn);
						this.className = listObj.className;
						listObj.click(index, {obj:this});
					};
					input.onfocus = function(){this.blur()};
					break;
				case 'checkbox':
					value = dataObj[listObj.name];
					if (value == true)
					{
						input.className = listObj.className;
					}
					else
					{
						input.className = listObj.classNameUn;
					}

					input.onclick = function()
					{
						if (this.className == listObj.classNameDis) {
							return;
						}
						this.className = this.className == listObj.className ? listObj.classNameUn : listObj.className;
						listObj.click(index, {obj:this});
					};
					input.onfocus = function(){this.blur()};
					break;
				case "switch":
					value = dataObj[listObj.name];

					if (undefined == listObj.onStr && undefined == listObj.offStr)
					{
						listObj.onStr = label.SmbShareOpen;
						listObj.offStr = label.SmbShareClose;
					}

					if (undefined == listObj.classNameUn)
					{
						listObj.classNameUn = listObj.className;
					}

					/* 初始化 */
					if (value == true)
					{
						input.className = listObj.className;
						input.value = listObj.onStr;
					}
					else
					{
						input.className = listObj.classNameUn;
						input.value = listObj.offStr;
					}

					input.onclick = function()
					{
						if (true == listObj.click(index, {obj:this}))
						{
							if (this.value == listObj.onStr)
							{
								this.className = listObj.classNameUn;
								this.value = listObj.offStr;
							}
							else
							{
								this.className = listObj.className;
								this.value = listObj.onStr;
							}
						}
					};
					break;
				}
			}
			else
			{
				input.className = listObj.className;
				input.onclick = function(){
					listObj.click(index, {obj:this});
				};
			}

			td.appendChild(input);
		};

		/* 处理type="ports" */
		DataGrid.prototype._portsHandle = function(listObj, dataObj, td){
			var names = listObj.name.split(" "), temp;

			if (dataObj[names[1]] != dataObj[names[0]])
			{
				td.innerHTML = dataObj[names[0]] + (dataObj[names[1]].length == 0?"":" - "+dataObj[names[1]]);
			}
			else
			{
				td.innerHTML = dataObj[names[0]];
			}
		};

		/* 处理type="ips" */
		DataGrid.prototype._ipsHandle = function(listObj, dataObj, td){
			var names = listObj.name.split(" "), temp;

			if (dataObj[names[1]] != dataObj[names[0]])
			{
				td.innerHTML = dataObj[names[0]] + (dataObj[names[1]].length == 0?"":" - "+dataObj[names[1]]);
			}
			else
			{
				td.innerHTML = dataObj[names[0]];
			}
		};

		/* 处理type="popVig" */
		DataGrid.prototype._popVigHandle = function(listObj, dataObj, td, cellIndex){
			var index = dataObj[listObj.name], popObj = listObj.popObj;
			var value, showSize;

			/* added by songkaiqiang */
			if (!/^\d+$/.test(index))
			{
				for (var i in popObj.subList)
				{
					if (popObj.subList[i][".name"] == index)
					{
						index = i;
						break;
					}
				}
			}

			value = (popObj.subList[index])[popObj.name];
			showSize = this._calcShowSize(cellIndex, listObj);

			value = (value == undefined ? "" : value.toString());
			td.title = value;
			td.innerHTML = htmlEscape(getStrInMax(value, showSize));
		};

		/*begin added by LiGuanghua : for type path */
		/* 处理type="path" */
		DataGrid.prototype._pathHandle = function(listObj, dataObj, td){
			var value = dataObj[listObj.name];
			td.innerHTML = htmlEscape(getStrInMax(value, 32));
			td.title = value;
		};
		/*end added by LiGuanghua : for type path */

		/* 处理type="signal" */
		DataGrid.prototype._signalHandle = function(listObj, dataObj, td){
			var signalCon = el("i"), signal = el("i");
			var ss = parseInt(dataObj[listObj.name]);
			var signalWidth = 3, signalMg = 2;

			signalCon.className = "signalCon";
			signal.className = "signal";
			ss = isNaN(ss) == true ? 0 : ss;
			signal.style.width = signalWidth*ss + signalMg*(ss - 1) + "px";
			signalCon.appendChild(signal);
			td.appendChild(signalCon);
		};

		/*begin added by Zhu Qinwei : for type phSignal */
		/* 处理type="phSignal" */
		DataGrid.prototype._phSignalHandle = function(listObj, dataObj, td){
			var signalCon = el("i"), signal = el("i"), lock = el("i");
			var ss = parseInt(dataObj[listObj.name]);

			signalCon.className = "signalCon";
			signal.className = "signal" + ss;
			signalCon.appendChild(signal);

			if(parseInt(dataObj["encryption"]) > 0)
			{
				lock.className = "lock";
				signalCon.appendChild(lock);
			}

			td.style.textAlign = "right";
			td.appendChild(signalCon);
		};
		/*end added by Zhu Qinwei : for type phSignal */

		/* 处理type="speed" */
		DataGrid.prototype._speedHandle = function(listObj, dataObj, td){
			var value = dataObj[listObj.name];

			td.innerHTML = (parseInt(value) == 0 ? label.disLimit : (value + "KB/s"));
		};

		/* 处理type="note" added by Zhou Yang */
		DataGrid.prototype._noteHandle = function(listObj, dataObj, td){
			var value = dataObj[listObj.name];
			var onClick = listObj.onClick;
			var noteSpan = document.createElement("span");
			noteSpan.title = value;
			noteSpan.innerHTML = value;
			noteSpan.className = "noteSpan";
			var noteImg = document.createElement("img");
			noteImg.src = "../../web-static/images/edit_green.png";
			noteImg.className = "noteImg";
			noteImg.onclick = function(){
				onClick(listObj, dataObj, td);
			};
			td.appendChild(noteSpan);
			td.appendChild(noteImg);
		};

		/* 处理type="normalStr" added by Zhou Yang */
		DataGrid.prototype._normalStrHandle = function (listObj, dataObj, td){
			var value = dataObj[listObj.name];
			td.innerHTML = value;
		};

		/* 清空tr中的td */
		DataGrid.prototype._trCleanCell = function(tr){
			var len = tr.cells.length;
			try
			{
				tr.innerHTML = "";
			}
			catch(ex)
			{
				while(len > 0)
				{
					tr.deleteCell(0);
					len = tr.cells.length;
				}
			}
		};

		/* tr edit handler */
		DataGrid.prototype._trEdit = function(tr){
			var data = this._ops.data;
			var checked = false, index = -1;

			if (this._ops.hasSelBox == true)
			{
				checked = tr.cells[0].childNodes[0].checked;
			}

			this._trCleanCell(tr);
			index = this._getTrIndexInDataObj(tr);
			this._fillEditRow(tr, this._getTrIndex(tr), data[index]);

			if (this._ops.hasSelBox == true)
			{
				tr.cells[0].childNodes[0].checked = checked;
			}
		};

		/* 获取正在被编辑的tr的index */
		DataGrid.prototype._getTrIndex = function(tr){
			var rows = this._table.rows, index = -1;

			if (null == tr)
			{
				return index;
			}

			for(var i = (this._ops.hasHed == true ? 1 : 0), len = rows.length; i <  len; i++)
			{
				if (tr === rows[i])
				{
					index = i;
					break;
				}
			}

			return index;
		};

		/* 灰化所有的非编辑状态的编辑按钮 */
		DataGrid.prototype._disableEditBtns = function(){
			$("table.dataGrid i.edit").toggleClass("edit").toggleClass("unedit");
		};

		/* 亮化所有的编辑状态的编辑按钮 */
		DataGrid.prototype._enableEditBtns = function(){
			$("table.dataGrid i.unedit").toggleClass("unedit").toggleClass("edit");
		};

		/* edit btn click handler */
		DataGrid.prototype._editBtnClick = function(btn, enabled){
			var id = this._ops.id;
			var obj = this;

			btn.onclick = function(){
				var index, tr, lastEditTr;
				var state = obj._eventStateGet();

				/* 判断现在的状态是否是默认的 */
				switch(state)
				{
				case "edit":
					if (obj._ops.spAutoEdit == false)
					{
						return;
					}
					break;
				case "default":
					break;
				default:
					return;
				}

				tr = this.parentNode;

				/* 此处处理可编辑的行 */
				if (enabled == true)
				{
					obj._eventStateSet("edit");
					if (obj._ops.spAutoEdit == true)
					{
						/* 获取上一个被编辑条目的tr和index */
						lastEditTr = obj._getEditTr();
						index = obj._getTrIndexInDataObj(lastEditTr);

						/* 取消已被编辑的列 */
						if (index != -1 && state != "default")
						{
							obj._trCleanCell(lastEditTr);
							lastEditTr.id = "";
							obj._contentFill(lastEditTr, obj._ops.list, true, index, obj._ops.data[index], obj._getDRL());
						}
					}
					else
					{
						obj._disableEditBtns();
					}

					obj._trEdit(tr);
				}
				else
				{
					/* 不可编辑的行，如果指定了点击的处理函数，则进行调用 */
					 if (obj._ops.click != null)
					 {
						obj._ops.click(obj._getTrIndexInDataObj(tr));
					 }
				}
			};
		};

		/* 添加编辑按钮 */
		DataGrid.prototype._editBtnHandle = function(td, editable, index){
			var iBtn = document.createElement("i");

			iBtn.className = "edit";
			this._editBtnClick(td, editable);
			td.style.cursor = "pointer";
			td.appendChild(iBtn);
		};

		/* 响应每一行的复选框的change事件 */
		DataGrid.prototype._singelSelHandle = function(checkbox, obj){
			var rows, selAll, childNum;
			var isSelAll = true, isSel = false;

			if (obj._ops.hasHead == false)
			{
				return;
			}

			rows = obj._table.rows;
			selAll = rows[0].cells[0].childNodes[0];
			childNum = rows.length;

			if (checkbox.checked == false)
			{
				isSelAll = false;
			}

			for(var index = 1; index < childNum; index++)
			{
				if (rows[index].cells[0].innerHTML.length == 0)
				{
					continue;
				}

				if (rows[index].cells.length == 1)
				{
					selAll.checked = true;
					return;
				}

				checkbox = rows[index].cells[0].childNodes[0];

				if (checkbox.checked == true)
				{
					isSel = true;
				}
				else if (rows[index].style.display != "none")
				{
					isSelAll = false;
				}
			}

			selAll.checked = isSelAll;
			this._toolSelBtnState(isSel);
		};

		/* 计算表格中能够显示的最大字符数 */
		DataGrid.prototype._calcShowSize = function(cellIndex, listObj){
			var showSize, cellWidth;
			var fontSize = parseInt($(this._table).css("fontSize"));

			cellWidth = this._state.headCells[cellIndex].width;
			showSize = parseInt(cellWidth/(fontSize*0.65));
			showSize = listObj.maxSize != undefined ? listObj.maxSize : showSize;
			return showSize;
		};

		/* 生成表的具体内容 */
		DataGrid.prototype._contentFill = function(tr, list, editable, index, dataObj, dataListLen){
			var td, type, head = this._ops.head;
			var input, obj = this;
			var showSize, str, showStr;

			/* 判断是否需要选择列 */
			if (this._ops.hasSelBox == true)
			{
				td = tr.insertCell(-1);
				input = document.createElement("input");
				input.type = "checkbox";
				input.onclick = function(){
					obj._singelSelHandle(input, obj);
				};
				td.appendChild(input);

				if (this._ops.hasHead == false)
				{
					setStyle(td, {width:this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth});
				}
			}

			/* 判断是否需要ID列 */
			if (this._ops.hasID == true)
			{
				/* 生成ID列 */
				td = tr.insertCell(-1);
				td.innerHTML = dataListLen - index;	// 颠倒顺序

				if (this._ops.hasHead == false)
				{
					setStyle(td, {width:this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth});
				}
			}

			/* 根据list中的type进行数据填充 */
			for (var item in list)
			{
				var listObj = list[item];
				type = listObj.type;
				td = tr.insertCell(-1);

				if (this._ops.hasHead == false)
				{
					setStyle(td, {width:head[item].width+"px"});
				}

				if (listObj.tdStyles != null)
				{
					setStyle(td, listObj.tdStyles);
				}

				switch (type)
				{
				case "btn":
					this._btnHandle(listObj, dataObj, td, index);
					break;
				case "time":
					this._timeHandle(dataObj[listObj.name], td);
					break;
				case "timeP":
					this._timePHandle(dataObj[listObj.name], td);
					break;
				case "selectApp":
				case "select":
					this._selectHandle(listObj, dataObj, td);
					break;
				case "selectEdit":
					this._selectEditHandle(listObj,dataObj,td,index);
					break;
				case "checkbox":
					if (listObj.edit == false)
					{
						this._checkBoxHandle(listObj, dataObj, td, index);
					}
					break;
				case "radio":
					if (listObj.edit == false)
					{
						this._radioHandle(listObj, dataObj, td, index);
					}
					break;
				case "strSelect":		//strSelect格式：options[{str:"xx", value:xx}]
					this._strSelectHandle(listObj, dataObj, td);
					break;
				case "ports":
					this._portsHandle(listObj, dataObj, td);
					break;
				case "ips":
					this._ipsHandle(listObj, dataObj, td);
					break;
				case "speed":
					this._speedHandle(listObj, dataObj, td);
					break;
				case "popVig":
					this._popVigHandle(listObj, dataObj, td, item);
					break;
				/*begin added by LiGuanghua : for type path */
				case "path":
					this._pathHandle(listObj, dataObj, td);
					break;
				/*end added by LiGuanghua : for type path */
				case "signal":
					this._signalHandle(listObj, dataObj, td);
					break;
				/*begin added by Zhu Qinwei : for type phSignal */
				case "phSignal":
					this._phSignalHandle(listObj, dataObj, td);
					break;
				/*end added by Zhu Qinwei : for type phSignal */
				case "iconWithStr":
					var iconType;
					showSize = this._calcShowSize(item, listObj);
					if ($.isPlainObject(dataObj[listObj.name]))
					{
						str = dataObj[listObj.name]["str"];
						iconType = dataObj[listObj.name]["iconType"] || "";
					}
					else
					{
						str = dataObj[listObj.name];
						iconType = "";
					}
					str = (str == undefined ? "" : str.toString());
					showStr = getStrInMax(str, showSize);

					if (type == "mac")
					{
						showStr = showStr.toUpperCase();
						str = str.toUpperCase();
					}

					if (iconType != "")
					{
						showStr = '<i class="tdIcon ' + iconType + '"></i>' + '<span class="tdIcon">' + showStr + '</span>';
					}

					td.innerHTML = showStr;
					td.title = str;

					break;
				/* added by Zhou Yang : for type note */
				case "note":
					this._noteHandle(listObj, dataObj, td);
					break;
				/* added by Zhou Yang : for type normalStr */
				case "normalStr":
					this._normalStrHandle(listObj, dataObj, td);
					break;
				case "str":
				default:
					showSize = this._calcShowSize(item, listObj);
					str = dataObj[listObj.name];
					str = (str == undefined ? "" : str.toString());
					if (true == listObj.igHTMLEscape)
					{
						showStr = getStrInMax(str, showSize);
					}
					else
					{
						showStr = htmlEscape(getStrInMax(str, showSize));
					}

					if (type == "mac")
					{
						td.innerHTML = showStr.toUpperCase();
						td.title = str.toUpperCase();
					}
					else
					{
						td.innerHTML = showStr;
						td.title = str;
					}

					if (listObj.className != undefined)
					{
						td.className = listObj.className;
					}
					break;
				}
			}

			/* 判断是否需要编辑列 */
			if (this._ops.edit == true)
			{
				/* 生成编辑列 */
				td = tr.insertCell(-1);
				this._editBtnHandle(td, editable, index);

				if (this._ops.hasHead == false)
				{
					setStyle(td, {width:this._set.editWidth});
				}
			}
		};

		/* 刷新表格, 最小值为1*/
		DataGrid.prototype._refresh = function(pageNum){
			var table = this._table, index = this._ops.hasHead == true?1:0;

			for(var i = 0, len = table.rows.length; i < len; i++)
			{
				if (table.rows[index] != null)
				{
					table.deleteRow(index);
				}
			}

			/* 初始化表格状态 */
			this._event.state = "default";
			this._setEditTr(null);

			this._contentCreate(pageNum);

			/* 如果刷新内容，重新判断表格是否是空 */
			this._state.isBlank = (this._table.rows.length - index > 0 ? false : true);

			this._IESixResize();
		};

		/* 加载数据到表格中 */
		DataGrid.prototype._contentCreate = function(startPage){
			var list = this._ops.list, data = this._ops.data;
			var tr, table = this._table, len = 0, editable = false;
			var itemCnt = this._ops.paging.num, dataObj;
			var start = (startPage - 1)*itemCnt, end;

			if (list == null)
			{
				return;
			}

			if (this._ops.hasHead == false && this._ops.head == null)
			{
				return;
			}

			len = this._getListLen();
			if (len == 0)
			{
				/* 生成空行 */
				this._state.isBlank = true;
				this._content_blank();
				this._cleanList(this._ops.id + "pagIngList");
				return;
			}

			editable = this._editable();
			len = len > this._ops.max ? this._ops.max:len;
			start = len - 1 - start;
			end = start - itemCnt + 1 || 0;

			/* 生成表的具体内容 */
			for (var i = len - 1; i >= 0; i--)
			{

				/* 原先的策略是如果不需要显示的tr，就先不初始化，这样会导致看不到的
				   tr无选择框，那么在点击“全选”按钮时就无法被选中。目前的全选要选择
				   到所有页，因此需初始化所有的tr。
				if (i > start || i < end)
				{
					tr = table.insertRow(-1);
					tr.insertCell(-1);
					tr.style.display = "none";
				}
				else
				{
					dataObj = data[i];
					tr = table.insertRow(-1);
					this._contentFill(tr, list, editable, i, dataObj, len);
				}
				*/
				dataObj = data[i];
				tr = table.insertRow(-1);
				this._contentFill(tr, list, editable, i, dataObj, len);
			}

			/* 刷新按钮状态 */
			this._flushBtn();

			/* 对表进行分页 */
			this._pageList(len, startPage);
		};

		/* 改变“所选”对应的toolBar中按钮的状态 */
		DataGrid.prototype._toolSelBtnState = function(enabled){
			var toolBarObj = this._ops.toolBar;
			var btn;

			if (toolBarObj == null)
			{
				return;
			}

			btn = this._toolBar.delSelBtn
			if (btn != null)
			{
				btn.className = (enabled == true ? "delSel" : "delSelUn");
				typeof toolBarObj.checkCallback == "function" && toolBarObj.checkCallback(enabled);
			}

			btn = this._toolBar.clrSelBtn
			if (btn != null)
			{
				btn.className = (enabled == true ? "clrEn" : "clrUn");
			}
		};

		DataGrid.prototype._selectAll = function(){
			var childNodes = this._table.rows;
			var childNum = childNodes.length;
			var isChecked = childNodes[0].cells[0].childNodes[0].checked;
			var checkbox, start, isSel = false;
			var selAllHd = this._ops.selAllHd;

			isChecked = this._ops.hasHead == true ? childNodes[0].cells[0].childNodes[0].checked : false;
			start = this._ops.hasHead == true ? 1 : 0;

			function handle(index)
			{
				/* 未加载数据的条目 */
				if (childNodes[index].cells.length == 1)
				{
					return;
				}

				/* 新添加但还未填充的条目 */
				if ( childNodes[index].cells.length == 0)
				{
					return;
				}

				checkbox = childNodes[index].cells[0].childNodes[0];

				/* 新添加已进行填充的条目 */
				if (checkbox == null)
				{
					return;
				}

				if (childNodes[index].style.display != "none")
				{
					checkbox.checked = isChecked;
				}

				if (checkbox.checked == true)
				{
					isSel = true;
				}
			}

			for(var index = start; index < childNum; index++)
			{
				if (typeof selAllHd == "function")
				{
					selAllHd(index, function(result){
						if (true == result)
						{
							handle(index);
						}
					});
				}
				else
				{
					handle(index);
				}
			}

			this._toolSelBtnState(isSel);
		};

		/* 生成全选的checkbox */
		DataGrid.prototype._selectAllCreate = function(len, pageNum){
			var input = document.createElement("input");
			var obj = this;

			input.type = "checkbox";
			input.className = "selAllBox";
			input.onclick = function(){
				obj._selectAll()
			};

			return input;
		};

		/* 创建表格头部 */
		DataGrid.prototype._headCreate = function(){
			var head = this._ops.head, obj = this;
			var tr, td , table = this._table, width;
			var opList = this._ops.list, con, p;
			var label, i, dataName, cellHeight;
			var tmpId = "DataGridSortHeadCellId";
			var headCells = this._state.headCells;
			var cellWidth = 0, headWidth = this._state.headWidth;

			if (this._ops.hasHead == false)
			{
				return;
			}

			if (head == null)
			{
				if (table.rows[0] != undefined)
				{
					this._state.colNum = table.rows[0].cells.length;
				}

				return;
			}

			tr = table.insertRow(-1);
			tr.className = this._ops.classCol.headClassName;
			this._state.colNum = this._ops.list.length;	// 获取表格的列数
			this._event.sortName = this._ops.sortName;
			width = parseInt(table.offsetWidth);

			if (this._ops.hasSelBox == true)
			{
				td = tr.insertCell(-1);
				td.appendChild(this._selectAllCreate());
				setStyle(td, {width:this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth, textAlign:"center"});
				width -= (parseInt(this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth) + 1);
				this._state.colNum++; // 获取表格的列数
			}

			if (this._ops.hasID == true)
			{
				td = tr.insertCell(-1);
				td.innerHTML = label.ID;
				setStyle(td, {width:this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth, textAlign:"center"});
				width -= (parseInt(this._ops.IDWidth ? this._ops.IDWidth : this._set.IDWidth) + 1);
				this._state.colNum++; // 获取表格的列数
			}

			if (this._ops.edit == true)
			{
				width -= (parseInt(this._set.editWidth) + 1);
			}

			width -= head.length;

			/* 识别是否需要排序 */
			for (var prop in head)
			{
				if (typeof (head[prop])["sort"] != "undefined")
				{
					this._event.sortable = true;
					break;
				}
			}

			/* 生成具体数据对应的表头 */
			for (var prop in head)
			{
				var temp = head[prop];

				dataName = opList[prop].name;
				td = tr.insertCell(-1);
				setStyle(td, {textAlign:"center", padding:parseFloat(this._ops.headpadding)+"px"});

				/* head.width: 设置单元格的宽度 */
				if (typeof temp["width"] != "undefined")
				{
					cellWidth = parseInt(temp.width/headWidth*width);
					headCells[prop] = (headCells[prop] == undefined ? {} : headCells[prop]);
					headCells[prop].width = cellWidth;
					setStyle(td, {width: cellWidth + "px"});
				}

				/* 获取单元格高度 */
				if (cellHeight == undefined)
				{
					cellHeight = td.offsetHeight;
				}

				if (true == this._event.sortable)
				{
					con = el("div");
					con.className = "dataGridSortDiv";
					td.appendChild(con);

					label = el("label");
					if (this._ops.sortName == dataName)
					{
						label.className = "dataGridSortLbl dataGridSortLblHv";
					}
					else
					{
						label.className = "dataGridSortLbl dataGridSortLblDe";
					}
					label.style.lineHeight = cellHeight + "px";
					label.innerHTML = temp.field;
					con.appendChild(label);

					i = el("i");
					if (this._ops.sortName == dataName && this._ops.sortType == "up")
					{
						i.className = "dataGridSortArrow dataGridSortUp";
					}
					else
					{
						i.className = "dataGridSortArrow dataGridSortDown";
					}

					i.style.display = this._ops.sortName == dataName ? "inline-block":"none";
					i.sortType = this._ops.sortName == dataName ? this._ops.sortType:"null";
					con.appendChild(i);

					p = el("p");
					if (this._ops.sortName == dataName)
					{
						p.className = "dataGridSortP dataGridSortPHv";
					}
					else
					{
						p.className = "dataGridSortP dataGridSortPDe";
					}
					p.innerHTML = "&nbsp;";	// for IE SIX 的最小高度
					con.appendChild(p);
				}
				else
				{
					con = td;
					td.innerHTML = temp.field;
				}

				/* head.sort: 设置单元格是否可排序 */
				if (typeof temp["sort"] != "undefined")
				{
					td.style.cursor = "pointer";
					td.onclick = (function(name){
						return function(){
							obj._sort(this, name);
						};
					})(dataName);

					td.onmouseover = (function(name){
						return function(){
							if (obj._event.sortName != name)
							{
								this.id = tmpId;
								$("#"+tmpId+" p.dataGridSortP").css("backgroundColor", "#86B157");
								this.id = "";
							}
						};
					})(dataName);

					td.onmouseout = (function(name){
						return function(){
							if (obj._event.sortName != name)
							{
								var tmpId = "DataGridSortHeadCellId";

								this.id = tmpId;
								$("#"+tmpId+" p.dataGridSortP").css("backgroundColor", "#E6E6E6");
								this.id = "";
							}
						};
					})(dataName);
				}
			}

			/* 生成编辑列 */
			if (this._ops.edit == true)
			{
				td = tr.insertCell(-1);
				td.innerHTML = btn.edit;
				setStyle(td, {width:this._set.editWidth, textAlign:"center"});
				this._state.colNum++; // 获取表格的列数
			}
		};

		/* 表格排序 */
		DataGrid.prototype._sort = function(td, name){
			var table = this._table;
			var arrows = $("#"+table.id+" i.dataGridSortArrow");
			var tmpId = "DataGridSortHeadCellId";
			var arrowTa, arrowSortType, arrowTaClass;

			td.id = tmpId;
			arrowTa = $("#"+tmpId+" i.dataGridSortArrow")[0];
			if (arrowTa.sortType == "null" || arrowTa.sortType == "up")
			{
				arrowSortType = "down";
				arrowTaClass = "dataGridSortArrow dataGridSortDown";
			}
			else
			{
				arrowSortType = "up";
				arrowTaClass = "dataGridSortArrow dataGridSortUp";
			}

			if (null == this._ops.sortFunc || false == this._ops.sortFunc(name, arrowSortType))
			{
				return;
			}

			this._event.sortName = name;

			/* 取消其他所有的sort状态 */
			$("#"+table.id+" p.dataGridSortP").css("backgroundColor", "#E6E6E6");
			$("#"+table.id+" label.dataGridSortLbl").css("color", "#737373");
			arrows.css("display", "none");
			for(var index in arrows)
			{
				arrows[index].sortType = "null";
			}

			/* 设置被选中的cell的sort状态 */
			$("#"+tmpId+" p.dataGridSortP").css("backgroundColor", "#86B157");
			$("#"+tmpId+" label.dataGridSortLbl").css("color", "#86B157");
			arrowTa.style.display = "inline-block";
			arrowTa.sortType = arrowSortType;
			arrowTa.className = arrowTaClass;

			td.id = "";
			this._refresh(this._pgList.page);
		};

		/* 补全数据默认值 */
		DataGrid.prototype._fillDefault = function(){
			var list = this._ops.list, item, type;

			for (var index in list)
			{
				item = list[index];

				if (item.type == undefined)
				{
					item.type = "str";
				}

				if (item.edit == undefined)
				{
					item.edit = true;
				}

				if (item.clear == undefined)
				{
					item.clear = false;
				}
			}
		};

		/* 计算表格头部的width和 */
		DataGrid.prototype._headWidthCol = function(){
			var head = this._ops.head;
			var width = 0, itemWidth;

			if (this._ops.hashead == false)
			{
				return;
			}

			for (var item in head)
			{
				itemWidth = head[item].width;
				if (undefined != itemWidth)
				{
					width += itemWidth;
				}
			}

			this._state.headWidth = width;
		};

		/* 初始化用户选项，将用户选项复制到对象属性中 */
		DataGrid.prototype._optionsInit = function(options){
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
			this._fillDefault();
			this._headWidthCol();
		};

		/* 获取目标表格 */
		DataGrid.prototype._getTableObj = function(){
			this._table = this._ops.obj;
			if (this._table == null)
			{
				this._table = id(this._ops.id);
			}
			return this._table;
		};

		/* 设置表格属性和样式等 */
		DataGrid.prototype._tableSet = function(){
			var classCol = this._ops.classCol;

			if (0 != classCol.gridClassName.length)
			{
				this._table.className = classCol.gridClassName;
			}

			if (0 != classCol.ListSpanClassName.length)
			{
				this._pgList.ListSpanClassName = classCol.ListSpanClassName;
			}

			if (this._ops.fixed == true)
			{
				setStyle(this._table, {tableLayout:"fixed"});
			}
		};

		/* 处理IESix的高度适应的问题 */
		DataGrid.prototype._IESixResize = function(){

			/* 处理IESix的问题 */
			if (isIESix == true && typeof highSetAutoFit != "undefined")
			{
				highSetAutoFit();
			}
		};

		/* 对表进行分页 */
		DataGrid.prototype._pageList = function(len, startPage){
			var table = this._table, parent = table.parentNode;
			var div = el("div"), paging = this._ops.paging;
			var listId = this._ops.id + "pagIngList";

			startPage = (startPage == undefined?1:startPage);
			startPage = (startPage < 1?1:startPage);
			if (this._pgList.id.length == 0)
			{
				this._pgList.id = div.id = listId;
				div.className = this._ops.classCol.gridPageListClassName;
				parent.appendChild(div);
				this._pgList.obj = div;
				div.style.overflow = "hidden";
			}

			this._cleanList(listId);
			this._fillList(listId, startPage, paging.num, this._ops.id, len);
		};

		DataGrid.prototype._pageListGetNiceScrollTop = function(objId){
			var childNode = getChildNode(this._ops.niceScroll.ta, "div", 0);

			return (getoffset(id(objId), childNode).top);
		};

		DataGrid.prototype._pageListNiceScrollTo = function(objId){
			var nicescoll = this._ops.niceScroll;
			var stTop;

			if (nicescoll != null)
			{
				stTop = parseInt(nicescoll.st.style.top)
				nicescoll._reset();
				nicescoll.scrollTo(stTop*nicescoll.scH/nicescoll.sbcH + 1);
			}
		};

		DataGrid.prototype._changeTable = function(start, rowNum){
			var childNodes = this._table.rows;
			var childNum = childNodes.length;
			var itemIndex = (this._ops.hasHead == true?(start+1):start);
			var endIndex = (this._ops.hasHead == true?start:(start-1));
			var temp = 0, editable = false;
			var list = this._ops.list;
			var data = this._ops.data
			var editable = this._editable(), len = 0;
			var isData = 0, display;

			this._pgList.page = parseInt(itemIndex/rowNum) + 1;
			len = (this._ops.hasHead == true ? childNum - 1 : childNum);
			isData = (this._eventStateGet() == "add" ? -1 : 0);
			len += isData;

			if (true == isIE)
			{
				if (true == isIENormal)
				{
					display = "table-row";
				}
				else
				{
					display = "block";
				}
			}
			else
			{
				display = "table-row";
			}

			for (var i = (this._ops.hasHead == true ? 1 : 0); i < childNum; i++)
			{
				var tr = childNodes[i];

				if (i < itemIndex || i > (endIndex + rowNum))
				{
					tr.style.display = "none";
				}
				else
				{
					// 此处为判断tr的cells的length为1时，表明即不是新添加的也不是已经完成添加的，即是空的
					if (tr.cells.length == 1)
					{
						tr.deleteCell(0);
						temp = len - i - isData;
						this._contentFill(tr, list, editable, temp, data[temp], len);
					}

					tr.style.display = display;
				}
			}

			if (this._ops.hasSelBox == true)
			{
				var isSel = false, isSelAll = childNum > 1 ? true:false, tr;

				for (var i = (this._ops.hasHead == true ? 1 : 0); i < childNum; i++)
				{
					tr = childNodes[i];

					if (tr.style.display != "none" && (tr.cells[0].childNodes[0] == null ||
						tr.cells[0].childNodes[0].checked == false))
					{
						isSelAll = false;
					}

					if (tr.cells[0].childNodes[0] != null &&
						tr.cells[0].childNodes[0].checked == true)
					{
						isSel = true;
					}
				}

				if (this._ops.hasHead == true)
				{
					childNodes[0].cells[0].childNodes[0].checked = isSelAll;
				}

				this._toolSelBtnState(isSel);
			}

			this._IESixResize();
		};

		DataGrid.prototype._changeListDiv = function(listDivId, marginwidth){
			var plWidth = 126;
			var num =  id(listDivId).childNodes.length;
			var width = num*25, listDivWidth = 0;

			if (isIESix == true)
			{
				var pageListContent = $("#" + this._ops.id + "pagIngList div." + this._pgList.plcClassName)[0];

				marginwidth = marginwidth > 0 ? marginwidth : -1*marginwidth;
				listDivWidth = width - marginwidth;
				pageListContent.style.width = listDivWidth < plWidth ? listDivWidth + "px" : plWidth + "px";
			}
		};

		DataGrid.prototype._listNodeClick = function(nodeNum, objId, tableId, rowNum, isInit){
			var obj = this;
			var num = this._pgList.num;
			var listDiv = objId + this._pgList.listDivStr;
			var listDivObj = id(listDiv);
			var listArrowRId = objId + this._pgList.listArrowRStr;
			var listArrowLId = objId + this._pgList.listArrowLStr;
			var nodes = listDivObj.childNodes;
			var len = nodes.length;
			var defaultId = 0;
			var tmp = 0, tpm = 0, nodeTmp = nodeNum;
			var listDivObjMl = listDivObj.style.marginLeft;

			var func = function (){
				nodes[nodeNum].className = obj._pgList.ListSpanSClassName;
				nodes[nodeNum].style.cursor = "default";
			};

			var funcL = function(){
				tmp = (obj._pgList.listMarginLeft*(num - 2)*(((nodeNum+1) - num)/(num - 2) + 1));
				listDivObj.style.marginLeft = -1*tmp + "px";
				obj._changeListDiv(listDiv, tmp);
			};

			var funcR = function(){
				tmp = (obj._pgList.listMarginLeft*(num - 2)*(((nodeNum+1) - (num - 2 + 1))/(num - 2)));
				listDivObj.style.marginLeft = -1*tmp + "px";
				obj._changeListDiv(listDiv, tmp);
			};

			var funcF = function(){
				listDivObj.style.marginLeft = "0px";
				obj._changeListDiv(listDiv, 0);
			};

			var funcLa = function(){
				var n = parseInt((nodeNum + 1 - num) / (num - 2));
				if (nodeNum < (num - 1))
				{
					return;
				}

				tpm = num + n*(num - 2) - 1;
				tmp = (obj._pgList.listMarginLeft*(num - 2)*(((tpm + 1) - num)/(num - 2) + 1));
				listDivObj.style.marginLeft = -1*tmp + "px";
				obj._changeListDiv(listDiv, tmp);
			};

			if (nodes[nodeNum].style.cursor == "default")
			{
				return;
			}

			for (var i = 0; i < len; i++)
			{
				if (nodes[i].style.cursor == "default")	// 判断是否是点击之前所显示的页
				{
					nodes[i].className = this._pgList.ListSpanClassName;
					nodes[i].style.cursor = "pointer";
					defaultId = i;
					break;
				}
			}

			if (isInit == true) // 处理初始化表格的情况
			{
				nodeTmp = Math.floor((nodeNum + 1 - num)/(num - 2)) * (num - 2) + (num - 1);
				nodeTmp = (nodeTmp < 0) ? 0 : nodeTmp;
			}

			if (nodeTmp == 0)
			{
				id(listArrowLId).disabled = true;
				id(listArrowRId).disabled = false;
				func();
				funcF();
			}
			else if (nodeTmp == (len - 1))
			{
				id(listArrowLId).disabled = false;
				id(listArrowRId).disabled = true;
				func();
				funcLa();
			}
			else if ((((nodeTmp + 1 - num) % (num - 2)) == 0)&&((nodeTmp + 1 - num) >= 0))	// 左移跳转
			{
				id(listArrowLId).disabled = false;
				id(listArrowRId).disabled = false;
				func();

				if (nodeTmp > defaultId)
				{
					funcL();
					funcLa();
				}
			}
			else if ((((nodeTmp + 2 - num) % (num - 2)) == 0)&&((nodeTmp + 2 - num) >= 0))	// 右移跳转
			{
				id(listArrowLId).disabled = false;
				id(listArrowRId).disabled = false;
				func();

				if (nodeTmp < defaultId)
				{
					funcR();
				}
			}
			else
			{
				id(listArrowLId).disabled = false;
				id(listArrowRId).disabled = false;
				func();
			}

			if (nodeNum == (len - 1))	// 如果直接跳转到末页
			{
				id(listArrowRId).disabled = true;
			}

			this._changeTable(nodeNum*rowNum, rowNum);
		};

		DataGrid.prototype._listMove = function(objId, isRight, tableId, rowNum){
			var obj = this, tmp;
			var num = this._pgList.num;
			var listDiv = objId + this._pgList.listDivStr;
			var listArrowRId = objId + this._pgList.listArrowRStr;
			var listArrowLId = objId + this._pgList.listArrowLStr;
			var listDivObj = id(listDiv);
			var nodes = listDivObj.childNodes;
			var len = nodes.length;
			var magicNum = (isRight == true ? 1 : -1);
			var numT = (isRight == true ? num : num);
			var listArrowR = id(listArrowRId);
			var listArrowL = id(listArrowLId);

			var func = function (){	// 改变节点样式
				nodes[i].className = obj._pgList.ListSpanClassName;
				nodes[i].style.cursor = "pointer";
				nodes[i+magicNum].className = obj._pgList.ListSpanSClassName;
				nodes[i+magicNum].style.cursor = "default";
			};

			var funcT = function (){	// 进行跳转
				var listMarginLeft = obj._pgList.listMarginLeft;
				var listDivObjMl = listDivObj.style.marginLeft;
				if (!listDivObjMl || listDivObjMl == "0px")
				{
					tmp = magicNum*(listMarginLeft*(num - 2));
					obj._changeListDiv(listDiv, tmp);
					listDivObj.style.marginLeft = -1*tmp + "px";
				}
				else
				{
					tmp = parseInt(listDivObjMl) + -1*magicNum*(listMarginLeft*(num - 2));
					obj._changeListDiv(listDiv, tmp);
					listDivObj.style.marginLeft = tmp + "px";
				}
			};

			/* 已经达到第一页或尾页，则直接退出 */
			if ((isRight == true && listArrowR.disabled == true) ||
				(isRight == false && listArrowL.disabled == true))
			{
				return;
			}

			for (var i = 0; i < len; i++)
			{
				if (nodes[i].style.cursor == "default")	// 判断是否是点击之前所显示的页
				{
					if ((i == (len - 2))&&isRight)	// 判断是否是倒数第二个
					{
						func();
						listArrowR.disabled = isRight;
						listArrowL.disabled = !isRight;

						if ((((i + 2 - num) % (num - 2)) == 0)&&((i + 2 - num) >= 0))	// 判断该节点是否是跳转节点
						{
							funcT();
						}
					}
					else if ((i == 1)&&!isRight)
					{
						func();
						listArrowR.disabled = isRight;
						listArrowL.disabled = !isRight;
					}
					else if ((((i + 2 - num) % (num - 2)) == 0)&&((i + 2 - num) >= 0)&&isRight) // 判断该节点是否是跳转节点
					{
						func();
						funcT();
						listArrowR.disabled = !isRight;
						listArrowL.disabled = !isRight;
					}
					else if ((((i + 1 - num) % (num - 2)) == 0)&&((i + 1 - num) >= 0)&&!isRight)
					{
						func();
						funcT();
						listArrowR.disabled = isRight;
						listArrowL.disabled = isRight;
					}
					else
					{
						func();
						if (isRight)
						{
							listArrowL.disabled = !isRight;
						}
						else
						{
							listArrowR.disabled = isRight;
						}
					}

					if (isRight)
					{
						this._changeTable((i+1)*rowNum, rowNum);
					}
					else
					{
						this._changeTable((i - 1)*rowNum, rowNum);
					}

					return true;
				}
			}

			clearSelection();
		};

		/*
			listId: list的id
			pageNum: 当前要显示的项（默认值）
			rowNum:一页中的条目数
			tableId:表格id
			listNum:table中的row的数目
		*/
		DataGrid.prototype._fillList = function(listId, pageNum, rowNum, tableId, listNum){
			var objList = id(listId);
			var preStr = btn.prePage;
			var nextStr = btn.nextPage;
			var classArrow = "pageArrow";
			var classArrowL = "pageArrowL";
			var classArrowR = "pageArrowR";
			var pageArrowFi = "pageArrowFi";
			var pageArrowLa = "pageArrowLa";
			var pageListDiv = "pageListDiv";
			var datasLen = listNum;
			var len = datasLen/rowNum + ((0 == datasLen || datasLen%rowNum > 0) ? 1: 0);
			var table = id(tableId);
			var i, obj = this, length = 0, display;

			if (datasLen <= rowNum)
			{
				var tableRows = table.rows;

				id(listId).style.display = "none";
				if (true == isIE)
				{
					if (true == isIENormal)
					{
						display = "table-row";
					}
					else
					{
						display = "block";
					}
				}
				else
				{
					display = "table-row";
				}

				for (i = 0, length = tableRows.length; i < length; i++)
				{
					tableRows[i].style.display = display;
				}

				this._changeTable(0, rowNum);
			}
			else
			{
				id(listId).style.display = "block";
				var pageLast = document.createElement("span");
				pageLast.className = classArrow + " "+pageArrowLa;
				pageLast.id = (listId + this._pgList.listArrowRStr);
				pageLast.onclick = function(){
					if (null != obj._ops.pageTurnFunc)
					{
						obj._ops.pageTurnFunc(parseInt(len));
					}
					else
					{
						obj._listNodeClick(parseInt(len - 1), listId, tableId, rowNum);
					}
					obj._pageListNiceScrollTo(listId);
				};
				objList.appendChild(pageLast);

				var pageNext = document.createElement("span");
				pageNext.className = classArrow + " "+classArrowL;
				pageNext.id = (listId + this._pgList.listArrowRStr);
				pageNext.onclick = function(){
					if (null != obj._ops.pageTurnFunc)
					{
						var page = obj._pgList.page;
						page += (page == parseInt(len)) ? 0 : 1;
						obj._ops.pageTurnFunc(page);
					}
					else
					{
						obj._listMove(listId, true, tableId, rowNum);
					}
					obj._pageListNiceScrollTo(listId);
				};
				objList.appendChild(pageNext);

				var contentDiv = document.createElement("div");
				contentDiv.className = this._pgList.plcClassName;
				objList.appendChild(contentDiv);

				var listDiv = document.createElement("div");
				listDiv.className = pageListDiv;
				listDiv.id = (listId + this._pgList.listDivStr);
				contentDiv.appendChild(listDiv);
				for (i = 1; i <= len; i++)
				{
					var span = document.createElement("span");
					span.innerHTML = i;
					span.className = this._pgList.ListSpanClassName;
					span.onclick = (function(index){
						return function(){
							if (null != obj._ops.pageTurnFunc)
							{
								obj._ops.pageTurnFunc(parseInt(index+1));
							}
							else
							{
								obj._listNodeClick(index, listId, tableId, rowNum);
							}
						};
					})(i-1);

					listDiv.appendChild(span);
				}

				var pagePre = document.createElement("span");
				pagePre.className = classArrow + " "+classArrowR;
				pagePre.id = (listId + this._pgList.listArrowLStr);
				pagePre.onclick = function(){
					if (null != obj._ops.pageTurnFunc)
					{
						var page = obj._pgList.page;
						page += (page == 1) ? 0 : -1;
						obj._ops.pageTurnFunc(page);
					}
					else
					{
						obj._listMove(listId, false, tableId, rowNum);
					}
				};
				objList.appendChild(pagePre);

				var pageFirst = document.createElement("span");
				pageFirst.className = classArrow + " "+pageArrowFi;
				pageFirst.id = (listId + this._pgList.listArrowRStr);
				pageFirst.onclick = function(){
					if (null != obj._ops.pageTurnFunc)
					{
						obj._ops.pageTurnFunc(1);
					}
					else
					{
						obj._listNodeClick(0, listId, tableId, rowNum);
					}
				};
				objList.appendChild(pageFirst);

				this._listNodeClick(pageNum-1, listId, tableId, rowNum, true); // 初始化
			}

			clearSelection();
		};

		DataGrid.prototype._cleanList = function(listId){
			var pageList = id(listId);

			if (pageList != null)
			{
				pageList.innerHTML = "";
			}
		};
	}
}
