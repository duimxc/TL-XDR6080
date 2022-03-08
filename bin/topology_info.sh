#!/bin/sh
#
# TOPOLOGY INFO
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

topology_info () {
	# display_cmd_op "TOPOLOGY INFO: topology --dump" "$TOPOLOGYCMD --dump"
	echo "============================="
	echo "mapd json"
	echo "============================="
	cat /tmp/etc/config/mapd.json
}

station_info () {
	# display_cmd_op "WLAN_STA INFO: station --list" "$STATIONCMD --list"
	display_cmd_op "ETH_STA INFO: station --eth_sta list" "$STATIONCMD --eth_sta list"
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "TOPOLOGY INFO ($NR_RUNS)"
	echo "================================="
	topology_info
	station_info
}

echo "================================="
echo "Information for topology_info first run"
echo "================================="

topology_info
station_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi
