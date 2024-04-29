#!/bin/bash

set -e

docker volume prune --force

docker-compose -f docker-compose.production.yaml up --build -d
