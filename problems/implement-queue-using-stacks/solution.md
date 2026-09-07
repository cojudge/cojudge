## Approach

Use two stacks: push onto `in`, and keep `out` for the front of the queue.
When `pop` or `peek` finds `out` empty, move every element from `in` to `out`
(which reverses the order so the oldest element is on top). `empty` is true
only when both stacks are empty (encoded as `1`/`0`). Collect outputs only
for `pop`, `peek`, and `empty`.

## Complexity Analysis

- **Time Complexity:** `O(m)` amortized over `m` operations; each element moves at most once from `in` to `out`.
- **Space Complexity:** `O(m)` for the two stacks in the worst case.

## Implementation

```python
from typing import List


class Solution:
    def runQueueUsingStacks(self, operations: List[str], values: List[int]) -> List[int]:
        instack: List[int] = []
        outstack: List[int] = []
        answers: List[int] = []

        def move() -> None:
            if not outstack:
                while instack:
                    outstack.append(instack.pop())

        for operation, value in zip(operations, values):
            if operation == "push":
                instack.append(value)
            elif operation == "pop":
                move()
                answers.append(outstack.pop())
            elif operation == "peek":
                move()
                answers.append(outstack[-1])
            else:
                answers.append(1 if not instack and not outstack else 0)
        return answers
```
