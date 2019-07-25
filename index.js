const WebSocket = require("ws");
const net = require("net");
const URL = require("url");
const http = require("http");

const server = http.createServer();
const serverWS = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
	const pathname = URL.parse(request.url).pathname;

	let host;
	let port = 8999;
	// Production on Heroku
	if (process.env.NODE_ENV == "production") {
		host = "syncplay.pl";
		port = 8995;
		switch (pathname) {
			case "/8996":
				port = 8996;
				break;
			case "/8997":
				port = 8997;
				break;
			case "/8998":
				port = 8998;
				break;
			case "/8999":
				port = 8999;
				break;
			default:
				break;
		}
	}

	serverWS.handleUpgrade(request, socket, head, conn => {
		let waitQueue = [];
		let connected = false;
	
		const tcpConn = net.createConnection({ port, host, timeout: 30000 }, () => {
			connected = true;
			waitQueue.forEach(msg => {
				tcpConn.write(msg);
			});
			waitQueue = null;
		});
		conn.on("message", message => {
			if (!connected) {
				waitQueue.push(message.toString() + "\r\n");
				// Gotta stop somewhere otherwise we can be DoS'd
				if (waitQueue.length > 1000 || waitQueue.reduce((acc, cur) => acc + cur.length) > 10000) {
					console.log("Wait Queue length exceeded, dropping connection!");
					tcpConn.end();
					conn.close();
				}
			} else {
				tcpConn.write(message.toString() + "\r\n");
			}
		});
		tcpConn.on("data", data => {
			conn.send(data.toString());
		});
		conn.on("close", () => {
			tcpConn.end();
		});
		tcpConn.on("end", () => {
			conn.close();
		});
		conn.on("error", () => {
			tcpConn.end();
		});
		tcpConn.on("error", () => {
			conn.close();
		});
	});
});

server.on("request", (req, res) => {
	res.writeHead(302, { "Location": "https://github.com/comp500/syncweb-gateway" });
	res.end();
});

server.listen(process.env.PORT || 9000);