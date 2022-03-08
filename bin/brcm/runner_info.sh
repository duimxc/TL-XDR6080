#!/bin/sh
#
# BCM Runner Info
#
# $Copyright TP-LINK Corporation$
#

FCCMD=fc
LOOP_TIME=60
NR_RUNS=0


if [ $# -ge 1 ] || [ $# -ge 2 ]; then
	NR_REPEATS=$1
else
	NR_REPEATS=0
fi

loop_commands () {
	sleep $LOOP_TIME
	NR_RUNS=`expr $NR_RUNS + 1`

	echo "================================="
	echo "CPU tempsense($NR_RUNS)"
	echo "================================="
	cat /sys/power/bpcm/select0

# fc status
	echo "================================="
	echo "FC Status"
	echo "================================="
	fc status
# cat /proc/fcache;
	echo "================================="
	echo "FC_runner stats"
	echo "================================="
	cat /proc/fcache/stats/errors
	cat /proc/fcache/stats/slow_path
}

echo "================================="
echo "Information for fc first run"
echo "================================="
fc status

echo "================================="
echo "FC_runner stats first run"
echo "================================="
cat /proc/fcache/stats/errors
cat /proc/fcache/stats/slow_path

if [[ $NR_REPEATS -eq 0 ]]; then
	while true; do
		loop_commands
	done
else
while [[ $NR_REPEATS -gt $NR_RUNS ]]; do
	loop_commands
done
fi