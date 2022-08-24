var express = require("express")
var app = express();
var router = express.Router();
const UserController = require("../Controllers/UserController");
const ServicerController = require("../Controllers/ServicerController");

router.get("/", (req, res) => {
    res.json({msg: "ok"});

});

router.get("/user/emailconfirmation/:id", UserController.emailConfirmation);
router.get("/servicer/emailconfirmation/:id", ServicerController.emailConfirmation);
router.get("/verifytoken/:token", UserController.verifyToken);

router.post("/user/login", UserController.login);
router.post("/servicer/login", ServicerController.login);

router.post("/user/register", UserController.register);
router.post("/servicer/register", ServicerController.register);

router.post("/servicer/create-checkout", ServicerController.createCheckout);
router.post("/servicer/payment-success", ServicerController.sucessPayment);

module.exports = router;