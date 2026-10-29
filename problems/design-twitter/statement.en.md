Implement the behavior of a simplified Twitter service through the portable function `runTwitter(operations, args)`.

The arrays are parallel. `operations[i]` names an operation and `args[i]` contains its integer arguments:

- `"Twitter"` with `[]` initializes the service and is always the first operation.
- `"postTweet"` with `[userId, tweetId]` posts a new tweet.
- `"getNewsFeed"` with `[userId]` requests up to the 10 most recent tweet IDs posted by that user or by users they follow.
- `"follow"` with `[followerId, followeeId]` starts following a user.
- `"unfollow"` with `[followerId, followeeId]` stops following a user; unfollowing a user who is not followed has no effect.

Return one row for each `getNewsFeed` operation and no row for constructors or mutating operations. Every feed row must be in exact reverse chronological order and contain at most 10 tweet IDs.

This is a function adaptation of the original class-design problem. There is intentionally no `classProblem` wrapper.

**Constraints:**

- `1 <= operations.length == args.length <= 30001`
- The first operation is `"Twitter"` with an empty argument row.
- Every later operation is one of `postTweet`, `getNewsFeed`, `follow`, or `unfollow` and has the argument count described above.
- `1 <= userId, followerId, followeeId <= 500`
- `0 <= tweetId <= 10000`, and all posted tweet IDs in one test are unique.
- `followerId != followeeId`.
