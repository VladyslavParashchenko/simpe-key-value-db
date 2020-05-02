FROM node:12

ENV APP_USER node
ENV APP_USER_HOME /home/$APP_USER
ENV APP_HOME $APP_USER_HOME/app/db

USER $APP_USER
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

COPY package*.json ./
RUN npm ci --only=production
COPY app app/
COPY configs configs/

RUN mkdir logs
RUN mkdir backups

RUN chown $(whoami) -R backups/
RUN chown $(whoami) -R logs/

CMD ["node", "."]
