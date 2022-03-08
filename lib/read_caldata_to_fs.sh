#!/bin/sh
#
# Copyright (c) 2015 The Linux Foundation. All rights reserved.
# Copyright (C) 2011 OpenWrt.org

. /lib/ipq806x.sh

read_caldata()
{
    local fileName=$1
    local radioScheme=$2
    local apdk="/tmp"
    local FILESIZE=131072
    local caldata_index=0
    local radio_index=0

    DEV=${radioScheme//,/ }
    echo "DEVICE=$DEV"
    for i in $DEV
    do
        case "${i}" in
            IPQ5018)
                mkdir -p ${apdk}/${i}
                dd if=${fileName} of=${apdk}/${i}/caldata.bin bs=1 count=$FILESIZE skip=4096
                ln -s ${apdk}/${i}/caldata.bin /lib/firmware/${i}/caldata.bin

                dd if=${fileName} of=${apdk}/calTag bs=1 count=2 skip=4094

                radio_index=$((radio_index + 1))
            ;;
            qcn9000 | qcn6122)
                caldata_index=$((caldata_index + 1))
                mkdir -p ${apdk}/${i}

                if [ "${caldata_index}" == "1" ]; then
                    dd if=${fileName} of=${apdk}/${i}/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    ln -s ${apdk}/${i}/caldata_1.bin /lib/firmware/${i}/caldata_1.bin
                elif [ "${caldata_index}" == "2" ]; then
                    dd if=${fileName} of=${apdk}/${i}/caldata_2.bin bs=1 count=$FILESIZE skip=311296
                    ln -s ${apdk}/${i}/caldata_2.bin /lib/firmware/${i}/caldata_2.bin
                fi

                if [ "${radio_index}" == "0" ]; then
                    dd if=${fileName} of=${apdk}/calTag bs=1 count=2 skip=157694
                elif [ "${radio_index}" == "1" ]; then
                    if [ "${caldata_index}" == "1" ]; then
                        dd if=${fileName} of=${apdk}/calTag_1 bs=1 count=2 skip=157694
                    elif [ "${caldata_index}" == "2" ]; then
                        dd if=${fileName} of=${apdk}/calTag_1 bs=1 count=2 skip=311294
                    fi
                elif [ "${radio_index}" == "2" ]; then
                    dd if=${fileName} of=${apdk}/calTag_2 bs=1 count=2 skip=311294
                fi

                radio_index=$((radio_index + 1))
            ;;
        esac
    done
}

do_load_ipq4019_board_bin()
{
    local board=$(ipq806x_board_name)
    local mtdblock=$(find_mtd_part art)

    local apdk="/tmp"
    local radioScheme=$(cat /proc/cmdline | awk -F 'radioScheme=' '{print $2}')

    if [ -z "$mtdblock" ]; then
        # read from mmc
        mtdblock=$(find_mmc_part art)
    fi

    [ -n "$mtdblock" ] || return

    # load board.bin
    case "$board" in
            ap-dk0*)
                    mkdir -p ${apdk}
                    dd if=${mtdblock} of=${apdk}/wifi0.caldata bs=32 count=377 skip=128
                    dd if=${mtdblock} of=${apdk}/wifi1.caldata bs=32 count=377 skip=640
            ;;
            ap16* | ap148*)
                    mkdir -p ${apdk}
                    dd if=${mtdblock} of=${apdk}/wifi0.caldata bs=32 count=377 skip=128
                    dd if=${mtdblock} of=${apdk}/wifi1.caldata bs=32 count=377 skip=640
                    dd if=${mtdblock} of=${apdk}/wifi2.caldata bs=32 count=377 skip=1152
            ;;
            ap-hk14 | ap-hk01-c6)
                    mkdir -p ${apdk}/IPQ8074
                    FILESIZE=131072
                    #FTM Daemon compresses the caldata and writes the tar file in ART Partition
                    dd if=${mtdblock} of=${apdk}/virtual_art.bin.tar.xz
                    tar -zxvf  ${apdk}/virtual_art.bin.tar.xz || {
                        # Create dummy virtual_art.bin file of size 512K
                        dd if=/dev/zero of=${apdk}/virtual_art.bin bs=1024 count=512
                    }

                    # Read after 4KB
                    dd if=${apdk}/virtual_art.bin of=${apdk}/IPQ8074/caldata.bin bs=1 count=$FILESIZE skip=4096
                    # Read IPQ8074 calTag and calTag_2
                    dd if=${apdk}/virtual_art.bin of=${apdk}/calTag bs=1 count=2 skip=4094
                    dd if=${apdk}/virtual_art.bin of=${apdk}/calTag_2 bs=1 count=2 skip=4094

                    mkdir -p ${apdk}/qcn9000
                    # Read after 154KB
                    dd if=${apdk}/virtual_art.bin of=${apdk}/qcn9000/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    # Read qcn9000 calTag
                    dd if=${apdk}/virtual_art.bin of=${apdk}/calTag_1 bs=1 count=2 skip=157694
                    ln -s ${apdk}/IPQ8074/caldata.bin /lib/firmware/IPQ8074/caldata.bin
                    ln -s ${apdk}/qcn9000/caldata_1.bin /lib/firmware/qcn9000/caldata_1.bin
            ;;
            ap-hk01-*)
                    HK_BD_FILENAME=/lib/firmware/IPQ8074/bdwlan.bin
                    mkdir -p ${apdk}/IPQ8074
                    if [ -f "$HK_BD_FILENAME" ]; then
                        FILESIZE=$(stat -Lc%s "$HK_BD_FILENAME")
                    else
                        FILESIZE=131072
                    fi
                    dd if=${mtdblock} of=${apdk}/IPQ8074/caldata.bin bs=1 count=$FILESIZE skip=4096
                    [ -L /lib/firmware/IPQ8074/caldata.bin ] || \
                    ln -s ${apdk}/IPQ8074/caldata.bin /lib/firmware/IPQ8074/caldata.bin
            ;;
            ap-hk10-*)
                    FILESIZE=131072
                    mkdir -p ${apdk}/IPQ8074
                    dd if=${mtdblock} of=${apdk}/IPQ8074/caldata.bin bs=1 count=$FILESIZE skip=4096
                    ln -s ${apdk}/IPQ8074/caldata.bin /lib/firmware/IPQ8074/caldata.bin

                    mkdir -p ${apdk}/qcn9000
                    dd if=${mtdblock} of=${apdk}/qcn9000/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    dd if=${mtdblock} of=${apdk}/qcn9000/caldata_2.bin bs=1 count=$FILESIZE skip=311296
                    ln -s ${apdk}/qcn9000/caldata_1.bin /lib/firmware/qcn9000/caldata_1.bin
                    ln -s ${apdk}/qcn9000/caldata_2.bin /lib/firmware/qcn9000/caldata_2.bin
        ;;
            ap-hk* | ap-ac* | ap-oa*)
                    HK_BD_FILENAME=/lib/firmware/IPQ8074/bdwlan.bin
                    mkdir -p ${apdk}/IPQ8074
                    dd if=${mtdblock} of=${apdk}/wifi1.caldata bs=1 count=12064 skip=208896
                    if [ -f "$HK_BD_FILENAME" ]; then
                        FILESIZE=$(stat -Lc%s "$HK_BD_FILENAME")
                    else
                        FILESIZE=131072
                    fi
                    dd if=${mtdblock} of=${apdk}/IPQ8074/caldata.bin bs=1 count=$FILESIZE skip=4096
                    [ -L /lib/firmware/IPQ8074/caldata.bin ] || \
                    ln -s ${apdk}/IPQ8074/caldata.bin /lib/firmware/IPQ8074/caldata.bin
            ;;
            ap-cp01-c3*)
                    CP_BD_FILENAME=/lib/firmware/IPQ6018/bdwlan.bin
                    mkdir -p ${apdk}/IPQ6018
                    if [ -f "$CP_BD_FILENAME" ]; then
                        FILESIZE=$(stat -Lc%s "$CP_BD_FILENAME")
                    else
                        FILESIZE=65536
                    fi
                    dd if=${mtdblock} of=${apdk}/IPQ6018/caldata.bin bs=1 count=$FILESIZE skip=4096
                    [ -L /lib/firmware/IPQ6018/caldata.bin ] || \
                    ln -s ${apdk}/IPQ6018/caldata.bin /lib/firmware/IPQ6018/caldata.bin

                    mkdir -p ${apdk}/qcn9000
                    FILESIZE=131072
                    dd if=${mtdblock} of=${apdk}/qcn9000/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    ln -s ${apdk}/qcn9000/caldata_1.bin /lib/firmware/qcn9000/caldata_1.bin
            ;;
            ap-mp02.1* | db-mp02.1*)
                    # virtual_art.bin layout：
                    ### PAD1            ### : 4K
                    ### IPQ5018 caldata ### : 128K
                    ### PAD2            ### : 22K
                    ### qcn6122 caldata ### : 128K
                    #virtual_art.bin.tar.xz size: 64K
                    mkdir -p ${apdk}/IPQ5018
                    FILESIZE=131072

                    if [ -e /sys/firmware/devicetree/base/compressed_art ]
                    then
                        #FTM Daemon compresses the caldata and writes the tar file in ART Partition
                        dd if=${mtdblock} of=${apdk}/virtual_art.bin.tar.xz
                        tar -zxvf  ${apdk}/virtual_art.bin.tar.xz || {
                            # Create dummy virtual_art.bin file of size 512K
                            dd if=/dev/zero of=${apdk}/virtual_art.bin bs=1024 count=512
                        }

                        # Read after 4KB
                        dd if=${apdk}/virtual_art.bin of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096
                        # Read IPQ5018 calTag
                        dd if=${apdk}/virtual_art.bin of=${apdk}/calTag bs=1 count=2 skip=4094

                        mkdir -p ${apdk}/qcn6122
                        # Read after 154KB
                        dd if=${apdk}/virtual_art.bin of=${apdk}/qcn6122/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                        # Read qcn6122 calTag
                        dd if=${apdk}/virtual_art.bin of=${apdk}/calTag_1 bs=1 count=2 skip=157694
                    else
                        dd if=${mtdblock} of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096

                        mkdir -p ${apdk}/qcn6122
                        dd if=${mtdblock} of=${apdk}/qcn6122/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    fi

                    ln -s ${apdk}/IPQ5018/caldata.bin /lib/firmware/IPQ5018/caldata.bin
                    ln -s ${apdk}/qcn6122/caldata_1.bin /lib/firmware/qcn6122/caldata_1.bin
            ;;
            ap-mp03.1)
                    # virtual_art.bin layout：
                    ### PAD1            ### : 4K
                    ### IPQ5018 caldata ### : 128K
                    ### PAD2            ### : 22K
                    ### qcn9000 caldata ### : 128K
                    #virtual_art.bin.tar.xz size: 64K
                    mkdir -p ${apdk}/IPQ5018
                    FILESIZE=131072

                    if [ -e /sys/firmware/devicetree/base/compressed_art ]
                    then

                        #FTM Daemon compresses the caldata and writes the tar file in ART Partition
                        dd if=${mtdblock} of=${apdk}/virtual_art.bin.tar.xz
                        tar -zxvf  ${apdk}/virtual_art.bin.tar.xz || {
                            # Create dummy virtual_art.bin file of size 512K
                            dd if=/dev/zero of=${apdk}/virtual_art.bin bs=1024 count=512
                        }

                        FILENAME="${apdk}/virtual_art.bin"

                        if [ "${radioScheme}" != "" ]
                        then
                            read_caldata ${FILENAME} ${radioScheme}
                        else
                            echo "Undefine radio scheme, using default setting for caldata"
                            # Read after 4KB
                            dd if=${apdk}/virtual_art.bin of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096
                            # Read IPQ5018 calTag
                            dd if=${apdk}/virtual_art.bin of=${apdk}/calTag bs=1 count=2 skip=4094

                            mkdir -p ${apdk}/qcn9000
                            # Read after 154KB
                            dd if=${apdk}/virtual_art.bin of=${apdk}/qcn9000/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                            # Read qcn9000 calTag
                            dd if=${apdk}/virtual_art.bin of=${apdk}/calTag_1 bs=1 count=2 skip=157694
                        fi
                    else
                        dd if=${mtdblock} of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096

                        mkdir -p ${apdk}/qcn9000
                        dd if=${mtdblock} of=${apdk}/qcn9000/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    fi

                    ln -s ${apdk}/IPQ5018/caldata.bin /lib/firmware/IPQ5018/caldata.bin
                    ln -s ${apdk}/qcn9000/caldata_1.bin /lib/firmware/qcn9000/caldata_1.bin
            ;;
            ap-mp03.1-* | db-mp03.1-*)
                    MP_BD_FILENAME=/lib/firmware/IPQ5018/bdwlan.bin
                    mkdir -p ${apdk}/IPQ5018
                    if [ -f "$MP_BD_FILENAME" ]; then
                        FILESIZE=$(stat -Lc%s "$MP_BD_FILENAME")
                    else
                        FILESIZE=131072
                    fi
                    dd if=${mtdblock} of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096
                    ln -s ${apdk}/IPQ5018/caldata.bin /lib/firmware/IPQ5018/caldata.bin

                    mkdir -p ${apdk}/qcn9000
                    dd if=${mtdblock} of=${apdk}/qcn9000/caldata_1.bin bs=1 count=$FILESIZE skip=157696
                    ln -s ${apdk}/qcn9000/caldata_1.bin /lib/firmware/qcn9000/caldata_1.bin
            ;;
            ap-mp03.3* | db-mp03.3*)
                    MP_BD_FILENAME=/lib/firmware/IPQ5018/bdwlan.bin
                    mkdir -p ${apdk}/IPQ5018
                    #if [ -f "$MP_BD_FILENAME" ]; then
                    #    FILESIZE=$(stat -Lc%s "$MP_BD_FILENAME")
                    #else
                        FILESIZE=131072
                    #fi

					if [ -e /sys/firmware/devicetree/base/compressed_art ]
                    then
						#FTM Daemon compresses the caldata and writes the tar file in ART Partition
                        dd if=${mtdblock} of=${apdk}/virtual_art.bin.tar.xz
                        tar -zxvf  ${apdk}/virtual_art.bin.tar.xz || {
                            # Create dummy virtual_art.bin file of size 512K
                            dd if=/dev/zero of=${apdk}/virtual_art.bin bs=1024 count=512
                        }

						dd if=${apdk}/virtual_art.bin of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096
						dd if=${apdk}/virtual_art.bin of=${apdk}/calTag bs=1 count=2 skip=4094

						mkdir -p ${apdk}/qcn6122
						dd if=${apdk}/virtual_art.bin of=${apdk}/qcn6122/caldata_1.bin bs=1 count=$FILESIZE skip=157696
						dd if=${apdk}/virtual_art.bin of=${apdk}/calTag_1 bs=1 count=2 skip=157694

						mkdir -p ${apdk}/qcn9000
						dd if=${apdk}/virtual_art.bin of=${apdk}/qcn9000/caldata_2.bin bs=1 count=$FILESIZE skip=311296
						dd if=${apdk}/virtual_art.bin of=${apdk}/calTag_2 bs=1 count=2 skip=311294
					else
						dd if=${mtdblock} of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096

						mkdir -p ${apdk}/qcn6122
						dd if=${mtdblock} of=${apdk}/qcn6122/caldata_1.bin bs=1 count=$FILESIZE skip=157696

						mkdir -p ${apdk}/qcn9000
						dd if=${mtdblock} of=${apdk}/qcn9000/caldata_2.bin bs=1 count=$FILESIZE skip=311296
					fi

					ln -s ${apdk}/IPQ5018/caldata.bin /lib/firmware/IPQ5018/caldata.bin
					ln -s ${apdk}/qcn6122/caldata_1.bin /lib/firmware/qcn6122/caldata_1.bin
					ln -s ${apdk}/qcn9000/caldata_2.bin /lib/firmware/qcn9000/caldata_2.bin
            ;;
            ap-mp*)
                    MP_BD_FILENAME=/lib/firmware/IPQ5018/bdwlan.bin
                    mkdir -p ${apdk}/IPQ5018
                    if [ -f "$MP_BD_FILENAME" ]; then
                        FILESIZE=$(stat -Lc%s "$MP_BD_FILENAME")
                    else
                        FILESIZE=131072
                    fi
                    dd if=${mtdblock} of=${apdk}/IPQ5018/caldata.bin bs=1 count=$FILESIZE skip=4096
                    [ -L /lib/firmware/IPQ5018/caldata.bin ] || \
                    ln -s ${apdk}/IPQ5018/caldata.bin /lib/firmware/IPQ5018/caldata.bin
            ;;
            ap-cp*)
                    CP_BD_FILENAME=/lib/firmware/IPQ6018/bdwlan.bin
                    mkdir -p ${apdk}/IPQ6018
                    if [ -f "$CP_BD_FILENAME" ]; then
                        FILESIZE=$(stat -Lc%s "$CP_BD_FILENAME")
                    else
                        FILESIZE=65536
                    fi
                    dd if=${mtdblock} of=${apdk}/IPQ6018/caldata.bin bs=1 count=$FILESIZE skip=4096
                    [ -L /lib/firmware/IPQ6018/caldata.bin ] || \
                    ln -s ${apdk}/IPQ6018/caldata.bin /lib/firmware/IPQ6018/caldata.bin
            ;;
   esac
}

