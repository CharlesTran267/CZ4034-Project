from solr:latest

EXPOSE 8983

COPY crawling/data /opt/solr/data

ENV CORE_NAME=my_core

COPY solr/entrypoint.sh /entrypoint.sh