#!/bin/sh
#
# switch infomation script
#
# $Copyright TP-LINK Corporation$
#
LOOP_TIME=60
NR_RUNS=0

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	NR_REPEATS=$1
else
	NR_REPEATS=0
fi

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "esw_cnt($NR_RUNS)"
	echo "================================="
	cat /proc/rtk_gsw/esw_cnt
	echo "================================="
	echo "vlan($NR_RUNS)"
	echo "================================="
	cat /proc/rtk_gsw/vlan
	echo "================================="
	echo "rtk_fc($NR_RUNS)"
	echo "================================="
	cat /proc/rtk_gsw/rtk_fc
}

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
	    loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi

