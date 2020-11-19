FROM node:14.15-alpine as build

## Variables
# User and ID
ARG APP=brasil-api 
ARG ID=1001

# Default application port "from next framework"
ARG PORT=3000


## Commands
# Add User
RUN     adduser --uid ${ID} -D -h /home/${APP} ${APP} node 
# Set User
USER ${APP}
#Copy files
COPY --chown=${ID}:node . /home/${APP}
# Set work directory
WORKDIR /home/${APP}
# Install dependencies, build project
RUN     npm -l install npm \
    &&  npm update \
    &&  npm install \
    &&  npm run build
# Expose default port
EXPOSE ${PORT}

# The command to be executed when this conteiner be deploy
ENTRYPOINT [ "npm", "run", "start" ]