with open('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', 'rb') as f:
    content = f.read()
print('Has backslash-n:', b'\\\\x5c\\\\x6e' in content)
print('Has real newline:', b'\\\\x0a' in content)
print('First 100 bytes:', content[:100])
