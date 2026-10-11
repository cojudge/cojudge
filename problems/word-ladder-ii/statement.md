A ladder from `beginWord` to `endWord` is a chain where neighboring words differ by exactly one letter, every middle word belongs to `wordList`, and the final word equals `endWord`. The starting word itself does not need to appear in `wordList`.

Return every shortest possible ladder as a list of words from start to finish. If no ladder exists, return an empty list. The order of the ladders does not matter.

**Constraints:**
- `1 <= beginWord.length <= 5`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 500`
- `wordList[i].length == beginWord.length`
- All strings use lowercase English letters.
- `beginWord != endWord`
- All `wordList` entries are unique.

**Adaptation note:** The original return type is `List<List<String>>`. Here it is `string_list_2d`, with order-insensitive grading: any permutation of the ladder set is accepted.
