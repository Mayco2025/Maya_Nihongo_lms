export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  template: EmailTemplate;
  variables?: Record<string, string>;
}

export interface NotificationSettings {
  welcomeEmail: boolean;
  classReminders: boolean;
  qaNotifications: boolean;
  materialUpdates: boolean;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private baseUrl: string;

  constructor(apiKey: string, fromEmail: string, baseUrl: string = 'https://api.emailjs.com/api/v1.0/email/send') {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
    this.baseUrl = baseUrl;
  }

  // Send email using EmailJS or similar service
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'maya_lms_service',
          template_id: 'template_id',
          user_id: this.apiKey,
          template_params: {
            to_email: emailData.to,
            from_email: this.fromEmail,
            subject: this.replaceVariables(emailData.template.subject, emailData.variables),
            message_html: this.replaceVariables(emailData.template.html, emailData.variables),
            message_text: this.replaceVariables(emailData.template.text, emailData.variables),
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Email send failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  // Replace variables in template
  private replaceVariables(template: string, variables?: Record<string, string>): string {
    if (!variables) return template;
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  // Welcome email for new students
  async sendWelcomeEmail(userEmail: string, userName: string, studentId: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Welcome to Maya Nihongo LMS! 🌸',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e11d48; margin: 0;">🌸 Maya Nihongo LMS</h1>
            <p style="color: #64748b; margin: 10px 0;">Learning Japanese with Ethiopian Heart</p>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #e11d48; margin: 0 0 15px 0;">Welcome, {{userName}}!</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              Thank you for joining Maya Nihongo Learning Management System. We're excited to have you as part of our Japanese learning community!
            </p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Your Account Details</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Student ID:</strong> {{studentId}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Email:</strong> {{userEmail}}</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #0369a1; margin: 0 0 15px 0;">Getting Started</h3>
            <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Complete your profile information</li>
              <li>Browse available class schedules</li>
              <li>Access course materials</li>
              <li>Join the Q&A forum</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="{{loginUrl}}" style="background: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Maya LMS Team</p>
          </div>
        </div>
      `,
      text: `
Welcome to Maya Nihongo LMS!

Dear {{userName}},

Thank you for joining Maya Nihongo Learning Management System. We're excited to have you as part of our Japanese learning community!

Your Account Details:
- Student ID: {{studentId}}
- Email: {{userEmail}}

Getting Started:
1. Complete your profile information
2. Browse available class schedules
3. Access course materials
4. Join the Q&A forum

Access your dashboard: {{loginUrl}}

If you have any questions, please don't hesitate to contact us.

Best regards,
The Maya LMS Team
      `
    };

    return this.sendEmail({
      to: userEmail,
      template,
      variables: {
        userName,
        studentId,
        userEmail,
        loginUrl: `${window.location.origin}/login`
      }
    });
  }

  // Class reminder email
  async sendClassReminder(userEmail: string, userName: string, classDetails: {
    name: string;
    dateTime: string;
    duration: number;
    teacher: string;
    meetLink: string;
  }): Promise<boolean> {
    const template: EmailTemplate = {
      subject: '📚 Class Reminder: {{className}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e11d48; margin: 0;">📚 Class Reminder</h1>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #e11d48; margin: 0 0 15px 0;">Hello, {{userName}}!</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              This is a friendly reminder about your upcoming Japanese class.
            </p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Class Details</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Class:</strong> {{className}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Date & Time:</strong> {{classDateTime}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Duration:</strong> {{duration}} minutes</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Teacher:</strong> {{teacher}}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{meetLink}}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Join Class
            </a>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #0369a1; margin: 0 0 15px 0;">Preparation Tips</h3>
            <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Test your microphone and camera</li>
              <li>Have your materials ready</li>
              <li>Find a quiet environment</li>
              <li>Join 5 minutes early</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>See you in class!</p>
            <p>Best regards,<br>The Maya LMS Team</p>
          </div>
        </div>
      `,
      text: `
Class Reminder

Hello {{userName}}!

This is a friendly reminder about your upcoming Japanese class.

Class Details:
- Class: {{className}}
- Date & Time: {{classDateTime}}
- Duration: {{duration}} minutes
- Teacher: {{teacher}}

Join Class: {{meetLink}}

Preparation Tips:
1. Test your microphone and camera
2. Have your materials ready
3. Find a quiet environment
4. Join 5 minutes early

See you in class!

Best regards,
The Maya LMS Team
      `
    };

    const classDate = new Date(classDetails.dateTime);
    const formattedDateTime = classDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return this.sendEmail({
      to: userEmail,
      template,
      variables: {
        userName,
        className: classDetails.name,
        classDateTime: formattedDateTime,
        duration: classDetails.duration.toString(),
        teacher: classDetails.teacher,
        meetLink: classDetails.meetLink
      }
    });
  }

  // Q&A notification email
  async sendQANotification(userEmail: string, userName: string, questionDetails: {
    question: string;
    answer: string;
    answeredBy: string;
    answeredAt: string;
  }): Promise<boolean> {
    const template: EmailTemplate = {
      subject: '💡 Your question has been answered!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e11d48; margin: 0;">💡 Question Answered</h1>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #e11d48; margin: 0 0 15px 0;">Hello, {{userName}}!</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              Your question has been answered by one of our instructors.
            </p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Your Question</h3>
            <p style="color: #374151; line-height: 1.6; margin: 0; font-style: italic;">"{{question}}"</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #0369a1; margin: 0 0 15px 0;">Answer from {{answeredBy}}</h3>
            <p style="color: #374151; line-height: 1.6; margin: 0;">{{answer}}</p>
            <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">Answered on {{answeredAt}}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{qaUrl}}" style="background: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              View in Q&A Forum
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>Keep learning and asking questions!</p>
            <p>Best regards,<br>The Maya LMS Team</p>
          </div>
        </div>
      `,
      text: `
Question Answered

Hello {{userName}}!

Your question has been answered by one of our instructors.

Your Question:
"{{question}}"

Answer from {{answeredBy}}:
{{answer}}

Answered on {{answeredAt}}

View in Q&A Forum: {{qaUrl}}

Keep learning and asking questions!

Best regards,
The Maya LMS Team
      `
    };

    const answeredDate = new Date(questionDetails.answeredAt);
    const formattedDate = answeredDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return this.sendEmail({
      to: userEmail,
      template,
      variables: {
        userName,
        question: questionDetails.question,
        answer: questionDetails.answer,
        answeredBy: questionDetails.answeredBy,
        answeredAt: formattedDate,
        qaUrl: `${window.location.origin}/qanda`
      }
    });
  }

  // Material update notification
  async sendMaterialUpdateNotification(userEmail: string, userName: string, materialDetails: {
    lessonName: string;
    description: string;
    uploadedBy: string;
    accessLevel: string;
  }): Promise<boolean> {
    const template: EmailTemplate = {
      subject: '📚 New Course Material Available: {{lessonName}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e11d48; margin: 0;">📚 New Material Available</h1>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #e11d48; margin: 0 0 15px 0;">Hello, {{userName}}!</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              New course material has been uploaded and is now available for you.
            </p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Material Details</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Lesson:</strong> {{lessonName}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Description:</strong> {{description}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Uploaded by:</strong> {{uploadedBy}}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Access Level:</strong> {{accessLevel}}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{materialsUrl}}" style="background: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Access Materials
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>Happy learning!</p>
            <p>Best regards,<br>The Maya LMS Team</p>
          </div>
        </div>
      `,
      text: `
New Course Material Available

Hello {{userName}}!

New course material has been uploaded and is now available for you.

Material Details:
- Lesson: {{lessonName}}
- Description: {{description}}
- Uploaded by: {{uploadedBy}}
- Access Level: {{accessLevel}}

Access Materials: {{materialsUrl}}

Happy learning!

Best regards,
The Maya LMS Team
      `
    };

    return this.sendEmail({
      to: userEmail,
      template,
      variables: {
        userName,
        lessonName: materialDetails.lessonName,
        description: materialDetails.description,
        uploadedBy: materialDetails.uploadedBy,
        accessLevel: materialDetails.accessLevel,
        materialsUrl: `${window.location.origin}/materials`
      }
    });
  }
}

// Mock implementation for development
export class MockEmailService {
  async sendWelcomeEmail(userEmail: string, userName: string, studentId: string): Promise<boolean> {
    console.log('Mock: Welcome email sent to', userEmail, 'for', userName);
    return true;
  }

  async sendClassReminder(userEmail: string, userName: string, classDetails: any): Promise<boolean> {
    console.log('Mock: Class reminder sent to', userEmail, 'for class', classDetails.name);
    return true;
  }

  async sendQANotification(userEmail: string, userName: string, questionDetails: any): Promise<boolean> {
    console.log('Mock: Q&A notification sent to', userEmail);
    return true;
  }

  async sendMaterialUpdateNotification(userEmail: string, userName: string, materialDetails: any): Promise<boolean> {
    console.log('Mock: Material update notification sent to', userEmail);
    return true;
  }
}

// Export singleton instance
let emailInstance: EmailService | MockEmailService | null = null;

export const getEmailService = (apiKey?: string, fromEmail?: string): EmailService | MockEmailService => {
  if (!emailInstance) {
    if (apiKey && fromEmail && process.env.NODE_ENV === 'production') {
      emailInstance = new EmailService(apiKey, fromEmail);
    } else {
      emailInstance = new MockEmailService();
    }
  }
  return emailInstance;
}; 