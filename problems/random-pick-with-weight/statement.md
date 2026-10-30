You are given a 0-indexed array of positive integers `w` where `w[i]` describes the weight of the `i`-th index.

Implement the `WeightedPicker` class:

- `WeightedPicker(int[] w)` Initializes the object with the array `w`.
- `int pickIndex()` Randomly picks an index in the range `[0, w.length - 1]` (inclusive) and returns it. The probability of picking an index `i` is `w[i] / sum(w)`.

The class is named `WeightedPicker` here instead of LeetCode's `Solution` because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading: each `pickIndex` must return an index in `[0, w.length)`; on traces with at least 500 picks, every index with `w[i] > 0` must additionally appear at least once (coverage). Any valid trace is accepted — the exact pick distribution is not statistically tested. Outputs are plain integer strings.

**Constraints:**
- `1 <= w.length <= 10^4`
- `1 <= w[i] <= 10^5`
- `pickIndex` will be called at most `10^4` times.
