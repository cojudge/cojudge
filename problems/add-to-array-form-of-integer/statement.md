The array form of a non-negative integer lists its decimal digits from the most
significant digit to the least significant digit. For example, the array form
of `1200` is `[1,2,0,0]`.

You are given the array form `num` of an integer together with a non-negative
integer `k`. Add the two values and return the array form of the result.

**Example 1:**
```
Input: num = [1,2,0,0], k = 34
Output: [1,2,3,4]
Explanation: 1200 + 34 = 1234.
```

**Example 2:**
```
Input: num = [2,7,4], k = 181
Output: [4,5,5]
Explanation: 274 + 181 = 455.
```

**Example 3:**
```
Input: num = [2,1,5], k = 806
Output: [1,0,2,1]
Explanation: 215 + 806 = 1021.
```

**Constraints:**
- `1 <= num.length <= 10^4`
- `0 <= num[i] <= 9`
- `0 <= k <= 10^4`
