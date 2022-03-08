#!/bin/sh
#
# Copyright (c) 2020 Qualcomm Technologies, Inc.
#
# All Rights Reserved.
# Confidential and Proprietary - Qualcomm Technologies, Inc.
#
#

[ -e /lib/ipq806x.sh ] && . /lib/ipq806x.sh
. /lib/functions.sh

low_mem_compress_art()
{
	local mtdblock=$(find_mtd_part art)

	if [ -z "$mtdblock" ]; then
		# read from mmc
		mtdblock=$(find_mmc_part art)
	fi

	[ -n "$mtdblock" ] || return

	local apmp="/tmp"

	tar -zcvf ${apmp}/virtual_art.bin.tar.xz ${apmp}/virtual_art.bin || {
		echo "Error Compressing Virtual ART" > /dev/console
		return
	}

	dd if=${apmp}/virtual_art.bin.tar.xz of=${mtdblock}
	echo "Success compressing Virtual ART(${mtdblock})" > /dev/console
	return
}

normal_art()
{
	local mtdblock=$(find_mtd_part art)

	if [ -z "$mtdblock" ]; then
		# read from mmc
		mtdblock=$(find_mmc_part art)
	fi

	[ -n "$mtdblock" ] || return

	local apmp="/tmp"

	dd if=${apmp}/virtual_art.bin of=${mtdblock}
	echo "Success writing to ART(${mtdblock})" > /dev/console
	return
}

write_caldata()
{
	local board
	[ -f /tmp/sysinfo/board_name ] && {
		board=ap$(cat /tmp/sysinfo/board_name | awk -F 'ap' '{print$2}')
	}

	if [ -e /sys/firmware/devicetree/base/compressed_art ]
	then
		echo "Compressed ART Supported Platform $board " > /dev/console
		low_mem_compress_art
	else
		echo "Non Compressed ART Platform $board " > /dev/console
		normal_art
	fi
}

if [ "$1" = "write_caldata" ]
then
	write_caldata
fi
