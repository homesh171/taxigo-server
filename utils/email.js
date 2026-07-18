const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email error:', error)
  } else {
    console.log('Email server ready!')
  }
})

const sendBookingConfirmation = async (customerEmail, customerName, booking) => {
  const mailOptions = {
    from: `TaxiGo <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Confirmed - TaxiGo #${booking._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; }
          .header { background: #111; padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header span { color: #EAB308; }
          .body { padding: 32px; }
          .greeting { font-size: 18px; color: #333; margin-bottom: 8px; }
          .message { color: #666; margin-bottom: 24px; }
          .booking-card { background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 10px; padding: 24px; margin-bottom: 24px; }
          .booking-card h3 { color: #111; margin: 0 0 16px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .row:last-child { border-bottom: none; }
          .label { color: #888; font-size: 14px; }
          .value { color: #111; font-size: 14px; font-weight: bold; }
          .total-row { background: #111; border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; margin-top: 16px; }
          .total-label { color: white; font-size: 15px; }
          .total-value { color: #EAB308; font-size: 18px; font-weight: bold; }
          .badge { display: inline-block; background: #EAB308; color: #111; font-weight: bold; padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-bottom: 24px; }
          .info-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
          .info-box p { margin: 0; color: #92400e; font-size: 14px; }
          .button { display: block; width: fit-content; margin: 0 auto 24px; background: #EAB308; color: #111; font-weight: bold; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-size: 15px; }
          .footer { background: #111; padding: 20px; text-align: center; }
          .footer p { color: #666; font-size: 12px; margin: 4px 0; }
          .footer a { color: #EAB308; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Taxi<span>Go</span></h1>
            <p style="color:#999; margin:8px 0 0; font-size:13px;">UK Airport Transfers</p>
          </div>

          <div class="body">
            <p class="greeting">Hi ${customerName}! 👋</p>
            <p class="message">Your airport transfer has been successfully booked. Here are your booking details:</p>

            <div style="text-align:center">
              <span class="badge">✅ Booking Confirmed</span>
            </div>

            <div class="booking-card">
              <h3>Booking Details</h3>
              <div class="row">
                <span class="label">Booking Reference</span>
                <span class="value">#${booking._id.toString().slice(-6).toUpperCase()}</span>
              </div>
              <div class="row">
                <span class="label">Pickup Location</span>
                <span class="value">${booking.pickup}</span>
              </div>
              <div class="row">
                <span class="label">Drop-off Location</span>
                <span class="value">${booking.dropoff}</span>
              </div>
              <div class="row">
                <span class="label">Date</span>
                <span class="value">${booking.date}</span>
              </div>
              <div class="row">
                <span class="label">Time</span>
                <span class="value">${booking.time}</span>
              </div>
              <div class="row">
                <span class="label">Passengers</span>
                <span class="value">${booking.passengers}</span>
              </div>
              <div class="row">
                <span class="label">Vehicle</span>
                <span class="value">${booking.vehicle}</span>
              </div>
              ${booking.flight ? `
              <div class="row">
                <span class="label">Flight Number</span>
                <span class="value">${booking.flight}</span>
              </div>` : ''}
              <div class="total-row">
                <span class="total-label">Total Price</span>
                <span class="total-value">£${booking.price}</span>
              </div>
            </div>

            <div class="info-box">
              <p>⏰ Your driver will be assigned shortly. You will receive another email with your driver's details before your journey.</p>
            </div>

            <a href="https://taxigo-pi.vercel.app/dashboard" class="button">View My Booking →</a>

            <p style="color:#666; font-size:13px; text-align:center;">Need help? Contact us at <a href="mailto:londonchauffeur586@gmail.com" style="color:#EAB308;">londonchauffeur586@gmail.com</a> or call <strong>+44 1234 567890</strong></p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} TaxiGo — UK Airport Transfers</p>
            <p><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  await transporter.sendMail(mailOptions)
}


const sendDriverAssigned = async (customerEmail, customerName, booking, driver) => {
  const mailOptions = {
    from: `TaxiGo <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Driver Assigned - TaxiGo #${booking._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; }
          .header { background: #111; padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header span { color: #EAB308; }
          .body { padding: 32px; }
          .driver-card { background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 10px; padding: 24px; margin: 24px 0; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .row:last-child { border-bottom: none; }
          .label { color: #888; font-size: 14px; }
          .value { color: #111; font-size: 14px; font-weight: bold; }
          .footer { background: #111; padding: 20px; text-align: center; }
          .footer p { color: #666; font-size: 12px; margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Taxi<span>Go</span></h1>
          </div>
          <div class="body">
            <p style="font-size:18px; color:#333;">Hi ${customerName}! 🚗</p>
            <p style="color:#666;">Great news! Your driver has been assigned for your upcoming transfer.</p>

            <div class="driver-card">
              <h3 style="margin:0 0 16px; color:#111; text-transform:uppercase; letter-spacing:1px; font-size:14px;">Your Driver</h3>
              <div class="row">
                <span class="label">Driver Name</span>
                <span class="value">${driver.name}</span>
              </div>
              <div class="row">
                <span class="label">Phone Number</span>
                <span class="value">${driver.phone}</span>
              </div>
              <div class="row">
                <span class="label">Pickup</span>
                <span class="value">${booking.pickup}</span>
              </div>
              <div class="row">
                <span class="label">Date & Time</span>
                <span class="value">${booking.date} at ${booking.time}</span>
              </div>
            </div>

            <p style="color:#666; font-size:14px;">Your driver will meet you at arrivals with a <strong>TaxiGo name board</strong>. Please save your driver's number in case you need to contact them.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TaxiGo — UK Airport Transfers</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendBookingConfirmation, sendDriverAssigned }