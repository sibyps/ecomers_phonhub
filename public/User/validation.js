/* --------------------------------- SIGNIN --------------------------------- */
function validateForm() {
  if (!validemail() || !validpasword()) {
    loginerror.style.display = "block";
    alert("please fill correctly");
    setTimeout(function () {
      loginerror.style.display = "none";
    }, 3000);
    return false;
  }
}

function validemail() {
  let email = document.myform.email.value;
  let erroremail = document.getElementById("email-error");

  if (email.length == 0) {
    erroremail.innerHTML = "Email reqired";
    return false;
  }
  if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    erroremail.innerHTML = "Email Invalid";
    return false;
  }

  erroremail.innerHTML =
    '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
  return true;
}

function validpasword() {
  let password = document.myform.password.value;

  let errorpasword = document.getElementById("password-error");

  if (password.length == 0) {
    errorpasword.innerHTML = "pasword reqired";
    return false;
  }
  if (password.length < 5) {
    errorpasword.innerHTML = "min 5 charecter required";
    return false;
  }
  errorpasword.innerHTML =
    '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
  return true;
}

/* --------------------------------- SIGNUP --------------------------------- */

function forms() {
  if (
    !nameval() ||
    !mobileval() ||
    ! emailval() ||
    !passwordvali()
  ) {
    signuperror.style.display = "block";
    alert("please fill correctly");
    setTimeout(function () {
      signuprror.style.display = "none";
    }, 3000);
    return false;
  }
}

function nameval() {
  const first = document.signupform.firstname.value;
  const error = document.getElementById("1sterror");
  error.innerHTML = "";
  if (first == null || first == "") {
    error.innerHTML = "name required";
    return false;
  } else {
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }
}

function mobileval() {
  const mobile = document.signupform.mobile.value;
  const error = document.getElementById("mobileerror");

  if (!mobile.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
    error.innerHTML = "invalied mobile no";
    return false;
  }
  error.innerHTML =
    '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
  return true;
}

function emailval() {
  const email = document.signupform.email.value;
  const error = document.getElementById("emailerror");

  if (email.length == 0) {
    error.innerHTML = "Email reqired";
    return false;
  }
  if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    error.innerHTML = "Email Invalid";
    return false;
  } else {
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }
}

function passwordvali() {
  const password = document.signupform.password.value;

  const error = document.getElementById("error");

  if (password.length == 0) {
    error.innerHTML = "pasword reqired";
    return false;
  }
  if (password.length < 5) {
    error.innerHTML = "min 5 charecter required";
    return false;
  } else {
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }
}

/* ----------------------------------- OTP LOGIN ---------------------------------- */

function otpvalid() {
  const otp = document.myform.otp.value;
  const error = document.getElementById("mobileerror");
  if (!otp.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
    error.innerHTML = "invalied mobile no";
    return false;
  } else {
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }
} 
function formotp() {
  if (!otpvalid()) {
    otperror.style.display = "block";
    alert("please fill correctly");
    setTimeout(function () {
      otperror.style.display = "none";
    }, 3000);
    return false;
  }
}

/* ------------------------------- OTP VERIFY ------------------------------- */

function otpVerify() {
  const otp = document.myform.code.value;
  const error = document.getElementById("verifyerror");
  if (!otp.match(/^[0-9][0-9][0-9][0-9][0-9][0-9]$/)) {
    error.innerHTML = "invalied otp no";
    return false;
  } else {
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }
}
function formVerify() {
  if (!otpVerify()) {
    otperror.style.display = "block";
    alert("please fill correctly");
    setTimeout(function () {
      otperror.style.display = "none";
    }, 3000);
    return false;
  }
}
