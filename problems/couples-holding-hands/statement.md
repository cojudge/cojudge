There are `n` couples seated in one row of `2n` chairs. Chair `i` holds person `row[i]`. Couples are numbered in order: `(0,1)`, `(2,3)`, and so on up to `(2n-2,2n-1)`.

One swap exchanges any two people. Return the smallest number of swaps that places every couple in neighboring chairs. Neighbors are pairs `(0,1)`, `(2,3)`, and so forth; the order inside a pair does not matter.

**Constraints:**
- `2 <= row.length <= 60` and `row.length` is even
- `0 <= row[i] < row.length`
- All values in `row` are distinct
