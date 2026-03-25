import os
import re

files = [
    'care-cortex-next/src/app/page.js',
    'care-cortex-next/src/app/history/page.js',
    'care-cortex-next/src/app/intake/page.js',
    'care-cortex-next/src/app/share/page.js'
]

def replace_link(match):
    before_href = match.group(1)
    href_val = match.group(2)
    after_href = match.group(3)
    inner_text = match.group(4)
    
    lower_text = inner_text.lower()
    
    # Intelligent routing logic based on the inner textual/icon content of the button
    new_href = "/" # default
    if "symptom checker" in lower_text or "consult" in lower_text:
        new_href = "/intake"
    elif "history" in lower_text or "medical records" in lower_text or "folder_managed" in lower_text:
        new_href = "/history"
    elif "doctor access" in lower_text or "settings" in lower_text or "qr_code_scanner" in lower_text:
        new_href = "/share"
    elif "overview" in lower_text or "health" in lower_text or "lab results" in lower_text:
        new_href = "/"
        
    return f'<Link {before_href}href="{new_href}"{after_href}>{inner_text}</Link>'

for filepath in files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Match <Link ... href="..." ...> content </Link> spanning newlines
    content = re.sub(
        r'<Link\b([^>]*?)href="([^"]*)"([^>]*)>(.*?)</Link>',
        replace_link,
        content,
        flags=re.DOTALL
    )
    
    # Disable prefetching to prevent the Next.js dev server from compiling all 4 heavy pages at once 
    # when they enter the viewport, which causes the specific "lag" the user feels.
    content = content.replace('<Link ', '<Link prefetch={false} ')
    content = content.replace('prefetch={false} prefetch={false}', 'prefetch={false}')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Hard fixed all Next.js links and disabled dev viewport prefetching.")
