A row of trees holds fruit kinds recorded in `fruits`, where each entry names the kind on that tree. You carry two baskets, each dedicated to a single kind (the two kinds may end up the same only if you never use the second basket). Starting at any tree and stepping rightward, you must take exactly one fruit per tree while the kinds fit into your two baskets, and you halt before the first tree whose kind would demand a third basket.

Find the greatest number of fruits obtainable under those rules — equivalently, the length of the longest contiguous segment using at most two distinct values.

**Example 1:**
```
Input: fruits = [1,2,1]
Output: 3
Explanation: The whole row uses only kinds 1 and 2.
```

**Example 2:**
```
Input: fruits = [0,1,2,2]
Output: 3
Explanation: The tail [1,2,2] uses two kinds and is the longest feasible stretch.
```

**Example 3:**
```
Input: fruits = [1,2,3,2,2]
Output: 4
Explanation: The tail [2,3,2,2] spans four trees with two kinds.
```

**Constraints:**
- `1 <= fruits.length <= 10^5`
- `0 <= fruits[i] < fruits.length`
