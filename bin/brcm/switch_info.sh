#!/bin/sh
#
# switch infomation script
#
# $Copyright TP-LINK Corporation$
#
ETHSWCTLCMD=ethswctl
ETHCTLCMD=ethctl
LOOP_TIME=1
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

ethctl_info () {
	echo "============================="
	echo "ethctl info"
	echo "============================="

	display_cmd_op "PHY-MAP: ethctl phy-map" "ethctl phy-map"
	display_cmd_op "eth0-stats: ethctl eth0 stats" "$ETHCTLCMD eth0 stats"
	display_cmd_op "eth1-stats: ethctl eth1 stats" "$ETHCTLCMD eth1 stats"
	display_cmd_op "eth2-stats: ethctl eth2 stats" "$ETHCTLCMD eth2 stats"
	display_cmd_op "eth3-stats: ethctl eth3 stats" "$ETHCTLCMD eth3 stats"
	display_cmd_op "eth4-stats: ethctl eth4 stats" "$ETHCTLCMD eth4 stats"
	display_cmd_op "eth5-stats: ethctl eth5 stats" "$ETHCTLCMD eth5 stats"
}

ethswctl_info () {
	echo "============================="
	echo "ethswctl mibdump info"
	echo "============================="

	display_cmd_op "n0p0_info: ethswctl -c mibdump -n 0 -p 0 -a" "$ETHSWCTLCMD -c mibdump -n 0 -p 0 -a"
	display_cmd_op "n0p1_info: ethswctl -c mibdump -n 0 -p 1 -a" "$ETHSWCTLCMD -c mibdump -n 0 -p 1 -a"
	display_cmd_op "n0p2_info: ethswctl -c mibdump -n 0 -p 2 -a" "$ETHSWCTLCMD -c mibdump -n 0 -p 2 -a"
	display_cmd_op "n0p3_info: ethswctl -c mibdump -n 0 -p 3 -a" "$ETHSWCTLCMD -c mibdump -n 0 -p 3 -a"
	display_cmd_op "n1p0_info: ethswctl -c mibdump -n 1 -p 0 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 0 -a"
	display_cmd_op "n1p1_info: ethswctl -c mibdump -n 1 -p 1 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 1 -a"
	display_cmd_op "n1p2_info: ethswctl -c mibdump -n 1 -p 2 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 2 -a"
	display_cmd_op "n1p3_info: ethswctl -c mibdump -n 1 -p 3 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 3 -a"
	display_cmd_op "n1p4_info: ethswctl -c mibdump -n 1 -p 4 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 4 -a"
	display_cmd_op "n1p5_info: ethswctl -c mibdump -n 1 -p 5 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 5 -a"
	display_cmd_op "n1p7_info: ethswctl -c mibdump -n 1 -p 7 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 7 -a"
	display_cmd_op "n1p8_info: ethswctl -c mibdump -n 1 -p 8 -a" "$ETHSWCTLCMD -c mibdump -n 1 -p 8 -a"
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "SWITCH INFO ($NR_RUNS)"
	echo "================================="
	ethswctl_info
	ethctl_info
}

echo "================================="
echo "SWITCH info first run"
echo "================================="

ethswctl_info
ethctl_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi