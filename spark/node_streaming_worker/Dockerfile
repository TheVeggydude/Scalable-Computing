FROM node:10

# Create app directory
WORKDIR node_streaming_worker

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4005

CMD ["node", "server/index.js"]
