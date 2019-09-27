FROM localstack/localstack

# adding wrapper script
ADD start-services.sh /usr/local/bin/
RUN chmod a+x /usr/local/bin/start-services.sh

# adding node command server application
RUN mkdir -p webcommand/
RUN cd webcommand && npm install && cd ..
ADD webcommand webcommand
# create a storage diectory for webcommand application
RUN mkdir -p storage/
RUN chmod 777 storage

# expose webcommand port
EXPOSE 8181

# define command at startup
ENTRYPOINT ["start-services.sh"]
