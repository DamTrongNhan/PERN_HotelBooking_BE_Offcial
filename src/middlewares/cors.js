const cors = (req, res, next) => {
  // Set the Access-Control-Allow-Origin header to allow calls from any domain
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Set the Access-Control-Allow-Credentials header to true if you need to include cookies
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Set the Access-Control-Allow-Headers header to allow specific request headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, uid"
  );

  // Set the Access-Control-Allow-Methods header to allow specific request methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  // Call the next middleware
  next();
};
export default cors;
