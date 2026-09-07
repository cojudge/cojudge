## Approach

Simulate a LIFO stack with two FIFO queues. Keep all elements in `q1` with the
most recently pushed element at the front. To push `x`, offer `x` to the empty
`q2`, drain every element of `q1` into `q2`, then swap the two queues. `pop`
polls the front, `top` peeks at the front, and `empty` checks whether `q1` is
empty (encoded as `1`/`0`). Collect outputs only for `pop`, `top`, and
`empty`.

## Complexity Analysis

- **Time Complexity:** `O(m)` amortized per trace with `O(n)` work for each `push` where `n` is the current size, `O(1)` for `pop`/`top`/`empty`.
- **Space Complexity:** `O(m)` for the two queues in the worst case.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def runStackUsingQueues(self, operations: List[str], values: List[int]) -> List[int]:
        q1: deque[int] = deque()
        q2: deque[int] = deque()
        answers: List[int] = []
        for operation, value in zip(operations, values):
            if operation == "push":
                q2.append(value)
                while q1:
                    q2.append(q1.popleft())
                q1, q2 = q2, q1
            elif operation == "pop":
                answers.append(q1.popleft())
            elif operation == "top":
                answers.append(q1[0])
            else:
                answers.append(1 if not q1 else 0)
        return answers
```
