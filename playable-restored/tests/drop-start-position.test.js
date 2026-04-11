import test from "node:test";
import assert from "node:assert/strict";

import {
    resolveAutoDropSourcePoint,
    resolveDropStartInParentSpace,
    resolveDropStartFromSwingPose,
    resolveTransferredBlockEntryPose
} from "../src/drop-start-position.js";

class MockNode {
    constructor({ tx = 0, ty = 0, scale = 1, parent = null } = {}) {
        this.tx = tx;
        this.ty = ty;
        this.scale = scale;
        this.parent = parent;
    }

    toGlobal(point, out = { x: 0, y: 0 }) {
        const nextPoint = {
            x: point.x * this.scale + this.tx,
            y: point.y * this.scale + this.ty
        };

        if (this.parent) {
            return this.parent.toGlobal(nextPoint, out);
        }

        out.x = nextPoint.x;
        out.y = nextPoint.y;
        return out;
    }

    toLocal(point, from, out = { x: 0, y: 0 }) {
        const globalPoint = from ? from.toGlobal(point) : point;
        return this.#fromGlobal(globalPoint, out);
    }

    #fromGlobal(point, out) {
        const parentPoint = this.parent ? this.parent.#fromGlobal(point, out) : point;

        out.x = (parentPoint.x - this.tx) / this.scale;
        out.y = (parentPoint.y - this.ty) / this.scale;
        return out;
    }
}

test("resolves drop start in the falling block parent space even after outer scaling", () => {
    const scaledRoot = new MockNode({ tx: 0, ty: 30, scale: 0.3333 });
    const fallingBlockParent = new MockNode({ parent: scaledRoot });
    const craneContainer = new MockNode({ tx: 540, ty: 0, parent: fallingBlockParent });
    const hangingBlockLocal = { x: 0, y: 908.1 };

    const wrongGlobalStart = craneContainer.toGlobal(hangingBlockLocal);
    assert.notDeepEqual(wrongGlobalStart, { x: 540, y: 908.1 });

    const dropStart = resolveDropStartInParentSpace({
        point: hangingBlockLocal,
        sourceParent: craneContainer,
        targetParent: fallingBlockParent
    });

    assert.equal(Number(dropStart.x.toFixed(1)), 540.0);
    assert.equal(Number(dropStart.y.toFixed(1)), 908.1);
});

test("prefers captured entry pose for the first transferred auto-drop", () => {
    const point = resolveAutoDropSourcePoint({
        currentPoint: { x: 0, y: 688.1 },
        entryPose: { blockX: 0, blockY: 702.3 },
        useEntryPose: true
    });

    assert.deepEqual(point, { x: 0, y: 702.3 });
});

test("keeps the current hanging position for normal drops", () => {
    const point = resolveAutoDropSourcePoint({
        currentPoint: { x: 0, y: 908.1 },
        entryPose: { blockX: 0, blockY: 702.3 },
        useEntryPose: false
    });

    assert.deepEqual(point, { x: 0, y: 908.1 });
});

test("converts the start-scene top anchor into the gameplay center point", () => {
    const pose = resolveTransferredBlockEntryPose({
        craneX: 540,
        craneY: 0,
        rotation: 0,
        blockX: 0,
        blockTopY: 702.3112,
        blockWidth: 814.325,
        blockHeight: 528.6595,
        textureName: "throne1.webp"
    });

    assert.equal(Number(pose.blockY.toFixed(1)), 966.6);
    assert.equal(Number(pose.worldX.toFixed(1)), 540.0);
    assert.equal(Number(pose.worldY.toFixed(1)), 966.6);
    assert.equal(Number(pose.previewOffsetY.toFixed(1)), 0.0);
});

test("keeps the transferred world position aligned with the rotated center point", () => {
    const rotation = 0.028017295797479115;
    const pose = resolveTransferredBlockEntryPose({
        craneX: 540,
        craneY: 0,
        rotation,
        blockX: 0,
        blockTopY: 702.3112,
        blockWidth: 814.325,
        blockHeight: 528.6595,
        textureName: "throne1.webp"
    });

    const expectedCenterY = 702.3112 + 528.6595 / 2;
    assert.equal(Number(pose.blockY.toFixed(1)), Number(expectedCenterY.toFixed(1)));
    assert.equal(Number(pose.worldX.toFixed(1)), Number((540 + Math.sin(rotation) * expectedCenterY).toFixed(1)));
    assert.equal(Number(pose.worldY.toFixed(1)), Number((Math.cos(rotation) * expectedCenterY).toFixed(1)));
});

test("resolves drop start directly from the local swing pose without stage transforms", () => {
    const dropStart = resolveDropStartFromSwingPose({
        craneX: 540,
        craneY: 0,
        rotation: 0.11357789433911314,
        blockX: 0,
        blockY: 966.4856753747324
    });

    assert.equal(Number(dropStart.x.toFixed(1)), 649.5);
    assert.equal(Number(dropStart.y.toFixed(1)), 960.3);
});
