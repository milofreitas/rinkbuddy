# 07: Phone capture. Can slow motion fix jump analysis?

*Researched 2026-09-19. This follows [03-ai-technical.md](03-ai-technical.md), which found that 1 fps sampling misses jumps (about 0.4–0.65 s in the air) and recommended 60 fps with bursts around motion.*

---

## 1. Verdict on the founder's intuition

**The intuition is right about the phones and wrong about the current app.**

- Almost every phone in US pockets can shoot 120 fps, and most can shoot 240 fps.
- RinkBuddy's recorder records at the browser default of **30 fps**. It never requests a frame rate (`index.html` line ~2604: `getUserMedia({video:{facingMode, width:1920, height:1080}})`), and it analyzes only 1 fps of that.
- The browser camera API cannot reach 120/240 fps on either platform (§3).

There are two practical ways to get high-fps footage:

1. **Import videos the user already shot in the native slo-mo mode.** Works now, and needs verifying on a device.
2. **Add a small native capture plugin to the Capacitor shell.** Needs about 2–4 engineer-weeks per platform. It does not need a rewrite.

**The key trade-off:** high frame rate does not help if the skater is only 80 px tall. At a rink, **1080p at 120 fps with a short shutter** beats 240 fps for most users. 240 fps is for close-range drills.

**Direct evidence from Milo's own phone.** I ran ffprobe on 30 of Milo's iPhone 16 Pro Max 4K120 clips (BM B-roll, Oct 2024):

- Every frame is stored in the file. `IMG_0371.MOV` holds **703 frames in 5.86 s (120.0 fps)**, HEVC, 3840×2160.
- The container carries `com.apple.quicktime.full-frame-rate-playback-intent=0`, a *playback* hint. The frames are not thinned.
- Measured bitrate was **86–123 Mbps, i.e. 650–925 MB per minute**. This matches iDownloadBlog's "up to 800 MB" per minute ([iDB](https://www.idownloadblog.com/2017/11/22/how-to-shoot-slo-mo-video-1080p-at-240fps-iphone/)).

---

## 2. What the phones can capture

### iPhone (61% of US mobile traffic, Aug 2026 ([StatCounter](https://gs.statcounter.com/vendor-market-share/mobile/united-states-of-america)))

| Tier | Normal video | Slo-mo | Source |
|---|---|---|---|
| iPhone SE 3 (2022), 15, 17 (base) | 4K and 1080p up to **60 fps** | **1080p 120/240 fps** | [SE 3](https://support.apple.com/en-us/111866), [15](https://support.apple.com/en-us/111831), [17](https://www.apple.com/iphone-17/specs/) |
| iPhone 16 Pro / Pro Max | 4K at 24–60 fps, plus **4K100/120 on the Fusion (main) camera only**; 1080p120 | 1080p up to 240 fps; **4K120 slo-mo (Fusion only)** | [16 Pro Max](https://support.apple.com/en-us/121032) |
| iPhone 18 Pro / Pro Max (Sept 2026) | Same: 4K120 on the main camera only; 8× optical-quality tele | 1080p240, 4K120 (main) | [18 Pro](https://www.apple.com/iphone-18-pro/specs/) |

- 1080p240 slo-mo goes back to the iPhone 8 (2017), so essentially **every active iPhone can shoot 1080p60 and 1080p240**.
- 4K120 (16 Pro, 17 Pro, 18 Pro families) is roughly **25–40% of active iPhones**. TelemetryDeck shows the 17 Pro at 11.1% and the 16 Pro and 17 Pro Max at 10–11% each ([TelemetryDeck](https://telemetrydeck.com/survey/apple/iPhone/models/)). That panel skews toward recent devices, so the true installed base is probably at the low end of the range.

### Android (Samsung 22%, Motorola 4%, Xiaomi 4%, Google 2.7%)

| Device | Normal | Slo-mo | Source |
|---|---|---|---|
| Galaxy S26 Ultra | 8K30; 4K up to 120 fps in Pro Video | 1080p 240; 720p **960 fps** (Super Slow-mo, interpolated / short burst) | [SamMobile](https://www.sammobile.com/news/all-new-camera-features-galaxy-s26-ultra-explained/), [HotHardware](https://hothardware.com/reviews/samsung-galaxy-s26-ultra-review) |
| Pixel 9 / 10 Pro | 4K/1080p 24/30/60 | up to 240 fps | [Pixel 9](https://store.google.com/us/product/pixel_9_specs?hl=en-US), [Pixel 10](https://store.google.com/product/pixel_10_specs?hl=en-US) |
| Galaxy A56 | 4K**60** | slow-mo modes (fps not published) | [Samsung US](https://www.samsung.com/us/support/answer/ANS10004543/) |
| Galaxy A16 / A26 / A36 (best-selling budget) | 4K**30** max | A16: **1080p only in the stock app**; users report **no 1080p60** | [Samsung US](https://www.samsung.com/us/support/answer/ANS10004543/), [GSMArena A16](https://www.gsmarena.com/samsung_galaxy_a16_5g-review-2758p5.php), [Samsung community](https://r2.community.samsung.com/t5/Galaxy-A/Not-Support-1080p-60-FPS-Video-Recording-in-Galaxy-A16-5G/m-p/22472021) |

### Estimated share of US phones (my estimate from the tables above)

| Capability | Share of US phones |
|---|---|
| 60 fps | about **85–90%** |
| ≥120 fps (any mode) | about **85–92%** |
| 240 fps | about **75–80%** |
| 4K120 | about **15–25%** |

The gap is mostly budget Samsung A and Moto G phones.

**Stock-camera capability is not the same as third-party-app capability.** On Android, an app gets 120/240 fps only if the manufacturer exposes a Camera2 constrained high-speed session. Google's CameraX 1.5 announcement lists confirmed support for Pixel, Motorola Edge 30, OPPO Find N2 Flip and Sony Xperia 1 V, and warns that manufacturers sometimes omit the high-speed profiles ([Android Developers](https://developer.android.com/blog/posts/high-speed-capture-and-slow-motion-video-with-camera-x-1-5)). Samsung is notably absent. On many Androids, **the stock camera's slo-mo plus import is the only way to get 240 fps.**

---

## 3. Can RinkBuddy actually use those modes?

### Web capture (the current PWA / WKWebView / Android WebView)

**iOS (Safari and WKWebView).**
- WebKit builds its list of camera modes from `AVCaptureDevice.formats`, but it **keeps only the first format for each resolution**: `presets.findIf(... size == preset.size()) ... continue;` ([AVVideoCaptureSource.mm, `generatePresets`](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/mediastream/cocoa/AVVideoCaptureSource.mm)).
- The high-speed formats (1080p120/240) share 1920×1080 with the standard format, so in practice they are never selectable.
- Expect **30 fps by default and at most 60**. WebKit also has a long history of frame-rate constraint bugs ([210186](https://bugs.webkit.org/show_bug.cgi?id=210186), [196214](https://bugs.webkit.org/show_bug.cgi?id=196214) low-light fps collapse, [179994](https://bugs.webkit.org/show_bug.cgi?id=179994)).
- To confirm on a device, request `frameRate:{ideal:60}` and read `track.getSettings().frameRate`.

**Android (Chrome and WebView).**
- Chromium's `VideoCaptureCamera2` opens a normal `createCaptureSession` and picks from `CONTROL_AE_AVAILABLE_TARGET_FPS_RANGES`. It never calls `createConstrainedHighSpeedCaptureSession` ([Chromium source](https://chromium.googlesource.com/chromium/src/+/main/media/capture/video/android/java/src/org/chromium/media/VideoCaptureCamera2.java)).
- Those ranges top out at **30, or 60 on some devices**.

**Conclusion for the web path:** 60 fps is the ceiling, and it is not guaranteed. **Quick win:** add `frameRate:{ideal:60, min:30}` now. That alone doubles temporal resolution for most users.

### Native capture inside the Capacitor app

**iOS.**
- AVFoundation reaches every mode. Pick an `AVCaptureDevice.Format` whose [`videoSupportedFrameRateRanges`](https://developer.apple.com/documentation/avfoundation/avcapturedevice/format/videosupportedframerateranges) includes 120 or 240, set it as [`activeFormat`](https://developer.apple.com/documentation/avfoundation/avcapturedevice/activeformat) (which is mutually exclusive with session presets), then set the min and max frame duration.
- [`activeMaxExposureDuration`](https://developer.apple.com/documentation/avfoundation/avcapturedevice/activemaxexposureduration) caps the shutter while auto-exposure still runs. This matters for blur (§4).
- Record with `AVCaptureMovieFileOutput`, or with `AVAssetWriter` if you want a ring buffer.

**Android.**
- CameraX 1.5.1+ has `HighSpeedVideoSessionConfig` and `Recorder.getHighSpeedVideoCapabilities()` for 120/240 fps ([blog](https://developer.android.com/blog/posts/high-speed-capture-and-slow-motion-video-with-camera-x-1-5)).
- Keep `setSlowMotionEnabled(false)`. With it on, CameraX re-encodes to a 30 fps file with stretched timestamps. The frames survive, but the timestamps become misleading for airtime math.
- Preview stays at about 30 fps. Use a normal 60 fps session as the fallback.

### Existing plugins

**[@capacitor/camera](https://capacitorjs.com/docs/apis/camera).**
- Version 8.1+ adds `recordVideo()` (options are only save/metadata/persistence, with no fps control) and `chooseFromGallery({mediaType: Video})`.
- RinkBuddy has **8.0.2** installed, which is image-only. The installed iOS code uses `UIImagePickerController`/`PHPicker`.

**[@capacitor-community/camera-preview](https://github.com/capacitor-community/camera-preview).**
- The native preview sits behind a transparent webview, and it has `startRecordVideo()`.
- Its README documents no frame-rate option, so treat it as 30 fps unless you fork it.

**[@capgo/camera-preview](https://github.com/Cap-go/capacitor-camera-preview).**
- The most feature-rich option (manual focus, exposure, zoom, lens).
- A frame-rate API (`getSupportedVideoFrameRates` / `setVideoFrameRate`) was specified in [issue #371](https://github.com/Cap-go/capacitor-camera-preview/issues/371), now closed. As specified, it uses `CONTROL_AE_TARGET_FPS_RANGE` on Android, i.e. **not** high-speed sessions. So even if it shipped, Android would likely stop at 60 fps.
- **Best base to fork** for iOS 120/240 fps.

### Importing slo-mo from Photos (the zero-native-code path)

**Web path.**
- Since iOS 13.6.1, `<input type=file>` hands websites **the original camera-roll file** (HEVC .mov) instead of a 720p H.264 transcode ([Apple forums](https://developer.apple.com/forums/thread/658708)).
- A slo-mo original is a full-rate file (verified above for 4K120). The slow-motion ramp is only playback metadata.
- **Caveat:** apps that load picks through `PHPicker.loadFileRepresentation` see `nominalFrameRate = 30` for 120/240 fps slo-mo. Apple's fix is `PHImageManager.requestAVAsset` with `version = .original` ([Apple forums 734412](https://developer.apple.com/forums/thread/734412)).

**Action:** a 30-minute device test.
1. Shoot 240 fps slo-mo.
2. Import it through (a) Safari `<input>`, (b) the Capacitor WKWebView `<input>`, and (c) Camera 8.1 `chooseFromGallery`.
3. Run `ffprobe -count_frames` on the server copy.

If any route delivers about 30 fps, route imports through a tiny native picker (the `.original` request, about 2 days of work).

**Server side:** always read the true fps from the container. Never assume 30. `index.html` currently hard-codes "Assume ~30fps".

---

## 4. Trade-offs at an ice rink

**Light and shutter.**
- Community rinks are lit to about **50–75 fc (540–800 lux)**. Broadcast arenas are lit to 150–200 fc ([Duvon](https://duvonlighting.com/lighting-guides/indoor-ice-rink-lighting-standards-guide)).
- At 1/240 s, f/1.78 on the main camera needs roughly ISO 400–800 (my calculation). The reflective ice helps. Noise is acceptable on the main camera but worse on the telephoto: f/2.8 needs about 2.5× more ISO.

**Motion blur, the hidden win of high fps.**
- Shutter can't be longer than 1/fps.
- A skater moving at 6 m/s blurs **10 cm at 1/60 s** but **2.5 cm at 1/240 s**.
- Arms in a 3 rev/s rotation move about 13 m/s: **22 cm vs 5.5 cm** of blur.
- Pose estimators fail on smeared limbs, so a native module should cap exposure (`activeMaxExposureDuration`) even at 60 fps.

**Flicker.**
- US mains are 60 Hz, so non-flicker-free lights pulse at 120 Hz. Dimmed LEDs also pulse from PWM (pulse-width modulation, i.e. dimming by rapid on/off switching) ([Swing Catalyst](https://support.swingcatalyst.com/hc/en-us/articles/14758137627548-How-to-mitigate-LED-light-flicker), [Wikipedia](https://en.wikipedia.org/wiki/Temporal_light_interference)).
- At **240 fps each frame sees half a flicker cycle**, so brightness pulses frame to frame. That pulsing is noise for motion-energy detectors.
- **120 fps with a 1/120 s shutter integrates exactly one cycle and is flicker-neutral.** 60 fps with 1/120 s is also safe.
- This is a strong argument for **120 fps as the default high-speed mode in North America** (100 fps / 1/100 s in 50 Hz countries; iPhone Pros offer 100 fps).

**Distance and resolution (the real limit).** A rink is 61×26 m.

| Setup | Skater height in frame |
|---|---|
| Main camera (24 mm eq.), 1080p, skater 20 m away | about **80 px** tall (1.5 m in about 20 m of vertical field of view) |
| Same distance, 4K | about 160 px |
| Same distance, 2× crop | about 160 px |
| Same distance, 5× telephoto | about **400 px** |

- Pose models need about 150–200+ px, and 03 already recommends cropping.
- Apple lists 4K120 as **main-camera-only**. I found no evidence that iPhone telephotos offer >60 fps; enumerate `formats` on a device to confirm.

The practical rule:

| Skater distance | Best mode |
|---|---|
| **Near** (<10 m, e.g. filming a jump from the boards at its takeoff spot) | 1080p240 or 4K120 main |
| **Mid** (10–20 m) | **1080p120 or 4K120 main + crop** |
| **Far** (whole-rink session) | **4K60 on the telephoto / 2×**, cropped on the server |

**Stabilization.** High-speed formats get less electronic stabilization. Require a tripod or a clamp on the boards anyway: pose tracking and motion detection assume a static camera.

**File size and upload** (HEVC; per minute):

| Mode | Size per minute | Source |
|---|---|---|
| 1080p30 | ~60 MB | iOS Settings-screen figure |
| 1080p60 | ~90 MB | same |
| 4K60 | ~400 MB | same |
| 1080p120 | ~170 MB | [iDB](https://www.idownloadblog.com/2017/11/22/how-to-shoot-slo-mo-video-1080p-at-240fps-iphone/) |
| 1080p240 | ~480 MB | [iDB](https://www.idownloadblog.com/2017/11/22/how-to-shoot-slo-mo-video-1080p-at-240fps-iphone/) |
| 4K120 | **650–925 MB** | measured |

- Rink Wi-Fi is typically poor. A 10-minute 4K120 session is about 8 GB, which can't be uploaded raw.
- **Event windows only:** 2.5 s × 20 jumps at 1080p120 is about 140 MB. Cropped to the skater at 720p it is **under 30 MB**.

**Battery, heat and length.**
- Sustained 4K120 plus on-device ML is the worst case for heat. Plan sessions around 1080p120 plus a ring buffer.
- Apple publishes no slo-mo length limit (it is storage-bound). Still, warn parents about storage before long high-speed sessions.

---

## 5. On-device processing

**Apple Vision.**
- [`VNDetectHumanBodyPoseRequest`](https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest) (iOS 14+) returns 19 joints for multiple people and runs on the Neural Engine. Developers report about 8 ms per frame, 30 fps sustained on iPhone 12, and 60 fps on 13 Pro and newer ([DEV](https://dev.to/benjamin_pires_59127eddff/on-device-pose-estimation-on-ios-what-actually-works-in-production-not-just-research-papers-48ma)).
- [`VNVideoProcessor`](https://developer.apple.com/documentation/vision/vnvideoprocessor) does **offline analysis of a video file**, so it can run on an imported slo-mo.
- [`VNDetectHumanBodyPose3DRequest`](https://developer.apple.com/documentation/vision/vndetecthumanbodypose3drequest) (iOS 17+) tracks one person only.

**Create ML [`MLActionClassifier`](https://developer.apple.com/documentation/createml/mlactionclassifier).**
- Trains on labeled video clips, using Vision pose underneath, and exports to Core ML.
- It is good for v3 on-device "jump / spin / stop / other" once RinkBuddy has labels.

**MediaPipe Pose Landmarker.**
- Has IMAGE, VIDEO and LIVE_STREAM modes and a configurable `num_poses` ([docs](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker)). Works on iOS and Android and is Apache-2.0.
- **RTMPose-s** runs at 70+ fps on a Snapdragon 865 (see 03).

**Budget.** Pose on every frame of a 240 fps minute (14,400 frames at about 8–15 ms each) takes 2–4 minutes, which is too slow to wait for. So use **two passes**:
1. Decode a 15 fps, 360p proxy. Run person detection plus pose or frame-difference energy, then find candidate events (airborne ankles, rotation bursts, hard decelerations). This takes about 1 s per minute of video.
2. Keep −1.5 s / +1.0 s around each event at full frame rate. Optionally run full-rate pose only there: 2.5 s × 240 fps = 600 frames, about 6 s.
3. **Upload only those bursts** (cropped to the skater) plus the 15 fps proxy for context and the LLM summary.

This also serves the COPPA-minded "skeletons and crops leave the phone" posture from 03.

---

## 6. Capture UX from comparable apps

- **SwingVision (tennis):** a phone on the fence top via its "Swing Stick", 2 ft above the fence, with both baselines in frame. It recommends **60 fps** and runs its AI on the device ([setup](https://swing.vision/guides/set-up-your-recording), [Tennis.com](https://www.tennis.com/news/articles/swingvision-delivers-pro-level-insights-for-recreational-players)).
- **HomeCourt (basketball):** a tripod 3–5 ft high near half court. An AR overlay makes the user align the hoop in a box, and the app then detects shots automatically ([help](https://help.homecourt.ai/hc/en-us/articles/9344374524179-How-should-I-set-up-my-device)).
- **Sportsbox AI (golf 3D):** a tripod about 8 ft away, face-on, with the full body visible. The app sets fps itself, **requires ≥120 fps for slo-mo imports**, and rejects clips that are only partly slow-motion ([guide](https://help.sportsbox.ai/why-did-my-analysis-not-work)).
- **OnForm / Hudl Technique:** record up to **240 fps**, with shutter-speed tools to cut blur and auto-detection of swings. OnForm warns that imported video "may not be consistent" ([OnForm](https://apps.apple.com/in/app/onform-video-analysis-app/id1490334045), [Hudl](https://hudl-technique-formerly-ubersense-slow-motion-video-analysis.appstor.io/)).
- **Carv (ski):** its "Video Coach" mode has a friend film while the video syncs to sensor data. The flow is vertical-first and one tap ([Carv](https://getcarv.com/blog/video-mode-bringing-a-new-dimension-to-carv)).

**Motorized auto-tracking (DockKit).**
- [DockKit](https://developer.apple.com/documentation/dockkit) (iOS 17+) gives system person tracking to any camera app, or lets the app drive tracking itself. Manual orientation commands are limited to **2 per second** ([DockAccessory](https://developer.apple.com/documentation/dockkit/dockaccessory)).
- Hardware: the Insta360 Flow 2 Pro (360° continuous pan, about $111–150 ([Insta360](https://www.insta360.com/product/insta360-flow2-pro), [9to5Toys](https://9to5toys.com/2026/02/18/insta360-flow-2-pro-gimbal-apple-dockkit-subject-tracking-gesture-control-2/))) and the Belkin Auto-Tracking Stand Pro (360° pan, 90° tilt, 5 h battery ([Belkin](https://www.belkin.com/pr-belkin-unveils-the-auto-tracking-stand-pro-featuring-dockkit.html))).
- **Could it follow a skater?** Mechanically yes. A skater at 8 m/s, 15 m away, needs about 30°/s of pan. In practice, DockKit is tuned for people in rooms. At 20–30 m on a public session with 20 skaters it will lose the small target or switch to another skater.
- It is worth a **pilot for private lessons and freestyle ice** with the app feeding its own tracked box. Don't build v1 around it.

**UX to copy:**
- A setup screen with a live **"skater height" meter** (target ≥ 1/4 of the frame).
- Landscape lock.
- A tripod or board-clamp prompt.
- A **"tap your skater"** lock.
- Mode auto-selection (distance → lens and fps).
- Hands-free start with a countdown or motion start, plus Apple Watch or Bluetooth-remote start later.
- An **"import a slo-mo" card** that explains the iPhone Camera → Slo-mo mode to parents.

---

## 7. Recommended capture architecture

**Defaults**

| Situation | Mode |
|---|---|
| Native, mid distance | **1080p120 main camera, shutter 1/120 s (1/100 s in 50 Hz countries), HEVC** |
| Skater within about 10 m (jump-drill mode) | 240 fps |
| Whole-rink wide shot | 4K60 on the 2× or telephoto lens |
| Web fallback | 1080p at the highest fps granted (request 60) |
| Import | accept any file; read the true fps on the server |

**Phase 0: this week, about 2–3 days, web only**
1. `getUserMedia` `frameRate:{ideal:60}`; log `getSettings()`.
2. The server reads the real fps (`ffprobe`), and burst extraction uses native frames instead of 1 fps.
3. Promote **"Import slo-mo video"** in the UI with a 3-step guide.
4. Run the import test from §3 on an iPhone and a Galaxy.

**Phase 1: 2–3 weeks iOS, 2 weeks Android**
- A native capture plugin: fork @capgo/camera-preview, or write about 800 lines of Swift / Kotlin.
- iOS: format enumeration, choosing 120/240 or a 60 fallback; lens choice; exposure cap; AVAssetWriter.
- Android: CameraX 1.5 with high-speed where `getHighSpeedVideoCapabilities` is non-null, otherwise 60 fps.
- The web UI stays in charge and the native preview sits under the webview.
- Also a native `.original` slo-mo picker on iOS.

**Phase 2: 2–3 weeks**
- On-device event finder (Vision / MediaPipe on the 15 fps proxy).
- A ring buffer keeps full-rate footage only around events.
- Upload cropped bursts plus the proxy.
- This cuts upload about 20–50× and gives live "zoom in / skater too small" coaching.

**Phase 3: optional, about 1 week**
- DockKit custom tracking pilot.
- An on-device Create ML action classifier once labels exist.

**Is leaving the PWA necessary?**
- **Not for Phase 0.** Web capture at up to 60 fps plus slo-mo import already fixes most of the 1 fps problem.
- **A native capture *module* is necessary** for reliable 120/240 fps in-app, shutter control, lens selection, and on-device triggering. WebKit's per-resolution format dedup and Chromium's non-high-speed Camera2 path make these impossible from JavaScript.
- Keep the Capacitor shell and the single-file UI, and add one native plugin per platform. **Do not rewrite the app natively.**

---

## Sources
Apple specs: [18 Pro](https://www.apple.com/iphone-18-pro/specs/) · [17](https://www.apple.com/iphone-17/specs/) · [16 Pro Max](https://support.apple.com/en-us/121032) · [15](https://support.apple.com/en-us/111831) · [SE 3](https://support.apple.com/en-us/111866)

Android specs: [Pixel 9](https://store.google.com/us/product/pixel_9_specs?hl=en-US) · [Pixel 10](https://store.google.com/product/pixel_10_specs?hl=en-US) · [Samsung A-series](https://www.samsung.com/us/support/answer/ANS10004543/) · [S26 Ultra](https://www.sammobile.com/news/all-new-camera-features-galaxy-s26-ultra-explained/) · [GSMArena A16](https://www.gsmarena.com/samsung_galaxy_a16_5g-review-2758p5.php)

Market share: [StatCounter US](https://gs.statcounter.com/vendor-market-share/mobile/united-states-of-america) · [TelemetryDeck](https://telemetrydeck.com/survey/apple/iPhone/models/)

Web capture: [WebKit AVVideoCaptureSource](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/mediastream/cocoa/AVVideoCaptureSource.mm) · [Chromium VideoCaptureCamera2](https://chromium.googlesource.com/chromium/src/+/main/media/capture/video/android/java/src/org/chromium/media/VideoCaptureCamera2.java) · [WebKit 210186](https://bugs.webkit.org/show_bug.cgi?id=210186)

Native capture and import: [CameraX 1.5 high-speed](https://developer.android.com/blog/posts/high-speed-capture-and-slow-motion-video-with-camera-x-1-5) · [AVFoundation activeFormat](https://developer.apple.com/documentation/avfoundation/avcapturedevice/activeformat) · [iOS file-input originals](https://developer.apple.com/forums/thread/658708) · [PHPicker slo-mo fps](https://developer.apple.com/forums/thread/734412)

Plugins: [Capacitor Camera](https://capacitorjs.com/docs/apis/camera) · [camera-preview](https://github.com/capacitor-community/camera-preview) · [@capgo #371](https://github.com/Cap-go/capacitor-camera-preview/issues/371)

On-device ML: [Vision](https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest) · [MediaPipe](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker)

Tracking hardware: [DockKit](https://developer.apple.com/documentation/dockkit)

Rink capture conditions: [LED flicker](https://support.swingcatalyst.com/hc/en-us/articles/14758137627548-How-to-mitigate-LED-light-flicker) · [Rink lighting](https://duvonlighting.com/lighting-guides/indoor-ice-rink-lighting-standards-guide) · [iDB file sizes](https://www.idownloadblog.com/2017/11/22/how-to-shoot-slo-mo-video-1080p-at-240fps-iphone/)

Comparable apps: [SwingVision](https://swing.vision/guides/set-up-your-recording) · [HomeCourt](https://help.homecourt.ai/hc/en-us/articles/9344374524179-How-should-I-set-up-my-device) · [Sportsbox](https://help.sportsbox.ai/why-did-my-analysis-not-work) · [Carv](https://getcarv.com/blog/video-mode-bringing-a-new-dimension-to-carv)
