FROM node:22-alpine AS builder

WORKDIR /app

# ✅ correct for your setup
COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

LABEL maintainer="Rajat" \
      description="Astro Portfolio Website deployed via CI/CD" \
      project="rajat-assignment" \
      version="1.0"

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]