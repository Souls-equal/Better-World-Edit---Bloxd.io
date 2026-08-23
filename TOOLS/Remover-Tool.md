# Better World Edit - Bloxd.io

## 〖〔 Tree Remover Tool 〕〗

### 『 Overview 』

Removes leaves, logs, and other breakable blocks in a configurable area around your click.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Iron Spade** — alt click on a block to remove matching blocks in the configured area.

#### 〚 Config 〛

- `user` to lock the tool to your username.
- `breakableBlocks` to choose which block names are removed.
- `posX`, `negX`, `posY`, `negY`, `posZ`, and `negZ` to set the scan size.
- You can remove the held-item check if you want the tool to work without the Iron Spade.

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
