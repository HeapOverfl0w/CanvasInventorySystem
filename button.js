class Button {
    constructor(imageLocation, mouseOverLocation, location, size, menu, onClickCallback) {
        this.imageLocation = imageLocation;
        this.mouseOverLocation = mouseOverLocation;
        this.menu = menu;
        this.location = location;
        this.size = size;
        this.bottomRightLocation = new Vector2D(this.location.x + this.size.x, this.location.y + this.size.y);
        this.isMouseOver = false;
        this.onClickCallback = onClickCallback;
    }

    isInside(location) {
        return (this.location.x <= location.x && this.location.x + this.size.x >= location.x) && 
                (this.location.y <= location.y && this.location.y + this.size.y >= location.y);
    }

    onMouseOver(mouseLocation) {
        if (this.isInside(mouseLocation)) {
            this.isMouseOver = true;
        } else {
            this.isMouseOver = false;
        }
    }

    onMouseClick(mouseLocation) {
        if (this.isInside(mouseLocation)) {
            this.onClickCallback(this.menu);
        }
    }

    draw(ctx) {
        if (this.isMouseOver) {
            ctx.drawImage(MENU_SPRITE_SHEET, this.mouseOverLocation.x, this.mouseOverLocation.y, this.size.x, this.size.y,
                this.location.x, this.location.y, this.size.x, this.size.y);
        } else {
            ctx.drawImage(MENU_SPRITE_SHEET, this.imageLocation.x, this.imageLocation.y, this.size.x, this.size.y,
                this.location.x, this.location.y, this.size.x, this.size.y);
        }
    }
}