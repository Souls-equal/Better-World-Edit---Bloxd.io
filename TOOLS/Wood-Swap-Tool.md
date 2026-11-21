# Better World Edit - Bloxd.io

## 〖〔 Wood Swap Tool 〕〗

### 『 Overview 』

Swaps one wood species for another inside a rectangular selection. By default, only the species name changes: `Maple Log` becomes `Pine Log`. If the new block does not exist, the original stays in place.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.
Set `WE_OWNER` to your username, then join the world to receive the tools.

#### 〚 Items 〛

- **Wood Axe** — click one corner to set `Pos1`, then alt-click the opposite corner to set `Pos2`.
- **Green Paintball** — click to swap matching blocks inside the selection, including both corners.

#### 〚 Config 〛

- `from` and `to` set the source and target species. Use the exact capitalization from the block names, as in `const from = "Maple";` and `const to = "Pine";`.
- `SPECIAL_REPLACEMENTS` sets optional exact block-to-block rules. Uncomment the example to turn `Maple Log` into `Pine Planks` instead of `Pine Log`. These rules take priority over `from` / `to` and can also match blocks of any species. An invalid target leaves the original untouched.
- `WE_OWNER` restricts the tool to the named player.
- `axeSlot` and `replaceSlot` set the inventory slots for the axe and paintball (defaults: `0` and `1`).
- `BLOCKS_PER_TICK` sets how many blocks are checked per tick (default: `50`).

### 『 Code to copy 』

```js
const from = "Maple";
const to = "Pine";
const SPECIAL_REPLACEMENTS = new Map([
  // ["Maple Log", "Pine Planks"], // [exact source name, exact target name]
]);
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
  const candidate = SPECIAL_REPLACEMENTS.has(name)
    ? SPECIAL_REPLACEMENTS.get(name)
    : name.replace(species, () => to)
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
