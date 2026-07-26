## Approach

Record the final position of every letter. Scan the string while extending the current partition end to the latest final position of any letter seen in that partition. Once the scan reaches that end, no letter in the partition appears later, so close it immediately to maximize the number of partitions.

## Complexity Analysis

- **Time Complexity:** O(n), using two passes over the string.
- **Space Complexity:** O(1) auxiliary space because the lowercase alphabet has fixed size, excluding the returned list.

## Implementation

```python
from typing import List


class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        last = {character: index for index, character in enumerate(s)}
        sizes = []
        start = 0
        end = 0
        for index, character in enumerate(s):
            end = max(end, last[character])
            if index == end:
                sizes.append(end - start + 1)
                start = index + 1
        return sizes
```
