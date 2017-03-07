/*
make_sign_in_socket = function(token, callback){
  var connection = new WebSocket('ws://localhost:8003/get_sign_in_socket');
  // When the connection is open, send some data to the server
  var hehe = false;
  connection.onopen = function () {

      console.log("Hey there!")
      token = token;
      connection.send(token);
    };
  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' , error);
  };
  // Log messages from the server
  connection.onmessage = function (e) {
    callback(e.data);
    var info = JSON.parse(e.data);
    console.log("info.message api.js: " + info.message);
    if(info.message === "shutdown"){
      console.log("info.message api.js i ifen: " + info.message);
      connection.send("shutdown");
    }

    else if(info.message == "stop"){
      hehe = true;
    }


  };
  connection.onclose = function(){
    if(!hehe){
      signOutFunc();
    }
    console.log("Closing connection");
  }
}
*/

make_sign_in_socket = function(token){
  var connection = new WebSocket('ws://localhost:8003/get_sign_in_socket');
  // When the connection is open, send some data to the server
    connection.onopen = function () {
      console.log("Hey there!")
      connection.send(token);
    };
  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' , error);
  };
  // Log messages from the server
  connection.onmessage = function (e) {
    //callback(e.data);
    //var info = JSON.parse(e.data);

  };
  connection.onclose = function(){
    signOutFunc();
    console.log("Closing connection");
  }
}

//Sign in
make_sign_in = function(username, password, callback){
var xmlHTTP = new XMLHttpRequest();
const params = new URLSearchParams(); //hemlig kod
params.append("user_email", username);
params.append("user_password", password);

  xmlHTTP.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_sign_in', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

//Vettefan
make_sign_up = function(object, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  user_email = object.email;
  user_password = object.password;
  user_firstname = object.firstname;
  user_familyname = object.familyname;
  user_gender = object.gender;
  user_city = object.city;
  user_country = object.country;
  params.append("user_email", user_email);
  params.append("user_password", user_password);
  params.append("user_firstname", user_firstname);
  params.append("user_familyname", user_familyname);
  params.append("user_gender", user_gender);
  params.append("user_city", user_city);
  params.append("user_country", user_country);

  xmlHTTP.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }

  xmlHTTP.open('POST','/get_sign_up', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());

}

make_change_password = function(token, changeoldpassword, changenewpassword, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_token", token);
  params.append("user_old_password", changeoldpassword);
  params.append("user_new_password", changenewpassword);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_change_password', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

make_sign_out = function(token, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_token", token);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      if(callback){
      return callback(this.responseText);
      }
    }
  }
  xmlHTTP.open('POST','/get_sign_out', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

make_get_user_data_by_token = function(token, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_token", token);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_get_user_data_by_token', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

make_get_user_data_by_email = function(email, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_email", email);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_get_user_data_by_email', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

make_post_message = function(token, message, email, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_email", email);
  params.append("user_token", token);
  params.append("user_message", message);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_post_message', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

make_get_user_messages_by_token = function(token, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_token", token);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_get_user_messages_by_token', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}

make_get_user_messages_by_email = function(token, email, callback){
  var xmlHTTP = new XMLHttpRequest();
  const params = new URLSearchParams(); //hemlig kod
  params.append("user_token", token);
  params.append("user_email", email);

  xmlHTTP.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      return callback(this.responseText);
    }
  }
  xmlHTTP.open('POST','/get_get_user_messages_by_email', true);
  xmlHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); //Hemlig kod
  xmlHTTP.send(params.toString());
}
