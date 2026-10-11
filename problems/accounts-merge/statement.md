Each entry `accounts[i]` opens with a holder name in `accounts[i][0]`, followed by one or more email addresses attached to that entry.

Entries that share at least one email address must be fused, since that overlap proves they describe the same individual. People may happen to share a name while remaining different individuals, so a matching name alone never justifies a fusion. One person may start out with arbitrarily many entries, but every entry of theirs carries an identical name.

Once fusing is finished, emit each merged person as a single list: the shared name first, then all of their distinct emails arranged in sorted order. The merged people themselves may appear in any order.

**Constraints:**
- `1 <= accounts.length <= 1000`
- `2 <= accounts[i].length <= 10`
- `1 <= accounts[i][j].length <= 30`
- `accounts[i][0]` consists of English letters
- `accounts[i][j] (j > 0)` is a valid email
