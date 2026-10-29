A row of trees holds fruit kinds recorded in `fruits`, where each entry names the kind on that tree. You carry two baskets, each dedicated to a single kind (the two kinds may end up the same only if you never use the second basket). Starting at any tree and stepping rightward, you must take exactly one fruit per tree while the kinds fit into your two baskets, and you halt before the first tree whose kind would demand a third basket.

Find the greatest number of fruits obtainable under those rules — equivalently, the length of the longest contiguous segment using at most two distinct values.

**Constraints:**
- `1 <= fruits.length <= 10^5`
- `0 <= fruits[i] < fruits.length`
