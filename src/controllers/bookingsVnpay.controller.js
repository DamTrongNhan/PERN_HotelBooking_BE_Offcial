import db from "../models";
import dayjs from "dayjs";

import sortObject from "../utils/sortObject";
let crypto = require("crypto");
let querystring = require("qs");
import createVnpayUrl from "../utils/createVnpauUrl";

import { sendConfirmation } from "../utils/sendMail";
let buildUrlConfirm = (token, bookingId) => {
  let result = "";
  result = `${process.env.REACT_URL}/verify-booking?token=${token}&bookingId=${bookingId}`;
  return result;
};

export const createBookingWithVnpay = (req, res, next) => {
  const { language, checkIn, checkOut, paymentTypeKey, ...others } = req.body;
  const dataBooking = { ...others };

  const checkInDate = dayjs(checkIn).toDate();
  const checkOutDate = dayjs(checkOut).toDate();

  if (checkInDate > checkOutDate) {
    return res.status(400).json({ message: "Invalid time" });
  }

  db.bookings
    .create({
      ...dataBooking,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    })
    .then((createBooking) => {
      if (createBooking) {
        db.payments
          .create({
            bookingCode: createBooking.bookingCode,
            paymentTypeKey,
            paymentStatusKey: "SP1",
          })
          .then((createBookingPayment) => {
            if (createBookingPayment) {
              {
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
                        .then((sendMail) => {
                          if (sendMail) {
                            let ipAddr =
                              req.headers["x-forwarded-for"] ||
                              req.connection.remoteAddress ||
                              req.socket.remoteAddress ||
                              req.connection.socket.remoteAddress;

                            const paymentUrl = createVnpayUrl(
                              createBooking,
                              language,
                              ipAddr
                            );
                            return res.status(200).json({ paymentUrl });
                          } else {
                            return next({
                              statusCode: 404,
                              message: "Not found",
                            });
                          }
                        })
                        .catch((error) => next(error));
                    } else {
                      return next({ statusCode: 404, message: "Not found" });
                    }
                  })
                  .catch((error) => next(error));
              }
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

export const getVnpayResult = async (req, res, next) => {
  try {
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
      const amount = vnp_Params["vnp_Amount"];
      const txnRef = vnp_Params["vnp_TxnRef"];
      // const payDate = vnp_Params["vnp_PayDate"];
      const bankCode = vnp_Params["vnp_BankCode"];
      const bankTranNo = vnp_Params["vnp_BankTranNo"];
      const cardType = vnp_Params["vnp_CardType"];
      const transactionNo = vnp_Params["vnp_TransactionNo"];

      let isSuccess = false,
        message = "Payment failed";

      if (vnp_Params["vnp_TransactionStatus"] === "00") {
        isSuccess = true;
        message = "Payment success";
      }
      if (isSuccess) {
        await db.payments.update(
          {
            paymentStatusKey: "SP2",
            details: `<p>Mã giao dịch VNPAY:&nbsp;${transactionNo}</p>
            <p>Số tiền:&nbsp;${amount / 100}vnd</p>
            <p>Mã ngân hàng thanh toán:&nbsp;${bankCode}</p>
            <p>Mã giao dịch tại Ngân hàng:&nbsp;${bankTranNo}</p>
            <p>Loại tài khoản/thẻ khách hàng sử dụng:&nbsp;${cardType} </p>`,
          },
          {
            where: {
              bookingCode: txnRef,
            },
          }
        );
      }
      res.cookie(
        "paymentStatus",
        JSON.stringify({
          bookingCode: vnp_Params["vnp_TxnRef"],
          isSuccess,
          message,
        }),
        {
          expires: new Date(Date.now() + 5 * 60 * 1000),
        }
      );
      return res.redirect(process.env.returnPaymentStatusVnpay);
    } else {
      return next({ statusCode: 401, message: "Invalid secure hash" });
    }
  } catch (err) {
    return next(err);
  }
};

export const repayment = (req, res, next) => {
  const { bookingData, language } = req.body;

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const paymentUrl = createVnpayUrl(bookingData, language, ipAddr);

  return res.status(200).json({ paymentUrl });
};
