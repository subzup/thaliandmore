// Renders the blog index and individual blog posts
const site = require('../config/site');
const { buildMeta, buildDynamicMeta } = require('../config/seo');
const data = require('../config/data');

exports.index = (req, res) => {
  const posts = [...data.blog].sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('pages/blog-index', {
    site,
    meta: buildMeta('blogIndex'),
    posts,
  });
};

exports.show = (req, res, next) => {
  const post = data.blog.find((p) => p.slug === req.params.slug);
  if (!post) return next();

  const related = data.blog.filter((p) => p.slug !== post.slug).slice(0, 3);

  res.render('pages/blog-post', {
    site,
    meta: buildDynamicMeta({
      title: `${post.title} | ${site.name} Blog`,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
    }),
    post,
    related,
  });
};
