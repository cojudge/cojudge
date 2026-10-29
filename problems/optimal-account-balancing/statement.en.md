You are given money transfers between people. Each entry `transactions[i] = [from, to, amount]` means person `from` paid person `to` the amount `amount`.

After all recorded transfers, the group wants to settle up with the fewest possible new payments (each new payment can be any positive amount between any two people). People not involved in any transfer are ignored.

Return the minimum number of settlement transfers required so that everyone ends with a net balance of zero.

**Constraints:**
- `1 <= transactions.length <= 8`
- `0 <= from, to <= 20`, `from != to`
- `1 <= amount <= 100`
