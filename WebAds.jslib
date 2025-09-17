mergeInto(LibraryManager.library, {
    InitAds: function (clientPtr, testMode) {
    if (window.__adsInit) return;
    window.__adsInit = true;

    var clientId = UTF8ToString(clientPtr); 
    var testFlag = testMode ? "on" : "off"; // 0 = off, 1 = on

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + clientId;
    s.setAttribute("data-adbreak-test", testFlag);
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);

    var inline = document.createElement("script");
    inline.text = ` window.adsbygoogle = window.adsbygoogle || []; var adBreak = adConfig = function (o) { adsbygoogle.push(o); };
    `;
    document.head.appendChild(inline);

    var footer = document.getElementById("unity-footer");
    if (footer) footer.style.display = "none";

    var checkReady = setInterval(function () {
            if (window.adsbygoogle && window.adsbygoogle.push) {
                clearInterval(checkReady);

                adConfig({
                    preloadAdBreaks: 'on',
                    sound: 'on',          
                    onReady: function() {
                        console.log("Ads SDK ready, preloaded.");
                    }
                });

                console.log("Ads library ready, client:", clientId, "test:", testFlag);
            }
        }, 200);
    },

    ResizeCanvas: function () {
        var canvas = document.getElementById("unity-canvas");
        if (!canvas) {
            console.warn("resizeCanvas: #unity-canvas not found");
            return;
        }

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        }

        var aspectRatio = 9 / 16; // Tỉ lệ 9:16
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var windowAspectRatio = windowWidth / windowHeight;

        if (windowAspectRatio > aspectRatio) {
            canvas.style.height = windowHeight + "px";
            canvas.style.width = (windowHeight * aspectRatio) + "px";
        } else {
            canvas.style.width = windowWidth + "px";
            canvas.style.height = (windowWidth / aspectRatio) + "px";
        }

        canvas.style.display = "block";
        canvas.style.margin = "0 auto";
    },

    ShowInterstitial: function () {
        console.log("ShowInterstitial jslib");
        if (!window.adBreak) {
            console.warn("adBreak not initialized!");
            return;
        }
        window.adBreak({
            type: 'next',
            name: 'level_complete',

            beforeAd: function () {
                console.log("Interstitial starting, pause game");
            },
            afterAd: function () {
                console.log("Interstitial finished, resume game");
            }
        });
    },

    ShowRewarded: function () {
        console.log("ShowRewarded jslib");
        if (!window.adBreak) {
            console.warn("adBreak not initialized!");
            return;
        }
        window.adBreak({
            type: 'reward',
            name: 'extra_coins',

            beforeReward: function () {
                console.log("Reward ad starting, pause game");
            },

            adDismissed: function () {
                console.log("User skipped ad, no reward");
            },

            adViewed: function () {
                console.log("User watched ad fully, give reward!");
                SendMessage("WebAdsManager", "OnRewardedAdComplete");
            },

            afterAd: function () {
                console.log("Reward ad finished, resume game");
            }
        });
    }
});