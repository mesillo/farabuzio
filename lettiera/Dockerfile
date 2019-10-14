FROM localstack/localstack

# adding wrapper script
ADD start-services.sh /usr/local/bin/
RUN chmod a+x /usr/local/bin/start-services.sh

# adding node command server application
RUN mkdir -p webcommand/
ADD webcommand webcommand
RUN chown localstack.localstack webcommand/bin/*.js
RUN cd webcommand && npm install && cd ..

# create a storage diectory for webcommand application
RUN mkdir -p storage/
RUN chown -R localstack.localstack storage
RUN chmod 777 storage

# on localstack image localstack_client package seems isn't installed for localstack user... go to install it for patch...
RUN su - localstack -c 'pip install localstack_client --user'

# expose webcommand port
EXPOSE 8181

# define command at startup
ENTRYPOINT ["start-services.sh"]
