import axios from "axios";

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  //   console.log(`You want to read context`, event.context);

  const userAgent = req.headers["user-agent"];
  const isFacebookCrawler = userAgent.includes("facebookexternalhit");

  const ip =
    req?.headers["x-forwarded-for"]?.split(",")?.pop() || // From proxy headers, can be spoofed if you don't have a proxy in front of your app, so drop it if your app is naked.
    req.connection.remoteAddress ||
    req.socket.remoteAddress || // socket is an alias to connection, just delete this line
    req.connection.socket.remoteAddress; // no idea where this might be a thing, just delete this line

  if (isFacebookCrawler) {
    console.log("Facebook IP: ", ip);
  } else {
    // event.res.setHeader("Content-Type", "text/html;charset=UTF-8");

    console.log(
      "Before check facebook.",
      new Date(),
      `${process.env.BASE_URL}${req.originalUrl}`,
    //   req.headers
    );
    console.log("Base: ", process.env.BASE_URL);
    console.log("Original: ", req.originalUrl);

    if (
      req.headers["referer"] !== undefined &&
      (req.headers["referer"].includes("fbclid") ||
        req.originalUrl.includes("/f/"))
    ) {
      console.log("After facebook check & redirect.", ip, new Date(), req.headers["referer"]);

    //   const tracking_url = req.headers["referer"].split("?")[0];
    //   const lastIndex = tracking_url.lastIndexOf("/");
    //   const beforeIdentifier = tracking_url.substring(0, lastIndex);
    //   const id = tracking_url.substring(lastIndex + 1);

      const a_data = {
        // id,
        ip,
        tracking_url: process.env.BASE_URL + req.originalUrl.split("?")[0],
        language: req.headers["accept-language"],
        user_agent: req.headers["user-agent"],
        screen_resolution: "-",
        network_speed: "-",
        referrer_url: "https://facebook.com/",
      };
      console.log("Request data: ", a_data);

      await axios
        .post(`${process.env.API_BASE_URL}trackingurl/redirect`, a_data)
        .then((result) => {
          console.log("Destination: ", result.data.destination_url);
          if (result.data) {
            let destination = result.data.destination_url;
            if (
              !destination.includes("http") ||
              !destination.includes("http")
            ) {
              destination = "https://" + destination;
            }

            res.writeHead(302, { Location: destination });
            res.end();
          }
        })
        .catch((error) => {});
    }
  }
});
