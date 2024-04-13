#!/bin/bash

# Wait for Solr to start
# This is a very basic wait loop. In a production environment, you'd want a more reliable way to check Solr's status.
until $(curl --output /dev/null --silent --head --fail http://localhost:8983); do
    printf '.'
    sleep 5
done

# Create a new core
solr create -c ${CORE_NAME}

# Place schema.xml in the core
cp /opt/solr/schema.xml /var/solr/data/${CORE_NAME}/conf/schema.xml

# Rename the managed-schema file
mv /var/solr/data/${CORE_NAME}/conf/managed-schema.xml /var/solr/data/${CORE_NAME}/conf/managed-schema.bak

# Place solrconfig.xml in the core
cp /opt/solr/solrconfig.xml /var/solr/data/${CORE_NAME}/conf/solrconfig.xml

# Reload the core
curl "http://localhost:8983/solr/admin/cores?action=RELOAD&core=${CORE_NAME}"

# Post the data
solr post -c ${CORE_NAME} /opt/solr/data/merged_comments_annotated.csv