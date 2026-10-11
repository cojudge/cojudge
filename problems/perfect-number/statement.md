A positive whole number is called perfect when it equals the sum of all its proper divisors, meaning every divisor except the number itself. For instance, 6 qualifies because 1 + 2 + 3 = 6, while 8 does not because 1 + 2 + 4 = 7.

Given `num`, decide whether it is perfect.

**Example 1:**
```
Input: num = 28
Output: true
Explanation: Its proper divisors 1, 2, 4, 7 and 14 add up to 28.
```

**Example 2:**
```
Input: num = 8
Output: false
Explanation: The proper divisors 1, 2 and 4 sum to 7, not 8.
```

**Example 3:**
```
Input: num = 1
Output: false
Explanation: 1 has no proper divisors, so the empty sum 0 differs from 1.
```

**Constraints:**
- `1 <= num <= 10^8`
