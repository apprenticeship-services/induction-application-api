FROM node:20
WORKDIR /usr/workspace/cetb-client
COPY ./client/package.json .
RUN npm i
COPY ./client/ .
EXPOSE 8080
CMD ["npm","run","dev"]