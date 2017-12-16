

var currentpositionApi = {

    fs : require('fs'),
    multiparty: require('multiparty'),
    uploadFiles:function(req,reply){
        var form = new currentpositionApi.multiparty.Form();
        form.parse(req.payload, function(err, fields, files) {
            currentpositionApi.fs.readFile(files.upload[0].path,function(err,data){
                var newpath = __dirname + "/uploads"+files.upload[0].originalFilename;
                currentpositionApi.fs.writeFile(newpath,data,function(err){
                    if(err) console.log(err);
                    else console.log(files)
                })
            })
            console.log(files)

        });

    }
}


var routes = function (server, db) {
    server.route({
        method: "POST",
        path: "/document",
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: false
            },
            handler: currentpositionApi.uploadFiles,
        }
    })
}

module.exports = routes