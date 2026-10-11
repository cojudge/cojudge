## Approach

Keep an index into nums. For each requested operation emit nums[idx] for peek, nums[idx++] for next, or 1/0 for hasNext depending on whether the index is still inside the array.

## Complexity Analysis

- **Time Complexity:** O(q) for q operations.
- **Space Complexity:** O(q) for the output.

## Implementation

```python
from typing import List
class Solution:
    def runPeek(self, nums: List[int], operations: List[str]) -> List[int]:
        out, idx = [], 0
        for op in operations:
            if op == "next":
                out.append(nums[idx]); idx += 1
            elif op == "peek":
                out.append(nums[idx])
            elif op == "hasNext":
                out.append(1 if idx < len(nums) else 0)
        return out
```
