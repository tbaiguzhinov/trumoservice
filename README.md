# Trumo test service

This project is a service that provides authorization via OAuth2 and authentication using resulting token. Home page display user's KYC information, status of user's information (whether it is complete or not) and information about user's activity (logins, logouts, etc.).  
Stack: ReactJS 18.2.0, Django 4.1.13, MongoDB Atlas as database, Docker, Docker Compose, OAuth2.

## Deploy

Project is deployed at [http://13.40.77.83/](http://13.40.77.83/), using Dokcer inside a AWS EC2 instance.

## Local installation

To run this project, you will need to have Docker installed on your machine. Follow the steps below to get started:

1. Clone the repository: `git clone https://github.com/tbaiguzhinov/trumoservice`
2. Navigate to the project directory: `cd trumoservice`
3. Build the Docker images and run them: `docker compose up -d --build.`

Once the container is running, you can access the service by visiting `http://localhost` in your web browser.

## Usage

Credentials for test clients:

1. Username: test1, password: 12345. Information complete.

2. Username: test2, password: 234567. Information incomplete.

3. Username: test3, password: 345678. Information complete.
