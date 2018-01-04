const WebSocket = require("ws");
const net = require("net");
 
const wss = new WebSocket.Server({ port: 8080 });
 
wss.on("connection", (ws) => {
	const tcpConn = net.createConnection({ port: 8999 }, () => {
		console.log("Connected");
	});
	ws.on("message", (message) => {
		console.log("received: %s", message);
		tcpConn.write(message + "\r\n");
	});
	tcpConn.on("data", (data) => {
		console.log("received: %s", data.toString());
		ws.send(data.toString());
	});
	ws.on("close", () => {
		tcpConn.end();
	});
	tcpConn.on("end", () => {
		ws.close();
	});
});