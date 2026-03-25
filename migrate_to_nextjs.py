import os
import re
import shutil

source = 'CareCortex/src/pages'
dest = 'care-cortex-next/src/app'

mapping = {
    'Dashboard.jsx': 'page.js',
    'HistoryPortal.jsx': 'history/page.js',
    'Intake.jsx': 'intake/page.js',
    'ShareHub.jsx': 'share/page.js'
}

def fix_content(content):
    # 1. Fix imports
    content = content.replace("import { Link } from 'react-router-dom';", "import Link from 'next/link';")
    
    # 2. Fix Link `to` -> `href`
    content = re.sub(r'<Link([^>]*?)to="([^"]*)"', r'<Link\1href="\2"', content)
    
    # 3. Fix SVG DOM properties
    svg_fixes = {
        'stop-color': 'stopColor',
        'stop-opacity': 'stopOpacity',
        'stroke-dasharray': 'strokeDasharray',
        'stroke-dashoffset': 'strokeDashoffset'
    }
    for old, new in svg_fixes.items():
        content = content.replace(f'{old}=', f'{new}=')
    
    return content

for src_file, dest_path in mapping.items():
    src = os.path.join(source, src_file)
    dst = os.path.join(dest, dest_path)
    
    # ensure dir exists
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    
    # read
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # fix
    content = fix_content(content)
    
    # write to Next.js destination
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(content)

print("Migration to Next.js complete.")
