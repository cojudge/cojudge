You are given a string `s` containing only `'('` and `')'`. In one move you may insert a single parenthesis at any position. Return the smallest number of moves that turns `s` into a balanced (valid) parenthesis string, where every opening bracket is closed by a later closing bracket in the usual nested order.

**Example 1:**
```
Input: s = "())"
Output: 1
```

**Example 2:**
```
Input: s = "((("
Output: 3
```

**Example 3:**
```
Input: s = "()"
Output: 0
```

**Example 4:**
```
Input: s = "()))(("
Output: 4
```

**Constraints:**
- `1 <= s.length <= 1000`
- `s` consists of `'('` and `')'` only
