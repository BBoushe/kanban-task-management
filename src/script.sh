#!/usr/bin/env bash

# Usage:
#   ./collect-files.sh /path/to/folder /path/to/output.txt

# The first argument is the folder to scan
FOLDER="$1"
# The second argument is the file in which we want to append the output
OUTPUT_FILE="$2"

# Clear or create the output file
> "$OUTPUT_FILE"

# Use 'find' to list all files (not directories) within $FOLDER
# Then read each file path line by line.
while IFS= read -r FILE; do
  
  # Make sure it is indeed a file, not something else
  if [[ -f "$FILE" ]]; then
    # Derive the relative path by removing the leading "$FOLDER/"
    RELATIVE_PATH="${FILE#$FOLDER/}"
    
    # Append the relative path to the output file
    echo "$RELATIVE_PATH:" >> "$OUTPUT_FILE"
    
    # Append the contents in quotes. 
    # NOTE: This will just wrap everything in one big set of quotes.
    # If the file has internal double quotes, that may interfere, so be cautious.
    echo "\"$(cat "$FILE")\"" >> "$OUTPUT_FILE"
    
    # Optionally, add a blank line after each entry for readability
    echo >> "$OUTPUT_FILE"
  fi

done < <(find "$FOLDER" -type f)