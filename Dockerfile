FROM node:14.15-alpine AS base

WORKDIR /base
COPY package*.json ./
RUN npm install
COPY . .


# -----------------
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build


# -----------------
FROM node:14.15-alpine AS production

## Variables
# User and ID
ARG APP=brasil-api 
ARG ID=1001

# Eviroment variables
ENV NODE_ENV=production

## Commands
# Add User
RUN     mkdir /${APP} \
    &&  chown ${ID}:node /${APP} \
    &&  adduser --uid ${ID} -D -h /${APP} ${APP} node 

# Set User
USER ${APP}

# Set work directory
WORKDIR /${APP}

# Install dependencies, build project
COPY    --from=build    --chown=${ID}:node  /build/package*.json ./
COPY    --from=build    --chown=${ID}:node  /build/.next ./.next
COPY    --from=build    --chown=${ID}:node  /build/public ./public
RUN npm install next

# Default application port "from next framework"
# Expose default port
EXPOSE 3000

# The command to be executed when this conteiner be deploy
ENTRYPOINT [ "npm", "run", "start" ]