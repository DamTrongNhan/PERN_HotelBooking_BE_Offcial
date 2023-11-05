import transporter from "../config/nodemailer";

import dayjs from "dayjs";
import "dotenv/config";

export const sendConfirmation = async (dataSend) => {
  return new Promise((resolve, reject) => {
    const info = {
      from: process.env.EMAIL_APP_SENDER,
      to: dataSend.email,
      subject:
        dataSend.language === "vi"
          ? "Thông báo đặt phòng thành công"
          : "Successful Booking Confirmation",
      html: getBodyHTMLConfirmation(dataSend),
    };

    transporter.sendMail(info, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
let getBodyHTMLConfirmation = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h2>Thông báo đặt phòng thành công</h2>
    <p>Chào ông/bà ${dataSend.lastName} ${dataSend.firstName},</p>
    <p>Chúng tôi xin gửi lời cám ơn vì đã chọn khách sạn chúng tôi làm điểm đến của bạn. Chúng tôi xin thông báo rằng đặt phòng của bạn đã được xác nhận thành công.</p>
    <h3>Thông tin đặt phòng</h3>
    <ul>
        <li>Mã đặt phòng: ${dataSend.bookingCode}</li>
        <li>Ngày nhận phòng: ${dayjs(dataSend.checkIn).format(
          "DD/MM/YYYY"
        )}</li>
        <li>Ngày trả phòng: ${dayjs(dataSend.checkOut).format(
          "DD/MM/YYYY"
        )}</li>
        <li>Số đêm: ${dataSend.days}</li>
        <li>Số khách người lớn: ${dataSend.adult}</li>
        <li>Số khách trẻ em: ${dataSend.child}</li>
    </ul>
    <p>Vui lòng giữ mã đặt phòng này để sử dụng trong trường hợp cần thay đổi hoặc hủy đặt phòng.</p>
    <p>Để xác nhận đặt phòng của bạn, vui lòng nhấp vào liên kết sau: <a href=${
      dataSend.urlConfirm
    } target="_blank">Xác nhận đặt phòng</a></p>
    <p>Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu đặc biệt nào, xin vui lòng liên hệ với chúng tôi qua số điện thoại 077 215 0555 hoặc email nhanmanor23@gmail.com</p>
    <p>Một lần nữa, chúng tôi xin chân thành cảm ơn sự lựa chọn của bạn và mong muốn mang đến cho bạn một trải nghiệm tuyệt vời tại khách sạn chúng tôi.</p>
    <p>Trân trọng,</p>
    <p>Nhan Manor</p>`;
  } else if (dataSend.language === "en") {
    result = `<h2>Successful Booking Confirmation</h2>
    <p>Dear ${dataSend.firstName} ${dataSend.lastName},</p>
    <p>We would like to express our gratitude for choosing our hotel as your destination. We are pleased to inform you that your booking has been successfully confirmed.</p>
    <h3>Booking Details</h3>
    <ul>
        <li>Booking code: ${dataSend.bookingCode}</li>
        <li>Check-in date: ${dayjs(dataSend.checkIn).format("DD/MM/YYYY")}</li>
        <li>Check-out date: ${dayjs(dataSend.checkOut).format(
          "DD/MM/YYYY"
        )}</li>
        <li>Number of nights: ${dataSend.days}</li>
        <li>Number of adult guests:  ${dataSend.adult}</li>
        <li>Number of children guests:  ${dataSend.child}</li>
    </ul>
    <p>Please keep this booking code for any changes or cancellations.</p>
    <p>To confirm your booking, please click on the following link: <a href=${
      dataSend.urlConfirm
    } target="_blank" >Booking Confirmation</a></p>
    <p>If you have any questions or special requests, please feel free to contact us at 077 215 0555 or nhanmanor23@gmail.com</p>
    <p>Once again, we sincerely appreciate your choice and look forward to providing you with an excellent experience at our hotel.</p>
    <p>Best regards,</p>
    <p>Nhan Manor</p>`;
  }
  return result;
};

export const sendThankYouEmail = async (dataSend) => {
  return new Promise((resolve, reject) => {
    const info = {
      from: process.env.EMAIL_APP_SENDER,
      to: dataSend.email,
      subject:
        dataSend.language === "vi"
          ? "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi"
          : "Thank you for choosing our hotel",
      html: getBodyEmailThankYou(dataSend),
    };

    transporter.sendMail(info, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

let getBodyEmailThankYou = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h2>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</h2>
    <p>Kính gửi quý khách hàng,</p>
    <p>Chúng tôi xin gửi lời cảm ơn chân thành về việc quý khách đã lựa chọn khách sạn của chúng tôi trong thời gian gần đây.</p>
    <p>Chúng tôi hy vọng rằng quý khách đã có một trải nghiệm tuyệt vời tại khách sạn và hài lòng với dịch vụ của chúng tôi.</p>
    <p>Nếu có bất kỳ ý kiến đóng góp hoặc phản hồi nào, xin vui lòng liên hệ với chúng tôi. Chúng tôi luôn sẵn lòng lắng nghe và cải thiện để đáp ứng tốt hơn nhu cầu của quý khách.</p>
    <p>Một lần nữa, cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi. Chúng tôi rất mong được đón tiếp quý khách trở lại trong tương lai gần.</p>
    <p>Trân trọng,</p>
    <p>Đội ngũ khách sạn</p>`;
  } else if (dataSend.language === "en") {
    result = `<h2>Thank you for choosing our hotel</h2>
    <p>Dear valued guest,</p>
    <p>We would like to express our sincere gratitude for choosing to stay at our hotel during your recent visit.</p>
    <p>We hope that you had a wonderful experience at our hotel and were pleased with our services.</p>
    <p>If you have any feedback or suggestions, please don't hesitate to reach out to us. We are always eager to listen and improve to better meet your needs.</p>
    <p>Once again, thank you for your trust and patronage. We look forward to welcoming you back in the near future.</p>
    <p>Best regards,</p>
    <p>The hotel team</p>`;
  }
  return result;
};

export const sendCancel = async (dataSend) => {
  return new Promise((resolve, reject) => {
    const info = {
      from: process.env.EMAIL_APP_SENDER,
      to: dataSend.email,
      subject:
        dataSend.language === "vi"
          ? "Thông báo hủy đặt phòng"
          : "Room Cancellation Notification",
      html: getBodyEmailCancel(dataSend),
    };

    transporter.sendMail(info, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

let getBodyEmailCancel = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h1>Thông báo hủy đặt phòng</h1>
    <p>Yêu cầu hủy đặt phòng của bạn đã được xử lý.</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào khác, vui lòng liên hệ với chúng tôi.</p>`;
  } else if (dataSend.language === "en") {
    result = `<h1>Room Cancellation Notification</h1>
    <p>Your room reservation has been cancelled.</p>
    <p>If you have any further questions, please don't hesitate to contact us.</p>`;
  }
  return result;
};

export const senAds = (dataSend) => {
  return new Promise((resolve, reject) => {
    const info = {
      from: process.env.EMAIL_APP_SENDER,
      to: dataSend.receiverEmails,
      subject: "Nhan Manor - Sự kiện ưu đãi đặc biệt",
      html: getPromotionalEmailBody(),
      attachments: [
        {
          filename: `event-${dayjs().getTime()}.png`,
          content: dataSend.imageBase64.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    transporter.sendMail(info, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

let getPromotionalEmailBody = (dataSend) => {
  return `<h2>Sự kiện ưu đãi đặc biệt!</h2>
  <p>Chào mừng bạn đến với Khách sạn Nhan Manor!</p>
  <p>Chúng tôi rất hân hạnh thông báo về sự kiện ưu đãi đặc biệt dành cho khách hàng thân yêu như bạn.</p>
  <p>Trong thời gian diễn ra sự kiện, bạn sẽ được tận hưởng những ưu đãi đặc biệt:</p>
  <ul>
    <li>Giảm giá 30% cho tất cả các loại phòng.</li>
    <li>Buffet sáng miễn phí hàng ngày.</li>
    <li>Dịch vụ đưa đón miễn phí từ sân bay.</li>
  </ul>
  <p>Hãy đặt ngay để trải nghiệm những ưu đãi tuyệt vời này.</p>
  <p>Thông tin liên hệ:</p>
  <ul>
    <li>Địa chỉ: 123 Đường ABC, Thành phố XYZ</li>
    <li>Điện thoại: 077 215 0555</li>
    <li>Email: nhanmanor@gmail.com</li>
  </ul>
  <p>Chúng tôi rất mong được đón tiếp bạn tại Khách sạn Nhan Manor!</p>
  <p>Trân trọng,</p>
  <p>Đội ngũ Khách sạn Nhan Manor</p>`;
};

export const sendForgotPassword = async (dataSend) => {
  return new Promise((resolve, reject) => {
    const info = {
      from: process.env.EMAIL_APP_SENDER,
      to: dataSend.email,
      subject:
        dataSend.language === "vi"
          ? "Thông báo cập nhật mật khẩu"
          : "Password Update Notification",
      html: getBodyEmailForgotPassword(dataSend),
    };

    transporter.sendMail(info, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

let getBodyEmailForgotPassword = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h1>Thông báo cập nhật mật khẩu</h1>
    <p>Chúng tôi đã nhận được yêu cầu cập nhật mật khẩu của bạn.</p>
    <p>Your OTP is: <b>${dataSend.otp}</b></p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua thông báo này.</p>`;
  } else if (dataSend.language === "en") {
    result = `<h1>Password Update Notification</h1>
    <p>We have received a request to update your password.</p>
    <p>Your OTP is: <b>${dataSend.otp}</b></p>
    <p>If you did not request a password reset, please ignore this message.</p>`;
  }
  return result;
};
