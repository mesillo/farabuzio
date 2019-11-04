FROM localstack/localstack

# adding wrapper script
ADD start-services.sh /usr/local/bin/
RUN chmod a+x /usr/local/bin/start-services.sh

# adding node command server application
RUN mkdir -p fbzwebcommand/
ADD fbzwebcommand fbzwebcommand
RUN chown localstack.localstack fbzwebcommand/bin/*.js
RUN chmod u+x fbzwebcommand/bin/*.js
RUN cd fbzwebcommand && npm install && cd ..

# adding node lambda server simulator application
RUN mkdir -p lambdazio/
ADD lambdazio lambdazio
RUN cd lambdazio && npm install && cd ..
# making fs directory writable
RUN chown -R localstack.localstack lambdazio/fs/
RUN chmod 777 lambdazio/fs/
RUN chown localstack.localstack lambdazio/productionrun.sh
RUN chmod u+x lambdazio/productionrun.sh

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
