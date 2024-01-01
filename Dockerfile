FROM node:18-alpine as builder

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run compile && npm run build


FROM node:18-alpine as production

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S mocap -u 1001
USER mocap

COPY --from=builder --chown=mocap:nodejs /app/.next ./.next
COPY --from=builder --chown=mocap:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mocap:nodejs /app/package.json ./package.json
COPY --from=builder --chown=mocap:nodejs /app/public ./public

CMD npm start


FROM node:18-alpine as dev

ENV NODE_ENV=development

RUN npm install 
COPY . .

CMD npm run dev