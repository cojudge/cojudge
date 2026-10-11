You receive a list of folder descriptions. Each description names one folder followed by the files directly inside it, where every file token carries its stored text in trailing parentheses.

For instance, the description `root/a 1.txt(abcd) 2.txt(efgh)` means folder `root/a` contains `1.txt` holding `abcd` and `2.txt` holding `efgh`.

Two files count as duplicates exactly when their stored texts match character for character, no matter how their names or folders differ. Collect every maximal set of files sharing one text, but only keep sets with at least two members. Return those sets as lists of full paths built with a slash between folder and file name, such as `root/a/1.txt`.

The order of the groups and the order inside each group do not matter.

**Example 1:**
```
Input: paths = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)","root 4.txt(efgh)"]
Output: [["root/a/2.txt","root/c/d/4.txt","root/4.txt"],["root/a/1.txt","root/c/3.txt"]] (order may vary)
Explanation: The abcd files gather in one group and the efgh files in another.
```

**Example 2:**
```
Input: paths = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd) 4.txt(efgh)"]
Output: [["root/a/1.txt","root/c/3.txt"],["root/a/2.txt","root/c/4.txt"]] (order may vary)
```

**Example 3:**
```
Input: paths = ["root/a 1.txt(abcd)"]
Output: []
Explanation: With no partner, the lone file is dropped.
```

**Constraints:**
- Each folder description holds at least one file.
- Folder names, file names, and stored texts use only letters and digits.
- Stored text length is between 1 and 50 characters.
- Total file count is modest (fits easily in memory).

*Adaptation: the input list maps to `string_array` and the grouped output maps to `string_list_2d` in this judge.*
