# Better World Edit - Bloxd.io

## 〖〔 Path Tool 〕〗

### 『 Overview 』

Builds either a terrain-following road or a full 3D tube through a list of waypoints.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Wood Axe** — click to add a waypoint, alt click to remove the last waypoint.
- **Green Paintball** — builds the path through all stored waypoints.
- **Red Paintball** — clears all current waypoints.
- **Stone Pickaxe** — instant mode: click point A, then point B for a direct path.

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `PATH_WIDTH` to control the path width using a radius around the line.
- `PATH_MODE` to switch between `"road"` and `"tube"`.
- `PATH_DEPTH` to control how many blocks are replaced below the surface in road mode.
- `BLOCKS`, `REPLACE_BLOCKS`, and `BLOCKS_PER_TICK` to control style and speed.

### 『 Code to copy 』

```js
/*
MIT License
Copyright (c) 2026 K4miNoK4mi - World Edit - 11 Path
*/

///////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const buildSlot = 1
const clearSlot = 2
const instantSlot = 3

// Width of the path, used as a radius around the line.
// PATH_WIDTH = 3 -> path width of 2*3+1 = 7 blocks.
const PATH_WIDTH = 3

// Build mode:
//   "road" = flat path that follows the terrain surface
//   "tube" = full 3D tube around the line
const PATH_MODE = "tube"

// In road mode, this controls how many blocks are replaced below the surface.
const PATH_DEPTH = 2

const MARKER_BLOCK = "Red Wool"
const MARKER_FIRST_BLOCK = "Yellow Wool"

const SCAN_TOP = 255
const SCAN_BOTTOM = -100
const SCAN_MARGIN = 16
const BLOCKS_PER_TICK = 100

///////////////////////////////////////////////////////////
// BLOCKS
///////////////////////////////////////////////////////////

let BLOCKS = [
  "Dirt",
  "Messy Dirt",
  "Rocky Dirt",
]

let REPLACE_BLOCKS = [
  "Grass Block",
  "Lime Concrete",
  "Lime Wool",
  "Lime Planks",
  "Messy Dirt",
  "Rocky Dirt",
  "Dirt",
]

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let waypoints = []
let pendingA = null
let isBuilding = false
let state = null
let totalReplaced = 0

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function randBlock() {
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)]
}

function isWE(pid) {
  return api.getEntityName(pid) === WE_OWNER
}

function shouldReplace(blockName) {
  if(REPLACE_BLOCKS === "all") return true
  return REPLACE_BLOCKS.includes((blockName ?? "").split("|")[0])
}

function isSolid(blockName) {
  const base = (blockName ?? "").split("|")[0]
  return base && base !== "Air" && base !== "Water" && base !== "Lava"
}

function restoreMarker(wp) {
  if(!wp) return
  api.setBlock(wp.x, wp.y, wp.z, wp.orig)
}

function restoreAllMarkers() {
  for(const wp of waypoints) restoreMarker(wp)
}

function markerFor(index) {
  return index === 0 ? MARKER_FIRST_BLOCK : MARKER_BLOCK
}

///////////////////////////////////////////////////////////
// WAYPOINTS
///////////////////////////////////////////////////////////

function addWaypoint(pid, x, y, z) {
  if(waypoints.some((wp) => wp.x === x && wp.y === y && wp.z === z)) {
    api.sendMessage(pid, "There is already a waypoint here!", { color: "red" })
    return
  }

  const current = api.getBlock(x, y, z)
  waypoints.push({ x, y, z, orig: current })
  api.setBlock(x, y, z, markerFor(waypoints.length - 1))
  api.sendMessage(pid, "Waypoint " + waypoints.length + " set at (" + x + ", " + y + ", " + z + ")", { color: "green" })
}

function removeLastWaypoint(pid) {
  if(waypoints.length === 0) {
    api.sendMessage(pid, "No waypoints to remove.", { color: "red" })
    return
  }

  const wp = waypoints.pop()
  restoreMarker(wp)

  if(waypoints.length >= 1) {
    const first = waypoints[0]
    api.setBlock(first.x, first.y, first.z, MARKER_FIRST_BLOCK)
  }

  api.sendMessage(pid, "Waypoint removed. (" + waypoints.length + " left)", { color: "orange" })
}

function clearWaypoints(pid) {
  restoreAllMarkers()
  if(pendingA) {
    restoreMarker(pendingA)
    pendingA = null
  }
  waypoints = []
  api.sendMessage(pid, "Waypoints cleared.", { color: "aqua" })
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Path Axe",
    customDescription: "Click: Add waypoint | Alt: Remove last",
  })

  api.setItemSlot(pid, buildSlot, "Green Paintball", 1, {
    customDisplayName: "Build Path",
    customDescription: "Click: Build the path through all waypoints",
  })

  api.setItemSlot(pid, clearSlot, "Red Paintball", 1, {
    customDisplayName: "Clear Waypoints",
    customDescription: "Click: Remove all waypoints",
  })

  api.setItemSlot(pid, instantSlot, "Stone Pickaxe", 1, {
    customDisplayName: "Instant Path",
    customDescription: "Click point A then B for a direct path",
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
    if(wasAltClick) removeLastWaypoint(pid)
    else addWaypoint(pid, x, y, z)
    return
  }

  if(held.name === "Green Paintball") {
    startBuild(pid, waypoints, true)
    return
  }

  if(held.name === "Red Paintball") {
    clearWaypoints(pid)
    return
  }

  if(held.name === "Stone Pickaxe") {
    if(pendingA) {
      startBuild(pid, [pendingA, { x, y, z, orig: null }], false)
    } else {
      pendingA = { x, y, z, orig: api.getBlock(x, y, z) }
      api.setBlock(x, y, z, MARKER_FIRST_BLOCK)
      api.sendMessage(pid, "Point A set at (" + x + ", " + y + ", " + z + ") - click again for point B", { color: "green" })
    }
  }
}

///////////////////////////////////////////////////////////
// BUILD
///////////////////////////////////////////////////////////

function startBuild(pid, points, fromWaypoints) {
  if(isBuilding) {
    api.sendMessage(pid, "Already running!", { color: "orange" })
    return
  }

  if(!points || points.length < 2) {
    api.sendMessage(pid, "Need at least 2 waypoints!", { color: "red" })
    return
  }

  if(fromWaypoints) restoreAllMarkers()
  if(pendingA) {
    restoreMarker(pendingA)
    pendingA = null
  }

  const segments = []
  for(let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const segment = {
      ax: a.x,
      ay: a.y,
      az: a.z,
      bx: b.x,
      by: b.y,
      bz: b.z,
      minX: Math.min(a.x, b.x) - PATH_WIDTH,
      maxX: Math.max(a.x, b.x) + PATH_WIDTH,
      minZ: Math.min(a.z, b.z) - PATH_WIDTH,
      maxZ: Math.max(a.z, b.z) + PATH_WIDTH,
    }

    if(PATH_MODE === "tube") {
      segment.minY = Math.min(a.y, b.y) - PATH_WIDTH
      segment.maxY = Math.max(a.y, b.y) + PATH_WIDTH
    } else {
      segment.scanTop = Math.min(Math.max(Math.max(a.y, b.y) + SCAN_MARGIN, SCAN_BOTTOM), SCAN_TOP)
      segment.scanBot = Math.max(Math.min(Math.min(a.y, b.y) - SCAN_MARGIN, SCAN_TOP), SCAN_BOTTOM)
    }

    segments.push(segment)
  }

  state = {
    segments,
    seg: 0,
    x: segments[0].minX,
    y: PATH_MODE === "tube" ? segments[0].minY : 0,
    z: segments[0].minZ,
    usesWaypoints: fromWaypoints,
  }
  totalReplaced = 0
  isBuilding = true

  api.broadcastMessage(
    "Path build started! (" + points.length + " points, " + segments.length + " segment(s), width " + PATH_WIDTH + ", mode " + PATH_MODE + ")",
    { color: "green" }
  )
}

function finishBuild() {
  isBuilding = false
  if(state && state.usesWaypoints) waypoints = []
  state = null

  api.broadcastMessage(
    "Path finished! (" + totalReplaced + " blocks replaced)",
    { color: "green" }
  )
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

tick = () => {
  if(!isBuilding || !state) return

  const st = state
  const segments = st.segments
  const radius2 = PATH_WIDTH * PATH_WIDTH
  let processed = 0

  if(PATH_MODE === "tube") {
    while(processed < BLOCKS_PER_TICK) {
      const segment = segments[st.seg]
      const dxs = segment.bx - segment.ax
      const dys = segment.by - segment.ay
      const dzs = segment.bz - segment.az
      const len2 = dxs * dxs + dys * dys + dzs * dzs

      if(len2 > 0) {
        let t = ((st.x - segment.ax) * dxs + (st.y - segment.ay) * dys + (st.z - segment.az) * dzs) / len2
        if(t < 0) t = 0
        else if(t > 1) t = 1

        const cx = segment.ax + t * dxs
        const cy = segment.ay + t * dys
        const cz = segment.az + t * dzs
        const d2 = (st.x - cx) * (st.x - cx) + (st.y - cy) * (st.y - cy) + (st.z - cz) * (st.z - cz)

        if(d2 <= radius2) {
          const current = api.getBlock(st.x, st.y, st.z)
          if(shouldReplace(current)) {
            api.setBlock(st.x, st.y, st.z, randBlock())
            totalReplaced++
          }
        }
      }

      processed++
      st.x++
      if(st.x > segment.maxX) {
        st.x = segment.minX
        st.z++
        if(st.z > segment.maxZ) {
          st.z = segment.minZ
          st.y++
          if(st.y > segment.maxY) {
            st.seg++
            if(st.seg >= segments.length) {
              finishBuild()
              return
            }
            const next = segments[st.seg]
            st.x = next.minX
            st.y = next.minY
            st.z = next.minZ
          }
        }
      }
    }
  } else {
    while(processed < BLOCKS_PER_TICK) {
      const segment = segments[st.seg]
      const dxs = segment.bx - segment.ax
      const dzs = segment.bz - segment.az
      const len2 = dxs * dxs + dzs * dzs

      if(len2 > 0) {
        let t = ((st.x - segment.ax) * dxs + (st.z - segment.az) * dzs) / len2
        if(t < 0) t = 0
        else if(t > 1) t = 1

        const cx = segment.ax + t * dxs
        const cz = segment.az + t * dzs
        const d2 = (st.x - cx) * (st.x - cx) + (st.z - cz) * (st.z - cz)

        if(d2 <= radius2) {
          let topY = null
          for(let yy = segment.scanTop; yy >= segment.scanBot; yy--) {
            const current = api.getBlock(st.x, yy, st.z)
            if(isSolid(current)) {
              topY = yy
              break
            }
          }

          if(topY !== null) {
            for(let d = 0; d < PATH_DEPTH; d++) {
              const yy = topY - d
              const current = api.getBlock(st.x, yy, st.z)
              if(shouldReplace(current)) {
                api.setBlock(st.x, yy, st.z, randBlock())
                totalReplaced++
              }
            }
          }
        }
      }

      processed++
      st.x++
      if(st.x > segment.maxX) {
        st.x = segment.minX
        st.z++
        if(st.z > segment.maxZ) {
          st.seg++
          if(st.seg >= segments.length) {
            finishBuild()
            return
          }
          const next = segments[st.seg]
          st.x = next.minX
          st.z = next.minZ
        }
      }
    }
  }
}
```
