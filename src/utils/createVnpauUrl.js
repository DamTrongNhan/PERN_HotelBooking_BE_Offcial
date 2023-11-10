import sortObject from "../utils/sortObject";
import dayjs from "dayjs";
let crypto = require("crypto");
let querystring = require("qs");

const createVnpayUrl = (bookingData, language, ipAddr) => {
  let amount = bookingData.totalPrice;
  let bankCode = "";

  let locale = "vn";
  if (language && ["vn", "en"].indexOf(language) >= 0) {
    locale = language;
  }
  let currCode = "VND";

  let date = new Date();
  let createDate = dayjs(date).format("YYYYMMDDHHmmss");

  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnpUrl = process.env.vnp_Url;
  let returnUrl = process.env.vnp_ReturnUrl;
  let orderId = bookingData.bookingCode;

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params[
    "vnp_OrderInfo"
  ] = `Thanh toán đặt phòng cho mã giao dịch: ${orderId}, khách hàng: ${bookingData.email}`;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, {
    encode: false,
  });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl +=
    "?" +
    querystring.stringify(vnp_Params, {
      encode: false,
    });
  return vnpUrl;
};
export default createVnpayUrl;
