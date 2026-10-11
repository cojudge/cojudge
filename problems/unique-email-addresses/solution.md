## Approach

Normalize each address separately. Split at `'@'`, cut the local part at the first `'+'`, delete every `'.'`, then reattach the domain. Insert each normalized form into a hash set and return its size.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the total number of characters across all emails. Each address is scanned once.
- **Space Complexity:** O(m) for the normalized strings in the set.

## Implementation

```python
from typing import List
class Solution:
    def numUniqueEmails(self, emails: List[str]) -> int:
        seen = set()
        for e in emails:
            local, domain = e.split('@', 1)
            local = local.split('+', 1)[0].replace('.', '')
            seen.add(local + '@' + domain)
        return len(seen)
```
