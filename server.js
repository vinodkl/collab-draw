var express = require("express");
var app = express();
var port = 8089;

app.use(express.static(__dirname));

app.set('views', __dirname + '/views');
app.set('view engine', "ejs");

app.get("/", function(req, res) {
	res.render("index");
});

var io = require('socket.io').listen(app.listen(port));
var users = [];

io.sockets.on('connection', function (socket) {

    socket.on('draw', function (data) {
    	var drawJson = data.drawJson;
    	io.sockets.emit('drawCords', {drawJson: drawJson});
    });

});