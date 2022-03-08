#!/bin/sh
#
# eth infomation script
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
	# switch端信息
	echo "================================="
	echo "rtl8367s esw_cnt($NR_RUNS)"
	echo "================================="
	cat /proc/rtk_gsw/esw_cnt
	echo "================================="
	echo "rtl8367s vlan($NR_RUNS)"
	echo "================================="
	cat /proc/rtk_gsw/vlan
	cat /proc/rtk_gsw/svlan
	echo "================================="
	echo "rtl8367s rtk_fc($NR_RUNS)"
	echo "================================="
	cat /proc/rtk_gsw/rtk_fc
	# cpu端统计信息
	echo "================================="
	echo "mtketh esw_cnt($NR_RUNS)"
	echo "================================="
	cat /proc/mtketh/esw_cnt
	echo "================================="
	echo "mtketh dbg_regs($NR_RUNS)"
	echo "================================="
	cat /proc/mtketh/dbg_regs
	echo "================================="
	echo "mtketh free page number in PSE($NR_RUNS)"
	echo "================================="
	regs d 0x15100240
	echo "================================="
	echo "mtk QDMA queues($NR_RUNS)"
	echo "================================="
	for i in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
	do
		echo "#################################"
		echo "qdma_txq$i"
		cat /sys/kernel/debug/hnat/qdma_txq$i
	done
	for i in 0 1 2 3
	do
		echo "#################################"
		echo "qdma_sch$i"
		cat /sys/kernel/debug/hnat/qdma_sch$i
	done

	echo "================================="
	echo "mtk interrupts($NR_RUNS)"
	echo "================================="
	cat /proc/interrupts
	echo "================================="
	echo "mtk softirq($NR_RUNS)"
	echo "================================="
	cat /proc/softirqs
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

