# Better World Edit - Bloxd.io

## 〖〔 Tree Tool 〕〗

### 『 Overview 』

Generates natural tree foliage on top of hand-built trunks and branches: organic leaf clusters for **Maple / deciduous trees** (`Lime Paintball`) and layered or tapered foliage for **Pine / Cypress trees** (`Green Paintball`), validated with the `Yellow Paintball`.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Lime Paintball** — normal click selects the tip of a branch for a **Maple** tree (organic leaf blob); alt click removes the last branch point (or click an existing marker again to remove it).
- **Green Paintball** — normal click sets the **top** of a **Pine / Cypress** tree; alt click sets the **bottom** of its foliage so you can adjust height on the fly (if you validate without setting a bottom, `PINE_DEFAULT_HEIGHT` is used).
- **Yellow Paintball** — validates all selected points, restores temporary markers, and builds the foliage.
- **Red Paintball** — clears all selected points (or cancels an active build).

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `mapleSlot`, `pineSlot`, `validateSlot`, and `clearSlot` to customize the hotbar slots.
- `MAPLE_RADIUS`, `MAPLE_VERTICAL_RATIO`, `MAPLE_Y_OFFSET`, and `MAPLE_NOISE_STRENGTH` to shape the organic Maple leaf blobs.
- `PINE_STYLE` (`"pine"`, `"cypress"`, or `"cone"`), `PINE_BASE_RADIUS`, `PINE_DEFAULT_HEIGHT`, and `PINE_NOISE_STRENGTH` to customize Pine and Cypress trees.
- `BLOCKS` to choose which leaf/block mix is placed.
- `REPLACE_BLOCKS` (`["Air"]`, `"all"`, or a custom block list) to control which blocks can be replaced.
- `BLOCKS_PER_TICK` to control generation speed.

### 『 Code to copy 』

```js
/*
MIT License
Copyright (c) 2026 K4miNoK4mi - World Edit - 12 Tree Tool
*/

///////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////

const WE_OWNER = "K4miNoK4mi"

const mapleSlot = 0     // Lime Paintball   -> Maple branch tips
const pineSlot = 1      // Green Paintball  -> Pine / Cypress (Click: Top | Alt: Bottom)
const validateSlot = 2  // Yellow Paintball -> Validate & build
const clearSlot = 3     // Red Paintball    -> Clear selection / Cancel

// ── MAPLE (ORGANIC LEAF BLOBS) ────────────────────────
// Horizontal radius of each branch leaf cluster
const MAPLE_RADIUS = 4

// Vertical ratio of the ellipsoid (< 1 makes natural oblate leaf crowns)
const MAPLE_VERTICAL_RATIO = 0.78

// Vertical offset above the clicked branch tip so the branch sits inside the lower crown
const MAPLE_Y_OFFSET = 1

// 3D Perlin noise strength for organic edges (0 = smooth ellipsoid, ~0.28 = natural foliage)
const MAPLE_NOISE_STRENGTH = 0.28

// ── PINE / CYPRESS ────────────────────────────────────
// Style of conifer foliage:
//   "pine"    = layered fir/pine branches with stepped whorls
//   "cypress" = tapered spindle/flame cypress shape
//   "cone"    = classic conical foliage
const PINE_STYLE = "pine"

// Maximum horizontal radius of the pine/cypress foliage
const PINE_BASE_RADIUS = 4

// Fallback height (in blocks) if you only click the top without alt-clicking the bottom
const PINE_DEFAULT_HEIGHT = 14

// Extra blocks above the selected top point to form a pointed apex
const PINE_TIP_EXTRA = 2

// 3D noise strength on the pine/cypress silhouette
const PINE_NOISE_STRENGTH = 0.45

// ── MARKERS & SPEED ───────────────────────────────────
const MAPLE_MARKER_BLOCK = "Lime Wool"
const PINE_TOP_MARKER_BLOCK = "Green Wool"
const PINE_BOTTOM_MARKER_BLOCK = "Cyan Wool"

const BLOCKS_PER_TICK = 150

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [
  "Maple Leaves",
  "Fruity Maple Leaves",
  "Aspen Leaves",
  // "Pine Leaves",
  // "Jungle Leaves",
  // "Grass Block",
  // "Lime Concrete",
  // "Lime Wool",
  // "Green Concrete",
  // "Jungle Grass Block",
  // "Pine Grass Block",
]

// Set "all" to replace all blocks without exception,
// or specify a list of blocks that can be replaced (e.g. ["Air"] to preserve your hand-built trunk).
let REPLACE_BLOCKS = [
  "Air",
]

// Or replace everything:
// let REPLACE_BLOCKS = "all"

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let maplePoints = [] // [{ x, y, z, orig }]
let pineTrees = []   // [{ top: { x, y, z, orig }, bottom: { x, y, z, orig } | null }]

let isBuilding = false
let blocksToPlace = []
let currentIndex = 0
let totalReplaced = 0

///////////////////////////////////////////////////////////
// PERLIN NOISE 3D
///////////////////////////////////////////////////////////

const PERM = []
;(() => {
  const base = []
  for(let i = 0; i < 256; i++) base[i] = i

  let seed = 1337
  for(let i = 255; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    const j = (seed >>> 0) % (i + 1)
    const tmp = base[i]
    base[i] = base[j]
    base[j] = tmp
  }

  for(let i = 0; i < 512; i++) PERM[i] = base[i & 255]
})()

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function gradPerlin(hash, x, y, z) {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : (h === 12 || h === 14 ? x : z)
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

function perlin3(x, y, z) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255

  x -= Math.floor(x)
  y -= Math.floor(y)
  z -= Math.floor(z)

  const u = fade(x)
  const v = fade(y)
  const w = fade(z)

  const A = PERM[X] + Y
  const AA = PERM[A] + Z
  const AB = PERM[A + 1] + Z
  const B = PERM[X + 1] + Y
  const BA = PERM[B] + Z
  const BB = PERM[B + 1] + Z

  function lerp(a, b, t) {
    return a + t * (b - a)
  }

  return lerp(
    lerp(
      lerp(gradPerlin(PERM[AA], x, y, z), gradPerlin(PERM[BA], x - 1, y, z), u),
      lerp(gradPerlin(PERM[AB], x, y - 1, z), gradPerlin(PERM[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(gradPerlin(PERM[AA + 1], x, y, z - 1), gradPerlin(PERM[BA + 1], x - 1, y, z - 1), u),
      lerp(gradPerlin(PERM[AB + 1], x, y - 1, z - 1), gradPerlin(PERM[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  )
}

function noise3(x, y, z) {
  return perlin3(x * 0.35, y * 0.35, z * 0.35) * 0.65
       + perlin3(x * 0.8,  y * 0.8,  z * 0.8)  * 0.35
}

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randBlock() {
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)]
}

function isWE(pid) {
  return api.getEntityName(pid) === WE_OWNER
}

function baseBlockName(blockName) {
  return (blockName ?? "").split("|")[0]
}

function shouldReplace(blockName) {
  if(REPLACE_BLOCKS === "all") return true
  const base = baseBlockName(blockName)
  return REPLACE_BLOCKS.includes(blockName) || REPLACE_BLOCKS.includes(base)
}

function restoreMarker(marker) {
  if(!marker) return
  api.setBlock(marker.x, marker.y, marker.z, marker.orig)
}

function restoreAllMarkers() {
  for(const pt of maplePoints) restoreMarker(pt)
  for(const pine of pineTrees) {
    restoreMarker(pine.top)
    restoreMarker(pine.bottom)
  }
}

function findExistingOrig(x, y, z) {
  for(const pt of maplePoints) {
    if(pt.x === x && pt.y === y && pt.z === z) return pt.orig
  }
  for(const pine of pineTrees) {
    if(pine.top && pine.top.x === x && pine.top.y === y && pine.top.z === z) return pine.top.orig
    if(pine.bottom && pine.bottom.x === x && pine.bottom.y === y && pine.bottom.z === z) return pine.bottom.orig
  }
  return api.getBlock(x, y, z)
}

///////////////////////////////////////////////////////////
// SELECTION HELPERS
///////////////////////////////////////////////////////////

function addMaplePoint(pid, x, y, z) {
  const existingIdx = maplePoints.findIndex((pt) => pt.x === x && pt.y === y && pt.z === z)
  if(existingIdx !== -1) {
    const removed = maplePoints.splice(existingIdx, 1)[0]
    restoreMarker(removed)
    api.sendMessage(pid, "Maple branch point removed. (" + maplePoints.length + " selected)", { color: "orange" })
    return
  }

  const orig = findExistingOrig(x, y, z)
  maplePoints.push({ x, y, z, orig })
  api.setBlock(x, y, z, MAPLE_MARKER_BLOCK)
  api.sendMessage(
    pid,
    "Maple branch #" + maplePoints.length + " set at (" + x + ", " + y + ", " + z + ")",
    { color: "lime" }
  )
}

function removeLastMaplePoint(pid) {
  if(maplePoints.length === 0) {
    api.sendMessage(pid, "No Maple branch points to remove.", { color: "red" })
    return
  }

  const removed = maplePoints.pop()
  restoreMarker(removed)
  api.sendMessage(
    pid,
    "Last Maple branch point removed. (" + maplePoints.length + " left)",
    { color: "orange" }
  )
}

function setPineTop(pid, x, y, z) {
  const existingIdx = pineTrees.findIndex((p) => p.top.x === x && p.top.y === y && p.top.z === z)
  if(existingIdx !== -1) {
    const removed = pineTrees.splice(existingIdx, 1)[0]
    restoreMarker(removed.top)
    restoreMarker(removed.bottom)
    api.sendMessage(pid, "Pine / Cypress removed. (" + pineTrees.length + " selected)", { color: "orange" })
    return
  }

  const orig = findExistingOrig(x, y, z)
  pineTrees.push({
    top: { x, y, z, orig },
    bottom: null,
  })
  api.setBlock(x, y, z, PINE_TOP_MARKER_BLOCK)

  api.sendMessage(
    pid,
    "Pine / Cypress #" + pineTrees.length + " TOP set at (" + x + ", " + y + ", " + z + ") — Alt click to set bottom, or validate with Yellow Paintball.",
    { color: "green" }
  )
}

function setPineBottom(pid, x, y, z) {
  if(pineTrees.length === 0) {
    api.sendMessage(pid, "Set the Pine / Cypress TOP first (normal click with Green Paintball)!", { color: "red" })
    return
  }

  const currentPine = pineTrees[pineTrees.length - 1]
  if(currentPine.bottom) {
    restoreMarker(currentPine.bottom)
  }

  const orig = findExistingOrig(x, y, z)
  currentPine.bottom = { x, y, z, orig }

  if(x !== currentPine.top.x || y !== currentPine.top.y || z !== currentPine.top.z) {
    api.setBlock(x, y, z, PINE_BOTTOM_MARKER_BLOCK)
  }

  const height = Math.abs(currentPine.top.y - y) + 1
  api.sendMessage(
    pid,
    "Pine / Cypress #" + pineTrees.length + " BOTTOM set at (" + x + ", " + y + ", " + z + ") | Height: " + height + " blocks",
    { color: "aqua" }
  )
}

function clearSelections(pid) {
  if(isBuilding) {
    isBuilding = false
    blocksToPlace = []
    currentIndex = 0
    api.broadcastMessage("Tree build cancelled! (" + totalReplaced + " blocks placed)", { color: "orange" })
    return
  }

  restoreAllMarkers()
  maplePoints = []
  pineTrees = []
  api.sendMessage(pid, "Tree selection cleared.", { color: "aqua" })
}

///////////////////////////////////////////////////////////
// SHAPE GENERATORS
///////////////////////////////////////////////////////////

function appendMapleBlob(branchPt, visited, outBlocks) {
  const rXZ = MAPLE_RADIUS
  const rY = Math.max(2, rXZ * MAPLE_VERTICAL_RATIO)
  const cx = branchPt.x
  const cy = branchPt.y + MAPLE_Y_OFFSET
  const cz = branchPt.z

  const maxRXZ = Math.ceil(rXZ + 1)
  const maxRY = Math.ceil(rY + 1)

  for(let dy = -maxRY; dy <= maxRY; dy++) {
    const by = cy + dy
    const scaledDy = dy < 0 ? dy * 1.15 : dy
    const ny = scaledDy / rY

    for(let dx = -maxRXZ; dx <= maxRXZ; dx++) {
      const bx = cx + dx
      const nx = dx / rXZ

      for(let dz = -maxRXZ; dz <= maxRXZ; dz++) {
        const bz = cz + dz
        const nz = dz / rXZ

        const dist = Math.sqrt(nx * nx + ny * ny + nz * nz)
        const n = noise3(bx, by, bz)
        const noisyDist = dist - n * MAPLE_NOISE_STRENGTH

        // Slight hanging leaf clusters around the lower outer rim
        const horizDist = Math.sqrt(nx * nx + nz * nz)
        const isHanging = dy < 0
          && horizDist >= 0.5
          && horizDist <= 0.95
          && ny >= -1.15
          && noise3(bx * 1.7 + 31, by * 1.7 + 17, bz * 1.7 + 53) > 0.38

        if(noisyDist <= 1.0 || isHanging) {
          const key = bx + "," + by + "," + bz
          if(!visited.has(key)) {
            visited.add(key)
            outBlocks.push([bx, by, bz])
          }
        }
      }
    }
  }
}

function appendPineTree(pine, visited, outBlocks) {
  let top = pine.top
  let bottom = pine.bottom
    ? pine.bottom
    : { x: top.x, y: top.y - PINE_DEFAULT_HEIGHT + 1, z: top.z }

  if(top.y < bottom.y) {
    const tmp = top
    top = bottom
    bottom = tmp
  }

  const height = Math.max(2, top.y - bottom.y + 1)
  const totalHeight = height + PINE_TIP_EXTRA
  const baseR = PINE_BASE_RADIUS

  for(let iy = 0; iy <= totalHeight; iy++) {
    const by = bottom.y + iy
    const t = iy / totalHeight
    const axisT = Math.min(1, iy / Math.max(1, height - 1))
    const cx = bottom.x + (top.x - bottom.x) * axisT
    const cz = bottom.z + (top.z - bottom.z) * axisT

    let radius = 0
    if(iy >= totalHeight - 1) {
      radius = 0.45
    } else if(PINE_STYLE === "cypress") {
      const flame = Math.sin(Math.PI * Math.pow(t, 0.68))
      radius = Math.max(0.6, baseR * flame)
    } else if(PINE_STYLE === "pine") {
      const envelope = baseR * Math.pow(1 - t, 0.82)
      const layerPhase = (iy % 3) / 2
      const layerFactor = 1.08 - 0.35 * layerPhase
      radius = envelope * layerFactor
    } else {
      radius = baseR * (1 - t)
    }

    const boundR = Math.ceil(radius + 1)
    for(let dx = -boundR; dx <= boundR; dx++) {
      const bx = Math.round(cx) + dx
      for(let dz = -boundR; dz <= boundR; dz++) {
        const bz = Math.round(cz) + dz
        const dist = Math.sqrt((bx - cx) * (bx - cx) + (bz - cz) * (bz - cz))
        const n = iy >= totalHeight - 1 ? 0 : noise3(bx, by, bz) * PINE_NOISE_STRENGTH

        if(dist <= radius + n) {
          const key = bx + "," + by + "," + bz
          if(!visited.has(key)) {
            visited.add(key)
            outBlocks.push([bx, by, bz])
          }
        }
      }
    }
  }
}

///////////////////////////////////////////////////////////
// START BUILD
///////////////////////////////////////////////////////////

function startTreeBuild(pid) {
  if(isBuilding) {
    api.sendMessage(pid, "Already building a tree!", { color: "orange" })
    return
  }

  if(maplePoints.length === 0 && pineTrees.length === 0) {
    api.sendMessage(
      pid,
      "Select Maple branches (Lime Paintball) or a Pine / Cypress (Green Paintball) first!",
      { color: "red" }
    )
    return
  }

  restoreAllMarkers()

  const visited = new Set()
  blocksToPlace = []

  for(const branchPt of maplePoints) {
    appendMapleBlob(branchPt, visited, blocksToPlace)
  }

  for(const pine of pineTrees) {
    appendPineTree(pine, visited, blocksToPlace)
  }

  const mapleCount = maplePoints.length
  const pineCount = pineTrees.length

  maplePoints = []
  pineTrees = []
  currentIndex = 0
  totalReplaced = 0
  isBuilding = true

  api.broadcastMessage(
    "Tree generation started! (" + mapleCount + " Maple branch(es), " + pineCount + " Pine/Cypress, " + blocksToPlace.length + " candidate blocks)",
    { color: "green" }
  )
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, mapleSlot, "Lime Paintball", 1, {
    customDisplayName: "Maple Branch Tool",
    customDescription: "Click: Add branch top | Alt: Remove last",
  })

  api.setItemSlot(pid, pineSlot, "Green Paintball", 1, {
    customDisplayName: "Pine / Cypress Tool",
    customDescription: "Click: Set top | Alt: Set bottom",
  })

  api.setItemSlot(pid, validateSlot, "Yellow Paintball", 1, {
    customDisplayName: "Validate Tree",
    customDescription: "Click: Build tree foliage",
  })

  api.setItemSlot(pid, clearSlot, "Red Paintball", 1, {
    customDisplayName: "Clear Selection",
    customDescription: "Click: Clear points | While building: Cancel",
  })
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////

onPlayerClick = (pid, wasAltClick) => {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  if(held.name === "Yellow Paintball") {
    startTreeBuild(pid)
    return
  }

  if(held.name === "Red Paintball") {
    clearSelections(pid)
    return
  }

  const targetInfo = api.getPlayerTargetInfo(pid)
  if(!targetInfo || !targetInfo.position) return

  const x = targetInfo.position[0]
  const y = targetInfo.position[1]
  const z = targetInfo.position[2]

  if(held.name === "Lime Paintball") {
    if(wasAltClick) removeLastMaplePoint(pid)
    else addMaplePoint(pid, x, y, z)
    return
  }

  if(held.name === "Green Paintball") {
    if(wasAltClick) setPineBottom(pid, x, y, z)
    else setPineTop(pid, x, y, z)
  }
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

tick = () => {
  if(!isBuilding) return

  let processed = 0

  while(processed < BLOCKS_PER_TICK && currentIndex < blocksToPlace.length) {
    const [x, y, z] = blocksToPlace[currentIndex]
    const current = api.getBlock(x, y, z)

    if(shouldReplace(current)) {
      api.setBlock(x, y, z, randBlock())
      totalReplaced++
    }

    currentIndex++
    processed++
  }

  if(currentIndex >= blocksToPlace.length) {
    isBuilding = false
    blocksToPlace = []
    currentIndex = 0
    api.broadcastMessage(
      "Tree finished! (" + totalReplaced + " blocks placed)",
      { color: "green" }
    )
  }
}
```
