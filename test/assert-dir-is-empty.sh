#!/bin/bash

dir=''

for arg in "$@"; do
    case $arg in
    --dir)
        dir=$2
        shift # Remove argument --dir from `$@`
        shift # Remove argument value from `$@`
        ;;
    esac
done

echo "
Asserting '$dir' exists and that it is empty"

if [ -d "$dir" ]; then
  echo "The target directory exists, which is expected."
else 
  echo "The target directory does not exist but it should."
  exit 1
fi

if [ -z "$(ls -A $dir)" ]; then
  echo "The target directory is empty, which is expected."
else
  echo "The target directory is not empty but it should be."
  echo "These items exist under the directory:"
  ls -r $dir
  exit 1
fi