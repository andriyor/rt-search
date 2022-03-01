FROM mcr.microsoft.com/playwright:focal

WORKDIR /app
COPY . /app
ENTRYPOINT ["node", "rt-listing.js"]
CMD [ "1" ]
