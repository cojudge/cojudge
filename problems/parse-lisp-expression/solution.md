## Approach

Evaluate the string with a cursor and a stack of variable scopes. A recursive routine handles one item: a parenthesized list dispatches on its head (`add`, `mult`, or `let`), while a bare token resolves to a literal or the nearest binding. Each `let` pushes a fresh scope, records its pairs in order, evaluates the trailing body, then pops the scope so inner bindings never escape.

## Complexity Analysis

- **Time Complexity:** O(n^2) worst case for deeply shadowing lookups over an expression of length n; typically near O(n).
- **Space Complexity:** O(n) for the scope stack and recursion depth.

## Implementation

```python
class Solution:
    def evaluate(self, expression: str) -> int:
        self.s, self.pos = expression, 0
        return self._eval([dict()])

    def _skip(self):
        while self.pos < len(self.s) and self.s[self.pos] == ' ':
            self.pos += 1

    def _token(self):
        self._skip()
        st = self.pos
        while self.pos < len(self.s) and self.s[self.pos] not in ' ()':
            self.pos += 1
        return self.s[st:self.pos]

    def _val(self, tok, scope):
        if tok[0].isdigit() or tok[0] == '-':
            return int(tok)
        for m in reversed(scope):
            if tok in m:
                return m[tok]
        return 0

    def _eval(self, scope):
        self._skip()
        if self.s[self.pos] == '(':
            self.pos += 1
            head = self._token()
            if head == 'add':
                a = self._eval(scope)
                b = self._eval(scope)
                res = a + b
            elif head == 'mult':
                a = self._eval(scope)
                b = self._eval(scope)
                res = a * b
            else:
                scope.append(dict())
                while True:
                    self._skip()
                    if self.s[self.pos] == '(':
                        res = self._eval(scope)
                        break
                    tok = self._token()
                    self._skip()
                    if self.s[self.pos] == ')':
                        res = self._val(tok, scope)
                        break
                    scope[-1][tok] = self._eval(scope)
                scope.pop()
            self._skip()
            self.pos += 1
            return res
        return self._val(self._token(), scope)
```
