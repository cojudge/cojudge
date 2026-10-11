Pick the biggest group of numbers where every two members divide evenly one way or the other.

You are given an array `nums` of distinct positive integers. Choose a subset `answer` as large as possible such that for every pair of values `x`, `y` inside it, one of them divides the other (that is, `x % y == 0` or `y % x == 0`). The order of the returned group does not matter; when several biggest groups exist, any one of them is accepted.

*Portable adaptation:* the classic statement returns a list of boxed integers; here return a plain integer array holding the same values.

**Example 1:**
```
Input: nums = [1,2,3]
Output: [1,2]
Explanation: Both 1 divides 2, so [1,2] is valid and has the maximum size 2. The group [1,3] would also be accepted.
```

**Example 2:**
```
Input: nums = [1,2,4,8]
Output: [1,2,4,8]
Explanation: After sorting, each value divides the next one, so the whole input fits and every pair divides evenly.
```

**Example 3:**
```
Input: nums = [3,5,10,20]
Output: [5,10,20]
Explanation: 5 divides 10, 10 divides 20, and 5 divides 20, giving size 3. No group of size 4 exists.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 2 * 10^9`
- Every value in `nums` is distinct.
