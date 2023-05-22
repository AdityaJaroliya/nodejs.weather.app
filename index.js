const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal)=>{
    let temprature = tempVal.replace("{%tempval%}", (orgVal.main.temp)-(273.15).toFixed(2));
    temprature = temprature.replace("{%tempmin%}", orgVal.main. temp_min-(273.15).toFixed(2));
    temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max-(273.15).toFixed(2));
    temprature = temprature.replace("{%tempStatus%}", orgVal.weather[0].main);

    
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    console.log(temprature);
    return temprature;

}





const server = http.createServer((req, res)=>{
    if(req.url =="/")
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=AGRA&appid=ccf1726e571a47da87ef792ddef94817")
       
        .on("data", (chunk) =>
        {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            //console.log(arrData[0].main.temp);
             
            const realTimeData = arrData
            .map(val=> replaceVal(homeFile, val))
            .join("");
            res.write(realTimeData);
     console.log(realTimeData);
        })
        .on("end", (err)=>{ 
            if(err) return console.log("connection closed due to err", err);

            console.log("end");
            res.end();

        });
        
    }

});

server.listen(8000, "localhost");