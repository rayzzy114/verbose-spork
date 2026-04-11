export async function runPostBigWinTransition({
    showEndScreen,
    playPhoneAnimation,
    includePhoneAnimation = false
}) {
    if (includePhoneAnimation && typeof playPhoneAnimation === "function") {
        await playPhoneAnimation();
    }

    if (typeof showEndScreen === "function") {
        await showEndScreen();
    }
}
