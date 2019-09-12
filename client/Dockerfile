#####################################
# buid front-end app                #
#####################################
FROM node:lts-alpine as build-stage

# set the working directory
WORKDIR /usr/src/app

# copy package.json & 'package-lock.json' into the container
COPY package*.json ./

# install dependencies
RUN npm install

# Copy files into the container
COPY . ./

# build project (typescript -> javascript)
RUN npm run build

#####################################
# use nginx to serve static content #
#####################################
FROM nginx:stable-alpine as production-stage

# use dist directory from build stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]