## Approach

Normalize each row to length three, treating dash as empty, then count `X` and `O` and test the eight winning lines. A reachable layout must satisfy turn-order counts and the stop-after-win rule: `O` never leads, `X` leads by at most one, both sides never win together, an `X` win needs one extra `X`, and an `O` win needs equal counts.

## Complexity Analysis

- **Time Complexity:** O(1), only nine cells and eight lines are inspected.
- **Space Complexity:** O(1), only a few counters are used.

## Implementation

```python
class Solution:
    def validTicTacToe(self, board) -> bool:
        b = []
        for r in board:
            r = r.replace(' ', '-').replace('.', '-')
            while len(r) < 3:
                r += '-'
            b.append(r[:3])
        x = sum(r.count('X') for r in b)
        o = sum(r.count('O') for r in b)
        if o > x or x > o + 1:
            return False
        def win(p):
            for i in range(3):
                if b[i][0] == b[i][1] == b[i][2] == p:
                    return True
                if b[0][i] == b[1][i] == b[2][i] == p:
                    return True
            if b[0][0] == b[1][1] == b[2][2] == p:
                return True
            if b[0][2] == b[1][1] == b[2][0] == p:
                return True
            return False
        xw, ow = win('X'), win('O')
        if xw and ow:
            return False
        if xw and x != o + 1:
            return False
        if ow and x != o:
            return False
        return True
```
