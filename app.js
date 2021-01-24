const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/blogRestDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

app
  .route("/blogs")

  .get((req, res) => {
    Blog.find({}, (err, foundBlogs) => {
      if (!err) {
        res.send(foundBlogs);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
    });
    newBlog.save((err) => {
      if (!err) {
        res.send("Successfully added one blog");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Blog.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all the blog");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/blogs/:blogTitle")

  .get((req, res) => {
    Blog.findOne({ title: req.params.blogTitle }, (err, foundBlog) => {
      if (foundBlog) {
        res.send(foundBlog);
      } else {
        res.send(err);
      }
    });
  })

  .put((req, res) => {
    Blog.update(
      { title: req.params.blogTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated one blog");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    Blog.update({ title: req.params.blogTitle }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Success patch");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Blog.deleteOne({ title: req.params.blogTitle }, (err) => {
      if (!err) {
        res.send("Delete success of one blog");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, () => {
  console.log("Running on port 3000");
});
