#!/bin/sh
#
# $Copyright TP-LINK Corporation$
#

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	TFTPS_IP=$1
        echo "PC_IP is: $TFTPS_IP"
else
        TFTPS_IP=192.168.1.10
fi

VALGRIND_IPK_FILE=valgrind_3.15.0-2_brcm949xx.ipk
VALGRIND_HELGRIND_IPK_FILE=valgrind-helgrind_3.15.0-2_brcm949xx.ipk

cd /tmp

df -h

tftp -gr ${VALGRIND_IPK_FILE} ${TFTPS_IP}
opkg install ${VALGRIND_IPK_FILE}

tftp -gr ${VALGRIND_HELGRIND_IPK_FILE} ${TFTPS_IP}
opkg install ${VALGRIND_HELGRIND_IPK_FILE}

df -h

echo
echo "Done."
