FROM ubuntu:18.04

ARG NODEVERSION=10.16

# install curl
RUN apt update
RUN apt full-upgrade
RUN apt install -y curl
# add user
RUN groupadd -r lambdausr && useradd --no-log-init -r -g lambdausr lambdausr
USER lambdausr
# install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
SHELL ["/bin/bash", "-c"]
RUN source /home/lambdausr/.bashrc
# install node
RUN nvm install 10.16
RUN nvm use 10.16