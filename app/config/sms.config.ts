export const smsConfig = {
  clientId: process.env.ORANGE_SMS_CLIENT_ID || '',
  clientSecret: process.env.ORANGE_SMS_CLIENT_SECRET || '',
  senderName: process.env.ORANGE_SMS_SENDER_NAME || '',
  apiUrl: process.env.ORANGE_SMS_API_URL || 'https://api.orange.com'
}; 