You are given an integer array `nums` and an integer `k`. A *k-diff pair* is a pair of distinct positions `(i, j)` with `i != j` such that `|nums[i] - nums[j]| == k`. Pairs are compared by their values, not their positions: for example, `(1, 2)` and `(2, 1)` describe the same pair, and two position pairs holding the same two values count only once.

Return the number of distinct k-diff pairs in the array.

**Example 1:**
```
Input: nums = [3,1,4,1,5], k = 2
Output: 2
Explanation: The distinct pairs are (1,3) and (3,5).
```

**Example 2:**
```
Input: nums = [1,2,3,4,5], k = 1
Output: 4
Explanation: The pairs are (1,2), (2,3), (3,4), and (4,5).
```

**Example 3:**
```
Input: nums = [1,3,1,5,4], k = 0
Output: 1
Explanation: Only the value 1 appears at least twice, giving the pair (1,1).
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^7 <= nums[i] <= 10^7`
- `0 <= k <= 10^7`
