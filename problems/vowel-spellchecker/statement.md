A spellchecker holds a vocabulary `wordlist`. Each lookup query is answered by the first rule below that produces a match, scanning the vocabulary in order for rules 2 and 3:

1. Exact match: the query appears in the vocabulary verbatim — return it unchanged.
2. Case-insensitive match: some vocabulary word equals the query after lowercasing both — return that vocabulary word.
3. Vowel-error match: some vocabulary word equals the query after lowercasing both and replacing every vowel (`a`, `e`, `i`, `o`, `u`) with a wildcard — return that vocabulary word.
4. Otherwise return the empty string.

Answer every query in `queries` and return the answers in order as a string list.

**Example 1:**
```
Input: wordlist = ["KiTe","kite","hare","Hare"], queries = ["kite","Kite","KiTe","Hare","HARE","Hear","hear","keti","keet","keto"]
Output: ["kite","KiTe","KiTe","Hare","hare","","","KiTe","","KiTe"]
Explanation: Exact hits win first ('kite', 'KiTe', 'Hare'); case-insensitive matches resolve 'Kite' and 'HARE'; vowel-tolerant matches catch 'keti' and 'keto'.
```

**Example 2:**
```
Input: wordlist = ["yellow"], queries = ["YellOw"]
Output: ["yellow"]
Explanation: No exact hit exists, but lowercasing both sides matches 'yellow'.
```

**Example 3:**
```
Input: wordlist = ["hello","world"], queries = ["Hello","WORLD","hallo","warld","xyz"]
Output: ["hello","world","hello","world",""]
Explanation: 'hallo' shares the consonant skeleton of 'hello', while 'xyz' matches nothing and yields an empty string.
```

**Constraints:**
- `0 <= wordlist.length, queries.length <= 5000`
- Words contain only English letters; matching is described purely by the rules above.
- The vocabulary arrives as a string array and the answers form a string list.
