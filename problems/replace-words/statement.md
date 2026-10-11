You get a list `dictionary` of root words and a sentence of space-separated words. For each word in the sentence, look for the shortest root that is a prefix of it; when one exists, swap the whole word for that root. Words with no matching root stay unchanged.

Implement `replaceWords(dictionary, sentence)` returning the rebuilt sentence with single spaces.

**Example 1:**
```
Input: dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
Output: "the cat was rat by the bat"
Explanation: "cattle" shortens to "cat", "rattled" to "rat", and "battery" to "bat".
```

**Example 2:**
```
Input: dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"
Output: "a a b c"
Explanation: Every word starts with one of the single-letter roots.
```

**Example 3:**
```
Input: dictionary = ["abc"], sentence = "def ghi"
Output: "def ghi"
Explanation: No word starts with "abc", so nothing changes.
```

**Constraints:**
- `1 <= dictionary.length <= 1000`
- `1 <= dictionary[i].length <= 100`
- `1 <= sentence.length <= 10^6`; words hold lowercase letters, joined by single spaces.
