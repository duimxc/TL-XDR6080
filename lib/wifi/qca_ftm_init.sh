#!/bin/sh
# This script is used for qca-diag/ftm to get FTM environment ready.
# by hxb, 2020.08.28

#constant
MODULE_NAME=qca_ol
MODULE_WIFI_3_0=wifi_3_0

devList=$(iw dev | grep Interface | cut -d' ' -f2)

# variable
module_para=
testmode=
operstate=
cnt=
ip=

unload_module() {
	TARGET=$1
	echo "TARGET=$TARGET"
	MODULE=$(lsmod | awk '{if ($1 == "'$TARGET'") {print $4}}')
	echo "MODULE=$MODULE"
	if [ "${MODULE}" != "" ]
	then
		DEP=${MODULE//,/ }
		echo "DEP=$DEP"
		for i in $DEP
		do
			echo "i=$i"
			rmmod ${i}
		done
	fi
}

# Check if br-lan is up, if not, wait until the completition
# (max 60 secs)
cnt=0
while [ $cnt -le 60 ]; do
	operstate=$(cat /sys/class/net/br-lan/operstate)
	[ "${operstate}" == "up" ] && break
	sleep 1
	cnt=$((cnt + 1))
done

# Read the ip from br-lan inet addr
ip=$(ifconfig br-lan | grep "inet addr" | cut -d "." -f3)

for ifname in ${devList}; do (
	iw $ifname del
); done

if [ -d "/sys/module/${MODULE_NAME}" ]; then
	testmode=$(cat /sys/module/${MODULE_NAME}/parameters/testmode)
	if [ $testmode -eq 0 ]; then
		module_para="testmode=1"
		rmmod ${MODULE_WIFI_3_0}
		unload_module ${MODULE_NAME}
		rmmod ${MODULE_NAME}
		insmod ${MODULE_NAME} ${module_para}
		insmod ${MODULE_WIFI_3_0}
	fi
fi

# Auto startup diag_socket_app and ftm
if [ -x /usr/sbin/diag_socket_app ]; then
	/usr/sbin/diag_socket_app -a 192.168.$ip.100 &

	cnt=0
	while [ $cnt -le 10 ]; do
		sleep 1
		proNumber=$(ps | grep -w diag_socket_app | grep -v grep|wc -l)
		[ $proNumber -gt 0 ] && break
		/usr/sbin/diag_socket_app -a 192.168.$ip.100 &
		cnt=$((cnt + 1))
	done
fi

if [ -x /usr/sbin/ftm ]; then
	/usr/sbin/ftm -n &
fi
