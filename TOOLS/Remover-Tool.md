# Code and Usages

## 〖〔 Tree Remover (default) Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code uses a **single tool**:

1. **Iron Spade**  
- **Alt Click** on a block → Removes all specified blocks in a defined area around the clicked block.

#### 〚 Code 〛

In addition to the tool, there are several important settings inside the code:

1. **User restriction**  
Change the username so the tool only works for you:

```
const user = "YourName"
```

2. **Breakable blocks**  
List the blocks you want the tool to remove. Only the base names are used (ignores metadata):

```
const breakableBlocks = [
    "Maple Leaves",
    "Maple Log",
    "Fruity Maple Leaves",
    "Vines",
    "Aspen Leaves",
    "Aspen Log"
]
```

3. **Area size**  
Controls how far the tool scans around the clicked block in each direction:

```
const posX = 2, negX = 2
const posY = 2, negY = 7
const posZ = 2, negZ = 2
```

- `posX` / `negX` → range along X axis  
- `posY` / `negY` → range along Y axis (height)  
- `posZ` / `negZ` → range along Z axis

4. **Item requirement**  
The tool only works if the player is holding the **Iron Spade**.  
You can remove this check if you want it to work with any item or empty hand:

```
const item = api.getHeldItem(playerId)
if (!item || item.name !== "Iron Spade") return
```

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 08 Tree Remover Tool

Permission is hereby granted, free of charge, to any person obtaining a copy

  
///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const user = "K4miNoK4mi"

/* area around the click */
const posX = 2, negX = 2
const posY = 2, negY = 7
const posZ = 2, negZ = 2

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

/* list of breakable blocks (base names only) */
const breakableBlocks = [
    "Maple Leaves",
    "Maple Log",
    "Fruity Maple Leaves",
    "Vines",
    "Aspen Leaves",
    "Aspen Log"
]

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (playerId) => {
  const name = api.getEntityName(playerId)
  if (user !== name) return

  api.giveItem(playerId, "Iron Spade",1, {customDisplayName:"Remover",customDescription:"Click to remove block around your click"})
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////

onPlayerAltAction = (playerId, x, y, z, block, targetEId) => {

    /* verify its you */
    const name = api.getEntityName(playerId)
    if (name !== user) return  /* you can remove this part to enable all people to use the tool / or add a || name !== "Player2NameWhoIsEnable" */

    /* verify held item */
    const item = api.getHeldItem(playerId)
    if (!item || item.name !== "Iron Spade") return /* you can also remove this to just need to alt click with hand to use the tool */

    for (let xi = x - negX; xi <= x + posX; xi++) {
        for (let yi = y - negY; yi <= y + posY; yi++) {
            for (let zi = z - negZ; zi <= z + posZ; zi++) {

                const blockName = api.getBlock(xi, yi, zi)

                /* name with no meta */
                const baseName = blockName.split("|")[0]

                if (breakableBlocks.includes(baseName)) {
                    api.setBlock(xi, yi, zi, "Air")
                }
            }
        }
    }
}
```
