## Approach

Track every directory path in a set and every file path in a map to its text. Creating a directory adds all missing prefixes, appending creates parents then extends the stored text, listing a file returns its name while listing a directory gathers sorted immediate children, and reading returns the stored text.

## Complexity Analysis

- **Time Complexity:** O(q*L) for q calls with path length L.
- **Space Complexity:** O(total stored paths plus content).

## Implementation

```python
from typing import List
class Solution:
    def runFileSystem(self, operations: List[str], paths: List[str], contents: List[str]) -> List[List[str]]:
        dirs = {'/'}
        files = {}
        def parent(p):
            if p == '/':
                return None
            k = p.rfind('/')
            return '/' if k == 0 else p[:k]
        def base(p):
            return p[p.rfind('/') + 1:]
        def ensure(d):
            if d == '/':
                dirs.add('/'); return
            cur = ''
            for part in d.split('/'):
                if not part:
                    continue
                cur += '/' + part
                dirs.add(cur)
        ans = []
        for op, pa, co in zip(operations, paths, contents):
            if op == 'FileSystem':
                continue
            elif op == 'mkdir':
                ensure(pa)
            elif op == 'addContentToFile':
                pr = parent(pa)
                if pr is not None:
                    ensure(pr)
                files[pa] = files.get(pa, '') + (co or '')
            elif op == 'ls':
                if pa in files:
                    ans.append([base(pa)])
                else:
                    kids = set()
                    for d in dirs:
                        if d != pa and parent(d) == pa:
                            kids.add(base(d))
                    for f in files:
                        if parent(f) == pa:
                            kids.add(base(f))
                    ans.append(sorted(kids))
            elif op == 'readContentFromFile':
                ans.append([files[pa]])
        return ans
```
