Break a digit string into a Fibonacci-like list.

A list is Fibonacci-like when it holds at least three numbers, every value fits in a signed 32-bit integer, and each number from the third onward equals the sum of the two before it. Additionally, no number may carry a leading zero unless the number itself is exactly zero.

Given a string `num` of digits, split it into such a list using every character exactly once in order. Return any valid split, or an empty list when no split works.

**Example 1:**
```
Input: num = "1101111"
Output: [11,0,11,11]
Explanation: 11 + 0 = 11 and 0 + 11 = 11, with all characters consumed.
```

**Example 2:**
```
Input: num = "11235813"
Output: [1,1,2,3,5,8,13]
Explanation: Each value from 2 onward is the sum of the prior two.
```

**Example 3:**
```
Input: num = "112358130"
Output: []
Explanation: No way to partition the digits into a valid growing sequence.
```

**Constraints:**
- `1 <= num.length <= 200`
- `num` holds only digits.
