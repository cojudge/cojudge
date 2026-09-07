## Approach

Split the path by `/` and process each component with a stack. Skip empty
parts and `.`, pop the stack on `..` when it is non-empty, and otherwise push
the directory name (including `...`). Join the remaining parts with `/`
prefixed, or return `/` when the stack is empty.

## Complexity Analysis

- **Time Complexity:** `O(n)`, where `n` is the path length.
- **Space Complexity:** `O(n)` for the stack of directory names.

## Implementation

```python
class Solution:
    def simplifyPath(self, path: str) -> str:
        stack: list[str] = []
        for part in path.split("/"):
            if not part or part == ".":
                continue
            if part == "..":
                if stack:
                    stack.pop()
            else:
                stack.append(part)
        return "/" + "/".join(stack)
```
