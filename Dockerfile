# Use the official Node.js image with Node version 18.16.0 as the base image
FROM node:18.16.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your Node.js app listens on
EXPOSE 3000

# Command to start your Node.js app
CMD npm run start
