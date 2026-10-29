A triplet is an array of three positive integers. You are given `triplets` and a positive target triplet `target`.

You may repeatedly choose two different triplets and replace one of them with their element-wise maximum. Return `true` if some sequence of operations can produce `target`; otherwise, return `false`.

Equivalently, you may choose a subset of the input rows whose element-wise maximum is exactly `target`.

**Constraints:**

- `1 <= triplets.length <= 100000`
- `triplets[i].length == 3`
- `target.length == 3`
- `1 <= triplets[i][j], target[j] <= 1000`
