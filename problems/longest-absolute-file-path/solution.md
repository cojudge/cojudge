## Approach

Split the encoding into lines. The count of leading tabs gives the nesting depth of each entry. Maintain an array where entry `d` holds the total length of the path down to depth `d` including separators. For a folder, record its extended length for the next level; for a name containing a dot (a file), compute the candidate path length and keep the maximum. One linear scan suffices.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the encoded string.
- **Space Complexity:** O(d) for the per-depth lengths, with d bounded by the nesting depth.

## Implementation

```python
class Solution:
    def lengthLongestPath(self, input: str) -> int:
        # '|' is accepted as a newline alias (runner-safe encoding).
        input = input.replace('|', '\n')
        acc = [0] * (input.count('\n') + 3)
        best = 0
        for line in input.split('\n'):
            depth = 0
            while depth < len(line) and line[depth] == '\t':
                depth += 1
            name = line[depth:]
            if '.' in name:
                best = max(best, acc[depth] + len(name))
            else:
                acc[depth + 1] = acc[depth] + len(name) + 1
        return best
```
