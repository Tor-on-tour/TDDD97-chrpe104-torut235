window.onload = function(){
  default_viewer();
};

 displayView = function(view){
   // the code required to display a view
   clientviewer = document.getElementById('clientviewer').innerHTML;
   document.getElementById("clientviewer").innerHTML = view;
};

default_viewer = function(){
  welcomeview  = document.getElementById('welcomeview').innerHTML;
  profileview  = document.getElementById('profileview').innerHTML;
  displayView(welcomeview);
  if(localStorage.getItem('token') === null || localStorage.getItem('token') === undefined || localStorage.getItem('token') === ''){
    displayView(welcomeview);
    //console.log("Welcomeview: " + localStorage.getItem('token'));
    document.getElementById('signup').onsubmit=signUpChecker;
    document.getElementById('login').onsubmit=signInChecker;
  }
  else if(localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined || localStorage.getItem('token') !== ''){
    displayView(profileview);
    document.getElementById('headerHome').style.backgroundColor = 'pink'
    document.getElementById('headerBrowse').style.backgroundColor = '#FEF1E0'
    document.getElementById('headerAccount').style.backgroundColor = '#FEF1E0'

    document.getElementById('panelHome').style.display = 'block'
    document.getElementById('panelBrowse').style.display = 'none'
    document.getElementById('panelAccount').style.display = 'none'

    document.getElementById('wallInputTextElement-h').onsubmit = addTextFuncHome;
    homeFunc();
  }
}

signUpChecker = function(e){welcomeview  = document.getElementById('welcomeview').innerHTML;
  e.preventDefault();

  welcomeview  = document.getElementById('welcomeview').innerHTML;
  minpwlength = 3;
  var pass1 = document.getElementById('signup-password').value;
  var pass2 = document.getElementById('signup-password-RE').value;
  var PWchecker = true;
  if (pass1 != pass2){
    PWchecker = false;
  }
  else if (pass1.length<minpwlength || pass2.length<minpwlength) {
    PWchecker = false;
  }

  var object = {

    email : document.getElementById('emailInput').value,
    password : document.getElementById('signup-password').value,
    firstname : document.getElementById('firstnameInput').value,
    familyname : document.getElementById('familynameInput').value,
    gender : document.getElementById('genderInput').value,
    city : document.getElementById('cityInput').value,
    country : document.getElementById('countryInput').value

  };

  make_sign_up(object, function(response){
    console.log("make_sign_up: " + response)
  });

  if(PWchecker){
    console.log("ok");
    document.getElementById('pwMessage').style.display = 'block'
    document.getElementById('pwMessage').style.color = 'yellow'
    document.getElementById('pwMessage').innerHTML = "<span></span>"
    document.getElementById('pwMessage').innerHTML = "<span>Successfully signed up</span>"
  }
  else if(!PWchecker){
    console.log("nok");
    document.getElementById('pwMessage').style.color = 'red'
    document.getElementById('pwMessage').style.display = 'block'
    document.getElementById('pwMessage').innerHTML = "<span></span>"
    document.getElementById('pwMessage').innerHTML = "<span>Horrible pw</span>"
  }
}

//validate email, decide view
signInChecker = function(e){
  e.preventDefault();
  profileview  = document.getElementById('profileview').innerHTML;
  welcomeview  = document.getElementById('welcomeview').innerHTML;

  var username = document.getElementById('loginUsername').value;
  var password = document.getElementById('loginPassword').value;

/* skitprints
//console.log("sign in message : " + JSON.parse(response).message);
//console.log("make_sign_in_socket(token) : " + make_sign_in_socket(token));
//console.log("make_sign_in_socket(token) : " + make_sign_in_socket(token));
//console.log("make_sign_in_socket(token).success : " + make_sign_in_socket(token).success);
//console.log("response: " + response);
*/

  make_sign_in(username, password, function(response){
    //console.log("0 make_sign_in i client.js");      //maste vara oppen for att allt sker asynkront
    validated = JSON.parse(response).success;
    token = JSON.parse(response).data;


  if(validated === true){
    localStorage.setItem('token', token);
    make_sign_in_socket(token, function(response2){
      //console.log("5 make_sign_in_socket i client.js");
      //if(JSON.parse(response2)){
        //signOutFunc();
        //}
      });
      //  signInChecker();
    default_viewer();
  }
  else if(validated === false){
                //Refreshar sidan om fel password
    default_viewer();
    document.getElementById('loginMessage').style.color = 'red'
    document.getElementById('loginMessage').innerHTML = "<span></span>"
    document.getElementById('loginMessage').innerHTML = "<span>Horrible</span>"
    document.getElementById('loginMessage').style.display = 'block'
  }
});
}



headerfunc = function(headerID){
  var panelClicked = document.getElementById('headerID');

  switch (headerID) {
    case panelHome:

      document.getElementById('headerHome').style.backgroundColor = 'pink'
      document.getElementById('headerBrowse').style.backgroundColor = '#FEF1E0'
      document.getElementById('headerAccount').style.backgroundColor = '#FEF1E0'

      document.getElementById('panelHome').style.display = 'block'
      document.getElementById('panelBrowse').style.display = 'none'
      document.getElementById('panelAccount').style.display = 'none'

      homeFunc();
      document.getElementById('wallInputTextElement-h').onsubmit = addTextFuncHome;

      return;
    case panelBrowse:

      document.getElementById('headerBrowse').style.backgroundColor = 'pink'
      document.getElementById('headerHome').style.backgroundColor = '#FEF1E0'
      document.getElementById('headerAccount').style.backgroundColor = '#FEF1E0'

      document.getElementById('panelHome').style.display = 'none'
      document.getElementById('panelBrowse').style.display = 'block'
      document.getElementById('panelAccount').style.display = 'none'

      document.getElementById('searchUser').onsubmit = searchUserFunc;
      document.getElementById('wallInputTextElement-b').onsubmit = addTextFuncBrowse;

      return;
    case panelAccount:

      document.getElementById('headerAccount').style.backgroundColor = 'pink'
      document.getElementById('headerHome').style.backgroundColor = '#FEF1E0'
      document.getElementById('headerBrowse').style.backgroundColor = '#FEF1E0'

      document.getElementById('panelHome').style.display = 'none'
      document.getElementById('panelBrowse').style.display = 'none'
      document.getElementById('panelAccount').style.display = 'block'

      document.getElementById('changePasswordElement').onsubmit=changeOldPassword;

      return;
    default:

    document.getElementById('panelHome').style.display = 'none'
    document.getElementById('panelBrowse').style.display = 'none'
    document.getElementById('panelAccount').style.display = 'none'
  }
}


changeOldPassword = function(e){
  e.preventDefault();
  console.log("Inne i changeoldpassword");
  var changeoldpassword = document.getElementById('change-old-password').value;
  var changenewpassword = document.getElementById('change-new-password').value;
  if (changenewpassword.length > 2){
    var token = localStorage.getItem('token');
    make_change_password(token, changeoldpassword, changenewpassword, function(response){
      if(JSON.parse(response).success === true){
        document.getElementById('changePwMessage').innerHTML = "<span></span>"
        document.getElementById('changePwMessage').style.color = 'green'
        document.getElementById('changePwMessage').innerHTML = "<span>Ok</span>"
        document.getElementById('changePwMessage').style.display = 'block'
        return;
      }
      if(JSON.parse(response).success === false){
        document.getElementById('changePwMessage').style.color = 'red'
        document.getElementById('changePwMessage').innerHTML = "<span></span>"
        document.getElementById('changePwMessage').innerHTML = "<span>Horrible pw</span>"
        document.getElementById('changePwMessage').style.display = 'block'
        return;
      }
    });
  }
}

signOutFunc = function(){
  make_sign_out(localStorage.getItem('token'), function(response){
    localStorage.removeItem('token');
    //localStorage.removeItem('loggedinusers[token]'); //Vafan gör den här?
    default_viewer();
  });
}

homeFunc = function(){
  make_get_user_data_by_token(localStorage.getItem('token'), function(response){
    //console.log("homeFunc token i client: " + token)
    data = JSON.parse(response);
    document.getElementById('PIName').innerHTML = data.data.firstname;
    document.getElementById('PILastname').innerHTML = data.data.familyname;
    document.getElementById('PICity').innerHTML = data.data.city;
    document.getElementById('PIGender').innerHTML = data.data.gender;
    document.getElementById('PIcountry').innerHTML = data.data.country;
    document.getElementById('PIEmail').innerHTML = data.data.email;
    });
}

getSortedKeys = function(obj){
    var keys = [];
    for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){
      var d1 = new Date(obj[a].msg_timestamp);
      console.log("d1: " + d1);
      var d2 = new Date(obj[b].msg_timestamp);
      console.log("d2: " + d2);
      return d2.getTime()-d1.getTime();
    });
}


searchUserFunc = function(){
    var userToFind = document.getElementById('userToFind').value;
    var token = localStorage.getItem('token');
    make_get_user_data_by_email(userToFind, function(response){
      data = JSON.parse(response);
      document.getElementById('PIName-b').innerHTML = data.data.firstname;
      document.getElementById('PILastname-b').innerHTML = data.data.familyname;
      document.getElementById('PICity-b').innerHTML = data.data.city;
      document.getElementById('PIGender-b').innerHTML = data.data.gender;
      document.getElementById('PIcountry-b').innerHTML = data.data.country;
      document.getElementById('PIEmail-b').innerHTML = data.data.email;
    });
}

addTextFuncHome = function(e){
  e.preventDefault();
  var textToAdd = document.getElementById('wallInputText-h').value; //Get textToAdd paramiter in third function
  var token = localStorage.getItem('token');

  make_get_user_data_by_token(token, function(response){      //Get email by token, await respons and use in function below it
    var email = JSON.parse(response).data.email;

    make_post_message(token,textToAdd, email,function(response_2){
      if (JSON.parse(response_2).success === true){
          make_get_user_messages_by_token(token, function(response_3){
            var respons_3 = JSON.parse(response_3);
            var messages = respons_3.data;
            document.getElementById('wall-h').innerHTML = "<span></span>"
            var keys = getSortedKeys(messages);
              for (var i=0; i<keys.length; i++){
                var k = keys[i];
                document.getElementById('wall-h').innerHTML += "<span></br>" + messages[k].from_email + " said : " + messages[k].content + "</span></br></br>";
              }
          });
      }
    });
  })
}

addTextFuncBrowse = function(e){
  e.preventDefault();
  var userToFind = document.getElementById('userToFind').value;
  var textToAdd = document.getElementById('wallInputText-b').value;
  var token = localStorage.getItem('token');
  console.log("0");
  if( userToFind !== ''){
    make_get_user_data_by_email(userToFind, function(response){
      console.log("1");
      if (JSON.parse(response).success){
        make_post_message(token, textToAdd , userToFind, function(response2){
          console.log("2");
          if (JSON.parse(response2).success){
            make_get_user_messages_by_email(token, userToFind,function(response3){
              console.log("3 UserToFind: " + userToFind);
              var messages = JSON.parse(response3).data;
              document.getElementById('wall-b').innerHTML = "<span></span>"
              var keys = getSortedKeys(messages);
              for (var i=0; i<keys.length; i++){
                var k = keys[i];
                document.getElementById('wall-b').innerHTML += "<span></br>" + messages[k].from_email + " said : " + messages[k].content + "</span></br></br>";
              }
            });
          }
        });
      }
    });
  }
}

refreshWall_h = function(){
  var token = localStorage.getItem('token');    //detta maste andras
  make_get_user_messages_by_token(token, function(response){
    var response = JSON.parse(response);
    var messages = response.data;
    if(response.success === true){
      for (key in messages){
        document.getElementById('wall-h').innerHTML += "<span></br>" + messages[key].from_email + " said : " + messages[key].content + "</span></br></br>";
      }
    }
    else{
      console.log(response.success);
    }
  });
}

refreshWall_b = function(){
  var token = localStorage.getItem('token');    //detta maste andras
  var userToFind = document.getElementById('userToFind').value;
  make_get_user_messages_by_email(token, userToFind, function(response){
    var response = JSON.parse(response);
    var messages = response.data;
    if(response.success === true){
      for (key in messages){
        document.getElementById('wall-h').innerHTML += "<span></br>" + messages[key].from_email + " said : " + messages[key].content + "</span></br></br>";
      }
    }
    else{
      console.log(response.success);
    }
  });
}
