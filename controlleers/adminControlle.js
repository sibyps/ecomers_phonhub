const userdb = require("../model/model");
const product = require("../model/productmodel");
const brand = require("../model/brand");
const address = require("../model/address");
const cart = require("../model/cart");
const coupon = require("../model/coupon");
let mongoose = require("mongoose");
const fs = require("fs");
const order = require("../model/order");
const { ObjectId } = require("mongodb");
/* ---------------------------------- HOME ---------------------------------- */
exports.home = (req, res) => {
  if (req.session.adminid) {
    res.render("admin/index");
  } else {
    res.redirect("/admin/login");
  }
};
/* ------------------------------ VIEW BRAND ------------------------------ */
exports.brand = async (req, res) => {
  let brandview = await brand.find({});
  res.render("admin/brand", { brandview: brandview });
};
/* ---------------------------- ADDING BRAN POST ---------------------------- */
exports.brand_post = async (req, res) => {
  const files = req.files;
  const file = files.map((file) => {
    return file;
  });
  const fileName = file.map((file) => {
    return file.filename;
  });
  // console.log(fileName);
  const brands = new brand({
    brand: req.body.brand,
    image:fileName
  });
  await brands.save();

  res.redirect("/admin/brand");
};
/* ------------------------------- ADD PRODUCT ------------------------------ */
exports.add_product = async (req, res) => {
  let brandview = await brand.find({});
  res.render("admin/addProduct", { brandview: brandview });
};

/* ---------------------------- POST ADD PRODUCT ---------------------------- */

exports.post_add_product = async (req, res, next) => {

 const {productname,singlebrand,price,stock,offer,colors,os,primary,secondary,size,reslution,ram,internal,mah,watt,short,description}=req.body

    try {
      const files = req.files;
      const file = files.map((file) => {
        return file;
      });
      const fileName = file.map((file) => {
        return file.filename;
      });
      const products = {
        productname,singlebrand,price,stock,offer,colors,os,primary,secondary,size,reslution,ram,internal,mah,watt,short,description,
        image: fileName,
      };
      const response = await product.create(products);
      const savedProduct = await response.save();
      res.redirect("/admin/list_product");
    } catch (error) {
      console.log(error);
      next(error);
    }
  
};

/* ------------------------------ USER DETAILS ------------------------------ */
exports.user_details = (req, res) => {
  userdb.find({}).then((alluser) => {
    res.render("admin/userDetails", { alluser: alluser });
  });
};
/* ------------------------------ PRODUCT LIST ------------------------------ */
exports.product_list = (req, res) => {
  product.find().then((products) => {
    res.render("admin/listProduct", { products: products });
  });
};
/* ------------------------------ EDIT PRODUCT  RENDER AND FIND PRODUCT------------------------------ */
exports.edit_product = (req, res) => {
  product.find({ _id: req.params.id }).then((result) => {
    res.render("admin/editproduct", { result: result });
  });
};
/* -------------------------- FINDED PRODUCT UPDATE ------------------------- */
exports.update_edit_product = (req, res) => {
  // console.log(req.body);
  // console.log(req.params.id);
  product
    .findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    .then((result) => {
      // console.log("then")
      // console.log(result)
      res.redirect("/admin/list_product");
    })
    .catch((err) => {
      console.log(err);
    });
};
/* ------------------------------ DELET PRODUCT ----------------------------- */
exports.delet_product = async(req, res) => {
  
  await product.findById(req.params.id).then((result) => {
  
    for (let index = 0; index < result.image.length; index++) {
      const element = result.image[index];
   
      fs.unlink("public" + "/Products/" + element, (err) => {
        if (err) {
          console.log(err);
        } 
        else {

          //console.log ("deleted image of ")
        }
      });
    }
  }); 

  await product
    .deleteOne({_id:req.params.id})
    .then((result) => {
      res.redirect("/admin/list_product");
    })
    .catch((err) => console.log(err));
};

/* -------------------------- BLOCK USER ------------------------- */
exports.block_user = (req, res) => {
  return new Promise((resolve, rejecct) => {
    userdb
      .updateOne({ _id: req.params.id }, { $set: { state: false } })
      .then((data) => {
        resolve("blocked");
        res.redirect("/admin/user_details");
      });
  });
};

/* ------------------------------ UNBLOCK USER ------------------------------ */
exports.unblock_user = (req, res) => {
  return new Promise((resolve, rejecct) => {
    userdb
      .updateOne({ _id: req.params.id }, { $set: { state: true } })
      .then((data) => {
        resolve("un blocked");
        res.redirect("/admin/user_details");
      });
  });
};

/* ------------------------------- ORDER VIEW ------------------------------- */
exports.order_view = async (req, res) => {
  let orderdetails = await order.find({});
  // console.log(orderdetails);

  res.render("admin/ordersview", { orderdetails: orderdetails });
};

exports.order_status = async (req, res) => {
  // console.log(req.query.id);
  // console.log(req.query.status);
  let orderid = req.query.id;
  let stat = req.query.status;
  let statusupdate = await order.updateOne(
    { _id: orderid },
    { $set: { Status: stat } }
  );
  res.redirect("/admin/order_view");
};

/* ------------------------------ SALES REPORT ------------------------------ */
exports.sales_report = async (req, res) => {
  res.render("admin/salesreport");
};
/* ---------------------------- WEEK SALE REPORT ---------------------------- */
exports.week = async (req, res) => {
  //  console.log(req.body.userid);
  let vieworder = await order.aggregate([
    { $match: { Status: { $nin: ["Cancelled"] } } },
    { $unwind: "$Product" },
    {
      $project: {
        Date: 1,
        ItemId: "$Product.ItemId",
        Quantity: "$Product.Quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "ItemId",
        foreignField: "_id",
        as: "displaycheckout",
      },
    },
    { $unwind: "$displaycheckout" },
    {
      $project: {
        Date: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
        ItemId: 1,
        Quantity: 1,
        productname: "$displaycheckout.productname",
        price: "$displaycheckout.price",
      },
    },
    { $match: { Date: req.body.day } },
  ]);
  var subtotal = 0;
  for (let p = 0; p < vieworder.length; p++) {
    subtotal = subtotal + vieworder[p].price * vieworder[p].Quantity;
  }
  var quantity = 0;
  for (let p = 0; p < vieworder.length; p++) {
    quantity = quantity + vieworder[p].Quantity;
  }
  var length = 0;
  for (let p = 0; p < vieworder.length; p++) {
    length++;
  }

  //     console.log(length);
  //  console.log(vieworder);
  res.render("admin/week", {
    vieworder: vieworder,
    subtotal,
    quantity,
    length,
  });
};

/* ------------------------------- MONTH SALE REPORT------------------------------- */
exports.month = async (req, res) => {
  console.log(req.body.month);
  let vieworder = await order.aggregate([
    { $match: { Status: { $nin: ["Cancelled"] } } },
    { $unwind: "$Product" },
    {
      $project: {
        Date: 1,
        ItemId: "$Product.ItemId",
        Quantity: "$Product.Quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "ItemId",
        foreignField: "_id",
        as: "displaycheckout",
      },
    },
    { $unwind: "$displaycheckout" },
    {
      $project: {
        Date: { $dateToString: { format: "%Y-%m", date: "$Date" } },
        ItemId: 1,
        Quantity: 1,
        price: "$displaycheckout.price",
      },
    },
    { $match: { Date: req.body.month } }, 
  ]);

  var monthtotal = 0;
  for (let p = 0; p < vieworder.length; p++) {
    monthtotal = monthtotal + vieworder[p].price * vieworder[p].Quantity;
  }
  var monthquantity = 0;
  for (let p = 0; p < vieworder.length; p++) {
    monthquantity = monthquantity + vieworder[p].Quantity;
  }
  var monthlength = 0;
  for (let p = 0; p < vieworder.length; p++) {
    monthlength++;
  }

  res.render("admin/month", {
    vieworder: vieworder,
    monthlength,
    monthquantity,
    monthtotal,
  });
};
/* ---------------------------- YEAR SALES REPORT --------------------------- */
exports.year = async (req, res) => {
  // console.log(req.body);
  let vieworder = await order.aggregate([
    { $match: { Status: { $nin: ["Cancelled"] } } },
    { $unwind: "$Product" },
    {
      $project: {
        Date: 1,
        ItemId: "$Product.ItemId",
        Quantity: "$Product.Quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "ItemId",
        foreignField: "_id",
        as: "displaycheckout",
      },
    },
    { $unwind: "$displaycheckout" },
    {
      $project: {
        Date: { $dateToString: { format: "%Y", date: "$Date" } },
        ItemId: 1,
        Quantity: 1,
        price: "$displaycheckout.price",
      },
    },
    { $match: { Date: req.body.year } },
  ]);
  // console.log(vieworder);
  var yeartotal = 0;
  for (let p = 0; p < vieworder.length; p++) {
    yeartotal = yeartotal + vieworder[p].price * vieworder[p].Quantity;
  }
  var yearquantity = 0;
  for (let p = 0; p < vieworder.length; p++) {
    yearquantity = yearquantity + vieworder[p].Quantity;
  }
  var yearlength = 0;
  for (let p = 0; p < vieworder.length; p++) {
    yearlength++;
  }
  res.render("admin/year", {
    vieworder: vieworder,
    yearlength,
    yearquantity,
    yeartotal,
  });
};
/* ---------------------------------- CHART --------------------------------- */
exports.chart = async (req, res) => {
  console.log(req.body);
  if ((req.body.data = "daily")) {
    let dailychart = await order.aggregate([
      {
        $match: { Status: { $nin: ["Cancelled"] } },
      },
      {
        $project: {
          Date: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
          Total: 1,
        },
      },
      {
        $group: {
          _id: { Date: "$Date" },
          count: { $sum: 1 },
          total: { $sum: "$Total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // console.log(dailychart);
    const total = dailychart.map((item) => {
      return Math.floor(item.total);
    });
    const date = dailychart.map((item) => {
      return item._id.Date;
    });

    res.json({ total, date ,daily:true});
  }
  
};

/* ------------------------------- BRAND OFFER ------------------------------ */
exports.brand_offer = async (req, res) => {
  let brandview = await brand.find({});
  res.render("admin/brandoffer", { brandview: brandview });
};
/* ---------------------------------- COUPON --------------------------------- */
exports.coupon = async (req, res) => {
  let coupons = await coupon.find({});
  res.render("admin/coupon", { coupons: coupons });
};

/* ------------------------------- ADD COUPON ------------------------------- */
exports.add_coupon = (req, res) => {
  let { couponcode, discount, brand, expire, min, max } = req.body;
  expire = new Date(expire).toLocaleDateString("en-IN");
  // console.log(couponcode,discount,brand,expire);
  const couponSchema = new coupon({
    couponcode,
    discount,
    brand,
    expire,
    min,
    max,
  });
  couponSchema.save();
};

/* ----------------------------- ADD BRAND OFFER ---------------------------- */
exports.add_brand_offer = async (req, res) => {
  const { singlebrand, offer } = req.body;
  await product.updateMany({ brand: singlebrand }, { $set: { offer: offer } });
  res.redirect("/admin/brand_offer");
};

/* ---------------------------------- LOGIN --------------------------------- */
exports.login = (req, res) => {
  if (req.session.adminid) {
    res.redirect("/admin/home");
  } else {
    res.render("admin/login", { logginError: req.session.logginError });
    req.session.logginError = false;
  }
};
/* ------------------------------- LOGIN POST ------------------------------- */
const email = "sibyps2323@gmail.com";
const password = "12345";
exports.post_login = (req, res) => {
  // console.log(req.body)
  if (email == req.body.email && password == req.body.password) {
    req.session.adminid = true;
    res.redirect("/admin/home");
  } else {
    req.session.logginError = "invalid email or password";
    res.redirect("/admin/login");
  }
};

/* --------------------------------- LOG OUT -------------------------------- */
exports.log_out = (req, res) => {
  req.session.adminid = false;
  res.redirect("/admin/login");
};
