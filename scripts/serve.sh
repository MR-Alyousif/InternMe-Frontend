#!/bin/bash

set -e

docker-compose -f docker-compose.production.yaml up --build -d
