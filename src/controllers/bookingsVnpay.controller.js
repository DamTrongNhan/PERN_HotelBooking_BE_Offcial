import db from "../models";
import dayjs from "dayjs";

import { sendConfirmation } from "../utils/sendMail";

import sortObject from "../utils/sortObject";
let crypto = require("crypto");
let querystring = require("qs");

let buildUrlConfirm = (token, bookingId) => {
  let result = "";
  result = `${process.env.REACT_URL}/verify-booking?token=${token}&bookingId=${bookingId}`;
  return result;
};

export const createBookingWithVnpay = (req, res, next) => {
  const { language, checkIn, checkOut, ...others } = req.body;
  const data = { ...others };

  const checkInDate = dayjs(checkIn).toDate();
  const checkOutDate = dayjs(checkOut).toDate();

  if (checkInDate > checkOutDate) {
    return res.status(400).json({ message: "Invalid time" });
  }

  db.bookings
    .create({
      ...data,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      paymentStatusKey: "SP1",
    })
    .then((createBooking) => {
      if (createBooking) {
        db.bookDates
          .create({
            bookingId: createBooking.id,
            roomId: createBooking.roomId,
            checkIn: createBooking.checkIn,
            checkOut: createBooking.checkOut,
          })
          .then((createBookDates) => {
            if (createBookDates) {
              sendConfirmation({
                email: createBooking.email,
                firstName: createBooking.firstName,
                lastName: createBooking.lastName,
                bookingCode: createBooking.bookingCode,
                checkIn: createBooking.checkIn,
                checkOut: createBooking.checkOut,
                days: createBooking.days,
                adult: createBooking.adult,
                child: createBooking.child,
                language,
                urlConfirm: buildUrlConfirm(
                  createBooking.verifyBookingToken,
                  createBooking.id
                ),
              })
                .then((info) => {
                  if (info) {
                    let amount = createBooking.totalPrice;
                    let bankCode = "";

                    let locale = "vn";
                    if (language && ["vn", "en"].indexOf(language) >= 0) {
                      locale = language;
                    }
                    let currCode = "VND";

                    let date = new Date();
                    let createDate = dayjs(date).format("YYYYMMDDHHmmss");

                    let ipAddr =
                      req.headers["x-forwarded-for"] ||
                      req.connection.remoteAddress ||
                      req.socket.remoteAddress ||
                      req.connection.socket.remoteAddress;

                    let tmnCode = process.env.vnp_TmnCode;
                    let secretKey = process.env.vnp_HashSecret;
                    let vnpUrl = process.env.vnp_Url;
                    let returnUrl = process.env.vnp_ReturnUrl;
                    let orderId = createBooking.bookingCode;

                    let vnp_Params = {};
                    vnp_Params["vnp_Version"] = "2.1.0";
                    vnp_Params["vnp_Command"] = "pay";
                    vnp_Params["vnp_TmnCode"] = tmnCode;
                    vnp_Params["vnp_Locale"] = locale;
                    vnp_Params["vnp_CurrCode"] = currCode;
                    vnp_Params["vnp_TxnRef"] = orderId;
                    vnp_Params[
                      "vnp_OrderInfo"
                    ] = `Thanh toan dat phong cho ma GD: ${orderId}, khach hang: ${createBooking.email}`;
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
                    let signed = hmac
                      .update(Buffer.from(signData, "utf-8"))
                      .digest("hex");
                    vnp_Params["vnp_SecureHash"] = signed;
                    vnpUrl +=
                      "?" +
                      querystring.stringify(vnp_Params, { encode: false });
                    console.log(vnpUrl);
                    return res.status(200).json({ paymentUrl: vnpUrl });
                  } else {
                    return next({ statusCode: 404, message: "Not found" });
                  }
                })
                .catch((error) => next(error));
            } else {
              return next({ statusCode: 404, message: "Not found" });
            }
          })
          .catch((error) => next(error));
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    })
    .catch((err) => next(err));
};

export const getVnpayResult = (req, res, next) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = process.env.vnp_HashSecret;

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // const amount = vnp_Params["vnp_Amount"];
    // const txnRef = vnp_Params["vnp_TxnRef"];
    // const payDate = vnp_Params["vnp_PayDate"];
    // const bankCode = vnp_Params["vnp_BankCode"];
    // const bankTranNo = vnp_Params["vnp_BankTranNo"];
    // const cartType = vnp_Params["vnp_CardType"];
    // const transactionNo = vnp_Params["vnp_TransactionNo"];

    // let isSuccess = false,
    //   message = "Payment failed";

    // if (vnp_Params["vnp_TransactionStatus"] === "00") {
    //   isSuccess = true;
    //   message = "Payment success";
    // }

    db.bookings
      .update(
        { paymentStatusKey: "SP2" },
        {
          where: {
            bookingCode: vnp_Params["vnp_TxnRef"],
            paymentStatusKey: "SP1",
          },
        }
      )
      .then(([updatePaymentStatus]) => {
        if (updatePaymentStatus !== 0) {
          res.cookie("bookingCode", vnp_Params["vnp_TxnRef"], {
            expires: new Date(Date.now() + 5 * 60 * 1000),
          });
          return res.redirect(process.env.returnPaymentStatusVnpay);
        } else {
          return res.redirect(process.env.returnPaymentStatusVnpay);
        }
      })
      .catch((err) => {
        return next(err);
      });
  } else {
    return next({ statusCode: 401, message: "Invalid secure hash" });
  }
};

export const repayment = (req, res, next) => {};

export const checkBookingStatus = (req, res, next) => {
  const bookingCode = req.params.bookingCode;

  db.bookings
    .findOne({
      order: [["createdAt", "ASC"]],
      where: {
        bookingCode,
      },
      include: [
        {
          model: db.allCodes,
          as: "bookingStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentTypeDataBookings",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.allCodes,
          as: "paymentStatusData",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.users,
          as: "userDataBookings",
          include: [
            {
              model: db.photos,
              as: "avatarData",
              attributes: ["url"],
            },
            {
              model: db.allCodes,
              as: "genderData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "roleData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.allCodes,
              as: "userStatusData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.rooms,
          as: "roomDataBookings",
          include: [
            {
              model: db.allCodes,
              as: "roomTypeDataRooms",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.roomTypes,
              as: "roomTypesDataRooms",
              include: [
                {
                  model: db.allCodes,
                  as: "bedTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.photos,
                  as: "photosDataRoomTypes",
                  attributes: ["url", "type"],
                },
                {
                  model: db.amenities,
                  as: "amenitiesData",
                  include: [
                    {
                      model: db.allCodes,
                      as: "amenitiesTypeData",
                      attributes: ["valueVi", "valueEn"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      raw: false,
      nest: true,
    })
    .then((data) => {
      if (data) {
        return res.status(200).json({ data });
      } else {
        return next({ statusCode: 404, message: "Not found" });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
