A permutation of an integer array is one ordering of its elements. The *next permutation* of `nums` is the smallest ordering that is lexicographically larger than the current one; when the array is already the largest ordering, the next permutation wraps around to the smallest (fully ascending) ordering.

Reorganize `nums` into its next permutation and return the rearranged array. (On the original platform this operation is performed in place with `void` return; here you return the updated array so the judge can compare it directly.)

**Example 1:**
```
Input: nums = [1,2,3]
Output: [1,3,2]
Explanation: Among orderings above [1,2,3], [1,3,2] is the smallest.
```

**Example 2:**
```
Input: nums = [3,2,1]
Output: [1,2,3]
Explanation: [3,2,1] is the largest ordering, so wrap to the smallest.
```

**Example 3:**
```
Input: nums = [1,1,5]
Output: [1,5,1]
Explanation: Duplicates included, [1,5,1] is the next larger ordering.
```

**Constraints:**
- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 100`

*Adaptation note:* the classic statement asks for an in-place `void` update; this version returns the rearranged array instead, which carries exactly the same information.
