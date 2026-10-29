Pick the biggest group of numbers where every two members divide evenly one way or the other.

You are given an array `nums` of distinct positive integers. Choose a subset `answer` as large as possible such that for every pair of values `x`, `y` inside it, one of them divides the other (that is, `x % y == 0` or `y % x == 0`). The order of the returned group does not matter; when several biggest groups exist, any one of them is accepted.

*Portable adaptation:* the classic statement returns a list of boxed integers; here return a plain integer array holding the same values.

**Constraints:**
- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 2 * 10^9`
- Every value in `nums` is distinct.
