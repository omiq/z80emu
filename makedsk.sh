#!/bin/sh
cd /Users/chrisg/Downloads/hi-tech-c
cpmfs hitechc.dsk make
cpmfs hitechc.dsk w C.COM
find * -type f -name "*.H" -exec cpmfs hitechc.dsk w "{}" \;
find * -type f -name "*.LIB" -exec cpmfs hitechc.dsk w "{}" \;
find * -type f -name "*.OBJ" -exec cpmfs hitechc.dsk w "{}" \;
find * -type f -name "*.COM" -exec cpmfs hitechc.dsk w "{}" \;
