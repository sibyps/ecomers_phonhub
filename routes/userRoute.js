const express =require("express")
const route=express.Router()


const controller =require("../controlleers/userControlle")


/* -------------------------------- USER HOME ------------------------------- */
route.get('/home',controller.home)

/* ------------------------------- USER LOGIN ------------------------------- */
route.get('/login',controller.login)
route.post('/login',controller.signin)
/* ------------------------------- USER SIGNUP ------------------------------ */
route.get('/signup',controller.register)
route.post('/signup',controller.signup)
/* -------------------------------- USER OTP LOGIN -------------------------------- */
route.get('/otp_login',controller.otplogin)
route.post('/otp_login',controller.otpLogin)
/* ---------------------------- USER OTP VEREIFY ---------------------------- */
route.get('/otp_verify',controller.otp_verify)
route.post('/otp_verify',controller.otp_Verify)
/* --------------------------------- LOG OUT -------------------------------- */
route.get('/logout',controller.user_logout)
/* ---------------------------- PRODUCT CATEGORY ---------------------------- */
route.get('/product_list',controller.product_list)

/* ----------------------------- SINGLE PRODUCT ----------------------------- */
route.get('/single_product/:id',controller.single_product)
/* ---------------------------------- CART ---------------------------------- */
route.get('/cart_post/:id',controller.cart_post)
route.get('/view_cart',controller.view_cart)
route.get('/remove_cart:id',controller.remove_cart)
route.post('/quantity_cart',controller.quantity_cart)
/* ------------------------------- MY ACCOUNT ------------------------------- */
route.get('/my_acc',controller.my_acc)
/* ------------------------------- ADD ADRESS ------------------------------- */
route.get('/edit_address:id',controller.edit_find_address)
route.post('/post_edit_address:id',controller.post_edit_address)
route.get('/add_address',controller.add_address)
route.post('/add_address_post',controller.add_address_post)
route.get('/delete:id',controller.delete_address)
/* -------------------------------- CHECKOUT -------------------------------- */
route.get('/view_checkout',controller.view_checkout)

/* ---------------------------------- ORDER --------------------------------- */
route.post('/order',controller.orders)
route.get('/success',controller.success)
route.post('/verify_payment',controller. verify_payment)
route.get('/view_order',controller.view_order)
route.get('/orderd_address',controller.orderd_product)
route.get('/order_status',controller.order_status)
/* -------------------------------- WISHLIST -------------------------------- */
route.get('/wish_list',controller.wish_list)
route.post('/wish_list_post',controller.wish_list_post)
/* --------------------------------- COUPON --------------------------------- */
route.post('/coupon',controller.post_coupon)
/* --------------------------------- WALLET --------------------------------- */
route.get('/return',controller.Return)
/* --------------------------------- PAYPAL --------------------------------- */
route.get('/paypal_verify_payment',controller.paypal_verify_payment)
module.exports=route