import {
    resolveDropStartFromSwingPose,
    resolveTransferredBlockEntryPose
} from "./drop-start-position.js";

const ub = "DE",
    Ju = {
        DE: {
            geo: "DE",
            phoneGeo: "DE",
            phonePrefix: "phone - comp_DE",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "de-DE",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "de"
        },
        NL: {
            geo: "NL",
            phoneGeo: "NL",
            phonePrefix: "phone - comp_ NL",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "nl-NL",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "nl"
        },
        FR: {
            geo: "FR",
            phoneGeo: "FR",
            phonePrefix: "phone - comp_FR",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "fr-FR",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "fr"
        },
        ES: {
            geo: "ES",
            phoneGeo: "ES",
            phonePrefix: "phone - comp_ES",
            phoneFrameStart: 33,
            phoneFrameEnd: 107,
            phoneFrameStep: 1,
            locale: "es-ES",
            currencyCode: "EUR",
            currencySymbol: "€",
            language: "es"
        },
        GB: {
            geo: "GB",
            phoneGeo: "GB",
            phonePrefix: "phone - comp_GB",
            phoneFrameStart: 31,
            phoneFrameEnd: 122,
            phoneFrameStep: 1,
            locale: "en-GB",
            currencyCode: "GBP",
            currencySymbol: "£",
            language: "en"
        }
    };

function db(i) {
    const t = i == null ? void 0 : i.toUpperCase();
    return t && t in Ju ? t : ub
}

function fb() {
    if (!(typeof window > "u")) return new URLSearchParams(window.location.search).get("geo") ?? void 0
}

function ve() {
    const i = typeof import.meta < "u" ? "GB" : void 0,
        t = fb(),
        e = db(i || t);
    return Ju[e]
}
const yh = 10,
    pb = 2500,
    Gr = .21,
    mb = .72,
    Fr = [0, 460, 620],
    gb = .26,
    _b = 48,
    Fi = 4e3,
    xb = 526 / 1080,
    yb = .32,
    Or = -200,
    bb = .016,
    vb = .18,
    wb = .18,
    Tb = 130,
    Sb = .58,
    rs = ["throne1.webp", "throne2.webp", "throne3.webp"],
    Cb = ["bg main new.webp", "log twr.webp", "platform wide.webp", "throne1.webp", "throne2.webp", "throne3.webp", "kruk.webp", "but cash out.webp", "but cash out gold.webp", "but build.webp", "box results.webp"],
    Be = ve(),
    Ab = 30,
    Pb = ["wheel/cepochka.webp", "wheel/osnova wheel.webp", "wheel/centr wheel.webp", "wheel/obod top.webp", "wheel/dragon.webp", "box bigwin.webp", "box bonus.webp"],
    bh = Array.from({
        length: Math.floor((Be.phoneFrameEnd - Be.phoneFrameStart) / Be.phoneFrameStep) + 1
    }, (i, t) => `phone - comp ${Be.phoneGeo}/${Be.phonePrefix}${String(Be.phoneFrameStart+t*Be.phoneFrameStep).padStart(5,"0")}.webp`),
    ns = [{
        name: "x1.5",
        multiplier: 1.5,
        weight: 25
    }, {
        name: "dragon",
        multiplier: 0,
        weight: 2
    }, {
        name: "x7",
        multiplier: 7,
        weight: 5
    }, {
        name: "x10",
        multiplier: 10,
        weight: 3
    }, {
        name: "x2.5",
        multiplier: 2.5,
        weight: 15
    }, {
        name: "x3",
        multiplier: 3,
        weight: 15
    }, {
        name: "x5",
        multiplier: 5,
        weight: 10
    }, {
        name: "x1",
        multiplier: 1,
        weight: 25
    }],
    Eb = .35,
    Mb = .8,
    kb = 1.5,
    Rb = Eb + Mb + kb,
    Bb = 3,
    Ib = .936,
    Gb = .66,
    Fb = .52,
    vh = .045,
    Ob = 1,
    Lb = -Math.PI / 2,
    Db = .78,
    Ub = .44,
    Nb = .25,
    wh = 11e3,
    Wb = .04,
    os = {
        left: 193,
        top: 587,
        right: 1014,
        bottom: 1408
    },
    Lr = {
        top: 87,
        bottom: 684
    },
    Hb = `
in vec2 vTextureCoord;

out vec4 finalColor;

uniform float uAmount;
uniform sampler2D uTexture;

void main()
{
    vec2 direction = normalize(vec2(1.0, 0.35));
    vec2 offset = direction * uAmount;
    vec4 base = texture(uTexture, vTextureCoord);
    vec4 red = texture(uTexture, vTextureCoord + offset);
    vec4 blue = texture(uTexture, vTextureCoord - offset);

    finalColor = vec4(red.r, base.g, blue.b, base.a);
}
`;

function Us(i) {
    return go(i)
}
async function zb() {
    const i = await Promise.all(Cb.map(async t => {
        const e = await Te.load(Us(t));
        return [t, e]
    }));
    return Object.fromEntries(i)
}

function Th(i, t, e) {
    return Math.min(e, Math.max(t, i))
}

function Vb() {
    const i = ii.from({
        gl: {
            vertex: ic,
            fragment: Hb
        },
        resources: {
            chromaticUniforms: new te({
                uAmount: {
                    value: 0,
                    type: "f32"
                }
            })
        }
    });
    return i.padding = 500, i
}

function Xb(i, t, e) {
    const s = new D,
        r = new Q(i),
        n = new Z;
    r.anchor.set(.5, xb), r.position.set(H / 2, t), r.width = Fi, r.scale.y = r.scale.x;
    const o = r.width,
        a = H / 2 - o / 2;
    n.rect(a, t - 120, o, 140).fill({
        color: 16181195,
        alpha: .08
    });
    const h = new zt({
        strength: 4,
        quality: 2
    });
    return h.padding = 32, n.filters = [h], s.addChild(r, n), s
}

function Yb(i, t) {
    const e = new D,
        s = new Z,
        r = new Z,
        n = new Z,
        o = new Z,
        a = new Z,
        h = new Z,
        l = new Z,
        c = new Z,
        u = new Z;
    r.ellipse(i * .5, -t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It
    }), n.ellipse(i * .5, t + t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It * 1.02
    }), o.ellipse(-i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), a.ellipse(i + i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), h.ellipse(-i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), l.ellipse(i + i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), c.ellipse(-i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    }), u.ellipse(i + i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    });
    const d = new zt({
        strength: 28,
        quality: 4
    });
    d.padding = 200, e.filters = [d], s.ellipse(i * .5, t * .33, i * .17, t * .06).fill({
        color: 15777652,
        alpha: .12
    });
    const f = new zt({
        strength: 28,
        quality: 4
    });
    return f.padding = 200, s.filters = [f], e.addChild(s, r, n, o, a, h, l, c, u), e
}

function Dr(i) {
    const t = new D,
        e = new Z,
        s = new Z,
        r = (n, o) => {
            n.moveTo(-12, -56).lineTo(12, -56).lineTo(12, -14).lineTo(28, -14).lineTo(0, 40).lineTo(-28, -14).lineTo(-12, -14).closePath().fill({
                color: 16777215,
                alpha: o
            })
        };
    return r(e, .22), e.scale.set(1.08), e.y = 4, r(s, 1), t.scale.set(i * 1.1), t.addChild(e, s), t
}

function $b(i) {
    const t = new D,
        e = new Z;
    e.roundRect(0, 0, 88, 88, 18).fill({
        color: 1182986,
        alpha: .72
    }).stroke({
        color: 9398847,
        alpha: .9,
        width: 2
    });
    const s = new D,
        r = new Z;
    if (r.moveTo(22, 34).lineTo(34, 34).lineTo(48, 24).lineTo(48, 64).lineTo(34, 54).lineTo(22, 54).closePath().fill({
            color: 15921128
        }), s.addChild(r), i) {
        const n = new Z;
        n.moveTo(58, 28).lineTo(74, 60).stroke({
            color: 15921128,
            width: 5
        }), n.moveTo(74, 28).lineTo(58, 60).stroke({
            color: 15921128,
            width: 5
        }), s.addChild(n)
    } else {
        const n = new Z;
        n.arc(54, 44, 10, -.9, .9).stroke({
            color: 15921128,
            width: 4
        }), n.arc(54, 44, 18, -.9, .9).stroke({
            color: 15921128,
            width: 4,
            alpha: .9
        }), s.addChild(n)
    }
    return t.addChild(e, s), {
        button: t,
        icon: s
    }
}

function formatWinNumber(i) {
    return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}
function Gs(i) {
    const t = ve();
    return `${i.toLocaleString(t.locale,{minimumFractionDigits:2,maximumFractionDigits:2})} ${t.currencyCode}`
}

function Sh(i) {
    return `x${i.toFixed(1)}`
}
class jb {
    constructor(t, e) {
        E(this, "root", new D);
        E(this, "app");
        E(this, "muteController");
        E(this, "textures", null);
        E(this, "wheelRig", null);
        E(this, "wheelContainer", null);
        E(this, "wheelSpinner", null);
        E(this, "wheelBase", null);
        E(this, "wheelCenter", null);
        E(this, "wheelRim", null);
        E(this, "wheelSpinBlur", null);
        E(this, "wheelChains", []);
        E(this, "wheelDragon", null);
        E(this, "wheelChainSprite", null);
        E(this, "wheelChainSpanOverride", null);
        E(this, "isWheelSpinning", !1);
        E(this, "wheelActive", !1);
        E(this, "torchFlames", []);
        E(this, "throneSprite", null);
        E(this, "state");
        E(this, "buildPulseTime", 0);
        E(this, "buildButtonPressed", !1);
        E(this, "buildButton", null);
        E(this, "buildLabel", null);
        E(this, "guideArrow", null);
        E(this, "guideArrowBaseY", 0);
        E(this, "currentCraneX", 0);
        E(this, "swingTime", 0);
        E(this, "dropX", 0);
        E(this, "fallingBlock", null);
        E(this, "cameraMotion", {
            x: 0,
            y: 0
        });
        E(this, "chromaMotion", {
            amount: 0
        });
        E(this, "rigReleaseMotion", {
            ropeAlpha: 1,
            hookAlpha: 1,
            chalkiAlpha: 1,
            chalkiSpread: 0,
            chalkiDrop: 0,
            chalkiKink: 0
        });
        E(this, "rigReleaseActive", !1);
        E(this, "resultsPanelMotion", {
            x: 0
        });
        E(this, "resultsPanelShown", !1);
        E(this, "towerMotion", {
            y: 0
        });
        E(this, "craneMotion", {
            y: 0
        });
        E(this, "craneContainer", null);
        E(this, "towerContainer", null);
        E(this, "fallingBlockView", null);
        E(this, "resultsGroup", null);
        E(this, "fxLayer", null);
        E(this, "rootTapBound", !1);
        E(this, "pendingLanding", !1);
        E(this, "completionLogged", !1);
        E(this, "sceneBuilt", !1);
        E(this, "shakeLayer", null);
        E(this, "backgroundLayer", null);
        E(this, "atmosphereLayer", null);
        E(this, "logoLayer", null);
        E(this, "craneLayer", null);
        E(this, "pedestalLayer", null);
        E(this, "hudLayer", null);
        E(this, "pedestal", null);
        E(this, "hookSprite", null);
        E(this, "ropeGraphics", null);
        E(this, "chalkiGraphics", null);
        E(this, "hangingBlock", null);
        E(this, "cashOutGroup", null);
        E(this, "cashOutFrame", null);
        E(this, "cashOutGoldFrame", null);
        E(this, "cashOutAmount", null);
        E(this, "bigWinOverlay", null);
        E(this, "bigWinGroup", null);
        E(this, "bigWinFxGroup", null);
        E(this, "bigWinParticleTicker", null);
        E(this, "bigWinArrow", null);
        E(this, "bigWinArrowTicker", null);
        E(this, "isBigWinActive", !1);
        E(this, "vignetteContainer", null);
        E(this, "fogContainer", null);
        E(this, "particleContainer", null);
        E(this, "chromaticAberrationFilter", null);
        E(this, "audioCache", new Map);
        E(this, "bgMusic", null);
        E(this, "registeredTickers", []);
        E(this, "handleRootTap", () => {
            this.triggerBuildAction()
        });
        E(this, "tick", () => {
            const t = this.app.ticker.deltaMS / 1e3;
            if (this.buildPulseTime += t, this.state.phase === "swinging" && (this.swingTime += t, this.state.swingAngle = Math.sin(this.swingTime * this.state.swingSpeed) * Gr, this.currentCraneX = H / 2), this.fallingBlock && (this.fallingBlock.velocityY += pb * t, this.fallingBlock.y += this.fallingBlock.velocityY * t, this.state.phase === "dropping" && !this.pendingLanding)) {
                const e = this.getTargetSurfaceWorldY();
                mh(this.fallingBlock) >= e && (this.fallingBlock.y = gh({
                    textureName: this.fallingBlock.textureName,
                    blockHeight: this.fallingBlock.height,
                    surfaceY: e
                }), this.pendingLanding = !0, this.resolveLanding())
            }(this.state.phase === "swinging" || this.rigReleaseActive) && this.updateChalki(), this.syncDynamicVisuals()
        });
        this.app = t, this.muteController = e.muteController, this.state = {
            phase: "swinging",
            currentBlockIndex: 0,
            towerBlocks: [],
            swingAngle: 0,
            swingSpeed: xh(0),
            multipliers: [],
            cashOut: 0
        }
    }
    async init() {
        this.textures = await zb(), Promise.all([...Pb.map(async t => {
            const e = await Te.load(Us(t));
            this.textures && (this.textures[t] = e)
        }), ...bh.map(async t => {
            const e = await Te.load(Us(t));
            this.textures && (this.textures[t] = e)
        })]).catch(console.error), this.root.eventMode = "static", this.currentCraneX = H / 2, this.resultsPanelMotion.x = this.getResultsPanelTargetX(), this.rootTapBound || (this.root.on("pointertap", this.handleRootTap), this.rootTapBound = !0), this.buildScene(), this.app.ticker.add(this.tick)
    }
    applyEntryPose(t) {
        if (this.entryPose = t, this.entryDropStart = {
                x: t.worldX,
                y: t.worldY
            }, !this.craneContainer || !this.hangingBlock) {
            console.log("[GameplayScene] applyEntryPose deferred", t);
            return
        }
        this.currentCraneX = t.craneX, this.craneMotion.y = t.craneY, this.state.swingAngle = t.rotation, this.swingTime = Math.asin(Math.max(-1, Math.min(1, t.rotation / Gr))) / this.state.swingSpeed, this.craneContainer.position.set(t.craneX, t.craneY), this.craneContainer.rotation = t.rotation, this.hangingBlock.position.set(t.blockX, t.blockY), this.hangingBlock.rotation = 0, this.entryDropStart && (this.entryDropStart = {
            x: t.craneX + t.previewOffsetX,
            y: t.craneY + t.blockY + t.previewOffsetY
        }), this.updateChalki(), console.log("[GameplayScene] applyEntryPose applied", {
            entryPose: t,
            cranePosition: {
                x: this.craneContainer.x,
                y: this.craneContainer.y
            },
            craneRotation: this.craneContainer.rotation,
            blockPosition: {
                x: this.hangingBlock.x,
                y: this.hangingBlock.y
            },
            blockRotation: this.hangingBlock.rotation
        })
    }
    async beginFirstDrop() {
        await this.triggerBuildAction()
    }
    updateMuteState() {
        this.bgMusic && (this.bgMusic.muted = this.muteController.getMuted(), this.bgMusic.volume = this.muteController.getMuted() ? 0 : .18);
        for (const s of this.audioCache.values()) s.muted = this.muteController.getMuted(), this.muteController.getMuted() && (s.volume = 0);
        if (!this.hudLayer) return;
        this.muteButton && (this.hudLayer.removeChild(this.muteButton), this.muteButton.destroy({
            children: !0
        }));
        const {
            button: t,
            icon: e
        } = $b(this.muteController.getMuted());
        t.position.set(H - 120, 72), t.eventMode = "static", t.cursor = "pointer", t.on("pointertap", s => {
            s.stopPropagation(), this.muteController.toggleMuted(), this.updateMuteState()
        }), this.muteButton = t, this.muteIcon = e, this.hudLayer.addChild(t)
    }
    addTicker(t) {
        this.registeredTickers.push(t), this.app.ticker.add(t)
    }
    removeTicker(t) {
        this.app.ticker.remove(t);
        const e = this.registeredTickers.indexOf(t);
        e !== -1 && this.registeredTickers.splice(e, 1)
    }
    destroy() {
        this.app.ticker.remove(this.tick);
        for (const t of this.registeredTickers) this.app.ticker.remove(t);
        this.registeredTickers.length = 0, this.stopBigWinAmbientParticles(), this.bigWinArrowTicker && (this.app.ticker.remove(this.bigWinArrowTicker), this.bigWinArrowTicker = null), this.rootTapBound && (this.root.off("pointertap", this.handleRootTap), this.rootTapBound = !1), this.fogContainer && (this.fogContainer.removeFromParent(), this.fogContainer = null), this.particleContainer && (this.particleContainer.removeFromParent(), this.particleContainer = null), this.root.destroy({
            children: !0
        })
    }
    setFog(t) {
        this.fogContainer = t, this.syncAtmosphere()
    }
    setParticles(t) {
        this.particleContainer = t, this.syncAtmosphere()
    }
    syncAtmosphere() {
        this.atmosphereLayer && (this.fogContainer && (this.fogContainer.visible = !1), this.particleContainer && (this.particleContainer.visible = !1), this.vignetteContainer && (this.vignetteContainer.visible = !1), this.atmosphereLayer.removeChildren(), this.fogContainer && (this.fogContainer.visible = !0, this.atmosphereLayer.addChild(this.fogContainer)), this.particleContainer && (this.particleContainer.visible = !0, this.atmosphereLayer.addChild(this.particleContainer)), this.vignetteContainer && (this.vignetteContainer.visible = !0, this.atmosphereLayer.addChild(this.vignetteContainer)))
    }
    resize(t, e) {
        const s = Math.min(t / H, e / J),
            r = t / s,
            n = e / s,
            o = (H - r) / 2,
            a = (J - n) / 2;
        if (console.log(`[GameplayScene] Resize: ${t}x${e}, local: ${r.toFixed(0)}x${n.toFixed(0)}, scale: ${s.toFixed(3)}`), this.backgroundLayer) {
            const h = this.backgroundLayer.children[0];
            h && h.texture && (h.scale.set(2.1), h.position.set(H / 2, J / 2))
        }
        if (this.vignetteContainer) {
            const h = 1 / s;
            this.vignetteContainer.scale.set(h), this.vignetteContainer.position.set(o, a)
        }
        if (this.pedestalLayer && this.pedestal) {
            const h = this.pedestal.children[0],
                l = this.pedestal.children[1];
            if (h && (h.width = Math.max(Fi, r), h.scale.y = h.scale.x, l)) {
                const c = h.width,
                    u = H / 2 - c / 2,
                    d = $s({
                        width: H,
                        height: J
                    }).pedestal.topY;
                l.clear(), l.rect(u, d - 120, c, 140).fill({
                    color: 16181195,
                    alpha: .08
                })
            }
        }
        this.chromaticAberrationFilter && (this.chromaticAberrationFilter.resources.chromaticUniforms.uniforms.uAmount = this.chromaMotion.amount), this.bigWinOverlay && (this.bigWinOverlay.clear(), this.bigWinOverlay.rect(o, a, r, n).fill({
            color: 0
        }))
    }
    buildScene() {
        if (!this.textures || this.sceneBuilt) return;
        console.log("[GameplayScene] Building scene...");
        const t = $s({
            width: H,
            height: J
        });
        this.chromaticAberrationFilter = Vb(), this.root.filters = [this.chromaticAberrationFilter], this.backgroundLayer = new D;
        const e = new Q(this.textures["bg main new.webp"]);
        e.anchor.set(.5, .5), e.scale.set(2.1), e.position.set(H / 2, J / 2), this.backgroundLayer.filters = [new zt({
            strength: Zu,
            quality: 4,
            kernelSize: 9,
            padding: 64
        })], this.backgroundLayer.addChild(e), this.atmosphereLayer = new D, this.vignetteContainer = Yb(H, J), this.atmosphereLayer.addChild(this.vignetteContainer), this.logoLayer = new D;
        const s = new Q(this.textures["log twr.webp"]);
        s.anchor.set(.5, 0);
        const r = t.logo.width / s.texture.width * 1.17;
        s.position.set(H / 2, J * .02), s.scale.set(r), s.alpha = .97;
        const n = new Q(this.textures["log twr.webp"]);
        n.anchor.set(.5, 0), n.position.set(H / 2 + 5, J * .02 + 7), n.scale.set(r), n.tint = 1116936, n.alpha = .28, this.logoLayer.addChild(n, s), this.towerContainer = new D, this.pedestalLayer = new D, this.pedestal = Xb(this.textures["platform wide.webp"], t.pedestal.topY), this.pedestalLayer.addChild(this.pedestal), this.craneLayer = new D, this.craneContainer = new D, this.craneLayer.addChild(this.craneContainer);
        const o = this.textures["kruk.webp"];
        this.hookSprite = new Q(o), this.hookSprite.anchor.set(.5, 0), this.hookSprite.x = 0, this.hookSprite.y = J * .22 - 5;
        const a = H * .07 / o.width;
        this.hookSprite.scale.set(a), this.ropeGraphics = new Z, this.ropeGraphics.moveTo(0, -J * 2), this.ropeGraphics.lineTo(0, this.hookSprite.y + this.hookSprite.height * .4), this.ropeGraphics.stroke({
            width: 2.5,
            color: 4473924
        }), this.chalkiGraphics = new Z, this.chalkiGraphics.stroke({
            width: 2.5,
            color: 8947848
        }), this.craneContainer.addChild(this.ropeGraphics, this.hookSprite, this.chalkiGraphics), this.spawnHangingBlock(), this.hudLayer = new D;
        const h = t.hud.buttonHeight,
            l = t.hud.gap,
            c = t.hud.buttonY;
        this.cashOutGroup = new D;
        const u = new Q(this.textures["but cash out.webp"]);
        u.anchor.set(.5), u.height = h * 1.04, u.scale.x = u.scale.y, this.cashOutFrame = u;
        const d = new Q(this.textures["but cash out gold.webp"]);
        d.anchor.set(.5), d.height = h * 1.04, d.scale.x = d.scale.y, d.alpha = 0, this.cashOutGoldFrame = d;
        const f = new Ot({
            text: "CASH OUT",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(h * .15),
                fontWeight: "700",
                fill: "#d7d5d3",
                letterSpacing: .7
            }
        });
        f.anchor.set(.5), f.y = -u.height * .05, this.cashOutAmount = new Ot({
            text: Gs(this.state.cashOut),
            style: {
                fontFamily: Rt,
                fontSize: Math.round(h * .1),
                fontWeight: "700",
                fill: "#d1cbc4",
                letterSpacing: .25
            }
        }), this.cashOutAmount.anchor.set(.5), this.cashOutAmount.y = u.height * .08, this.cashOutGroup.addChild(u, d, f, this.cashOutAmount), this.cashOutGroup.eventMode = "static", this.cashOutGroup.cursor = "pointer", this.cashOutGroup.on("pointertap", v => {
            v.stopPropagation(), this.isBigWinActive && this.dismissBigWinEffects()
        });
        const p = new D,
            m = new Q(this.textures["but build.webp"]);
        m.anchor.set(.5), m.height = h, m.scale.x = m.scale.y;
        const g = new Ot({
            text: "BUILD",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(h * .35),
                fontWeight: "700",
                fill: "#f2efe8",
                letterSpacing: 1.5,
                dropShadow: {
                    color: 3276800,
                    alpha: .62,
                    blur: 3,
                    distance: 2,
                    angle: Math.PI / 2
                }
            }
        });
        g.anchor.set(.5), this.buildLabel = g, p.addChild(m, g);
        const _ = u.width + l + m.width,
            x = (H - _) / 2;
        this.cashOutGroup.position.set(x + u.width / 2 + t.hud.cashOutCenterOffsetX, c), p.position.set(x + u.width + l + m.width / 2, c), p.eventMode = "static", p.cursor = "pointer", p.on("pointerdown", () => {
            this.buildButtonPressed = !0
        }), p.on("pointerup", () => {
            this.buildButtonPressed = !1
        }), p.on("pointerupoutside", () => {
            this.buildButtonPressed = !1
        }), p.on("pointerout", () => {
            this.buildButtonPressed = !1
        }), p.on("pointertap", v => {
            v.stopPropagation(), this.wheelActive ? (this.playSound("Load Game Button 3.mp3", .35), this.triggerSpin()) : this.state.phase === "swinging" && (this.playSound("1_click.mp3", .4), this.triggerBuildAction())
        });
        const b = Dr(t.guideArrow.scale);
        b.position.set(t.guideArrow.x, t.guideArrow.y + J * Wb), this.guideArrowBaseY = b.y, this.resultsGroup = new D, this.resultsGroup.alpha = 0;
        const y = new Q(this.textures["box results.webp"]);
        y.anchor.set(.5, 0), y.width = H * .23 * 1.2 * 1.2, y.scale.y = y.scale.x, this.resultsGroup.position.set(this.resultsPanelMotion.x, J * gb + 30), this.resultsGroup.addChild(y);
        const S = new Ot({
            text: "RESULTS",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(y.height * .09),
                fontWeight: "600",
                fill: "#efe4c4",
                letterSpacing: 1
            }
        });
        S.anchor.set(.5, 0), S.position.set(0, y.height * .09), this.resultsGroup.addChild(S), this.hudLayer.addChild(p, b, this.resultsGroup, this.cashOutGroup), this.updateMuteState(), this.cashOutGroup.hitArea = new nt(-this.cashOutFrame.width / 2, -this.cashOutFrame.height / 2, this.cashOutFrame.width, this.cashOutFrame.height), this.fxLayer = new D, this.shakeLayer = new D, this.shakeLayer.addChild(this.backgroundLayer, this.atmosphereLayer, this.pedestalLayer, this.towerContainer, this.craneLayer, this.hudLayer, this.fxLayer, this.logoLayer), this.root.addChild(this.shakeLayer), this.buildButton = p, this.guideArrow = b, this.sceneBuilt = !0, this.updateScene(), this.syncDynamicVisuals()
    }
    updateScene() {
        this.guideArrow && (this.guideArrow.visible = this.state.phase === "swinging"), this.buildButton && (this.buildButton.alpha = this.state.phase === "complete" ? .62 : 1), this.cashOutAmount && (this.cashOutAmount.text = Gs(this.state.cashOut)), this.updateResults()
    }
    updateChalki() {
        if (!this.chalkiGraphics || !this.hookSprite || !this.hangingBlock) return;
        this.chalkiGraphics.clear();
        const t = this.getCurrentBlockAssetName(),
            e = ai(t),
            {
                width: s,
                height: r
            } = this.getBlockDimensions(t, this.getCurrentBlockWidth()),
            n = this.hookSprite.y + this.hookSprite.height * .801 + 5,
            o = (e.leftRigAttach - .5) * s - this.rigReleaseMotion.chalkiSpread,
            a = (e.rightRigAttach - .5) * s + this.rigReleaseMotion.chalkiSpread,
            h = this.hangingBlock.y - r / 2 + e.rigAttachY * r + this.rigReleaseMotion.chalkiDrop,
            l = o * .46 - this.rigReleaseMotion.chalkiKink,
            c = a * .46 + this.rigReleaseMotion.chalkiKink,
            u = n + (h - n) * .42 + this.rigReleaseMotion.chalkiDrop * .18,
            d = o * .76 - this.rigReleaseMotion.chalkiKink * .35,
            f = a * .76 + this.rigReleaseMotion.chalkiKink * .35,
            p = n + (h - n) * .76 + this.rigReleaseMotion.chalkiDrop * .08;
        this.chalkiGraphics.moveTo(0, n), this.chalkiGraphics.lineTo(l, u), this.chalkiGraphics.lineTo(d, p), this.chalkiGraphics.lineTo(o, h), this.chalkiGraphics.moveTo(0, n), this.chalkiGraphics.lineTo(c, u), this.chalkiGraphics.lineTo(f, p), this.chalkiGraphics.lineTo(a, h), this.chalkiGraphics.stroke({
            width: 2.5,
            color: 8947848
        })
    }
    updateResults() {
        if (!this.resultsGroup) return;
        for (; this.resultsGroup.children.length > 1;) this.resultsGroup.removeChildAt(1);
        const t = this.resultsGroup.children[0];
        t && this.state.multipliers.forEach((e, s) => {
            const r = new Ot({
                text: Sh(e),
                style: {
                    fontFamily: Rt,
                    fontSize: Math.round(t.height * .08),
                    fontWeight: "600",
                    fill: "#f1d79c"
                }
            });
            r.anchor.set(.5, 0), r.position.set(0, t.height * (.23 + s * .12)), this.resultsGroup.addChild(r)
        })
    }
    syncDynamicVisuals() {
        var t;
        if (this.shakeLayer && this.shakeLayer.position.set(this.cameraMotion.x, this.cameraMotion.y), this.craneContainer && (this.craneContainer.position.set(this.currentCraneX, this.craneMotion.y), this.craneContainer.rotation = this.state.phase === "swinging" || this.state.phase === "dropping" ? this.state.swingAngle * mb : 0), this.towerContainer && (this.towerContainer.y = this.towerMotion.y), this.pedestalLayer && (this.pedestalLayer.y = this.towerMotion.y), this.fallingBlockView && this.fallingBlock && this.fallingBlockView.position.set(this.fallingBlock.x, this.fallingBlock.y), this.resultsGroup && (this.resultsGroup.x = this.resultsPanelMotion.x), this.chromaticAberrationFilter && (this.chromaticAberrationFilter.resources.chromaticUniforms.uniforms.uAmount = this.chromaMotion.amount), this.ropeGraphics && (this.ropeGraphics.alpha = this.rigReleaseMotion.ropeAlpha), this.hookSprite && (this.hookSprite.alpha = this.rigReleaseMotion.hookAlpha), this.chalkiGraphics && (this.chalkiGraphics.alpha = this.rigReleaseMotion.chalkiAlpha), this.buildButton) {
            const s = this.state.phase === "swinging" ? 1 + Math.sin(this.buildPulseTime * 3.4) * .018 : 1,
                r = this.buildButtonPressed ? .965 : 1;
            this.buildButton.scale.set(s * r)
        }
        this.wheelRig && ((t = this.wheelChainSprite) != null && t.visible) && (this.wheelRig.rotation = Math.sin(this.buildPulseTime * 1.45) * vh), this.guideArrow && ((this.state.phase === "swinging" || this.state.phase === "dropping") && (this.guideArrow.y = this.guideArrowBaseY + Math.sin(this.buildPulseTime * 5.2) * 8, this.guideArrow.alpha = .84 + (Math.sin(this.buildPulseTime * 5.2) + 1) * .08), this.wheelActive && !this.isWheelSpinning && (this.guideArrow.alpha = .5 + Math.sin(performance.now() * .006) * .5, this.guideArrow.visible = !0));
        for (const e of this.torchFlames) e.alpha = .8 + Math.sin(performance.now() * .01 + Math.random()) * .2, e.scale.y = .9 + Math.random() * .2
    }
    createCurrentCraneBlockDisplay(t) {
        const e = this.getCurrentBlockWidth(),
            {
                width: s,
                height: r
            } = this.getBlockDimensions(this.getCurrentBlockAssetName(), e),
            n = this.getSuspendedBlockCenterY(r, t),
            o = Fr[this.state.currentBlockIndex] ?? Fr[Fr.length - 1];
        return this.state.currentBlockIndex > 0 && console.log("[GameplayScene] hangingBlockY", {
            blockIndex: this.state.currentBlockIndex + 1,
            baseY: n,
            extraHangY: o,
            finalY: n + o
        }), this.createBlockDisplay({
            textureName: this.getCurrentBlockAssetName(),
            x: 0,
            y: n + o,
            width: s,
            height: r,
            rotation: 0
        }, !1)
    }
    createPlacedBlockDisplay(t) {
        return this.createBlockDisplay(t, !1)
    }
    createFallingBlockDisplay(t) {
        return this.createBlockDisplay({
            textureName: t.textureName,
            x: t.x,
            y: t.y,
            width: t.width,
            height: t.height,
            rotation: 0
        }, !0)
    }
    getCurrentBlockWidth() {
        return H * .58 * 1.3
    }
    getHookPointY() {
        return this.hookSprite ? this.hookSprite.y + this.hookSprite.height * .801 + 5 : J * .22
    }
    getSuspendedBlockCenterY(t, e = this.getHookPointY()) {
        return e + J * .12 - Tb + t / 2
    }
    getSuspendedBlockWorldCenter(t) {
        const e = this.hangingBlock?.x ?? 0,
            s = this.hangingBlock?.y ?? this.getSuspendedBlockCenterY(t),
            r = this.state.swingAngle * mb;
        return resolveDropStartFromSwingPose({
            craneX: this.currentCraneX,
            craneY: this.craneMotion.y,
            rotation: r,
            blockX: e,
            blockY: s
        })
    }
    setSuspendedRigVisible(t) {
        this.hookSprite && (this.hookSprite.visible = t), this.ropeGraphics && (this.ropeGraphics.visible = t), this.chalkiGraphics && (this.chalkiGraphics.visible = t), this.hangingBlock && (this.hangingBlock.visible = t)
    }
    resetRigReleaseMotion() {
        this.rigReleaseMotion.ropeAlpha = 1, this.rigReleaseMotion.hookAlpha = 1, this.rigReleaseMotion.chalkiAlpha = 1, this.rigReleaseMotion.chalkiSpread = 0, this.rigReleaseMotion.chalkiDrop = 0, this.rigReleaseMotion.chalkiKink = 0, this.rigReleaseActive = !1
    }
    startRigReleaseAnimation() {
        !this.ropeGraphics || !this.hookSprite || !this.chalkiGraphics || (this.ropeGraphics.visible = !0, this.hookSprite.visible = !0, this.chalkiGraphics.visible = !0, this.resetRigReleaseMotion(), this.rigReleaseActive = !0, st(this.app, this.rigReleaseMotion, {
            ropeAlpha: .94,
            hookAlpha: .96,
            chalkiAlpha: 1,
            chalkiSpread: H * .062,
            chalkiDrop: J * .05,
            chalkiKink: H * .034
        }, vb, kt).then(() => st(this.app, this.rigReleaseMotion, {
            ropeAlpha: 0,
            hookAlpha: 0,
            chalkiAlpha: 0,
            chalkiSpread: H * .082,
            chalkiDrop: J * .07,
            chalkiKink: H * .05
        }, wb, Mt)).then(() => {
            this.ropeGraphics && (this.ropeGraphics.visible = !1), this.hookSprite && (this.hookSprite.visible = !1), this.chalkiGraphics && (this.chalkiGraphics.visible = !1), this.resetRigReleaseMotion()
        }))
    }
    clearFallingBlockView() {
        var t;
        this.fallingBlockView && ((t = this.craneLayer) == null || t.removeChild(this.fallingBlockView), this.fallingBlockView.destroy({
            children: !0
        }), this.fallingBlockView = null)
    }
    spawnHangingBlock() {
        if (!this.craneContainer || !this.hookSprite) return;
        this.hangingBlock && (this.craneContainer.removeChild(this.hangingBlock), this.hangingBlock.destroy({
            children: !0
        }), this.hangingBlock = null), this.hangingBlock = this.createCurrentCraneBlockDisplay(this.getHookPointY());
        let t = this.hangingBlock.y;
        this.entryPose && this.state.currentBlockIndex === 0 && (this.hangingBlock.position.set(this.entryPose.blockX, this.entryPose.blockY), this.hangingBlock.rotation = 0, this.currentCraneX = this.entryPose.craneX, this.craneMotion.y = this.entryPose.craneY, this.state.swingAngle = this.entryPose.rotation, this.swingTime = Math.asin(Math.max(-1, Math.min(1, this.entryPose.rotation / Gr))) / this.state.swingSpeed, t = this.entryPose.blockY), this.hangingBlock.y = t - 220, this.hangingBlock.alpha = 0, this.hangingBlock.visible = !0, this.craneContainer.addChild(this.hangingBlock), st(this.app, this.hangingBlock, {
            y: t,
            alpha: 1
        }, .42, kt), this.resetRigReleaseMotion(), this.setSuspendedRigVisible(!0), this.updateChalki()
    }
    createBlockDisplay(t, e) {
        var o;
        const s = new D;
        s.position.set(t.x, t.y), s.rotation = t.rotation;
        const r = (o = this.textures) == null ? void 0 : o[t.textureName];
        if (!r) return s;
        if (e) {
            const a = new Q(r);
            a.anchor.set(.5), a.width = t.width, a.height = t.height, a.tint = 0, a.alpha = .38, a.position.set(0, 10);
            const h = new zt({
                strength: 4,
                quality: 2
            });
            h.padding = 24, a.filters = [h], s.addChild(a)
        }
        const n = new Q(r);
        return n.anchor.set(.5), n.width = t.width, n.height = t.height, this.state.currentBlockIndex < 3 && console.log(`[BlockDebug] Rendering block ${t.textureName} at ${t.x.toFixed(0)},${t.y.toFixed(0)}`), s.addChild(n), s
    }
    async triggerBuildAction() {
        if (this.state.phase !== "swinging" || this.fallingBlock) return;
        const t = this.getCurrentBlockAssetName(),
            {
                width: e,
                height: s
            } = this.getBlockDimensions(t, this.getCurrentBlockWidth());
        let r;
        if (this.hangingBlock && this.hangingBlock.parent) {
            const worldPos = this.hangingBlock.parent.toGlobal(this.hangingBlock.position);
            console.log("[DEBUG] toGlobal hangingBlock:", {
                localX: this.hangingBlock.x,
                localY: this.hangingBlock.y,
                parentX: this.hangingBlock.parent.x,
                parentY: this.hangingBlock.parent.y,
                parentRotation: this.hangingBlock.parent.rotation,
                worldX: worldPos.x,
                worldY: worldPos.y
            });
            r = { x: worldPos.x, y: worldPos.y };
        } else {
            r = this.getSuspendedBlockWorldCenter(s);
            console.log("[DEBUG] fallback formula:", r);
        }
        this.entryDropStart = null, console.log("[GameplayScene] triggerBuildAction dropStart", {
            textureName: t,
            stateSwingAngle: this.state.swingAngle,
            currentCraneX: this.currentCraneX,
            craneY: this.craneMotion.y,
            hangingBlockLocal: this.hangingBlock ? {
                x: this.hangingBlock.x,
                y: this.hangingBlock.y,
                rotation: this.hangingBlock.rotation
            } : null,
            suspendedBlockWorldCenter: r
        }), this.startBgMusic(), this.playSound("sfx_Whoosh_11.mp3", .3), this.dropX = r.x, this.state.phase = "dropping", this.fallingBlock = {
            textureName: t,
            x: this.dropX,
            y: r.y,
            width: e,
            height: s,
            velocityY: 0
        }, this.buildButtonPressed = !1, this.fallingBlockView = this.createFallingBlockDisplay(this.fallingBlock), this.craneLayer && this.craneLayer.addChild(this.fallingBlockView), this.hangingBlock && (this.hangingBlock.visible = !1), this.startRigReleaseAnimation(), st(this.app, this.craneMotion, {
            y: Or
        }, .3, kt), this.updateScene()
    }
    getTargetSurfaceWorldY() {
        return this.towerMotion.y + this.getTargetSurfaceLocalY()
    }
    getTargetSurfaceLocalY() {
        if (this.state.towerBlocks.length === 0) return $s({
            width: H,
            height: J
        }).pedestal.topY;
        const t = this.state.towerBlocks[this.state.towerBlocks.length - 1];
        return rb(t)
    }
    getTargetHorizontalBounds() {
        if (this.state.towerBlocks.length === 0) return {
            left: H * .21,
            right: H * .79
        };
        const t = this.state.towerBlocks[this.state.towerBlocks.length - 1];
        return {
            left: t.x - t.width / 2,
            right: t.x + t.width / 2
        }
    }
    async resolveLanding() {
        if (!this.fallingBlock) return;
        this.state.phase = "landing";
        const t = this.getTargetHorizontalBounds(),
            e = this.getCurrentBlockWidth(),
            s = ob({
                dropX: this.dropX,
                blockWidth: e,
                targetLeft: t.left,
                targetRight: t.right
            }),
            r = this.getTargetSurfaceLocalY(),
            n = this.getCurrentBlockAssetName(),
            o = this.fallingBlock.height,
            a = this.fallingBlock.width,
            h = gh({
                textureName: n,
                blockHeight: o,
                surfaceY: r
            }),
            l = this.towerMotion.y + h;
        if (s.kind !== "miss") {
            const c = {
                textureName: n,
                x: s.placedCenterX,
                y: h,
                width: a,
                height: o,
                rotation: 0
            };
            if (this.state.towerBlocks.push(c), this.towerContainer) {
                const u = this.createPlacedBlockDisplay(c);
                this.towerContainer.addChild(u)
            }
            this.fallingBlock = null, this.clearFallingBlockView(), this.updateScene(), await Promise.all([this.playLandingEffects(s.placedCenterX, mh({
                textureName: n,
                y: l,
                height: o
            })), this.playLandingImpact()])
        } else await st(this.app, this.fallingBlock, {
            y: J + this.fallingBlock.height
        }, .5, kt), this.fallingBlock = null, this.clearFallingBlockView(), this.updateScene(), await Promise.all([this.playLandingEffects(H / 2, this.getTargetSurfaceWorldY()), this.playLandingImpact()]);
        if (this.state.currentBlockIndex < rs.length - 1 && (this.state.multipliers.push(s.multiplier), this.state.cashOut = _h(yh, this.state.multipliers)), await this.showResultsPanelIfNeeded(), this.updateScene(), this.state.phase = "celebrating", this.state.currentBlockIndex < rs.length - 1 && await this.playMultiplierAnnouncement(Sh(s.multiplier)), this.state.currentBlockIndex === rs.length - 1) {
            this.state.phase = "complete", this.craneMotion.y = Or, this.updateScene(), this.completionLogged = !0, this.pendingLanding = !1, await be(this.app, .5), await this.showWheel();
            return
        }
        if (this.state.phase = "nextBlock", s.kind !== "miss") {
            const c = this.state.towerBlocks[this.state.towerBlocks.length - 1],
                u = nb(c.textureName, c.height) * Sb;
            await st(this.app, this.towerMotion, {
                y: this.towerMotion.y + u
            }, .5, Mt)
        }
        this.state.currentBlockIndex += 1, this.state.swingSpeed = xh(this.state.currentBlockIndex), this.state.swingAngle = 0, this.swingTime = 0, this.currentCraneX = H / 2, this.craneMotion.y = Or, st(this.app, this.craneMotion, {
            y: 0
        }, .4, kt), this.state.phase = "swinging", this.pendingLanding = !1, this.spawnHangingBlock(), this.updateScene()
    }
    async showResultsPanelIfNeeded() {
        this.resultsPanelShown || !this.resultsGroup || (this.resultsPanelShown = !0, await st(this.app, this.resultsGroup, {
            alpha: 1
        }, .4, kt))
    }
    async playMultiplierAnnouncement(t) {
        if (!this.fxLayer) return;
        this.playSound("dota2-coins.mp3", .35);
        const e = new Ot({
            text: t,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(J * .08),
                fontWeight: "700",
                fill: "#fff5d9",
                dropShadow: {
                    color: 3348224,
                    alpha: .8,
                    blur: 8,
                    distance: 4,
                    angle: Math.PI / 2
                }
            }
        });
        e.anchor.set(.5), e.position.set(H / 2, J * yb), e.scale.set(.2), e.alpha = 0, this.fxLayer.addChild(e), await Promise.all([st(this.app, e, {
            alpha: 1
        }, .2, kt), st(this.app, e.scale, {
            x: 1.2,
            y: 1.2
        }, .35, kt)]), await Promise.all([st(this.app, e.scale, {
            x: 1,
            y: 1
        }, .15, Mt), be(this.app, .8)]), await st(this.app, e, {
            alpha: 0
        }, .3, Mt), e.destroy()
    }
    async playLandingEffects(t, e) {
        if (!this.fxLayer) return;
        const s = [],
            r = this.getDustTexture();
        for (let o = 0; o < 6; o++) {
            const a = new Q(r);
            a.anchor.set(.5);
            const h = o < 3 ? -1 : 1;
            a.position.set(t + h * (10 + Math.random() * 20), e - 5), a.scale.set(.3 + Math.random() * .2, .25 + Math.random() * .15), a.alpha = .55 + Math.random() * .2, a.tint = 13154456, this.fxLayer.addChild(a);
            const l = h * (Fi * (.12 + Math.random() * .14)),
                c = -(8 + Math.random() * 18),
                u = .5 + Math.random() * .25;
            s.push(Promise.all([st(this.app, a, {
                x: t + l,
                y: e + c
            }, u, kt), st(this.app, a.scale, {
                x: a.scale.x * 2.8,
                y: a.scale.y * 1.6
            }, u, kt), st(this.app, a, {
                alpha: 0
            }, u * .9, Mt)]).then(() => {
                a.destroyed || a.destroy()
            }))
        }
        const n = this.getSparkTexture();
        for (let o = 0; o < 5; o++) {
            const a = new Q(n);
            a.anchor.set(.5), a.position.set(t + (Math.random() - .5) * 40, e - 4), a.scale.set(.25 + Math.random() * .2), a.alpha = .8, a.tint = 15784096, this.fxLayer.addChild(a);
            const h = (Math.random() - .5) * Fi * .2,
                l = -(J * .03 + Math.random() * J * .04);
            s.push(Promise.all([st(this.app, a, {
                x: t + h,
                y: e + l
            }, .4, kt), st(this.app, a, {
                alpha: 0
            }, .4, Mt)]).then(() => {
                a.destroyed || a.destroy()
            }))
        }
        await Promise.all(s)
    }
    getDustTexture() {
        const t = new Z;
        return t.ellipse(0, 0, 40, 20).fill({
            color: 16777215
        }), this.app.renderer.generateTexture({
            target: t,
            resolution: 1
        })
    }
    async playLandingImpact() {
        this.playSound("sfx_Boom_03.mp3", .4), this.playSound("Slide Box High 05.mp3", .45), await Promise.all([this.shakeCamera(), this.pulseChromaticAberration()])
    }
    async shakeCamera() {
        const t = Math.min(H * .028, 18);
        for (let e = 0; e < 10; e++) {
            const s = 1 - e / 10;
            this.cameraMotion.x = (Math.random() - .5) * t * s, this.cameraMotion.y = (Math.random() - .5) * t * .8 * s, await be(this.app, .022)
        }
        this.cameraMotion.x = 0, this.cameraMotion.y = 0
    }
    async pulseChromaticAberration() {
        await st(this.app, this.chromaMotion, {
            amount: bb
        }, .05, kt), await st(this.app, this.chromaMotion, {
            amount: 0
        }, .16, Mt)
    }
    getSparkTexture() {
        const t = new Z;
        return t.circle(0, 0, 5).fill({
            color: 16777215
        }), this.app.renderer.generateTexture({
            target: t,
            resolution: 1
        })
    }
    getBlockDimensions(t, e) {
        var n;
        const s = (n = this.textures) == null ? void 0 : n[t];
        if (!s) return {
            width: e,
            height: e
        };
        const r = e / s.width;
        return {
            width: e,
            height: s.height * r
        }
    }
    getCurrentBlockAssetName() {
        return rs[this.state.currentBlockIndex] ?? rs[rs.length - 1]
    }
    getResultsPanelTargetX() {
        if (!this.textures) return H;
        const e = H * .23;
        return H - e * .45
    }
    getResultsPanelOffscreenX() {
        if (!this.textures) return H + _b;
        const e = H * .23;
        return H + e
    }
    updateCashOut() {
        this.cashOutAmount && (this.cashOutAmount.text = Gs(this.state.cashOut))
    }
    setCashOutGoldProgress(t) {
        const e = Th(t, 0, 1);
        this.cashOutGoldFrame && (this.cashOutGoldFrame.alpha = e), this.cashOutFrame && (this.cashOutFrame.alpha = 1 - e * .8)
    }
    setWheelChainVisibleSpan(t) {
        if (!this.wheelChainSprite) return;
        const e = J * 2,
            s = t + e,
            r = Lr.bottom - Lr.top,
            n = s * (this.wheelChainSprite.texture.height / r);
        this.wheelChainSprite.height = n, this.wheelChainSprite.y = -(Lr.top / this.wheelChainSprite.texture.height) * n - e
    }
    getWheelTargetY() {
        return J * Fb
    }
    updateWheelRigLayout() {
        var r, n, o;
        if (!this.wheelRig || !this.wheelChainSprite || !this.wheelRim) return;
        const t = this.getWheelVisualRadius();
        this.wheelRig.x = H / 2, this.wheelChainSprite.width = this.wheelRim.width * Gb;
        const e = (r = this.wheelContainer) != null && r.visible ? this.wheelContainer.y : ((o = (n = this.bigWinGroup) == null ? void 0 : n.children[0]) == null ? void 0 : o.y) ?? this.getWheelTargetY(),
            s = this.wheelChainSpanOverride ?? Math.max(e - t * .98, J * .18);
        this.setWheelChainVisibleSpan(s)
    }
    createWheelLabels(t, e) {
        const s = Math.PI * 2 / ns.length,
            r = e * .565;
        ns.forEach((n, o) => {
            const a = -Math.PI / 2 + s * o;
            if (n.name === "dragon" && this.textures) {
                const u = new Q(this.textures["wheel/dragon.webp"]);
                u.anchor.set(.5), u.position.set(Math.cos(a) * e * .61, Math.sin(a) * e * .61);
                const d = e * .44 / u.texture.width;
                u.scale.set(d);
                let f = a + Math.PI / 2;
                f > Math.PI / 2 && (f -= Math.PI), f < -Math.PI / 2 && (f += Math.PI), u.rotation = f, u.tint = 1314059, u.alpha = .82, t.addChild(u), this.wheelDragon = u;
                return
            }
            const h = Number.isInteger(n.multiplier) ? n.multiplier.toFixed(0) : n.multiplier.toFixed(1),
                l = new Ot({
                    text: `x${h}`,
                    style: {
                        fontFamily: Rt,
                        fontSize: Math.round(H * .05),
                        fontWeight: "700",
                        fill: "#f7f1e6",
                        dropShadow: {
                            color: 1839627,
                            alpha: .85,
                            blur: 6,
                            distance: 2,
                            angle: Math.PI / 2
                        }
                    }
                });
            l.anchor.set(.5), l.position.set(Math.cos(a) * r, Math.sin(a) * r);
            let c = a + Math.PI / 2;
            c > Math.PI / 2 && (c -= Math.PI), c < -Math.PI / 2 && (c += Math.PI), l.rotation = c, t.addChild(l)
        })
    }
    getWheelVisualRadius() {
        return this.wheelBase ? this.wheelBase.width * ((os.right - os.left) / this.wheelBase.texture.width) / 2 : 0
    }
    buildWheel() {
        const t = new D;
        if (!this.textures) return t;
        this.wheelSpinner = new D;
        const e = new D;
        this.wheelSpinBlur = new zt({
            strength: 0,
            quality: 4
        }), this.wheelSpinBlur.padding = 512, e.filters = [this.wheelSpinBlur], e.filterArea = new nt(-1e3, -1e3, 2e3, 2e3), this.wheelBase = new Q(this.textures["wheel/osnova wheel.webp"]), this.wheelBase.anchor.set(.5, .5);
        const s = H * Ib / this.wheelBase.texture.width,
            r = ((os.left + os.right) / 2 - this.wheelBase.texture.width / 2) * s,
            n = ((os.top + os.bottom) / 2 - this.wheelBase.texture.height / 2) * s;
        this.wheelBase.scale.set(s), this.wheelBase.position.set(-r, -n), e.addChild(this.wheelBase), this.createWheelLabels(e, this.getWheelVisualRadius()), this.wheelCenter = new Q(this.textures["wheel/centr wheel.webp"]), this.wheelCenter.anchor.set(.5, .5);
        const o = this.getWheelVisualRadius() * .72 / this.wheelCenter.texture.width;
        return this.wheelCenter.scale.set(o), this.wheelSpinner.addChild(e), t.addChild(this.wheelCenter), this.wheelRim = new Q(this.textures["wheel/obod top.webp"]), this.wheelRim.anchor.set(.5, .5), this.wheelRim.scale.set(s), this.wheelRim.position.set(-r, -n), t.addChild(this.wheelSpinner, this.wheelRim), t
    }
    getWheelRigOffscreenY() {
        return -(this.getWheelTargetY() + this.getWheelVisualRadius() + 60)
    }
    async showWheel() {
        if (this.wheelRig || (this.wheelRig = new D, this.fxLayer.addChild(this.wheelRig)), !this.wheelContainer) {
            const t = new Q(this.textures["wheel/cepochka.webp"]);
            t.anchor.set(.5, 0), this.wheelChainSprite = t, this.wheelRig.addChild(t), this.wheelContainer = this.buildWheel(), this.wheelRig.addChild(this.wheelContainer)
        }
        this.wheelChainSpanOverride = null, this.wheelRig.visible = !0, this.wheelChainSprite.visible = !0, this.wheelContainer.visible = !0, this.wheelSpinner && (this.wheelSpinner.rotation = Lb), this.setWheelSpinBlur(0), this.wheelActive = !0, this.buildLabel && (this.buildLabel.text = "SPIN"), this.wheelContainer.y = this.getWheelTargetY(), this.updateWheelRigLayout(), this.wheelRig.position.set(H / 2, this.getWheelRigOffscreenY()), this.wheelRig.rotation = -vh * .45, await st(this.app, this.wheelRig, {
            y: 0
        }, .55, Ir)
    }
    async hideWheel() {
        this.wheelRig && (await st(this.app, this.wheelRig, {
            y: this.getWheelRigOffscreenY()
        }, .4, Br), this.wheelContainer && (this.wheelContainer.visible = !1), this.wheelActive = !1, this.wheelSpinBlur && (this.wheelSpinBlur.strength = 0))
    }
    stopBigWinAmbientParticles() {
        this.bigWinParticleTicker && (this.removeTicker(this.bigWinParticleTicker), this.bigWinParticleTicker = null)
    }
    startBigWinAmbientParticles(t) {
        this.stopBigWinAmbientParticles();
        let e = 0;
        const s = () => {
            e += this.app.ticker.deltaMS / 1e3, !(e < .18) && (e = 0, this.playBoomParticles(t, 2, this.bigWinFxGroup ?? this.fxLayer ?? void 0))
        };
        this.bigWinParticleTicker = s, this.addTicker(s)
    }
    async dismissBigWinEffects() {
        var e, s;
        if (!this.isBigWinActive) return;
        this.isBigWinActive = !1, this.stopBigWinAmbientParticles(), this.bigWinArrowTicker && (this.removeTicker(this.bigWinArrowTicker), this.bigWinArrowTicker = null);
        const t = [];
        this.bigWinFxGroup && t.push(st(this.app, this.bigWinFxGroup, {
            alpha: 0
        }, .24, Mt)), this.bigWinArrow && t.push(st(this.app, this.bigWinArrow, {
            alpha: 0
        }, .22, Mt)), this.wheelRig && t.push(st(this.app, this.wheelRig, {
            y: this.getWheelRigOffscreenY()
        }, .4, Br)), await Promise.all(t), (e = this.bigWinGroup) == null || e.destroy({
            children: !0
        }), this.bigWinGroup = null, (s = this.bigWinFxGroup) == null || s.destroy({
            children: !0
        }), this.bigWinFxGroup = null, this.bigWinArrow = null, this.bigWinArrowTicker = null, this.wheelChainSpanOverride = null, this.wheelChainSprite && (this.wheelChainSprite.visible = !1), await this.playPhoneAnimation(), await this.showEndScreen()
    }
    pickWeightedSector() {
        return ns.find(t => t.name === "x7") ?? ns[0]
    }
    calculateTargetAngle(t, e) {
        const s = Math.PI * 2,
            r = s / ns.length,
            n = (-t * r % s + s) % s,
            o = (e % s + s) % s,
            a = n - o;
        return a >= 0 ? a : a + s
    }
    setWheelSpinBlur(t) {
        this.wheelSpinBlur && (this.wheelSpinBlur.strength = Th(t, 0, Ob))
    }
    async tweenWheelRotation(t, e, s = kt, r = .18) {
        if (!this.wheelSpinner) return;
        let n = this.wheelSpinner.rotation;
        const o = () => {
            var c;
            const a = Math.max(this.app.ticker.deltaMS / 1e3, .001),
                h = ((c = this.wheelSpinner) == null ? void 0 : c.rotation) ?? n,
                l = Math.abs(h - n) / a;
            n = h, this.setWheelSpinBlur(l * r)
        };
        this.addTicker(o);
        try {
            await st(this.app, this.wheelSpinner, {
                rotation: t
            }, e, s)
        } finally {
            this.removeTicker(o)
        }
    }
    async spinWheel() {
        var a;
        const t = this.pickWeightedSector(),
            e = ns.indexOf(t),
            r = (((a = this.wheelSpinner) == null ? void 0 : a.rotation) ?? 0) - .09,
            n = Bb * Math.PI * 2 + this.calculateTargetAngle(e, r),
            o = r + n;
        return await this.tweenWheelRotation(r, .11, kt, .05), await new Promise(h => {
            let l = 0,
                c = r;
            const u = () => {
                const d = Math.max(this.app.ticker.deltaMS / 1e3, .001);
                l += d;
                const f = Math.min(l / Rb, 1),
                    p = f * f * (3 - 2 * f),
                    m = r + n * p,
                    g = Math.abs(m - c) / d;
                c = m, this.wheelSpinner && (this.wheelSpinner.rotation = m), this.setWheelSpinBlur(g * .35), f >= 1 && (this.wheelSpinner && (this.wheelSpinner.rotation = o), this.removeTicker(u), h())
            };
            this.addTicker(u)
        }), await this.tweenWheelRotation(o + .05, .11, kt, .08), await this.tweenWheelRotation(o - .028, .1, Mt, .06), await this.tweenWheelRotation(o, .08, kt, .04), this.setWheelSpinBlur(0), t
    }
    async triggerSpin() {
        if (this.isWheelSpinning || !this.wheelActive || !this.buildButton) return;
        this.isWheelSpinning = !0, this.buildButton.alpha = .5, this.guideArrow && (this.guideArrow.visible = !1), this.playSound("Wheel 2.mp3", .5);
        const t = await this.spinWheel();
        await be(this.app, .5), this.state.multipliers.push(t.multiplier > 0 ? t.multiplier : 5), this.state.cashOut = _h(yh, this.state.multipliers), await this.updateResults(), this.updateCashOut(), await this.hideWheel(), await this.showBigWin(), this.isWheelSpinning = !1
    }
    async showBigWin() {
        if (!this.buildButton || !this.textures || !this.fxLayer) return;
        this.buildButton.alpha = .25, this.playSound("win_FG.mp3", .55);
        const t = new Z().rect(-H * 2, -J * 2, H * 5, J * 5).fill({
            color: 0
        });
        t.alpha = 0;
        const e = this.shakeLayer ?? this.root,
            s = this.hudLayer ? e.getChildIndex(this.hudLayer) : e.children.length;
        e.addChildAt(t, s), this.bigWinOverlay = t, st(this.app, t, {
            alpha: Nb
        }, .32, Mt);
        const r = new D;
        this.wheelRig.addChild(r), this.bigWinGroup = r;
        const n = new D;
        this.fxLayer.addChild(n), this.bigWinFxGroup = n;
        const o = new Q(this.textures["box bigwin.webp"]);
        o.anchor.set(.5, .5), o.width = H * Db, o.scale.y = o.scale.x;
        const a = J * Ub;
        o.position.set(0, a), r.addChild(o), this.wheelChainSpanOverride = a + o.height * .42, this.wheelChainSprite.visible = !0, this.wheelContainer && (this.wheelContainer.visible = !1), this.updateWheelRigLayout(), this.wheelRig.y = this.getWheelRigOffscreenY(), await st(this.app, this.wheelRig, {
            y: 0
        }, .55, Ir);
        const h = this.state.cashOut,
            l = 12080,
            c = new Ot({
                text: `${h.toLocaleString(ve().locale)} ${ve().currencySymbol}`,
                style: {
                    fontFamily: Rt,
                    fontSize: Math.round(H * .145),
                    fontWeight: "700",
                    fill: "#fffdf7",
                    dropShadow: {
                        color: 0,
                        alpha: .95,
                        blur: 16,
                        distance: 0
                    }
                }
            });
        c.anchor.set(.5, .5), c.position.set(0, a + o.height * .19), r.addChild(c), this.updateCashOut(), this.setCashOutGoldProgress(0), this.playBoomParticles(a, 15, n), this.startBigWinAmbientParticles(a), this.playSound("cash_register2.mp3", .4), await new Promise(m => {
            let g = 0;
            const _ = 1.8,
                x = () => {
                    g += this.app.ticker.deltaMS / 1e3;
                    const b = Math.min(g / _, 1),
                        y = Math.round(h + (l - h) * Mt(b));
                    c.text = `${formatWinNumber(y)} ${ve().currencySymbol}`, this.cashOutAmount && (this.cashOutAmount.text = Gs(y)), this.setCashOutGoldProgress((y - wh) / (l - wh)), b >= 1 && (c.text = `12 080 ${ve().currencySymbol}`, this.cashOutAmount && (this.cashOutAmount.text = Gs(l)), this.setCashOutGoldProgress(1), this.removeTicker(x), m())
                };
            this.addTicker(x)
        }), this.state.cashOut = l, this.updateCashOut(), this.buildButton.eventMode = "none", this.cashOutGroup && await st(this.app, this.cashOutGroup, {
            alpha: 1
        }, .4, Mt);
        const u = Dr(.56);
        u.position.set(this.cashOutGroup.x - 6, this.cashOutGroup.y - 58), u.rotation = -.2, u.alpha = 0, n.addChild(u), this.bigWinArrow = u, this.isBigWinActive = !0, st(this.app, u, {
            alpha: 1
        }, .5, Mt);
        let d = 0;
        const f = u.y,
            p = () => {
                d += this.app.ticker.deltaMS / 1e3, u.y = f + Math.sin(d * 4) * 8
            };
        this.addTicker(p), this.bigWinArrowTicker = p, be(this.app, 4).then(() => {
            this.isBigWinActive && this.dismissBigWinEffects()
        })
    }
    async playPhoneAnimation() {
        if (!this.textures) return;
        const t = [];
        for (const o of bh) {
            const a = this.textures[o];
            a && t.push(a)
        }
        if (t.length === 0) return;
        const e = new ti(t);
        e.anchor.set(.5), e.animationSpeed = Ab / 60, e.loop = !1;
        const s = t[0].height,
            r = J * .78 / s;
        e.scale.set(r), e.position.set(H / 2, J * .46), e.y = J + s * r * .5, (this.shakeLayer ?? this.root).addChild(e), this.playSound("sfx_Whoosh_11.mp3", .4), await st(this.app, e, {
            y: J * .46
        }, .5, Ir);
        const n = [.6, 1.27, 2.05];
        for (const o of n) be(this.app, o).then(() => this.playSound("sms.mp3", .4));
        e.gotoAndPlay(0), await new Promise(o => {
            e.onComplete = () => o()
        }), await be(this.app, 1), await st(this.app, e, {
            y: -(s * r * .6)
        }, .45, Br), e.destroy()
    }
    async showEndScreen() {
        if (!this.textures) return;
        if (this.wheelRig || (this.wheelRig = new D), (this.shakeLayer ?? this.root).addChild(this.wheelRig), !this.wheelChainSprite) {
            const p = new Q(this.textures["wheel/cepochka.webp"]);
            p.anchor.set(.5, 0), this.wheelChainSprite = p, this.wheelRig.addChild(p)
        }
        const t = new D;
        this.wheelRig.addChild(t);
        const e = new Q(this.textures["box bonus.webp"]);
        e.anchor.set(.5, .5), e.width = H * .88, e.scale.y = e.scale.x;
        const s = J * .38;
        e.position.set(0, s), t.addChild(e);
        const r = new Ot({
            text: "BONUS",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(H * .095),
                fontWeight: "700",
                fill: "#ffffff",
                dropShadow: {
                    color: 0,
                    alpha: .9,
                    blur: 10,
                    distance: 0
                }
            }
        });
        r.anchor.set(.5), r.position.set(0, s - e.height * .17), t.addChild(r);
        const n = new Ot({
            text: "€1500 + 250",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(H * .075),
                fontWeight: "700",
                fill: "#f4c16e",
                dropShadow: {
                    color: 0,
                    alpha: .9,
                    blur: 8,
                    distance: 0
                }
            }
        });
        n.anchor.set(.5), n.position.set(0, s + e.height * .01), t.addChild(n);
        const o = new Ot({
            text: "FREE SPINS",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(H * .07),
                fontWeight: "700",
                fill: "#ffffff",
                dropShadow: {
                    color: 0,
                    alpha: .9,
                    blur: 10,
                    distance: 0
                }
            }
        });
        o.anchor.set(.5), o.position.set(0, s + e.height * .17), t.addChild(o);
        const l = new D,
            c = new Q(this.textures["but build.webp"]);
        c.anchor.set(.5), c.height = J * .12, c.scale.x = c.scale.y;
        const u = new Ot({
            text: "INSTALL",
            style: {
                fontFamily: Rt,
                fontSize: Math.round(c.width * .13),
                fontWeight: "700",
                fill: "#f2efe8",
                letterSpacing: 2.5,
                dropShadow: {
                    color: 3276800,
                    alpha: .62,
                    blur: 3,
                    distance: 2,
                    angle: Math.PI / 2
                }
            }
        });
        u.anchor.set(.5), l.addChild(c, u), l.position.set(H / 2, s + e.height * .52 + 140), l.eventMode = "static", l.cursor = "pointer", l.on("pointertap", () => {
            var p;
            this.playSound("minecraft-click cut.mp3"), (p = window.openStore) == null || p.call(window)
        }), (this.shakeLayer ?? this.root).addChild(l), this.wheelChainSprite.visible = !0, this.wheelContainer && (this.wheelContainer.visible = !1), this.bigWinGroup = t, this.wheelChainSpanOverride = s + e.height * .42, this.updateWheelRigLayout(), this.wheelRig.position.set(H / 2, this.getWheelRigOffscreenY()), this.wheelRig.visible = !0, l.alpha = 0, this.playSound("open treasure.mp3"), await st(this.app, this.wheelRig, {
            y: 0
        }, .7, kt), await st(this.app, l, {
            alpha: 1
        }, .3, Mt);
        let d = 0;
        const f = () => {
            d += this.app.ticker.deltaMS / 1e3;
            const p = 1 + Math.sin(d * 3.8) * .025;
            l.scale.set(p)
        };
        this.addTicker(f)
    }
    playSound(t, e = .5) {
        try {
            let s = this.audioCache.get(t);
            s || (s = new Audio(Us(t)), this.audioCache.set(t, s)), s.volume = this.muteController.getMuted() ? 0 : e, s.muted = this.muteController.getMuted(), s.currentTime = 0, s.play().catch(() => {})
        } catch {}
    }
    startBgMusic() {
        if (!this.bgMusic) try {
            this.bgMusic = new Audio(Us("thron rem.mp3")), this.bgMusic.loop = !0, this.bgMusic.volume = this.muteController.getMuted() ? 0 : .18, this.bgMusic.muted = this.muteController.getMuted(), this.bgMusic.play().catch(() => {})
        } catch {}
    }
    playBoomParticles(t = J * .52, e = 15, s = this.fxLayer ?? void 0) {
        if (!this.textures) return;
        const r = [];
        for (let n = 0; n <= 48; n++) {
            const o = `boom/Boom_particle_[01-49].webp Comp 1_${String(n).padStart(5,"0")}.webp`,
                a = this.textures[o];
            a && r.push(a)
        }
        if (!(r.length === 0 || !s))
            for (let n = 0; n < e; n++) {
                const o = new ti(r);
                o.anchor.set(.5, .5), o.animationSpeed = .35 + Math.random() * .35, o.loop = !1, o.position.set(H / 2 + (Math.random() - .5) * H * .92, t + (Math.random() - .5) * J * .7), o.scale.set(.38 + Math.random() * .38), o.rotation = Math.random() * Math.PI * 2, o.tint = 16040302, o.alpha = .82, o.onComplete = () => o.destroy(), s.addChild(o), o.play();
                let a = -1.8 - Math.random() * 2.4,
                    h = (Math.random() - .5) * 2.6;
                const l = () => {
                    if (o.destroyed) {
                        this.removeTicker(l);
                        return
                    }
                    a += .06, o.y += a, o.x += h, o.alpha -= .0075
                };
                this.addTicker(l)
            }
    }
}

function qb(i) {
    const t = ve();
    return {
        state: "prompt-build",
        layers: ["background", "atmosphere", "logo", "suspended-piece", "pedestal", "hud"],
        assets: Qu,
        cashOut: {
            label: "CASH OUT",
            amount: `0.00 ${t.currencyCode}`
        },
        buildButton: {
            label: "BUILD"
        },
        guideArrow: {
            visible: !0
        },
        suspendedPiece: {
            asset: "throne1.webp",
            hookAsset: "kruk.webp"
        },
        layout: $s(i)
    }
}
const Kb = .04;

function go(i) {
    return "assets/" + i
}

function Zb(i) {
    return go(i)
}
async function Qb() {
    const i = await Promise.all([...Qu, "tros.webp"].map(async t => {
        const e = await Te.load(Zb(t));
        return [t, e]
    }));
    return Object.fromEntries(i)
}

function Jb(i) {
    const t = new D,
        e = new Z;
    e.roundRect(0, 0, 88, 88, 18).fill({
        color: 1182986,
        alpha: .72
    }).stroke({
        color: 9398847,
        alpha: .9,
        width: 2
    });
    const s = new Z;
    return s.moveTo(22, 34).lineTo(34, 34).lineTo(48, 24).lineTo(48, 64).lineTo(34, 54).lineTo(22, 54).closePath().fill({
        color: 15921128
    }), i ? (s.moveTo(58, 28).lineTo(74, 60).stroke({
        color: 15921128,
        width: 5
    }), s.moveTo(74, 28).lineTo(58, 60).stroke({
        color: 15921128,
        width: 5
    })) : (s.arc(54, 44, 10, -.9, .9).stroke({
        color: 15921128,
        width: 4
    }), s.arc(54, 44, 18, -.9, .9).stroke({
        color: 15921128,
        width: 4,
        alpha: .9
    })), t.addChild(e, s), t
}

function t0(i, t, e) {
    const s = new D,
        r = new Q(i),
        n = new Z;
    r.anchor.set(.5, 526 / 1080), r.position.set(H / 2, t), r.width = 4e3, r.scale.y = r.scale.x;
    const o = r.width,
        a = H / 2 - o / 2;
    return n.rect(a, t - 120, o, 140).fill({
        color: 16181195,
        alpha: .08
    }), n.filters = [new zt({
        strength: 4,
        quality: 2
    })], n.filterArea = new nt(a - 32, t - 160, o + 64, 220), s.addChild(r, n), s
}

function Ch(i, t) {
    const e = new D,
        s = new Z,
        r = new Z,
        n = new Z,
        o = new Z,
        a = new Z,
        h = new Z,
        l = new Z,
        c = new Z,
        u = new Z;
    r.ellipse(i * .5, -t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It
    }), n.ellipse(i * .5, t + t * .12, i * 1.2, t * .42).fill({
        color: 197121,
        alpha: It * 1.02
    }), o.ellipse(-i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), a.ellipse(i + i * .12, t * .5, i * .42, t * 1.1).fill({
        color: 197121,
        alpha: It * .88
    }), h.ellipse(-i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), l.ellipse(i + i * .1, -t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .42
    }), c.ellipse(-i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    }), u.ellipse(i + i * .1, t + t * .1, i * .6, t * .6).fill({
        color: 262914,
        alpha: It * .5
    });
    const d = new zt({
        strength: 28,
        quality: 4
    });
    d.padding = 200, e.filters = [d], s.ellipse(i * .5, t * .33, i * .17, t * .06).fill({
        color: 15777652,
        alpha: .12
    });
    const f = new zt({
        strength: 28,
        quality: 4
    });
    return f.padding = 200, s.filters = [f], e.addChild(s, r, n, o, a, h, l, c, u), e
}

function e0(i) {
    const t = new D,
        e = new Z,
        s = new Z,
        r = (n, o) => {
            n.moveTo(-12, -56).lineTo(12, -56).lineTo(12, -14).lineTo(28, -14).lineTo(0, 40).lineTo(-28, -14).lineTo(-12, -14).closePath().fill({
                color: 16777215,
                alpha: o
            })
        };
    return r(e, .22), e.scale.set(1.08), e.y = 4, r(s, 1), t.scale.set(i * 1.1), t.addChild(e, s), t
}

function Ah(i, t) {
    i.eventMode = "static", i.cursor = "pointer", i.on("pointerdown", () => {
        t(!0)
    }), i.on("pointerup", () => t(!1)), i.on("pointerupoutside", () => t(!1)), i.on("pointerout", () => t(!1))
}
class s0 {
    constructor(t, e) {
        E(this, "root", new D);
        E(this, "app");
        E(this, "onBuild");
        E(this, "muteController");
        E(this, "textures", null);
        E(this, "buildButton", null);
        E(this, "guideArrow", null);
        E(this, "suspendedPiece", null);
        E(this, "buildPulseTime", 0);
        E(this, "buildButtonPressed", !1);
        E(this, "buildTriggered", !1);
        E(this, "guideArrowBaseY", 0);
        E(this, "screenWidth", 0);
        E(this, "screenHeight", 0);
        E(this, "frozenEntryPose", null);
        E(this, "atmosphereLayer", null);
        E(this, "fogContainer", null);
        E(this, "tick", () => {
            if (this.buildPulseTime += this.app.ticker.deltaMS / 1e3, this.buildButton) {
                const t = 1 + Math.sin(this.buildPulseTime * 3.4) * .018,
                    e = this.buildButtonPressed ? .965 : 1;
                this.buildButton.scale.set(t * e)
            }
            if (this.guideArrow && (this.guideArrow.y = this.guideArrowBaseY + Math.sin(this.buildPulseTime * 5.2) * 8, this.guideArrow.alpha = .84 + (Math.sin(this.buildPulseTime * 5.2) + 1) * .08), this.suspendedPiece) {
                const t = Math.sin(this.buildPulseTime * 2.5) * .21;
                this.suspendedPiece.rotation = t
            }
        });
        this.app = t, this.onBuild = e.onBuild, this.muteController = e.muteController
    }
    async init() {
        this.textures = await Qb(), this.root.eventMode = "passive", this.render(this.app.screen.width, this.app.screen.height), this.app.ticker.add(this.tick)
    }
    destroy() {
        this.app.ticker.remove(this.tick), this.fogContainer && (this.fogContainer.removeFromParent(), this.fogContainer = null), this.root.destroy({
            children: !0
        })
    }
    setFog(t) {
        this.fogContainer = t, this.atmosphereLayer && (this.atmosphereLayer.removeChildren(), this.atmosphereLayer.addChild(t, Ch(this.screenWidth, this.screenHeight)))
    }
    resize(t, e) {
        this.textures && this.render(t, e)
    }
    getEntryPose() {
        return this.frozenEntryPose ?? this.captureEntryPose()
    }
    captureEntryPose() {
        if (!this.suspendedPiece) return;
        const t = this.suspendedPiece.children[3];
        if (!(t instanceof Q)) return;
        const o = resolveTransferredBlockEntryPose({
            craneX: this.suspendedPiece.x,
            craneY: this.suspendedPiece.y,
            rotation: this.suspendedPiece.rotation,
            blockX: t.x,
            blockTopY: t.y,
            blockHeight: t.height,
            blockRotation: t.rotation || this.suspendedPiece.rotation,
            textureName: "throne1.webp"
        });
        return console.log("[StartScene] captureEntryPose", o), o
    }
    async triggerBuild() {
        var e, s;
        if (this.buildTriggered) return;
        this.buildTriggered = !0, this.buildButtonPressed = !1;
        const t = ((e = this.suspendedPiece) == null ? void 0 : e.rotation) ?? 0;
        this.suspendedPiece && (this.suspendedPiece.rotation = t), this.frozenEntryPose = this.captureEntryPose() ?? null, this.frozenEntryPose && (this.frozenEntryPose.rotation = t, this.frozenEntryPose.blockRotation = 0), console.log("[StartScene] triggerBuild frozenEntryPose", this.frozenEntryPose);
        try {
            await ((s = this.onBuild) == null ? void 0 : s.call(this))
        } catch (r) {
            this.buildTriggered = !1, console.error("Failed to transition to gameplay scene", r)
        }
    }
    render(t, e) {
        if (this.screenWidth = t, this.screenHeight = e, !this.textures) return;
        this.fogContainer && this.fogContainer.removeFromParent(), this.root.removeChildren().forEach(xt => {
            xt.destroy({
                children: !0
            })
        });
        const s = qb({
                width: t,
                height: e
            }),
            r = $s({
                width: t,
                height: e
            }),
            n = new D;
        this.atmosphereLayer = new D;
        const o = new D,
            a = new D,
            h = new D,
            l = new D,
            c = new Q(this.textures["bg main new.webp"]);
        c.anchor.set(.5, .5), c.position.set(t / 2, e / 2), c.scale.set(2.1), n.filters = [new zt({
            strength: Zu,
            quality: 4,
            kernelSize: 9,
            padding: 128
        })], n.addChild(c), this.atmosphereLayer.addChild(Ch(t, e));
        const u = new Q(this.textures["log twr.webp"]);
        u.anchor.set(.5, 0);
        const d = r.logo.width / u.texture.width * 1.17;
        u.position.set(t / 2, e * .02), u.scale.set(d), u.alpha = .97;
        const f = new Q(this.textures["log twr.webp"]);
        f.anchor.set(.5, 0), f.position.set(t / 2 + 5, e * .02 + 7), f.scale.set(d), f.tint = 1116936, f.alpha = .28, o.addChild(f, u);
        const p = this.textures[s.suspendedPiece.hookAsset],
            m = this.textures[s.suspendedPiece.asset],
            g = new D;
        g.pivot.set(0, 0), g.x = t / 2, g.y = 0;
        const _ = e * .26,
            x = new Q(p);
        x.anchor.set(.5, 0), x.x = 0, x.y = _ - 5;
        const b = t * .07 / p.width;
        x.scale.set(b);
        const y = new Z;
        y.moveTo(0, -e * .24), y.lineTo(0, x.y + x.height * .4), y.stroke({
            width: 2.5,
            color: 4473924
        });
        const S = t * .58 * 1.3,
            v = new Q(m);
        v.anchor.set(.5, 0), v.x = 0;
        const T = S / m.width;
        v.scale.set(T);
        const M = x.y + x.height * .801 + 5;
        v.y = M + e * .1 - 110;
        const C = new Q(m);
        C.anchor.set(.5, 0), C.position.set(v.x, v.y), C.scale.set(T), C.tint = 0, C.alpha = .72, C.filters = [new zt({
            strength: 8,
            quality: 4
        })];
        const A = 172 / 467,
            P = 305 / 467,
            k = 180 / 303,
            G = (A - .5) * v.width,
            F = (P - .5) * v.width,
            ht = v.y + k * v.height,
            R = new Z;
        R.moveTo(0, M), R.lineTo(G, ht), R.moveTo(0, M), R.lineTo(F, ht), R.stroke({
            width: 2.5,
            color: 8947848
        }), g.addChild(y), g.addChild(R), g.addChild(C), g.addChild(v), g.addChild(x), a.addChild(g), this.suspendedPiece = g, h.addChild(t0(this.textures["platform wide.webp"], r.pedestal.topY));
        const I = r.hud.buttonHeight,
            z = r.hud.gap,
            B = r.hud.buttonY,
            L = new D,
            q = new Q(this.textures["but cash out.webp"]);
        q.anchor.set(.5, .5), q.height = I * 1.04, q.scale.x = q.scale.y;
        const K = new Ot({
            text: s.cashOut.label,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(I * .15),
                fontWeight: "700",
                fill: "#d7d5d3",
                letterSpacing: .7
            }
        });
        K.anchor.set(.5, .5), K.x = 0, K.y = -q.height * .05;
        const W = new Ot({
            text: s.cashOut.amount,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(I * .1),
                fontWeight: "700",
                fill: "#d1cbc4",
                letterSpacing: .25
            }
        });
        W.anchor.set(.5, .5), W.x = 0, W.y = q.height * .08, L.addChild(q, K, W);
        const et = new D,
            rt = new Q(this.textures["but build.webp"]);
        rt.anchor.set(.5, .5), rt.height = I, rt.scale.x = rt.scale.y;
        const ut = new Ot({
            text: s.buildButton.label,
            style: {
                fontFamily: Rt,
                fontSize: Math.round(I * .35),
                fontWeight: "700",
                fill: "#f2efe8",
                letterSpacing: 1.5,
                dropShadow: {
                    color: 3276800,
                    alpha: .62,
                    blur: 3,
                    distance: 2,
                    angle: Math.PI / 2
                }
            }
        });
        ut.anchor.set(.5, .5), ut.x = 0, ut.y = 0, et.addChild(rt, ut);
        const ct = q.width + z + rt.width,
            vt = (t - ct) / 2;
        L.x = vt + q.width / 2 + r.hud.cashOutCenterOffsetX, L.y = B, et.x = vt + q.width + z + rt.width / 2, et.y = B, Ah(L, () => {}), Ah(et, xt => {
            this.buildButtonPressed = xt
        });
        const $ = e0(r.guideArrow.scale);
        $.position.set(r.guideArrow.x, r.guideArrow.y + e * Kb), $.visible = s.guideArrow.visible, this.guideArrowBaseY = $.y, et.on("pointertap", xt => {
            xt.stopPropagation(), this.triggerBuild()
        }), L.on("pointertap", xt => {
            xt.stopPropagation()
        });
        const wt = Jb(this.muteController.getMuted());
        wt.position.set(t - 120, 72), wt.eventMode = "static", wt.cursor = "pointer", wt.on("pointertap", xt => {
            xt.stopPropagation(), this.muteController.toggleMuted(), this.render(this.screenWidth, this.screenHeight)
        }), l.addChild(L, et, $, wt), this.root.addChild(n, this.atmosphereLayer, a, h, l, o), this.fogContainer && this.atmosphereLayer.addChild(this.fogContainer), this.buildButton = et, this.guideArrow = $, this.buildButtonPressed = !1
    }
}
async function i0({
    app: i,
    startScene: t,
    createGameplayScene: e,
    autoDropOnEnter: s = !1,
    fogContainer: r
}) {
    var a, h, l, c;
    const n = e(),
        o = (a = t.getEntryPose) == null ? void 0 : a.call(t);
    return await n.init(), o && (console.log("[SceneTransition] handoff entryPose", o), (h = n.applyEntryPose) == null || h.call(n, o)), r && n.setFog(r), (l = t.root.parent) == null || l.removeChild(t.root), t.destroy(), s && await ((c = n.beginFirstDrop) == null ? void 0 : c.call(n)), n
}

function r0({
    viewportWidth: i,
    viewportHeight: t,
    designWidth: e,
    designHeight: s
}) {
    const r = Math.min(i / e, t / s);
    return {
        scale: r,
        x: (i - e * r) / 2,
        y: (t - s * r) / 2
    }
}

function n0(i, t, e) {
    const s = new Z;
    s.circle(0, 0, 100), s.fill({
        color: 16777215
    });
    const r = i.renderer.generateTexture({
            target: s,
            resolution: 1
        }),
        n = new D;
    n.filters = [new zt({
        strength: 8,
        quality: 2
    })];
    const o = [];
    for (let a = 0; a < 5; a++) {
        const h = new Q(r);
        h.anchor.set(.5), h.tint = 11184810, h.scale.set(1 + Math.random() * .8);
        const l = 5 + Math.random() * 2.5,
            c = a * 1,
            u = t * (.18 + Math.random() * .64),
            d = e * (.92 + Math.random() * .06),
            f = e * (.085 + Math.random() * .05),
            p = t * (.012 + Math.random() * .02),
            m = Math.random() * Math.PI * 2;
        h.alpha = 0, h.x = u, h.y = e * 1.1, n.addChild(h), o.push({
            sprite: h,
            delay: c,
            elapsed: 0,
            lifetime: l,
            baseX: u,
            baseY: d,
            riseDistance: f,
            driftDistance: p,
            driftPhase: m
        })
    }
    return {
        container: n,
        particles: o
    }
}
const Fs = {
        muted: !1
    },
    Ur = {
        getMuted: () => Fs.muted,
        setMuted: i => {
            Fs.muted = i
        },
        toggleMuted: () => (Fs.muted = !Fs.muted, Fs.muted)
    };
(async () => {
    window.__adReady || await new Promise(f => {
        window.__startApp = f
    });
    const i = document.getElementById("app");
    if (!i) throw new Error("App host not found");
    const t = 1080,
        e = 1920,
        s = new Al;
    await sb(), await s.init({
        resizeTo: window,
        backgroundColor: 591621,
        backgroundAlpha: 1,
        antialias: !0,
        autoDensity: !0,
        preference: "webgl",
        preserveDrawingBuffer: !0,
        resolution: Math.min(window.devicePixelRatio || 1, 2)
    }), i.appendChild(s.canvas);
    const r = new D;
    s.stage.addChild(r);
    const n = n0(s, s.screen.width, s.screen.height);
    let o, a = !1;
    const h = new s0(s, {
        muteController: Ur,
        onBuild: async () => {
            if (!a) {
                a = !0;
                try {
                    o = await i0({
                        app: s,
                        startScene: h,
                        createGameplayScene: () => new jb(s, {
                            muteController: Ur
                        }),
                        autoDropOnEnter: !0,
                        fogContainer: n.container
                    }), r.addChild(o.root), d()
                } catch (f) {
                    throw a = !1, f
                }
            }
        }
    });
    o = h, await o.init(), r.addChild(o.root), o.setFog(n.container);
    let l = 0;
    s.ticker.add(() => {
        const f = s.ticker.deltaMS / 1e3;
        l += f;
        for (const p of n.particles) {
            if (!p.sprite || p.sprite.destroyed || (p.elapsed += f, p.elapsed < p.delay)) continue;
            const g = (p.elapsed - p.delay) / p.lifetime;
            p.sprite.y = p.baseY - p.riseDistance * Math.min(g, 1), p.sprite.x = p.baseX + Math.sin(Math.min(g, 1) * Math.PI * 2 + p.driftPhase) * p.driftDistance;
            let _ = 0;
            g < .2 ? _ = g / .2 * .18 : _ = .18 * (.88 + .12 * ((Math.sin(l * 1) + 1) / 2)), p.sprite.alpha = _
        }
    });
    let c = s.screen.width,
        u = s.screen.height;

    function d() {
        const f = s.screen.width,
            p = s.screen.height,
            m = r0({
                viewportWidth: f,
                viewportHeight: p,
                designWidth: t,
                designHeight: e
            });
        r.scale.set(m.scale), r.position.set(m.x, m.y), o.resize(t, e)
    }
    d(), s.ticker.add(() => {
        const f = s.screen.width,
            p = s.screen.height;
        (f !== c || p !== u) && (c = f, u = p, d())
    }), document.addEventListener("visibilitychange", () => {
        document.hidden && Ur.setMuted(!0)
    })
})();
Y.add(mf);
Y.mixin(D, gf);
Y.add(ec);
Y.add(sc);
Y.mixin(D, Lg);
Y.add(hc);
Y.add(ac);
const o0 = Object.freeze(Object.defineProperty({
        __proto__: null
    }, Symbol.toStringTag, {
        value: "Module"
    })),
    a0 = Object.freeze(Object.defineProperty({
        __proto__: null
    }, Symbol.toStringTag, {
        value: "Module"
    }));
