You are given an array of positive integer weights. Imagine the indices `0..n-1` laid out on segments whose lengths equal the weights: index 0 owns the range `[0, weights[0])`, index 1 owns `[weights[0], weights[0]+weights[1])`, and so on up to the total sum `S`.

*Adaptation note:* the original problem draws a random position and returns the owning index. Because this judge is deterministic, each draw is supplied by the caller instead: the `calls` array holds one integer per draw, and draw value `c` selects position `((c mod S) + S) mod S` (so negative values wrap around safely). The owning index of that position is the pick for the draw.

Implement `runWeightedPick(weights, calls)` returning one picked index per draw value, in order.

**Constraints:**
- `1 <= weights.length <= 10^4`
- `1 <= weights[i] <= 10^5`
- `1 <= calls.length <= 10^4`
- `calls[i]` is any 32-bit signed integer.
