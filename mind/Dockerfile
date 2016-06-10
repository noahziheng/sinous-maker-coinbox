FROM mhart/alpine-node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
VOLUME ["/usr/src/app/data"]
RUN apk add --no-cache make gcc g++ python
RUN npm install -g forever
RUN npm install
ENTRYPOINT npm start
EXPOSE 8888