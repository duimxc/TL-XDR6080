#!/bin/sh

DEFAULT_IP="192.168.1.100"
DEFAULT_ROUND=6
DEFAULT_GAP=10

OPTION=$1
IP_DST=${2:-${DEFAULT_IP}}
ROUND=${3:-${DEFAULT_ROUND}}
GAP=${4:-${DEFAULT_GAP}}
ICS=$5

abort() {
	iwpriv ra0 set fwlog=0:0
	iwpriv ra0 mac 820E705C=0FF0000
	iwpriv ra0 mac 820F705C=0FF0000
	rm -rf /tmp/fw_log*
	echo "capture fw_log end"
	exit 0
}

capture() {
	cd /tmp
	echo IP_DST=$IP_DST
	echo ROUND=$ROUND
	echo GAP=$GAP
	echo Cap Time=$(($ROUND*$GAP))s

	sleep 1

	cnt=0
	file_out=

	iwpriv ra0 set fwlogdir=/tmp/
	iwpriv ra0 set fwlog=0:8
	iwpriv ra0 set fw_dbg=1:62
	iwpriv ra0 set fw_dbg=1:63
	iwpriv ra0 set fw_dbg=1:64
	iwpriv ra0 set fw_dbg=1:65
	iwpriv ra0 set fw_dbg=1:66
	iwpriv ra0 set fw_dbg=1:68


	if [[ $ICS == "--ics" ]]; then
		# enable 5G ICS
		iwpriv ra0 mac 820F705C=1FF0000
		iwpriv ra0 mac 820F7060=5780070
		iwpriv ra0 mac 820f4120=1
		iwpriv ra0 mac 820f50d0=1
		# enable 2G ICS
		iwpriv ra0 mac 820E705C=1FF0000
		iwpriv ra0 mac 820E7060=5780070
		iwpriv ra0 mac 820E4120=1
		iwpriv ra0 mac 820E50D0=1
		echo "enable ICS"
	fi

	while :;
	do
		cnt=$(expr $cnt + 1)
		echo "####round $cnt"
		sleep 1

		sleep $GAP
		iwpriv ra0 show trinfo
		sleep 1
		iwpriv ra0 set fwlog=0:0

		sleep 1
		file_out="fw_log-${cnt}.bin"
		if [ -f /tmp/fw_log.bin ]; then
			mv fw_log.bin ${file_out}
			if [[ $cnt == $ROUND ]]; then
				tftp -pl ${file_out} ${IP_DST}
				rm -rf ${file_out}
				iwpriv ra0 mac 820E705C=0FF0000
				iwpriv ra0 mac 820F705C=0FF0000
				echo "capture fw_log end"
				exit 0
			fi
			iwpriv ra0 set fwlog=0:8
			tftp -pl ${file_out} ${IP_DST}
			rm -rf ${file_out}
			echo "put ${file_out} done"
		else
			iwpriv ra0 set fwlog=0:8
			echo "no fw_log.bin"
		fi

	done
}

if [[ $OPTION == "--start" ]]; then
	capture
elif [[ $OPTION == "--abort" ]]; then
	abort
fi

