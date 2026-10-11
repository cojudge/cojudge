import java.util.*;
class Marker {
    static class Codec {
        private Map<String, String> longToShort = new HashMap<>();
        private Map<String, String> shortToLong = new HashMap<>();
        private int counter = 0;
        private static final String PREFIX = "http://tinyurl.com/";
        public String encode(String longUrl) {
            if (longToShort.containsKey(longUrl)) return PREFIX + longToShort.get(longUrl);
            String key = Integer.toString(counter++, 36);
            longToShort.put(longUrl, key);
            shortToLong.put(key, longUrl);
            return PREFIX + key;
        }
        public String decode(String shortUrl) {
            String key = shortUrl.substring(shortUrl.lastIndexOf('/') + 1);
            return shortToLong.getOrDefault(key, "");
        }
    }
    public String codecRoundTrip(String url) {
        Codec codec = new Codec();
        return codec.decode(codec.encode(url));
    }
    public boolean isCorrect(String url, String output) {
        return output != null && codecRoundTrip(url).equals(output);
    }
}
