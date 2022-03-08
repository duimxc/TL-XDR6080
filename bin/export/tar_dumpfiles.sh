#!/bin/sh
#
# move and tar mendump&coredump
#
# $Copyright TP-LINK Corporation$
#
show_help () {
	echo "Syntax: $0"
	exit
}

tar_dump_files () {
	mkdir -p /dumpfiles
	rm -rf /dumpfiles/*.tar.gz

	cd /
	if [ -d "/tmp/*core*" ]; then
		tar -cvzf /dumpfiles/coredump.tar.gz /tmp/*core*
	fi

	if [ -d "/tmp/mem_dump" ]; then
		tar -cvzf /dumpfiles/memdump.tar.gz /tmp/mem_dump
	fi

	tar -cvzf /dumpfiles/tmp.tar.gz tmp
}

tar_dump_files

