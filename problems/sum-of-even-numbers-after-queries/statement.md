You are given an integer array `nums` and a list of `queries`, where each query is a pair `[val, index]` meaning add `val` to `nums[index]`.

After applying each query in order, compute the sum of all even-valued entries in the array. Collect these sums into an answer array of the same length as `queries` and return it.

**Example 1:**
```
Input: nums = [1,2,3,4], queries = [[1,0],[-3,1],[-4,0],[2,3]]
Output: [8,6,2,4]
Explanation: The array evolves as [2,2,3,4], [2,-1,3,4], [−2,−1,3,4], [−2,−1,3,6]; even totals are 8, 6, 2, 4.
```

**Example 2:**
```
Input: nums = [1], queries = [[4,0]]
Output: [0]
Explanation: The entry becomes 5, which is odd, so the even total is 0.
```

**Constraints:**
- `1 <= nums.length <= 10000`
- `-10000 <= nums[i] <= 10000`
- `1 <= queries.length <= 10000`
- `queries[i] = [val, index]`, `-10000 <= val <= 10000`, `0 <= index < nums.length`.
