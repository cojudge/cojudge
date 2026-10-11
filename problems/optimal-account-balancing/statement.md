You are given money transfers between people. Each entry `transactions[i] = [from, to, amount]` means person `from` paid person `to` the amount `amount`.

After all recorded transfers, the group wants to settle up with the fewest possible new payments (each new payment can be any positive amount between any two people). People not involved in any transfer are ignored.

Return the minimum number of settlement transfers required so that everyone ends with a net balance of zero.

**Example 1:**
```
Input: transactions = [[0,1,10],[2,0,5]]
Output: 2
Explanation: Net balances are -5 for person 0, +10 for person 1, and -5 for person 2. Two payments clear everything, for instance person 0 and person 2 each pay person 1.
```

**Example 2:**
```
Input: transactions = [[0,1,10],[1,0,1],[1,2,5],[2,0,5]]
Output: 1
Explanation: Net balances collapse so that a single payment settles every account.
```

**Constraints:**
- `1 <= transactions.length <= 8`
- `0 <= from, to <= 20`, `from != to`
- `1 <= amount <= 100`
