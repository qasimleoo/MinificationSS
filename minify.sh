#!/bin/bash

# Function to minify JavaScript files
minify_js() {
  local input_file=$1
  local output_file=${input_file%.js}.min.js
  
  if [ -f "$input_file" ]; then
    echo "Minifying JavaScript file: $input_file"
    uglifyjs "$input_file" -o "$output_file" --compress --mangle
    echo "Minified JavaScript file created: $output_file"
  else
    echo "File not found: $input_file"
  fi
}

# Function to minify CSS files
minify_css() {
  local input_file=$1
  local output_file=${input_file%.css}.min.css
  
  if [ -f "$input_file" ]; then
    echo "Minifying CSS file: $input_file"
    csso "$input_file" --output "$output_file"
    echo "Minified CSS file created: $output_file"
  else
    echo "File not found: $input_file"
  fi
}

# Check if the file type is specified
if [ -z "$2" ]; then
  echo "Usage: $0 <file> <type>"
  echo "Type must be either 'js' or 'css'"
  exit 1
fi

# Determine the type and call the appropriate function
case "$2" in
  js)
    minify_js "$1"
    ;;
  css)
    minify_css "$1"
    ;;
  *)
    echo "Invalid type specified: $2"
    echo "Type must be either 'js' or 'css'"
    exit 1
    ;;
esac

