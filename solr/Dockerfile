FROM solr:latest

# Install Vim. Since Solr images are usually based on Debian, use apt-get to install
USER root
RUN apt-get update && apt-get install -y vim
USER solr

EXPOSE 8983

COPY crawling/data /opt/solr/data

ENV CORE_NAME=my_core

COPY solr/entrypoint.sh /entrypoint.sh

COPY solr/schema.xml /opt/solr/schema.xml

COPY solr/solrconfig.xml /opt/solr/solrconfig.xml