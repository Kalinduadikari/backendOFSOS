# Specify the base image with Node.js pre-installed
FROM node:18.12.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


EXPOSE 8000

# Specify the command to run when the container starts
CMD [ "npm", "start" ]
