require("dotenv").config();
let express = require("express");
let app = express();
let path = require("path");
let server = require("http").createServer(app);
const io = require("socket.io")(server);

let PERMITTED_IP_ADDRESS = process.env.PERMITTED_IP_ADDRESS || "127.0.0.1"

/**
 * Please read README.md before using this        
 */

app.get("/logs", (req, res) => {
    console.log("req.ip ---> ", req.ip);
    if (PERMITTED_IP_ADDRESS.includes(req.ip)) {
        res.sendFile(path.join(__dirname, '/logs.html'));
    } else {
        res.send(`<h1> Unauthorised Access </h1>`)
    }
});


//socket-code
io.on("connection", (socket) => {
    console.log("A user connected");
    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
        console.log("A user disconnected");
    });
});


//starting up the server
server.listen(process.env.PORT, process.env.HOST, function () {
    console.log("Log Server is listening at http://%s:%s", process.env.HOST, process.env.PORT);
});
/**
 * 
 * We have added 5 seconds delay so that first this server could start. Further, this will trigger spawn process start the server
 * to which we want to monitor
 */
//.spawn('node', ['server.js']);
//pm2 start pm2.json
setTimeout(() => {
    let child = require("child_process").spawn('npm', [' run', ' multi_process_cluster_index'], {
        shell: true
    });
    let child_pm2 = require("child_process").spawn('pm2', ['logs','index-primary','index-replica'], {
        shell: true
    }); //add your server command to execute here
   
   
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
        console.log(data.toString());
        io.emit("pm2-logs", {
            logs: data.toString(),
        });
    });


    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
        console.log(data.toString());
        data = data.toString();
        io.emit("pm2-logs", {
            logs: data.toString(),
        });
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("close", function (code) {
        console.log('child process exited with code ' + code);
        io.emit("pm2-logs", {
            logs: 'child process exited with code ' + code,
        });
    });

    // 

    child_pm2.stdout.on("data", function (data) {
        console.log(data.toString());
        io.emit("pm2-logs", {
            logs: data.toString(),
        });
    });


    child_pm2.stderr.setEncoding("utf8");
    child_pm2.stderr.on("data", function (data) {
        console.log(data.toString());
        data = data.toString();
        io.emit("pm2-logs", {
            logs: data.toString(),
        });
    });

    child_pm2.stderr.setEncoding("utf8");
    child_pm2.stderr.on("close", function (code) {
        console.log('child process exited with code ' + code);
        io.emit("pm2-logs", {
            logs: 'child process exited with code ' + code,
        });
    });
}, 5000)