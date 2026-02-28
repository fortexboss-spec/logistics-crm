with open('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', 'rb') as f:
    content = f.read()
content = content.replace(b'\\\\n', b'\\n')
with open('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', 'wb') as f:
    f.write(content)
print('done, lines:', content.count(b'\\n'))
