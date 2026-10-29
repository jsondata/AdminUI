"""可选的本地演示服务器，使用 python3 tools/mock_server.py 启动。

接口使用固定演示账号，不包含生产数据，请勿部署到生产环境。
"""
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import json
import os

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = [
    {"id": 1, "name": "内容运营", "owner": "林然"},
    {"id": 2, "name": "产品设计", "owner": "周晴"},
    {"id": 3, "name": "数据分析", "owner": "许知远"},
    {"id": 4, "name": "客户支持", "owner": "陈一"},
    {"id": 5, "name": "质量测试", "owner": "王宁"},
]

class Handler(SimpleHTTPRequestHandler):
    def respond_json(self, status, value):
        body = json.dumps(value, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        path = urlparse(self.path).path
        try:
            size = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            return self.send_error(400)
        if size < 0 or size > 2 * 1024 * 1024:
            return self.respond_json(413, {'message': '文件不能超过 2 MB'})
        if path == '/api/demo-login':
            try:
                data = json.loads(self.rfile.read(size).decode('utf-8'))
            except (ValueError, UnicodeDecodeError):
                return self.respond_json(400, {'message': '请求格式错误'})
            if data.get('username') != 'demo' or data.get('password') != 'demo':
                return self.respond_json(401, {'message': '演示账号或密码错误'})
            return self.respond_json(200, {'code': 0, 'data': {'token': 'demo-session'}})
        if path == '/api/demo-upload':
            if self.headers.get('Authorization') != 'Bearer demo-session':
                return self.respond_json(401, {'message': '请先登录'})
            if not size:
                return self.respond_json(400, {'message': '请选择文件'})
            body = self.rfile.read(size)
            return self.respond_json(200, {'code': 0, 'data': {'size': len(body)}})
        return self.send_error(404)

    def do_GET(self):
        request = urlparse(self.path)
        if request.path == '/api/demo-private':
            if self.headers.get('Authorization') != 'Bearer demo-session':
                return self.respond_json(401, {'message': '请先登录'})
            return self.respond_json(200, {'code': 0, 'data': {'name': '演示用户'}})
        if request.path != '/api/projects':
            return super().do_GET()
        query = parse_qs(request.query)
        try:
            page = max(1, int(query.get('page', ['1'])[0]))
            size = min(100, max(1, int(query.get('pageSize', ['3'])[0])))
        except ValueError:
            return self.send_error(400, 'Invalid pagination')
        keyword = query.get('keyword', [''])[0].strip()
        rows = [row for row in PROJECTS if keyword in row['name']]
        body = json.dumps({'code': 0, 'data': {'rows': rows[(page-1)*size:page*size], 'total': len(rows)}}, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    os.chdir(ROOT)
    print('Demo: http://127.0.0.1:8301/docs/guide/integration.html?api=1', flush=True)
    try:
        HTTPServer(('127.0.0.1', 8301), Handler).serve_forever()
    except KeyboardInterrupt:
        print('Stopped.')
