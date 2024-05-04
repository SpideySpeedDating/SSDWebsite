FROM node:20-alpine
WORKDIR /usr/local/app

COPY package.json ./
RUN npm install

COPY . ./

EXPOSE 3000

RUN adduser app --disabled-password
USER app

ENV PORT 3000

CMD ["npm", "start"]