var uciAppInfo =
{
	fileName:		"plugin_config",

	secType:
	{

	},
	secName :
	{
		plugin: "plugin"
	},
	optName:
	{
		total: "total",
		used: "used",
		marketApp: "market_plugin",
		installedApp: "installed_plugin",
		updateNum: "can_update",
		notInstalledNum: "not_installed",
		property:"property",
		preUpdating:"pre_updating"
	},
	listName :
	{

	},
	dynData :
	{

	},
	dynOptName :
	{
		id : "plugin_id",
		name: "name",
		size: "size",
		iconURL: "icon_url",
		status: "status",
		updated: "can_update",
		version: "version",
		lastVersion: "last_version",
		lastSize: "last_size",
		pageURL: "uri",
		author: "author",
		releaseTime: "release_time",
		descriptionUrl: "desc_url",
		action:"action",
		progress:"progress",
		start: "start",
		end: "end",
		updateLog:"update_log",
		operaType:"opera_type"
	},
	dynOptValue :
	{
		installed:
		{
			yes : 0,
			no : 1
		},
		updated:
		{
			yes: 1,
			no: 0
		},
		action:
		{
			install: "install",
			uninstall: "uninstall",
			update: "update"
		},
		properties:
		{
			preInstall:0,
			handleInstall:1
		},
		operaType:
		{
			install:"1",
			uninstall:"2",
			update:"3"
		},
		actionInstall:"install",
		actionUninstall:"uninstall",
		actionUpdate:"update"
	},
	actionName : {
		install : "install_plugin",
		uninstall : "uninstall_plugin",
		update: "update_plugin",
		view: "view_plugin",
		open: "open_plugin",
		getMarketApp: "get_market_plugin",
		getInstalledApp: "get_installed_plugin",
		getStorageInfo: "get_storage_info",
		getAppStatus:"get_plugin_status",
		getUpdateInfo: "get_update_info",
		getUninstalledInfo: "get_uninstalled_info"
	},
	actionDetail: {
		appIDList: "plugin_id_list"
	}
};

var uciNetwork =
{
	fileName:	"network",
	secType:
	{
		iface:	"interface",
		user_route:  "user_route",
		sys_route: "sys_route"
	},
	secName:
	{
		lan:	"lan",
		wan:	"wan",
		massiveSta: "massive_sta_capacity"
	},
	optName:
	{
		ifName:		"ifname",
		proto:		"proto",
		ip:			"ipaddr",
		pppoeUsr:	"username",
		pppoePass:	"password",
		netmask:	"netmask",
		ipMode:		"ip_mode",
		gateway:	"gateway",
		dns:		"dns",
		priDns:		"pri_dns",
		sndDns:		"snd_dns",
		mtu:		"mtu",
		upTime:		"up_time",
		speed:		"speed_duplex",
		mac:		"macaddr",
		target:     "target",
		iface:      "interface",
		facIp:		"fac_ipaddr",
		phyStatus:	"phy_status",
		wanStatus:	"link_status",
		code:		"error_code",
		upSpeed:	"up_speed",
		downSpeed:	"down_speed"
	},
	optValue:
	{
		proto:
		{
			dynIp:"dhcp",
			staticIp:"static",
			pppoe:"pppoe",
			none:"none"
		},
		ifname:
		{
			wan:"eth0",
			lan:"br-lan",
			host:"host",
			factory:"factory"
		},
		ipMode:
		{
			dynamic:"dynamic",
			manual:"manual"
		}
	},
	dynData:
	{
		wanStatus:	"wan_status",
		lanStatus:	"lan_status",
		wanProto:	"wan_proto",
		ifaceMac:	"iface_mac"
	},
	action:
	{
		wanDetect:	"detect_wan_proto"
	}
};

var uciCustomNetwork =
{
	fileName:	"custom_network",
	secName:
	{
		macFilterConfig: "mac_filter_config"
	},
	optName:
	{
		mode:		"mode",
		enable: 	"enable",
		policy: "policy",
		owner: "owner",
		accessRight: "accessright"
	},
	optValue:
	{
		mode:
		{
			route:	0,
			bridge:	1
		},
		owner:
		{
			web: "web",
			andlink: "andlink"
		},
		macFilterConfig:
		{
			on: 'on',
			off: 'off'
		},
		accessRight:
		{
			allAllow: "111",
			allForbid: "000"
		}
	},
	dynData:
	{
		bridgestatus: "bridge_status",
		macFilterConfig: "mac_filter_config",
		macFilterBlackEntry: "mac_filter_black_entry",
		macFilterWhiteEntry: "mac_filter_white_entry",
		macFilterWhiteBlockList: "mac_filter_white_block_list"
	}
};

var uciWlanAccess =
{
	fileName: "wlan_access",
	dynData:
	{
		blockList: "block_list"
	},
	optName:
	{
		config: "config",
		enable: "enable"
	}
};

var uciProto =
{
	fileName:	"protocol",
	secType:
	{
		iface:	"interface",
		proto:	"proto"
	},
	secName:
	{
		wan:	"wan",
		dhcp:	"dhcp",
		sta:	"static",
		pppoe:	"pppoe",
		mobile: "monet"
	},
	optName:
	{
		type:		"wan_type",
		port:		"wan_port",
		rate:		"wan_rate",
		proto:		"proto",
		ip:			"ipaddr",
		pppoeUsr:	"username",
		pppoePwd:	"password",
		netmask:	"netmask",
		gateway:	"gateway",
		dnsMode:	"dns_mode",
		priDns:		"pri_dns",
		sndDns:		"snd_dns",
		mtu:		"mtu",
		speed:		"wan_rate",
		dialMode:	"dial_mode",
		connMode:	"conn_mode",
		demand:		"demand_idle",
		manual:		"manual_idle",
		ipMode:		"ip_mode",
		ISPIp:		"specific_ip",
		connect:	"connect",
		hostName:	"hostname",
		acName:		"access",
		broadcast:	"broadcast",
		broadcast_en:	"enable_broadcast",
		svcName:	"server",
		macaddr:	"macaddr"
	},
	optValue:
	{
		proto:
		{
			none:"none",
			dynIp:"dhcp",
			staticIp:"static",
			pppoe:"pppoe",
			mobileWeb:"monet"
		},
		dnsMode:
		{
			dynamic:"dynamic",
			manual:"manual"
		},
		connMode:
		{
			auto:"auto",
			demand:"demand",
			manual:"manual"
		},
		ispMode:
		{
			dhcp:"dynamic",
			sta:"static"
		},
		diagMode:
		{
			auto:"auto",
			normal:"normal",
			special1:"special1",
			special2:"special2",
			special3:"special3",
			special4:"special4",
			special5:"special5",
			special6:"special6",
			special7:"special7"
		}
	}
};

var uciDhcpd =
{
	fileName:		"dhcpd",
	secName:
	{
		udhcpd:		"udhcpd"
	},
	optName:
	{
		enable:		"enable",
		poolStart:	"pool_start",
		poolEnd:	"pool_end",
		leaseTime:	"lease_time",
		leaseFile:	"lease_file",
		gateway:	"gateway",
		priDns:		"pri_dns",
		sndDns:		"snd_dns",
		hostName:	"hostname",
		mac:		"mac",
		ip:		"ip",
		expires:		"expires",
		auto:		"auto"
	},
	dynData:
	{
		dhcpClient:	"dhcp_clients"
	},
	optValue: {
		enable: {
			on: "1",
			off: "0"
		}
	}
};

var uciArp =
{
	fileName:		"ip_mac_bind",
	secType:
	{
		arp:		"user_bind"
	},
	optName:
	{
		ipAddr:		"ip",
		mac:		"mac",
		status:		"status",
		hostname:	"hostname",
		orgHostName:"orgHostName"
	},
	dynData:
	{
		sysArp:	"sys_arp"
	}
};

var uciGuestNet =
{
	fileName:		"guest_network",
	secType:
	{
		guest:		"guest"
	},
	secName:
	{
		wireless2G:	"guest_2g",
		wireless5G:	"guest_5g"
	},
	optName:
	{
		enable:		"enable",
		ssid:		"ssid",
		ssidbrd:	"ssidbrd",
		encrypt:	"encrypt",
		key:		"key",
		accright:	"accright",
		upload:		"upload",
		download:	"download",
		timelimit:	"time_limit",
		duration:	"duration",
		timetype:	"limit_type",
		name:		"name",
		mon:		"mon",
		tue:		"tue",
		wed:		"wed",
		thu:		"thu",
		fri:		"fri",
		sat:		"sat",
		sun:		"sun",
		startTime:	"start_time",
		endTime:	"end_time",
		timeLeft:	"time_left"
	},
	dynOptValue:
	{
		encryption:
		{
			off:	0,
			on:		1
		}
	},
	optValue:
	{
		timetype:
		{
			timeout:"timeout",
			schedule:"schedule"
		},
		enable:
		{
			yes: "1",
			no: "0"
		}
	},
	dynData:
	{
		timeLeft2G:	"guest_left_2g",
		timeLeft5G:	"guest_left_5g",
		guestRule2G: "guest_rule_2g",
		guestRule5G: "guest_rule_5g"
	}
};

var uciUpnp =
{
	fileName:		"upnpd",
	secType:
	{
		upnpd:		"upnpd"
	},
	secName:
	{
		upnpCfg:	"config"
	},
	optName:
	{
		uatPmp:		"enable_natpmp",
		upnp:		"enable_upnp"
	},
	dynData:
	{
		upnpLease:	"upnp_lease"
	}
};

var uciDdns =
{
	fileName:		"ddns",
	secType:
	{
		ddns:		"ddns"
	},
	secName:
	{
		phDdns:	"phddns"
	},
	optName:
	{
		autologin:		"auto_login",
		username:		"username",
		password:		"password"
	},
	dynData:
	{
		ddnsStatus:	"ddns_status"
	}
};

var uciMultiSsid =
{
	fileName:	"custom_multi_ssid",

	secType:
	{
		wifiWeb:		"wifi-web"
	},
	secName:
	{
		wlan_multi_ssid_2g_1:	"wlan_multi_ssid_2g_1",
		wlan_multi_ssid_2g_2:	"wlan_multi_ssid_2g_2",
		wlan_multi_ssid_5g_1:	"wlan_multi_ssid_5g_1",
		wlan_multi_ssid_5g_2:	"wlan_multi_ssid_5g_2",
		wlan_multi_ssid_5g_3:	"wlan_multi_ssid_5g_3"
	},
	optName:
	{
		enable:				"enable",
		ssid:				"ssid",
		ssidbrd:			"ssidbrd",
		encryption:			"encryption",
		key:				"key",
		seccheck:			"seccheck",
		auth:				"auth",
		cipher:				"cipher",
		maxStaNum:			"max_sta_num"
	},
	optValue:
	{
		keyType:
		{
			none:		"none",
			psk:		"psk",
			psk2:		"psk2",
			pskMixed:	"mixed-psk",
			tkip:		"tkip",
			ccmp:		"ccmp"
		},
		enable:
		{
			off:	0,
			on:		1
		},
		ssidbrd:
		{
			off:	0,
			on:		1
		},
		encryption:
		{
			off:	0,
			on:		1
		},
		auth:
		{
			psk:		1,
			psk2:		2,
			pskMixed:	0
		},
		cipher:
		{
			aes:		1,
			tkip:		2,
			auto:		0
		}
	}
};

var uciWireless =
{
	fileName:	"wireless",

	secType:
	{
		wifiDevice:		"wifi-device",
		wifiIface:		"wifi-iface"
	},
	secName:
	{
		wifiDev0:	"wifi0",
		wifiIf0:	"ath0",
		wifiDev1:	"wifi1",
		wifiIf1:	"ath1",
		wdscli0:	"wdscli0",
		wdscli1:	"wdscli1",
		freq0:		"freq0",
		freq1:		"freq1",
		wlanBS: 	"wlan_bs"
	},
	optName:
	{
		channel:		"channel",
		disabled:		"disabled",
		txPwr:			"txpower",
		country:		"country",
		wifiMode:		"mode",
		ssid:			"ssid",
		keyType:		"encryption",
		key:			"key",
		hidden:			"hidden",
		wmm:			"wmm",
		apIsolate:		"isolate",
		bssid:			"bssid",
		beaconInterval:	        "beacon_int",
		hwmode:			"hwmode",
		htmode:			"htmode",
		freqenable:		"freqenable",
		wdsenable:		"wdsenable",
		enable:			"enable",
		bsEnable:		"bs_enable",
		wifiEnable:		"wifi_enable"
	},
	optValue:
	{
		keyType:
		{
			none:		"none",
			psk:		"psk",
			psk2:		"psk2",
			pskMixed:	"mixed-psk",
			tkip:		"tkip",
			ccmp:		"ccmp"
		},
		wifiMode:
		{
			ap:		"ap"
		},
		wifiSwitch:
		{
			on:		"0",
			off:		"1"
		},
		hwMode:
		{
			auto:		"auto",
			mode11b:	"11b",
			mode11g:	"11g",
			mode11n:	"11n",
			mode11bg:	"11bg",
			mode11bgn:	"11ng",
			mode11an:	"11na",
			mode11ac:	"11ac"
		},
		htMode:
		{
			auto:		"auto",
			bw20:		"HT20",
			bw40:		"HT40",
			bw80:		"HT80"
		},
		txPower:
		{
			high:		"1",
			middle:		"2",
			low:		"3"
		},
		dhcpsState:
		{
			auto:		"1",
			unAuto:		"0"
		},
		bsEnable:
		{
			enable:		"1",
			disable:	"0"
		}
	},
	dynOptName:
	{
		enable:		"enable",
		enable_2g:    "enable_2g",
		enable_5g:    "enable_5g",
		ssidbrd:	"ssidbrd",
		ssid:		"ssid",
		encryption:	"encryption",
		key:		"key",
		channel:	"channel",
		mode:		"mode",
		auth: 		"auth",
		cipher:		"cipher",
		bandwidth:	"bandwidth",
		power:		"power",
		isolate:	"isolate",
		bssid:		"bssid",
		addrform:	"address_form",
		rssi:		"rssi",
		status:		"status",
		result:		"result",
		ip:		"ip",
		muMIMO:		"vhtmubfer",
		twt:			"twt",
		ofdma:			"ofdma"
	},
	dynOptValue:
	{
		enable:
		{
			off:	0,
			on:		1
		},
		ssidbrd:
		{
			off:	0,
			on:		1
		},
		encryption:
		{
			off:	0,
			on:		1
		},
		mode:
		{
			m_11b:		0,
			m_11g:		1,
			m_11bg:		2,
			m_11n:		3,
			m_11bgn:	4,
			m_11a:		5,
			m_11n_5g:	6,
			m_11an:		7,
			m_11ac:		8,
			m_11bgn_ax: 9,
			m_11ac_ax:  10
		},
		auth:
		{
			psk:		1,
			psk2:		2,
			pskMixed:	0,
			psk2_sae3:	3,
			sae3:		4
		},
		cipher:
		{
			aes:		1,
			tkip:		2,
			auto:		0
		},
		bandwidth:
		{
			auto:	0,
			bw20:	1,
			bw40:	2,
			bw80:	3,
			bw80Add80:4
		},
		power:
		{
			high:	0,
			mid:	1,
			low:	2
		},
		isolate:
		{
			off:	0,
			on:		1
		},
		addrform:
		{
			addr3:	0,
			addr4:	1,
			detect:	2
		},
		status:
		{
			notconnect:	0,
			connecting:	1,
			connected:	2
		},
		dhcpcStatus:
		{
			dhcpcRequsting: "0",
			dhcpcFailed: "1",
			dhcpcSuccess: "2"
		},
		scanStatus:
		{
			scanning:0,
			finish:1
		},
		lanIpDhcpsStatus:
		{
			detecting:0,
			finish:1
		},
		lanIpDhcpsResult:
		{
			nonConflict:0,
			conflict:1
		},
		muMIMO:
		{
			off:0,
			on:1
		},
		twt:
		{
			off:0,
			on:1
		},
		ofdma:
		{
			off:0,
			on:1
		}
	},
	dynData:
	{
		host_2g:		"wlan_host_2g",
		wds_2g:			"wlan_wds_2g",
		scan_2g:		"wlan_scan_2g",
		scan_status_2g:	"wlan_scan_2g_status",
		wds_2g_status:	"wlan_wds_2g_status",
		host_5g:		"wlan_host_5g",
		wds_5g:			"wlan_wds_5g",
		scan_5g:		"wlan_scan_5g",
		wds_5g_status:	"wlan_wds_5g_status",
		wds_lanIp:		"wlan_wds_2g_lanip",
		wds_dhcps:		"wlan_wds_2g_dhcps",
		wds_dhcpc:		"wlan_wds_2g_dhcpc",

		host_5g1:		"wlan_host_5g_1",
		wds_5g1:		"wlan_wds_5g_1",
		scan_5g1:		"wlan_scan_5g_1",
		wds_5g_status1:	"wlan_wds_5g_status_1",

		host_5g4:		"wlan_host_5g_4",
		wds_5g4:		"wlan_wds_5g_4",
		scan_5g4:		"wlan_scan_5g_4",
		wds_5g_status4:	"wlan_wds_5g_status_4",
		wifi_switch:	"wifi_switch",
		wlanServiceAttr:"wlan_service_attr"
	},
	actionName:
	{
		scanStart: "scan_start_2g",
		wdsStart:  "wds_start_2g"
	},
	encryptionType:
	{
		none:0,
		psk2_psk:1,
		wep:2,
		wpa2_wpa:3,
		unkonw:4,
		psk2_sae3:5,
		sae3:6,
		wpa3:7
	}
};

var uciCustomWireless = {
	fileName: "custom_wireless",

	secName:
	{
		wpsConfig: "wps_config"
	},
	optName:
	{
		pinEnable:		"pin_enable",
		pinCode:		"wsc_vendorpin",
		linkType:		"link_type",
		terminalPinCode:"terminal_pin_code",
		vendorPin:		"wsc_vendorpin",
		band:			"band"
	},
	optValue:
	{
		pinEnable:
		{
			on: "on",
			off: "off"
		},
		linkType:
		{
			button: "pbc",
			pin: "pin"
		},
		wifiSwitch:
		{
			enable:
			{
				on: "on",
				off: "off"
			}
		}
	},
	dynOptName: {
		enable: "enable",
		enable_2g:    "enable_2g",
		enable_5g:    "enable_5g",
		enable_5g1:   "enable_5g1",
		enable_5g4:   "enable_5g4"
	},
	dynData: {
		wifi_switch: "wifi_switch"
	},
	actionName:
	{
		wpsLink: "wps_link",
		wpsGeneratePin: "wps_generate_pin"
	}
};

var uciFirewall =
{
	fileName:	"firewall",

	secType:
	{
		fwRule:			"rule",
		fwRedirect:		"redirect",
		fwDMZ:			"dmz",
		parentMac: 		"parent_mac",
		parentConfig:	"parent_config",
		accessRule:		"access_rule",
		accessConfig:	"access_config",
		lanManage:		"lan_manage",
		wanManage:		"wan_manage"
	},
	secName:
	{
		inputRuleSuffix:	"Input",
		fowardRuleSuffix:	"Forward",
		lanManage:			"lan_manage",
		wanManage:			"wan_manage",
		dmz:				"dmz",
		parentConfig:		"parent_config",
		accessConfig:		"access_config"
	},
	optName:
	{
		target:			"target",
		src:			"src",
		dest:			"dest",
		proto:			"proto",
		srcMac:			"src_mac",
		srcIP:			"src_ip",
		srcIpStart:		"src_ip_start",
		srcIpEnd:		"src_ip_end",
		srcDport:		"src_dport",
		srcDportStart:	"src_dport_start",
		srcDportEnd:	"src_dport_end",
		destPort:		"dest_port",
		destPortStart:	"dst_port_start",
		destPortEnd:	"dst_port_end",
		port:			"port",
		destIP:			"dest_ip",
		destIpStart:	"dst_ip_start",
		destIpEnd:		"dst_ip_end",
		enable:			"enable",
		mon:			"mon",
		tue:			"tue",
		wed:			"wed",
		thu:			"thu",
		fri:			"fri",
		sat:			"sat",
		sun:			"sun",
		name:			"name",
		hostIndex:		"host_index",
		objIndex:		"obj_index",
		planIndex:		"plan_index",
		mode:			"mode",
		hostMode:		"host_mode",
		objMode:		"obj_mode",
		domain:			"domain",
		mac:			"mac",
		enableAll:		"enable_all"
	},
	listName:
	{
		srcMac:		"src_mac",
		domain:		"domain"
	},
	optValue:
	{
		target:
		{
			accept:		"ACCEPT",
			reject:		"REJECT",
			dnat:		"DNAT"
		},
		src:
		{
			lan:		"lan",
			wan:		"wan",
			any:		"*"
		},
		dest:
		{
			any:		"*",
			lan:		"lan"
		},
		proto:
		{
			all:		"all",
			tcp:		"tcp",
			udp:		"udp",
			both:		"tcp udp",
			icmp:		"icmp"
		},
		parentCtrl:
		{
			enable:		"1",
			disable:	"0"
		},
		dmzSwitch:
		{
			on:			"1",
			off:		"0"
		},
		bHavEnable:
		{
			enable:		"1",
			disable:	"0"
		},
		bHavFilter:
		{
			allow:		"1",
			forbid:		"0"
		},
		lanManage:
		{
			all:		"1",
			some:		"0"
		},
		wanManage:
		{
			none:		"0",
			all:		"1",
			one:		"2"
		},
		hostMode:
		{
			ip:			"0",
			mac:		"1"
		},
		objMode:
		{
			ip:			"0",
			domain:		"1"
		}
	}
};

var uciAccessCtrl =
{
	fileName:	"access_ctrl_info",

	secType:
	{
		hostRule:	"host_rule",
		objRule:	"obj_rule",
		planRule:	"plan_rule"
	},
	secName:
	{
	},
	listName:
	{
		domain:		"domain"
	},
	optName:
	{
		name:		"name",
		mode:		"mode",
		ipStart:	"ip_start",
		ipEnd:		"ip_end",
		macAddr:	"macaddr",
		portStart:	"port_start",
		portEnd:	"port_end",
		proto:		"proto",
		mon:		"mon",
		tue:		"tue",
		wed:		"wed",
		thu:		"thu",
		fri:		"fri",
		sat:		"sat",
		sun:		"sun",
		domain:		"domain"
	},
	optValue:
	{
		hostMode:
		{
			ip:		"0",
			mac:	"1"
		},
		objMode:
		{
			ip:		"0",
			domain:	"1"
		},
		proto:
		{
			tcp:	"tcp",
			udp:	"udp",
			icmp:	"icmp",
			all:	"all"
		}
	}
}

var uciHostsInfo =
{
	fileName:	"hosts_info",

	secType:
	{
		device:		"device"
	},
	secName:
	{
		limitTime: "limit_time",
		forbidDomain: "forbid_domain"
	},
	optName:
	{
		mac:		"mac",
		type : "type",
		blocked:	"blocked",
		isBlocked:	"is_blocked",
		downLimit:	"down_limit",
		downSpeed : "down_speed",
		upLimit:	"up_limit",
		upSpeed : "up_speed",
		ip : "ip",
		hostname : "hostname",
		isCurHost : "is_cur_host",
		ssid : "ssid",
		cfgValid : "cfg_valid",
		wifiMode : "wifi_mode",
		planRule : "plan_rule",
		name:		"name",
		mon : "mon",
		tue : "tue",
		wed : "wed",
		thu : "thu",
		fri : "fri",
		sat : "sat",
		sun : "sun",
		startTime : "start_time",
		endTime : "end_time",
		domain: "domain",
		limitTime: "limit_time",
		forbidDomain: "forbid_domain",
		parentMac: "parent_mac"
	},
	optValue:
	{
		isBlocked:
		{
			yes:		"1",
			no:			"0"
		},
		linkType:
		{
			wired:	"0",
			hostWireless:	"1",
			guestWireless:	"2"
		},
		name:
		{
			defname:	"匿名主机"
		},
		isCurHost:
		{
			yes: true,
			no : false
		},
		cfgValid :
		{
			yes: true,
			no: false
		},
		enable : {
			yes: "1",
			no : "0"
		},
		wifiMode: {
			h2G : "0",
			h5G : "1",
			h5G1 : "2",
			h5G4 : "3"
		}
	},
	dynData:
	{
		host_info:		"host_info",
		online_host:	"online_host",
		blocked_host:	"blocked_host",
		setBlockFlag:	"set_block_flag",
		setHostInfo:	"set_host_info",
		limitTime:	"limit_time",
		forbidDomain:	"forbid_domain",
		setName: "set_name",
		setFluxLimit: "set_flux_limit",
		capHostNum:"cap_host_num",
		setHostInfo: "set_host_info"
	}
};
var uciSystem =
{
	fileName:	"system",

	secType:
	{
		system:		"system"
	},
	secName:
	{
		sys:		"sys",
		sysMode:	"sys_mode",
		deviceInfo: "device_info"
	},
	optName:
	{
		timezone:	"timezone",
		isFactory:  "is_factory",
		num: "num",
		mode: "mode",
		qrCode: "qr_code"
	},
	optValue:
	{
		timezone:
		{
			Eniwetok:			"TOT-13",
			MidwayIsland:		"SST11",
			Hawaii:				"HST10",
			Alaska:				"AKST9AKDT,M3.2.0,M11.1.0",
			PacificTime:		"PST8",
			MountainTime:		"MST7",
			CentralTime:		"CST6",
			EastTime:			"EST5",
			AtlanticTime:		"AST4",
			NewFoundLand:		"NST3:30NDT,M3.2.0/0:01,M11.1.0/0:01",
			Brasilia:			"ART3",
			MidAtlantic:		"FNT2",
			CapeVerder:			"CVT1",
			GreenwichMeanTime:	"GMT0",
			Amsterdam:			"CET-1CEST,M3.5.0,M10.5.0/3",
			Cairo:				"CAT-2",
			Baghdad:			"AST-3",
			Tehran:				"THT-3:30",
			AbuDhabi:			"AZT-4AZST,M3.5.0/4,M10.5.0/5",
			Kabul:				"AFT-4:30",
			Yekaterinburg:		"YEKT-5YEKST,M3.5.0,M10.5.0/3",
			Madras:				"IST-5:30",
			Kathmandu:			"NPT-5:45",
			AlmaAta:			"BDT-6",
			Rangoon:			"MMT-6:30",
			Bangkok:			"ICT-7",
			Beijing:			"CST-8",
			Tokyo:				"JST-9",
			Adelaide:			"CST-9:30CST,M10.1.0,M4.1.0/3",
			Brisbane:			"EST-10",
			Magadan:			"MAGT-11MAGST,M3.5.0,M10.5.0/3",
			Fiji:				"FJT-12",
			Nukualofa:			"PHOT-13"
		},
		isFactory :
		{
			yes : "1",
			no  : "0"
		},
		sysMode:
		{
			routerMode: 0,
			apMode: 1,
			wdsMode: 2
		}
	},
	dynData:
	{
		clockStatus:	"clock_status",
		sysLog:		"sys_log",
		excLog:		"exc_log",
		domainArray:	"domain_array"
	},
	actionName:
	{
		downloadConf:	"download_conf",
		uploadConf:		"upload_conf",
		firmUpgrade:	"firmware_upgrade",
		downloadLogs:	"download_logs",
		syslogClean:	"syslog_clean",
		getDomainArray:	"get_domain_array"
	}
};

var uciUhttpd =
{
	fileName:		"uhttpd",

	secType:
	{
		uhttpd:		"uhttpd"
	},
	secName:
	{
		main:		"main"
	},
	optName:
	{
		listenHttpWan:	"listen_http_wan"
	},
	listName:
	{
		listenHttp:		"listen_http",
		listenHttpLan:	"listen_http_lan"
	},
	optValue:
	{
		http:
		{
			ip:		"0.0.0.0"
		}
	}
};

var uciDeviceInfo =
{
	fileName:		"device_info",

	secType:
	{
		info:		"info"
	},
	secName:
	{
		info:		"info"
	},
	optName:
	{
		productId:	"product_id",
		vendorId:	"vendor_id",
		sysSwRev:	"sys_software_revision",
		sysSwRevMin:"sys_software_revision_minor",
		buildTime:	"build_time",
		language:	"language",
		deviceName:	"device_name",
		deviceInfo:	"device_info",
		deviceModel:"device_model",
		hwVer:		"hw_version",
		swVer:		"sw_version",
		domainName:	"domain_name"
	}
};

var uciCloudConfig =
{
	fileName:		"cloud_config",

	secType:
	{
		cloudReply : "cloud_reply"
	},
	secName:
	{
		bind : "bind",
		info : "info",
		register : "register",
		newFirmware : "new_firmware",
		deviceStatus : "device_status",
		upgradeInfo : "upgrade_info",
		resetPassword : "reset_password",
		modifyAccountPwd : "modify_account_pwd",
		cloudAccountStat: "cloudAccountStat",
		downloadFw: "download_fw",
		bindTip: "bind_tip",
		deviceLegality: "device_legality",
		confMngt: "conf_mngt",
		cloudType: "cloud_type"
	},
	optName:
	{
		type 			: "type",
		accountType		: "account_type",
		username 		: "username",
		password 		: "password",
		newPassword 	: "new_pwd",
		oldPassword 	: "old_pwd",
		bindStatus 		: "bind_status",
		loginStatus 	: "login_status",
		accountStatus 	: "account_status",
		releaseDate 	: "release_date",
		downloadUrl 	: "download_url",
		location 		: "location",
		releaseLogUrl 	: "release_log_url",
		verifyCode      : "verify_code",
		cloudAccountStat: "cloudAccountStat",
		fwNewNotify		: "fw_new_notify",
		fwUpdateType	: "fw_update_type",
		version			: "version",
		releaseLog		: "release_log",
		reconnectTime	: "reconnect_time",
		noShow			: "not_show",
		illegal			: "illegal",
		mngtSwitch		: "mngt_switch",
		cloudType		: "cloud_type"
	},
	optValue:
	{
		cloudOutline: 0,
		cloudDownloading:1,
		cloudComplete: 2,
		cloudIdle: "3",
		fwNewTrue: 1,
		fwNewFalse: 0,
		fwUpdateTypeNormal: "1",
		unRegestStatus:0,
		regestStatus:1,
		bindStatusBind:1,
		bindStatusUnbind:0,
		accountTypeEmail:0,
		accountTypePhoneNum:1,
		reconnectVal:1,
		noShow:
		{
			yes:"1",
			no:"0"
		},
		illegal:
		{
			yes:"1",
			no:"0"
		},
		enable:
		{
			on: "1",
			off: "0"
		}
	},
	actionName:
	{
		bind : "bind",
		login : "login",
		unbind : "unbind",
		reconnect:"reconnect",
		register : "register",
		downloadFw: "fw_download",
		checkFwVer: "check_fw_version",
		fwDownload : "fw_download",
		getAccountStat : "get_account_stat",
		resetPassword : "reset_password",
		resendRegisterEmail : "resend_register_email",
		checkFwVersion : "check_fw_version",
		cancelReg : "cancel_reg",
		getRegVerifyCode : "get_reg_verify_code",
		checkRegVerifyCode : "check_reg_verify_code",
		getResetPwdVerifyCode : "get_reset_pwd_verify_code",
		checkResetPwdVerifyCode : "check_reset_pwd_verify_code",
		modifyAccountPwd : "modify_account_pwd"
	}
};

var cloudClientStatus =
{
	fileName:		"cloud_status",

	secName:
	{
		bind : "bind",
		unbind : "unbind",
		login : "login",
		register : "register",
		checkFwVer : "check_fw_ver",
		downloadFw : "download_fw",
		clientInfo : "client_info",
		resendEmail : "resend_email",
		getAccountStat : "get_account_stat",
		resetPassword : "reset_account_pwd",
		fwDownloadProg : "fw_download_prog",
		getRegVerifyCode : "get_reg_verify_code",
		checkRegVerifyCode : "check_reg_verify_code",
		getResetPwdVerifyCode : "get_reset_pwd_verify_code",
		checkResetPwdVerifyCode : "check_reset_pwd_verify_code",
		modifyAccountPwd : "modify_account_pwd",
		getCanUpdateApps : "get_can_update_plugins",
		getNotInstalledApps: "get_not_installed_plugins",
		regVeriCodeTimer:"reg_veri_code_timer",
		resetVeriCodeTimer:"reset_veri_code_timer"
	},
	optName:
	{
		owner: "owner",
		errCode: "err_code",
		actionStatus: "action_status",
		connectStatus: "connect_status",
		dlProgress : "fw_download_progress",
		fwDownloadStatus: "fw_download_status",
		fwDownloadProgress: "fw_download_progress",
		regVeriCodeTimer:"reg_veri_code_timer",
		resetVeriCodeTimer:"reset_veri_code_timer",
		downloadErrCode:"download_error_code"
	},
	optValue:
	{
		connectStatus:{
			connected:1,
			disconnected:0
		},
		queryStatus:{
			failed:0,
			idle:1,
			prepare:2,
			trying:3,
			success:4,
			timeout:5,
			max:6
		}
	}
};

var uciElink =
{
	fileName:		"custom_elink",

	secType:
	{
		elink:		"elink"
	},
	secName:
	{
		status:		"status"
	},
	optName:
	{
		elinkSwitch:  	"elink_switch",
		elinkSynEnable:	"elink_syn_enable"
	},
	optValue:
	{
		elinkSwitch:
		{
			on:		"1",
			off:	"0"
		},
		elinkSynEnable:
		{
			on:		"1",
			off:	"0"
		}
	}
};

var uciFunction =
{
	fileName:		"function",

	secName:
	{
		newModuleSpec: "new_module_spec",
		moduleSpec: "module_spec"
	},
	optName:
	{
		channel2g: "wireless2g_channel",
		channel5g: "wireless5g_channel",
		bandWidth5g:"wireless5g_bandwidth",
		channel5g1: "wireless5g_1_channel",
		bandWidth5g1:"wireless5g_1_bandwidth",
		channel5g4: "wireless5g_4_channel",
		bandWidth5g4:"wireless5g_4_bandwidth",
		mode2g: "wireless2g_mode",
		mode5g: "wireless5g_mode",
		mode5g1: "wireless5g_1_mode",
		mode5g4: "wireless5g_4_mode",
		moduleList: "module_list",
		wlanBS: "wlan_bs",
		wanRate: "wan_rate",
		ethBandwidth:"eth_bandwidth",
		wifisonMesh: "wifison_mesh",
		wifiSwitch:"wifi_switch",
		customWifiSwitch:"custom_wifi_switch",
		wifiSwitchSplit:"wifi_switch_split",
		wlanServiceAttr:"wlan_service_attr",
		wlanServiceAttr2g:"wlan_service_attr_2g",
		wlanServiceAttr5g:"wlan_service_attr_5g",
		supportMultiSsid:"support_multi_ssid",
		supportPinWps:"support_pin_wps",
		modeSwitch:"mode_switch",
		elink:"elink",
		wolink:"wolink",
		customLed:"custom_led",
		hnat:"hnat",
		ipv6:"ipv6",
		supportWlanAuthType2g:"support_wlan_auth_type_2g",
		supportWlanAuthType5g:"support_wlan_auth_type_5g",
		usernameChangeable: "username_changeable",
		wanPortList:"wan_port_list",
		ethLayout: "ethernet_port_layout",
		wanPortIndexList:"wan_port_index_list",
		wanPortDescList:"wan_port_desc_list",
		wanPortRateList:"wan_port_rate_list",
		wanPortRateDescList:"wan_port_rate_desc_list",
		wanPortDetect:"wan_port_detect",
		guest5g:"guest5g",
		supportEyUp:"mesh_easy_upgrade",
		sfpRate: "sfp",
		portManage: "port_custom",
		portSubFunc:"port_custom_sub_func",
		powerPos: "power_position",
		massiveSta: "massive_sta_capacity",
		smbCloud: "smbcloud",
		supportQRCode: "qr_code"
	},
	optValue:
	{
		moduleList:
		{
			cloud: "cloud",
			wlan_guest : "wlan_guest"
		},
		enable:"1",
		disable:"0"
	}
}

var uciPlc =
{
	fileName : "hyfi",

	actionName :
	{
		scanExt : "scan_ext",
		addExt  : "add_ext",
		setExtInfo: "set_ext_info",
		kickExt: "kick_ext",
		getLedStatus: "get_led_status",
		setLedStatus: "set_led_status",
		stopScanExt: "stop_scan_ext",
		plcDiagnose: "plc_diagnose",
		rebootExtWlan: "reboot_ext_wlan",
		upgExt:"upgrade_ext",
		startGetExtFwVer : "start_get_ext_fw_ver",
		rebootExt:"reboot_ext",
		resetExt:"reset_ext",
		localUpgradeExt:"local_upgrade_ext"
	},

	secType :
	{
		scannedExt: "scanned_ext",
		connectedExt: "connected_ext",
		ExtRate: 	"connected_ext_rate"
	},

	secName :
	{
		scanExtStatus : "scan_ext_status",
		plc : "plc",
		startGetExtFwVerStat :"start_get_ext_fw_ver_status",
		upgExtStat:"upgrade_ext_status",
		checkAllFwVerStart: "check_fw_version_all",
		checkAllFwVer: "check_fw_version_all_status",
		upgradeDevStatus: "upgrade_dev_status",
		upgradeDev: "upgrade_dev"
	},

	optName :
	{
		status : "status",
		idx : "idx",
		name : "name",
		ip : "ip",
		mac : "mac",
		timeDiagnose: "time_diagnose",
		supportOlUp: "support_ol_upgrade",
		supportEyUp: "support_easy_upgrade",
		plcEnable: "plc_enable"
	},

	optValue :
	{
		status :
		{
			doing: "1",
			idle: "0"
		},
		ledStatus:
		{
			on: "1",
			off: "0"
		},
		plcDiagStatus:
		{
			off: "0",
			timer: "1",
			realTime:"2"
		},
		supportOlUp:
		{
			yes: "1",
			no: "0"
		},
		extOlStatus:
		{
			idle: "0",
			readyDownload: "1",
			downloading: "2",
			readyUpg: "3",
			upgrading: "4",
			upgSuccess: "5",
			timeout: "6",
			fail: "255"
		},
		checkAllFwVerStatus:
		{
			checking: "0",
			idleOrFinish: "1",
			fail: "2"
		},
		upgradeStatus:
		{
			idle: "-1",
			waiting: "0",
			downloading: "1",
			downloadTimeout: "2",
			downloadFail: "3",
			waitForUpgrade: "4",
			upgrading: "5",
			upgradeFail: "6",
			upgradeSuccess: "7"
		}
	}
}

var uciTimerSwitch =
{
	fileName:			"time_switch",
	secType:
	{
		entry:			"time_switch"
	},
	secName:
	{
		general:		"general"
	},
	optName:
	{
		enable: 		"enable",
		name:			"name",
		mon:			"mon",
		tue:			"tue",
		wed:			"wed",
		thu:			"thu",
		fri:			"fri",
		sat:		    "sat",
		sun:		    "sun",
		start_time:     "start_time",
		end_time:	    "end_time"
	},
	optValue:
	{
		enable:
		{
			on:	    "1",
			off:	"0"
		}
	}
};

var uciWanPortDetect = {
	fileName:		"wan_port_detect",
	secName:
	{
		config:		"config"
	},
	optName:{
		enable: 	"enable",
		fixWanPort: "fix_wan_port"
	},
	optValue:
	{
		enable:
		{
			on:	    "1",
			off:	"0"
		}
	}
};

var uciMesh = {
	fileName:		"mesh",
	secName:
	{
		config:		"config"
	},
	optName:{
		pbcEnable: 	"pbc_enable"
	},
	optValue:
	{
		enable:
		{
			on:	    "1",
			off:	"0"
		}
	}
};

/* added by Zhou Yang */
var uciSpeedTest = {
	fileName: "speedtest",
	secType: {
		history: "history"
	},
	optName: {
		dateTime: "date_time",
		bindWidthUploadRate: "bandwidth_test_upload_rate",
		bindWidthDownloadRate: "bandwidth_test_download_rate",
		bindWidthRtt: "bandwidth_test_rtt",
		note: "note"
	},
	optValue: {
		testType: {
			taier: "0",
			operator: "1"
		},
		direction: {
			upOnly: "0",
			downOnly: "1",
			both: "2"
		}
	},
	dynData: {
		bindWidthTestStatus: "bandwidth_test_status",
		bindWidthTestResult: "bandwidth_test_result"
	},
	dynOptName: {
		status: "status",
		errCode: "err_code",
		uploadRate: "upload_rate",
		downloadRate: "download_rate",
		rtt: "rtt",
		downloadSize: "download_size",
		downloadFileSize: "download_file_size",
		uploadSize: "upload_size",
		uploadFileSize: "upload_file_size",
		startTime: "start_time",
		endTime: "end_time"
	},
	dynOptValue: {
		status: {
			notStart: 0,	 // 开机初始化状态，未请求过测速
			testDownRate: 1, // 正在测下载速率
			testUpRate: 2,   // 正在测上传速率
			stopping: 3,     // 正在终止测速
			finished: 4      // 测速结束
		},
		errCode: {
			success: 0,		 // 测速成功
			unknown: 1, 	 // 未知错误
			timeout: 2,		 // 测速超时（运营商模式需求）
			macError: 3,	 // 获取设备MAC失败
			resError: 4,	 // 中心服务器无响应
			resTextError: 5, // 中心服务器应答报文格式错误
			cIDError: 6,     // 非法Client IP
			matchError: 7,	 // 匹配测速服务器失败
			linkError: 8,    // 连接测速服务器失败
			busyError: 9,    // 测速服务器繁忙
			seqError: 10,	 // 测速服务器拒绝测速请求
			userStop: 11	 // 用户终止测速
		}
	},
	actionName: {
		startBandWidthTest: "start_bandwidth_test"
	}
};

var uciLteManager =
{
	fileName:"lte_manager",
	secName:
	{
		info4g:"info_4g",
		infoInternet:"info_internet",
		infoData:"info_data",
		power:"power",
		infoBase:"info_base",
		apn:"apn"
	},
	actionName:{
		changeInternetStatus:"change_internet_status"
	},
	optName:
	{
		isp:"isp",
		simStatus:"sim_status",
		networkMode:"network_mode",
		signalInfo:"signal_info",
		uploadRate:"tx_speed",
		downloadRate:"rx_speed",
		snr:"snr",
		rsrq:"rsrq",
		rxTraffic:"rx_traffic",
		txTraffic:"tx_traffic",
		rsrp:"rsrp",
		band:"band",
		lac:"lac",
		ci:"ci",
		netStatus:"net_status",
		pppStatus:"ppp_status",
		macAddr:"mac",
		ip:"ip",
		firDns:"first_dns",
		secDns:"second_dns",
		connect:"connect",
		dataSwitch:"data_switch",
		conReboot:"con_reboot",
		debuger:"debuger",
		apn_enable:"apn_enable",
		dataRoaming:"data_roaming",
		natSwitch:"nat_switch",
		mobileNetMode:"mobile_net_mode",
		flightMode:"flight_mode",
		sleepMode:"sleep_mode",
		vender:"vender",
		product:"product",
		version:"version",
		imei:"imei",
		imsi:"imsi",
		operate:"operate",
		status:"status",
		apnname:"apn",
		apnUsername:"username",
		apnPassword:"password",
		apnAuth:"authentication"  /*身份验证类型*/
	},
	optValue:
	{
		enableVal:
		{
			on:"on",
			off:"off"
		},
		netStatusAct:
		{
			conn: "connect",
			disConn: "disconnect"
		},
		netModeVal:
		{
			prior_4g:"0",
			only_4g:"1",
			prior_3g:"2"
		},
		apnAuthModeVal:
		{
			apn_authNone:"0",
			apn_authPAP:"1",
			apn_authCHAP:"2",
			apn_authPAPCHAP:"3"
		}
	},
	dynOptName:
	{
		ISP: "isp",
		mode4G: "4g_mode",
		IMEI: "imei"
	}
};

/* added by Zhou Yang */
var uciPortConfig = {
	fileName: "port_manage",
	secType: {
		devInfo: "dev_info",
		mwan: "mwan",
		iptv: "iptv",
		game: "game",
		lag: "lag"
	},
	dynOptName: {
		mac: "mac",
		name: "name",
		cap: "cap",
		phyNum: "phy_num",
		powerPos: "power_pos",
		powerIdx: "power_index",
		online: "online",
		phyInfo: "phy_info",
		sfpCapability: "sfp_capability",
		phy: "phy",
		role: "role",
		subFunc: "sub_func"
	},
	dynOptValue: {
		cap: {
			cap: "1",
			re: "0"
		},
		powerPos: {
			left: "left",
			right: "right"
		},
		online: {
			online: "1",
			offline: "0"
		},
		role: {
			lan: "lan",
			wan1: "wan1",
			wan2: "wan2",
			downlink1: "downlink1",
			downlink2: "downlink2",
			uplink1: "uplink1",
			uplink2: "uplink2",
			lag1: "lag1",
			lag2: "lag2",
			game: "game"
		}
	},
	optName: {
		enable: "enable",
		wanPhy: "wan_phy",
		uplinkPhy: "uplink_phy",
		downlinkPhy: "downlink_phy",
		downlinkDev: "downlink_dev",
		gameList: "game_list",
		gameDev: "game_dev",
		gamePhy: "game_phy",
		lagList: "lag_list",
		lagDev: "lag_dev",
		lagPhy: "lag_phy"
	},
	optValue: {
		enable: {
			on: "1",
			off: "0"
		}
	}
};

/* added by Zhou Yang */
var uciIPTVConfig = {
	fileName: "iptv_manage",
	secType: {
		iptvEntry: "iptv_entry"
	},
	optName: {
		wanIndex: "wan_index",
		workMode: "work_mode",
		linkMode: "link_mode",
		vlanId: "vlan_id"
	},
	optValue: {
		wanIndex: {
			wan1: "1",
			wan2: "2"
		},
		workMode: {
			direct: "0",
			vlan: "1"
		},
		linkMode: {
			alone: "0",
			mixed: "1"
		}
	}
};

/*------------- 新的SLP交互接口宏定义 -------------*/
var SEC_NAME       = ".name";

var KEY_NAME = "name";
var KEY_TABLE = "table";
var KEY_PARA = "para";

/*------------- 新的SLP交互接口宏定义 -------------*/

var SEC_INDEX      = ".index";

var RTN_TYPE_ARRAY = ".array";

var UCI_SET = "config.";
var UCI_SET_LIST = "list.";
var UCI_DEL = "delete.";

var UCI_FNAME      = ".config";
var UCI_SNAME      = ".section_name";
var UCI_STYPE      = ".section_type";
var UCI_STYPE_LIST = ".sectype_list";
var UCI_RTN_DATA_TYPE = ".rtn_data_type";
var UCI_APPLY      = ".cfg_filelist";

var UCI_ADD_SEC = "addsec.";
var UCI_DEL_SEC = "delsec.";
var UCI_RENAME_SEC = "rensec.";
var UCI_ADD_OPT = ".config.";
var UCI_DEL_OPT = ".delete.";
var UCI_ADD_LIST = ".list.";
