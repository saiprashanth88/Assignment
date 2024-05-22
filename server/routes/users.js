const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});
router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) return res.status(404).send({ message: "User not found" });

		const lastLogin = user.loginHistory.length ? user.loginHistory[user.loginHistory.length - 1] : null;
		res.status(200).send({ user, lastLogin });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
