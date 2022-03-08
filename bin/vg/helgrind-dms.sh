#!/bin/sh

mkdir -p ~/vg

echo "Killing dms and valgrind ..."

killall -9 dms
killall -9 valgrind

echo
echo "Starting helgrind ..."

LOG_FILE=/root/vg/dms-helgrind-log_$(randstr.sh).txt
echo "Log: ${LOG_FILE}"

valgrind --tool=helgrind -q -v --log-file=${LOG_FILE} /bin/dms &
