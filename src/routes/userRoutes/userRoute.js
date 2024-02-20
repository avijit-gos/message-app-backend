/** @format */

const {
  userRegister,
  userLogin,
  getProfile,
  uploadProfileImage,
  updateProfileBio,
  updateProfileName,
  updateProfileInterest,
  searchProfile,
} = require("../../controller/userController/userController");
const authentication = require("../../middleware/authentication");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../validator/validator");

const router = require("express").Router();

router.post("/register", validateRegisterInput, userRegister);
router.post("/login", validateLoginInput, userLogin);
router.get("/:id", authentication, getProfile);
router.put("/profile/image", authentication, uploadProfileImage);
router.put("/update/profile/bio", authentication, updateProfileBio);
router.put("/update/profile/name", authentication, updateProfileName);
router.put("/update/profile/interest", authentication, updateProfileInterest);
router.get("/", authentication, searchProfile);

module.exports = router;
