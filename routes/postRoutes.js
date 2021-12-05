const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router
  .route("/")
  .get(authMiddleware, postController.getAllPosts)
  .post(authMiddleware, postController.createPost);

router
  .route("/:id")
  .get(authMiddleware, postController.getOnePost)
  .put(authMiddleware, postController.updatePost)
  .delete(authMiddleware, postController.deletePost);

module.exports = router;
