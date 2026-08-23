# Better World Edit - Bloxd.io

## 〖〔 Layer Fill Tool 〕〗

### 『 Overview 』

Fills a cuboid selection extremely fast with `setBlockRect`, with optional chunk-safe loading, large-fill confirmation, and cancel support.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Wood Axe** — normal click sets **Point 1**, alt click sets **Point 2**.
- **Green Paintball** — starts the layer fill for the selected cuboid.
- **Red Paintball** — clears the selection, or cancels the current fill while it is running.

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `FILL_BLOCKS` to choose the block or block mix used for filling.
- `RECTS_PER_TICK` to control fill speed.
- `MAX_FILL_BLOCKS` and `CONFIRM_THRESHOLD` to protect against accidental huge fills.
- `LOAD_CHUNKS` to choose between faster fills or safer chunk-by-chunk loading.

### 『 Code to copy 』

```js
/*
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - Layer Fill Tool

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

///////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const fillSlot = 1
const clearSlot = 2

// Block(s) to place.
// One block = uniform layer.
// Multiple blocks = random mix per rectangle.
const FILL_BLOCKS = [
  "Air",
  // "Water",
]

// API limit for setBlockRect. Do not change.
const LIMIT_PER_CALL = 360

// Number of setBlockRect calls per tick.
const RECTS_PER_TICK = 60

// Maximum allowed volume.
const MAX_FILL_BLOCKS = 50000000

// If the selection is larger than this threshold,
// the player must click the green paintball twice to confirm.
const CONFIRM_THRESHOLD = 1000000

// Confirmation timeout in ticks (300 = 15s).
const CONFIRM_TIMEOUT_TICKS = 300

// true  = load chunk by chunk before filling
// false = fill everything directly
const LOAD_CHUNKS = false

const CHUNK_SIZE = 32

const MARKER_POS1_BLOCK = "Yellow Wool"
const MARKER_POS2_BLOCK = "Red Wool"

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let selA = null
let selB = null
let markersPlaced = false
let isFilling = false
let fillState = null
let pendingConfirm = null
let tickCount = 0

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randFillBlock() {
  return FILL_BLOCKS[Math.floor(Math.random() * FILL_BLOCKS.length)]
}

function isWE(pid) {
  return api.getEntityName(pid) === WE_OWNER
}

function restoreMarker(point) {
  if(point) api.setBlock(point.x, point.y, point.z, point.orig)
}

function fmtTicks(ticks) {
  const seconds = Math.max(1, Math.round(ticks / 20))
  if(seconds < 60) return "~" + seconds + "s"
  return "~" + Math.floor(seconds / 60) + "m " + (seconds % 60) + "s"
}

function estTicksFor(volume, sizeX, sizeZ) {
  let ticks = Math.ceil(volume / LIMIT_PER_CALL / RECTS_PER_TICK)
  if(LOAD_CHUNKS) ticks += Math.ceil(sizeX / CHUNK_SIZE) * Math.ceil(sizeZ / CHUNK_SIZE)
  return ticks
}

///////////////////////////////////////////////////////////
// SELECTION
///////////////////////////////////////////////////////////

function setPoint(pid, x, y, z, isPos2) {
  const current = api.getBlock(x, y, z)
  if(current === MARKER_POS1_BLOCK || current === MARKER_POS2_BLOCK) {
    api.sendMessage(pid, "There is already a point here!", { color: "red" })
    return
  }

  restoreMarker(isPos2 ? selB : selA)

  const point = { x, y, z, orig: current }
  if(isPos2) selB = point
  else selA = point

  pendingConfirm = null
  api.setBlock(x, y, z, isPos2 ? MARKER_POS2_BLOCK : MARKER_POS1_BLOCK)
  markersPlaced = true

  let msg = "Point " + (isPos2 ? "2" : "1") + " set at (" + x + ", " + y + ", " + z + ")"
  if(selA && selB) {
    const sizeX = Math.abs(selA.x - selB.x) + 1
    const sizeY = Math.abs(selA.y - selB.y) + 1
    const sizeZ = Math.abs(selA.z - selB.z) + 1
    msg += " | selection: " + sizeX + " x " + sizeY + " x " + sizeZ + " = " + (sizeX * sizeY * sizeZ) + " blocks"
  }

  api.sendMessage(pid, msg, { color: "green" })
}

function clearPoints(pid) {
  if(markersPlaced) {
    restoreMarker(selA)
    restoreMarker(selB)
    markersPlaced = false
  }

  selA = null
  selB = null
  pendingConfirm = null
  api.sendMessage(pid, "Selection cleared.", { color: "aqua" })
}

function cancelFill(pid) {
  if(!isFilling || !fillState) {
    clearPoints(pid)
    return
  }

  const state = fillState
  isFilling = false
  fillState = null
  pendingConfirm = null

  api.broadcastMessage(
    "Layer fill cancelled! (" + state.done + "/" + state.total + " blocks placed) Selection kept.",
    { color: "orange" }
  )
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Layer Axe",
    customDescription: "Left click: Point 1 | Alt click: Point 2",
  })

  api.setItemSlot(pid, fillSlot, "Green Paintball", 1, {
    customDisplayName: "Fill Layer",
    customDescription: "Click: Fill the selection",
  })

  api.setItemSlot(pid, clearSlot, "Red Paintball", 1, {
    customDisplayName: "Clear / Cancel",
    customDescription: "Click: Clear points | While filling: Cancel",
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

  if(held.name === "Wood Axe") {
    setPoint(pid, x, y, z, wasAltClick)
    return
  }

  if(held.name === "Green Paintball") {
    startFill(pid)
    return
  }

  if(held.name === "Red Paintball") {
    if(isFilling) cancelFill(pid)
    else clearPoints(pid)
  }
}

///////////////////////////////////////////////////////////
// RECT SPLITTING
///////////////////////////////////////////////////////////

function buildChunks(x1, y1, z1, x2, y2, z2) {
  const chunks = []
  const stack = [[x1, y1, z1, x2, y2, z2]]

  while(stack.length > 0) {
    const [cx1, cy1, cz1, cx2, cy2, cz2] = stack.pop()
    const sizeX = cx2 - cx1 + 1
    const sizeY = cy2 - cy1 + 1
    const sizeZ = cz2 - cz1 + 1
    const volume = sizeX * sizeY * sizeZ

    if(volume <= LIMIT_PER_CALL) {
      chunks.push([cx1, cy1, cz1, cx2, cy2, cz2, volume])
      continue
    }

    if(sizeX >= sizeY && sizeX >= sizeZ) {
      const step = Math.max(1, Math.floor(LIMIT_PER_CALL / (sizeY * sizeZ)))
      let x = cx1
      while(x <= cx2) {
        const xe = Math.min(x + step - 1, cx2)
        stack.push([x, cy1, cz1, xe, cy2, cz2])
        x = xe + 1
      }
    } else if(sizeZ >= sizeY) {
      const step = Math.max(1, Math.floor(LIMIT_PER_CALL / (sizeX * sizeY)))
      let z = cz1
      while(z <= cz2) {
        const ze = Math.min(z + step - 1, cz2)
        stack.push([cx1, cy1, z, cx2, cy2, ze])
        z = ze + 1
      }
    } else {
      const step = Math.max(1, Math.floor(LIMIT_PER_CALL / (sizeX * sizeZ)))
      let y = cy1
      while(y <= cy2) {
        const ye = Math.min(y + step - 1, cy2)
        stack.push([cx1, y, cz1, cx2, ye, cz2])
        y = ye + 1
      }
    }
  }

  return chunks
}

function buildChunkGroups(x1, y1, z1, x2, y2, z2) {
  const groups = []

  for(let cz = Math.floor(z1 / CHUNK_SIZE); cz <= Math.floor(z2 / CHUNK_SIZE); cz++) {
    for(let cx = Math.floor(x1 / CHUNK_SIZE); cx <= Math.floor(x2 / CHUNK_SIZE); cx++) {
      const gx1 = Math.max(x1, cx * CHUNK_SIZE)
      const gx2 = Math.min(x2, cx * CHUNK_SIZE + CHUNK_SIZE - 1)
      const gz1 = Math.max(z1, cz * CHUNK_SIZE)
      const gz2 = Math.min(z2, cz * CHUNK_SIZE + CHUNK_SIZE - 1)
      if(gx1 > gx2 || gz1 > gz2) continue

      const rects = buildChunks(gx1, y1, gz1, gx2, y2, gz2)
      let blocks = 0
      for(const rect of rects) blocks += rect[6]

      groups.push({
        cx,
        cz,
        loadX: gx1,
        loadY: y1,
        loadZ: gz1,
        rects,
        blocks,
      })
    }
  }

  return groups
}

///////////////////////////////////////////////////////////
// FILL
///////////////////////////////////////////////////////////

function fillRect(rect, block) {
  api.setBlockRect([rect[0], rect[1], rect[2]], [rect[3], rect[4], rect[5]], block)
}

function startFill(pid) {
  if(isFilling) {
    api.sendMessage(pid, "Already running!", { color: "orange" })
    return
  }

  if(!selA || !selB) {
    api.sendMessage(pid, "Need 2 points! (axe: click = point 1, alt click = point 2)", { color: "red" })
    return
  }

  const x1 = Math.min(selA.x, selB.x)
  const y1 = Math.min(selA.y, selB.y)
  const z1 = Math.min(selA.z, selB.z)
  const x2 = Math.max(selA.x, selB.x)
  const y2 = Math.max(selA.y, selB.y)
  const z2 = Math.max(selA.z, selB.z)

  const sizeX = x2 - x1 + 1
  const sizeY = y2 - y1 + 1
  const sizeZ = z2 - z1 + 1
  const volume = sizeX * sizeY * sizeZ

  if(volume > MAX_FILL_BLOCKS) {
    api.sendMessage(pid, "Selection too big! (" + volume + " blocks, max " + MAX_FILL_BLOCKS + ")", { color: "red" })
    return
  }

  if(volume > CONFIRM_THRESHOLD) {
    if(!pendingConfirm || pendingConfirm.volume !== volume) {
      pendingConfirm = { volume, tick: tickCount }
      api.sendMessage(
        pid,
        "Huge fill: " + volume + " blocks (" + sizeX + " x " + sizeY + " x " + sizeZ + ", " + fmtTicks(estTicksFor(volume, sizeX, sizeZ)) + "). Click again to confirm!",
        { color: "orange" }
      )
      return
    }
    pendingConfirm = null
  }

  if(markersPlaced) {
    restoreMarker(selA)
    restoreMarker(selB)
    markersPlaced = false
  }

  const groups = LOAD_CHUNKS
    ? buildChunkGroups(x1, y1, z1, x2, y2, z2)
    : [{
        cx: null,
        cz: null,
        loadX: x1,
        loadY: y1,
        loadZ: z1,
        rects: buildChunks(x1, y1, z1, x2, y2, z2),
        blocks: volume,
      }]

  let rectTotal = 0
  for(const group of groups) rectTotal += group.rects.length

  const estTicks = Math.ceil(rectTotal / RECTS_PER_TICK) + (LOAD_CHUNKS ? groups.length : 0)

  fillState = {
    groups,
    g: 0,
    i: 0,
    needLoad: LOAD_CHUNKS,
    done: 0,
    total: volume,
    pid,
    lastPct: 0,
    ticks: 0,
  }

  isFilling = true

  api.broadcastMessage(
    "Layer fill started! (" + sizeX + " x " + sizeY + " x " + sizeZ + " = " + volume + " blocks, " + rectTotal + " rects" + (LOAD_CHUNKS ? ", " + groups.length + " chunks to load" : "") + ", " + fmtTicks(estTicks) + ")",
    { color: "green" }
  )
}

function finishFill() {
  const state = fillState
  isFilling = false
  fillState = null

  api.broadcastMessage(
    "Layer filled! (" + state.done + " blocks, " + fmtTicks(state.ticks) + ") Selection kept: green = refill, red = clear.",
    { color: "green" }
  )
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

tick = () => {
  tickCount++

  if(pendingConfirm && tickCount - pendingConfirm.tick > CONFIRM_TIMEOUT_TICKS) {
    pendingConfirm = null
  }

  if(!isFilling || !fillState) return

  const state = fillState
  state.ticks++

  if(state.needLoad) {
    const group = state.groups[state.g]
    api.getBlock(group.loadX, group.loadY, group.loadZ)
    state.needLoad = false
    return
  }

  let count = 0
  while(count < RECTS_PER_TICK) {
    const group = state.groups[state.g]

    if(state.i >= group.rects.length) {
      state.g++
      state.i = 0
      if(state.g >= state.groups.length) {
        finishFill()
        return
      }
      state.needLoad = LOAD_CHUNKS
      if(state.needLoad) return
      continue
    }

    const rect = group.rects[state.i]
    fillRect(rect, randFillBlock())
    state.done += rect[6]
    state.i++
    count++
  }

  const pct = Math.floor(state.done * 100 / state.total)
  if(Math.floor(pct / 10) > Math.floor(state.lastPct / 10)) {
    let msg = "Fill... " + pct + "% (" + state.done + " blocks"
    if(LOAD_CHUNKS) msg += ", chunk " + (state.g + 1) + "/" + state.groups.length
    api.sendMessage(state.pid, msg + ")", { color: "aqua" })
  }
  state.lastPct = pct
}
```
