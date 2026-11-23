# Better World Edit - Bloxd.io

## 〖〔 Rotation Tool 〗〗

### 『 Overview 』

Rotates every block of the pointed type inside a rectangular selection by one step: `Black Chalk Bricks Stairs` becomes `Black Chalk Bricks Stairs|meta|rot1`, then `rot2`, `rot3`, `rot4`, and back to `rot1` on the next click. Other meta suffixes are preserved: `Black Chalk Bricks Stairs|meta|rot2|top` becomes `Black Chalk Bricks Stairs|meta|rot3|top`, and the same applies to `|bot`, `|side`, or stair corner variants. If the rotated block does not exist, the original stays in place.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.
Set `WE_OWNER` to your username, then join the world to receive the tools.

#### 〚 Items 〛

- **Wood Axe** — click one corner to set `Pos1`, then alt-click the opposite corner to set `Pos2`.
- **Green Paintball** — click on the block type to rotate; every matching block inside the selection advances one rotation step.

#### 〚 Config 〛

- `ROTATION_STEPS` sets the number of rotation steps (default: `4`, i.e. `rot1` to `rot4`).
- `WE_OWNER` restricts the tool to the named player.
- `axeSlot` and `rotateSlot` set the inventory slots for the axe and paintball (defaults: `0` and `1`).
- `BLOCKS_PER_TICK` sets how many blocks are checked per tick (default: `50`).

### 『 Code to copy 』

```js
const WE_OWNER = "K4miNoK4mi"
const axeSlot = 0, rotateSlot = 1
const ROTATION_STEPS = 4
let pos1 = null, pos2 = null, bounds = null
let isBuilding = false, totalRotated = 0
let curX, curY, curZ
let targetBase = null
const rotated = new Map()

function isWE(pid){
  return api.getEntityName(pid) === WE_OWNER
}

// Block names can carry meta info: "BaseName|meta|rotN|top" etc.
// The base name is everything before the first "|".
function baseName(name){
  return (name ?? "").split("|")[0]
}

// Read the current rotation (rot1 to rot4) from "BaseName|meta|rotN|top".
// A block without rotation reads as 0 (i.e. not rotated yet).
function currentRotation(name){
  const parts = String(name ?? "").split("|")
  for(const part of parts){
    const match = /^rot(\d+)$/.exec(part)
    if(match) return parseInt(match[1], 10)
  }
  return 0
}

// Compute the next rotation name, keeping every meta suffix (meta, top, bot, side, ...),
// or null when the rotated block does not exist.
function rotationTarget(name){
  if(rotated.has(name)) return rotated.get(name)
  const parts = String(name ?? "").split("|")
  const current = currentRotation(name)
  const next = current >= ROTATION_STEPS ? 1 : current + 1

  let candidate
  const rotIndex = parts.findIndex((part) => /^rot\d+$/.test(part))
  if(rotIndex !== -1){
    // Only bump the rot value, keep the rest of the name untouched.
    parts[rotIndex] = "rot" + next
    candidate = parts.join("|")
  } else {
    // No rotation yet: insert "|meta|rotN" after the base name
    // (or right after the meta segment when one exists).
    const metaIndex = parts.indexOf("meta")
    const insertAt = metaIndex >= 0 ? metaIndex + 1 : 1
    parts.splice(insertAt, 0, "meta", "rot" + next)
    candidate = parts.join("|")
  }

  let target = null
  try {
    const id = api.blockNameToBlockId(candidate)
    if(id > 0 && api.blockIdToBlockName(id) === candidate) target = candidate
  } catch(e) { /* No block of this name: leave the original alone. */ }
  rotated.set(name, target)
  return target
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

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left: Pos1 | Alt: Pos2"
  })

  api.setItemSlot(pid, rotateSlot, "Green Paintball", 1, {
    customDisplayName: "Rotate Tool",
    customDescription: "Click: Rotate selection"
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
    // The pointed block defines which type of block to rotate.
    targetBase = baseName(api.getBlock(x, y, z))
    startRotate(pid)
  }
}

///////////////////////////////////////////////////////////
// ROTATE
///////////////////////////////////////////////////////////

function startRotate(pid){
  const b = getBounds()

  if(!b){
    api.sendMessage(pid, "Define pos1/pos2!", {color:"red"})
    return
  }

  if(isBuilding){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  if(!targetBase){
    api.sendMessage(pid, "Point at a block first!", {color:"red"})
    return
  }

  bounds = b
  curX = b.minX
  curY = b.minY
  curZ = b.minZ
  totalRotated = 0
  isBuilding = true

  const vol = (b.maxX-b.minX+1) * (b.maxY-b.minY+1) * (b.maxZ-b.minZ+1)
  api.sendMessage(pid, "Rotation started (volume: " + vol + " blocks)…", {color:"green"})
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

    const current = api.getBlock(curX, curY, curZ)
    const target = baseName(current) === targetBase ? rotationTarget(current) : null
    if(target){
      api.setBlock(curX, curY, curZ, target)
      totalRotated++
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
            "Rotation finished! (" + totalRotated + " blocks rotated)",
            {color:"green"}
          )
          return
        }
      }
    }
  }
}
```
