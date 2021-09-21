#!/usr/bin/env python3

import youtube_dl

from urllib.error import URLError, HTTPError
from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread

in_progress = set()

class DownloadThread(Thread):
    def __init__(self, url):
        Thread.__init__(self)
        self.url = url

    def run(self):
        self.outtmpl = input("video filename template❓ ")
        if len(self.outtmpl) > 0:
            try:
                ytdl_opts = {
                    "nooverwrites": True,
                    "forcefilename": True,
                    "outtmpl": self.outtmpl,
                    "quiet": True,
                    "progress_hooks": [self.report_finished]
                }
                with youtube_dl.YoutubeDL(ytdl_opts) as ytdl:
                    ytdl.download([self.url])
            except HTTPError as e:
                print("Download failed:")
                print(e)
            except URLError as e:
                if hasattr(e, "reason"):
                    print("We failed to reach a server.")
                    print("Reason: ", e.reason)
                elif hasattr(e, "code"):
                    print("The server couldn't fulfill the request.")
                    print("Error code: ", e.code)
        else:
            print("Empty filename. Download cancelled.")

    def report_finished(self, s):
        if s['status'] == 'finished':
            msg = f"Download completed: [{self.outtmpl}]"
            if s.get('filename') is not None:
                msg + f", filename: {s['filename']}"
            if s.get('total_bytes') is not None:
                msg + f", total bytes: {s['total_bytes']}"
            print(msg)

class RequestHandler(BaseHTTPRequestHandler):
    def log_request(code, size):
        pass

    def do_GET(self):
        url = self.path[1:]
        try:
            if url not in in_progress:
                in_progress.add(url)
                thread = DownloadThread(url)
                thread.start()
            else:
                print(f"Already downloading {url}")
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        except ValueError as e:
            self.send_response(500, str(e))
            self.end_headers()

def main():
    server = HTTPServer(('127.0.0.1', 5000), RequestHandler)
    server.serve_forever()

if __name__ == "__main__":
    main()
