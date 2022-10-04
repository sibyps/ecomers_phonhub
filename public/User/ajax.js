

function changequantity(cartid, proid, userid, quantity, count) {
   
  $.ajax({
    url: "/quantity_cart",
    data: {
      cartid: cartid,
      proid: proid,
      count: count,
      userid: userid,
      quantity: quantity,
    },
    method: "post",
    success: (response) => {
      if (response == false) {
        location.reload();
      } else {
        location.reload();
      }
    },
  });
}


  $("#orderform").submit(function(e) {
    alert("payment")
    e.preventDefault();
    $.ajax({
      url:"/order",
      method:"post", 
      data: $("#orderform").serialize(),
      success:(response)=>{
     if(response.cod){
     location.href="/success"
     }else if(response.wallet){
      location.href="/success"
     }else if(response.nowallet){
      document.getElementById("walleterror").style.visibility="visible"
    }else if(response.paypal){
         location.href=response.link
    }
     else if(response.razorpay){
      console.log(response);
      alert("razorpay")
      razorpaypayment(response.order)
     }
      }
    })
 })

function razorpaypayment(orderdetails){

var options = {
    "key": "rzp_test_2K9SdAIFwX6nuL", // Enter the Key ID generated from the Dashboard
    "amount": orderdetails.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": orderdetails.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    "handler":function (response){
      // console.log(response);
      verifypayment(response,orderdetails)
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.open();
}

function verifypayment(payment,order){
  $.ajax({
    url:"/verify_payment",
    data:{
      payment,
      order
    },
    method:"post",
    success:(response)=>{
      if(response.success){
        location.href="/success"
      }
    }
  })
}




function wishlist(proid){

 $.ajax({
  url:'/wish_list_post',
  data:{
    proid
  },
  method:"post",
 })
}



function couponform(){

  $.ajax({
    url:"/coupon",
    method:"post", 
    data: $("#couponform").serialize(),
   success:(response)=>{
    if(response.nocupon){
      alert("no coupon")
      document.getElementById("couponinvalied").style.visibility="visible"
    }else if(response.expired){
    alert("expired")
    document.getElementById("couponexpired").style.visibility="visible"
    }else if(response.amount){
      document.getElementById("couponamount").style.visibility="visible"
    }else{
      let total=response.afterdiscount.toFixed(2)
     
     document.getElementById("totalprice").innerText=total
     document.getElementById("totaldiscountprice").value=total
    }
   }
  })
}

