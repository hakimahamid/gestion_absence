FROM node:14 AS builder
WORKDIR /app
COPY app/package*.json ./
RUN npm install --production
COPY app/ ./
RUN npm run build || echo "No build step"

FROM node:14
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
