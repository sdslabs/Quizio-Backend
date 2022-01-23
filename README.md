# Quizio Backend

Backend for Quizio!

## Setting Up Quizio Backend
- Run `cp .env.example .env` and add all the relevant environment key-value pairs.
- Run  `cp src/config/config.sample.js src/config/config.js` and update all config variables using the following steps:
	1. Generate a clientId and clientSecret from developer console from arceus and change the `clientId` and `clientSecret` field accordingly.
- Run `npm install && npm start` to start the server.
> OR
- Run `docker-compose up` to start the server.

## Setting up the proxy

### On MacOs:
- Follow this [Blog](https://medium.com/@crmcmullen/how-to-install-apache-on-macos-10-13-high-sierra-and-10-14-mojave-using-homebrew-3cb6bf6e3cd4) to read about setting up `apache` and `httpd` server first.
- Add `127.0.0.1   quizioapi.sdslabs.local` to `/etc/hosts`
- Add the following lines to `/usr/local/etc/httpd/extra/httpd-vhosts.conf`
```
	<VirtualHost quizioapi.sdslabs.local:80>
		ServerName quizioapi.sdslabs.local
		ProxyRequests On
		ProxyPreserveHost On
		ProxyPass / http://localhost:5050/
		ProxyPassReverse / http://localhost:5050/
		LogLevel warn
	</VirtualHost>
```
- run `sudo apachectl start`.
- To verify the setup was successful, go to `http://quizioapi.sdslabs.local/` and you should be able to see the homepage!


## Developer notes:

### ID generation for documents in mongodb:
[nanoid]() is used for generating unique ids to identify every document in the db. The ids follow the following format: `quizioID.${nanoid()}`.
Any client making an API call must confirm that the id is valid using the `/api/v2/utils/verifyQuizioID/:id` endpoint.
