Each entry `accounts[i]` opens with a holder name in `accounts[i][0]`, followed by one or more email addresses attached to that entry.

Entries that share at least one email address must be fused, since that overlap proves they describe the same individual. People may happen to share a name while remaining different individuals, so a matching name alone never justifies a fusion. One person may start out with arbitrarily many entries, but every entry of theirs carries an identical name.

Once fusing is finished, emit each merged person as a single list: the shared name first, then all of their distinct emails arranged in sorted order. The merged people themselves may appear in any order.

**Example 1:**
```
Input: accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
```
The first two John entries overlap on johnsmith@mail.com, so their three addresses combine under one John; the remaining Mary and John entries stay separate.

**Constraints:**
- `1 <= accounts.length <= 1000`
- `2 <= accounts[i].length <= 10`
- `1 <= accounts[i][j].length <= 30`
- `accounts[i][0]` consists of English letters
- `accounts[i][j] (j > 0)` is a valid email
