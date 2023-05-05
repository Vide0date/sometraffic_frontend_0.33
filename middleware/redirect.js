export default function (context) {
  const { req, res, query } = context;
  console.log("Request: ", req);

  const userAgent = req.headers["user-agent"];
  const isFacebookCrawler = userAgent.includes("facebookexternalhit");
  const fbCrawlerFlag = query.fb_crawler;

  if (isFacebookCrawler && fbCrawlerFlag) {
    // Server-side redirect for Facebook crawler
    res.writeHead(302, { Location: "https://yourdestinationurl.com" });
    res.end();
  } else {
    // Client-side redirect will be handled in a layout or page component
  }
}
