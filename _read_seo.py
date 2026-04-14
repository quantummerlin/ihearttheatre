import re
files = ['index.html','reviews.html','reviews/review-deanna-batshit.html','reviewer-deanna.html','auditions.html','shows.html','about.html','whats-on.html','junior-kids-schools.html','reviewer-penelope.html']
for f in files:
    c = open(f, encoding='utf-8').read()
    t = re.search(r'<title>(.*?)</title>', c, re.DOTALL)
    d = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', c, re.IGNORECASE)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', c, re.DOTALL|re.IGNORECASE)
    print(f)
    print('  title:', t.group(1).strip()[:90] if t else 'NONE')
    print('  desc:', d.group(1)[:90] if d else 'NONE')
    print('  h1:', re.sub(r'<[^>]+>','',h1.group(1)).strip()[:60] if h1 else 'NONE')
    print()
