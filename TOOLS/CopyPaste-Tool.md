# Details coming soon

# Code to copy

```js
/* 
MIT License

Copyright (c) 2026 K4miNoK4mi - World Edit - 02 Copy & Paste

Permission is hereby granted, free of charge, to any person obtaining a copy


///////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////*/

const WE_OWNER = "K4miNoK4mi" // set your username

const axeSlot    = 0
const anchorSlot = 1  // Green Paintball → lock anchor
const pasteSlot  = 2  // Red Paintball   → paste

///////////////////////////////////////////////////////////
// VARIABLES
///////////////////////////////////////////////////////////

let pos1 = null
let pos2 = null

// Clipboard: array of { dx, dy, dz, block }
// offsets relative to the min corner (pos1)
let clipboard = null

// Anchor: locked position before pasting
let anchor = null

// ── Copy state ──
let isCopying  = false
let copyBounds = null
let copyCurX, copyCurY, copyCurZ
let copyBuffer = []
let copyPid    = null

// ── Paste state ──
let isPasting   = false
let pasteQueue  = []
let totalPasted = 0

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

onPlayerJoin = (pid) => {
  if(!isWE(pid)) return

  api.clearInventory(pid)

  api.setItemSlot(pid, axeSlot, "Wood Axe", 1, {
    customDisplayName: "WE Axe",
    customDescription: "Left: Pos1 | Alt: Pos2 | Auto-copies on both set"
  })

  api.setItemSlot(pid, anchorSlot, "Green Paintball", 1, {
    customDisplayName: "Anchor Tool",
    customDescription: "Click: Lock anchor position"
  })

  api.setItemSlot(pid, pasteSlot, "Red Paintball", 1, {
    customDisplayName: "Paste Tool",
    customDescription: "Click: Paste selection here"
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

  // ── AXE: select zone ──────────────────────────────────
  if(held.name === "Wood Axe"){
    if(!wasAltClick){
      pos1 = [x, y, z]
      clipboard = null
      anchor    = null
      api.sendMessage(pid, "Pos1 set -> " + x + " " + y + " " + z, {color:"green"})
    } else {
      pos2 = [x, y, z]
      clipboard = null
      anchor    = null
      api.sendMessage(pid, "Pos2 set -> " + x + " " + y + " " + z, {color:"yellow"})
    }

    if(pos1 && pos2){
      startCopy(pid)
    }
    return
  }

  // ── GREEN PAINTBALL: lock anchor ──────────────────────
  if(held.name === "Green Paintball"){

    if(isCopying){
      api.sendMessage(pid, "Still copying, please wait...", {color:"orange"})
      return
    }

    if(!clipboard){
      api.sendMessage(pid, "No selection copied yet! Use the axe first.", {color:"red"})
      return
    }

    anchor = [x, y, z]
    api.sendMessage(pid,
      "Anchor locked -> " + x + " " + y + " " + z + " | Use Red Paintball to paste.",
      {color:"green"}
    )
    return
  }

  // ── RED PAINTBALL: paste ──────────────────────────────
  if(held.name === "Red Paintball"){

    if(isCopying){
      api.sendMessage(pid, "Still copying, please wait...", {color:"orange"})
      return
    }

    if(!clipboard){
      api.sendMessage(pid, "No selection copied yet! Use the axe first.", {color:"red"})
      return
    }

    if(!anchor){
      api.sendMessage(pid, "No anchor set! Use Green Paintball first.", {color:"red"})
      return
    }

    if(isPasting){
      api.sendMessage(pid, "Already pasting, please wait...", {color:"orange"})
      return
    }

    startPaste(pid, x, y, z)
    return
  }
}

///////////////////////////////////////////////////////////
// COPY  (async - spread over ticks)
///////////////////////////////////////////////////////////

function startCopy(pid){
  if(isCopying){
    api.sendMessage(pid, "Already copying!", {color:"orange"})
    return
  }

  const b = getBounds()
  if(!b) return

  const vol = (b.maxX-b.minX+1) * (b.maxY-b.minY+1) * (b.maxZ-b.minZ+1)
  api.sendMessage(pid, "Copying " + vol + " blocks...", {color:"green"})

  copyBounds = b
  copyCurX   = b.minX
  copyCurY   = b.minY
  copyCurZ   = b.minZ
  copyBuffer = []
  copyPid    = pid
  clipboard  = null
  isCopying  = true
}

///////////////////////////////////////////////////////////
// PASTE
///////////////////////////////////////////////////////////

function startPaste(pid, clickX, clickY, clickZ){
  const offX = clickX - anchor[0]
  const offY = clickY - anchor[1]
  const offZ = clickZ - anchor[2]

  const b       = getBounds()
  const originX = b.minX + offX
  const originY = b.minY + offY
  const originZ = b.minZ + offZ

  pasteQueue = clipboard.map(entry => ({
    x: originX + entry.dx,
    y: originY + entry.dy,
    z: originZ + entry.dz,
    block: entry.block
  }))

  totalPasted = 0
  isPasting   = true

  api.sendMessage(pid,
    "Pasting " + pasteQueue.length + " blocks (offset " + offX + " " + offY + " " + offZ + ")...",
    {color:"red"}
  )
}

///////////////////////////////////////////////////////////
// TICK
///////////////////////////////////////////////////////////

const BLOCKS_PER_TICK = 50

tick = () => {

  // ── async copy ────────────────────────────────────────
  if(isCopying){
    const b    = copyBounds
    const orgX = b.minX
    const orgY = b.minY
    const orgZ = b.minZ
    let processed = 0

    while(processed < BLOCKS_PER_TICK){
      const block = api.getBlock(copyCurX, copyCurY, copyCurZ)
      copyBuffer.push({
        dx:    copyCurX - orgX,
        dy:    copyCurY - orgY,
        dz:    copyCurZ - orgZ,
        block: block
      })
      processed++

      copyCurZ++
      if(copyCurZ > b.maxZ){
        copyCurZ = b.minZ
        copyCurX++
        if(copyCurX > b.maxX){
          copyCurX = b.minX
          copyCurY++
          if(copyCurY > b.maxY){
            clipboard = copyBuffer
            isCopying = false
            api.sendMessage(copyPid,
              "Copied " + clipboard.length + " blocks! Set an anchor with Green Paintball, then paste with Red Paintball.",
              {color:"green"}
            )
            return
          }
        }
      }
    }
    return
  }

  // ── async paste ───────────────────────────────────────
  if(!isPasting) return

  let processed = 0
  while(processed < BLOCKS_PER_TICK && pasteQueue.length > 0){
    const entry = pasteQueue.shift()
    api.setBlock(entry.x, entry.y, entry.z, entry.block)
    totalPasted++
    processed++
  }

  if(pasteQueue.length === 0){
    isPasting = false
    api.broadcastMessage(
      "Paste finished! (" + totalPasted + " blocks placed)",
      {color:"green"}
    )
  }
}
```
