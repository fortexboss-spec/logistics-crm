with open('src/components/Sidebar.tsx', 'rb') as f:
    content = f.read()
fixed = content.replace(b'\\\\x5c\\\\x6e', b'\\\\x0a')
with open('src/components/Sidebar.tsx', 'wb') as f:
    f.write(fixed)
print('done, newlines:', fixed.count(b'\\\\x0a'))
