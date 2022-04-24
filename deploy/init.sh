#!/bin/bash

sudo apt update
sudo apt upgrade
git clone https://github.com/OMBowkerBBC/graphql-catalogue-querier.git
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
cd ~/graphql-catalogue-querier/
npm i
npm start