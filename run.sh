#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Check if required environment variables are set
if [ -z "$CLICKUP_API_KEY" ]; then
    echo "Error: CLICKUP_API_KEY environment variable is required"
    echo "Set it in .env file or export it: export CLICKUP_API_KEY=your_api_key"
    exit 1
fi

if [ -z "$CLICKUP_TEAM_ID" ]; then
    echo "Error: CLICKUP_TEAM_ID environment variable is required"  
    echo "Set it in .env file or export it: export CLICKUP_TEAM_ID=your_team_id"
    exit 1
fi

rm -rf build/ && npm run build && \
LOG_LEVEL=trace \
ENABLE_SSE=true \
PORT=3231 \
CLICKUP_TEAM_ID=$CLICKUP_TEAM_ID \
DOCUMENT_SUPPORT=true \
CLICKUP_API_KEY=$CLICKUP_API_KEY \
npm start
