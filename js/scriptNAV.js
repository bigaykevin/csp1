$(document).ready(function(){
$("h1").text("IT'S WORKING... YOU'RE GOOD TO GO!");


$( "input" ).on({
    click: function() {
    var navdata = $(this).data("nav");
        navdata = isNaN(navdata) ? "" : navdata
    this.value = navdata;
    this.select();
  },focus: function() {
    $( this ).addClass( "onfocus" );
  },blur: function() {
     var navdata = $(this).data("nav");
        navdata = isNaN(navdata) ? "" : navdata
      $( this ).removeClass( "onfocus" );
      var className = this.classList[0];
      if(this.value!=""){
          var formatted = format(navdata, className);
          this.value = formatted
       } else return ""
  }
});


//===================================================================
var app = angular.module('myApp', []);
app.filter('gps', function() {
  return function(posn) {
    if(isNaN(posn)) {
      return posn;
    } else {
      var num = round(Math.abs(parseFloat(posn)),1);
      var deg = Math.floor(num/100);
      var min = round(num - deg*100,1);
      return (deg + ascii(176) + "" + min + "'")
    }
  }
});
//=============================================================


/*MERCATOR*/
$( ".longitude, .latitude, .course, .distance" ).change(function() {
  /*input should have a first class such as the following*/
  var goodtogo = validatethis.call(this);
  var className1 = this.classList[0];
  var className2 = this.classList[1];
  /*input shoud have a second class "Merc"*/
  if (goodtogo === true){
     $(this).data("nav",this.value);
     /*will display North or South, East or West*/
     if(className1 === "latitude"){
       $(this).next(".eow").val(this.value >= 0 ? "N" : "S");
     };
     if(className1 === "longitude"){
       $(this).next(".eow").val(this.value >= 0 ? "E" : "W");
     };
     /*code for Mercator calculation*/
     if(className2 === "Merc"){
       /*check if all input fields are filled up*/
       empty = $("input").filter(".Merc").filter(function(){
         return this.value === "";
       });
       if(!empty.length){
          /*action to do when all conditions are met. calculate mercator*/
          var La1 = degmin(parseFloat($("#Lat1").data("nav")));
          var Lo1 = degmin(parseFloat($("#Long1").data("nav")));
          var La2 = degmin(parseFloat($("#Lat2").data("nav")));
          var Lo2 = degmin(parseFloat($("#Long2").data("nav")));
          var merc = mercator(La1,Lo1,La2,Lo2);

          $("#merCo").val(format(merc.course, "course"));
          $("#merCo").data("nav", merc.course);
          $("#merDist").val(format(merc.distance, "distance"));
          $("#merDist").data("nav", merc.distance);
          //alert($("#merCo").data("nav"))
        }else return;
      };

      /*code for Dead Reckoning calculation*/
      if(className2 === "DR"){
        /*check if all input fields are filled up*/
        empty = $("input").filter(".DR").filter(function(){
          return this.value === "";
        });
        if(!empty.length){
          var La1 = degmin(parseFloat($("#drlat1").data("nav")));
          var Lo1 = degmin(parseFloat($("#drlong1").data("nav")));
          var course = parseFloat($("#drco").val());
          var distance = parseFloat($("#drdist").val());
          var dr = deadReckon(La1, Lo1, course, distance);
          var Latitude = round(deciDeg(dr.Latitude), 1).toFixed(1);
          var Longitude = round(deciDeg(dr.Longitude),1).toFixed(1);
          $("#drlat2").data("nav",Latitude)
          $("#drlat2").val(format(Latitude, "latitude"));
          $("#drlong2").data("nav",Longitude)
          $("#drlong2").val(format(Longitude, "longitude"));
          $("#drlat2").next(".eow").val(Latitude >= 0 ? "N" : "S");
          $("#drlong2").next(".eow").val(Longitude >= 0 ? "E" : "W");
          //alert(Latitude);
          //alert(Longitude);
        }
      };
    };
});
function validatethis() {
  let x = this.value;
  let className = this.classList[0];
  if(x == null || isNaN(x) || x.trim() === "" ||
      (className ==="longitude" && (x > 18000 || x < -18000 ||
      Math.trunc(degmin(x))!==Math.trunc(x/100))) ||
      (className ==="latitude" && (x > 9000 || x < -9000 ||
      Math.trunc(degmin(x))!==Math.trunc(x/100))) ||
      (className ==="course" && (x > 360 || x < 0)) ||
      (className ==="distance" && (x > 180 || x < 0))) {
      alert("Please enter an appropriate " + className +" value");
      this.value = $(this).data("nav") || "";;
      return false;
  }else return true;
};
/*========================================================================*/
/*zerofill formats value to 000.0 appropriate for Course values*/
function zeroFill(value, padding, z) {
    var value = parseFloat(value);
    var decimal = Math.round((value - Math.trunc(value))*10);
    value = Math.trunc(value);
    var zeroes = new Array(padding+1).join("0");
    decimal = ( z === "decimal") ? ("." + decimal) : "";
    return (zeroes + value).slice(-padding) + decimal;
}
/*parseDeg parses a value from degrees formatted string to a number*/
function parseDeg(deg){
    return parseFloat(deg.replace(/[^0-9\.]/g, ''), 10)
}
/*format formats a value to degrees-minutes format*/
function format(number, format) {
    if(isNaN(number)||number===""){return number}else{
      if(format === "course"){
        return zeroFill(number, 3, "decimal") + ascii(176)
      }else
      if(format === "distance"){
        return round(number, 1).toFixed(1) + " nm"
      }else{
        var num = round(Math.abs(parseFloat(number)),1);
        var deg = Math.floor(num/100);
        var min = round(num - deg*100,1);
        deg = (format === "longitude") ? zeroFill(deg, 3) : zeroFill(deg, 2);
        return (deg + ascii(176) + "" + zeroFill(min, 2, "decimal") + "'");
      }
    }
};
/*returns the symbol degrees ascii(176)*/
function ascii (a) { return String.fromCharCode(a); };

/*method allowing to move through input boxes by keypress enter*/
$("input").keyup(function (event) {
    var currentBoxNumber = 0;
    if (event.keyCode == 13) {
        inputbox = $("input");
        currentBoxNumber = inputbox.index(this);
        if (inputbox[currentBoxNumber + 1] != null) {
            nextBox = inputbox[currentBoxNumber + 1]
            if(this.classList[0]==="longitude" ||
               this.classList[0]==="latitude"){
               nextBox = inputbox[currentBoxNumber + 2]};
            nextBox.focus();
            nextBox.select();
            event.preventDefault();
            return false;
        }
    }
});
/*========================================================================*/
                      /*Mathematical functions*/
function round(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}
function radians(angle) {
  return angle * (Math.PI / 180);
}
function degrees(angle) {
  return angle * (180 / Math.PI);
}
function log(x) {
    return Math.log(x) / Math.log(10);
}
function degmin(angle){
  let degrees;
  let minutes;
  if(angle>0){
    degrees = Math.floor(angle/100);
    minutes = (angle - Math.floor(angle/100)*100)/60;
  }else{
    degrees = Math.ceil(angle/100);
    minutes = (angle - Math.ceil(angle/100)*100)/60;
  }
  return degrees + minutes;
};
function deciDeg(number){
  var degrees = Math.trunc(number);
  var minutes = (number - degrees)*60;
  return (degrees*100) + minutes;
};
/*=========================================================================*/
                            /*Mercator*/
function medpart(Lat){
  return 7915.704468 * log(Math.tan(radians(Math.abs(Lat) / 2 + 45)))
         - (Math.sin(radians(Math.abs(Lat))) * 23.01336332);
};
/*This is an alternate formula, you may use for more detailed calculation
  of meridional parts...
  return 7915.704468 * log(Math.tan(radians(Math.abs(Lat) / 2 + 45)))
            //- (Math.sin(radians(Math.abs(Lat))) * 23.01336332)
            //- (Math.sin(radians(Math.abs(Lat))) ^ 3 * 0.051352909)
            //- (Math.sin(radians(Math.abs(Lat)))) ^ 5 * 0.0002062636*/
function dmedpart(la1,la2){
  var dmp;
  /*same name = diff mp's ; diff name = add mp's
  somehow this simple expression works, that's neat*/
  if((la1/Math.abs(la1))===(la2/Math.abs(la2))){
    return dmp = medpart(la2) - medpart(la1)
  }else{
    return dmp = medpart(la2) + medpart(la1)
  }
};
function mercator(Lat1, Long1, Lat2, Long2){
  var dlat = Lat2 - Lat1;
  var dlo = Math.abs(Long2 - Long1)>180 ?
            (360-Math.abs(Long2 - Long1)) : (Long2 - Long1);
  var dmp = dmedpart(Lat1, Lat2)
  var angleCo;
  /*course calculation*/
  if(dmp!== 0){
    angleCo = degrees(Math.atan(Math.abs(dlo*60)/Math.abs(dmp)));
  }
  /*converts quadrantal angle to true course*/
  if (dlat > 0 && dlo > 0){course = angleCo} else
  if (dlat < 0 && dlo > 0){course = 180 - angleCo} else
  if (dlat < 0 && dlo < 0){course = 180 + angleCo} else
  if (dlat > 0 && dlo < 0){course = 360 - angleCo} else
  if (dlat===0 && dlo > 0){course = 90 } else
  if (dlat===0 && dlo < 0){course = 270} else
  if (dlat===0 && dlo===0){course = 0} else
  if (dlat > 0 && dlo===0){course = 0  } else
  if (dlat < 0 && dlo===0){course = 180}
  /*Distance Calculation*/
  if (course === 270 || course === 90) {
    distance = (Math.cos(radians(Lat1))*Math.abs(dlo * 60))
  }else if (course === 0 || course === 180) {
    distance = Math.abs(dlat * 60)
  }else{
    distance = Math.abs(dlat * 60) / Math.cos(radians(course))
  }
  distance = Math.abs(distance);
  return {
         course:round(course, 2),
         distance:round(distance, 2)
         };
};
/*==========================================================================*/
                         /*Dead Reckoning*/
function deadReckon(La1, Lo1, course, distance){
  var dlat = distance * Math.cos(radians(course))/60;
  var La2  = La1 + dlat;
  var dmp  = dmedpart(La1, La2)
  var dlo;
  if(course === 270 || course === 90){
      dlo = (distance * Math.cos(radians(La1)))/60
  }
    else{dlo = (dmp * Math.tan(radians(course)))/60
  };
  dlo = course < 180 ? Math.abs(dlo) : -Math.abs(dlo)
  var Lo2 = Lo1 + dlo
  return {
         Latitude:La2,
         Longitude:Lo2
         };
};














});
