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
Asserting '$dir' exists"

if [ -d "$dir" ]; then
  echo "The target directory exists, which is expected."
else 
  echo "The target directory does not exist but it should."
  exit 1
fi