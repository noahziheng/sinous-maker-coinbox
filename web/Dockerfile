FROM mhart/alpine-node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN apk add --no-cache make gcc g++ python
RUN npm install
ENTRYPOINT npm start
EXPOSE 3000