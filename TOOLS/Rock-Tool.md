# Better World Edit - Bloxd.io

## 〖〔 Rocks Tool 〕〗

### 『 Overview 』

Creates rough stone formations inside a rectangular selection.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Wood Axe** — normal click sets `Pos1`, alt click sets `Pos2`.
- **Green Paintball** — starts the rock generation.

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `axeSlot` and `replaceSlot` to change the item slots.
- `BLOCKS` to define the random rock palette.
- `REPLACE_BLOCKS` to decide which blocks can be replaced.
- `BLOCKS_PER_TICK` to control generation speed.

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 04 Rocks

Permission is hereby granted, free of charge, to any person obtaining a copy


///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [ // set blocks u want to place randomly, or add more for more variety
  "Stone",
  "Cracked Stone Bricks",
  "Stone Bricks",
  "Messy Stone", // those blocks can be used to make some textured rocks
]

// set all to replace all blocks without exception
let REPLACE_BLOCKS = "all"

// Or a specific list:
// let REPLACE_BLOCKS = [
//   "Grass Block",
//   "Lime Concrete",
// ]

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null

let isBuilding = false
let bounds = null

let curX, curY, curZ
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

function getBounds(){
  if(!pos1 || !pos2) return null
  return {
    minX: Math.min(pos1[0], pos2[0]),
    maxX: Math.max(pos1[0], pos2[0]),
    minY: Math.min(pos1[1], pos2[1]),
    maxY: Math.max(pos1[1], pos2[1]),
    minZ: Math.min(pos1[2], pos2[2]),
    maxZ: Math.max(pos1[2], pos2[2])
  }
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left: Pos1 | Alt: Pos2"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Replace Tool",
    customDescription: "Click: Replace selection"
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
    if(!wasAltClick){
      pos1 = [x, y, z]
      api.sendMessage(pid, "Pos1 set", {color:"green"})
    } else {
      pos2 = [x, y, z]
      api.sendMessage(pid, "Pos2 set", {color:"yellow"})
    }
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
  const b = getBounds()

  if(!b){
    api.sendMessage(pid, "Define pos1/pos2!", {color:"red"})
    return
  }

  if(isBuilding){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  bounds = b
  curX = b.minX
  curY = b.minY
  curZ = b.minZ
  totalReplaced = 0
  isBuilding = true

  const vol = (b.maxX-b.minX+1) * (b.maxY-b.minY+1) * (b.maxZ-b.minZ+1)
  api.sendMessage(pid, "Replace started (volume: " + vol + " blocks)…", {color:"green"})
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

const BLOCKS_PER_TICK = 200

tick = () => {
  if(!isBuilding) return

  const b = bounds
  let processed = 0

  const centerX = (b.minX + b.maxX) / 2
  const centerZ = (b.minZ + b.maxZ) / 2

  const sizeX = (b.maxX - b.minX) / 2
  const sizeZ = (b.maxZ - b.minZ) / 2
  const height = (b.maxY - b.minY)

  const baseRadius = Math.max(sizeX, sizeZ)

  while(processed < BLOCKS_PER_TICK){

    const dx = curX - centerX
    const dz = curZ - centerZ
    const dy = curY - b.minY

    const dist = Math.sqrt(dx*dx + dz*dz)

    const heightRatio = dy / height

    // rayon qui diminue vers le haut
    let radius = baseRadius * (1 - heightRatio)

    // bruit pour rendre irrégulier
    const noise = (Math.random() - 0.5) * baseRadius * 0.5

    const finalRadius = radius + noise

    if(dist <= finalRadius){

      const current = api.getBlock(curX, curY, curZ)

      if(shouldReplace(current)){
        api.setBlock(curX, curY, curZ, randBlock())
        totalReplaced++
      }

    }

    processed++

    curZ++
    if(curZ > b.maxZ){
      curZ = b.minZ
      curX++

      if(curX > b.maxX){
        curX = b.minX
        curY++

        if(curY > b.maxY){
          isBuilding = false
          api.broadcastMessage(
            "Rock finished! (" + totalReplaced + " blocks)",
            {color:"green"}
          )
          return
        }
      }
    }

  }
}
```
