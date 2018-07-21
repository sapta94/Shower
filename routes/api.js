
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

    app.post('/userData',function(req,res){
        var firstName = req.body.firstName||null;
        var lastName = req.body.lastName||null;
        var email = req.body.email||null;
        var mobile = req.body.mobile||null;
        var dob =req.body.dob||null;

        var checkQuery="select * from UserData where EmailID=? or Mobile=?";
        var insertQuery="Insert into UserData(FirstName,LastName,EmailID,Mobile,DateOfBirth) values (?,?,?,?,?)"
        connectionPool.getConnection(function(err,connection){
            if(err){
                console.log(err)
                return
            }
            connection.query(checkQuery,[email,mobile],function(err,rows,cols){
                if(err){
                    console.log(err)
                    connection.destroy()
                    res.status(503).json({
                        status:'fail',
                        message:err.sqlMessage
                    })
                    return     
                }
                if(rows.length>0){
                    connection.destroy();
                    res.json({
                        status:'fail',
                        message:'user exists'
                    })
                    return
                }
                
                connection.query(insertQuery,[firstName,lastName,email,mobile,dob],function(err,result){
                    console.log(this.sql)
                    if(err){
                        console.log(err)
                        connection.destroy()
                        res.status(503).json({
                            status:'fail',
                            message:err.sqlMessage
                        })
                        return 
                    }
                    connection.destroy();
                    res.json({
                        status:'success',
                        message:'Record Inserted'
                    })
                    return
                })
            })

        })
    })


    app.put('/userData',function(req,res){
        var firstName = req.body.firstName||null;
        var lastName = req.body.lastName||null;
        var email = req.body.email||null;
        var mobile = req.body.mobile||null;
        var dob =req.body.dob||null;
        var userID=req.body.userID||null

        if(!userID){
            res.status(422).json({
                status:'fail',
                message:'missing parameters'
            })
            return
        }

        var query="update UserData set FirstName=?,LastName=?,EmailID=?,Mobile=?,DateOfBirth=? where UserID=?"

        connectionPool.getConnection(function(err,connection){
            if(err){
                console.log(err)
                return
            }
            connection.query('select * from UserData where UserID=?',[userID],function(err,rows,cols){
                if(err){
                    console.log(err)
                    connection.destroy()
                    res.status(503).json({
                        status:'fail',
                        message:err.sqlMessage
                    })
                    return     
                }
                var tempArray=[];
                if(firstName!=rows[0].FirstName){
                    tempArray.push([userID,'FirstName',rows[0].FirstName,time])
                }
                if(lastName!=rows[0].LastName){
                    tempArray.push([userID,'LastName',rows[0].LastName,time])
                }
                if(email!=rows[0].EmailID){
                    tempArray.push([userID,'FirstName',rows[0].EmailID,time])
                }
                if(mobile!=rows[0].Mobile){
                    tempArray.push([userID,'FirstName',rows[0].Mobile,time])
                }
                if(dob!=rows[0].DateOfBirth){
                    tempArray.push([userID,'FirstName',rows[0].DateOfBirth,time])
                }
                connection.beginTransaction(function(err) {
                    if (err) {
                        connection.destroy();
                        console.log(err);
                        res.status(503).json({
                            status:'fail',
                            message:err.sqlMessage
                        })
                        return
                    }
                    connection.query(query,[firstName,lastName,email,mobile,dob,userID],function(err,result){
                        if(err){
                            return connection.rollback(function() {
                                connection.destroy();
                                console.log(err, 1);
                                //settings.serviceError(res, err.toString());
                                res.status(503).json({
                                    status:'fail',
                                    message:err.sqlMessage
                                })
                                return;
                            });
                        }
                        connection.query('Insert into EditDetails values ?',[tempArray],function(err,result){
                            if(err){
                                return connection.rollback(function() {
                                    connection.destroy();
                                    console.log(err, 1);
                                    //settings.serviceError(res, err.toString());
                                    res.status(503).json({
                                        status:'fail',
                                        message:err.sqlMessage
                                    })
                                    return;
                                });
                            }
                            connection.commit(function(err) {
                                if (err) {
                                    return connection.rollback(function() {
                                        connection.destroy();
                                        console.log(err, 1);
                                        //settings.serviceError(res, err.toString());
                                        return;
                                    });
                                }
                                connection.destroy();
                                res.json({
                                    status: "success",
                                    message: "row updated successfully"
                                })
                                return
                            })
                        })

                    })
                })
            })
        })
    })
}