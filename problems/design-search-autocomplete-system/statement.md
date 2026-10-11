Maintain a sentence store where each sentence has a heat (usage count). Typing builds a prefix character by character; after every keystroke the system proposes up to three stored sentences starting with the current prefix, ordered by higher heat first and ASCII order for ties. Typing `#` ends the current query: the finished prefix is stored (heat 1) or bumped by 1, and the prefix resets.

This task uses a portable function adaptation instead of a class. Implement:

```
runAutocomplete(operations, values)
```

The two arrays are parallel. `operations[i]` is `"AutocompleteSystem"` or `"input"`, and `values[i]` packs arguments as plain strings:

- `"AutocompleteSystem"` with `"s1:t1;s2:t2;..."` preloads sentences and heats (`:` splits sentence from heat, `;` splits entries), e.g. `"i love you:5;island:3"`. An empty string preloads nothing.
- `"input"` with a single character `c` (a lowercase letter, a space, or `"#"`).

Return one string row per `input` call: the suggested sentences in order (possibly empty). Ending with `#` contributes an empty row. There is intentionally no class wrapper.

**Example 1:**
```
Input: operations = ["AutocompleteSystem","input","input","input","input"], values = ["i love you:5;island:3;ironman:2;i love leetcode:2", "i", " ", "a", "#"]
Output: [["i love you","island","i love leetcode"],["i love you","i love leetcode"],[],[]]
Explanation: Prefix "i" matches three sentences by heat; "i " narrows to two; "i a" matches nothing; "#" stores "i a".
```

**Example 2:**
```
Input: operations = ["AutocompleteSystem","input","input"], values = ["abc:2;abd:2;abe:2", "a", "b"]
Output: [["abc","abd","abe"],["abc","abd","abe"]]
Explanation: Tied heats fall back to ASCII order.
```

**Example 3:**
```
Input: operations = ["AutocompleteSystem","input"], values = ["", "z"]
Output: [[]]
```

**Constraints:**
- `1 <= operations.length == values.length <= 500`
- The first operation is `"AutocompleteSystem"`.
- Preloaded sentences hold lowercase letters and spaces, length `1..100`; heats are `1..1000`.
- `input` values are single characters: `a-z`, `' '`, or `'#'`.
- At most 100 distinct sentences are stored per test.
