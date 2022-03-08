#!/bin/sh
#
# WAN_PORT_DETECT INFO
#
# $Copyright TP-LINK Corporation$
#

WANPORTDETECTCMD=wan_port_detect
# 由于已经开启了wan_port_detect debug，周期可以长些
LOOP_TIME=300
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

wan_port_detect_debug () {
	display_cmd_op "Start log_conf wan_port_detect: log_conf --set_mask wan_port_detect" "log_conf --set_mask wan_port_detect"
	display_cmd_op "set wan_port_detect level: log_conf --set_level all" "log_conf --set_level all"
}

wan_port_detect_info () {
	display_cmd_op "WAN_PORT_DETECT status: wan_port_detect" "$WANPORTDETECTCMD"
	echo "============================="
	echo "wan_port_detect json"
	echo "============================="
	cat /tmp/etc/config/wan_port_detect.json
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "WAN_PORT_DETECT INFO ($NR_RUNS)"
	echo "================================="
	wan_port_detect_info
}

echo "============================="
echo "start wan_port_detect debug"
echo "============================="
# wan_port_detect_debug

echo "================================="
echo "Information for wan_port_detect first run"
echo "================================="

wan_port_detect_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi