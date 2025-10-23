import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'hq@koopi.online';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface VerificationEmailData {
  to: string;
  displayName: string;
  verificationLink: string;
}

interface WelcomeEmailData {
  to: string;
  displayName: string;
  storeName: string;
  storeUrl: string;
  dashboardUrl: string;
}

export async function sendVerificationEmail(data: VerificationEmailData): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const msg = {
      to: data.to,
      from: FROM_EMAIL,
      subject: 'Verify your Koopi account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center; background-color: #ffffff;">
                  <h1 style="margin: 0; color: #1a1a1a; font-size: 32px; font-weight: 700;">Koopi</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Welcome to Koopi, ${data.displayName}! 🎉</h2>
                        <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                          Thank you for creating your account. We're excited to have you on board!
                        </p>
                        <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                          To complete your registration and start building your online store, please verify your email address by clicking the button below:
                        </p>
                        <table role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 6px; background-color: #6366f1;">
                              <a href="${data.verificationLink}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                          If you didn't create this account, you can safely ignore this email.
                        </p>
                        <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                          If the button doesn't work, copy and paste this link into your browser:<br>
                          <a href="${data.verificationLink}" style="color: #6366f1; word-break: break-all;">${data.verificationLink}</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    © 2025 Koopi. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Welcome to Koopi, ${data.displayName}!\n\nThank you for creating your account. To complete your registration, please verify your email address by visiting:\n\n${data.verificationLink}\n\nIf you didn't create this account, you can safely ignore this email.\n\n© 2025 Koopi. All rights reserved.`,
    };

    await sgMail.send(msg);
    console.log('Verification email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const msg = {
      to: data.to,
      from: FROM_EMAIL,
      subject: `Welcome to Koopi - Your store "${data.storeName}" is ready! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Koopi</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f7;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center; background-color: #ffffff;">
                  <h1 style="margin: 0; color: #1a1a1a; font-size: 32px; font-weight: 700;">Koopi</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Congratulations, ${data.displayName}! 🎉</h2>
                        <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                          Your store "<strong>${data.storeName}</strong>" is now live and ready to accept orders!
                        </p>
                        <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #6366f1;">
                          <p style="margin: 0 0 10px; color: #1a1a1a; font-size: 14px; font-weight: 600;">Your store URL:</p>
                          <a href="${data.storeUrl}" target="_blank" style="color: #6366f1; font-size: 16px; text-decoration: none; word-break: break-all;">${data.storeUrl}</a>
                        </div>
                        <h3 style="margin: 30px 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">Quick Start Guide:</h3>
                        <ol style="margin: 0 0 30px; padding-left: 20px; color: #4a4a4a; font-size: 15px; line-height: 1.8;">
                          <li>Add your first products</li>
                          <li>Customize your store settings</li>
                          <li>Upload your store logo</li>
                          <li>Share your store URL with customers</li>
                        </ol>
                        <table role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 6px; background-color: #6366f1;">
                              <a href="${data.dashboardUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                Go to Dashboard
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                          Need help? Reply to this email or visit our support center at <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@koopi.online'}" style="color: #6366f1;">support@koopi.online</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    © 2025 Koopi. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Congratulations, ${data.displayName}!\n\nYour store "${data.storeName}" is now live and ready to accept orders!\n\nYour store URL: ${data.storeUrl}\n\nQuick Start Guide:\n1. Add your first products\n2. Customize your store settings\n3. Upload your store logo\n4. Share your store URL with customers\n\nGo to Dashboard: ${data.dashboardUrl}\n\nNeed help? Reply to this email or contact us at ${process.env.SUPPORT_EMAIL || 'support@koopi.online'}\n\n© 2025 Koopi. All rights reserved.`,
    };

    await sgMail.send(msg);
    console.log('Welcome email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}
