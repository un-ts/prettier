FROM node:20.9.0-alpine
RUN if [[ x$LATEST_NPM = xtrue ]]; then yarn global add npm@latest; fi
