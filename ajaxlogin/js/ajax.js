   /*https://plainjs.com/javascript/ajax/send-ajax-get-and-post-requests-47/
    *
    */
   function postAjax(url, data, success) {
       //data can be passed as string like 'data='abed+murrar'
       //or as objects as {data: 'abed', num: 2}
       var params = typeof data == 'string' ? data : Object.keys(data).map(
           function(k) {
               return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
           }
       ).join('&');
       //params in the end becomes like 'data=abed+murrar&num=2'

       //for IE6 too
       var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
       xhr.open('POST', url);
       xhr.onreadystatechange = function() {
           if (xhr.readyState > 3 && xhr.status == 200) {
               //success is the function you want the data
               //retreived to be sent to
               success(xhr.responseText);
           }
       };
       xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
       xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
       xhr.send(params);
       return xhr;
   }

   function getAjax(url, success) {
       //for IE6 too
       var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
       xhr.open('GET', url);
       xhr.onreadystatechange = function() {
           if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
       };
       xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
       xhr.send();
       return xhr;
   }

   function tableCreate(data) {
       //if the table does not exist
       if (!document.getElementById('mentors')) {
           outputs = JSON.parse(data);
           var demo = document.getElementById('demo');
           var tbl = document.createElement('table');
           tbl.id = "mentors";
           var thd = document.createElement('thead');
           var th1 = document.createElement('th');
           th1.innerHTML = "#";
           var th2 = document.createElement('th');
           th2.innerHTML = "First Name";
           var th3 = document.createElement('th');
           th3.innerHTML = "Last Name";
           thd.appendChild(th1);
           thd.appendChild(th2);
           thd.appendChild(th3);
           tbl.appendChild(thd);

           var tbdy = document.createElement('tbody');
           for (var i = 0; i < 2; i++) {
               var tr = document.createElement('tr');
               for (var j = 0; j < 3; j++) {
                   var td = document.createElement('td');
                   td.innerHTML = outputs[i][j];
                   tr.appendChild(td)
               }
               tbdy.appendChild(tr);
           }
           tbl.appendChild(tbdy);
           demo.appendChild(tbl)
       }
   }