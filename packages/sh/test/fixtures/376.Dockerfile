FROM debian:12.6-slim

RUN set -eux; for x in {1..3}; do echo 'foo'; echo 'bar'; echo "$x"; done

RUN <<EOF
    set -eux
    for x in {1..3}
    do
        echo 'foo'
        echo 'bar'
        echo "$x"
    done
EOF
