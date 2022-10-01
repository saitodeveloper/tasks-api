FROM node:16

WORKDIR /usr/src/app
COPY . .
RUN npm install && npx tsc
EXPOSE 3000
EXPOSE 80
EXPOSE 443
CMD ["node", "./build/server.js"]