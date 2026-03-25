import os
import re
import json

files = {
    'index.html': 'Dashboard',
    'history_portal.html': 'HistoryPortal',
    'intake.html': 'Intake',
    'share_hub.html': 'ShareHub'
}

def html_to_jsx(html):
    # Extract body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if body_match:
        html = body_match.group(1)
    
    # Handle style="font-variation-settings: 'FILL' 1;"
    # We will just strip inline style tags for this specific case to avoid dictionary conversion issues if it's the only one.
    html = re.sub(r'style="font-variation-settings:\s*\'FILL\'\s*1;?"', 'className="fill-current"', html)
    html = re.sub(r'style="font-variation-settings:\s*\'FILL\'\s*0;?"', '', html)
    # Generic style wipe if it's too complex
    html = re.sub(r'style="[^"]*"', '', html)
    
    # Basic replacements
    html = html.replace('class=', 'className=')
    html = html.replace('for=', 'htmlFor=')
    html = html.replace('<!--', '{/*')
    html = html.replace('-->', '*/}')
    
    # SVG attributes to camelCase
    attrs = ['stroke-linecap', 'stroke-linejoin', 'stroke-width', 'fill-rule', 'clip-rule', 'viewbox', 'stroke-miterlimit', 'font-variation-settings']
    for attr in attrs:
        if attr == 'viewbox':
            camel = 'viewBox'
        else:
            parts = attr.split('-')
            camel = parts[0] + ''.join(word.capitalize() for word in parts[1:])
        html = re.sub(r'\b' + attr + r'=', camel + '=', html, flags=re.IGNORECASE)
        
    # Self close tags: img, input, hr, br
    html = re.sub(r'(<(img|input|hr|br)[^>]*?)(?<!/)>', r'\1 />', html)
        
    return html

os.makedirs('CareCortex/src/pages', exist_ok=True)

for filename, comp_name in files.items():
    with open(f'stitch_assets/{filename}', 'r', encoding='utf-8') as f:
        content = f.read()
        jsx = html_to_jsx(content)
        
        with open(f'CareCortex/src/pages/{comp_name}.jsx', 'w', encoding='utf-8') as out:
            out.write(f'''import React from 'react';

const {comp_name} = () => {{
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
      {{/* Generated from Stitch HTML */}}
      {jsx}
    </div>
  );
}};

export default {comp_name};
''')

print("Conversion complete.")
