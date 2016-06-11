var brain = require('brain');
var net = require('net');
var fs = require('fs');
var $ = require("mongous").Mongous;
var cardtypes=require('./cardtypes');
$().open("121.42.180.144");
process.env.TZ = "Asia/Shanghai";

var HOST = '0.0.0.0';
var PORT = 8888;
var global_new = false;
var gsock;
var mind = new brain.NeuralNetwork();

var minddata = JSON.parse(fs.readFileSync('./data/mind.json', 'utf8'));
mind.train(minddata);

function closest(arr, num){
    var ret = arr[0];
    var distance = Math.abs(ret - num);
    for(var i = 1; i < arr.length; i++){
        var newDistance = Math.abs(arr[i] - num);
        if(newDistance < distance){
            distance = newDistance;
            ret = arr[i];
        }
    }
    return ret;
}

function savemind() {
    fs.writeFileSync('mind.json', JSON.stringify(minddata));
}
savemind();

function charLeftAll(n,y)
{
    if (y) {
      n=n+8;
      if (n>24) {
        n=n-24;
      }
    }
    if(n < 10)
        return "0" + n;
    else
        return n;
}

function server() {
    net.createServer(function(sock) {

        // 我们获得一个连接 - 该连接自动关联一个socket对象
        console.log('CONNECTED: ' +
            sock.remoteAddress + ':' + sock.remotePort);
        gsock=sock;

        sock.on('data', function(odata) {
            var addstr="";
            odata = odata.toString();
            var data = odata.split(":");
            if(data[0]=='N'){
                var output = closest([0.1,0.5,1],mind.run([parseInt(data[1]), parseInt(data[2])])[0]);
                data[3] = data[3].replace(/\n/g,'');
                var result = $('coinbox.cards').update({cardid:data[3]},{$inc:{cardval:parseFloat(output)}});
                $('coinbox.cards').find({cardid: data[3]},function (a) {
                    $('coinbox.logs').save({
                        cardid:data[3],
                        type:'充值',
                        val:parseFloat(output),
                        rval:a.documents[0].cardval,
                        client:"终端投币",
                        time:require('dateformat')(new Date(),"isoDateTime")
                    });
                    sock.write('G'+output+':'+a.documents[0].cardval+'H');
                });
                console.log('DATA ' + sock.remoteAddress + ": "+output);
            }else if(data[0]=='C'){
                $('coinbox.cards').find({cardid: data[1].replace(/\n/g,'')},function (a) {
                    console.log(a);
                    if (a.numberReturned==0) {
                        sock.write('E');
                    }else{
                        sock.write('G'+a.documents[0].cardtype+':'+a.documents[0].cardval+':'+a.documents[0].cardno+'E');
                    }
                });
            }else if(data[0]=='T'){
                minddata.push({input:[parseInt(data[1].replace(/\n/g,'')),parseInt(data[2].replace(/\n/g,''))],output:[parseFloat(data[3].replace(/\n/g,''))]});
                savemind();
                sock.write('A');
                console.log('DATA ' + sock.remoteAddress + ":  "+odata);
            }else{
                console.log('DATA ' + sock.remoteAddress + ': ' + odata);
                sock.write('G');
            }
        });

        // 为这个socket实例添加一个"close"事件处理函数
        sock.on('close', function(data) {
            console.log('CLOSED: ' +
                sock.remoteAddress + ' ' + sock.remotePort);
        });

    }).listen(PORT, HOST);
    console.log('Server listening on ' + HOST +':'+ PORT);
}

server();