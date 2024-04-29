#!/bin/bash

set -e

docker-compose -f docker-compose.production.yaml down

docker volume prune --force
