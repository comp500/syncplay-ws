# syncweb-gateway
Interfaces the Syncplay protocol with WebSockets, allowing usage in the browser.

## Hosted service
With Heroku, I have hosted an instance of this server, allowing you to connect to the Official Syncplay servers with WebSockets. The endpoints for this free service are as follows:

- `wss://syncweb-gateway.herokuapp.com/8995` -> `syncplay.pl:8995`
- `wss://syncweb-gateway.herokuapp.com/8996` -> `syncplay.pl:8996`
- `wss://syncweb-gateway.herokuapp.com/8997` -> `syncplay.pl:8997`
- `wss://syncweb-gateway.herokuapp.com/8998` -> `syncplay.pl:8998`
- `wss://syncweb-gateway.herokuapp.com/8999` -> `syncplay.pl:8999`

This is using the Heroku free tier, so if too many connections are opened there may be issues, and the initial request may take longer if the dyno is sleeping.

## Usage
If you want to use syncweb-js (or similar websocket-based clients for Syncplay) with your own Syncplay servers, this repository provides a good starting point.

The default configuration when not in production (NODE_ENV != production) is to open a server on port 9000, which connects to a Syncplay server on localhost, port 8999 (the default).

### Installation
1. Install node.js (10.x ideally)
2. Clone, or download, this repository
3. Run `npm install` in the directory you downloaded it to
4. Run `npm start` to start the server