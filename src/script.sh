#!/usr/bin/env bash

# Usage:
#   ./collect-files.sh /path/to/folder /path/to/output.txt

# The first argument is the folder to scan
FOLDER="$1"
# The second argument is the file in which we want to append the output
OUTPUT_FILE="$2"

# Clear or create the output file
> "$OUTPUT_FILE"

# Use 'find' to list all files (not directories) within $FOLDER, excluding the output file
find "$FOLDER" -type f ! -path "$OUTPUT_FILE" | while IFS= read -r FILE; do
  
  # Exclude .ico files
  if [[ "$FILE" == *.ico ]]; then
    echo "Skipping file: $FILE"
    continue
  fi
  
  # Ensure it's a regular file
  if [[ -f "$FILE" ]]; then
    # Derive the relative path by removing the leading "$FOLDER/"
    RELATIVE_PATH="${FILE#$FOLDER/}"
    
    # Append the relative path to the output file
    echo "$RELATIVE_PATH:" >> "$OUTPUT_FILE"
    
    echo "<Start of file>" >> "$OUTPUT_FILE"
    cat "$FILE" >> "$OUTPUT_FILE"
    echo "<End of file>" >> "$OUTPUT_FILE"
    
    # Add a blank line after each file
    echo >> "$OUTPUT_FILE"
  fi

done