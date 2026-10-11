import java.util.*;
class Marker {
    public boolean reachingPoints(int sx, int sy, int tx, int ty) {
        long sX = sx, sY = sy, tX = tx, tY = ty;
        while (tX >= sX && tY >= sY) {
            if (tX == sX && tY == sY) return true;
            if (tX == sX) return (tY - sY) % tX == 0;
            if (tY == sY) return (tX - sX) % tY == 0;
            if (tX > tY) tX %= tY;
            else tY %= tX;
        }
        return false;
    }
    public boolean isCorrect(int sx, int sy, int tx, int ty, boolean output) {
        return reachingPoints(sx, sy, tx, ty) == output;
    }
}
