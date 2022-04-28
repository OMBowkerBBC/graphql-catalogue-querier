#!/bin/bash

sudo apt update
sudo apt upgrade
git clone https://github.com/OMBowkerBBC/graphql-catalogue-querier.git
mv graphql-catalogue-querier /var/lib/graphql-catalogue-querier
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
cd /var/lib/graphql-catalogue-querier
npm i
npm start