# Codes and Usages

## 〖〔 Plane Tool 〕〗

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

The code gives two axes and one paintball, all renamed.

1. The Wood Axe can be used to set the first edge :
- Pos 1 with the normal click
- Pos 2 with the alt click

2. The Stone Axe can be used to set the second edge :
- Pos 3 with the normal click
- Pos 4 with the alt click

3. Paintball allows you to validate and launch the plane construction with a click.

#### 〚 Code 〛

In addition to the items, there are certain very important things to know how to change in the code

1. You have to change the User of the code, because only one person can use the tool.

2. It is also possible to change the location of items when they appear on 'onPlayerJoin'

3. You can change the thickness of the generated plane

4. And very important, the blocks :
- It is possible to set a list of blocks that will be placed randomly (texturing)
- And you can also choose which blocks will be replaced (or "all")

### 『 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 06 Plane

Permission is hereby granted, free of charge, to any person obtaining a copy

///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot = 0
const replaceSlot = 1

// thickness of the plane
const PLANE_THICKNESS = 0

const BLOCKS_PER_TICK = 60
const MAX_PLANE_STEPS = 100

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

let pos1 = null
let pos2 = null
let pos3 = null
let pos4 = null

let pointIndex = 0

let buildQueue = []
let isBuilding = false

let totalQueued = 0
let totalReplaced = 0

let iu = 0
let iv = 0

let stepsU = 0
let stepsV = 0

let p1,p2,p3,p4
let normal

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

function lerp3(a,b,t){
  return [
    a[0] + (b[0]-a[0])*t,
    a[1] + (b[1]-a[1])*t,
    a[2] + (b[2]-a[2])*t
  ]
}

function norm3(v){
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
}

function normalize3(v){
  const n = norm3(v)
  if(n===0) return [0,0,0]
  return [v[0]/n, v[1]/n, v[2]/n]
}

function cross3(a,b){
  return [
    a[1]*b[2]-a[2]*b[1],
    a[2]*b[0]-a[0]*b[2],
    a[0]*b[1]-a[1]*b[0]
  ]
}

///////////////////////////////////////////////////////////
// PLANE GENERATION
///////////////////////////////////////////////////////////

function buildPlane(){
  const p1 = pos1
  const p2 = pos2
  const p3 = pos3
  const p4 = pos4

  const d12 = norm3([p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]])
  const d43 = norm3([p3[0]-p4[0],p3[1]-p4[1],p3[2]-p4[2]])
  const d14 = norm3([p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]])
  const d23 = norm3([p3[0]-p2[0],p3[1]-p2[1],p3[2]-p2[2]])

  let stepsU = Math.ceil(Math.max(d12,d43))*2+1
  let stepsV = Math.ceil(Math.max(d14,d23))*2+1
	
  // safety limit
  stepsU = Math.min(stepsU, MAX_PLANE_STEPS)
  stepsV = Math.min(stepsV, MAX_PLANE_STEPS)

  const edgeU = [p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
  const edgeV = [p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]]

  const normal = normalize3(cross3(edgeU,edgeV))

  const seen = new Set()
  const queue = []

  for(let iu=0; iu<=stepsU; iu++){

    const u = iu/stepsU

    const edgeA = lerp3(p1,p2,u)
    const edgeB = lerp3(p4,p3,u)

    for(let iv=0; iv<=stepsV; iv++){

      const v = iv/stepsV
      const pt = lerp3(edgeA,edgeB,v)

      for(let t=-PLANE_THICKNESS; t<=PLANE_THICKNESS; t++){

        const bx = Math.round(pt[0]+normal[0]*t)
        const by = Math.round(pt[1]+normal[1]*t)
        const bz = Math.round(pt[2]+normal[2]*t)

        const key = bx+"|"+by+"|"+bz

        if(!seen.has(key)){
          seen.add(key)
          queue.push([bx,by,bz])
        }
      }
    }
  }
  return queue
}

///////////////////////////////////////////////////////////
// GIVE ITEMS
///////////////////////////////////////////////////////////

onPlayerJoin = (pid)=>{
  if(!isWE(pid)) return

  api.clearInventory(pid)
  api.setItemSlot(pid,axeSlot,"Wood Axe",1,{
    customDisplayName:"Plane Tool",
    customDescription:"Alt-click: set next point"
  })
  api.setItemSlot(pid,replaceSlot,"Green Paintball",1,{
    customDisplayName:"Generate Plane",
    customDescription:"Click to build plane"
  })

}

///////////////////////////////////////////////////////////
// CLICK EVENTS
///////////////////////////////////////////////////////////

onPlayerClick = (pid,wasAltClick)=>{

  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const target = api.getPlayerTargetInfo(pid)
  if(!target || !target.position) return

  const x = target.position[0]
  const y = target.position[1]
  const z = target.position[2]

  /////////////////////////////////////////////////////////
  // POINT SELECTION
  /////////////////////////////////////////////////////////

  if(held.name === "Wood Axe"){
    pointIndex++
    if(pointIndex===1){
      pos1=[x,y,z]
      api.sendMessage(pid,"Pos1 set ("+x+","+y+","+z+")",{color:"green"})
    }
    else if(pointIndex===2){
      pos2=[x,y,z]
      api.sendMessage(pid,"Pos2 set ("+x+","+y+","+z+")",{color:"yellow"})
    }
    else if(pointIndex===3){
      pos3=[x,y,z]
      api.sendMessage(pid,"Pos3 set ("+x+","+y+","+z+")",{color:"cyan"})
    }
    else if(pointIndex===4){
      pos4=[x,y,z]
      api.sendMessage(pid,"Pos4 set ("+x+","+y+","+z+")",{color:"purple"})
      pointIndex = 0
    }
    return
  }

  /////////////////////////////////////////////////////////
  // START BUILD
  /////////////////////////////////////////////////////////

  if(held.name==="Green Paintball"){
    startPlane(pid)
  }
}

///////////////////////////////////////////////////////////
// START PLANE
///////////////////////////////////////////////////////////

function startPlane(pid){
  if(!pos1||!pos2||!pos3||!pos4){
    api.sendMessage(pid,"Please set 4 points first!",{color:"red"})
    return
  }
  if(isBuilding){
    api.sendMessage(pid,"Plane generation already running!",{color:"orange"})
    return
  }

  p1 = pos1
  p2 = pos2
  p3 = pos3
  p4 = pos4

  const d12 = norm3([p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]])
  const d43 = norm3([p3[0]-p4[0],p3[1]-p4[1],p3[2]-p4[2]])

  const d14 = norm3([p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]])
  const d23 = norm3([p3[0]-p2[0],p3[1]-p2[1],p3[2]-p2[2]])

  stepsU = Math.ceil(Math.max(d12,d43))*2+1
  stepsV = Math.ceil(Math.max(d14,d23))*2+1

  const edgeU = [p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
  const edgeV = [p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]]

  normal = normalize3(cross3(edgeU,edgeV))
  iu = 0
  iv = 0

  totalReplaced = 0
  isBuilding = true

  api.sendMessage(pid,"Plane generation started...",{color:"green"})
}

///////////////////////////////////////////////////////////
// TICK PROCESSING
///////////////////////////////////////////////////////////

tick = ()=>{
  if(!isBuilding) return
  let processed = 0
  while(processed < BLOCKS_PER_TICK){
    if(iu > stepsU){
      isBuilding=false
      api.broadcastMessage(
        "Plane finished ("+totalReplaced+" blocks placed)",
        {color:"green"}
      )
      return
    }
    const u = iu/stepsU
    const edgeA = lerp3(p1,p2,u)
    const edgeB = lerp3(p4,p3,u)
    const v = iv/stepsV
    const pt = lerp3(edgeA,edgeB,v)

    for(let t=-PLANE_THICKNESS;t<=PLANE_THICKNESS;t++){

      const bx = Math.round(pt[0]+normal[0]*t)
      const by = Math.round(pt[1]+normal[1]*t)
      const bz = Math.round(pt[2]+normal[2]*t)

      const current = api.getBlock(bx,by,bz)

      if(shouldReplace(current)){
        api.setBlock(bx,by,bz,randBlock())
        totalReplaced++
      }
    }
    processed++
    iv++
    if(iv > stepsV){
      iv = 0
      iu++
    }
  }
}
```


## 〖〔 Plane Tool V2 (+ gradient) 〕〗

### Gradient Features
- The V2 code introduces advanced gradient functionalities that allow for smooth color transitions in your designs. You can customize gradients using various colors and directions.

### 『 How to use 』

#### 〚 Init 〛

To init the code you just have to copy / paste all in the world code.  
You can open it with F8 or by clicking "World Code" in a code block.

#### 〚 Items 〛

This upgrade adds several new items, including unique tools and resources that enhance the user experience and expand capabilities:
 * It add the **Blue Paintball** to set the *gradient start*,
 * And the **Yellow Paintball** to set the *gradient end*.

#### 〚 Code 〛

In addition to the first Plane-Tool, in this one:
- Users can configure the gradient settings in the configuration file. Key options include:
  - `gradientType`: Specify the type of gradient (linear, radial, etc.).
  - `colorStops`: Define the colors used in the gradient.
  - `direction`: Set the direction of the gradient effect (horizontal, vertical, diagonal).

### 『 V2 Code to copy 』

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 06 Plane + Gradient

Permission is hereby granted, free of charge, to any person obtaining a copy

///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot   = 0
const replaceSlot = 1
const gradASlot = 2  // Blue Paintball   → gradient start
const gradBSlot = 3  // Yellow Paintball → gradient end

// thickness of the plane
const PLANE_THICKNESS = 0

const BLOCKS_PER_TICK = 60
const MAX_PLANE_STEPS = 100

// ── GRADIENT DITHER ───────────────────────────────────
// false → tranches nettes (comportement original)
// true  → bruit de Perlin appliqué sur t pour des
//         frontières organiques entre les stops
const GRADIENT_DITHER = true

// Force du bruit — limité à 1 stop max de décalage
// Recommandé : entre 0 et 1
const DITHER_STRENGTH = 0.9

///////////////////////////////////////////////////////////
// GRADIENT PALETTE
// Chaque entrée = un "stop" du dégradé, dans l'ordre.
// Le dégradé est divisé uniformément entre tous les stops.
// Chaque stop est un tableau de noms de blocs (choix aléatoire).
///////////////////////////////////////////////////////////

const GRADIENT = [
  ["Lime Concrete",  "Lime Wool"],          // 0%   vert clair
  ["Lime Concrete",  "Lime Baked Clay"],     // 25%  vert clair/moyen
  ["Green Concrete", "Jungle Grass Block"],  // 50%  vert foncé
  ["Brown Concrete", "Dirt"],               // 75%  marron clair
  ["Brown Concrete", "Brown Wool"],         // 100% marron foncé
]

let REPLACE_BLOCKS = "all"

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null
let pos3 = null
let pos4 = null

let pointIndex = 0

let isBuilding    = false
let totalReplaced = 0

let iu = 0
let iv = 0
let stepsU = 0
let stepsV = 0

let p1, p2, p3, p4
let normal

// Gradient direction points
let gradA = null  // start (blue)   → GRADIENT[0]
let gradB = null  // end   (yellow) → GRADIENT[last]

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

function lerp3(a, b, t){
  return [
    a[0] + (b[0]-a[0])*t,
    a[1] + (b[1]-a[1])*t,
    a[2] + (b[2]-a[2])*t,
  ]
}

function norm3(v){
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
}

function normalize3(v){
  const n = norm3(v)
  if(n === 0) return [0,0,0]
  return [v[0]/n, v[1]/n, v[2]/n]
}

function cross3(a, b){
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0],
  ]
}

function dot3(a, b){
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

function clamp(v, lo, hi){
  return Math.max(lo, Math.min(hi, v))
}

///////////////////////////////////////////////////////////
// PERLIN NOISE 3D (simplifié, sans dépendance externe)
// Basé sur la méthode de Ken Perlin (amélioration 2002)
///////////////////////////////////////////////////////////

const PERM = []
;(()=>{
  const base = []
  for(let i = 0; i < 256; i++) base[i] = i
  // shuffle déterministe (seed fixe)
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

// Retourne un bruit dans [-1, 1], haute fréquence pour un effet grain
// (pas de grandes vagues qui créeraient des zones entières d'une couleur)
function noise(x, y, z){
  return perlin3(x * 0.4,  y * 0.4,  z * 0.4)  * 0.6
       + perlin3(x * 0.9,  y * 0.9,  z * 0.9)  * 0.4
}

///////////////////////////////////////////////////////////
// GRADIENT BLOCK PICKER
///////////////////////////////////////////////////////////

function gradientBlock(bx, by, bz){

  // Fallback si pas de gradient défini
  if(!gradA || !gradB){
    const stop = GRADIENT[0]
    return stop[Math.floor(Math.random() * stop.length)]
  }

  // Vecteur A→B
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
    // On limite le décalage à ±1 stop maximum pour éviter
    // les grandes zones d'une couleur étrangère
    const maxShift = 1 / (GRADIENT.length - 1)
    t += n * DITHER_STRENGTH * maxShift
  }

  t = clamp(t, 0, 1)

  // Map t → stop index
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
    customDisplayName: "Plane Tool",
    customDescription: "Click: set next point (4 points needed)"
  })

  api.setItemSlot(pid, replaceSlot, "Green Paintball", 1, {
    customDisplayName: "Generate Plane",
    customDescription: "Click to build the plane"
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

  const target = api.getPlayerTargetInfo(pid)
  if(!target || !target.position) return

  const x = target.position[0]
  const y = target.position[1]
  const z = target.position[2]

  // ── PLANE POINTS ──────────────────────────────────────
  if(held.name === "Wood Axe"){
    pointIndex++
    if(pointIndex === 1){
      pos1 = [x,y,z]
      api.sendMessage(pid, "Pos1 set ("+x+","+y+","+z+")", {color:"green"})
    } else if(pointIndex === 2){
      pos2 = [x,y,z]
      api.sendMessage(pid, "Pos2 set ("+x+","+y+","+z+")", {color:"yellow"})
    } else if(pointIndex === 3){
      pos3 = [x,y,z]
      api.sendMessage(pid, "Pos3 set ("+x+","+y+","+z+")", {color:"cyan"})
    } else if(pointIndex === 4){
      pos4 = [x,y,z]
      api.sendMessage(pid, "Pos4 set ("+x+","+y+","+z+")", {color:"purple"})
      pointIndex = 0
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
    startPlane(pid)
  }
}

///////////////////////////////////////////////////////////
// START PLANE
///////////////////////////////////////////////////////////

function startPlane(pid){
  if(!pos1 || !pos2 || !pos3 || !pos4){
    api.sendMessage(pid, "Please set 4 points first!", {color:"red"})
    return
  }
  if(isBuilding){
    api.sendMessage(pid, "Plane generation already running!", {color:"orange"})
    return
  }

  p1 = pos1; p2 = pos2; p3 = pos3; p4 = pos4

  const d12 = norm3([p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]])
  const d43 = norm3([p3[0]-p4[0], p3[1]-p4[1], p3[2]-p4[2]])
  const d14 = norm3([p4[0]-p1[0], p4[1]-p1[1], p4[2]-p1[2]])
  const d23 = norm3([p3[0]-p2[0], p3[1]-p2[1], p3[2]-p2[2]])

  stepsU = Math.min(Math.ceil(Math.max(d12, d43)) * 2 + 1, MAX_PLANE_STEPS)
  stepsV = Math.min(Math.ceil(Math.max(d14, d23)) * 2 + 1, MAX_PLANE_STEPS)

  const edgeU = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]]
  const edgeV = [p4[0]-p1[0], p4[1]-p1[1], p4[2]-p1[2]]

  normal = normalize3(cross3(edgeU, edgeV))

  iu = 0; iv = 0
  totalReplaced = 0
  isBuilding = true

  const ditherStatus = GRADIENT_DITHER
    ? "Dither ON (strength: " + DITHER_STRENGTH + ")"
    : "Dither OFF (sharp gradient)"

  api.sendMessage(pid,
    "Plane started... | " + GRADIENT.length + " stops | " + ditherStatus,
    {color:"green"}
  )
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

tick = () => {
  if(!isBuilding) return

  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    if(iu > stepsU){
      isBuilding = false
      api.broadcastMessage(
        "Plane finished (" + totalReplaced + " blocks placed)",
        {color:"green"}
      )
      return
    }

    const u     = iu / stepsU
    const edgeA = lerp3(p1, p2, u)
    const edgeB = lerp3(p4, p3, u)
    const v     = iv / stepsV
    const pt    = lerp3(edgeA, edgeB, v)

    for(let t = -PLANE_THICKNESS; t <= PLANE_THICKNESS; t++){

      const bx = Math.round(pt[0] + normal[0]*t)
      const by = Math.round(pt[1] + normal[1]*t)
      const bz = Math.round(pt[2] + normal[2]*t)

      const current = api.getBlock(bx, by, bz)

      if(shouldReplace(current)){
        api.setBlock(bx, by, bz, gradientBlock(bx, by, bz))
        totalReplaced++
      }
    }

    processed++
    iv++
    if(iv > stepsV){
      iv = 0
      iu++
    }
  }
}
```
