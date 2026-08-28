# Better World Edit - Bloxd.io

## 〖〔 Sphere Tool 〕〗

### 『 Overview 』

Builds a 3D sphere from a center point, with an optional one-click shortcut.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Wood Axe** — sets the center of the sphere.
- **Green Paintball** — starts the sphere generation.
- **Stone Pickaxe** — instantly places a sphere at the targeted block.

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `axeSlot`, `replaceSlot`, and `oneClickSlot` to change the item slots.
- `SPHERE_RADIUS` to change the size of the sphere.
- `BLOCKS` to define the random palette used for texturing.
- `REPLACE_BLOCKS` to decide which blocks can be replaced.

### 『 Code to copy 』

```js


/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 03 Sphere 

Permission is hereby granted, free of charge, to any person obtaining a copy

  
///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1
const oneClickSlot = 2

const SPHERE_RADIUS = 4

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Baked Clay",
  "Jungle Grass Block",
  "Lime Planks",
  "Pine Grass Block",
]

let REPLACE_BLOCKS = "all"

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let center = null
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

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

export function onPlayerJoin1(pid) {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left click: Set center"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Replace Tool",
    customDescription: "Click: Replace sphere at set center"
  })

  // Nouvel outil one-click
  api.setItemSlot(pid, oneClickSlot, "Stone Pickaxe", 1, {
    customDisplayName: "One-Click Sphere",
    customDescription: "Click: Instantly replace sphere at target block"
  })
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////
export function onPlayerClick(pid, wasAltClick) {
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
    return
  }

  // One-click : centre + lancement immédiat depuis le bloc ciblé
  if(held.name === "Stone Pickaxe"){
    center = [x, y, z]
    api.sendMessage(pid, "One-click sphere at (" + x + ", " + y + ", " + z + ")", {color:"aqua"})
    startReplace(pid)
    return
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

  const r = SPHERE_RADIUS

  bounds = {
    minX: center[0] - r,  maxX: center[0] + r,
    minY: center[1] - r,  maxY: center[1] + r,
    minZ: center[2] - r,  maxZ: center[2] + r,
    centerX: center[0],
    centerY: center[1],
    centerZ: center[2],
    r2: r * r
  }

  curX = bounds.minX
  curY = bounds.minY
  curZ = bounds.minZ
  totalReplaced = 0
  isBuilding = true

  api.sendMessage(pid, "Sphere replace started (r=" + r + ")…", {color:"green"})
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

const BLOCKS_PER_TICK = 50

export function tick1() {
if(!isBuilding) return

  const b = bounds
  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    const dx = curX - b.centerX
    const dy = curY - b.centerY
    const dz = curZ - b.centerZ

    if(dx*dx + dy*dy + dz*dz <= b.r2){
      const current = api.getBlock(curX, curY, curZ)
      if(shouldReplace(current)){
        api.setBlock(curX, curY, curZ, randBlock())
        totalReplaced++
      }
    }

    processed++

    curX++
    if(curX > b.maxX){
      curX = b.minX
      curZ++
      if(curZ > b.maxZ){
        curZ = b.minZ
        curY++
        if(curY > b.maxY){
          isBuilding = false
          api.broadcastMessage(
            "Sphere replace finished! (" + totalReplaced + " blocks replaced)",
            {color:"green"}
          )
          return
        }
      }
    }
  }
}
```
