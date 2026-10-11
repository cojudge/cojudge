## Approach

Precompute each letter's final position, then scan the string while maintaining a stack of chosen letters. Before pushing a new letter, discard any larger letter on the stack top that still appears later and has not been fixed yet. Skipping letters already present guarantees uniqueness, and the greedy pops guarantee the smallest possible ordering.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each character is pushed and popped at most once.
- **Space Complexity:** O(1) besides the output, since the stack holds at most 26 letters.

## Implementation

```python
class Solution:
    def removeDuplicateLetters(self, s: str) -> str:
        last = {c: i for i, c in enumerate(s)}
        in_stack = set()
        st = []
        for i, c in enumerate(s):
            if c in in_stack:
                continue
            while st and st[-1] > c and last[st[-1]] > i:
                in_stack.remove(st.pop())
            st.append(c)
            in_stack.add(c)
        return "".join(st)
```
