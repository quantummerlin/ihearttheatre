import glob

files = glob.glob('**/*.html', recursive=True)
total = 0
changed = 0

for f in files:
    try:
        c = open(f, encoding='utf-8').read()
        # Replace the spaced-dash pattern we just introduced
        c2 = c.replace(' - ', ', ')
        n = c.count(' - ')
        if n > 0:
            open(f, 'w', encoding='utf-8').write(c2)
            total += n
            changed += 1
            print(f'  {n:3d}  {f}')
    except Exception as e:
        print('ERROR', f, e)

print()
print(f'{total} replacements across {changed} files')
