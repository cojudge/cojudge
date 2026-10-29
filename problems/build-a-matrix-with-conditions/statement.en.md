Take a positive integer `k` alongside two collections of precedence pairs:
- a 2D integer array `rowConditions` holding `n` pairs shaped `rowConditions[i] = [abovei, belowi]`, plus
- a 2D integer array `colConditions` holding `m` pairs shaped `colConditions[i] = [lefti, righti]`.

Every entry appearing in either collection lies between `1` and `k` inclusive.

Assemble a `k x k` grid holding each integer `1` through `k` a single time, filling every unused position with `0`.

The placement must additionally respect both families of precedence rules:
- For each `i` from `0` to `n - 1`, the cell holding `abovei` sits in a strictly earlier row than the cell holding `belowi`.
- For each `i` from `0` to `m - 1`, the cell holding `lefti` sits in a strictly earlier column than the cell holding `righti`.

Produce any grid meeting all of the above; when the requirements conflict, produce a vacuous grid.

**Constraints:**
- `2 <= k <= 400`
- `1 <= rowConditions.length, colConditions.length <= 10^4`
- `rowConditions[i].length == colConditions[i].length == 2`
- `1 <= abovei, belowi, lefti, righti <= k`
- `abovei != belowi`
- `lefti != righti`
