from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8000", "http://127.0.0.1:8000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def send_contact():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        
        print(f"Form received: {data}")
        
        # Validate required fields
        if not all(k in data for k in ['name', 'email', 'type', 'date', 'guests', 'message']):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = os.getenv('EMAIL_USER')
        msg['To'] = os.getenv('RECIPIENT_EMAIL')
        msg['Subject'] = f"New Quote Request from {data['name']}"
        
        # Create HTML email body
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #b8860b;">New Event Quote Request</h2>
                <hr>
                <p><strong>Name:</strong> {data['name']}</p>
                <p><strong>Email:</strong> {data['email']}</p>
                <p><strong>Event Type:</strong> {data['type']}</p>
                <p><strong>Event Date:</strong> {data['date']}</p>
                <p><strong>Guest Count:</strong> {data['guests']}</p>
                <hr>
                <h3>Message:</h3>
                <p>{data['message']}</p>
                <hr>
                <p style="font-size: 12px; color: #999;">
                    This email was sent from lukhanyapro.co.za contact form
                </p>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email via Gmail SMTP
        print(f"Attempting to send email to: {os.getenv('RECIPIENT_EMAIL')}")
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASSWORD'))
            server.send_message(msg)
        
        print("Email sent successfully!")
        
        return jsonify({
            'success': True, 
            'message': 'Quote request sent! We\'ll be in touch soon.'
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False, 
            'error': f'Failed to send email: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Server is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8001)