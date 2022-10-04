let userdb = require("../model/model");
let product = require("../model/productmodel");
let address = require("../model/address");
let order = require("../model/order");
let cart = require("../model/cart");
let coupon = require("../model/coupon");
let brand = require("../model/brand");
let wish = require("../model/wishlist");
let wallet = require("../model/wallet");
const bcrypt = require("bcrypt");
let ObjectId = require("mongodb").ObjectId;
const paypal = require("paypal-rest-sdk");
const Razorpay = require("razorpay");
const { CallContext } = require("twilio/lib/rest/api/v2010/account/call");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AQtXEzy50DqeDU1yDwtDI59pp_kRkZiNuPKSroPEAo4ScNcxeCljeEPLaZzQJ__TKp-6e1FIJQXuqC9d",
  client_secret:
    "EJwuqF1orW57SQPywHLCt7MQYehIGro-kTns-_-zDbjj7_OiuQjWapDNsgHH-bdJgqwVG9u8Fafirfle",
});
var instance = new Razorpay({
  key_id: "rzp_test_2K9SdAIFwX6nuL",
  key_secret: "t06E7KjAbsb4Lr3WjviL6R1f",
});

const client = require("twilio")(
  "AC8e38338c7475b03886103c406d5f3dea",
  "3de5e2777daf64591b9bba6531f0e9a5"
);

/* -------------------------------- USER HOME ------------------------------- */
const home =async (req, res) => {
  let brands=await brand.find({})

 await userdb
    .findOne({ _id: req.session.user })
    .then((user) => {
      if (user && user.state) {
        res.render("user/index-4", { user: user,brands:brands});
      } else {
        req.session.user = null;
        res.render("user/index-4", { user: user,brands:brands});
      }
    })
    .catch((err) => console.log(err));
};

/* ------------------------------- USER SIGNUP ------------------------------ */
const register = (req, res) => {
  res.render("user/signup", { signupError: req.session.signupError });
  req.session.signupError = false;
};
/* ---------------------------- USER POST SIGNUP ---------------------------- */
const signup = (req, res) => {
  if (
    !req.body.firstname ||
    !req.body.mobile ||
    !req.body.email ||
    !req.body.password
  ) {
    req.session.signupError = "content not be empty";
    res.redirect("/signup");
  }
  userdb
    .findOne({ email: req.body.email })
    .then((found) => {
      if (found) {
        req.session.signupError = "user alredy exist";
        res.redirect("/signup");
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            const user = new userdb({
              firstname: req.body.firstname,
              mobile: req.body.mobile,
              email: req.body.email,
              password: hash,
              state: true,
            });
            user
              .save(user)

              .then((data) => {
                req.session.user = user._id;
                let bounus = 1;
                const walletschema = new wallet({
                  UserId: req.session.user,
                  Balance: bounus,
                });
                walletschema.save();
                res.redirect("/");
                // console.log(data);
              })
              .catch((err) => {
                res.status(500).status({
                  message: err.message,
                });
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
/* ------------------------------- SIGNUP END ------------------------------- */

/* ------------------------------- USER LOGIN ------------------------------- */
const login = (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("user/login", { logginError: req.session.logginError });
    req.session.logginError = false;
  }
};

/* ---------------------------------- USER POST LOGIN --------------------------------- */

const signin = (req, res) => {
  userdb
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user.state) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
            if (result) {
              req.session.user = user._id;

              res.redirect("/");
            } else {
              req.session.logginError = "invalid email or password";
              res.redirect("/login");
            }
          })
          .catch((err) => {
            console.log(err);
          });
        // req.session.logginError = "please enter details";
        // res.redirect("/login");
      } else {
        req.session.logginError = "user is blocked";
        res.redirect("/login");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving user information",
      });
    });
};
/* -------------------------------- USER POST LOGIN  ------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                     OTP LOGIN                                   */
/* -------------------------------------------------------------------------- */

const otplogin = (req, res) => {
  res.render("user/otp", { mobileerror: req.session.mobileerror });
  req.session.mobileerror = false;
};
/* ----------------------------------- OTP LOGIN POST---------------------------------- */
let serviceId;
let phone;
let mobile;
const otpLogin = async (req, res) => {
  userdb
    .findOne({ mobile: req.body.otp })
    .then(async (user) => {
      if (user && user.state) {
        const { sid } = await client.verify.services.create({
          friendlyName: "siby",
        });
        serviceId = sid;
        phone = `+91${req.body.otp}`;
        mobile = req.body.otp;
        const response = await client.verify
          .services(sid)
          .verifications.create({
            to: `+91${req.body.otp}`,
            channel: "sms", // sms, call, or email
          });

        // console.log(response);
        if (response.status == "pending") {
          res.redirect("/otp_verify");
        }
      } else {
        console.log("no user");
        req.session.mobileerror = "no user or user is blocked";
        res.redirect("/otp_login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/* ------------------------------- OTP VERIFY ------------------------------- */
const otp_verify = (req, res) => {
  res.render("user/otpverify");
};
/* ----------------------------- OTP VERIFY POST ---------------------------- */
const otp_Verify = async (req, res, next) => {
  userdb.findOne({ mobile: mobile }).then(async (user) => {
    // console.log(user);
    const response = await client.verify
      .services(serviceId)
      .verificationChecks.create({
        to: phone,
        code: req.body.code,
      });

    if (response.status == "approved") {
      req.session.user = user._id;
      res.redirect("/");
    } else {
      res.render("user/otp_verify");
    }
  });
};

/* ------------------------------- USER LOGOUT ------------------------------ */
const user_logout = (req, res) => {
  req.session.user = null;
  res.redirect("/");
};
/* ------------------------------ PRODUCT LIST ------------------------------ */
const product_list = async (req, res) => {

let userid=req.session.user
  let proname = req.query.name;

  let productdetails = await product.find({ brand: proname });
  let user = await userdb.find({_id:userid})
 
  res.render("user/category", {user:user[0], productdetails: productdetails});

  
};

/* ----------------------------- SINGLE PRODUCT ----------------------------- */

const single_product =async (req, res) => {
  // console.log(typeof req.params.id);
  let userid=req.session.user
  let user = await userdb.find({_id:userid})
  product
    .find({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.render("user/singleProduct", {user:user[0], Result: result });
      } else {
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/* -------------------------------------------------------------------------- */
/*                          CART CREATING AND ADDING                          */
/* -------------------------------------------------------------------------- */

const cart_post = async (req, res) => {
  let id = req.session.user;
  // console.log("logging  id");
  // console.log(req.params.id);
  let cartpresent = await cart.find({ UserId: id });

  if (cartpresent == "") {
    //creat cart and store userid in cart
    const cart_schema = new cart({
      UserId: id,
      Product: [
        {
          ItemId: req.params.id,
          Quantity: 1,
        },
      ],
    });
    cart_schema.save();
    res.redirect("/product_list");
    // console.log("new cart formmed:");
  } else {
    // Push product to cart
    const data = await cart.findOne({
      $and: [
        { UserId: id },
        { Product: { $elemMatch: { ItemId: req.params.id } } },
      ],
    });
    if (data) {
      res.redirect("/view_cart");
      // console.log("exist");
    } else {
      // console.log("push to cart");
      cart.updateOne(
        { UserId: id },
        { $push: { Product: { ItemId: req.params.id, Quantity: 1 } } },
        (err, up) => {
          if (err) {
            // console.log("not added");
          } else {
            // console.log("added");
          }
        }
      );
    }
  }

  // res.redirect('/cart')
  // console.log(cartdisplay[0].Product.length)

  //console.table(cartdisplay[0])

  // const userId=req.session.user

  // if (userId) {
  //   console.log("hi");
  //   console.log(userId);
  //   cart.findOne({userId:userId}).then((usercart) => {
  //     console.log(usercart);
  //     if (usercart) {

  //      console.log("exist");
  //      cart.findOneAndUpdate({userId:userId},{$push:{productsarray:{_id:req.params.id,quantity:1}}})
  //      console.log("updated");
  //     } else {
  //       cart.create({userId,productsarray:[{_id:req.params.id,quantity:1}]}).then((response) => {
  //         if (response) {
  //           console.log("world");
  //           console.log(response);
  //           res.redirect("/");
  //         }
  //       });

  //     }
  //   });
  // }
};

/* -------------------------------------------------------------------------- */
/*                                  CART VIEW                                 */
/* -------------------------------------------------------------------------- */

const view_cart = async (req, res) => {
  let id = req.session.user;
  let user = await userdb.find({_id:id})
  if (id) {
    // console.log(id);
    const CartProduct = await cart.aggregate([
      { $match: { UserId: ObjectId(id) } },
      { $unwind: "$Product" },
      {
        $project: {
          UserId: "$Product.UserId",
          ItemId: "$Product.ItemId",
          Quantity: "$Product.Quantity",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "ItemId",
          foreignField: "_id",
          as: "displaycart",
        },
      },
      {
        $project: {
          UserId: 1,
          ItemId: 1,
          Quantity: 1,
          displaycart: { $arrayElemAt: ["$displaycart", 0] },
        },
      },
    ]);

    // console.log(CartProduct[0]);
    // console.log(CartProduct[0].displaycart);

    var grandtotal = 0;
    for (let p = 0; p < CartProduct.length; p++) {
      grandtotal =
        grandtotal +
        (CartProduct[p].displaycart.price -
          (CartProduct[p].displaycart.price *
            CartProduct[p].displaycart.offer) /
            100) *
          CartProduct[p].Quantity;
    }
    var subtotal = 0;
    for (let p = 0; p < CartProduct.length; p++) {
      subtotal =
        subtotal + CartProduct[p].displaycart.price * CartProduct[p].Quantity;
    }

    // console.log(subtotal);
    CartProduct.forEach((index) => {
      index.UserId = id;
    });
    // console.log(CartProduct);

    // console.log(CartProduct.Quantity)
    res.render("user/cart", {
      cartdetails: CartProduct,
      subtotal: subtotal,
      grandtotal: grandtotal,
      userid: id,
      user:user[0],
      count: CartProduct.length,
      checkout: CartProduct,
    });
  } else {
    res.redirect("/login");
  }
};

/* -------------------------------------------------------------------------- */
/*                                REMOVING CART                               */
/* -------------------------------------------------------------------------- */
const remove_cart = async (req, res) => {
  // console.log(req.params.id);
  let id = req.session.user;
  // console.log(id);
  if (id) {
    await cart.updateOne(
      { UserId: id },
      { $pull: { Product: { ItemId: req.params.id } } }
    );

    res.redirect("/view_cart");
  }
};
/* -------------------------------------------------------------------------- */
/*                                CART QUANTITY                               */
/* -------------------------------------------------------------------------- */

const quantity_cart = async (req, res) => {
  details = req.body;
  proid = details.proid;
  cartid = details.cartid;
  userid = details.userid;
  quantity = details.quantity;
  count = parseInt(details.count);
  // console.log(details.count,details.quantity);
  if (quantity == 1 && count == -1) {
    await cart
      .updateOne({ UserId: userid }, { $pull: { Product: { ItemId: proid } } })
      .then((data) => {
        res.json(false);
      });
  } else {
    await cart
      .updateOne(
        { _id: cartid, "Product.ItemId": proid },
        { $inc: { "Product.$.Quantity": count } }
      )
      .then((data) => {
        res.json(true);
      });
  }
  return;
};
/* -------------------------------------------------------------------------- */
/*                                  CHECKOUT                                  */
/* -------------------------------------------------------------------------- */
const view_checkout = async (req, res) => {
  let id = req.session.user;
  let user=await userdb.findOne({UserId:id})
  if (id) {
    // console.log(id);
    const Checkout = await cart.aggregate([
      { $match: { UserId: ObjectId(id) } },
      { $unwind: "$Product" },
      {
        $project: {
          UserId: "$Product.UserId",
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
      {
        $project: {
          UserId: 1,
          ItemId: 1,
          Quantity: 1,
          displaycheckout: { $arrayElemAt: ["$displaycheckout", 0] },
        },
      },
    ]);

    let addressview = await address.aggregate([
      {
        $match: { UserId: ObjectId(id) },
      },
      {
        $unwind: "$address",
      },
    ]);
    // console.log(addressview);
    // console.log(Checkout[0]);
    // console.log(Checkout[0].displaycheckout.price);

    var subtotal = 0;
    for (let p = 0; p < Checkout.length; p++) {
      subtotal =
        subtotal +
        (Checkout[p].displaycheckout.price -
          (Checkout[p].displaycheckout.price *
            Checkout[p].displaycheckout.offer) /
            100) *
          Checkout[p].Quantity;
    }

    // console.log(subtotal);
    Checkout.forEach((index) => {
      index.UserId = id;
    });
    // console.log(Checkout);

    // console.log(Checkout.length);

    res.render("user/checkout", {
      checkoutdetails: Checkout,
      Subtotal: subtotal,
      count: Checkout.length,
      addressview: addressview,
      user:user
    });
    afterdiscount = false;
  } else {
    res.redirect("/login");
  }
};
/* -------------------------------------------------------------------------- */
/*                                 MY ACCOUNT                                 */
/* -------------------------------------------------------------------------- */
const my_acc = async (req, res) => {
  id = req.session.user;
  if(id==null){
    res.redirect('/login')
  }else{

    let addressview = await address.aggregate([
      {
        $match: { UserId: ObjectId(id) },
      },
      {
        $unwind: "$address",
      },
    ]);
    // console.log(addressview);
    let userdetails = await userdb.findOne({ UserId: id });
    let walletview = await wallet.findOne({ UserId: id });
  
    res.render("user/myaccount", {
      addressview: addressview,
      walletview: walletview,
      user: userdetails,
     
    });
  }
};
/* -------------------------------------------------------------------------- */
/*                        FIND VIEW ADD EDIT   ADDRESS                        */
/* -------------------------------------------------------------------------- */
const edit_find_address = async (req, res) => {
  // console.log(req.params.id);
  let id = req.params.id;
  let userid = req.session.user;
 let user=await userdb.findOne({UserId:id})
  address
    .aggregate([
      { $match: { UserId: ObjectId(userid) } },
      { $unwind: "$address" },
      { $match: { "address._id": ObjectId(id) } },
    ])
    .then((data) => {
      // console.log(data);
      res.render("user/editaddress", { data: data,user:user});
    });
};
/* -------------------------------------------------------------------------- */
/*                              POST EDIT ADDRESS                             */
/* -------------------------------------------------------------------------- */
const post_edit_address = (req, res) => {
  let userid = req.session.user;
  let id = req.params.id;
  // console.log(req.body);
  // console.log(req.params.id)

  address
    .findOneAndUpdate(
      { UserId: userid, "address._id": id },
      {
        $set: {
          "address.$.name": req.body.FirstName,
          "address.$.company": req.body.CompanyName,
          "address.$.country": req.body.Country,
          "address.$.addres": req.body.addres,
          "address.$.town": req.body.Town,
          "address.$.state": req.body.State,
          "address.$.postcode": req.body.Postcode,
          "address.$.phone": req.body.Phone,
          "address.$.email": req.body.Email,
        },
      }
    )
    .then((data) => {
      // console.log(data);
      res.redirect("/view_checkout");
    });
};
/* -------------------------------------------------------------------------- */
/*                               VIEW ADD ADRESS                              */
/* -------------------------------------------------------------------------- */
const add_address =async (req, res) => {
  let userid=req.session.user
  let user=await userdb.findOne({UserId:userid})
  res.render("user/addaddress",{user:user});
};
/* -------------------------------------------------------------------------- */
/*                              ADD ADDRESS POST                              */
/* -------------------------------------------------------------------------- */
const add_address_post = async (req, res) => {
  let id = req.session.user;
  // console.log(req.body);
  let addresspresent = await address.find({ UserId: id });

  if (addresspresent == "") {
    // ADD address
    const addressSchema = new address({
      UserId: id,
      address: [
        {
          name: req.body.FirstName,
          company: req.body.CompanyName,
          country: req.body.Country,
          addres: req.body.addres,
          town: req.body.Town,
          state: req.body.State,
          postcode: req.body.Postcode,
          phone: req.body.Phone,
          email: req.body.Email,
        },
      ],
    });
    addressSchema.save();
    res.redirect("/my_acc");
    // console.log( addressSchema);
  } else {
    // PUSh ADDRESS
    address
      .updateOne(
        { UserId: id },
        {
          $push: {
            address: {
              name: req.body.FirstName,
              company: req.body.CompanyName,
              country: req.body.Country,
              addres: req.body.addres,
              town: req.body.Town,
              state: req.body.State,
              postcode: req.body.Postcode,
              phone: req.body.Phone,
              email: req.body.Email,
            },
          },
        }
      )
      .then((result) => {
        if (result) {
          res.redirect("/my_acc");
        }
      });
  }
};
/* -------------------------------------------------------------------------- */
/*                               DELETE ADDRESS                               */
/* -------------------------------------------------------------------------- */
const delete_address = (req, res) => {
  // console.log(req.params.id);
  let userid = req.session.user;
  let id = req.params.id;
  // address.aggregate([
  //   {$match:{UserId:ObjectId(userid)}},
  //   {$unwind:'$address'},
  // {$match:{'address._id':ObjectId(id)}}
  //   ]).then((data)=>{
  //     console.log(data);
  //   })
  address
    .updateOne({ UserId: userid }, { $pull: { address: { _id: id } } })
    .then((delet) => {
      res.redirect("/my_acc");
    });
};
/* -------------------------------------------------------------------------- */
/*                                   COUPON                                   */
/* -------------------------------------------------------------------------- */
const post_coupon = async (req, res) => {
  let userid = req.session.user;
  const { couponcode, total } = req.body;

  // console.log(req.body);
  let coupondetails = await coupon.find({ couponcode: couponcode });
  if (coupondetails == "") {
    // console.log("null");
    res.json({ nocupon: true });
  } else {
    let curentdate = new Date().toLocaleDateString("en-IN");
    let expire = coupondetails[0].expire;

    if (curentdate <= expire) {
      // console.log("not expired");
      if (total >= coupondetails[0].min && total <= coupondetails[0].max) {
        // console.log("amount ok");
        // console.log(total);
        let afterdiscount = total - (total * coupondetails[0].discount) / 100;
        res.json({ afterdiscount });
        // req.session.afterdiscount=afterdiscount
        // console.log(req.session.afterdiscount);
      } else {
        res.json({ amount: true });
      }
    } else {
      res.json({ expired: true });
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                                    ORDER                                   */
/* -------------------------------------------------------------------------- */

const orders = async (req, res) => {
  let userid = req.session.user;
  let total = req.body.total;

  // console.log(req.body.coupon);
  console.log(req.body.total);
  // console.log(req.body.cartid)
  // console.log(req.body.product)
  // console.log(req.body.Quantity)
  // console.log(req.body.payment);
  let id = req.body.address;
  let addressdetails = await address.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    { $unwind: "$address" },
    { $match: { "address._id": ObjectId(id) } },
    {
      $project: {
        name: "$address.name",
        addres: "$address.addres",
      },
    },
  ]);
  // console.log(addressdetails[0].name);
  // console.log(addressdetails[0].addres);
  let addresname = addressdetails[0].name;
  let singleaddress = addressdetails[0].addres;

  let cartid = req.body.cartid;
  let cartdetails = await cart.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    { $unwind: "$Product" },
    {
      $project: {
        ItemId: "$Product.ItemId",
        Quantity: "$Product.Quantity",
      },
    },
  ]);
  // console.log(cartdetails);

  /// PAYMENT DETAILS
  if (req.body.payment == "razorpay") {
    const orderSchema = new order({
      UserId: userid,
      Address: id,
      Name: addresname,
      Singleaddress: singleaddress,
      Status: "Pending",
      Payment: req.body.payment,
      Date: new Date(),
      Product: cartdetails,
      Total: total,
    });

    orderSchema.save().then((data) => {
      let uniqorderid = data._id;
      var options = {
        amount: parseInt(total) * 100,
        currency: "INR",
        receipt: uniqorderid + "",
      };

      instance.orders.create(options, function (err, order) {
        console.log(err);
        console.log(order);
        res.json({ order, razorpay: true });
      });
    });
  } else if (req.body.payment == "cod") {
    const orderSchema = new order({
      UserId: userid,
      Address: id,
      Name: addresname,
      Singleaddress: singleaddress,
      Status: "Placed",
      Payment: req.body.payment,
      Date: new Date(),
      Product: cartdetails,
      Total: total,
    });
    orderSchema.save();
    let details = await cart.deleteOne({ UserId: userid });
    res.json({ cod: true });
  } else if (req.body.payment == "wallet") {
    let walletbalance = await wallet.findOne({ UserId: userid });
    if (total < walletbalance.Balance) {
      const orderSchema = new order({
        UserId: userid,
        Address: id,
        Name: addresname,
        Singleaddress: singleaddress,
        Status: "Placed",
        Payment: req.body.payment,
        Date: new Date(),
        Product: cartdetails,
        Total: total,
      });
      orderSchema.save();
      let details = await cart.deleteOne({ UserId: userid });
      let newbalance = (walletbalance.Balance - total).toFixed(2);
      let debited = await wallet.updateOne(
        { UserId: userid },
        { $set: { Balance: newbalance } }
      );
      res.json({ wallet: true });
    } else {
      res.json({ nowallet: true });
    }
  } else if (req.body.payment == "paypal") {
    const orderSchema = new order({
      UserId: userid,
      Address: id,
      Name: addresname,
      Singleaddress: singleaddress,
      Status: "Pending",
      Payment: req.body.payment, 
      Date: new Date(),
      Product: cartdetails,
      Total: total,
    });
    orderSchema.save().then((data) => {
      let uniqueorderid = data._id;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/paypal_verify_payment?orderid="+uniqueorderid,
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Sox Hat",
                sku: "001",
                price: "10.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "10.00",
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        // console.log(error.response.details[0]);

        throw error;
      } else {
        // console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            // console.log(payment.links[i].href);
            let link = payment.links[i].href;
            res.json({ link, paypal: true});
          }
        }
      }
    });
    });

    
  }
};
/* -------------------------------------------------------------------------- */
/*                            PAYPAL VERIFY PAYMENT                           */
/* -------------------------------------------------------------------------- */

const paypal_verify_payment =async(req, res) => {
  let userid = req.session.user
  // console.log("verify");
  let orderid= req.query.orderid;
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "10.00",
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
   async function (error, payment) {
      if (error) {
        // console.log(error.response);
        throw error;
      } else {
        // console.log(JSON.stringify(payment));
        let details = await cart.deleteOne({ UserId: userid });
        let statusupdate = await order.updateOne(
          { _id: orderid },
          { $set: { Status: "Placed" } }
        );
       res.redirect('/success')
      }
    }
  );
};

/* -------------------------------------------------------------------------- */
/*                               VERIFY PAYMENT                               */
/* -------------------------------------------------------------------------- */
const verify_payment = async (req, res) => {
  let userid = req.session.user;
  return new Promise(async (resolve, reject) => {
    //  console.log(req.body);
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", "t06E7KjAbsb4Lr3WjviL6R1f");
    hmac.update(
      req.body.payment.razorpay_order_id +
        "|" +
        req.body.payment.razorpay_payment_id
    );
    hmac = hmac.digest("hex");
    if (hmac == req.body.payment.razorpay_signature) {
      let ordersingleid = req.body.order.receipt;
      let details = await cart.deleteOne({ UserId: userid });
      let statusupdate = await order.updateOne(
        { _id: ordersingleid },
        { $set: { Status: "Placed" } }
      );

      resolve();
      res.json({ success: true });
    } else {
      reject();
    }
  });
};

/* -------------------------------------------------------------------------- */
/*                               SUCCESS MESSAGE                              */
/* -------------------------------------------------------------------------- */
const success = (req, res) => {
  res.render("user/success");
};

/* -------------------------------------------------------------------------- */
/*                                 VIEW ORDER                                 */
/* -------------------------------------------------------------------------- */
const view_order = async (req, res) => {
  let userid = req.session.user;
  let user=await userdb.findOne({UserId:userid})
  let statuspendingdelete = await order.deleteMany({ Status: "Pending" });

  let oderdetails = await order.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    {
      $project: {
        Payment: 1,
        Date: 1,
        Status: 1,
        Total: 1,
      },
    },
  ]);

  // console.log(oderdetails);

  res.render("user/orderview", { oderdetails: oderdetails,user:user });
};

/* -------------------------------------------------------------------------- */
/*                            VIEW ORDERED PRODUCT                            */
/* -------------------------------------------------------------------------- */
const orderd_product = async (req, res) => {
  let userid = req.session.user;
  let orderid = req.query.id;
  // console.log(orderid)
  let user=await userdb.findOne({userid:userid})
  let orderdetails = await order.aggregate([
    { $match: { _id: ObjectId(orderid) } },
    { $unwind: "$Product" },
    {
      $project: {
        Address: 1,
        Product: 1,
      },
    },
  ]);
  // console.log(orderdetails);
  //                 /* ------------- ADDRESS ID FINDING FORM OREDER COLLECTION ------------- */

  let addressid = orderdetails[0].Address;
  // console.log(addressid);

  /* --------------- ADDRESS DETALS FIND FROM ADDRESS COLLECTION -------------- */
  let addressdetails = await address.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    { $unwind: "$address" },
    {
      $project: {
        address: 1,
      },
    },
    { $match: { "address._id": ObjectId(addressid) } },
    {
      $project: {
        name: "$address.name",
        company: "$address.company",
        country: "$address.country",
        addres: "$address.addres",
        town: "$address.town",
        state: "$address.state",
        postcode: "$address.postcode",
        phone: "$address.phone",
      },
    },
  ]);
  /* -------------------------- PRODUCTS FROM ORDERS -------------------------- */

  let productdetails = await order.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    { $match: { _id: ObjectId(orderid) } },
    { $unwind: "$Product" },
    {
      $project: {
        Payment: 1,
        Date: 1,
        Status: 1,
        Total: 1,
        Quantity: "$Product.Quantity",
        ItemId: "$Product.ItemId",
      },
    },
    {$sort:{Date:-1}},
    {
      $lookup: {
        from: "products",
        localField: "ItemId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $project: {
        Payment: 1,
        UserId: 1,
        Status: 1, 
        Address: 1,
        Date: 1,
        Quantity: 1,
        Total: 1,
        product: { $arrayElemAt: ["$product", 0] },
      },
    },
   
  ]);

  // productdetails.forEach((element) => {
  //   element.Status = element.Status;
  //   element.Date = element.Date;
  //   element.Payment = element.Payment
  //   element.Total = element.Total;
  //   element.Quantity = element.Quantity;
  //   element.productname = element.product.productname;
  //   element.price = element.product.price;
  //   element.offer = element.product.offer;
  // });

  // console.log(productdetails);
  res.render("user/orderdproduct1", {
    addressdetails: addressdetails,
    productdetails: productdetails,
    user:user
  });
};

/* -------------------------------------------------------------------------- */
/*                                Status UPDATE                               */
/* -------------------------------------------------------------------------- */
const order_status = async (req, res) => {
  // console.log(req.query.id);
  // console.log(req.query.status);
  let orderid = req.query.id;
  let stat = req.query.status;
  let statusupdate = await order.updateOne(
    { _id: orderid },
    { $set: { Status: stat } }
  );
  //amount from cancel order
  let userid = req.session.user;
  let walletamout = await order.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    { $match: { _id: ObjectId(orderid) } },
    { $project: { Total: 1, _id: 0, Status: 1, Payment: 1 } },
  ]);

  const { Total, Status, Payment } = walletamout[0];
  let userwallet = await wallet.find({ UserId: userid });
  let date = new Date();
  
  if (Payment == "razorpay" || Payment == "paypal" || Payment == "wallet") {
    let curentbalance = userwallet[0].Balance;
    let newbalance = curentbalance + Total;
    await wallet.updateOne(
      { UserId: userid },
      { $set: { Balance: newbalance } }
    );

    res.redirect("/view_order");
  } else {
    res.redirect("/view_order");
  }
};

/* -------------------------------------------------------------------------- */
/*                                  WISHLIST                                  */
/* -------------------------------------------------------------------------- */
const wish_list = async (req, res) => {
  let userid = req.session.user;
  if(userid==null){
    res.redirect('/login')
  }else{

    let user =await userdb.findOne({UserId:userid})
    //   console.log("asdfghjk");
    // await wish.find({UserId:userid}).then((data)=>{
    //   console.log(data);
    // })
    // console.log("asdfghnj,.");
    let wishlistdetails = await wish.aggregate([
      { $match: { UserId: ObjectId(userid) } },
      { $unwind: "$Wishlist" },
      {
        $project: {
          proid: "$Wishlist.proid",
          _id: "$Wishlist._id",
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "proid",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.productname",
          price: "$product.price",
          Description: "$product.Description",
          image: "$product.image",
          _id: "$product._id",
        },
      },
    ]);
    // console.log(wishlistdetails[0]);
    // console.log(wishlistdetails[1].name);
  
    res.render("user/wishlist", { wishlistdetails: wishlistdetails,user:user});
  }
};

/* -------------------------------------------------------------------------- */
/*                                POST WISHLIST                               */
/* -------------------------------------------------------------------------- */

const wish_list_post = async (req, res) => {
  let userid = req.session.user;
  let Proid = req.body.proid;
  // console.log(userid);
  // console.log(Proid);
  const newwishlist = { proid: Proid };
  let findinguser = await wish.find({ UserId: userid });
  // console.log(findinguser);
  if (findinguser == "") {
    //if no user new wishlist is adding
    const wishlistschema = new wish({
      UserId: userid,
      Wishlist: [
        {
          proid: Proid,
        },
      ],
    });
    wishlistschema.save();
  } else {
    // if there is a existing user cheking the item is existing in the wishlist
    const data = await wish.findOne({
      $and: [
        { UserId: userid },
        { Wishlist: { $elemMatch: { proid: Proid } } },
      ],
    });
    if (data) {
      /// if it is exist remove from wishlist
      await wish.updateOne(
        { UserId: userid },
        { $pull: { Wishlist: { proid: Proid } } }
      );
    } else {
      // if it is not existing adding to wislist
      await wish.updateOne(
        { UserId: userid },
        { $push: { Wishlist: newwishlist } }
      );
      res.redirect("/view_cart");
    }
  }
};

/* -------------------------------------------------------------------------- */
/*                                   RETURN                                   */
/* -------------------------------------------------------------------------- */
const Return = async (req, res) => {
  let userid = req.session.user;
  let orderid = req.query.id;
  let walletamout = await order.aggregate([
    { $match: { UserId: ObjectId(userid) } },
    { $match: { _id: ObjectId(orderid) } },
    { $project: { Total: 1, _id: 0, Status: 1, Payment: 1 } },
  ]);
  const { Total, Status, Payment } = walletamout[0];
  let userwallet = await wallet.find({ UserId: userid });
  let date = new Date();
  if (Status == "Delliverd" || Payment == "cod" || Payment == "razorpay") {
    let curentbalance = userwallet[0].Balance;
    let newbalance = curentbalance + Total;
    // let newhistory={Debit:Total, Orderid:orderid, Date:date}
    await wallet.updateOne(
      { UserId: userid },
      { $set: { Balance: newbalance } }
    );
    res.redirect("/view_order");
  }
};

module.exports = {
  home,
  register,
  signup,
  login,
  signin,
  otplogin,
  otpLogin,
  otp_verify,
  otp_Verify,
  user_logout,
  product_list,
  single_product,
  cart_post,
  view_cart,
  remove_cart,
  quantity_cart,
  view_checkout,
  edit_find_address,
  post_edit_address,
  add_address,
  add_address_post,
  delete_address,
  my_acc,
  orders,
  success,
  view_order,
  orderd_product,
  order_status,
  verify_payment,
  wish_list,
  wish_list_post,
  post_coupon,
  Return,
  paypal_verify_payment,
};
