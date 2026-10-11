A pancake flip chooses a positive `k` and reverses the first `k` entries of the array. Starting from `arr` (a permutation of `1..n`), return any sequence of at most `10 * n` flips that leaves the whole array sorted in non-decreasing order. The judge replays your flips, so every valid sorting sequence is accepted — the reference answer is only one possibility.

**Example 1:**
```
Input: arr = [3,2,4,1]
Output: [4,2,4,3]
Explanation: Flipping 4, then 2, then 4, then 3 sorts the array: [4,2,4,3] is one valid answer (any sorting sequence is accepted).
```

**Example 2:**
```
Input: arr = [3,2,1]
Output: [3]
Explanation: A single flip of the whole array reverses it into order, so [3] suffices.
```

**Example 3:**
```
Input: arr = [1,2,3]
Output: []
Explanation: The array is already sorted, so the empty flip sequence is correct.
```

**Constraints:**
- `1 <= arr.length <= 100`
- `arr` holds each integer from `1` to `arr.length` exactly once.
- The answer is an integer list with at most `10 * arr.length` entries, each between `1` and `arr.length`.
