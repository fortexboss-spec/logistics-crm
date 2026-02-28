with open('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', 'rb') as f:
    content = f.read()
# Replace literal backslash+n with real newline
fixed = content.replace(b'\\\\x5c\\\\x6e', b'\\\\x0a')
with open('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', 'wb') as f:
    f.write(fixed)
print('done, newlines:', fixed.count(b'\\\\x0a'))
