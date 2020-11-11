#!/bin/bash
set -e

filename=$1

opts="-define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all"
#opts=""

base=$(basename $filename .png)
workdir="$base-work"
frame="$base-frame"
patch="$base-patch.png"

echo "[Patcher] Going to generate patch for $filename as $patch"

mkdir "$workdir"
cp $filename "$workdir"
pushd "$workdir"

echo "[Patcher] disassembling $filename..."
apngdis $filename $frame
rm $filename

ls $frame*.png | head -n16 | xargs -I{} convert {} $opts -resize 150x150\! converted-{}
rm $frame*.png $frame*.txt

echo "[Patcher] Creating patch..."
montage $($frame*.png | head -n16)  $opts -geometry 150x150 -tile 4x4 $patch
rm converted-$frame*.png

popd

mv "$workdir/$patch" .
rmdir "$workdir"
