#!/bin/sh
#
# export files to PC
# Usage: ./export_data 192.168.1.100
# $Copyright TP-LINK Corporation$
#
show_help () {
	echo "Syntax: $0 PC_IP"
	exit
}

rm_old_tar_data () {
	rm -rf /tmp/backup
}

tar_data () {
	mkdir -p /tmp/backup

	cd /
	tar -cvzf /tmp/backup/tmp.tar.gz tmp
	tar -cvzf /tmp/backup/bcm_data.tar.gz bcm_data
	tar -cvzf /tmp/backup/bin.tar.gz bin
	tar -cvzf /tmp/backup/bootfs.tar.gz bootfs
	tar -cvzf /tmp/backup/conf.tar.gz conf
	tar -cvzf /tmp/backup/data.tar.gz data
	tar -cvzf /tmp/backup/etc.tar.gz etc
	tar -cvzf /tmp/backup/lib.tar.gz lib
	tar -cvzf /tmp/backup/mnt.tar.gz mnt
	tar -cvzf /tmp/backup/overlay.tar.gz overlay
	tar -cvzf /tmp/backup/rom.tar.gz rom
	tar -cvzf /tmp/backup/root.tar.gz root
	tar -cvzf /tmp/backup/sbin.tar.gz sbin
	tar -cvzf /tmp/backup/tp_data.tar.gz tp_data
	tar -cvzf /tmp/backup/tp_fac.tar.gz tp_fac
	tar -cvzf /tmp/backup/usr.tar.gz usr
	tar -cvzf /tmp/backup/web.tar.gz web
	tar -cvzf /tmp/backup/www.tar.gz www
}

if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	TFTPS_IP=$1
	echo "PC_IP is: $TFTPS_IP"
else
	TFTPS_IP=192.168.1.10
fi

export_data_to_pc () {
	cd /tmp/backup/
	tftp -pl bcm_data.tar.gz ${TFTPS_IP}
	tftp -pl bin.tar.gz ${TFTPS_IP}
	tftp -pl bootfs.tar.gz ${TFTPS_IP}
	tftp -pl conf.tar.gz ${TFTPS_IP}
	tftp -pl data.tar.gz ${TFTPS_IP}
	tftp -pl etc.tar.gz ${TFTPS_IP}
	tftp -pl lib.tar.gz ${TFTPS_IP}
	tftp -pl mnt.tar.gz ${TFTPS_IP}
	tftp -pl overlay.tar.gz ${TFTPS_IP}
	tftp -pl rom.tar.gz ${TFTPS_IP}
	tftp -pl root.tar.gz ${TFTPS_IP}
	tftp -pl sbin.tar.gz ${TFTPS_IP}
	tftp -pl tp_data.tar.gz ${TFTPS_IP}
	tftp -pl tp_fac.tar.gz ${TFTPS_IP}
	tftp -pl usr.tar.gz ${TFTPS_IP}
	tftp -pl web.tar.gz ${TFTPS_IP}
	tftp -pl www.tar.gz ${TFTPS_IP}
	tftp -pl tmp.tar.gz ${TFTPS_IP}
}

rm_old_tar_data
tar_data
export_data_to_pc
