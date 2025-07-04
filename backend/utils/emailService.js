const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();

    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
          <h1>🚀 HEART - New Contact Inquiry</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #1e3a8a;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Interest:</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.interest}</td>
            </tr>
          </table>
          
          <h3 style="color: #1e3a8a; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-left: 4px solid #fbbf24; margin: 10px 0;">
            ${contactData.message}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
            <p><strong>Priority:</strong> ${contactData.priority || 'medium'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center;">
          <p>Please respond to this inquiry within 24 hours.</p>
          <p>© 2024 HEART Technology Park</p>
        </div>
      </div>
    `;

    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
          <h1>🚀 HEART - Thank You for Your Interest</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #1e3a8a;">Dear ${contactData.name},</h2>
          
          <p>Thank you for your interest in HEART Technology Park. We have received your inquiry and our team will review it shortly.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Your Inquiry Summary:</h3>
            <p><strong>Interest:</strong> ${contactData.interest}</p>
            <p><strong>Company:</strong> ${contactData.company || 'N/A'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Our team typically responds within 1-2 business days. For urgent matters, please contact us directly at:</p>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>📞 Phone:</strong> +84 28 1234 5678</p>
            <p><strong>✉️ Email:</strong> info@heart.com</p>
            <p><strong>🏢 Address:</strong> Ho Chi Minh City High-tech Park, District 9, Ho Chi Minh City</p>
          </div>
          
          <p>We look forward to discussing how HEART can support your technology and business needs.</p>
          
          <p>Best regards,<br>
          <strong>HEART Business Development Team</strong></p>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center;">
          <p>© 2024 HEART Technology Park - Future of Technology</p>
          <p>🌐 www.heart.com | 📱 Follow us on social media</p>
        </div>
      </div>
    `;

    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'admin@heart.com',
      subject: `🚀 HEART - New ${contactData.interest} Inquiry from ${contactData.name}`,
      html: adminEmailContent
    };

    const customerMailOptions = {
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: '🚀 HEART - Thank You for Your Interest',
      html: customerEmailContent
    };

    const [adminResult, customerResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    return {
      adminEmailSent: true,
      customerEmailSent: true,
      adminMessageId: adminResult.messageId,
      customerMessageId: customerResult.messageId
    };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      adminEmailSent: false,
      customerEmailSent: false,
      error: error.message
    };
  }
};

const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
          <h1>🚀 Welcome to HEART</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #1e3a8a;">Hello ${user.firstName || user.username},</h2>
          
          <p>Welcome to HEART Technology Park! Your account has been successfully created.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Account Details:</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
          </div>
          
          <p>You can now access our platform and stay updated with the latest news and developments.</p>
          
          <p>Best regards,<br>
          <strong>HEART Team</strong></p>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center;">
          <p>© 2024 HEART Technology Park - Future of Technology</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: '🚀 Welcome to HEART Technology Park',
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { sent: true, messageId: result.messageId };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { sent: false, error: error.message };
  }
};

module.exports = {
  sendContactNotification,
  sendWelcomeEmail
};