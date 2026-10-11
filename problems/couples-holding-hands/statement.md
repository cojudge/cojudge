There are `n` couples seated in one row of `2n` chairs. Chair `i` holds person `row[i]`. Couples are numbered in order: `(0,1)`, `(2,3)`, and so on up to `(2n-2,2n-1)`.

One swap exchanges any two people. Return the smallest number of swaps that places every couple in neighboring chairs. Neighbors are pairs `(0,1)`, `(2,3)`, and so forth; the order inside a pair does not matter.

**Example 1:**
```
Input: row = [0,2,1,3]
Output: 1
Explanation: Exchange the people in chairs 1 and 2 to get [0,1,2,3].
```

**Example 2:**
```
Input: row = [3,2,0,1]
Output: 0
Explanation: Chairs (0,1) hold 3 and 2 (a couple) and chairs (2,3) hold 0 and 1 (a couple).
```

**Example 3:**
```
Input: row = [2,3,1,0]
Output: 0
Explanation: Both adjacent pairs are already couples, even though each pair is reversed.
```

**Constraints:**
- `2 <= row.length <= 60` and `row.length` is even
- `0 <= row[i] < row.length`
- All values in `row` are distinct
