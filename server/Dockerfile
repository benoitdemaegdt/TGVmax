# use light version of NodeJS
FROM node:lts-alpine

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

# expose port 3000
EXPOSE 3000

# run the app
CMD ["node", "./dist/index.js"]