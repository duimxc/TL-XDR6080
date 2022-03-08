#!/bin/sh

echo "Killing dms and valgrind ..."

killall -9 dms
killall -9 valgrind

echo
echo "Starting memcheck ..."

LOG_FILE=/root/vg/dms-memcheck-log_$(randstr.sh).txt
echo "Log: ${LOG_FILE}"

valgrind -q -v --leak-check=full --log-file=${LOG_FILE} --run-libc-freeres=no /bin/dms &
