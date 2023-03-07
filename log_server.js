require("dotenv").config();
let express = require("express");
let app = express();
let path = require("path");
let server = require("http").createServer(app);
const io = require("socket.io")(server);
const pm2 = require('pm2');
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const app_name = process.env.APP_NAME
if(!app_name){
   throw new Error("Please specify APP_NAME in environment variables.")
}
const PERMITTED_IP_ADDRESS = process.env.PERMITTED_IP_ADDRESS || "" //|| "127.0.0.1,::1"
const PASSWORD = process.env.PASSWORD || generatePassword()
console.log("PERMITTED_IP_ADDRESS", PERMITTED_IP_ADDRESS);
console.log("PASSWORD", PASSWORD);
/**
 * Please read README.md before using this        
 */

app.get("/logs", (req, res) => {
    console.log("req.ip ---> ", req.ip);
    if (PERMITTED_IP_ADDRESS.includes(req.ip)) {
        res.sendFile(path.join(__dirname, '/logs.html'));
    } else {
        res.sendFile(path.join(__dirname, '/verify_user.html'));
    }
});

app.get("/auth", (req, res) => {
    const {
        password
    } = {
        ...req.query,
        ...req.params,
        ...req.body
    };
    if (PASSWORD == password) {
        res.sendFile(path.join(__dirname, '/logs.html'));
    } else {
        res.status(200).json({
            status: "failed",
            msg: "Unauthorised Access"
        })
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
    getLogs();
});


function getLogs() {
    pm2.connect(function (err) {
        if (err) {
            console.error(err);
            process.exit(2);
        }

        pm2.launchBus(function (err, bus) {
            if (err) {
                console.error(err);
                pm2.disconnect();
                return;
            }

            bus.on('log:out', function (data) {
                if (app_name.toString().includes(data.process.name)) {
                    // console.log(data.data);
                    io.emit("pm2-logs", {
                        logs: data.data,
                    });
                }
            });

            bus.on('log:err', function (data) {
                if (app_name.toString().includes(data.process.name)) {
                    // console.error(data.data);
                    io.emit("pm2-logs", {
                        logs: data.data,
                    });
                }
            });
        });
    });
}


function generatePassword() {
    function jumble(str) {
        return [...str]
            .sort(() => Math.random() - 0.5)
            .join('')
    }

    // no change to this function
    function randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '!@#$%^&*()_-+=[{]};:>|./?';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    }

    return jumble(randomString(12, 'aA#') + randomString(4, '!'));
}