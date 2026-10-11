You have `n` coins. You stack them row by row: the first row uses `1` coin, the second row uses `2` coins, the third uses `3`, and so on. Each new row needs one more coin than the previous row.

Report how many full rows you can build before running out of coins. Any leftover coins that cannot fill the next row are ignored.

**Example 1:**
```
Input: n = 5
Output: 2
Explanation: Rows of 1 then 2 use 3 coins, leaving 2, which is not enough for a row of 3.
```

**Example 2:**
```
Input: n = 8
Output: 3
Explanation: Rows of 1, 2 and 3 use 6 coins, leaving 2, which is not enough for a row of 4.
```

**Constraints:**
- `1 <= n <= 2^31 - 1`
