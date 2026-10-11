An ugly number is a positive integer whose prime factors are only 2, 3 and 5. The ordered list of ugly numbers starts 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 and continues without gaps.

Given `n`, return the `n`th ugly number, counting from 1.

**Example 1:**
```
Input: n = 10
Output: 12
Explanation: The first ten ugly numbers are [1,2,3,4,5,6,8,9,10,12], so the tenth is 12.
```

**Example 2:**
```
Input: n = 1
Output: 1
Explanation: 1 is the first ugly number.
```

**Example 3:**
```
Input: n = 11
Output: 15
Explanation: After 12 comes 15, since 11, 13 and 14 all contain other prime factors.
```

**Constraints:**
- `1 <= n <= 1690`
