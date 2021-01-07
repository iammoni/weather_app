
//this is my node js project 3
const express=require('express');
const app=express();
var exphbs  = require('express-handlebars');
const path=require('path');
const request=require('request');
const bodyparser=require('body-parser');
//const { fdatasync } = require('fs');
const port=process.env.PORT ||3000;


//All Cities Names
let cities=require('all-the-cities');
let cities_array=[];
cities.filter(city => cities_array.push(city.name));

//body-parser middleware
app.use(bodyparser.urlencoded({extended:false}));
// API 	 pk_9c2cd272c75a406a87e909cc2e0a4795
const apiKey='41d4d9b4c12ad701ee6bd9193339177f';  //Openwheather
const newKey='e2d803340101415e887120244210601';//weather.com

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var fulltime= date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  var time ={"date":date,"month": month,"year":year,"hour":hour,"min":min,"sec":sec,time:fulltime};
  return time;
}

function forecast_weather(){
 //let new_url=`http://api.weatherapi.com/v1/current.json?key=${newKey}&q=London&days=2`;
 let new_url=`http://api.weatherapi.com/v1/forecast.json?key=e2d803340101415e887120244210601&q=07112&days=7`;
 request(new_url,(err,response,body)=>{
    if(err){
      console.log('Error in History Data Retrive: '+err);
      return null;
    }
    else{
      let weather=JSON.parse(body);
      
       // console.log(weather);
        let temp=weather.forecast.forecastday;
        let arr=[];
        for(let i=0;i<temp.length;i++){
          //console.log("Heere is the Day   :  "+i);
            arr.push({x:temp[i].date, y:temp[i].day.maxtemp_c});
        }
       return arr;
      //}
    }
  });
}
//forecast_weather();
//handlebar middlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// // handlebars routes

app.get("/",(req,res)=>{
  let city_name='Delhi';
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=${apiKey}`;
    request(url,(err,response,body)=>{
      if(err){
        res.render('home',{input:null,time:time,history:null,des:null,error:"Error, please try again"});
      }
      else{
        let weather=JSON.parse(body);
        let time=timeConverter(weather.dt);
        let country_code=weather.cod;
        let no_of_months=1;
        let no_of_days=30;
        let forecast=forecast_weather();
        let des=weather.weather[0];
        if(weather.main==undefined){
          res.render('home',{input:null,time:time,forecast:forecast,des:null,error:"Error, please try again 2"});
        }
        else{
          //console.log(history);
         res.render('home', {input:weather,time:time,forecast:forecast,des:des,error:null});
        }
      }
    });
  });

  //Post route
  app.post("/",(req,res)=>{
    let city_name=req.body.city_name;
   
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=${apiKey}`;
      request(url,(err,response,body)=>{
        if(err){
          res.render('home',{input:null,time:null,forecast:null,des:null,error:"Error, please try again"});
        }
        else{
          let weather=JSON.parse(body);
          let time=timeConverter(weather.dt);
          let des=weather.weather[0];
          let forecast=[];
          if(weather.main==undefined){
            res.render('home',{input:null,time:time,forecast:null,des:null,error:"Error, please try again 2"});
          }
          else{
           res.render('home', {input:weather,time:time,forecast:forecast,des:des,error:null});
          }
        }
      });
    });

    app.get('/aboutme',(req,res)=>{
      
      res.render('about');

    });
    


//set static folder
app.use(express.static(path.join(__dirname,'public')));
app.listen(port,()=>console.log(`Server is running at port :${port}`));