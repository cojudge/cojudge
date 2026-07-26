## Approach

Store tweets in one chronological list and maintain a set of followees for each user. For a news-feed request, scan tweets from newest to oldest, collecting tweets from the user or a followed author until the feed contains 10 entries.

## Complexity Analysis

- **Time Complexity:** O(Q * T) in the worst case, where `Q` is the number of operations and `T` is the number of posted tweets; since `T <= Q`, this is O(Q^2).
- **Space Complexity:** O(T + F + Q), where `F` is the number of active follow relationships and the O(Q) term accounts for returned feed rows.

## Implementation

```python
from typing import Dict, List, Set, Tuple


class Solution:
    def runTwitter(self, operations: List[str], args: List[List[int]]) -> List[List[int]]:
        tweets: List[Tuple[int, int]] = []
        following: Dict[int, Set[int]] = {}
        feeds: List[List[int]] = []

        for operation, values in zip(operations, args):
            if operation == "postTweet":
                tweets.append((values[0], values[1]))
            elif operation == "follow":
                following.setdefault(values[0], set()).add(values[1])
            elif operation == "unfollow":
                following.get(values[0], set()).discard(values[1])
            elif operation == "getNewsFeed":
                user_id = values[0]
                followees = following.get(user_id, set())
                feed = []
                for author, tweet_id in reversed(tweets):
                    if author == user_id or author in followees:
                        feed.append(tweet_id)
                        if len(feed) == 10:
                            break
                feeds.append(feed)
        return feeds
```
