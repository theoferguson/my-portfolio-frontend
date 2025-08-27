FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

# Only copy package.json and lockfile first
COPY package*.json ./

# Install dependencies INSIDE the container
RUN npm install

# Now copy the rest of your source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]