// For debugging only, so I can see what the normal client does
// "Opportunistic TLS" haha yes very secure

const removeBuffer = Buffer.from('{"TLS": {"startTLS": "send"}}');
const net = require("net");
const text = require("fs").createWriteStream("conversation.txt");

net.createServer(socket => {
	const conn = net.createConnection({ host: "syncplay.pl", port: 8996 });
	//const conn = net.createConnection({ port: 8999 });

	socket.on("data", data => {
		console.log("C >> " + data.toString().replace("\r\n", ""));
		text.write("C >> " + data.toString());
		if (data.includes(removeBuffer)) {
			socket.write(Buffer.from('{"TLS": {"startTLS": "false"}}\r\n'));
			console.log('S >> {"TLS": {"startTLS": "false"}} (striptls)');
			text.write('S >> {"TLS": {"startTLS": "false"}} (striptls)\r\n');
		} else {
			conn.write(data);
		}
	});

	conn.on("data", data => {
		console.log("S >> " + data.toString().replace("\r\n", ""));
		text.write("S >> " + data.toString());
		socket.write(data);
	});
}).listen(9000);