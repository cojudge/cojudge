You are given an array of positive integer weights. Imagine the indices `0..n-1` laid out on segments whose lengths equal the weights: index 0 owns the range `[0, weights[0])`, index 1 owns `[weights[0], weights[0]+weights[1])`, and so on up to the total sum `S`.

*Adaptation note:* the original problem draws a random position and returns the owning index. Because this judge is deterministic, each draw is supplied by the caller instead: the `calls` array holds one integer per draw, and draw value `c` selects position `((c mod S) + S) mod S` (so negative values wrap around safely). The owning index of that position is the pick for the draw.

Implement `runWeightedPick(weights, calls)` returning one picked index per draw value, in order.

**Example 1:**
```
Input: weights = [1,3], calls = [0,1,2,3]
Output: [0,1,1,1]
Explanation: The total is 4. Index 0 owns position 0; index 1 owns positions 1-3. Draws 1, 2, 3 all land on index 1.
```

**Example 2:**
```
Input: weights = [2,5,3], calls = [0,2,7,9]
Output: [0,1,2,2]
Explanation: The total is 10. Index 0 owns [0,2), index 1 owns [2,7), index 2 owns [7,10). Positions 0, 2, 7, 9 map to 0, 1, 2, 2.
```

**Example 3:**
```
Input: weights = [5], calls = [100,-3]
Output: [0,0]
Explanation: A single index owns every position.
```

**Constraints:**
- `1 <= weights.length <= 10^4`
- `1 <= weights[i] <= 10^5`
- `1 <= calls.length <= 10^4`
- `calls[i]` is any 32-bit signed integer.
