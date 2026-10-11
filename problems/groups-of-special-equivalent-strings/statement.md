All words in the list share one length. You may reorder letters freely, but only within the even slots among themselves and within the odd slots among themselves. Swapping two characters that both sit on even positions, or both on odd positions, is allowed as many times as you like.

Two words belong together when one can be turned into the other through such swaps. That happens exactly when their even-position multiset and their odd-position multiset match. Words that mutually match form a family; families do not overlap. Report how many distinct families appear.

**Constraints:**
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 20`
- `words[i]` holds only lowercase English letters.
- Every word has the same length.
