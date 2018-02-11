const WebSocket = require("ws");
const net = require("net");
 
const wss = new WebSocket.Server({ port: 9000 });
 
wss.on("connection", (ws) => {
	const tcpConn = net.createConnection({ port: 8999 }, () => {
		console.log("Connected");
		//tcpConn.write(`{"Hello": {"username": "Bob", "room": {"name": "SyncRoom"}, "version": "1.2.7"}}\r\n`);
		//var latency = Math.floor(new Date() / 1000);
		//tcpConn.write(`{"State": {"ping": {"clientRtt": 0, "clientLatencyCalculation": ${latency}, "latencyCalculation": ${latency}}, "playstate": {"paused": true, "position": 0.0}}}\r\n`);
		//setTimeout(function () {
		//	var latency = Math.floor(new Date() / 1000);
		//	tcpConn.write(`{"State": {"ping": {"clientRtt": 0, "clientLatencyCalculation": ${latency}, "latencyCalculation": ${latency}}, "playstate": {"paused": true, "position": 0.0}}}\r\n`);
		//}, 1000);
	});
	ws.on("message", (message) => {
		console.log("received: %s", message.toString());
		tcpConn.write(message.toString() + "\r\n");
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