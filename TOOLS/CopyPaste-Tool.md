# Better World Edit - Bloxd.io

## 〖〔 Copy & Paste Tool 〕〗

### 『 Overview 』

Copies a selection directly from the source area and pastes it somewhere else using an anchor.

### 『 How to use 』

#### 〚 Init 〛

Copy and paste the full code below into the Bloxd.io world code editor.
You can open it with **F8** or by clicking **World Code** inside a code block.

#### 〚 Items 〛

- **Wood Axe** — normal click sets `Pos1`, alt click sets `Pos2`.
- **Green Paintball** — sets the source anchor.
- **Red Paintball** — pastes the copied structure at the target location.

#### 〚 Config 〛

- `WE_OWNER` to lock the tool to your username.
- `axeSlot`, `anchorSlot`, and `pasteSlot` to change the item slots.
- `OVERWRITE` to control whether destination blocks are overwritten.
- `COPY_AIR` to control whether air from the source is copied.
- `BLOCKS_PER_TICK` and `TICK_SKIP` to control paste speed.

### 『 Code to copy 』

```js
 /* 
MIT License
Copyright (c) 2026 K4miNoK4mi - World Edit - 03 Direct Copy & Paste

Permission is hereby granted, free of charge, to any person obtaining a copy

///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi"

const axeSlot    = 0
const anchorSlot = 1  // Green Paintball → anchor
const pasteSlot  = 2  // Red Paintball   → paste

// ── Overwrite mode ──
// true  → Remplace TOUS les blocs à la destination
// false → Ne place que dans l'Air (préserve les blocs existants à la destination)
const OVERWRITE = false

// ── Copy Air mode ──
// true  → On copie aussi l'Air de la source (si OVERWRITE est true, ça efface donc les blocs à la destination là où il y a de l'air dans la sélection)
// false → On ignore l'Air de la source (les blocs existants à la destination ne sont pas effacés par le vide)
const COPY_AIR = false

// ── Rate limiting (appels API par tick) ──
const BLOCKS_PER_TICK = 25
const TICK_SKIP       = 1   // 1 = chaque tick, 2 = un tick sur deux...

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1   = null   // zone source coin 1
let pos2   = null   // zone source coin 2
let anchor = null   // point d'ancrage (référence dans la zone source)

// ── Paste state ──
let isPasting  = false
let pastePid   = null
let pasteCurX, pasteCurY, pasteCurZ  // curseur dans la zone SOURCE
let pasteEndX, pasteEndY, pasteEndZ
let pasteOrgX, pasteOrgY, pasteOrgZ  // origine source (min)
let pasteOffX, pasteOffY, pasteOffZ  // offset source→dest
let pasteDone  = 0
let pasteTotal = 0

// ── Tick counter ──
let tickCounter = 0

///////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////

function isWE(pid){
  return api.getEntityName(pid) === WE_OWNER
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

export function onPlayerJoin1(pid) {
  if(!isWE(pid)) return
  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left: Pos1 | Alt: Pos2"
  })
  api.setItemSlot(pid, anchorSlot, "Green Paintball", 1, {
    customDisplayName: "Anchor Tool",
    customDescription: "Click: Set anchor point in source zone"
  })
  api.setItemSlot(pid, pasteSlot, "Red Paintball", 1, {
    customDisplayName: "Paste Tool",
    customDescription: "Click: Paste zone here (direct copy)"
  })
}

///////////////////////////////////////////////////////////
// CLICK
///////////////////////////////////////////////////////////

export function onPlayerClick1(pid, wasAltClick) {
  if(!isWE(pid)) return

  const held = api.getHeldItem(pid)
  if(!held) return

  const targetInfo = api.getPlayerTargetInfo(pid)
  if(!targetInfo || !targetInfo.position) return

  const x = targetInfo.position[0]
  const y = targetInfo.position[1]
  const z = targetInfo.position[2]

  // ── AXE ───────────────────────────────────────────────
  if(held.name === "Wood Axe"){
    if(!wasAltClick){
      pos1 = [x, y, z]
      api.sendMessage(pid, "Pos1 -> " + x + " " + y + " " + z, {color:"green"})
    } else {
      pos2 = [x, y, z]
      api.sendMessage(pid, "Pos2 -> " + x + " " + y + " " + z, {color:"yellow"})
    }
    return
  }

  // ── GREEN PAINTBALL: anchor ───────────────────────────
  if(held.name === "Green Paintball"){
    if(isPasting){
      api.sendMessage(pid, "Paste in progress, wait...", {color:"orange"})
      return
    }
    if(!pos1 || !pos2){
      api.sendMessage(pid, "Set Pos1 & Pos2 first (Wood Axe).", {color:"red"})
      return
    }
    anchor = [x, y, z]
    api.sendMessage(pid, "Anchor -> " + x + " " + y + " " + z, {color:"green"})
    return
  }

  // ── RED PAINTBALL: paste ──────────────────────────────
  if(held.name === "Red Paintball"){
    if(isPasting){
      api.sendMessage(pid, "Already pasting, wait...", {color:"orange"})
      return
    }
    if(!pos1 || !pos2){
      api.sendMessage(pid, "Set Pos1 & Pos2 first (Wood Axe).", {color:"red"})
      return
    }
    if(!anchor){
      api.sendMessage(pid, "Set anchor first (Green Paintball).", {color:"red"})
      return
    }

    startPaste(pid, x, y, z)
    return
  }
}

///////////////////////////////////////////////////////////
// PASTE (direct: getBlock source → setBlock dest)
///////////////////////////////////////////////////////////

function startPaste(pid, clickX, clickY, clickZ){
  const b = getBounds()

  // Offset = where user clicked minus anchor
  pasteOffX = clickX - anchor[0]
  pasteOffY = clickY - anchor[1]
  pasteOffZ = clickZ - anchor[2]

  // Cursor starts at source min corner
  pasteOrgX = b.minX
  pasteOrgY = b.minY
  pasteOrgZ = b.minZ
  pasteCurX = b.minX
  pasteCurY = b.minY
  pasteCurZ = b.minZ
  pasteEndX = b.maxX
  pasteEndY = b.maxY
  pasteEndZ = b.maxZ

  pasteTotal = (pasteEndX - pasteOrgX + 1)
             * (pasteEndY - pasteOrgY + 1)
             * (pasteEndZ - pasteOrgZ + 1)
  pasteDone  = 0
  pastePid   = pid
  isPasting  = true

  api.sendMessage(pid,
    "Pasting " + pasteTotal + " blocks | offset " +
    pasteOffX + " " + pasteOffY + " " + pasteOffZ +
    " | overwrite: " + OVERWRITE + " | copy_air: " + COPY_AIR,
    {color:"red"}
  )
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

export function tick1() {
  tickCounter++
  if(tickCounter % TICK_SKIP !== 0) return
  if(!isPasting) return

  let processed = 0

  while(processed < BLOCKS_PER_TICK){

    // Source coords
    const sx = pasteCurX
    const sy = pasteCurY
    const sz = pasteCurZ

    // Destination coords
    const dx = sx + pasteOffX
    const dy = sy + pasteOffY
    const dz = sz + pasteOffZ

    // ── 1. Vérification OVERWRITE ──
    if(!OVERWRITE){
      const destBlock = api.getBlock(dx, dy, dz)
      if(destBlock && destBlock !== "Air"){
        // Skip : on ne touche pas aux blocs existants
        processed++
        pasteDone++
        advanceCursor()
        if(pasteCurY > pasteEndY){ finishPaste(); return }
        continue
      }
    }

    // ── 2. Lecture du bloc Source ──
    const srcBlock = api.getBlock(sx, sy, sz)

    // ── 3. Application selon COPY_AIR ──
    if(srcBlock === "Air"){
      if(COPY_AIR && OVERWRITE){
        // On ne pose de l'air que si COPY_AIR=true ET OVERWRITE=true.
        // (Si OVERWRITE=false, la destination est déjà de l'air, inutile de gâcher un appel API).
        api.setBlock(dx, dy, dz, "Air")
      }
    } else if(srcBlock){
      // C'est un vrai bloc, on le pose !
      api.setBlock(dx, dy, dz, srcBlock)
    }

    processed++
    pasteDone++

    // Advance cursor through source zone
    advanceCursor()
    if(pasteCurY > pasteEndY){
      finishPaste()
      return
    }
  }
}

///////////////////////////////////////////////////////////
// CURSOR HELPERS
///////////////////////////////////////////////////////////

function advanceCursor(){
  pasteCurZ++
  if(pasteCurZ > pasteEndZ){
    pasteCurZ = pasteOrgZ
    pasteCurX++
    if(pasteCurX > pasteEndX){
      pasteCurX = pasteOrgX
      pasteCurY++
    }
  }
}

function finishPaste(){
  isPasting = false
  api.sendMessage(pastePid,
    "Done! " + pasteDone + " blocks processed.",
    {color:"green"}
  )
}
```
