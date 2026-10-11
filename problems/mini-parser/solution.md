## Approach

When the text holds no opening bracket it is a bare integer and is returned as is. Otherwise walk the characters with a recursive descent: `[` opens a fresh list, `]` closes it, commas separate entries, and digit runs (with an optional minus) become integer leaves. Serializing the parsed tree canonically yields the normalized answer.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`, with one pass to parse and one to print.
- **Space Complexity:** O(n) for the parse tree and the output.

## Implementation

```python
class Solution:
    def deserialize(self, s: str) -> str:
        self.i = 0
        self.s = s
        node = self._parse()
        return self._ser(node)

    def _parse(self):
        if self.s[self.i] == '[':
            self.i += 1
            items = []
            while self.s[self.i] != ']':
                items.append(self._parse())
                if self.s[self.i] == ',':
                    self.i += 1
            self.i += 1
            return ('list', items)
        start = self.i
        if self.s[self.i] == '-':
            self.i += 1
        while self.i < len(self.s) and self.s[self.i].isdigit():
            self.i += 1
        return ('int', int(self.s[start:self.i]))

    def _ser(self, node):
        if node[0] == 'int':
            return str(node[1])
        return '[' + ','.join(self._ser(x) for x in node[1]) + ']'
```
