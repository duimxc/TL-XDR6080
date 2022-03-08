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
	echo "ecm_entry($NR_RUNS)"
	echo "================================="
	ecm_dump.sh | grep -E 'ip|port' | grep -v front;

	echo "================================="
	echo "NSS_ipv4($NR_RUNS)"
	echo "================================="
	cat /sys/kernel/debug/qca-nss-drv/stats/ipv4
	echo "================================="
	echo "NSS_n2h($NR_RUNS)"
	echo "================================="
	cat /sys/kernel/debug/qca-nss-drv/stats/n2h
	echo "================================="
	echo "NSS_wifili($NR_RUNS)"
	echo "================================="
	cat /sys/kernel/debug/qca-nss-drv/stats/wifili
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

