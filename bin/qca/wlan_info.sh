#!/bin/sh
#
# wlan_info.sh <WiFi band name> <NrRetries>
#
# $Copyright TP-LINK Corporation$
#

BANDNAME=$1
HOSTAPNAME=$(echo $BANDNAME | sed 's/wifi/ath/')
GUESTAPNAME=$(echo $BANDNAME | sed 's/wifi/guest/')
BHAPNAME=$(echo $BANDNAME | sed 's/wifi/bhap/')
STAVAPNAME=$(echo $BANDNAME | sed 's/wifi/wdscli/')
IFNAMES=$(echo $HOSTAPNAME $GUESTAPNAME $BHAPNAME $STAVAPNAME)
LOOP_TIME=120
NR_RUNS=0

show_help () {
	echo "Syntax: $0 <WiFi interface name>"
	echo "Try \`$0 --help' for more information."
	exit
}

# $1 Heading
# $2 cmd to execute
display_cmd_op () {
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

# Help option
if [[ $# -eq 1 ]] && [[ $1 == "--help" ]]; then
	show_help
	exit 0
fi

if [ $# -eq 0 ] || [ $# -gt 2]; then
	show_help
	exit 0
fi

if [ $# -eq 2 ]; then
	NR_REPEATS=$2
else
	NR_REPEATS=0
fi

# Print info
driver_info () {
	echo "============================="
	echo "$BANDNAME Driver info"
	echo "============================="

	display_cmd_op "DEVINFO: device info" "devinfo"
	display_cmd_op "CPU TEMPERATURE: cat /sys/class/thermal/thermal_zone*/temp" "cat /sys/class/thermal/thermal_zone*/temp"
	display_cmd_op "UPTIME: System uptime" "uptime"
}

host_info () {
	echo "============================="
	echo "$BANDNAME host info"
	echo "============================="

	display_cmd_op "DEV INFO: iw dev" "iw dev"
	display_cmd_op "AVAILABLE CAHNNELS: iwlist $HOSTAPNAME channel" "iwlist $HOSTAPNAME channel"
	display_cmd_op "CURRENT MODE: iwpriv $HOSTAPNAME get_mode" "iwpriv $HOSTAPNAME get_mode"

	display_cmd_op "PDEV TX STATS: iwpriv $HOSTAPNAME txrx_stats 260" "iwpriv $HOSTAPNAME txrx_stats 260"
	display_cmd_op "PDEV RX STATS: iwpriv $HOSTAPNAME txrx_stats 261" "iwpriv $HOSTAPNAME txrx_stats 261"

	display_cmd_op "PDEV TX RATE STATS: iwpriv $HOSTAPNAME txrx_stats 259" "iwpriv $HOSTAPNAME txrx_stats 259"
	display_cmd_op "PDEV RX RATE STATS: iwpriv $HOSTAPNAME txrx_stats 258" "iwpriv $HOSTAPNAME txrx_stats 258"

	display_cmd_op "HAL RING STATS: iwpriv $HOSTAPNAME txrx_stats 263" "iwpriv $HOSTAPNAME txrx_stats 263"

	display_cmd_op "HOST AST TABLE: iwpriv $HOSTAPNAME txrx_stats 262" "iwpriv $HOSTAPNAME txrx_stats 262"

	display_cmd_op "RADIO LEVEL STATS: apstats -r -i $BANDNAME" "apstats -r -i $BANDNAME"

	for IFACENAME in $IFNAMES;
	do
		if [[ $IFACENAME == "guest1" ]] || [[ $IFACENAME == "guest2" ]]; then
			continue
		fi

		#vap info can be writen here
		display_cmd_op "VAP LEVEL STATS: apstats -v -i $IFACENAME" "apstats -v -i $IFACENAME"

		if [[ $IFACENAME == "wdscli0" ]] || [[ $IFACENAME == "wdscli1" ]] \
					|| [[ $IFACENAME == "wdscli2" ]]; then
			continue
		fi

		display_cmd_op "ASSOCLIST: wlanconfig $IFACENAME list" "wlanconfig $IFACENAME list"
	done
}

firmware_info () {
	echo "============================="
	echo "$BANDNAME firmware info"
	echo "============================="

	display_cmd_op "FW TX STATS: wifistats $BANDNAME 1" "wifistats $BANDNAME 1"
	display_cmd_op "FW RX STATS: wifistats $BANDNAME 2" "wifistats $BANDNAME 2"

	display_cmd_op "FW TX RATE STATS: wifistats $BANDNAME 9" "wifistats $BANDNAME 9"
	display_cmd_op "FW RX RATE STATS: wifistats $BANDNAME 10" "wifistats $BANDNAME 10"

	display_cmd_op "FW TX SELFGEN STATS: wifistats $BANDNAME 12" "wifistats $BANDNAME 12"
	display_cmd_op "FW TQM PDEV STATS: wifistats $BANDNAME 6" "wifistats $BANDNAME 6"
	display_cmd_op "FW TXDE STATS: wifistats $BANDNAME 8" "wifistats $BANDNAME 8"

	display_cmd_op "FW REO QUEUE STATS: wifistats $BANDNAME 24" "wifistats $BANDNAME 24"
	display_cmd_op "FW REO QUEUE STATS: iwpriv $HOSTAPNAME txrx_stats 26" "iwpriv $HOSTAPNAME txrx_stats 26"
	display_cmd_op "FW AST TABLE: wifistats $BANDNAME 18" "wifistats $BANDNAME 18"

	display_cmd_op "FW CCA STATS: wifistats $BANDNAME 19" "wifistats $BANDNAME 19"
	display_cmd_op "FW RX PHY STATS: wifistats $BANDNAME 37" "wifistats $BANDNAME 37"

	display_cmd_op "FW TEMPERATURE STATS: thermaltool -i $BANDNAME -get" "thermaltool -i $BANDNAME -get"
}

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`
	echo "================================="
	echo "Statistics for $BANDNAME run $NR_RUNS/$NR_REPEATS @$LOOP_TIME s"
	echo "================================="
	host_info
	firmware_info
}

# Real entry of the shell script
driver_info

echo "================================="
echo "Statistics for $BANDNAME first run"
echo "================================="
host_info
firmware_info

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
	while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
		loop_commands
	done
fi
