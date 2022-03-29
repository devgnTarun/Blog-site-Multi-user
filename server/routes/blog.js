const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const blogController = require("../controllers/blogController");

// Get Latest Blogs
router.get('/blog/latest', blogController.getLatestBlogs);

// Get Blog of a user
router.get('/blog/:userId', blogController.getBlog);

// Get Blog of a BlogID
router.post('/blog/single/:blogId', blogController.getBlogByBlogID);

// Like a Blog 
router.post('/blog/like/:blogId', authMiddleware, blogController.likeBlogByBlogID);

// DisLike a Blog 
router.post('/blog/dislike/:blogId', authMiddleware, blogController.dislikeBlogByBlogID);

// Write blog
router.post('/blog/write', authMiddleware, blogController.writeBlog);

// Edit blog
router.post('/blog/edit/:id', authMiddleware, blogController.editBlog);

module.exports = router;