## Approach

Encode each string as `length#content` and concatenate. Decode by reading the length prefix delimited by `#`, then extracting that many characters.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the total length of all strings.
- **Space Complexity:** O(n) for the encoded/decoded output.

## Implementation

```python
from typing import List
class Codec:
    def encode(self, strs: List[str]) -> str:
        return ''.join(f'{len(s)}#{s}' for s in strs)
    def decode(self, s: str) -> List[str]:
        res, i = [], 0
        while i < len(s):
            j = s.find('#', i)
            l = int(s[i:j])
            i = j + 1
            res.append(s[i:i+l])
            i += l
        return res
class Solution:
    def solve(self, strs: List[str]) -> List[str]:
        codec = Codec()
        return codec.decode(codec.encode(strs))
```
