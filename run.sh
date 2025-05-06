#!/bin/bash

function start() {
    
    cd server
    docker compose up -d
    NODE_OPTIONS="--disable-warning DEP0040" npm run dev &
    SERVER_PID=$!

    cd ../client
    NODE_OPTIONS="--disable-warning DEP0040" npm run dev &
    CLIENT_PID=$!

    cd ../
    trap stop INT
    
    wait $SERVER_PID
    wait $CLIENT_PID
}

function stop() {
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID
        wait $SERVER_PID 2>/dev/null
    fi
    
    if [ -n "$CLIENT_PID" ]; then
        kill $CLIENT_PID
        wait $CLIENT_PID 2>/dev/null
    fi
    
    cd server
    docker compose down
    
    echo "Stopped Fight-Score-Live"
    exit 0
}

case $1 in
    start)
        start
        ;;
    stop)
        stop
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        exit 1
        ;;
esac