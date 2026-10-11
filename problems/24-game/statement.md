You receive four cards, each showing an integer. Using the four arithmetic operators `+`, `-`, `*`, `/` and any placement of parentheses, decide whether an expression using every card exactly once can evaluate to 24.

Division is real division (not integer division). Two values that differ by less than `1e-6` are treated as equal when checking for 24; this tolerance rule is part of the task because intermediate results are doubles.

Return `true` when such an expression exists, otherwise `false`.

**Example 1:**
```
Input: cards = [4,1,8,7]
Output: true
Explanation: (8 - 4) * (7 - 1) = 24.
```

**Example 2:**
```
Input: cards = [1,2,1,2]
Output: false
```

**Example 3:**
```
Input: cards = [3,3,8,8]
Output: true
Explanation: 8 / (3 - 8 / 3) = 24.
```

**Constraints:**
- `cards.length == 4`
- `1 <= cards[i] <= 9`
