FROM realies/audiowaveform

RUN apk add --no-cache --update ffmpeg bash

COPY convert.sh /root/convert.sh

RUN chmod +x /root/convert.sh

ENTRYPOINT [ "bash" ]
CMD ["/root/convert.sh"]
