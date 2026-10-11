A robot starts at position (0, 0) on a grid. It follows a string `moves` made of the letters `U` (up), `D` (down), `L` (left) and `R` (right), each moving one step.

Return `true` when the robot finishes back at the origin, otherwise `false`.

**Example 1:**
```
Input: moves = "UD"
Output: true
Explanation: The two steps cancel.
```

**Example 2:**
```
Input: moves = "LL"
Output: false
Explanation: The robot ends two columns to the left.
```

**Example 3:**
```
Input: moves = "URDL"
Output: true
Explanation: One step each way returns home.
```

**Constraints:**
- `1 <= moves.length <= 2 * 10^4`
- `moves` contains only `U`, `D`, `L`, `R`.
