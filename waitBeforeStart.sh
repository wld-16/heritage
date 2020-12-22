#!/bin/bash
echo "Wait 60 seconds to seed database"

if [ "$DELAYED_INIT" = "TRUE" ]; then
	sleep 60
fi

npm start