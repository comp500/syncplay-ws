const net = require("net");
 
const srv = new net.Server();
 
srv.on("connection", (conn) => {
	const tcpConn = net.createConnection({ port: 8999 }, () => {
		console.log("Connected");
	});
	conn.on("data", (message) => {
		console.log("client->server: %s", message.toString());
		tcpConn.write(message.toString());
	});
	tcpConn.on("data", (data) => {
		console.log("server->client: %s", data.toString());
		conn.write(data.toString());
	});
	conn.on("close", () => {
		tcpConn.end();
	});
	tcpConn.on("end", () => {
		ws.close();
	});
});

srv.listen(9000);