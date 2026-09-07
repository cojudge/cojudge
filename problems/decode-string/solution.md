## Approach

Scan the string with two stacks: one for repeat counts and one for the string
built before each `[`. Accumulate multi-digit `k`, push state on `[`, and on
`]` repeat the current segment `k` times and append it to the popped previous
string. Letters are appended directly to the current builder.

## Complexity Analysis

- **Time Complexity:** `O(m)`, where `m` is the decoded output length.
- **Space Complexity:** `O(n + m)` for the stacks and the decoded string, with `n` the encoded length.

## Implementation

```python
class Solution:
    def decodeString(self, s: str) -> str:
        counts: list[int] = []
        strings: list[str] = []
        cur: list[str] = []
        k = 0
        for c in s:
            if c.isdigit():
                k = k * 10 + int(c)
            elif c == "[":
                counts.append(k)
                strings.append("".join(cur))
                cur = []
                k = 0
            elif c == "]":
                rep = counts.pop()
                prev = strings.pop()
                cur = [prev + "".join(cur) * rep]
            else:
                cur.append(c)
        return "".join(cur)
```
