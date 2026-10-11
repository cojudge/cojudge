Given a positive integer `n`, rearrange its decimal digits into the smallest larger integer that uses exactly the same digits. If no larger arrangement exists, or if the rearranged value does not fit in a 32-bit signed integer, return `-1`.

Think of it as finding the next permutation of the digit sequence: scan from the right for the first position where a digit is smaller than its right neighbor, exchange it with the smallest bigger digit on its right, then order the trailing digits increasingly. A fully non-increasing digit sequence has no greater permutation.

**Example 1:**
```
Input: n = 12
Output: 21
Explanation: 21 is the smallest integer larger than 12 using digits 1 and 2.
```

**Example 2:**
```
Input: n = 21
Output: -1
Explanation: The digits are in descending order, so nothing larger is possible.
```

**Example 3:**
```
Input: n = 12443322
Output: 13222344
Explanation: Swapping the pivot 2 with the 3 on its right and sorting the tail gives the next arrangement.
```

**Constraints:**
- `1 <= n <= 2^31 - 1`
