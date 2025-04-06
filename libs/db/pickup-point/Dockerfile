FROM node:lts-alpine AS builder

WORKDIR /usr/src/app
COPY ./node_modules ./node_modules
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./nx.json ./
COPY ./libs ./libs

FROM lscr.io/linuxserver/openssh-server:latest  AS runner
RUN apk add postgresql17-client

COPY --from=builder /usr/lib /usr/lib
COPY --from=builder /usr/local/share /usr/local/share
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/local/include /usr/local/include
COPY --from=builder /usr/local/bin /usr/local/bin
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
RUN chown -R 1000:1000 .
