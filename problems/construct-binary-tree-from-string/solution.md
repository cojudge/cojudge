## Approach

Parse the string with a single left-to-right cursor shared by recursive calls. Each call reads an optional minus sign followed by digits to form the node value, then looks for parenthesized groups: the first group becomes the left child and the second becomes the right child, each parsed recursively. A missing group means a missing child, and an empty input produces a null tree.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the string length. Each character is consumed once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height (plus O(n) for the rebuilt tree).

## Implementation

```python
class Solution:
    def str2tree(self, s: str):
        if not s:
            return None
        self.pos = 0
        def parse():
            start = self.pos
            if s[self.pos] == '-':
                self.pos += 1
            while self.pos < len(s) and s[self.pos].isdigit():
                self.pos += 1
            node = TreeNode(int(s[start:self.pos]))
            if self.pos < len(s) and s[self.pos] == '(':
                self.pos += 1
                node.left = parse()
                self.pos += 1
            if self.pos < len(s) and s[self.pos] == '(':
                self.pos += 1
                node.right = parse()
                self.pos += 1
            return node
        return parse()
```
