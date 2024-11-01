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

    if [ ${extension} == "wav" ]
    then
        # Trim silence from end
        # echo "Trimming silence..."
        # sox "$file" "$filename"-silence.wav reverse silence 1 0.1 0.1% reverse
        # Convert to mp3
        echo "Converting to mp3..."
        lame -V 0 --noreplaygain --tt "$artist" --ta "$artist" --tl "$gig" --ty 2019 --tc dunedinsound.com "$filename".wav "$filename".mp3
        # Tag
        mid3v2 -v --artist="$artist" --song="$artist at $gig" --album="$gig" --comment="dunedinsound.com" --year="2019" "$filename".mp3
        # Generate waveform
        echo "Generating waveform..."
        RUBYOPT=-Ku json-waveform "$filename".wav > "$filename".mp3.json
    else
        # Tag
        mid3v2 -v --artist="$artist" --song="$artist at $gig" --album="$gig" --comment="dunedinsound.com" --year="2019" "$filename".mp3
        # Convert to wav
        sox "$filename".mp3 temp.wav
        # Generate waveform
        echo "Generating waveform..."
        RUBYOPT=-Ku json-waveform temp.wav > "$filename".mp3.json
        # Remove wav file
        rm temp.wav
    fi
done

# For converting 32bit float to 24bit
for file in /root/audio/32bit/*.WAV
do
    cd "$(dirname "$file")"
    filename=$(basename "$file" .$extension)
    echo "Working on $filename"
		echo "Converting to 24bit WAV..."
		ffmpeg -y -i "$file" -af "dynaudnorm=f=500:g=5,highpass=f=20" -c:a pcm_s24le $filename.24.wav
done
