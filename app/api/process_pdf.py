from http.server import BaseHTTPRequestHandler
from pdf2image import convert_from_bytes
import json
import base64

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            pdf_bytes = base64.b64decode(post_data)
            images = convert_from_bytes(pdf_bytes)
            
            # Process images as needed
            # For this example, we'll just return the number of pages
            result = {"status": "success", "page_count": len(images)}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())