"""整理页面 HTML 的开始标签，让属性保持在同一行。"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / 'app' / 'pages'

# 注释和原样文本区域保持不动；引号内的空白及尖括号也不参与整理。
PARTS = re.compile(
    r'<!--[\s\S]*?-->|'
    r'<(script|style|pre|textarea)\b(?:"[^"]*"|\'[^\']*\'|[^\'">])*>'
    r'[\s\S]*?</\1\s*>|'
    r'<[a-zA-Z][\w:.-]*(?:"[^"]*"|\'[^\']*\'|[^\'">])*?>',
    re.IGNORECASE,
)


def format_start_tag(match):
    tag = match.group(0)
    if tag.startswith('<!--') or match.group(1) or '\n' not in tag:
        return tag
    result = []
    quote = None
    pending_space = False
    for char in tag:
        if quote:
            result.append(char)
            if char == quote:
                quote = None
        elif char in ('"', "'"):
            if pending_space:
                result.append(' ')
                pending_space = False
            quote = char
            result.append(char)
        elif char.isspace():
            pending_space = True
        else:
            if pending_space and char != '>':
                result.append(' ')
            pending_space = False
            result.append(char)
    return ''.join(result)


def main():
    parser = argparse.ArgumentParser(description='整理页面模板的开始标签。')
    parser.add_argument('--check', action='store_true', help='只检查，不修改文件')
    args = parser.parse_args()
    changed = []
    for path in sorted(PAGES.rglob('*.html')):
        original = path.read_text(encoding='utf-8')
        formatted = PARTS.sub(format_start_tag, original)
        if formatted != original:
            changed.append(path.relative_to(ROOT))
            if not args.check:
                path.write_text(formatted, encoding='utf-8')
    if changed:
        for path in changed:
            sys.stdout.buffer.write((str(path) + '\n').encode('utf-8'))
        if args.check:
            raise SystemExit(1)
    else:
        sys.stdout.buffer.write('页面模板的开始标签已符合格式。\n'.encode('utf-8'))


if __name__ == '__main__':
    main()
