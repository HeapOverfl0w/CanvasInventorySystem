const ITEM_ICON_IMAGE = document.getElementById("itemIcons");
const MENU_SPRITE_SHEET = document.getElementById("menuItems");

const itemTypeToIconLocation = function(type) {
    switch (type) {
        default:
            return new Vector2D(0,0);
    }
}

class InventorySlot {
    constructor(slot, location, itemIconSize, inventory) {
        this.slot = slot;
        this.location = location;
        this.item = undefined;
        this.itemIconSize = itemIconSize;
        this.inventory = inventory;
        this.removeButton = new Button(new Vector2D(0,0), new Vector2D(0,16), new Vector2D(this.location.x + 40, this.location.y), new Vector2D(32, 16), this, this.removeClicked);
    }

    onMouseOver(location) {
        if (this.item) {
            this.removeButton.onMouseOver(location);
        }
    }

    onMouseClick(location) {
        if (this.item) {
            this.removeButton.onMouseClick(location);
        }
    }

    removeClicked(menu) {
        let item = menu.item;
        let inventory = menu.inventory;
        if (item && inventory.inventoryBag.items.length < inventory.inventoryBag.maxSlots) {
            inventory.inventoryBag.items.push(item);
            inventory.inventoryBag.update();
            menu.item = undefined;
        }        
    }

    isInsideAndEquip(location, item) {
        if (this.isInside(location)) {
            this.equip(item);
        }
    }

    isInside(location) {
        return (this.location.x <= location.x && this.location.x + this.itemIconSize.x >= location.x) && 
                (this.location.y <= location.y && this.location.y + this.itemIconSize.y >= location.y);
    }

    equip(item) {
        if (this.item) {
            this.slot.item = undefined;
        }

        this.item = item;
        this.slot.item = this.item;  
    }

    drawItemMouseOver(ctx) {
        if (this.item) {
            ctx.fillStyle = "#00000050";
            ctx.fillRect(this.location.x + this.itemIconSize.x, this.location.y, 100, 200);
            ctx.fillStyle = TEXT_COLOR;
            ctx.fillText(this.item.name, this.location.x + this.itemIconSize.x + 4, this.location.y + 14);
        }
    }

    draw(ctx) {
        if (this.item) {
            ctx.drawImage(ITEM_ICON_IMAGE, this.item.itemIconLocation.x, this.item.itemIconLocation.y, this.itemIconSize.x, this.itemIconSize.y,
                this.location.x, this.location.y, this.itemIconSize.x, this.itemIconSize.y);
            this.removeButton.draw(ctx);            
        } else {
            //draw empty slot
            ctx.drawImage(ITEM_ICON_IMAGE, 0, 0, this.itemIconSize.x, this.itemIconSize.y, this.location.x, this.location.y, this.itemIconSize.x, this.itemIconSize.y);
        }

        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.slot.name, this.location.x + this.itemIconSize.x, this.location.y + 10);
    }
}

class InventoryItem {
    constructor(item, itemIconLocation, itemIconSize, location) {
        this.item = item;
        this.itemIconLocation = itemIconLocation;
        this.itemIconSize = itemIconSize;
        this.location = location;
        this.dragLocation = undefined;
    }

    isInside(location) {
        return (this.location.x <= location.x && this.location.x + this.itemIconSize.x >= location.x) && 
                (this.location.y <= location.y && this.location.y + this.itemIconSize.y >= location.y);
    }
    
    drawItemMouseOver(ctx) {
        if (this.item) {
            ctx.fillStyle = "#00000050";
            ctx.fillRect(this.location.x + this.itemIconSize.x, this.location.y, 100, 200);
            ctx.fillStyle = TEXT_COLOR;
            ctx.fillText(this.item.name, this.location.x + this.itemIconSize.x + 4, this.location.y + 14);
        }
    }

    draw(ctx) {
        if (this.dragLocation) {
            ctx.drawImage(ITEM_ICON_IMAGE, this.itemIconLocation.x, this.itemIconLocation.y, this.itemIconSize.x, this.itemIconSize.y,
                this.dragLocation.x, this.dragLocation.y, this.itemIconSize.x, this.itemIconSize.y);
        } else {
            ctx.drawImage(ITEM_ICON_IMAGE, this.itemIconLocation.x, this.itemIconLocation.y, this.itemIconSize.x, this.itemIconSize.y,
                this.location.x, this.location.y, this.itemIconSize.x, this.itemIconSize.y);
        }        
    }
}

class InventoryBag {
    constructor(items, maxSlots, maxSlotColumns, itemIconSize, location) {
        this.items = items;
        this.maxSlots = maxSlots;
        this.maxSlotColumns = maxSlotColumns;
        this.location = location;
        this.itemIconSize = itemIconSize;
        this.update();
    }

    update() {
        this.inventoryItems = [];
        let currentColumn = 0;
        let currentRow = 0;
        for (let i = 0; i < this.items.length; i++) {
            let canvasLocation = new Vector2D(this.location.x + currentColumn * this.itemIconSize.x, this.location.y + currentRow * this.itemIconSize.y);
            this.inventoryItems.push(new InventoryItem(this.items[i], this.items[i].itemIconLocation, this.itemIconSize, canvasLocation));

            if (currentColumn === this.maxSlotColumns) {
                currentColumn = 0;
                currentRow++;
            } else {
                currentColumn++;
            }       
        }
    }

    getInventoryItemAtLocation(location) {
        if (this.inventoryItems) {
            for(let i = 0; i < this.inventoryItems.length; i++) {
                 if (this.inventoryItems[i].isInside(location)) {
                    return this.inventoryItems[i];
                 }                 
            }
        }   
        
        return undefined;
    }

    draw(ctx) {
        let currentColumn = 0;
        let currentRow = 0;
        let draggingItem = undefined;
        for (let i = 0; i < this.maxSlots; i++) {
            let canvasLocation = new Vector2D(this.location.x + currentColumn * this.itemIconSize.x, this.location.y + currentRow * this.itemIconSize.y);
            if (this.inventoryItems && this.inventoryItems.length > i && this.inventoryItems[i] && !this.inventoryItems[i].dragLocation) {
                this.inventoryItems[i].draw(ctx);
            } else {
                //draw empty slot
                ctx.drawImage(ITEM_ICON_IMAGE, 0, 0, this.itemIconSize.x, this.itemIconSize.y, canvasLocation.x, canvasLocation.y, this.itemIconSize.x, this.itemIconSize.y);
            }

            if (this.inventoryItems[i] && this.inventoryItems[i].dragLocation) {
                draggingItem = this.inventoryItems[i];
            }

            if (currentColumn === this.maxSlotColumns) {
                currentColumn = 0;
                currentRow++;
            } else {
                currentColumn++;
            }        
        }

        if (draggingItem) {
            draggingItem.draw(ctx);
        }
    }
}

class Inventory {
    constructor(slots, items, itemIconSize, location, maxBagSlots) {
        this.location = location;
        this.itemIconSize = itemIconSize;
        this.inventoryBag = new InventoryBag(items, maxBagSlots, 6, itemIconSize, new Vector2D(this.location.x, this.location.y + this.itemIconSize.y * slots.length));
        
        this.draggingItem = undefined;
        this.mouseOverItem = undefined;

        this.inventorySlots = [];
        for (let i = 0; i < slots.length; i++) {
            let slotLocation = new Vector2D(this.location.x, this.location.y + this.itemIconSize.y * i);
            this.inventorySlots.push(new InventorySlot(slots[i], slotLocation, this.itemIconSize, this));
        }
    }

    onMouseDown(location) {
        let item = this.inventoryBag.getInventoryItemAtLocation(location);
        if (item) {
            this.draggingItem = item;
        } else {
            for (let i = 0; i < this.inventorySlots.length; i++) {
                this.inventorySlots[i].onMouseClick(location);
            }
        }
    }

    onMouseMove(location) {
        if (this.draggingItem) {
            this.draggingItem.dragLocation = new Vector2D(location.x - this.itemIconSize.x/2, location.y - this.itemIconSize.y/2);
        } else {
            //show item tooltip
            let item = this.inventoryBag.getInventoryItemAtLocation(location);
            if (!item) {
                for (let i = 0; i < this.inventorySlots.length; i++) {
                    this.inventorySlots[i].onMouseOver(location);
                    if (this.inventorySlots[i].isInside(location)) {
                        item = this.inventorySlots[i];
                        break;
                    }
                }
            }
            this.mouseOverItem = item;
        }
    }

    onMouseUp(location) {
        if (this.draggingItem) {
            for (let i = 0; i < this.inventorySlots.length; i++) {
                if (this.inventorySlots[i].isInside(location) && 
                    this.inventorySlots[i].slot.type === this.draggingItem.item.type) {
                    //unequip old item if one is on and add it to inventory bag
                    if (this.inventorySlots[i].item) {
                        this.inventoryBag.items.push(this.inventorySlots[i].item);
                    }
                    //remove item we're equiping from bag
                    let index = this.inventoryBag.items.indexOf(this.draggingItem.item);
                    if (index >= 0) {
                        this.inventoryBag.items.splice(index, 1);
                    }

                    this.inventorySlots[i].equip(this.draggingItem.item);
                    break;
                }
            }

            this.draggingItem.dragLocation = undefined;
            this.draggingItem = undefined;
            this.inventoryBag.update();
        }
    }
    
    draw(ctx) {
        //TODO: Put a background image
        ctx.fillStyle = '#00258c';
        ctx.font = TEXT_FONT;
        ctx.fillRect(0,0, 500, 400);
        //draw inventory slots
        for (let i = 0; i < this.inventorySlots.length; i++) {
            this.inventorySlots[i].draw(ctx);
        }

        //draw bag
        this.inventoryBag.draw(ctx)

        if (this.mouseOverItem) {
            this.mouseOverItem.drawItemMouseOver(ctx);
        }
    }
}