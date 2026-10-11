Alice and Bob hold boxes of candy of various sizes. Alice's boxes have sizes `aliceSizes` and Bob's have sizes `bobSizes`. They agree to swap exactly one box each so that afterward both own the same total amount of candy.

Return any pair `[a, b]` where `a` is a size from Alice and `b` is a size from Bob that achieves this fair trade. The inputs guarantee at least one such pair exists.

**Example 1:**
```
Input: aliceSizes = [1,1], bobSizes = [2,2]
Output: [1,2]
Explanation: After swapping a 1 for a 2, both totals equal 3.
```

**Example 2:**
```
Input: aliceSizes = [1,2], bobSizes = [2,3]
Output: [1,2]
Explanation: After swapping a 1 for a 2, both totals equal 4.
```

**Example 3:**
```
Input: aliceSizes = [2], bobSizes = [1,3]
Output: [2,3]
Explanation: After swapping the 2 for the 3, both totals equal 3.
```

**Constraints:**
- `1 <= aliceSizes.length, bobSizes.length <= 10^4`
- `1 <= aliceSizes[i], bobSizes[i] <= 10^5`
- The two totals differ by an even amount, and at least one fair swap exists.
