const express=require("express")
const route=express.Router()
const controller =require('../controlleers/adminControlle')
const upload = require("../helpers/multer")
const multer = require('multer')
const bodyParser = require('body-parser');
const { compare } = require("bcrypt")
var jsonParser = bodyParser.json();

/* ---------------------------------- HOME ---------------------------------- */
route.get('/home',controller.home)

/* ---------------------------------- LOGIN --------------------------------- */
route.get('/login',controller.login)
route.post('/login_post',controller.post_login)

/* ------------------------------- ADD PRODUCT ------------------------------ */
route.get('/add_product',controller.add_product)
route.post('/add_product',upload.array('image'),controller.post_add_product)

/* ------------------------------ USER DETAILS ------------------------------ */
route.get('/user_details',controller.user_details)

/* ------------------------------ LIST PRODUCTS ----------------------------- */
route.get('/list_product',controller.product_list)

/* ------------------------------ PRODUCT EDIT ------------------------------ */
route.get('/edit_product:id',controller.edit_product)
route.post('/edit_product:id',multer().none(),controller.update_edit_product)
/* ---------------------------------- BRAND --------------------------------- */
route.get('/brand',controller.brand)
route.post('/brand_post',upload.array('image'),controller.brand_post)

/* ----------------------------- PRODUCT DELETE ----------------------------- */

route.get('/delete_product:id',controller.delet_product)

/* ---------------------------- BLOCK  ---------------------------- */
route.get('/block_user:id',controller.block_user)
/* ---------------------------- UNBLOCK  ---------------------------- */
route.get('/unblock_user:id',controller.unblock_user)


/* --------------------------------- LOGOUT --------------------------------- */
route.get('/log_out',controller.log_out)

/* ------------------------------- ORDER VIEW ------------------------------- */
route.get('/order_view',controller.order_view)

/* --------------------------------- STATUS --------------------------------- */
route.get('/order_status',controller.order_status)

/* ------------------------------ SALES REPORT ------------------------------ */
route.get('/sales_report',controller.sales_report)
route.post('/week',controller.week)
route.post('/month',controller.month)
route.post('/year',controller.year)
/* ---------------------------------- OFFER --------------------------------- */
route.get('/brand_offer',controller.brand_offer)
route.post('/add_brand_offer',controller.add_brand_offer)
/* ---------------------------------- COUPON --------------------------------- */
route.get("/coupon",controller.coupon)
route.post("/add_coupon",controller.add_coupon)
/* ---------------------------------- CHART --------------------------------- */
route.post("/chart",controller.chart)
/* ---------------------------- SINGLE ORDER VIEW --------------------------- */
route.get("/single_order",controller.single_order)
/* --------------------------------- BANNER --------------------------------- */
route.get("/banner",controller.banner)
route.post("/banner_post",upload.array('image'),controller.banner_post)
module.exports=route 