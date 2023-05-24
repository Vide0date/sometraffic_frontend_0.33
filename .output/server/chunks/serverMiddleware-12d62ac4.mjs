function serverMiddleware({ app, req, res }) {
  console.log("Request: ", req);
  res.setHeader("Access-Control-Allow-Origin", "*");
}

export { serverMiddleware as default };
//# sourceMappingURL=serverMiddleware-12d62ac4.mjs.map
