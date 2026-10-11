Call an integer powerful when it can be written as `x^i + y^j` for some non-negative integers `i` and `j`. Given `x`, `y` and `bound`, return every powerful integer that does not exceed `bound`, in increasing order, as an integer list. Any order is accepted by the judge.

**Example 1:**
```
Input: x = 2, y = 3, bound = 10
Output: [2,3,4,5,7,9,10]
Explanation: The sums 2^i + 3^j within bound are 2, 3, 4, 5, 7, 9 and 10 (order does not matter).
```

**Example 2:**
```
Input: x = 3, y = 5, bound = 15
Output: [2,4,6,8,10,14]
Explanation: Reachable sums are 2, 4, 6, 8, 10 and 14; everything else overshoots the bound.
```

**Example 3:**
```
Input: x = 2, y = 1, bound = 10
Output: [2,3,5,9]
Explanation: Since 1^j is always 1, the sums are 2, 3, 5 and 9.
```

**Constraints:**
- `1 <= x, y <= 100`
- `0 <= bound <= 10^6`
- The answers form an integer list.
