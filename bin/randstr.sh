#!/bin/sh

cat /dev/urandom | head -n 10 | md5sum | head -c 8

