# Better World Edit - Bloxd.io

## 〖〔 Rotation Tool 〗〗

### 『 Overview 』

Rotates every block of the pointed type inside a rectangular selection. Three modes:

- **Green Paintball** rotates by one step: `Black Chalk Bricks Stairs` becomes `Black Chalk Bricks Stairs|meta|rot1`, then `rot2`, `rot3`, `rot4`, and back to `rot1` on the next click.
- **Blue Paintball** sets a rotation directly: each click cycles the target rotation (`rot1` → `rot2` → `rot3` → `rot4`) and applies it to every matching block.
- **Yellow Paintball** sets the half-block placement directly: each click cycles `top` → `bot` → `side` → none and applies it to every matching block.

Other meta suffixes are preserved: `Black Chalk Bricks Stairs|meta|rot2|top` becomes `Black Chalk Bricks Stairs|meta|rot3|top`, and the same applies to `|bot`, `|side`, or stair corner variants. If the resulting block does not exist, the original stays in place.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.
Set `WE_OWNER` to your username, then join the world to receive the tools.

#### 〚 Items 〛

- **Wood Axe** — click one corner to set `Pos1`, then alt-click the opposite corner to set `Pos2`.
- **Green Paintball** — click on the block type to rotate; every matching block inside the selection advances one rotation step.
- **Blue Paintball** — click to set every matching block directly to a chosen rotation (each click cycles `rot1` → `rot4` and applies it immediately).
- **Yellow Paintball** — click to set every matching block directly to a chosen half placement (each click cycles `top` → `bot` → `side` → none and applies it immediately).

#### 〚 Config 〛

- `ROTATION_STEPS` sets the number of rotation steps (default: `4`, i.e. `rot1` to `rot4`).
- `WE_OWNER` restricts the tool to the named player.
- `axeSlot`, `rotateSlot`, `setRotSlot`, and `setHalfSlot` set the inventory slots for the axe and the three paintballs (defaults: `0`, `1`, `2`, `3`).
- `BLOCKS_PER_TICK` sets how many blocks are checked per tick (default: `50`).

### 『 Code to copy 』

```js
const WE_OWNER = "K4miNoK4mi"
const axeSlot = 0, rotateSlot = 1, setRotSlot = 2, setHalfSlot = 3
const ROTATION_STEPS = 4
let pos1 = null, pos2 = null, bounds = null
let isBuilding = false, totalRotated = 0
let curX, curY, curZ
let targetBase = null
let targetRotation = 1     // rotation chosen with the Blue Paintball (1..4)
let targetHalf = "top"     // half placement chosen with the Yellow Paintball
let applyRotation = 1      // rotation applied by the current setRotation build
let applyHalf = "top"      // half placement applied by the current setHalf build
let buildMode = "rotate"   // "rotate" | "setRotation" | "setHalf"
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

// Cycle the half-block placement: top -> bot -> side -> none -> top
function nextHalf(current){
  const order = ["top", "bot", "side", ""]
  const index = order.indexOf(current)
  return order[(index + 1) % order.length]
}

// Compute a rotation name with rotValue (1..4), keeping every meta suffix
// (meta, top, bot, side, ...), or null when the base block does not exist.
// rotValue is null in "rotate +1" mode: the next value is computed instead.
function rotationTarget(name, rotValue){
  const key = name + "|rot" + (rotValue ?? "next")
  if(rotated.has(key)) return rotated.get(key)
  const parts = String(name ?? "").split("|")
  const base = parts[0]

  if(rotValue === null || rotValue === undefined){
    rotValue = currentRotation(name)
    rotValue = rotValue >= ROTATION_STEPS ? 1 : rotValue + 1
  }

  let candidate
  const rotIndex = parts.findIndex((part) => /^rot\d+$/.test(part))
  if(rotIndex !== -1){
    // Only bump the rot value, keep the rest of the name untouched.
    parts[rotIndex] = "rot" + rotValue
    candidate = parts.join("|")
  } else {
    // No rotation yet: insert "|meta|rotN" after the base name
    // (or right after the meta segment when one exists).
    const metaIndex = parts.indexOf("meta")
    const insertAt = metaIndex >= 0 ? metaIndex + 1 : 1
    parts.splice(insertAt, 0, "meta", "rot" + rotValue)
    candidate = parts.join("|")
  }

  let target = null
  try {
    // The root block must exist; meta variants (|meta|rotN|top etc.) follow
    // the documented pattern, and setBlock is protected below, so an invalid
    // variant only skips its own block instead of blocking the whole selection.
    if(api.blockNameToBlockId(base) > 0) target = candidate
  } catch(e) { /* No block of this name: leave the original alone. */ }
  rotated.set(key, target)
  return target
}

// Compute a name with the half-block placement (top/bot/side/none) applied,
// keeping meta and rotation, or null when the base block does not exist.
function halfTarget(name, halfValue){
  const key = name + "|half" + (halfValue || "none")
  if(rotated.has(key)) return rotated.get(key)
  const parts = String(name ?? "").split("|")
  const base = parts[0]

  // A half placement needs the meta + rotation segments: add them if missing.
  if(!parts.includes("meta")){
    const rotValue = currentRotation(name) || 1
    parts.splice(1, 0, "meta", "rot" + rotValue)
  }

  // Replace (or remove) the existing half slot.
  const halfIndex = parts.findIndex((part) => part === "top" || part === "bot" || part === "side")
  if(halfValue){
    if(halfIndex !== -1) parts[halfIndex] = halfValue
    else parts.push(halfValue)
  } else if(halfIndex !== -1){
    parts.splice(halfIndex, 1)
  }

  const candidate = parts.join("|")
  let target = null
  try {
    if(api.blockNameToBlockId(base) > 0) target = candidate
  } catch(e) { /* No block of this name: leave the original alone. */ }
  rotated.set(key, target)
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
    customDescription: "Click: Rotate selection (+1)"
  })

  api.setItemSlot(pid, setRotSlot, "Blue Paintball", 1, {
    customDisplayName: "Set Rotation",
    customDescription: "Click: Set rotation directly (rot1-rot4)"
  })

  api.setItemSlot(pid, setHalfSlot, "Yellow Paintball", 1, {
    customDisplayName: "Set Half Placement",
    customDescription: "Click: Set top/bot/side directly"
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
    buildMode = "rotate"
    startBuild(pid)
  }

  if(held.name === "Blue Paintball"){
    // Apply the current target rotation; the cycle happens when the build finishes.
    applyRotation = targetRotation
    targetBase = baseName(api.getBlock(x, y, z))
    buildMode = "setRotation"
    startBuild(pid)
  }

  if(held.name === "Yellow Paintball"){
    // Apply the current target half placement; the cycle happens when the build finishes.
    applyHalf = targetHalf
    targetBase = baseName(api.getBlock(x, y, z))
    buildMode = "setHalf"
    startBuild(pid)
  }
}

///////////////////////////////////////////////////////////
// START BUILD
///////////////////////////////////////////////////////////

function startBuild(pid){
  const b = getBounds()

  if(!b){
    api.sendMessage(pid, "Define pos1/pos2!", {color:"red"})
    return false
  }

  if(isBuilding){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return false
  }

  if(!targetBase){
    api.sendMessage(pid, "Point at a block first!", {color:"red"})
    return false
  }

  bounds = b
  curX = b.minX
  curY = b.minY
  curZ = b.minZ
  totalRotated = 0
  isBuilding = true

  const vol = (b.maxX-b.minX+1) * (b.maxY-b.minY+1) * (b.maxZ-b.minZ+1)

  if(buildMode === "setRotation"){
    api.sendMessage(
      pid,
      "Rotation set to rot" + applyRotation + " (volume: " + vol + " blocks)…",
      {color:"blue"}
    )
  } else if(buildMode === "setHalf"){
    api.sendMessage(
      pid,
      "Half placement set to " + (applyHalf || "none") + " (volume: " + vol + " blocks)…",
      {color:"yellow"}
    )
  } else {
    api.sendMessage(pid, "Rotation started (volume: " + vol + " blocks)…", {color:"green"})
  }

  return true
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

    let target = null
    if(baseName(current) === targetBase){
      if(buildMode === "setRotation"){
        target = rotationTarget(current, applyRotation)
      } else if(buildMode === "setHalf"){
        target = halfTarget(current, applyHalf)
      } else {
        target = rotationTarget(current, null)
      }
    }

    // Skip blocks that are already in the wanted state.
    if(target && target !== current){
      try {
        api.setBlock(curX, curY, curZ, target)
        totalRotated++
      } catch(e) { /* The game rejected this exact variant: skip this block. */ }
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

          if(buildMode === "setRotation"){
            api.broadcastMessage(
              "Rotation applied! (" + totalRotated + " blocks set to rot" + applyRotation + ")",
              {color:"blue"}
            )
          } else if(buildMode === "setHalf"){
            api.broadcastMessage(
              "Half placement applied! (" + totalRotated + " blocks set to "
              + (applyHalf || "none") + ")",
              {color:"yellow"}
            )
          } else {
            api.broadcastMessage(
              "Rotation finished! (" + totalRotated + " blocks rotated)",
              {color:"green"}
            )
          }

          // Cycle the target for the next direct-set click.
          if(buildMode === "setRotation"){
            targetRotation = (targetRotation % ROTATION_STEPS) + 1
          } else if(buildMode === "setHalf"){
            targetHalf = nextHalf(targetHalf)
          }

          if(totalRotated === 0){
            api.broadcastMessage(
              "Nothing changed: the pointed block type must exist in the selection "
              + "and its rotated variant must be a valid block name.",
              {color:"orange"}
            )
          }
          return
        }
      }
    }
  }
}
```
