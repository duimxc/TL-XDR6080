function menuTool_BC(){this.menuOption={menuUlId:"",menuConId:"",conId:"",menuList:{},menuClickPreHd:{},pageLoad:{},menuClickCallBack:{},niceScrollStyles:{},loadNewPage:!0};"undefined"==typeof menuTool_BC.prototype.init&&(this.init=function(a){this.menuOptionInit(a);this.menuCreate()},this.menuOptionInit=function(a){var b=this.menuOption,c;for(c in a)void 0!=b[c]&&(b[c]=a[c])},this.menuCreate=function(){var a=id(this.menuOption.menuUlId),b,c,d,e=this.menuOption.menuList,f=this;a.innerHTML="";for(var g in e)b=
e[g],null!==b&&(c=document.createElement("li"),c.id=g.toString(),c.url=b.url,c.className="menuLi",c.onclick=function(a){return function(){$("#dualWanWrapper").hide();f.menuClick(a)}}(b.url),d=document.createElement("i"),d.className="menuImg "+b.className,c.appendChild(d),d=document.createElement("label"),d.innerHTML=b.value,d.className="menuLbl",c.appendChild(d),d=document.createElement("i"),d.className="menuC",c.appendChild(d),a.appendChild(c));this.menuOption.pageLoad();0!=this.menuOption.menuConId.length&&
(a=new NiceScroll(this.menuOption.menuConId),a.scrollTipOpacity(1),a.scrollTipSet(this.menuOption.niceScrollStyles),a.init(),a.scrollTo(0))},this.menuLoad=function(a,b){var c=id(this.menuOption.conId),d=this.menuOption.menuClickPreHd;if("function"!=typeof d||!1!=d({url:a}))!0==isIESix&&(c.style.height=""),this.menuOption.loadNewPage?(c.innerHTML="",loadPage(a,this.menuOption.conId,function(){"function"==typeof b&&b()})):"function"==typeof b&&b(a)},this.menuClick=function(a){for(var b=id(this.menuOption.menuUlId).childNodes,
c="",d,e=0,f=b.length;e<f;e++)d=b[e],1==d.nodeType&&(d.url==a?(d.className="menuLiClick",c=a):d.className="menuLi");void 0!=c&&this.menuLoad(c,this.menuOption.menuClickCallBack)})}
function menuInit_BRS(){var a={cloudAnt_rsMenu:{value:menuStr.cloudManage,className:"hsMenuCloud",url:"CloudAccountCfg.htm"},network_rsMenu:{value:menuStr.networkSet,className:"hsMenuNetWork",url:"WanCfg.htm"},wireless2G_rsMenu:{value:menuStr.wifi2G,className:"hsMenuWlan",url:"WlanCfg.htm"},portSet_rsMenu:{value:menuStr.portSet,className:"hsMenuPortSet",url:"PortCfg.htm"},lanSet_rsMenu:{value:menuStr.lanSet,className:"hsMenuNetControl",url:"LanCfg.htm"},hHnat_rsMenu:{value:menuStr.hnat,className:"hsMenuHNat",
url:"HNat.htm"},networkIpv6_rsMenu:{value:menuStr.ivp6Set,className:"hsMenuNetWork",url:"WanIpv6Cfg.htm"},dhcpServer_rsMenu:{value:menuStr.DHCPServer,className:"hsMenuAdvUser",url:"DHCPServer.htm"},fileShare_rsMenu:{value:menuStr.fileShare,className:"hsMenuFileShare",url:"FileShare.htm"},pbcEnable_rsMenu:{value:menuStr.pbcEnable,className:"hsMenuPbcEnable",url:"PbcEnable.htm"},sysUpgrade_rsMenu:{value:menuStr.upgrade,className:"hsMenuEquipment",url:gEasyMeshUpgradeSupport?"SysUpgradeEyUp.htm":"SysUpgrade.htm"},
changeWebPwd_rsMenu:{value:gUsernameSupport?menuStr.changeLgUsrPwd:menuStr.changeLgPwd,className:"hsMenuCHgPwd",url:"SysChangeLgPwd.htm"},bakRrestore_rsMenu:{value:menuStr.backupload,className:"hsMenuBakRs",url:"SysBakNRestore.htm"},reBootSet_rsMenu:{value:menuStr.reBootSet,className:"hsMenuReBootSet",url:"SysRebootNReset.htm"},ledSet_rsMenu:{value:menuStr.hyfiLed,className:"hsMenuLed",url:"HyFiLed.htm"},eLink_rsMenu:{value:menuStr.elink,className:"hsMenuElink",url:"Elink.htm"},woLink_rsMenu:{value:menuStr.wolink,
className:"hsMenuElink",url:"Wolink.htm"},bridgeSwitch_rsMenu:{value:menuStr.bridgeSwitch,className:"hsMenuBridgeSwitch",url:"BridgeSwitch.htm"},customLed_rsMenu:{value:menuStr.hyfiLed,className:"hsMenuCustomLed",url:"CustomLed.htm"},telnet_rsMenu:{value:menuStr.telnet,className:"hsMenuTelnet",url:"Telnet.htm"},alinkTest_rsMenu:{value:menuStr.alinkTest,className:"hsMenuAlinkTest",url:"AlinkClient.htm"},smbCloudManage_rsMenu:{value:menuStr.smbCloudManage,className:"hsMenuSmbCloudManage",url:"SmbCloudManage.htm"},
sysLog_rsMenu:{value:menuStr.syslog,className:"hsMenuSysLog",url:"SystemLog.htm"}};gNasSupport||delete a.fileShare_rsMenu;gElinkSupport||delete a.eLink_rsMenu;gModeSwitchSupport||delete a.bridgeSwitch_rsMenu;gWoLinkSupport||delete a.woLink_rsMenu;gCustomLedSupport||delete a.customLed_rsMenu;gHnatSupport||delete a.hHnat_rsMenu;gIpv6Support||delete a.networkIpv6_rsMenu;gSmbCloudSupport||delete a.smbCloudManage_rsMenu;gTelnetSupport||delete a.telnet_rsMenu;gAlinkTestSupport||delete a.alinkTest_rsMenu;
gMeshSupport||(delete a.pbcEnable_rsMenu,delete a.ledSet_rsMenu);gSfpRateSupport||gSupportPortManage||delete a.portSet_rsMenu;var b=new menuTool_BC;b.init({menuUlId:"menuBRSUl",menuConId:"routeSetLMenuCon",conId:"routeSetRCon",menuList:a,pageLoad:function(){if(0!=gOnlineUpgradeNote.length)b.menuOption.menuClickCallBack=function(){showAlert(gOnlineUpgradeNote);gOnlineUpgradeNote="";b.menuOption.menuClickCallBack=null},b.menuClick(a.sysUpgrade_rsMenu.url);else if(0!=gBasicMenu.subMenuUrl.length)b.menuClick(gBasicMenu.subMenuUrl),
setBasicSubMenuUrl("");else id("menuBRSUl").childNodes[0].onclick();setBasicMenu(void 0,"")},niceScrollStyles:{background:"#4ABDE0"}})}
function menuInit_Apps(a){var b={cloudAnt_rsMenu:{value:menuStr.cloudMarket,className:"apps_market",url:"AppsMarket.htm"},network_rsMenu:{value:menuStr.cloudAppsInstall,className:"apps_apllyList",url:"AppsInstalled.htm"}},c=new menuTool_BC;c.init({menuUlId:"menuBAppsUl",conId:"appsRCon",menuList:b,menuClickPreHd:a,pageLoad:function(){if(0!=gBasicMenu.subMenuUrl.length)c.menuClick(gBasicMenu.subMenuUrl),setBasicSubMenuUrl("");else id("menuBAppsUl").childNodes[1].onclick();setBasicMenu(void 0,"")}})}
;
