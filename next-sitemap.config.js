module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_URL,
    generateRobotsTxt: true,
    changefreq: "daily",
    priority: 0.7,
    sitemapSize: 7000, // Giới hạn số lượng URL trong mỗi file sitemap
    exclude: [
      "/dashboard",
      "/login",
      "/register",
      "/forgot-pass",
      "/change-password",
      "/api/*",
    ],
    sitemapBaseFileName: "sitemap",
    outDir: "public/",
    robotsTxtOptions: {
      additionalSitemaps: [
        `${process.env.NEXT_PUBLIC_URL}/sitemap-posts-1.xml`, // Tham chiếu sitemap-posts-1.xml
      ],
    },
    additionalPaths: async (config) => {
      const paths = [];
      const perPage = 100;
      let page = 1;
      let hasMorePosts = true;
  
      // Lặp qua các trang để fetch bài viết
      while (hasMorePosts) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}`
        );
        const posts = await response.json();
  
        // Nếu không còn bài viết thì dừng
        if (!Array.isArray(posts) || posts.length === 0) {
          hasMorePosts = false;
        } else {
          posts.forEach((post) => {
            paths.push({
              loc: `/${post.slug}`,
              lastmod: new Date(post.modified).toISOString(),
            });
          });
          page++; // Tăng số trang để fetch trang tiếp theo
        }
      }
  
      return paths;
    },
  };
  