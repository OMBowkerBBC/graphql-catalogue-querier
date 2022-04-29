#!/bin/bash

endpoint=$(cat buildOutputs.txt | grep ec2_health_address | cut -d "=" -f2 | tr -d '"' | tr -d ' ' )
if [ -z $endpoint ]; then
    echo "Could not parse URL from file."
    exit 1
fi

attempts=0
max_attempts=10

echo "Giving time to deploy..."
sleep 20
echo "Trying to hit endpoint (${endpoint})..."

while [ $attempts -lt $max_attempts ]
do
    attempts=$((attempts+1))
    sleep 10

    curl --max-time 3 "${endpoint}"
    if [ $? -eq 0 ]; then
        echo "Hit endpoint after ${attempts} attempts/s."
        exit 0
    fi
    echo "Failed to hit endpoint (${attempts} attempt/s)."
done

echo "Failed to hit endpoint after ${max_attempts} attempts."
exit 1

