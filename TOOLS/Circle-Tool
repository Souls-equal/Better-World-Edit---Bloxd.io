# Code and Usages

## 〖〔 Circle Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives a **Wooden Axe** as well as a **Green Paintball**, both renamed.

1. The axe can be used to set :
- The **center of the circle** with a normal click

2. Paintball allows you to validate and launch the **circle replacement** with a click.

#### 〚 Code 〛

In addition to the items, there are certain very important things to know how to change in the code.

1. You have to change the **User of the code**, because only one person can use the tool.

2. It is also possible to change the **location of items when they appear on `onPlayerJoin`**

3. You can change the **radius of the circle**

Example :

```
const CIRCLE_RADIUS = 10
```

This value determines how large the circle will be around the selected center.

4. And very important, the blocks :

- It is possible to set a **list of blocks that will be placed randomly** (texturing)
- And you can also choose **which blocks will be replaced** (or `"all"`)

Example :

```
let BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool"
]
```

Replace **all blocks**

```
let REPLACE_BLOCKS = "all"
```

Or only specific blocks :

```
let REPLACE_BLOCKS = [
  "Grass Block",
  "Lime Concrete"
]
```

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 02 Circle

Permission is hereby granted, free of charge, to any person obtaining a copy


///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1

const CIRCLE_RADIUS = 10  // radius of the circle to replace, change as needed

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [ // set blocks u want to place randomly, or add more for more variety
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Baked Clay",
  "Jungle Grass Block",
  "Lime Planks",
  "Pine Grass Block", // those blocks can be used to make some textured grass
]

// set all to replace all blocks without exception
let REPLACE_BLOCKS = "all"

// or a specific list:
// let REPLACE_BLOCKS = [
//   "Grass Block",
//   "Lime Concrete",
// ]

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let center = null

let isBuilding = false
let bounds = null

let curX, curZ
let totalReplaced = 0

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randBlock(){
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)]
}

function isWE(pid){
  return api.getEntityName(pid) === WE_OWNER
}

function shouldReplace(blockName){
  if(REPLACE_BLOCKS === "all") return true
  return REPLACE_BLOCKS.includes(blockName)
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left click: Set center"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Replace Tool",
    customDescription: "Click: Replace circle"
  })
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const targetInfo = api.getPlayerTargetInfo(pid)
  if(!targetInfo || !targetInfo.position) return

  const x = targetInfo.position[0]
  const y = targetInfo.position[1]
  const z = targetInfo.position[2]

  if(held.name === "Wood Axe"){
    center = [x, y, z]
    api.sendMessage(pid, "Center set at (" + x + ", " + y + ", " + z + ")", {color:"green"})
    return
  }

  if(held.name === "Green Paintball"){
    startReplace(pid)
  }
}

///////////////////////////////////////////////////////////
// REPLACE
///////////////////////////////////////////////////////////

function startReplace(pid){
  if(!center){
    api.sendMessage(pid, "Set a center first!", {color:"red"})
    return
  }

  if(isBuilding){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  const r = CIRCLE_RADIUS

  bounds = {
    minX: center[0] - r,  maxX: center[0] + r,
    minZ: center[2] - r,  maxZ: center[2] + r,
    centerX: center[0],
    centerY: center[1],
    centerZ: center[2],
    r2: r * r
  }

  curX = bounds.minX
  curZ = bounds.minZ
  totalReplaced = 0
  isBuilding = true

  api.sendMessage(pid, "Circle replace started (r=" + r + ")…", {color:"green"})
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

const BLOCKS_PER_TICK = 50

tick = () => {
  if(!isBuilding) return

  const b = bounds
  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    const dx = curX - b.centerX
    const dz = curZ - b.centerZ

    if(dx*dx + dz*dz <= b.r2){
      const current = api.getBlock(curX, b.centerY, curZ)
      if(shouldReplace(current)){
        api.setBlock(curX, b.centerY, curZ, randBlock())
        totalReplaced++
      }
    }

    processed++

    curX++
    if(curX > b.maxX){
      curX = b.minX
      curZ++
      if(curZ > b.maxZ){
        isBuilding = false
        api.broadcastMessage(
          "Circle replace finished! (" + totalReplaced + " blocks replaced)",
          {color:"green"}
        )
        return
      }
    }
  }
}

```
