A palindrome reads identically forward and backward, like `121`. Call a positive integer a super-palindrome when it is itself a palindrome and it equals the square of another palindrome (for instance `121` is `11 * 11`).

You are given interval ends `left` and `right` as decimal strings (they may be far too large for casual handling, yet they always denote values below `10^18`). Count the super-palindromes lying inside the inclusive interval.

**Constraints:**
- `1 <= left.length, right.length <= 18`
- Both strings hold only digits with no leading zeros.
- They denote integers in `[1, 10^18 - 1]` with `left <= right`.
