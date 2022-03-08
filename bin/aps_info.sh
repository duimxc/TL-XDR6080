#!/bin/sh
#
# APS Command
#
# $Copyright TP-LINK Corporation$
#

APSCMD=aps
LOOP_TIME=60
NR_RUNS=0

show_help () {
	echo "Some aps command"
	echo "Example 1: aps -s or aps --status(aps status)"
	echo "Example 2: aps -dp or aps --dump_port_info(dump port info)"
	echo "Example 3: aps -db or aps --dump_backhaul(dump backhaul info)"
	echo "Example 4: aps -ds or aps --dump_stream(dump stream rule)"
	echo "Example 5: aps -dc or aps --dump_client(dump client rule)"
	echo "Example 6: aps -on/-off or aps --on/--off(enable/disable aps)"
	echo "Example 7: aps -sbb <bitmap> or aps --set_backhaul_bitmap <bitmap>, 1 for 2G, 2 for 5G, 3 for dul_bh"
	echo "Example 8: aps -ptc <interface> <cfg> or aps --port_transmit_config <interface> <cfg>, cfg: 0,1,2 means auto, 1905-only, 1905-probe-only"
	echo "Try \`aps --help' for more information."
	#exit
}

# $2 Heading
# $3 cmd to execute
display_cmd_op(){
	cmd="$2"
	echo "---------------------------------"
	echo -e "$1"
	echo "---------------------------------"
	$cmd
}

if [[ $# -eq 0 ]]; then
	show_help
fi

# Help option
if [[ $# -eq 1 ]] && [[ $1 == "--help" ]]; then
	show_help
fi

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	NR_REPEATS=$1
else
	NR_REPEATS=0
fi

aps_info () {
	display_cmd_op "APS port_info: aps -dp" "$APSCMD -dp"
	display_cmd_op "APS backhaul_info: aps -db" "$APSCMD -db"
	display_cmd_op "APS FDB INFO: aps -df" "$APSCMD -df"
	#流规则条目数较多时，打印流规则条目会刷屏，这里只打印流
	#规则数目，而不打印具体的规则
	display_cmd_op "APS stream_rule count: aps -dsc" "$APSCMD -dsc"
	display_cmd_op "APS client_rule: aps -dc" "$APSCMD -dc"
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "APS INFO($NR_RUNS)"
	echo "================================="
	aps_info
}

echo "================================="
echo "Information for aps first run"
echo "================================="

aps_info
# 此两项不会变动，只打印一次就好
display_cmd_op "APS args: aps -arg" "$APSCMD -arg"
display_cmd_op "APS status: aps --status" "$APSCMD -s"

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi