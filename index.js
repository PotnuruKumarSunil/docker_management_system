const express=require("express")
const app=express()
const { exec } = require("child_process")

app.get("/run",function(req,res)
        {res.sendFile(__dirname + "/rundocker.html");
        })


function sunil(){
console.log("Server started on port 3000")}



app.get("/runpage",function(req,res){
        let cname = req.query.os_name;
        let cimage = req.query.image_type;
        console.log(cname +" " + cimage);
        exec('docker ps -a | rev | cut -d" " -f 1 | rev | grep -F -q -x'+cname);
        if(exec('echo $?')!=0){
        exec('docker run -dit --name ' + cname + ' ' + cimage,function(err,stdout,stderr){
                console.log(stdout)
                console.log(err)
        res.send("<pre>"+stdout+"</pre>");
        })
        }
        else{
                res.send("<pre>Container with name "+cname+" already exists</pre>");   
        }
        //res.send("got it")

})
app.get("/stop",function(req,res){
        let cnamed = req.query.cnamed;
        console.log(cnamed+" is to be stpped");
        exec('docker stop '+cnamed,function(err,stdout,stderr){
                console.log(stdout)
                console.log(err)
        res.send("<pre>"+stdout+"</pre>");

        })

})

app.get("/delete",function(req,res){
        let cnamed = req.query.cnamed;
        console.log(cnamed+" is to be deleted");
        exec('docker rm -f '+cnamed,function(err,stdout,stderr){
                console.log(stdout)
                console.log(err)
        res.send("<pre>"+stdout+"</pre>");
        })

})


app.get("/checkpage",function(req,res){
        exec("docker ps | tail -n+2",function(err,stdout,stderr){
                let a = stdout.split("\n");
                res.write("<table border=5px color='red' align='center' width=80%>");
                res.write("<tr><th>Conatiner id</th><th>Image</th><th>Command</th><th>Name</th></tr>")
        //      a.forEach((cdetails)=>{console.log(cdetails.trim().split(/\s+/))
        //      })
                a.forEach((cdetails)=> {
                        let cinfo = cdetails.trim().split(/\s+/)
                        res.write("<tr><td>"+cinfo[0]+"</td>"+"<td>"+cinfo[1]+"</td>"+"<td>"+cinfo[2]+"</td>"+"<td>"+cinfo[cinfo.length-1]+"</td></tr>")
                        })
                res.write("</table>")
                res.send()
        //      res.send( "<pre>"+ stdout.split("\n")[1] +"</pre>" )
        //      console.log( stdout.split("\n")[1] )
        })

})
app.listen(3000,sunil)

