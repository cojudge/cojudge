Two players take turns choosing from the pool of integers `1` through `maxChoosableInteger`. Each number may be used at most once per game. The chosen numbers accumulate into a running total, and the player whose pick makes the total reach or exceed `desiredTotal` wins immediately.

Both players play perfectly. Return `true` if the first player can force a win, and `false` otherwise. A non-positive target counts as already met, so the first player wins without moving.

**Constraints:**
- `1 <= maxChoosableInteger <= 20`
- `0 <= desiredTotal <= 300`
