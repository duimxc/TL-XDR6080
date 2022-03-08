#!/bin/sh
#
# mtk hnat infomation script
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
	echo "HNAT setting($NR_RUNS)"
	echo "================================="
	if [ $NR_RUNS -ge 0 ]; then
		cat /sys/kernel/debug/hnat/hnat_setting;
	fi
	echo "================================="
	echo "HNAT all_entry($NR_RUNS)"
	echo "================================="
	cat /sys/kernel/debug/hnat/all_entry;
	echo "================================="
	echo "HNAT bind_entry($NR_RUNS)"
	echo "================================="
	echo "1 2" > /sys/kernel/debug/hnat/hnat_entry;
	cat /sys/kernel/debug/hnat/hnat_entry;
}

dump_all_entry_specific () {
	echo "================================="
	echo "HNAT all_entry specific($NR_RUNS)"
	echo "================================="
	sleep 1
	cat /sys/kernel/debug/hnat/all_entry | grep index= | while read line
	do
		line_tmp=$(echo ${line#*index=})
		FOE_INDEX=$(echo ${line_tmp%%|*})
		echo "2 $FOE_INDEX" > /sys/kernel/debug/hnat/hnat_entry
	done
}

if [ "$2" == "all" ]; then
	dump_all_entry_specific
fi

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
	    loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi

