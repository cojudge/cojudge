## Approach

Keep two parallel stacks: a value stack and a max stack whose top always holds the maximum of everything below it. Pushing `x` appends `x` alongside `max(x, current max)`, so `top` and `peekMax` are O(1) reads and `pop` drops both tops. For `popMax`, move elements above the topmost maximum into a buffer, drop the maximum from both stacks, then push the buffered elements back (rebuilding their max entries). The full per-operation trace (`"null"` for construction and `push`, plain integers otherwise) is compared exactly against the reference.

## Complexity Analysis

- **Time Complexity:** O(1) amortized per `push`, `pop`, `top` and `peekMax`; O(n) per `popMax` where n is the stack depth.
- **Space Complexity:** O(n) for the two stacks.

## Implementation

```python
class MaxStack:
    def __init__(self):
        self.stack = []
        self.max_stack = []

    def push(self, x: int) -> None:
        self.stack.append(x)
        if not self.max_stack or x >= self.max_stack[-1]:
            self.max_stack.append(x)
        else:
            self.max_stack.append(self.max_stack[-1])

    def pop(self) -> int:
        self.max_stack.pop()
        return self.stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def peekMax(self) -> int:
        return self.max_stack[-1]

    def popMax(self) -> int:
        mx = self.max_stack[-1]
        buf = []
        while self.stack[-1] != mx:
            buf.append(self.stack.pop())
            self.max_stack.pop()
        self.stack.pop()
        self.max_stack.pop()
        while buf:
            self.push(buf.pop())
        return mx
```
