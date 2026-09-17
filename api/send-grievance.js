import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    const { name, age, location, email, grievance } = data;
    
    if (!name || !age || !location || !email || !grievance) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.AURA_NOTIFICATION_EMAIL;

    if (!resendApiKey) {
       return res.status(500).json({ error: "Server email configuration is missing (RESEND_API_KEY)." });
    }

    if (!notificationEmail) {
       return res.status(500).json({ error: "Server email configuration is missing (AURA_NOTIFICATION_EMAIL)." });
    }

    const resend = new Resend(resendApiKey);
    const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); color: #333;">
        <h2 style="color: #6d28d9; text-align: center; margin-bottom: 24px;">🦸 Someone Needs Your Help!</h2>
        <p style="font-size: 16px; color: #4b5563; text-align: center;">Someone has reached out to Aura for help. ✨</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="color: #4f46e5; margin-top: 0; margin-bottom: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Visitor Details</h3>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Age:</strong> ${age}</p>
          <p style="margin: 8px 0;"><strong>Location:</strong> ${location}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        </div>

        <div style="background: #eef2ff; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #6366f1;">
          <h3 style="color: #4f46e5; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Request / Grievance</h3>
          <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #1f2937;">${grievance}</p>
        </div>

        <div style="font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 16px 0 0 0; text-align: center; font-style: italic;">This request was submitted through the Aura Heart-Bright Help Portal.</p>
        </div>
      </div>
    `;

    console.log("RESEND: Attempting to send email to:", email);

    const { data: emailData, error: sendError } = await resend.emails.send({
      from: 'Aura <onboarding@resend.dev>',
      to: [notificationEmail],
      subject: '🦸 Someone Needs Your Help!',
      html: htmlContent,
    });

    if (sendError) {
      console.error("RESEND ERROR:", {
          name: sendError.name,
          message: sendError.message,
          statusCode: sendError.statusCode
      });
      return res.status(500).json({ success: false, error: sendError.message });
    }

    if (!emailData?.id) {
      return res.status(500).json({ success: false, error: 'Resend did not return an email ID' });
    }

    console.log("RESEND SUCCESS - Email ID:", emailData.id);
    return res.status(200).json({ success: true, id: emailData.id });
  } catch (e) {
    console.error("RESEND CATCH ERROR:", e.message, e.stack);
    return res.status(500).json({ error: e.message });
  }
}
