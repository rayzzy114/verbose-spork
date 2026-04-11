import test from "node:test";
import assert from "node:assert/strict";

import { runPostBigWinTransition } from "../src/end-screen-transition.js";

test("shows the bonus end screen without replaying the phone animation by default", async () => {
    const calls = [];

    await runPostBigWinTransition({
        playPhoneAnimation: async () => {
            calls.push("phone");
        },
        showEndScreen: async () => {
            calls.push("end");
        }
    });

    assert.deepEqual(calls, ["end"]);
});

test("can still include the phone animation when explicitly requested", async () => {
    const calls = [];

    await runPostBigWinTransition({
        includePhoneAnimation: true,
        playPhoneAnimation: async () => {
            calls.push("phone");
        },
        showEndScreen: async () => {
            calls.push("end");
        }
    });

    assert.deepEqual(calls, ["phone", "end"]);
});
