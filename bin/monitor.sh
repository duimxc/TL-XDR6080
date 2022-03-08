#!/bin/sh

ACTION=$1
CHECK_BAND=$2
ENABLE_PING=$3

# fwlog parameters
IP_DST=$2
ABORT=$2
ROUND=$3
GAP=$4
ICS=$5

BANDS=
WLAN_INFO_PIDS=
PIDAPS=
PIDSYSTEM=
PIDMGT=
# PIDSWITCH=
PIDTOPOLOGY=
PIDWANPORTDETECT=
PIDBHOPT=
PIDBCMRUNNER=
PIDPINGMONITOR=

# 判断机型方案：qca/mtk/bcm
if [ $(ifconfig | grep "^ath" | wc -l) -gt 0 ]; then
	PRODUCT=qca
elif [ $(ifconfig | grep "^ra" | wc -l) -gt 0 ]; then
	PRODUCT=mtk
else
	PRODUCT=bcm
fi
echo PRODUCT = $PRODUCT

# 判断是三频机型还是双频机型
if [ $PRODUCT == qca ]; then
	BANDNUM=$(ifconfig | grep "^wifi" | wc -l)
elif [ $PRODUCT == bcm ]; then
	BANDNUM=$(ifconfig | grep "^wl.[^.]" | wc -l)
# MTK机型目前只支持双频，暂不清楚以后三频机型的net_device name衍生命名
elif [ $PRODUCT == mtk ]; then
	BANDNUM=2
fi
echo BANDNUM = $BANDNUM

#mtk机型判断是DBDC还是非DBDC机型
if [ $PRODUCT == mtk ]; then
	if [ $(ifconfig | grep "^rax" | wc -l) -gt 0 ]; then
		ISDBDC=1
		BAND2GNAME=ra
		BAND5GNAME=rax
	elif [ $(ifconfig | grep "^rai" | wc -l) -gt 0 ]; then
		ISDBDC=0
		BAND2GNAME=ra
		BAND5GNAME=rai
	fi
echo IDBDC = $ISDBDC
echo BAND2GNAME = $BAND2GNAME
echo BAND5GNAME = $BAND5GNAME
fi

echo ENABLE_PING = $ENABLE_PING

if [ -f "/lib/libasan.so.2" ]; then
	export LD_PRELOAD="/lib/libasan.so.2"
fi

if [ -f "/lib/libubsan.so.0" ]; then
	export LD_PRELOAD="/lib/libubsan.so.0"
fi

run(){
	aps_info.sh &
	sleep 6s
	system_info.sh &
	sleep 6s
	mgt_sta_info.sh &
	sleep 6s
	topology_info.sh &
	sleep 6s
	wan_port_detect_info.sh &
	sleep 6s
	bh_optimize_info.sh &
	sleep 6s

	if [[ $PRODUCT == "bcm" ]]; then
		for BAND in $BANDS
		do
			/bin/brcm/wlan_info.sh ${BAND} dhd &
			sleep 6s
		done
		# /bin/brcm/switch_info.sh &
		# sleep 6s
		/bin/brcm/runner_info.sh &
	elif [[ $PRODUCT == "qca" ]]; then
		for BAND in $BANDS
		do
			/bin/qca/wlan_info.sh ${BAND} &
			sleep 6s
		done
		/bin/qca/switch_info.sh &
		sleep 6s
		/bin/qca/nss_info.sh &
		sleep 6s
	elif [[ $PRODUCT == "mtk" ]]; then
		for BAND in $BANDS
		do
			/bin/mtk/wlan_info.sh ${BAND} &
			sleep 6s
		done
		/bin/mtk/eth_info.sh &
		sleep 6s
		/bin/mtk/hnat_info.sh &
		sleep 6s
	fi

	if [[ $ENABLE_PING == "--ping" ]]; then
		ping_monitor.sh &
	fi

	# 开启DHCPS debug
	log_conf --set_mask dhcps
	log_conf --set_level all
}

end(){
	for PID in $WLAN_INFO_PIDS;
	do
		kill -9 ${PID}
	done
	kill -9 ${PIDAPS}
	kill -9 ${PIDSYSTEM}
	kill -9 ${PIDMGT}
	kill -9 ${PIDTOPOLOGY}
	kill -9 ${PIDWANPORTDETECT}
	kill -9 ${PIDBHOPT}
	kill -9 ${PIDPINGMONITOR}
	if [[ $PRODUCT == "bcm" ]]; then
		kill -9 ${PIDBCMRUNNER}
		# kill -9 ${PIDBCMSWITCH}
	elif [[ $PRODUCT == "qca" ]]; then
		kill -9 ${PIDQCASWITCH}
		kill -9 ${PIDQCANSS}
	elif [[ $PRODUCT == "mtk" ]]; then
		# kill -9 ${PIDMTKSWITCH}
		kill -9 ${PIDMTKETH}
		kill -9 ${PIDMTKHNAT}
	fi
	# 关闭DHCPS debug
	log_conf --set_mask dhcps --opt clear
	log_conf --set_level info
}

mtk_fwlog () {
	if [[ $PRODUCT == "mtk" ]]; then
		if [[ $ABORT == "--abort" ]]; then
			PIDFWLOG=$(ps | grep fwlog.sh | awk '{print $1}')
			kill -9 ${PIDFWLOG}
			iwpriv ra0 set fwlog=0:0
			iwpriv ra0 mac 820E705C=0FF0000
			iwpriv ra0 mac 820F705C=0FF0000
			rm -rf /tmp/fw_log*
			echo "capture fw_log end"
			exit 0
		else
			/bin/mtk/fwlog.sh --start $IP_DST $ROUND $GAP $ICS &
		fi
	else
		show_help
	fi
	exit 0
}

show_help () {
	echo "!!!!SYNTAX ERROR!!!!"
	echo "Syntax for dualband product: $0 <start|stop> <2G|5G|ALL> <--ping>"
	echo "Syntax for tripleband product: $0 <start|stop> <2G|5G1|5G4|ALL> <--ping>"
	if [[ $PRODUCT == "mtk" ]]; then
		echo "Syntax for mtk fwlog:"
		echo "$0 fwlog <dst_ip> <round> <gap> <ics>"
		echo "	<dst_ip>: tftp fwlog to dst_ip"
		echo "	<round>: the round num of capture fwlog"
		echo "	<gap>: the time of capture fwlog every round"
		echo "	<ics>: enable ics"
		echo "Syntax for abort mtk fwlog: $0 fwlog --abort"
	fi
	exit
}

# Help option
if [ $# -eq 0 ] || [[ $# -eq 1 ]] && [[ $ACTION != fwlog ]]; then
	show_help
	exit 0
fi

if [[ $PRODUCT == "bcm" ]]; then
	# PIDBCMSWITCH=$(ps | grep switch_info | awk '{print $1}')
	PIDBCMRUNNER=$(ps | grep runner_info | awk '{print $1}')
	if [ $BANDNUM -eq 2 ]; then
		if [[ $CHECK_BAND == "ALL" ]]; then
			BANDS="wl0 wl1"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | awk '{print $1}')
		elif [[ $CHECK_BAND == "2G" ]]; then
			BANDS="wl0"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G" ]]; then
			BANDS="wl1"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		else
			show_help
			exit 0
		fi
	elif [ $BANDNUM -eq 3 ]; then
		if [[ $CHECK_BAND == "ALL" ]]; then
			BANDS="wl0 wl1 wl2"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | awk '{print $1}')
		elif [[ $CHECK_BAND == "2G" ]]; then
			BANDS="wl0"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G1" ]]; then
			BANDS="wl1"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G4" ]]; then
			BANDS="wl2"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		else
			show_help
			exit 0
		fi
	fi
elif [[ $PRODUCT == "qca" ]]; then
	PIDQCANSS=$(ps | grep nss_info | awk '{print $1}')
	PIDQCASWITCH=$(ps | grep switch_info | awk '{print $1}')
	if [ $BANDNUM -eq 2 ]; then
		if [[ $CHECK_BAND == "ALL" ]]; then
			BANDS="wifi0 wifi1"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | awk '{print $1}')
		elif [[ $CHECK_BAND == "2G" ]]; then
			BANDS="wifi0"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G" ]]; then
			BANDS="wifi1"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		else
			show_help
			exit 0
		fi
	elif [ $BANDNUM -eq 3 ]; then
		if [[ $CHECK_BAND == "ALL" ]]; then
			BANDS="wifi0 wifi1 wifi2"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | awk '{print $1}')
		elif [[ $CHECK_BAND == "2G" ]]; then
			BANDS="wifi0"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G1" ]]; then
			BANDS="wifi1"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G4" ]]; then
			BANDS="wifi2"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		else
			show_help
			exit 0
		fi
	fi
elif [[ $PRODUCT == "mtk" ]]; then
	# PIDMTKSWITCH=$(ps | grep switch_info | awk '{print $1}')
	PIDMTKETH=$(ps | grep eth_info | awk '{print $1}')
	PIDMTKHNAT=$(ps | grep hnat_info | awk '{print $1}')
	if [ $BANDNUM -eq 2 ]; then
		if [[ $CHECK_BAND == "ALL" ]]; then
			BANDS="$BAND2GNAME $BAND5GNAME"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | awk '{print $1}')
		elif [[ $CHECK_BAND == "2G" ]]; then
			BANDS="$BAND2GNAME"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $CHECK_BAND == "5G" ]]; then
			BANDS="$BAND5GNAME"
			WLAN_INFO_PIDS=$(ps | grep wlan_info | grep $BANDS | awk '{print $1}')
		elif [[ $ACTION == "fwlog" ]]; then
			echo "mtk fwlog!"
		else
			show_help
			exit 0
		fi
	elif [ $BANDNUM -eq 3 ]; then
		#后续有MTK三频机型了再拓展
		echo "!!!WARNING:MTK NOT SUPPROT TRIPLE_BAND NOW!!!"
	fi
fi

PIDAPS=$(ps | grep aps_info | awk '{print $1}')
PIDSYSTEM=$(ps | grep system_info | awk '{print $1}')
PIDMGT=$(ps | grep mgt_sta_info | awk '{print $1}')
PIDTOPOLOGY=$(ps | grep topology_info | awk '{print $1}')
# ps指令输出的进程长度有限，只能显示到{wan_port_detect} /bin/sh ./wan_port_detect_i，
# 因此这里仅利用“wan_port_detect_”进行过滤
PIDWANPORTDETECT=$(ps | grep wan_port_detect_ | awk '{print $1}')
PIDBHOPT=$(ps | grep bh_optimize_info | awk '{print $1}')
PIDPINGMONITOR=$(ps | grep ping_monitor | awk '{print $1}')

if [[ $ACTION == "start" ]]; then
	run
fi

if [[ $ACTION == "stop" ]]; then
	end
fi

if [[ $ACTION == "fwlog" ]]; then
	mtk_fwlog
fi
