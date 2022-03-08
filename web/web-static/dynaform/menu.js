function menuTool_BC()
{
	this.menuOption = {
		menuUlId:"",
		menuConId:"",
		conId:"",
		menuList:{},
		menuClickPreHd:{},
		pageLoad:{},
		menuClickCallBack:{},
		niceScrollStyles:{},
		loadNewPage:true
	};

	if (typeof menuTool_BC.prototype.init == "undefined")
	{
		this.init = function(optionObj)
		{
			this.menuOptionInit(optionObj);
			this.menuCreate();
		};

		this.menuOptionInit = function(optionObj)
		{
			var menuOption = this.menuOption;
			for (var prop in optionObj)
			{
				if (menuOption[prop] != undefined)
				{
					menuOption[prop] = optionObj[prop];
				}
			}
		};

		this.menuCreate = function()
		{
			var menuUl = id(this.menuOption.menuUlId);
			var menuObject, li, i, lbl, listScroll;
			var menuList = this.menuOption.menuList;
			var objThis = this;

			menuUl.innerHTML = "";
			for(var menuObj in menuList)
			{
				menuObject = menuList[menuObj];
				if (menuObject === null)
				{
					continue;
				}

				li = document.createElement("li");
				li.id = menuObj.toString();
				li.url = menuObject.url;
				li.className = "menuLi";
				li.onclick = (function(url){
					return function(){
						$("#dualWanWrapper").hide();
						objThis.menuClick(url);
					}
				})(menuObject.url);

				i = document.createElement("i");
				i.className = "menuImg " + menuObject.className;
				li.appendChild(i);

				lbl = document.createElement("label");
				lbl.innerHTML = menuObject.value;
				lbl.className = "menuLbl";
				li.appendChild(lbl);

				i = document.createElement("i");
				i.className = "menuC";
				li.appendChild(i);

				menuUl.appendChild(li);
			}

			this.menuOption.pageLoad();

			/* 创建niceScroll */
			if (0 != this.menuOption.menuConId.length)
			{
				listScroll = new NiceScroll(this.menuOption.menuConId)
				listScroll.scrollTipOpacity(1);
				listScroll.scrollTipSet(this.menuOption.niceScrollStyles);
				listScroll.init();
				listScroll.scrollTo(0);
			}
		};

		this.menuLoad = function(url, callBack)
		{
			var pageCon = id(this.menuOption.conId);
			var menuClickPreHd = this.menuOption.menuClickPreHd;

			/* 如果在menuClick之前的处理函数返回的是false，则直接退出 */
			if (typeof menuClickPreHd == "function" && false == menuClickPreHd({url:url}))
			{
				return;
			}

			if (isIESix == true)
			{
				pageCon.style.height = "";
			}

			if (this.menuOption.loadNewPage)
			{
				pageCon.innerHTML = "";
				loadPage(url, this.menuOption.conId, function(){
					typeof callBack == "function" && callBack();
				});
			}
			else
			{
				typeof callBack == "function" && callBack(url);
			}

		};

		this.menuClick = function(url)
		{
			var subLi = id(this.menuOption.menuUlId).childNodes;
			var targetUrl = "", subLiObj;

			for(var i = 0, j = subLi.length; i < j; i++)
			{
				subLiObj = subLi[i];
				if (subLiObj.nodeType != 1)
				{
					continue;
				}

				if (subLiObj.url == url)
				{
					subLiObj.className = "menuLiClick";
					targetUrl = url;
				}
				else
				{
					subLiObj.className = "menuLi";
				}
			}

			if (targetUrl != undefined)
			{
				this.menuLoad(targetUrl, this.menuOption.menuClickCallBack);
			}
		};
	}
}

function menuInit_BRS()
{
	var menuList = {
		cloudAnt_rsMenu:{
			value: menuStr.cloudManage,
			className:"hsMenuCloud",
			url: "CloudAccountCfg.htm"
		},
		network_rsMenu:{
			value: menuStr.networkSet,
			className:"hsMenuNetWork",
			url: "WanCfg.htm"
		},
		wireless2G_rsMenu:{
			value: menuStr.wifi2G,
			className:"hsMenuWlan",
			url: "WlanCfg.htm"
		},
		portSet_rsMenu:{
			value: menuStr.portSet,
			className: "hsMenuPortSet",
			url:"PortCfg.htm"
		},
		lanSet_rsMenu:{
			value: menuStr.lanSet,
			className:"hsMenuNetControl",
			url: "LanCfg.htm"
		},
		hHnat_rsMenu:{
			value: menuStr.hnat,
			className:"hsMenuHNat",
			url: "HNat.htm"
		},
		networkIpv6_rsMenu:{
			value: menuStr.ivp6Set,
			className:"hsMenuNetWork",
			url: "WanIpv6Cfg.htm"
		},
		dhcpServer_rsMenu:{
			value: menuStr.DHCPServer,
			className:"hsMenuAdvUser",
			url: "DHCPServer.htm"
		},
		fileShare_rsMenu:{
			value: menuStr.fileShare,
			className:"hsMenuFileShare",
			url: "FileShare.htm"
		},
		pbcEnable_rsMenu:{
			value:menuStr.pbcEnable,
			className:"hsMenuPbcEnable",
			url: "PbcEnable.htm"
		},
		sysUpgrade_rsMenu:{
			value: menuStr.upgrade,
			className:"hsMenuEquipment",
			url: gEasyMeshUpgradeSupport?"SysUpgradeEyUp.htm": "SysUpgrade.htm"
		},
		changeWebPwd_rsMenu:{
			value: gUsernameSupport ? menuStr.changeLgUsrPwd : menuStr.changeLgPwd,
			className:"hsMenuCHgPwd",
			url: "SysChangeLgPwd.htm"
		},
		bakRrestore_rsMenu:{
			value: menuStr.backupload,
			className:"hsMenuBakRs",
			url: "SysBakNRestore.htm"
		},
		reBootSet_rsMenu:{
			value: menuStr.reBootSet,
			className:"hsMenuReBootSet",
			url: "SysRebootNReset.htm"
		},
		ledSet_rsMenu:{
			value:menuStr.hyfiLed,
			className:"hsMenuLed",
			url:"HyFiLed.htm"
		},
		eLink_rsMenu:{
			value: menuStr.elink,
			className:"hsMenuElink",
			url: "Elink.htm"
		},
		woLink_rsMenu:{
			value: menuStr.wolink,
			className:"hsMenuElink",
			url: "Wolink.htm"
		},
		bridgeSwitch_rsMenu:{
			value: menuStr.bridgeSwitch,
			className:"hsMenuBridgeSwitch",
			url: "BridgeSwitch.htm"
		},
		customLed_rsMenu:{
			value: menuStr.hyfiLed,
			className:"hsMenuCustomLed",
			url: "CustomLed.htm"
		},
		telnet_rsMenu:{
			value: menuStr.telnet,
			className:"hsMenuTelnet",
			url: "Telnet.htm"
		},
		alinkTest_rsMenu:{
			value: menuStr.alinkTest,
			className:"hsMenuAlinkTest",
			url: "AlinkClient.htm"
		},
		smbCloudManage_rsMenu:{
			value: menuStr.smbCloudManage,
			className:"hsMenuSmbCloudManage",
			url: "SmbCloudManage.htm"
		},
		sysLog_rsMenu:{
			value: menuStr.syslog,
			className:"hsMenuSysLog",
			url: "SystemLog.htm"
		}
	};

	if (!gNasSupport) {
		delete menuList.fileShare_rsMenu;
	}

	if (!gElinkSupport) {
		delete menuList.eLink_rsMenu;
	}

	if (!gModeSwitchSupport) {
		delete menuList.bridgeSwitch_rsMenu;
	}

	if (!gWoLinkSupport) {
		delete menuList.woLink_rsMenu;
	}

	if (!gCustomLedSupport) {
		delete menuList.customLed_rsMenu;
	}

	if (!gHnatSupport) {
		delete menuList.hHnat_rsMenu;
	}

	if (!gIpv6Support) {
		delete menuList.networkIpv6_rsMenu;
	}

	if (!gSmbCloudSupport) {
		delete menuList.smbCloudManage_rsMenu;
	}

	if (!gTelnetSupport)
	{
		delete menuList.telnet_rsMenu;
	}

	if (!gAlinkTestSupport) {
		delete menuList.alinkTest_rsMenu;
	}

	if(!gMeshSupport) {
		delete menuList.pbcEnable_rsMenu;
		delete menuList.ledSet_rsMenu;
	}

	if(!gSfpRateSupport && !gSupportPortManage) {
		delete menuList.portSet_rsMenu;
	}

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"menuBRSUl",
		menuConId:"routeSetLMenuCon",
		conId:"routeSetRCon",
		menuList:menuList,
		pageLoad:function(){
			if (gOnlineUpgradeNote.length != 0)
			{
				menuTool.menuOption.menuClickCallBack = function(){
					showAlert(gOnlineUpgradeNote);
					gOnlineUpgradeNote = "";
					menuTool.menuOption.menuClickCallBack = null;
				};
				menuTool.menuClick(menuList.sysUpgrade_rsMenu.url);
			}
			else if (0 != gBasicMenu.subMenuUrl.length)
			{
				menuTool.menuClick(gBasicMenu.subMenuUrl);
				setBasicSubMenuUrl("");
			}
			else
			{
				id("menuBRSUl").childNodes[0].onclick();
			}

			setBasicMenu(undefined, "");
		},
		niceScrollStyles:{"background":"#4ABDE0"}
	});
}

function menuInit_Apps(menuClickPreHd)
{
	var menuList = {
		cloudAnt_rsMenu:{
			value: menuStr.cloudMarket,
			className:"apps_market",
			url: "AppsMarket.htm"
		},
		network_rsMenu:{
			value: menuStr.cloudAppsInstall,
			className:"apps_apllyList",
			url: "AppsInstalled.htm"
		}
	};

	var menuTool = new menuTool_BC();

	menuTool.init({
		menuUlId:"menuBAppsUl",
		conId:"appsRCon",
		menuList:menuList,
		menuClickPreHd:menuClickPreHd,
		pageLoad:function(){
			if (0 != gBasicMenu.subMenuUrl.length)
			{
				menuTool.menuClick(gBasicMenu.subMenuUrl);
				setBasicSubMenuUrl("");
			}
			else
			{
				id("menuBAppsUl").childNodes[1].onclick();
			}

			setBasicMenu(undefined, "");
		}
	});
}