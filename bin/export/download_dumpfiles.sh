#!/bin/sh
#
# export coredump&memdump to PC
# Usage: ./download_dumpfiles.sh 192.168.1.100
# $Copyright TP-LINK Corporation$
#
show_help () {
	echo "Syntax: $0 PC_IP"
	exit
}

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	TFTPS_IP=$1
	echo "PC_IP is: $TFTPS_IP"
else
	TFTPS_IP=192.168.1.10
fi

export_dumpfiles () {
	if [ -d "/dumpfiles/"]; then
		cd /dumpfiles
	else
		echo "No dir /dumpfiles"
		echo "Please execute tar_dumpfiles.sh first"
		exit
	fi

	if [ -f "*.tar.gz" ]; then
		cd /tmp
		tar -cvzf /tmp/dumpfiles.tar.gz /dumpfiles/
	else
		echo "No dumpfiles"
		exit
	fi

	tftp -pl dumpfiles.tar.gz ${TFTPS_IP}
}

export_dumpfiles
