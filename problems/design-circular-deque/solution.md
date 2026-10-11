## Approach

Store the deque in a fixed ring buffer with a head pointer at the front element and a count of live entries. Front insertion steps the head backward modulo the capacity before writing, while rear insertion writes at head plus count. Deletions slide the head forward or shrink the count, and all getters first check for emptiness so they can answer -1 or the boolean encoding.

## Complexity Analysis

- **Time Complexity:** O(1) per operation.
- **Space Complexity:** O(k) for the ring buffer of capacity k.

## Implementation

```python
from typing import List

class Solution:
    def runCircularDeque(self, operations: List[str], values: List[int]) -> List[int]:
        k = values[0]
        buf = [0] * k
        head = count = 0
        ans = []
        for op, v in zip(operations[1:], values[1:]):
            if op == "insertFront":
                if count == k:
                    ans.append(0)
                else:
                    head = (head - 1) % k
                    buf[head] = v
                    count += 1
                    ans.append(1)
            elif op == "insertLast":
                if count == k:
                    ans.append(0)
                else:
                    buf[(head + count) % k] = v
                    count += 1
                    ans.append(1)
            elif op == "deleteFront":
                if count == 0:
                    ans.append(0)
                else:
                    head = (head + 1) % k
                    count -= 1
                    ans.append(1)
            elif op == "deleteLast":
                if count == 0:
                    ans.append(0)
                else:
                    count -= 1
                    ans.append(1)
            elif op == "getFront":
                ans.append(-1 if count == 0 else buf[head])
            elif op == "getRear":
                ans.append(-1 if count == 0 else buf[(head + count - 1) % k])
            elif op == "isEmpty":
                ans.append(1 if count == 0 else 0)
            elif op == "isFull":
                ans.append(1 if count == k else 0)
        return ans
```
