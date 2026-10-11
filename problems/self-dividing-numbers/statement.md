A positive integer is called self-dividing when every one of its decimal digits is non-zero and the number is divisible by each of those digits. For example, 128 divides evenly by 1, 2 and 8.

Given two bounds `left` and `right` with `left <= right`, collect every self-dividing number in that closed interval and return them in increasing order.

**Example 1:**
```
Input: left = 1, right = 22
Output: [1,2,3,4,5,6,7,8,9,11,12,15,22]
Explanation: 10 is skipped because it contains 0, and 13 is skipped because 13 % 3 != 0.
```

**Example 2:**
```
Input: left = 47, right = 85
Output: [48,55,66,77]
Explanation: Each listed value divides evenly by all of its digits.
```

**Example 3:**
```
Input: left = 1, right = 1
Output: [1]
```

**Constraints:**
- `1 <= left <= right <= 10000`
