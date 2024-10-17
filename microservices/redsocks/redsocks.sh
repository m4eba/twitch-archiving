#!/bin/bash

# Initialize variables for proxy settings
proxy_ip=""
proxy_port=""
command=()

# Parse the arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --redsocks-host)
            proxy_ip="$2"
            shift 2
            ;;
        --redsocks-port)
            proxy_port="$2"
            shift 2
            ;;
        *)
            command+=("$1") # Collect all non-option arguments as part of the command
            shift
            ;;
    esac
done

# Check if the command is provided
if [ ${#command[@]} -eq 0 ]; then
    echo "Invalid number of arguments."
    echo "Usage: $0 <command> [--redsocks-host proxy_ip] [--redsocks-port proxy_port]"
    exit 1
fi


    
# Initialize redsocks if both proxy_ip and proxy_port are set
if [ -n "$proxy_ip" ] && [ -n "$proxy_port" ]; then
    
    echo "Creating redsocks configuration file using proxy ${proxy_ip}:${proxy_port}..."
    sed -e "s|\${proxy_ip}|${proxy_ip}|" \
        -e "s|\${proxy_port}|${proxy_port}|" \
        /etc/redsocks.tmpl > /tmp/redsocks.conf

    echo "Generated configuration:"
    cat /tmp/redsocks.conf

    echo "Activating iptables rules..."
    /usr/local/bin/redsocks-fw.sh start

    # Start redsocks
    echo "Starting redsocks..."
    /usr/sbin/redsocks -c /tmp/redsocks.conf &
    pid="$!"
fi


# SIGUSR1 handler
usr_handler() {
    echo "usr_handler"
}

# SIGTERM handler
term_handler() {
    if [ $pid -ne 0 ]; then
        echo "Term signal caught. Shutting down redsocks and disabling iptables rules..."
        kill -SIGTERM "$pid"
        wait "$pid"
        /usr/local/bin/redsocks-fw.sh stop
    fi
    exit 143; # 128 + 15 -- SIGTERM
}

# Setup signal handlers if there are 3 arguments
if [ -n "$proxy_ip" ] && [ -n "$proxy_port" ]; then
    trap 'kill ${!}; usr_handler' SIGUSR1
    trap 'kill ${!}; term_handler' SIGTERM
fi

# Run the Node.js application with the command
echo "Running command: node microservices/dist/index.js ${command[*]}"
exec gosu node node microservices/dist/index.js "${command[@]}"
