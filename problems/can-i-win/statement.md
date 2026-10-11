Two players take turns choosing from the pool of integers `1` through `maxChoosableInteger`. Each number may be used at most once per game. The chosen numbers accumulate into a running total, and the player whose pick makes the total reach or exceed `desiredTotal` wins immediately.

Both players play perfectly. Return `true` if the first player can force a win, and `false` otherwise. A non-positive target counts as already met, so the first player wins without moving.

**Example 1:**
```
Input: maxChoosableInteger = 10, desiredTotal = 11
Output: false
Explanation: Whatever the first player picks, the second player can always answer with a number that reaches 11 first.
```

**Example 2:**
```
Input: maxChoosableInteger = 10, desiredTotal = 0
Output: true
Explanation: The target is already met, so the first player has won without moving.
```

**Example 3:**
```
Input: maxChoosableInteger = 10, desiredTotal = 1
Output: true
Explanation: The first player picks 1 and reaches the target immediately.
```

**Constraints:**
- `1 <= maxChoosableInteger <= 20`
- `0 <= desiredTotal <= 300`
