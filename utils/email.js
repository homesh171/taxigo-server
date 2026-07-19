const Brevo = require('@getbrevo/brevo')

const client = Brevo.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.BREVO_API_KEY

const emailApi = new Brevo.TransactionalEmailsApi()

const sendBookingConfirmation = async (customerEmail, customerName, booking) => {
  try {
    const email = new Brevo.SendSmtpEmail()
    email.subject = `Booking Confirmed - TaxiGo #${booking._id.toString().slice(-6).toUpperCase()}`
    email.to = [{ email: customerEmail, name: customerName }]
    email.sender = { email: 'londonchauffeur586@gmail.com', name: 'TaxiGo' }
    email.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #111; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">Taxi<span style="color: #EAB308;">Go</span></h1>
          <p style="color: #999; margin: 8px 0 0; font-size: 13px;">UK Airport Transfers</p>
        </div>
        <div style="padding: 32px; background: white;">
          <p style="font-size: 18px; color: #333;">Hi ${customerName}! 👋</p>
          <p style="color: #666;">Your airport transfer has been successfully booked!</p>
          <div style="background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 10px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px; color: #111; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Reference</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">#${booking._id.toString().slice(-6).toUpperCase()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Pickup</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.pickup}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Drop-off</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.dropoff}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Date</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Time</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.time}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Vehicle</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.vehicle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Passengers</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.passengers}</td>
              </tr>
              ${booking.flight ? `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Flight</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.flight}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 14px 0; color: #111; font-weight: bold; font-size: 15px;">Total Price</td>
                <td style="padding: 14px 0; color: #EAB308; font-weight: bold; font-size: 18px; text-align: right;">£${booking.price}</td>
              </tr>
            </table>
          </div>
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">⏰ Your driver will be assigned shortly. You will receive another email with your driver details.</p>
          </div>
          <a href="https://taxigo-pi.vercel.app/dashboard" style="display: block; width: fit-content; margin: 0 auto 24px; background: #EAB308; color: #111; font-weight: bold; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-size: 15px;">View My Booking →</a>
          <p style="color: #666; font-size: 13px; text-align: center;">Need help? Email us at londonchauffeur586@gmail.com</p>
        </div>
        <div style="background: #111; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #666; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} TaxiGo — UK Airport Transfers</p>
        </div>
      </div>
    `
    const result = await emailApi.sendTransacEmail(email)
    console.log('Email sent successfully:', result.messageId)
  } catch (err) {
    console.log('Email error:', err.message)
  }
}

const sendDriverAssigned = async (customerEmail, customerName, booking, driver) => {
  try {
    const email = new Brevo.SendSmtpEmail()
    email.subject = `Driver Assigned - TaxiGo #${booking._id.toString().slice(-6).toUpperCase()}`
    email.to = [{ email: customerEmail, name: customerName }]
    email.sender = { email: 'londonchauffeur586@gmail.com', name: 'TaxiGo' }
    email.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #111; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">Taxi<span style="color: #EAB308;">Go</span></h1>
        </div>
        <div style="padding: 32px; background: white;">
          <p style="font-size: 18px; color: #333;">Hi ${customerName}! 🚗</p>
          <p style="color: #666;">Great news! Your driver has been assigned for your upcoming transfer.</p>
          <div style="background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 10px; padding: 24px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Driver Name</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${driver.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Phone</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${driver.phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Pickup</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.pickup}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 14px;">Date & Time</td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right;">${booking.date} at ${booking.time}</td>
              </tr>
            </table>
          </div>
          <p style="color: #666; font-size: 14px;">Your driver will meet you at arrivals with a <strong>TaxiGo name board</strong>. Please save your driver's number.</p>
        </div>
        <div style="background: #111; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #666; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} TaxiGo — UK Airport Transfers</p>
        </div>
      </div>
    `
    await emailApi.sendTransacEmail(email)
    console.log('Driver assigned email sent!')
  } catch (err) {
    console.log('Driver email error:', err.message)
  }
}

module.exports = { sendBookingConfirmation, sendDriverAssigned }