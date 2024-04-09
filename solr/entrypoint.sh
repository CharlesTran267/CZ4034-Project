#!/bin/bash

# Wait for Solr to start
# This is a very basic wait loop. In a production environment, you'd want a more reliable way to check Solr's status.
until $(curl --output /dev/null --silent --head --fail http://localhost:8983); do
    printf '.'
    sleep 5
done

# Create a new core
solr create -c ${CORE_NAME}

# Post the data
solr post -c ${CORE_NAME} /opt/solr/data/merged_comments.csv