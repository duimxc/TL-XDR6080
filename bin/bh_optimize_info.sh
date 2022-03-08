#!/bin/sh
#
# Backhaul Optimize Command
#
# $Copyright TP-LINK Corporation$
#

BHOPTCMD=bh_optimize
WLCMD=wl
LOOP_TIME=120
NR_RUNS=0

show_help () {
	echo "Syntax: $0 <NrRetries>"
	exit
}

# $2 Heading
# $3 cmd to execute
display_cmd_op(){
	cmd="$2"
	echo "---------------------------------"
	echo -e "$1"
	echo "---------------------------------"
	$cmd |
	while IFS= read -r line
	do
		echo -e "\t""$line"
	done
}

if [ $# -ge 1 ] ; then
	NR_REPEATS=$1
	echo NR_REPEATS=$NR_REPEATS
else
	NR_REPEATS=0
fi

bhopt_info () {
	echo "============================="
	echo "BHOPT info"
	echo "============================="

	display_cmd_op "BHOPT SCAN TABLE: bh_optimize --dump_scan_table" "$BHOPTCMD --dump_scan_table"
	display_cmd_op "BHOPT ROOTAP INFO: bh_optimize --dump_rootap_info" "$BHOPTCMD --dump_rootap_info"
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	bhopt_info
}

echo "============================================"
echo "Statistics for backhaul optimize first run"
echo "============================================"

bhopt_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi
