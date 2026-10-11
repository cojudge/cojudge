You are given two arrays `nums1` and `nums2` of digits (each entry `0`–`9`, with lengths `m` and `n`) plus an integer `k` with `1 <= k <= m + n`. Build the largest possible number with exactly `k` digits by picking some digits from each array so that the digits taken from either array keep their original relative order.

Digits from the two arrays may be interleaved freely. Compare candidate numbers digit by digit from the most significant side (all have length `k`). Return the winning digits as an array.

**Example 1:**
```
Input: nums1 = [3,4,6,5], nums2 = [9,1,2,5,8,3], k = 5
Output: [9,8,6,5,3]
Explanation: Take [6,5] from the first array and [9,8,3] from the second, interleaved as 9,8,6,5,3.
```

**Example 2:**
```
Input: nums1 = [6,7], nums2 = [6,0,4], k = 5
Output: [6,7,6,0,4]
Explanation: Using every digit of both arrays in order gives the only (hence best) length-5 number.
```

**Example 3:**
```
Input: nums1 = [3,9], nums2 = [8,9], k = 3
Output: [9,8,9]
Explanation: Keeping 9 from the first array and 8,9 from the second yields 9,8,9, the maximum.
```

**Constraints:**
- `m == nums1.length`, `n == nums2.length`
- `1 <= m, n <= 500`
- `0 <= nums1[i], nums2[i] <= 9`
- `1 <= k <= m + n`
