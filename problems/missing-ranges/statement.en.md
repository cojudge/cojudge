You are given a sorted array `nums` with no duplicates, plus bounds `lower` and `upper`. Every integer from `lower` to `upper` should appear, but the ones already in `nums` are covered.

Return the missing pieces as strings. A lone missing number becomes just that number (for example `"2"`), while a run of consecutive missing numbers becomes `"start->end"` (for example `"4->49"`). List the pieces in increasing order. When nothing is missing, return an empty list.

**Constraints:**
- `-10^9 <= lower <= upper <= 10^9`
- `0 <= nums.length <= 10^4`
- `nums` is sorted in strictly increasing order and every element lies within `[lower, upper]`.
