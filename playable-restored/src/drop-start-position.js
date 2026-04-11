export function resolveDropStartInParentSpace({ point, sourceParent, targetParent }) {
    if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
        throw new TypeError("point must be an object with numeric x and y");
    }

    if (!sourceParent || typeof sourceParent.toGlobal !== "function") {
        throw new TypeError("sourceParent must provide toGlobal()");
    }

    if (!targetParent || typeof targetParent.toLocal !== "function") {
        throw new TypeError("targetParent must provide toLocal()");
    }

    const resolvedPoint = targetParent.toLocal(point, sourceParent);
    return {
        x: resolvedPoint.x,
        y: resolvedPoint.y
    };
}

export function resolveAutoDropSourcePoint({ currentPoint, entryPose, useEntryPose }) {
    if (useEntryPose && entryPose) {
        return {
            x: entryPose.blockX,
            y: entryPose.blockY
        };
    }

    return {
        x: currentPoint.x,
        y: currentPoint.y
    };
}

export function resolveDropStartFromSwingPose({
    craneX,
    craneY,
    rotation,
    blockX = 0,
    blockY
}) {
    const numericFields = {
        craneX,
        craneY,
        rotation,
        blockX,
        blockY
    };

    for (const [field, value] of Object.entries(numericFields)) {
        if (typeof value !== "number" || Number.isNaN(value)) {
            throw new TypeError(`${field} must be a valid number`);
        }
    }

    const sin = Math.sin(rotation);
    const cos = Math.cos(rotation);

    return {
        x: craneX + blockX * cos + blockY * sin,
        y: craneY - blockX * sin + blockY * cos
    };
}

export function resolveTransferredBlockEntryPose({
    craneX,
    craneY,
    rotation,
    blockX,
    blockTopY,
    blockHeight,
    blockRotation = rotation,
    textureName
}) {
    const numericFields = {
        craneX,
        craneY,
        rotation,
        blockX,
        blockTopY,
        blockHeight
    };

    for (const [field, value] of Object.entries(numericFields)) {
        if (typeof value !== "number" || Number.isNaN(value)) {
            throw new TypeError(`${field} must be a valid number`);
        }
    }

    const blockY = blockTopY + blockHeight / 2;
    const sin = Math.sin(rotation);
    const cos = Math.cos(rotation);
    const previewOffsetX = blockX * cos + blockY * sin;
    const previewOffsetY = blockY * cos - blockX * sin - blockY;

    return {
        craneX,
        craneY,
        rotation,
        blockX,
        blockY,
        blockRotation,
        worldX: craneX + previewOffsetX,
        worldY: craneY + blockY + previewOffsetY,
        previewOffsetX,
        previewOffsetY,
        textureName
    };
}
