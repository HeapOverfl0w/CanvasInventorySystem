class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }
}