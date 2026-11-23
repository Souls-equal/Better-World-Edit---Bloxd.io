# Better World Edit - Bloxd.io

## 〖〔 Cube Gradient Tool 〗〗

### 『 Overview 』

Fills a rectangular cuboid between two corners with a gradient of blocks. Like the plane gradient tool, but over a full volume: the gradient is computed for every block inside the cube from two gradient points, with optional Perlin dithering for organic blending between the stops.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.
Set `WE_OWNER` to your username, then join the world to receive the tools.

#### 〚 Items 〛

- **Wood Axe** — normal click sets `Pos1`, alt click sets `Pos2` (the two corners of the cuboid).
- **Green Paintball** — starts the gradient fill inside the selected cuboid.
- **Blue Paintball** — sets the gradient start point (color 0%).
- **Yellow Paintball** — sets the gradient end point (color 100%).

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `axeSlot`, `replaceSlot`, `gradASlot`, and `gradBSlot` to change the item slots.
- `GRADIENT` to define the ordered gradient palette (each stop is a list of blocks, picked randomly).
- `GRADIENT_DITHER` to enable or disable noisy blending between stops.
- `DITHER_STRENGTH` to control how strong the dithering is.
- `REPLACE_BLOCKS` to decide which blocks can be replaced (`"all"` or a specific list).
- `BLOCKS_PER_TICK` to control build speed.

### 『 Code to copy 』

```js
/*
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - Cube Gradient

Permission is hereby granted, free of charge, to any person obtaining a copy

///////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi" // set your username

const axeSlot = 0
const replaceSlot = 1
const gradASlot = 2  // Blue Paintball   -> gradient start
const gradBSlot = 3  // Yellow Paintball -> gradient end

const BLOCKS_PER_TICK = 60

// ── GRADIENT DITHER ───────────────────────────────────
// false -> sharp stops (original behavior)
// true  -> Perlin noise applied to t for organic
//          boundaries between the stops
const GRADIENT_DITHER = true

// Noise strength — limited to 1 stop max of shift
// Recommended: between 0 and 1
const DITHER_STRENGTH = 0.9

///////////////////////////////////////////////////////////
// GRADIENT PALETTE
// Each entry = one "stop" of the gradient, in order.
// The gradient is split evenly between all the stops.
// Each stop is an array of block names (random pick).
///////////////////////////////////////////////////////////

const GRADIENT = [
  ["Lime Concrete",  "Lime Wool"],          // 0%   light green
  ["Lime Concrete",  "Lime Baked Clay"],    // 25%  light/medium green
  ["Green Concrete", "Jungle Grass Block"], // 50%  dark green
  ["Brown Concrete", "Dirt"],               // 75%  light brown
  ["Brown Concrete", "Brown Wool"],         // 100% dark brown
]

// set all to replace all blocks without exception
let REPLACE_BLOCKS = "all"

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null

let gradA = null  // gradient start (blue)   -> GRADIENT[0]
let gradB = null  // gradient end   (yellow) -> GRADIENT[last]

let isBuilding    = false
let totalReplaced = 0

let bounds = null
let curX, curY, curZ

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

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

function norm3(v){
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
}

function dot3(a, b){
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

function clamp(v, lo, hi){
  return Math.max(lo, Math.min(hi, v))
}

///////////////////////////////////////////////////////////
// PERLIN NOISE 3D (simplified, no external dependency)
// Based on Ken Perlin's method (2002 improvement)
///////////////////////////////////////////////////////////

const PERM = []
;(()=>{
  const base = []
  for(let i = 0; i < 256; i++) base[i] = i
  // deterministic shuffle (fixed seed)
  let s = 1337
  for(let i = 255; i > 0; i--){
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = ((s >>> 0) % (i+1))
    const tmp = base[i]; base[i] = base[j]; base[j] = tmp
  }
  for(let i = 0; i < 512; i++) PERM[i] = base[i & 255]
})()

function fade(t){ return t*t*t*(t*(t*6-15)+10) }

function gradPerlin(hash, x, y, z){
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : (h===12||h===14 ? x : z)
  return ((h&1)===0 ? u : -u) + ((h&2)===0 ? v : -v)
}

function perlin3(x, y, z){
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255
  x -= Math.floor(x)
  y -= Math.floor(y)
  z -= Math.floor(z)
  const u = fade(x), fv = fade(y), w = fade(z)
  const A  = PERM[X]+Y,   AA = PERM[A]+Z,   AB = PERM[A+1]+Z
  const B  = PERM[X+1]+Y, BA = PERM[B]+Z,   BB = PERM[B+1]+Z

  function lerp(a,b,t){ return a + t*(b-a) }

  return lerp(
    lerp(
      lerp(gradPerlin(PERM[AA],   x,   y,   z),
           gradPerlin(PERM[BA],   x-1, y,   z), u),
      lerp(gradPerlin(PERM[AB],   x,   y-1, z),
           gradPerlin(PERM[BB],   x-1, y-1, z), u), fv),
    lerp(
      lerp(gradPerlin(PERM[AA+1], x,   y,   z-1),
           gradPerlin(PERM[BA+1], x-1, y,   z-1), u),
      lerp(gradPerlin(PERM[AB+1], x,   y-1, z-1),
           gradPerlin(PERM[BB+1], x-1, y-1, z-1), u), fv), w)
}

// Returns a noise in [-1, 1], high frequency for a grain effect
// (no big waves that would create whole areas of one color)
function noise(x, y, z){
  return perlin3(x * 0.4,  y * 0.4,  z * 0.4)  * 0.6
       + perlin3(x * 0.9,  y * 0.9,  z * 0.9)  * 0.4
}

///////////////////////////////////////////////////////////
// GRADIENT BLOCK PICKER
///////////////////////////////////////////////////////////

function gradientBlock(bx, by, bz){

  // Fallback if no gradient is defined
  if(!gradA || !gradB){
    const stop = GRADIENT[0]
    return stop[Math.floor(Math.random() * stop.length)]
  }

  // A -> B vector
  const ab  = [gradB[0]-gradA[0], gradB[1]-gradA[1], gradB[2]-gradA[2]]
  const len = norm3(ab)

  let t = 0
  if(len > 0){
    const ap = [bx-gradA[0], by-gradA[1], bz-gradA[2]]
    t = dot3(ap, ab) / (len * len)
  }

  // ── Dithering ──────────────────────────────────────
  if(GRADIENT_DITHER){
    const n = noise(bx, by, bz)   // [-1, 1]
    // Limit the shift to at most 1 stop to avoid large
    // areas of an foreign color
    const maxShift = 1 / (GRADIENT.length - 1)
    t += n * DITHER_STRENGTH * maxShift
  }

  t = clamp(t, 0, 1)

  // Map t -> stop index
  const maxIdx = GRADIENT.length - 1
  const idx    = clamp(Math.round(t * maxIdx), 0, maxIdx)
  const stop   = GRADIENT[idx]

  return stop[Math.floor(Math.random() * stop.length)]
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
    customDisplayName: "Gradient Cube",
    customDescription: "Click: Fill the selection with the gradient"
  })

  api.setItemSlot(pid, gradASlot, "Blue Paintball", 1, {
    customDisplayName: "Gradient Start",
    customDescription: "Click: gradient start point (color 0%)"
  })

  api.setItemSlot(pid, gradBSlot, "Yellow Paintball", 1, {
    customDisplayName: "Gradient End",
    customDescription: "Click: gradient end point (color 100%)"
  })
}

///////////////////////////////////////////////////////////
// CLICK EVENTS
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

  // ── CUBE POINTS ──────────────────────────────────────
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

  // ── GRADIENT START (Blue) ─────────────────────────────
  if(held.name === "Blue Paintball"){
    gradA = [x, y, z]
    api.sendMessage(pid,
      "Gradient START -> ("+x+","+y+","+z+") [0%]",
      {color:"blue"}
    )
    return
  }

  // ── GRADIENT END (Yellow) ─────────────────────────────
  if(held.name === "Yellow Paintball"){
    gradB = [x, y, z]
    api.sendMessage(pid,
      "Gradient END -> ("+x+","+y+","+z+") [100%]",
      {color:"yellow"}
    )
    return
  }

  // ── START BUILD ───────────────────────────────────────
  if(held.name === "Green Paintball"){
    startCube(pid)
  }
}

///////////////////////////////////////////////////////////
// START CUBE
///////////////////////////////////////////////////////////

function startCube(pid){
  const b = getBounds()

  if(!b){
    api.sendMessage(pid, "Define pos1/pos2!", {color:"red"})
    return
  }

  if(isBuilding){
    api.sendMessage(pid, "Already running!", {color:"orange"})
    return
  }

  if(!gradA || !gradB){
    api.sendMessage(pid, "Set the gradient start and end points first!", {color:"red"})
    return
  }

  bounds = b
  curX = b.minX
  curY = b.minY
  curZ = b.minZ
  totalReplaced = 0
  isBuilding = true

  const vol = (b.maxX-b.minX+1) * (b.maxY-b.minY+1) * (b.maxZ-b.minZ+1)

  const ditherStatus = GRADIENT_DITHER
    ? "Dither ON (strength: " + DITHER_STRENGTH + ")"
    : "Dither OFF (sharp gradient)"

  api.sendMessage(pid,
    "Cube gradient started (volume: " + vol + " blocks) | "
    + GRADIENT.length + " stops | " + ditherStatus,
    {color:"green"}
  )
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

tick = () => {
  if(!isBuilding) return

  const b = bounds
  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    const current = api.getBlock(curX, curY, curZ)

    if(shouldReplace(current)){
      api.setBlock(curX, curY, curZ, gradientBlock(curX, curY, curZ))
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
            "Cube gradient finished! (" + totalReplaced + " blocks placed)",
            {color:"green"}
          )
          return
        }
      }
    }
  }
}
```
