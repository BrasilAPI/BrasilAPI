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

# Default application port "from next framework"
ARG PORT=3000

# Eviroment variables
ENV NODE_ENV=production

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
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
RUN npm install next

# Expose default port
EXPOSE ${PORT}

# The command to be executed when this conteiner be deploy
ENTRYPOINT [ "npm", "run", "start" ]