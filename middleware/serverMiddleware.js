export default function ({ app, req, res }) {
    console.log("Request: ", req);
    // Set the Access-Control-Allow-Origin header to allow all requests
    res.setHeader('Access-Control-Allow-Origin', '*')
}