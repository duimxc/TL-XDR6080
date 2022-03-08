#!/bin/sh

#kill -9 `ps | grep valgrind | head -1 | cut -d ' ' -f 2`

ps | grep valgrind

echo
echo "Killing valgrind ..."
echo

killall -9 valgrind

ps | grep valgrind

echo
echo "Done."
