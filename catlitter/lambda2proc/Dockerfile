FROM ubuntu:18.04

ARG NODEVERSION=10.16

# install curl
RUN apt update
RUN apt full-upgrade
RUN apt install -y curl
# add user
USER lambdausr
# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
RUN source /lambdausr/.bashrc
# install node
RUN nvm install $NODEVERSION
RUN nvm use $NODEVERSION