Build a word store that supports a fuzzy lookup. Design adaptation: instead of implementing a class, you implement `runMagicDictionary(operations, words)` using only the allowed array types.

Calling convention:

- `operations[i]` is either `"buildDict"` or `"search"`.
- When it is `"buildDict"`, `words[i]` packs the entire dictionary as words joined by `"|"` (for example `"hello|leetcode"`). An empty string means an empty dictionary. This call replaces any prior dictionary and produces no output entry.
- When it is `"search"`, `words[i]` is a single query word. Append `1` to the answer when some dictionary word has the same length and differs in exactly one position; otherwise append `0`.

Return the list of `1/0` answers for the search calls in order.

**Example 1:**
```
Input: operations = ["buildDict","search","search","search","search"]
       words = ["hello|leetcode","hello","hhllo","hell","leetcoded"]
Output: [0,1,0,0]
Explanation: hhllo differs from hello in one spot; the others have no one-change partner.
```

**Example 2:**
```
Input: operations = ["buildDict","search","search"]
       words = ["hello|hallo","hello","hallo"]
Output: [1,1]
```

**Constraints:**
- Operation count per test is between 1 and 20.
- Words use lowercase letters; packed dictionaries use '|' only as a separator.
