#!/bin/sh
#
# MGT & STA INFO
#
# $Copyright TP-LINK Corporation$
#

TOPOLOGYCMD=topology
STATIONCMD=station
LOOP_TIME=120
NR_RUNS=0

# $2 Heading
# $3 cmd to execute
display_cmd_op(){
	cmd="$2"
	echo "---------------------------------"
	echo -e "$1"
	echo "---------------------------------"
	$cmd
}

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	NR_REPEATS=$1
else
	NR_REPEATS=0
fi

mgt_info () {
	display_cmd_op "MGT CONFIG INFO: mgt --config" "mgt --config"
	display_cmd_op "MGT SELF INFO: mgt --self" "mgt --self"
	display_cmd_op "MGT STA INFO: mgt --sta" "mgt --sta"
	# 基于MAC打印子路由条目
	#display_cmd_op "MGT DUMP INFO: mgt --dump $mac" "mgt --dump $mac"

	# 以下各项由拓扑学习topology_info.sh打印，这里不重复
	# display_cmd_op "TOPOLOGY INFO: topology --dump" "topology --dump"
	# display_cmd_op "WLAN_STATION INFO: station --list" "station --list"
	# display_cmd_op "ETH_STATION INFO: station --eth_sta list" "station --eth_sta list"
	#echo "============================="
	#echo "mapd json"
	#echo "============================="
	#cat /tmp/etc/config/mapd.json
}

ieee1905_encrypt_debug () {
	echo "============================="
	echo "set ieee1905_encrypt debug"
	echo "============================="
	log_conf --set_mask ieee1905_encrypt
	log_conf --set_level all
}

encrypt_info () {
	display_cmd_op "ENCRYPT INFO: encrypt --key" "encrypt --key"
	#display_cmd_op "ENCRYPT INFO: encrypt --dump $mac" "encrypt --dump $mac"
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "MGT&STA INFO ($NR_RUNS)"
	echo "================================="
	mgt_info
	encrypt_info
}

# ieee1905_encrypt_debug

echo "================================="
echo "Information for mgt&sta first run"
echo "================================="

mgt_info
encrypt_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi