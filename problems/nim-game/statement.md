A pile holds `n` stones. You move first, and the two players alternate. On each turn a player
must remove 1, 2, or 3 stones. The player who takes the last stone wins, and both players play
perfectly. Return whether you, the first player, can force a win.

**Example 1:**
```
Input: n = 4
Output: false
Explanation: Whatever 1-3 stones you take, your opponent can take the rest and win.
```

**Example 2:**
```
Input: n = 1
Output: true
Explanation: Take the single stone and win immediately.
```

**Example 3:**
```
Input: n = 2
Output: true
Explanation: Take both stones and win immediately.
```

**Constraints:**
- `1 <= n <= 2^31 - 1`
