FROM node:22-bookworm-slim AS build
WORKDIR /app

# Production image build must compile global CSS (Tailwind/PostCSS). npm skips devDependencies when NODE_ENV=production.
# See https://angular.dev/tools/cli/deployment — copy the browser output directory into the static server.
ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build \
    && mkdir -p /out \
    && cp -a dist/frontend/browser/. /out/ \
    && test -f /out/index.html \
    && css="$(ls -1 /out/*.css | head -1)" \
    && test -n "$css" \
    && test "$(wc -c < "$css")" -ge 8000

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /out /usr/share/nginx/html
EXPOSE 80
