#!/bin/bash

name=''
expectedContents=''
fileName=''

for arg in "$@"; do
    case $arg in
    --name)
        name=$2
        shift # Remove argument --name from `$@`
        shift # Remove argument value from `$@`
        ;;
    --expectedContents)
        expectedContents=$2
        shift # Remove argument --expected from `$@`
        shift # Remove argument value from `$@`
        ;;
    --fileName)
        fileName=$2
        shift # Remove argument --actual from `$@`
        shift # Remove argument value from `$@`
        ;;
    
    esac
done

echo "
Asserting file contents match:
File with expected contents: '$expectedContents'
File with actual contents:   '$fileName'"

# First make sure the actual file exists
if [ -f "$fileName" ]
then
  echo "The file with actual contents exists which is expected."
  actualFileContents=$(cat $fileName)
else
  echo "The file with actual contents does not exist which is not expected"
  exit 1
fi
expectedFileContents=$(cat $expectedContents)

# Then print the contents
echo "::group::Expected file contents"
echo "$expectedFileContents"
echo "::endgroup::"

echo "::group::Actual file contents"
echo "$actualFileContents"
echo "::endgroup::"

# And finally compare the contents
if echo "$actualFileContents" | grep -q "$expectedFileContents"; then
  echo "The actual contents contain the expected cotnents, which is expected."
else 
  echo "The actual contents do not contain the expected contents, which is not expected."  
  exit 1
fi