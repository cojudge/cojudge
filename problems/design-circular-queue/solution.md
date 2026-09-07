## Approach

Store elements in a fixed array of size `k` with a `head` index and a `count`.
The tail is `(head + count) % k`. `enQueue` writes at the tail unless full,
`deQueue` advances `head` unless empty, `Front`/`Rear` read the ends (or `-1`
when empty), and `isEmpty`/`isFull` compare `count` against `0`/`k`. Booleans
are encoded as `1`/`0`.

## Complexity Analysis

- **Time Complexity:** `O(m)` over `m` operations, `O(1)` per operation.
- **Space Complexity:** `O(k)` for the ring buffer.

## Implementation

```python
from typing import List


class Solution:
    def runCircularQueue(self, operations: List[str], values: List[int]) -> List[int]:
        k = values[0]
        buf = [0] * k
        head = 0
        count = 0
        answers: List[int] = []
        for operation, value in zip(operations[1:], values[1:]):
            if operation == "enQueue":
                if count == k:
                    answers.append(0)
                else:
                    buf[(head + count) % k] = value
                    count += 1
                    answers.append(1)
            elif operation == "deQueue":
                if count == 0:
                    answers.append(0)
                else:
                    head = (head + 1) % k
                    count -= 1
                    answers.append(1)
            elif operation == "Front":
                answers.append(-1 if count == 0 else buf[head])
            elif operation == "Rear":
                answers.append(-1 if count == 0 else buf[(head + count - 1) % k])
            elif operation == "isEmpty":
                answers.append(1 if count == 0 else 0)
            else:
                answers.append(1 if count == k else 0)
        return answers
```
