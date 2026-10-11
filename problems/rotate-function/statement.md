For an array `nums` of length `n`, imagine spinning it clockwise: the last entry moves to the front, and every other entry shifts one slot right. Repeating the spin produces `n` arrangements `arr0 ... arr(n-1)`, where `arr0` is the original. Score each arrangement by weighting positions: `F(k) = 0*arrk[0] + 1*arrk[1] + ... + (n-1)*arrk[n-1]`. Return the largest score among the `n` spins.

**Example 1:**
```
Input: nums = [4,3,2,6]
Output: 26
Explanation: The four spins score 25, 16, 23 and 26; the best is 26.
```

**Example 2:**
```
Input: nums = [100]
Output: 0
Explanation: A single entry always scores 0 * 100 = 0.
```

**Example 3:**
```
Input: nums = [1,2,3]
Output: 8
Explanation: Scores are 8, 5 and 5. The best is 8.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-100 <= nums[i] <= 100`
- The answer fits in a 32-bit signed integer.

Recomputing each score from scratch costs quadratic time; derive each score from the previous one in constant time.
