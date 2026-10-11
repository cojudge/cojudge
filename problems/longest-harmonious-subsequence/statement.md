A subsequence is harmonious when its largest and smallest values differ by exactly one. Given `nums`, return the length of the longest harmonious subsequence; return 0 when none exists. Order inside the subsequence does not matter, only values.

**Example 1:**
```
Input: nums = [1,3,2,2,5,2,3,7]
Output: 5
Explanation: Values 2 and 3 differ by one and appear five times together.
```

**Example 2:**
```
Input: nums = [1,2,3,4]
Output: 2
```

**Example 3:**
```
Input: nums = [1,1,1,1]
Output: 0
```

**Constraints:**
- `1 <= nums.length <= 20000`
- Values fit in 32-bit integers.
