function redirect(context) {
  const { req, res, query } = context;
  console.log("Request: ", req);
  const userAgent = req.headers["user-agent"];
  const isFacebookCrawler = userAgent.includes("facebookexternalhit");
  const fbCrawlerFlag = query.fb_crawler;
  if (isFacebookCrawler && fbCrawlerFlag) {
    res.writeHead(302, { Location: "https://yourdestinationurl.com" });
    res.end();
  }
}

export { redirect as default };
//# sourceMappingURL=redirect-e757c3f9.mjs.map
