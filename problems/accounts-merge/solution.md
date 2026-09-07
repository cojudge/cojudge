## Approach

Union-find over emails. Emails in the same account are united. Group by root, sort emails, attach the name.

## Complexity Analysis

- **Time Complexity:** O(A log A) where A is total emails
- **Space Complexity:** O(A)

## Implementation

```python
from typing import List
class Solution:
    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:
        parent = {}
        email_name = {}
        def find(x):
            parent.setdefault(x, x)
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        def union(a, b):
            parent[find(a)] = find(b)
        for acc in accounts:
            name = acc[0]
            for email in acc[1:]:
                email_name[email] = name
                union(acc[1], email)
        groups = {}
        for email in email_name:
            root = find(email)
            groups.setdefault(root, []).append(email)
        res = []
        for root, emails in groups.items():
            res.append([email_name[root]] + sorted(emails))
        return res
```
