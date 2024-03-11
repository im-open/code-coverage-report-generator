#!/bin/bash

dir=''


for arg in "$@"; do
    case $arg in
    --dir)
        dir=$2
        shift # Remove argument --name from `$@`
        shift # Remove argument value from `$@`
        ;;
    esac
done

echo "
Asserting '$dir' does not exist"

if [ -d "$dir" ]; then
  echo "The target directory exists when it should not."
  exit 1
else 
  echo "The target directory does not exist, which is expected."
fi