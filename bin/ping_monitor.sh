#!/bin/sh
#
# ping_monitor.sh
#
# $Copyright TP-LINK Corporation$
#

# 遍历arp条目，ping到各个IP地址，并将ping操作的log重定向
arp -n

# 暂且以脚本第一次运行时获取的arp条目为准进行ping操作，不考虑sta ip的变化情况。
IP_ALL=$(arp -n | grep -v "incomplete" | awk '{print $2}' | sed 's/(//' | sed 's/)//')

# SLP/TDMP平台的ping指令很简陋，没有-i来控制间隔时间，为了避免ping操作过多导致刷屏，
# 目前的做法是，在脚本中循环执行ping操作，每次控制发送一次，通过sleep来控制执行频率。
#
# 为了记录时间戳，每次执行ping之前，将date的输出也重定向到log中。但要注意的是，DUT
# 的date时间戳和PC log中的时间戳可能存在一定的差异，因此考虑将当前date同时输出到串口
# 和ping log文件。
#
# 测试结束后，搜索100% loss，然后根据相应的date输出，在串口log中找到对应的date打印，
# 即可定位是何时出现了异常。
while true; do
	DATE_STR=$(date)
	echo $DATE_STR
	for IP in $IP_ALL;
	do
		echo $DATE_STR >> /tmp/ping_$IP.log
		ping $IP -c 1 -W 2 >> /tmp/ping_$IP.log
	done
	sleep 10
done
