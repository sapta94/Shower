
module.exports=function(settings){
    var app=settings.app;
    var connectionPool = settings.connectionPool;


    app.get('/allData',function(req,res){
        var userID=req.query.userID||null;

        if(userID){
            var query="select * from UserData where UserID=?"
        }
        else{
            var query="select * from UserData"
        }
        connectionPool.getConnection(function(err,connection){
            if(err){
                console.log(err)
                return
            }
            connection.query(query,[userID],function(err,rows,cols){
                console.log(this.sql)
                if(err){
                    console.log(err);
                    connection.destroy();
                    return
                }
                if(rows.length==0){
                    connection.destroy();
                    res.status(200).json({
                        status:'success',
                        data:[]
                    })
                    return
                }
                var data=[];
                rows.forEach(function(item){
                    data.push(rows)
                })
                connection.destroy();
                res.status(200).json({
                    status:'success',
                    data:data
                })
            })
        })
    })

}