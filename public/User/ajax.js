const { response } = require("express");



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
    // alert("payment")
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
      // console.log(response);
      // alert("razorpay")
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
  success:(response)=>{
    if(response.result || response.added){
      Swal.fire(
        'Good job!',
        'Added To Wishlist!',
        'success'
      )
    }else if(response.removed){
      Swal.fire(
        'Good job!',
        'Removed From Wishlist!',
        'success'
      )
    }else if(response.nouser){
      location.href="/login"
    }
  }
 })
}



function couponform(){

  $.ajax({
    url:"/coupon",
    method:"post", 
    data: $("#couponform").serialize(),
   success:(response)=>{
    if(response.nocupon){
      // alert("no coupon")
      Swal.fire(
        'Invalid Coupon!',
        '',
        'error'
      )
    }else if(response.expired){
    // alert("expired")
    Swal.fire(
      'Expired Coupon!',
      '',
      'error'
    )

    }else if(response.amount){
      Swal.fire(
        'You cant apply it!',
        '',
        'error'
      )

    }else{
      let total=response.afterdiscount.toFixed(2)
     let discount=response.coupondiscount
     let befordiscount=response.total
     document.getElementById("totalprice").innerText=Math.floor(total).toFixed(2)
     document.getElementById("totaldiscountprice").value=Math.floor(total).toFixed(2)
     if(discount&&befordiscount){
      Swal.fire(
        'Coupon Added',
    '',
    'success'
      )
       document.getElementById("discount").innerText= discount+" % "
       document.getElementById("offer").innerText= "Coupon Offer"
       document.getElementById("total").innerText= "Sub Total"
       document.getElementById("befordiscount").innerText=Math.floor(befordiscount).toFixed(2) 
     }
    }
   }
  })
}

function hello(){

  Swal.fire(
    'Good job!',
    'You clicked the button!',
    'success'
  )
}



function addtocart(proid) {

  $.ajax({
    url: "/cart_post",
    data: {
      proid: proid,
     
    },
    method: "post",
    success:function (response) {
      if(response.result){

        Swal.fire(
          'Good job!',
          'Add To Cart!',
          'success'
        )
      }
      else if(response.data){
        location.href="/view_cart"
      }else if(response.push){
        Swal.fire(
          'Good job!',
          'Add To Cart!',
          'success'
        )
      }else if(response.nouser){
        location.href="/login"
      }
    }
  });
}

function removewishlist(proid) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/remove_wishlist",
        data: {
          proid: proid,
         
        },
        method: "delete",
        success:async function (response) {
          if(response.wishlistremoved){
             
           await Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            window.location.reload()
          }
        }
      });
     
    }
  })
 
}