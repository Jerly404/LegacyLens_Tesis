import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

DIRECTORY = "/home/jerly404/dev/Tesis/frontend/dist/frontend/browser"

class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        fpath = os.path.join(DIRECTORY, self.path.lstrip("/").split("?")[0])
        if not os.path.exists(fpath) or os.path.isdir(fpath):
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4200
    server = HTTPServer(("127.0.0.1", port), SPAHandler)
    print(f"Serving SPA from {DIRECTORY} on http://127.0.0.1:{port}", flush=True)
    server.serve_forever()
