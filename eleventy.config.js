const pluginToc = require("eleventy-plugin-toc");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

// Use path prefix in production (GitHub Pages at /blog/); local dev uses root so CSS works
const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || (process.env.CI ? "/blog/" : "");

module.exports = async function (eleventyConfig) {
  const { HtmlBasePlugin } = await import("@11ty/eleventy");
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);

  // Add anchor to default markdown (so TOC links work); keeps plugin syntax highlighting
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      level: [2, 3, 4],
      permalink: false,
    });
  });

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");

  // Posts collection (newest first)
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").reverse();
  });

  // Tags: unique list and collection per tag
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const set = new Set();
    collectionApi.getFilteredByGlob("posts/*.md").forEach((item) => {
      (item.data.tags || []).forEach((tag) => set.add(tag));
    });
    return [...set].filter((t) => t !== "post").sort();
  });

  // Categories: unique list and collection per category
  eleventyConfig.addCollection("categoryList", function (collectionApi) {
    const set = new Set();
    collectionApi.getFilteredByGlob("posts/*.md").forEach((item) => {
      const cat = item.data.category || item.data.categories;
      if (Array.isArray(cat)) cat.forEach((c) => set.add(c));
      else if (cat) set.add(cat);
    });
    return [...set].sort();
  });

  // Archive: posts grouped by year
  eleventyConfig.addCollection("postsByYear", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("posts/*.md").reverse();
    const byYear = {};
    posts.forEach((post) => {
      const y = post.date.getFullYear();
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(post);
    });
    return Object.entries(byYear)
      .map(([year, items]) => ({ year: Number(year), posts: items }))
      .sort((a, b) => b.year - a.year);
  });

  // Plugins
  eleventyConfig.addPlugin(pluginToc, {
    wrapper: "nav",
    wrapperClass: "toc",
    ul: true,
    heading: "Contents",
  });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "en",
      title: "Static Blog",
      subtitle: "A markdown-driven static blog.",
      base: pathPrefix ? "https://piyushcc.github.io/blog/" : "http://localhost:8080",
      author: { name: "Blog Author" },
    },
  });
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // Reading time filter (word count / ~200 wpm) – strip HTML first
  eleventyConfig.addFilter("readingTime", function (content) {
    const text = (content || "").replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("date", function (date, format) {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (format === "YYYY-MM-DD") {
      return d.toISOString().slice(0, 10);
    }
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  });

  eleventyConfig.addFilter("slug", function (str) {
    return (str || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  });

  eleventyConfig.addFilter("tagSlugs", function (tags) {
    const slug = (s) =>
      (s || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    return (tags || []).map(slug).filter(Boolean).join(",");
  });

  eleventyConfig.addFilter("categorySlugs", function (data) {
    const slug = (s) =>
      (s || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const cat = data?.category ?? data?.categories;
    const arr = Array.isArray(cat) ? cat : cat ? [cat] : [];
    return arr.map(slug).filter(Boolean).join(",");
  });

  eleventyConfig.addFilter("truncate", function (str, length) {
    str = (str || "").trim();
    if (str.length <= length) return str;
    return str.slice(0, length).trim() + "…";
  });

  // Full post list as JSON for client-side filter + pagination (filter across all, reset to page 1)
  eleventyConfig.addFilter("postsClientData", function (posts) {
    const slug = (s) =>
      (s || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const tagSlugs = (tags) => (tags || []).map(slug).filter(Boolean).join(",");
    const catSlugs = (data) => {
      const cat = data?.category ?? data?.categories;
      const arr = Array.isArray(cat) ? cat : cat ? [cat] : [];
      return arr.map(slug).filter(Boolean).join(",");
    };
    const readingTime = (content) => {
      const text = (content || "").replace(/<[^>]+>/g, " ");
      const words = text.split(/\s+/).filter(Boolean).length;
      return `${Math.max(1, Math.ceil(words / 200))} min read`;
    };
    const excerpt = (content, len = 160) => {
      const str = (content || "").replace(/<[^>]+>/g, " ").trim();
      if (str.length <= len) return str;
      return str.slice(0, len).trim() + "…";
    };
    return (posts || []).map((post) => ({
      url: post.url,
      title: post.data?.title ?? "",
      excerpt: excerpt(post.templateContent),
      date: post.date ? new Date(post.date).toISOString().slice(0, 10) : "",
      readingTime: readingTime(post.templateContent),
      tags: tagSlugs(post.data?.tags || []).split(",").filter(Boolean),
      categorySlugs: catSlugs(post.data || {}).split(",").filter(Boolean),
    }));
  });

  eleventyConfig.addFilter("toJson", function (value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("head", function (arr, n) {
    return (arr || []).slice(0, n);
  });

  eleventyConfig.addFilter("relatedPosts", function (posts, currentUrl, currentTags, limit) {
    const url = currentUrl || "";
    const tags = (currentTags || []).filter((t) => t !== "post");
    const out = [];
    for (const post of posts || []) {
      if (post.url === url || out.length >= (limit || 3)) continue;
      const postTags = post.data?.tags || [];
      if (tags.some((t) => postTags.includes(t))) out.push(post);
    }
    return out;
  });

  return {
    pathPrefix,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
