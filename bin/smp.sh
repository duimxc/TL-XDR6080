#!/bin/sh

#=============================================================================
# smp_affinity: 1 = CPU1, 2 = CPU2, 3 = CPU3, 4 = CPU4
# rps_cpus: wxyz = CPU3 CPU2 CPU1 CPU0 (ex:0xd = 0'b1101 = CPU1, CPU3, CPU4)
#=============================================================================

write_proc() {
    [ -f $2 ] && {
        echo $1 > $2
        #echo -n $1 ">" $2, "= "
        #cat $2
    }
}

#eth driver
write_proc 2 /sys/class/net/eth0/queues/rx-0/rps_cpus
