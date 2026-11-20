# Wood Swap Tool

## How to use

Paste this standalone script into World Code (F8). Set `WE_OWNER` to your username and edit `from` and `to` using the exact capitalization of the wood names. On join, slots 0 and 1 receive the tools.

With the **Wood Axe**, click one corner and alt-click the opposite corner. Click with the **Green Paintball** to process the inclusive selection. Only the species word changes, wherever it occurs in the block name: `Maple Log` becomes `Pine Log`. If the resulting block does not exist, the original stays in place.

```js
const from = "Maple";
const to = "Pine";
const WE_OWNER = "K4miNoK4mi"
const axeSlot = 0, replaceSlot = 1
let pos1 = null, pos2 = null, bounds = null
let isBuilding = false, totalReplaced = 0
let curX, curY, curZ

function isWE(pid){
  return api.getEntityName(pid) === WE_OWNER
}

// Match a complete species name, including next to state separators (e.g. |).
const species = new RegExp("\\b" + from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g")
const targets = new Map()

function replacement(name){
  if(targets.has(name)) return targets.get(name)
  const candidate = name.replace(species, () => to)
  let target = null
  if(candidate !== name){
    try {
      const id = api.blockNameToBlockId(candidate)
      if(id > 0 && api.blockIdToBlockName(id) === candidate) target = candidate
    } catch(e) { /* No block of this name: leave the original alone. */ }
  }
  targets.set(name, target)
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

const BLOCKS_PER_TICK = 50

tick = () => {
  if(!isBuilding) return

  const b = bounds
  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    const current = api.getBlock(curX, curY, curZ)
    const target = replacement(current)
    if(target){
      api.setBlock(curX, curY, curZ, target)
      totalReplaced++
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
            "Replace finished! (" + totalReplaced + " blocks replaced)",
            {color:"green"}
          )
          return
        }
      }
    }
  }
}
```
