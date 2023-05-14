FROM node:lts-buster
RUN apt update -y
RUN apt upgrade -y
RUN apt-get install -y --no-install-recommends \
  ffmpeg
RUN npm install -g npm@latest
# RUN yarn add yt-search
WORKDIR /home/frmdev/frmdev
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "index.js"]