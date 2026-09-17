import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'gemini-api',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);
                  
                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: "Missing API Key. Ensure GEMINI_API_KEY or GOOGLE_API_KEY is configured in the environment." }));
                    return;
                  }

                  const ai = new GoogleGenAI({
                    apiKey,
                    httpOptions: {
                      headers: {
                        'x-goog-api-key': apiKey
                      }
                    }
                  });

                  const chat = ai.chats.create({
                    model: "gemini-3.6-flash",
                    config: {
                      systemInstruction: data.systemInstruction
                    },
                    history: data.contents || []
                  });

                  const result = await chat.sendMessage({ message: data.message });
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ text: result.text }));
                } catch (e) {
                  const status = e.status || 500;
                  const googleError = e.errorDetails ? e.errorDetails : e.message;
                  console.error("Gemini API Error:", {
                    status: status,
                    message: e.message,
                    details: googleError,
                    model: "gemini-3.6-flash"
                  });
                  res.statusCode = status;
                  res.end(JSON.stringify({ error: e.message, model: "gemini-3.6-flash" }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        }
      },
      {
        name: 'grievance-api',
        configureServer(server) {
          server.middlewares.use('/api/send-grievance', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);
                  const { name, age, location, email, grievance } = data;
                  
                  if (!name || !age || !location || !email || !grievance) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: "Missing required fields." }));
                    return;
                  }

                  const resendApiKey = env.RESEND_API_KEY;
                  const notificationEmail = env.AURA_NOTIFICATION_EMAIL;

                  if (!resendApiKey) {
                     res.statusCode = 500;
                     res.setHeader('Content-Type', 'application/json');
                     res.end(JSON.stringify({ error: "Server email configuration is missing (RESEND_API_KEY)." }));
                     return;
                  }

                  if (!notificationEmail) {
                     res.statusCode = 500;
                     res.setHeader('Content-Type', 'application/json');
                     res.end(JSON.stringify({ error: "Server email configuration is missing (AURA_NOTIFICATION_EMAIL)." }));
                     return;
                  }

                  const { Resend } = await import('resend');
                  const resend = new Resend(resendApiKey);
                  const date = new Date().toLocaleDateString();
                  const time = new Date().toLocaleTimeString();

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
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: sendError.message }));
                    return;
                  }

                  if (!emailData?.id) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: 'Resend did not return an email ID' }));
                    return;
                  }

                  console.log("RESEND SUCCESS - Email ID:", emailData.id);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, id: emailData.id }));
                } catch (e) {
                  console.error("RESEND CATCH ERROR:", e.message, e.stack);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        }
      }
    ],
  };
});
