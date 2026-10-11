You are given a strictly increasing array of positive integers `arr`. A subsequence of `arr` is called Fibonacci-like when it contains at least three numbers and every element from the third onward equals the sum of the two elements right before it.

Return the length of the longest Fibonacci-like subsequence. When no such subsequence exists, return `0`.

**Example 1:**
```
Input: arr = [1,2,3,4,5,6,7,8]
Output: 5
Explanation: One longest pick is [1,2,3,5,8] since 1 + 2 = 3, 2 + 3 = 5 and 3 + 5 = 8.
```

**Example 2:**
```
Input: arr = [1,3,7,11,12,14,18]
Output: 3
Explanation: The triples [1,11,12], [3,11,14] and [7,11,18] each follow the rule, and nothing longer does.
```

**Example 3:**
```
Input: arr = [1,2,4]
Output: 0
Explanation: The only triple is [1,2,4] and 1 + 2 is not 4.
```

**Constraints:**
- `3 <= arr.length <= 1000`
- `1 <= arr[i] <= 10^9`
- All values of `arr` are distinct and sorted in increasing order.
