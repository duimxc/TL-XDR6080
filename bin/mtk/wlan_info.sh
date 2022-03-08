#!/bin/sh
#
# wlan_info.sh <WiFi band name> <NrRetries>
#
# $Copyright TP-LINK Corporation$
#

BANDNAME=$1
HOSTAPNAME=$BANDNAME'0'
GUESTAPNAME=$BANDNAME'1'
BHAPNAME=$BANDNAME'2'
STAVAPNAME=$(echo $BANDNAME | sed 's/ra/apcli/')'0'
IFNAMES=$(echo $HOSTAPNAME $GUESTAPNAME $BHAPNAME $STAVAPNAME)
LOOP_TIME=120
NR_RUNS=0

show_help () {
	echo "Syntax: $0 <WiFi interface name>"
	echo "Try \`$0 --help' for more information."
	exit
}

# $1 Heading
# $2 cmd to execute
display_cmd_op () {
	cmd="$2"
	echo "---------------------------------"
	echo -e "$1"
	echo "---------------------------------"
	sleep 1   #等待1s防止上面echo的打印与cmd的内核打印重叠
	$cmd |
	while IFS= read -r line
	do
		echo -e "\t""$line"
	done
	sleep 1
}

# Help option
if [[ $# -eq 1 ]] && [[ $1 == "--help" ]]; then
	show_help
	exit 0
fi

if [ $# -eq 0 ] || [ $# -gt 2]; then
	show_help
	exit 0
fi

if [ $# -eq 2 ]; then
	NR_REPEATS=$2
else
	NR_REPEATS=0
fi

# Print info
host_info () {
	echo "============================="
	echo "$BANDNAME host info"
	echo "============================="

	# 驱动基本信息
	display_cmd_op "WIFISYS INFO: iwpriv $HOSTAPNAME show wifi_sys" "iwpriv $HOSTAPNAME show wifi_sys"
	display_cmd_op "DRIVER INFO: iwpriv $HOSTAPNAME show driverinfo" "iwpriv $HOSTAPNAME show driverinfo"
	display_cmd_op "DEV INFO: iwpriv $HOSTAPNAME show devinfo" "iwpriv $HOSTAPNAME show devinfo"
	display_cmd_op "RADIO INFO: iwpriv $HOSTAPNAME show radio_info" "iwpriv $HOSTAPNAME show radio_info"
	display_cmd_op "BSS INFO: iwpriv $HOSTAPNAME show mbss=1" "iwpriv $HOSTAPNAME show mbss=1"
	display_cmd_op "APCFG INFO: iwpriv $HOSTAPNAME show apcfginfo" "iwpriv $HOSTAPNAME show apcfginfo"
	display_cmd_op "SER INFO: iwpriv $HOSTAPNAME show ser" "iwpriv $HOSTAPNAME show ser"

	# DFS相关信息
	display_cmd_op "DFS STATS: iwpriv $HOSTAPNAME show dfschinfo" "iwpriv $HOSTAPNAME show dfschinfo"
	display_cmd_op "NOP STATS: iwpriv $HOSTAPNAME show DfsNOPOfChList" "iwpriv $HOSTAPNAME show DfsNOPOfChList"
	display_cmd_op "FW BW STATS: iwpriv $HOSTAPNAME mac 83181000" "iwpriv $HOSTAPNAME mac 83181000"

	# TX/RX信息,连续循环打印3次
	for i in 1 2 3
	do
		echo "============================="
		echo "Tx/Rx statics：LOOP $i"
		echo "============================="
		display_cmd_op "TX/RX STATS: iwpriv $HOSTAPNAME stat" "iwpriv $HOSTAPNAME stat"
		display_cmd_op "TX/RX RING STATS: iwpriv $HOSTAPNAME show trinfo" "iwpriv $HOSTAPNAME show trinfo"
		display_cmd_op "PLE STATS: iwpriv $HOSTAPNAME show pleinfo" "iwpriv $HOSTAPNAME show pleinfo"
		display_cmd_op "PSE STATS: iwpriv $HOSTAPNAME show pseinfo" "iwpriv $HOSTAPNAME show pseinfo"
		display_cmd_op "MIBINFO STATS: iwpriv $HOSTAPNAME show mibinfo" "iwpriv $HOSTAPNAME show mibinfo"
		display_cmd_op "HOST TOKEN&FP QUEUE STATS: iwpriv $HOSTAPNAME show tpinfo=0-2" "iwpriv $HOSTAPNAME show tpinfo=0-2"
		display_cmd_op "HOST WFDMA INFO: iwpriv $HOSTAPNAME show tpinfo=0-3" "iwpriv $HOSTAPNAME show tpinfo=0-3"
		display_cmd_op "HOST COUNTER INFO: iwpriv $HOSTAPNAME show tpinfo=0-4" "iwpriv $HOSTAPNAME show tpinfo=0-4"
		display_cmd_op "WA DROP STATS: iwpriv $HOSTAPNAME show tpinfo=1-2" "iwpriv $HOSTAPNAME show tpinfo=1-2"
		display_cmd_op "WA AC TAIL DROP INFO: iwpriv $HOSTAPNAME show tpinfo=1-3" "iwpriv $HOSTAPNAME show tpinfo=1-3"
		display_cmd_op "WA BSS TABLE INFO: iwpriv $HOSTAPNAME show tpinfo=1-4" "iwpriv $HOSTAPNAME show tpinfo=1-4"
		display_cmd_op "WA STA RECORD INFO: iwpriv $HOSTAPNAME show tpinfo=1-5" "iwpriv $HOSTAPNAME show tpinfo=1-5"
		display_cmd_op "WA TX FREE NOTIFY INFO: iwpriv $HOSTAPNAME show tpinfo=1-6" "iwpriv $HOSTAPNAME show tpinfo=1-6"
		display_cmd_op "WO DEBUG INFO: iwpriv $HOSTAPNAME show tpinfo=2-1" "iwpriv $HOSTAPNAME show tpinfo=2-1"
		display_cmd_op "WO DEV INFO: iwpriv $HOSTAPNAME show tpinfo=2-2" "iwpriv $HOSTAPNAME show tpinfo=2-2"
		display_cmd_op "WO BSS INFO: iwpriv $HOSTAPNAME show tpinfo=2-3" "iwpriv $HOSTAPNAME show tpinfo=2-3"
		display_cmd_op "WO STA REC INFO: iwpriv $HOSTAPNAME show tpinfo=2-4" "iwpriv $HOSTAPNAME show tpinfo=2-4"
		display_cmd_op "WO BA INFO: iwpriv $HOSTAPNAME show tpinfo=2-5" "iwpriv $HOSTAPNAME show tpinfo=2-5"
		display_cmd_op "WO FBCMD RING INFO: iwpriv $HOSTAPNAME show tpinfo=2-6" "iwpriv $HOSTAPNAME show tpinfo=2-6"
		display_cmd_op "WO RX STATUS: iwpriv $HOSTAPNAME show tpinfo=2-7" "iwpriv $HOSTAPNAME show tpinfo=2-7"
		sleep 1
	done

	#信道占用率信息
	display_cmd_op "CHANNEL BUSY INFO: iwpriv $HOSTAPNAME show mibbucket" "iwpriv $HOSTAPNAME show mibbucket"
	display_cmd_op "CHANNEL BUSY INFO: iwpriv $HOSTAPNAME show serinfo" "iwpriv $HOSTAPNAME show serinfo"

	#四地址/多播转单播信息
	display_cmd_op "A4 TABLE INFO: iwpriv $HOSTAPNAME set APProxyStatus=1" "iwpriv $HOSTAPNAME set APProxyStatus=1"
	display_cmd_op "IGMP GROUP INFO: iwpriv $HOSTAPNAME show igmpinfo" "iwpriv $HOSTAPNAME show igmpinfo"

	#warp相关信息
	display_cmd_op "cat /proc/warp_ctrl/warp0/tx" "cat /proc/warp_ctrl/warp0/tx"
	display_cmd_op "cat /proc/warp_ctrl/warp0/wo" "cat /proc/warp_ctrl/warp0/wo"
	display_cmd_op "cat /proc/warp_ctrl/warp0/cfg" "cat /proc/warp_ctrl/warp0/cfg"
	display_cmd_op "cat /proc/warp_ctrl/warp0/stat" "cat /proc/warp_ctrl/warp0/stat"

	for IFACENAME in $IFNAMES;
	do
		if [[ $IFACENAME == "rax1" ]] || [[ $IFACENAME == "rai1" ]]; then
			continue
		fi

		#vap info can be writen here
		display_cmd_op "ASSOCLIST: iwpriv $IFACENAME show stainfo" "iwpriv $IFACENAME show stainfo"
		display_cmd_op "ALL MAC TBALE: iwpriv $IFACENAME show stainfo=1" "iwpriv $IFACENAME show stainfo=1"

		if [[ $IFACENAME == "apcli0" ]] || [[ $IFACENAME == "apclix0" ]] \
					|| [[ $IFACENAME == "apclii0" ]]; then
			continue
		fi

		# 一些需要跳过stavap的指令写在这
	done
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "Statistics for $BANDNAME run $NR_RUNS/$NR_REPEATS @$LOOP_TIME s"
	echo "================================="
	host_info
}

# Real entry of the shell script
echo "================================="
echo "Statistics for $BANDNAME first run"
echo "================================="
host_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
	while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
		loop_commands
	done
fi
