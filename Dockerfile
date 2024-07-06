# Container Configuration
FROM node:20
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

# Environment Properties
# ENV DATABASE_URL postgresql://postgres:1234@localhost:5432/blog_db?schema=public

# Application Build
RUN npm install
RUN npx prisma generate
RUN npm run start:build
RUN rm -r ./src
RUN mv build src
RUN npm install --production

# Application Start
CMD ["npm", "run", "start:prd"]