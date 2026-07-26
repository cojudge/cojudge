import java.util.*;

class Marker {
    public int[][] runTwitter(String[] operations, int[][] args) {
        Twitter twitter = null;
        List<int[]> feeds = new ArrayList<>();

        for (int i = 0; i < operations.length; i++) {
            String operation = operations[i];
            if (operation.equals("Twitter")) {
                twitter = new Twitter();
            } else if (operation.equals("postTweet")) {
                twitter.postTweet(args[i][0], args[i][1]);
            } else if (operation.equals("getNewsFeed")) {
                feeds.add(twitter.getNewsFeed(args[i][0]));
            } else if (operation.equals("follow")) {
                twitter.follow(args[i][0], args[i][1]);
            } else if (operation.equals("unfollow")) {
                twitter.unfollow(args[i][0], args[i][1]);
            }
        }

        return feeds.toArray(new int[feeds.size()][]);
    }

    public boolean isCorrect(String[] operations, int[][] args, int[][] output) {
        return Arrays.deepEquals(runTwitter(operations, args), output);
    }

    private static final class Twitter {
        private final Map<Integer, List<Tweet>> tweetsByUser = new HashMap<>();
        private final Map<Integer, Set<Integer>> following = new HashMap<>();
        private int timestamp = 0;

        void postTweet(int userId, int tweetId) {
            tweetsByUser.computeIfAbsent(userId, ignored -> new ArrayList<>())
                    .add(new Tweet(tweetId, timestamp++));
        }

        int[] getNewsFeed(int userId) {
            Set<Integer> authors = new HashSet<>(following.getOrDefault(userId, Collections.emptySet()));
            authors.add(userId);

            PriorityQueue<Cursor> newest = new PriorityQueue<>((a, b) ->
                    Integer.compare(b.current().timestamp, a.current().timestamp));
            for (int author : authors) {
                List<Tweet> tweets = tweetsByUser.get(author);
                if (tweets != null && !tweets.isEmpty()) {
                    newest.offer(new Cursor(tweets, tweets.size() - 1));
                }
            }

            int[] buffer = new int[10];
            int size = 0;
            while (size < 10 && !newest.isEmpty()) {
                Cursor cursor = newest.poll();
                buffer[size++] = cursor.current().tweetId;
                cursor.index--;
                if (cursor.index >= 0) newest.offer(cursor);
            }
            return Arrays.copyOf(buffer, size);
        }

        void follow(int followerId, int followeeId) {
            following.computeIfAbsent(followerId, ignored -> new HashSet<>()).add(followeeId);
        }

        void unfollow(int followerId, int followeeId) {
            Set<Integer> followees = following.get(followerId);
            if (followees != null) followees.remove(followeeId);
        }
    }

    private static final class Tweet {
        final int tweetId;
        final int timestamp;

        Tweet(int tweetId, int timestamp) {
            this.tweetId = tweetId;
            this.timestamp = timestamp;
        }
    }

    private static final class Cursor {
        final List<Tweet> tweets;
        int index;

        Cursor(List<Tweet> tweets, int index) {
            this.tweets = tweets;
            this.index = index;
        }

        Tweet current() {
            return tweets.get(index);
        }
    }
}
