You are given a strictly increasing array of positive integers `arr`. A subsequence of `arr` is called Fibonacci-like when it contains at least three numbers and every element from the third onward equals the sum of the two elements right before it.

Return the length of the longest Fibonacci-like subsequence. When no such subsequence exists, return `0`.

**Constraints:**
- `3 <= arr.length <= 1000`
- `1 <= arr[i] <= 10^9`
- All values of `arr` are distinct and sorted in increasing order.
