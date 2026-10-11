Build a container that records inserted words and can later test query strings against them.

Provide the `WordDictionary` type with these members:

- `WordDictionary()` Creates an empty container.
- `void addWord(word)` Stores `word` so that later queries may match it.
- `bool search(word)` Reports `true` when some stored entry matches `word`, else `false`. A dot `'.'` inside the query stands for an arbitrary single letter.

**Example 1:**
```
Input: operations = ["WordDictionary","addWord","addWord","addWord","search","search","search","search"], values = ["","bad","dad","mad","pad","bad",".ad","b.."]
Output: [null,null,null,null,false,true,true,true]
```

**Example 2:**
```
Input: operations = ["WordDictionary","addWord","search","search","search"], values = ["","a",".","a","aa"]
Output: [null,null,true,true,false]
```

**Constraints:**
- `1 <= word.length <= 25`
- `word` in `addWord` consists of lowercase English letters.
- `word` in `search` consist of `'.'` or lowercase English letters.
- There will be at most `10^4` calls to `addWord` and `search`.
