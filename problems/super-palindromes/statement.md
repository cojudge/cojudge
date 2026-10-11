A palindrome reads identically forward and backward, like `121`. Call a positive integer a super-palindrome when it is itself a palindrome and it equals the square of another palindrome (for instance `121` is `11 * 11`).

You are given interval ends `left` and `right` as decimal strings (they may be far too large for casual handling, yet they always denote values below `10^18`). Count the super-palindromes lying inside the inclusive interval.

**Example 1:**
```
Input: left = "4", right = "1000"
Output: 4
Explanation: The qualifying values are 4 (2 squared), 9 (3 squared), 121 (11 squared) and 484 (22 squared).
```

**Example 2:**
```
Input: left = "1", right = "2"
Output: 1
Explanation: Only 1 (1 squared) sits in range.
```

**Example 3:**
```
Input: left = "1", right = "100000"
Output: 10
Explanation: Ten super-palindromes fall below one hundred thousand.
```

**Constraints:**
- `1 <= left.length, right.length <= 18`
- Both strings hold only digits with no leading zeros.
- They denote integers in `[1, 10^18 - 1]` with `left <= right`.
