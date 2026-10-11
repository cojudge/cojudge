## Approach

Split logs by looking at the first character after the identifier: digits go to a stable tail, words go to a sortable head. Sort the head by content first and identifier second, then concatenate the untouched digit tail.

## Complexity Analysis

- **Time Complexity:** O(m log m * L), where m is the number of letter-logs and L the content length for comparisons.
- **Space Complexity:** O(n) for the two partitions and the answer.

## Implementation

```python
from typing import List
class Solution:
    def reorderLogFiles(self, logs: List[str]) -> List[str]:
        letter = []
        digit = []
        for log in logs:
            _id, _, rest = log.partition(' ')
            if rest[0].isdigit():
                digit.append(log)
            else:
                letter.append(log)
        letter.sort(key=lambda x: (x.split(' ', 1)[1], x.split(' ', 1)[0]))
        return letter + digit
```
