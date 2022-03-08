#!/bin/sh

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	TFTPS_IP=$1
	echo "PC_IP is: $TFTPS_IP"
else
	TFTPS_IP=192.168.1.10
fi

LOG_FILE=valgrind-logs_$(randstr.sh).tar.gz

echo "Compressing log files ..."

cd /tmp

tar cvzf ${LOG_FILE} /root/vg

echo
echo "File: ${LOG_FILE}"
echo "IP: ${TFTPS_IP}"

echo "Downloading valgrind log files ..."

tftp -pl ${LOG_FILE} ${TFTPS_IP}

echo "Done."
