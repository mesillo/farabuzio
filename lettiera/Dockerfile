FROM localstack/localstack

# adding wrapper script
ADD start-services.sh /usr/local/bin/
RUN chmod a+x /usr/local/bin/start-services.sh

# adding node command server application
RUN mkdir -p webcommand/
ADD webcommand webcommand

# expose webcommand port
EXPOSE 8181

# define command at startup
ENTRYPOINT ["start-services.sh"]
