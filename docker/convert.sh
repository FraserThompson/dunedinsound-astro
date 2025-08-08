#!/bin/bash
shopt -s nullglob
ls /root/audio

for file in /root/audio/*.{wav,mp3}
do
    cd "$(dirname "$file")"
    extension="${file##*.}"

    # Seperate title from extension
    filename=$(basename "$file" .$extension)
    # Split gig from band, ${components[1]} is band, ${components[0]} is gig
    IFS="-"; read -a components <<<"$filename"
    artist="$(echo -e "${components[1]}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    gig="$(echo -e "${components[0]}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

    echo "Working on $filename"
    echo "Artist: $artist Gig: $gig"

		# Tag
		ffmpeg -i "$file" -metadata title="$artist at $gig" -metadata artist="$artist" -metadata album="dunedinsound.com" -metadata year="$(date +%Y)" -c copy "$file".temp.mp3 -y
		mv "$file".temp.mp3 "$file"

    # Validate
    ffmpeg -v error -i "$file" -f null -

		# Generate waveform
		audiowaveform -i "$file" -o "$file".json --pixels-per-second 1 --bits 8
done

# For converting 32bit float to 24bit
for file in /root/audio/32bit/*.WAV
do
    cd "$(dirname "$file")"
    filename=$(basename "$file" .$extension)
    echo "Working on $filename"
		echo "Converting to 24bit WAV..."
		ffmpeg -y -i "$file" -af "loudnorm=I=-16:TP=-1" -c:a pcm_s24le -ar 96000 $filename.24.wav
done
