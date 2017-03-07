displayView = function(view){
   // the code required to display a view
   document.getElementById("clientviewer").innerHTML = view;
};

window.onload = function(){
    welcomeview  = document.getElementById('welcomeview').innerHTML;
    profileview  = document.getElementById('profileview').innerHTML;
    displayView(welcomeview);

    if(localStorage.getItem('token') === null || localStorage.getItem('token') === undefined){
      displayView(welcomeview);
      console.log("Welcomeview: " + localStorage.getItem('token'));
      document.getElementById('signup').onsubmit=signUpChecker;
      document.getElementById('login').onsubmit=signInChecker;

    }
    else if(localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined ){
      displayView(profileview);
    }


    // sa att sidan inte laddas om
//code that is executed as the page is loaded.
//You shall put your own custom code here.
//window.alert() is not allowed to be used in your implementation.
};

signUpChecker = function(e){
    welcomeview  = document.getElementById('welcomeview').innerHTML;
    welcomeview  = document.getElementById('welcomeview').innerHTML;

  e.preventDefault();
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

  serverstub.signUp(object);

  if(PWchecker){
    console.log("ok");
    document.getElementById('pwMessage').style.display = 'block'
    document.getElementById('pwMessage').style.color = 'green'
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


validateSignin = function(){
  var username = document.getElementById('loginUsername').value;
  var password = document.getElementById('loginPassword').value;
  var validated = serverstub.signIn(username, password).success;

  var message = serverstub.signIn(username, password).message;
  console.log("validateSignin: " + message);

  return validated
}

//validate email
signInChecker = function(e){
  e.preventDefault();
//decide view
  profileview  = document.getElementById('profileview').innerHTML;
  welcomeview  = document.getElementById('welcomeview').innerHTML;

  var username = document.getElementById('loginUsername').value;
  var password = document.getElementById('loginPassword').value;


  if(validateSignin()){
    var token = serverstub.signIn(username, password).data;
    localStorage.setItem('token', token);

    console.log("Init toktoken: " + localStorage.getItem('token'));

    displayView(profileview);
    headerfunc(panelHome);
  }

  else if(!validateSignin()){
    displayView(welcomeview);
    document.getElementById('loginMessage').style.color = 'red'
    document.getElementById('loginMessage').innerHTML = "<span></span>"
    document.getElementById('loginMessage').innerHTML = "<span>Horrible</span>"
    document.getElementById('loginMessage').style.display = 'block'
  }

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
  var changeoldpassword = document.getElementById('change-old-password').value;
  var changenewpassword = document.getElementById('change-new-password').value;
  if (changenewpassword.length > 2){
    var token = localStorage.getItem('token');
    if(serverstub.changePassword(token, changeoldpassword, changenewpassword).success === true){
      document.getElementById('changePwMessage').innerHTML = "<span></span>"
      document.getElementById('changePwMessage').style.color = 'green'
      document.getElementById('changePwMessage').innerHTML = "<span>Ok</span>"
      document.getElementById('changePwMessage').style.display = 'block'
      return;
    }
  }

  if(serverstub.changePassword(token, changeoldpassword, changenewpassword).success === false) {
    document.getElementById('changePwMessage').style.color = 'red'
    document.getElementById('changePwMessage').innerHTML = "<span></span>"
    document.getElementById('changePwMessage').innerHTML = "<span>Horrible pw</span>"
    document.getElementById('changePwMessage').style.display = 'block'
  }
}

signOutFunc = function(){
  serverstub.signOut(localStorage.getItem('token'));
  localStorage.removeItem('token');
  localStorage.removeItem('loggedinusers'); //Vafan gör den här?
  console.log("Token after signout: " + localStorage.getItem('token'));
  displayView(welcomeview);
  document.getElementById('signup').onsubmit=signUpChecker;
  document.getElementById('login').onsubmit=signInChecker;

}
homeFunc = function(){
  var data = serverstub.getUserDataByToken(localStorage.getItem('token'));
  document.getElementById('PIName').innerHTML = data.data.firstname;
  //document.getElementById('PIName').innerHTML = data.firstname;
  document.getElementById('PILastname').innerHTML = data.data.familyname;
  document.getElementById('PICity').innerHTML = data.data.city;
  document.getElementById('PIGender').innerHTML = data.data.gender;
  document.getElementById('PIcountry').innerHTML = data.data.country;
  document.getElementById('PIEmail').innerHTML = data.data.email;
  //console.log("homefunc object: " + serverstub.getUserDataByToken(localStorage.getItem('token')));
}



searchUserFunc = function(){
    var userToFind = document.getElementById('userToFind').value;
    var userData = serverstub.getUserDataByEmail(localStorage.getItem('token'), userToFind)

    document.getElementById('PIName-b').innerHTML = userData.data.firstname;
    document.getElementById('PILastname-b').innerHTML = userData.data.familyname;
    document.getElementById('PICity-b').innerHTML = userData.data.city;
    document.getElementById('PIGender-b').innerHTML = userData.data.gender;
    document.getElementById('PIcountry-b').innerHTML = userData.data.country;
    document.getElementById('PIEmail-b').innerHTML = userData.data.email;

}

addTextFuncHome = function(e){
  e.preventDefault();
  var textToAdd = document.getElementById('wallInputText-h').value;
  var email = serverstub.getUserDataByToken(localStorage.getItem('token')).data.email;
  var token = localStorage.getItem('token');
  //document.getElementById('wall-h').innerHTML += "<span></br>" + textToAdd + "</span></br></br>";
  serverstub.postMessage(token,textToAdd, email);
  if(serverstub.getUserMessagesByToken(token).success === true) {
    var messages = serverstub.getUserMessagesByToken(token).data;
    document.getElementById('wall-h').innerHTML = "<span></span>"
    for (var i=0; i<messages.length; i++) {
      document.getElementById('wall-h').innerHTML += "<span></br>" + (messages[i].writer + " said : " + messages[i].content) + "</span></br></br>";
      //console.log("message: " + messages[i]);
    }
  }
}

addTextFuncBrowse = function(e){
  e.preventDefault();
  var userToFind = document.getElementById('userToFind').value;
  var textToAdd = document.getElementById('wallInputText-b').value;
  var token = localStorage.getItem('token')
  serverstub.postMessage(token, textToAdd , userToFind);
  if(serverstub.getUserMessagesByEmail(token, userToFind).success === true) {
    var messages = serverstub.getUserMessagesByEmail(token, userToFind).data;
    console.log("Usermessagesbyemail: " + serverstub.getUserMessagesByEmail(token, userToFind));
    console.log("userTofind: " + userToFind);
    console.log("textToAdd: " + textToAdd);
    console.log('token: ' + token);
    document.getElementById('wall-b').innerHTML = "<span></span>"
    for (var i=0; i<messages.length; i++) {
      document.getElementById('wall-b').innerHTML += "<span></br>" + (messages[i].writer + " said : " + messages[i].content) + "</span></br></br>";
    }
  }
  else{
    console.log(serverstub.getUserMessagesByEmail(token, userToFind).message);
  }

}


refreshWall_h = function(e){
  e.preventDefault();
  var token = localStorage.getItem('token');
  if(serverstub.getUserMessagesByToken(token).success === true) {
    var messages = serverstub.getUserMessagesByToken(token).data;
    document.getElementById('wall-h').innerHTML = "<span></span>"
    for (var i=0; i<messages.length; i++) {
      document.getElementById('wall-h').innerHTML += "<span></br>" + (messages[i].writer + " said : " + messages[i].content) + "</span></br></br>";}
  }
  else{
    console.log(serverstub.getUserMessagesByToken(token).message);
  }
}

refreshWall_b = function(e){
  e.preventDefault();
  var userToFind = document.getElementById('userToFind').value;
  var token = localStorage.getItem('token');
  if(serverstub.getUserMessagesByEmail(token, userToFind).success === true) {
    var messages = serverstub.getUserMessagesByEmail(token, userToFind).data;
    document.getElementById('wall-b').innerHTML = "<span></span>"
    for (var i=0; i<messages.length; i++) {
      document.getElementById('wall-b').innerHTML += "<span></br>" + (messages[i].writer + " said : " + messages[i].content) + "</span></br></br>";
    }
  }
  else{
    console.log(serverstub.getUserMessagesByEmail(token, userToFind).message);
  }
}
