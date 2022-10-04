/* --------------------------------- SIGNIN --------------------------------- */
function Formvalid() {
    if (!mail() || !pasword()) {
      adminloginerror.style.display = "block";
      alert("please fill correctly");
      setTimeout(function () {
        adminloginerror.style.display = "none";
      }, 3000);
      return false;
    }
  }
  
  function mail() {
    let email = document.admin.admin_email.value;
    let error = document.getElementById("ema-error");
  
    if (email.length == 0) {
      error.innerHTML = "Email reqired";
      return false;
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      error.innerHTML = "Email Invalid";
      return false;
    }
  
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }
  
  function pasword() {
    let password = document.admin.admin_password.value;
  
    let error = document.getElementById("pass-error");
  
    if (password.length == 0) {
      error.innerHTML = "pasword reqired";
      return false;
    }
    if (password.length < 5) {
      error.innerHTML = "min 5 charecter required";
      return false;
    }
    error.innerHTML =
      '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true;
  }