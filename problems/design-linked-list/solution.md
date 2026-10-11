## Approach

Replay the script with a plain array-backed sequence. A `MyLinkedList` entry clears the sequence. Reads check bounds and emit either the stored value or `-1`. Head and tail inserts map to front and back pushes, indexed inserts respect the append-or-ignore rules (non-positive means front), and deletions remove only valid positions. Collecting read results in order produces the required output.

## Complexity Analysis

- **Time Complexity:** O(n^2) worst case due to indexed inserts/deletes shifting elements.
- **Space Complexity:** O(n) for the stored values.

## Implementation

```python
from typing import List
class Solution:
    def runLinkedList(self, operations: List[str], args: List[List[int]]) -> List[int]:
        lst = []
        out = []
        for op, a in zip(operations, args):
            if op == "MyLinkedList":
                lst = []
            elif op == "get":
                idx = a[0] if a else -1
                out.append(lst[idx] if 0 <= idx < len(lst) else -1)
            elif op == "addAtHead":
                lst.insert(0, a[0])
            elif op == "addAtTail":
                lst.append(a[0])
            elif op == "addAtIndex":
                idx, val = a[0], a[1]
                if idx <= 0:
                    lst.insert(0, val)
                elif idx == len(lst):
                    lst.append(val)
                elif idx < len(lst):
                    lst.insert(idx, val)
            elif op == "deleteAtIndex":
                idx = a[0] if a else -1
                if 0 <= idx < len(lst):
                    lst.pop(idx)
        return out
```
