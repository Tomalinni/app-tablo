    "use strict";
    var age = "60000";
    var timerId; 
    
    function getFormattedDate(date) {
      
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var min = date.getMinutes();
      var sec = date.getSeconds();

      month = (month < 10 ? "0" : "") + month;
      day = (day < 10 ? "0" : "") + day;
      hour = (hour < 10 ? "0" : "") + hour;
      min = (min < 10 ? "0" : "") + min;
      sec = (sec < 10 ? "0" : "") + sec;
      
      var str =  hour + ":" + min + " " + day + "." + month + "." + date.getFullYear();
      
      return str;
    }

    function display_cur_time() {
      document.getElementById('cur_time').innerHTML = getFormattedDate(new Date()); 
    };
    setInterval(display_cur_time, 30000);

      //Функци получения данных c zabbix server
      //"48157" - температура серверная
      //"51097" - силос
      //"52557" - температуры esp32-01
      //"52545" - влажность esp32-01
      //"52543" - точка росы esp32-01
      async function display_data() {
        var date_now_unixtime = + new Date();
        var xhr = new XMLHttpRequest();
        var url = "http://192.168.243.229/zabbix/api_jsonrpc.php" 
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        var request = xhr.send(JSON.stringify({"jsonrpc":"2.0","method":"item.get","params":{"filter":{"itemid":["48157","51097","52543","52545","52557"]},"output":["lastvalue","lastclock"]},"auth":"754838a649992a6be432e553d46f7514","id":1}));
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            
            //Значение температуры
            // var temp_timestamp = json["result"][0]["lastclock"];
            // var temp_time = new Date(temp_timestamp * 1000 );
            // if ((temp_timestamp * 1000) > (date_now_unixtime - 600000)) {
            //   document.getElementById('temp').innerHTML = json["result"][0]["lastvalue"];
            // }else{
            //   document.getElementById('temp').innerHTML = 0;
            // } 
            // document.getElementById('temp_time').innerHTML = getFormattedDate(temp_time);

            //Значение силоса
            var silos_timestamp = json["result"][1]["lastclock"];
            var silos_time = new Date(silos_timestamp * 1000 );
            if ((silos_timestamp * 1000) > (date_now_unixtime - 600000)) { 
              var silos = json["result"][1]["lastvalue"]; 
              document.getElementById('silos').innerHTML = silos;
              if ((silos) > (80)) {
                document.getElementById("silos").style.color = "red"; 
              } else {
                document.getElementById("silos").style.color = "black";
              }
            }else{
              document.getElementById('silos').innerHTML = "-";
            } 
            document.getElementById('silos_time').innerHTML =  getFormattedDate(silos_time) 

            //"52557" - температуры esp32-01
            var esp32_01_temp_timestamp = json["result"][4]["lastclock"];
            var esp32_01_temp_time = new Date(esp32_01_temp_timestamp * 1000 );
            if ((esp32_01_temp_timestamp * 1000) > (date_now_unixtime - 600000)) {
              document.getElementById('esp32_01_temp').innerHTML = json["result"][4]["lastvalue"];
            }else{
              document.getElementById('esp32_01_temp').innerHTML = 0;
            } 
            document.getElementById('esp32_01_temp_time').innerHTML = getFormattedDate(esp32_01_temp_time);

            //"52545" - влажность esp32-01
            var esp32_01_humi_timestamp = json["result"][3]["lastclock"];
            var esp32_01_humi_time = new Date(esp32_01_humi_timestamp * 1000 );
            if ((esp32_01_humi_timestamp * 1000) > (date_now_unixtime - 600000)) {
              document.getElementById('esp32_01_humi').innerHTML = json["result"][3]["lastvalue"];
            }else{
              document.getElementById('esp32_01_humi').innerHTML = 0;
            } 
            document.getElementById('esp32_01_humi_time').innerHTML = getFormattedDate(esp32_01_humi_time);
            

            //"52543" - точка росы esp32-01
            var esp32_01_dp_timestamp = json["result"][2]["lastclock"];
            var esp32_01_dp_time = new Date(esp32_01_dp_timestamp * 1000 );
            if ((esp32_01_dp_timestamp * 1000) > (date_now_unixtime - 600000)) {
              document.getElementById('esp32_01_dp').innerHTML = json["result"][2]["lastvalue"];
            }else{
              document.getElementById('esp32_01_dp').innerHTML = 0;
            } 
            document.getElementById('esp32_01_dp_time').innerHTML = getFormattedDate(esp32_01_dp_time);




          }
        };

      }

      //Функция обновления таймера при выборе значения из выпадающего списка
      function onCategoryChange() {
        var sel = document.querySelector("select");
        //alert("Значение: " + sel.options[sel.selectedIndex].text);
        age = sel.options[sel.selectedIndex].value;
        clearInterval(timerId)
        timerId = setInterval(display_data, age);
        //alert(age)
      }

      //Установка таймера автообновленя данных
      timerId = setInterval(display_data, age);

      //Обновление данных при нажатии на кнопку
      jQuery('#button-3').on('click', function() {
        display_data();
      });

      //Первое обновление данных при загрузке страницы
      display_data();
      display_cur_time();
      
      