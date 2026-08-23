# Better World Edit - Bloxd.io

## 〖〔 Circle Tool 〕〗

### 『 Overview 』

Builds a flat circle around one selected center point.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Wood Axe** — sets the center of the circle.
- **Green Paintball** — starts the circle generation.

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `axeSlot` and `replaceSlot` to change the item slots.
- `CIRCLE_RADIUS` to change the size of the circle.
- `BLOCKS` to define the random palette used for texturing.
- `REPLACE_BLOCKS` to decide which blocks can be replaced.

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
