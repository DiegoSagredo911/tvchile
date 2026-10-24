/**
 * app.js - Reproductor TV Chile para Samsung Smart TV
 * Compatible con modelos Orsay (2010-2014) y Tizen (2015+ UN43JU6000G)
 * 100% ECMAScript 5 (ES5) puro
 */

(function () {
    'use strict';

    // Configuración general
    var M3U_URL = 'https://m3u.cl/lista/CL.m3u';
    var OSD_TIMEOUT_MS = 4500;
    var NUM_INPUT_TIMEOUT_MS = 1400;
    var STREAM_TIMEOUT_MS = 10000;

    // Estado de la aplicación
    var channels = [];
    var currentIndex = 0;
    var guideFocusedIndex = 0;
    var isGuideOpen = false;
    var guideRendered = false;
    var osdTimer = null;
    var numberInputTimer = null;
    var guideInactivityTimer = null;
    var currentNumberInput = '';
    var streamTimeoutTimer = null;

    // Elementos DOM
    var video = null;
    var pluginPlayer = null;
    var loader = null;
    var errorBanner = null;
    var osdBanner = null;
    var osdNumber = null;
    var osdLogo = null;
    var osdName = null;
    var osdGroup = null;
    var guideDrawer = null;
    var channelsList = null;
    var channelCounter = null;
    var numberBadge = null;
    var numberDigits = null;
    var quickHelp = null;

    // ============================================================
    // Inicialización del Widget
    // ============================================================
    function init() {
        // 1. Notificar INMEDIATAMENTE a Samsung que el widget cargó exitosamente
        // CRUCIAL: Esto cancela el temporizador de 5 segundos de la TV y evita que se cierre la app!
        try {
            if (typeof Common !== 'undefined' && Common.API && Common.API.Widget) {
                var wAPI = new Common.API.Widget();
                wAPI.sendReadyEvent();
            }
        } catch (e) {}

        try {
            var nnavi = document.getElementById('pluginObjectNNavi');
            if (nnavi && typeof nnavi.SetBannerState === 'function') {
                nnavi.SetBannerState(2);
            }
        } catch (e) {}

        // 2. Obtener referencias del DOM
        video = document.getElementById('video-player');
        pluginPlayer = document.getElementById('pluginPlayer');
        loader = document.getElementById('loader');
        errorBanner = document.getElementById('error-banner');
        osdBanner = document.getElementById('osd-banner');
        osdNumber = document.getElementById('osd-number');
        osdLogo = document.getElementById('osd-logo');
        osdName = document.getElementById('osd-name');
        osdGroup = document.getElementById('osd-group');
        guideDrawer = document.getElementById('guide-drawer');
        channelsList = document.getElementById('channels-list');
        channelCounter = document.getElementById('channel-counter');
        numberBadge = document.getElementById('number-input-badge');
        numberDigits = document.getElementById('number-input-value');
        quickHelp = document.getElementById('quick-help');

        // Configurar callbacks de reproductor de hardware si existe
        setupHardwarePlayer();

        // 3. Cargar canales de respaldo inmediato
        if (window.CHANNELS_FALLBACK && window.CHANNELS_FALLBACK.length > 0) {
            channels = window.CHANNELS_FALLBACK;
        }

        // 4. Recuperar último canal sintonizado
        var savedIndex = 0;
        try {
            savedIndex = parseInt(localStorage.getItem('tv_last_channel_idx'), 10);
        } catch (e) {
            savedIndex = 0;
        }

        if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < channels.length) {
            currentIndex = savedIndex;
        } else {
            currentIndex = 0;
        }
        guideFocusedIndex = currentIndex;

        // 5. Configurar eventos de control remoto y video
        setupKeyListeners();
        setupVideoEvents();

        // 6. Reproducir canal inicial de inmediato a pantalla completa
        tuneChannel(currentIndex);

        // 7. Actualización opcional de lista postergada para no competir con el video
        setTimeout(function () {
            fetchUpdatedPlaylist();
        }, 8000);
    }

    // ============================================================
    // Configuración de Hardware Player Samsung
    // ============================================================
    function setupHardwarePlayer() {
        if (pluginPlayer && typeof pluginPlayer.InitPlayer === 'function') {
            window.onBufferingStart = function () {
                showLoader();
            };
            window.onBufferingComplete = function () {
                hideLoader();
                hideError();
                clearTimeout(streamTimeoutTimer);
            };
            window.onRenderingComplete = function () {
                hideLoader();
                hideError();
            };
            window.onStreamNotFound = function () {
                showError('Señal no encontrada.');
            };
            window.onRenderError = function () {
                showError('Error al decodificar señal.');
            };

            try {
                pluginPlayer.OnBufferingStart = 'onBufferingStart';
                pluginPlayer.OnBufferingComplete = 'onBufferingComplete';
                pluginPlayer.OnRenderingComplete = 'onRenderingComplete';
                pluginPlayer.OnStreamNotFound = 'onStreamNotFound';
                pluginPlayer.OnRenderError = 'onRenderError';
            } catch (e) {}

            // Ocultar video HTML5 para dar paso al hardware player
            if (video) {
                video.style.display = 'none';
            }
        }
    }

    // ============================================================
    // Sintonización y Reproducción
    // ============================================================
    function tuneChannel(index) {
        if (!channels || channels.length === 0) return;

        // Ciclar índices
        if (index < 0) index = channels.length - 1;
        if (index >= channels.length) index = 0;

        currentIndex = index;
        guideFocusedIndex = index;
        try {
            localStorage.setItem('tv_last_channel_idx', currentIndex);
        } catch (e) {}

        var channel = channels[currentIndex];

        // Ocultar indicador numérico y errores previos
        if (numberBadge) numberBadge.className = 'number-input-badge hide';
        currentNumberInput = '';
        clearTimeout(numberInputTimer);
        hideError();
        showLoader();

        // Mostrar OSD informativo
        showOSD(channel, currentIndex);

        // Actualizar selección en la guía si está abierta
        if (isGuideOpen) {
            updateGuideSelection();
        }

        // Cancelar timeout previo del stream
        clearTimeout(streamTimeoutTimer);
        streamTimeoutTimer = setTimeout(function () {
            hideLoader();
        }, STREAM_TIMEOUT_MS);

        // Cargar y reproducir stream
        loadStream(channel.url);
    }

    function loadStream(url) {
        if (!url) {
            showError('URL no disponible.');
            return;
        }

        // 1. Método Hardware Player de Samsung (Orsay / Legacy)
        if (pluginPlayer && typeof pluginPlayer.InitPlayer === 'function') {
            try {
                pluginPlayer.Stop();
                pluginPlayer.ClearScreen();
                pluginPlayer.InitPlayer(url);
                pluginPlayer.SetDisplayArea(0, 0, 1280, 720);
                pluginPlayer.StartPlayback();
                return;
            } catch (e) {
                console.warn('pluginPlayer:', e);
            }
        }

        // 2. Método Video HTML5 Acelerado por Hardware (Tizen / Modern)
        if (video) {
            try {
                video.style.display = 'block';
                video.pause();
                video.src = url;
                if (video.load) video.load();
                var p = video.play();
                if (p && p.catch) {
                    p.catch(function () {});
                }
            } catch (e) {
                console.warn('HTML5 video:', e);
            }
        }
    }

    function setupVideoEvents() {
        if (!video) return;

        video.addEventListener('playing', function () {
            hideLoader();
            hideError();
            clearTimeout(streamTimeoutTimer);
        });

        video.addEventListener('waiting', function () {
            showLoader();
        });

        video.addEventListener('canplay', function () {
            hideLoader();
        });

        video.addEventListener('error', function () {
            if (!pluginPlayer || typeof pluginPlayer.InitPlayer !== 'function') {
                showError('No se pudo cargar la transmisión.');
            }
        });
    }

    // ============================================================
    // OSD: Banner Informativo
    // ============================================================
    function showOSD(channel, index) {
        clearTimeout(osdTimer);

        var numStr = String(index + 1);
        if (numStr.length === 1) numStr = '0' + numStr;

        if (osdNumber) osdNumber.textContent = numStr;
        if (osdName) osdName.textContent = channel.name || ('Canal ' + (index + 1));
        if (osdGroup) osdGroup.textContent = channel.group || 'Televisión Chilena';

        if (osdLogo) {
            if (channel.logo) {
                osdLogo.src = channel.logo;
                osdLogo.style.display = 'inline-block';
            } else {
                osdLogo.style.display = 'none';
            }
        }

        if (osdBanner) osdBanner.className = 'osd-banner';
        if (quickHelp) quickHelp.className = 'quick-help';

        osdTimer = setTimeout(function () {
            if (osdBanner) osdBanner.className = 'osd-banner hide';
            if (quickHelp) quickHelp.className = 'quick-help hide';
        }, OSD_TIMEOUT_MS);
    }

    function toggleOSD() {
        if (osdBanner && osdBanner.className.indexOf('hide') !== -1) {
            showOSD(channels[currentIndex], currentIndex);
        } else {
            if (osdBanner) osdBanner.className = 'osd-banner hide';
            if (quickHelp) quickHelp.className = 'quick-help hide';
        }
    }

    // ============================================================
    // Estados de UI (Carga, Errores)
    // ============================================================
    function showLoader() {
        if (loader) loader.className = 'loader-container';
    }

    function hideLoader() {
        if (loader) loader.className = 'loader-container hide';
    }

    function showError(msg) {
        hideLoader();
        if (errorBanner) {
            var title = errorBanner.querySelector('.error-title');
            if (title && msg) title.textContent = msg;
            errorBanner.className = 'error-banner';
        }
    }

    function hideError() {
        if (errorBanner) errorBanner.className = 'error-banner hide';
    }

    // ============================================================
    // Entrada Numérica Directa (ej: teclear '1' luego '5' -> Canal 15)
    // ============================================================
    function handleNumberKey(digit) {
        clearTimeout(numberInputTimer);
        currentNumberInput += String(digit);

        if (currentNumberInput.length > 3) {
            currentNumberInput = String(digit);
        }

        if (numberDigits) {
            numberDigits.textContent = currentNumberInput;
        }
        if (numberBadge) {
            numberBadge.className = 'number-input-badge';
        }

        numberInputTimer = setTimeout(function () {
            if (numberBadge) {
                numberBadge.className = 'number-input-badge hide';
            }
            var targetChannelNum = parseInt(currentNumberInput, 10);
            currentNumberInput = '';

            if (!isNaN(targetChannelNum) && targetChannelNum >= 1 && targetChannelNum <= channels.length) {
                tuneChannel(targetChannelNum - 1);
            }
        }, NUM_INPUT_TIMEOUT_MS);
    }

    // ============================================================
    // Guía de Canales (Construcción Ultraligera Bajo Demanda)
    // ============================================================
    function renderGuide() {
        if (!channelsList || guideRendered) return;

        if (channelCounter) {
            channelCounter.textContent = channels.length + ' canales';
        }

        var htmlArr = [];
        for (var idx = 0; idx < channels.length; idx++) {
            var channel = channels[idx];
            var num = String(idx + 1);
            if (num.length === 1) num = '0' + num;

            var cardClass = 'channel-card';
            if (idx === currentIndex) cardClass += ' current-playing';
            if (idx === guideFocusedIndex) cardClass += ' focused';

            htmlArr.push(
                '<div class="' + cardClass + '" id="card-' + idx + '" data-idx="' + idx + '">' +
                    '<div class="card-num">' + num + '</div>' +
                    '<div class="card-details">' +
                        '<div class="card-title">' + (channel.name || ('Canal ' + (idx + 1))) + '</div>' +
                        '<div class="card-tag">' + (channel.group || 'Chile') + '</div>' +
                    '</div>' +
                '</div>'
            );
        }

        channelsList.innerHTML = htmlArr.join('');

        // Delegación de eventos en un solo listener
        channelsList.onclick = function (e) {
            var target = e.target || e.srcElement;
            while (target && target !== channelsList) {
                if (target.getAttribute && target.getAttribute('data-idx') !== null) {
                    var targetIdx = parseInt(target.getAttribute('data-idx'), 10);
                    tuneChannel(targetIdx);
                    closeGuide();
                    break;
                }
                target = target.parentNode;
            }
        };

        guideRendered = true;
    }

    function resetGuideInactivityTimer() {
        clearTimeout(guideInactivityTimer);
        if (isGuideOpen) {
            guideInactivityTimer = setTimeout(function () {
                closeGuide();
            }, 20000);
        }
    }

    function openGuide() {
        isGuideOpen = true;
        if (osdBanner) osdBanner.className = 'osd-banner hide';
        if (quickHelp) quickHelp.className = 'quick-help hide';

        if (!guideRendered) {
            renderGuide();
        }

        if (guideDrawer) guideDrawer.className = 'guide-drawer';
        guideFocusedIndex = currentIndex;
        updateGuideSelection();
        scrollFocusedCardIntoView();
        resetGuideInactivityTimer();
    }

    function closeGuide() {
        isGuideOpen = false;
        clearTimeout(guideInactivityTimer);
        if (guideDrawer) guideDrawer.className = 'guide-drawer hide';
    }

    function updateGuideSelection() {
        if (!channelsList || !guideRendered) return;
        var cards = channelsList.getElementsByTagName('div');
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            if (c.getAttribute && c.getAttribute('data-idx') !== null) {
                var cardIdx = parseInt(c.getAttribute('data-idx'), 10);
                var newClass = 'channel-card';
                if (cardIdx === currentIndex) newClass += ' current-playing';
                if (cardIdx === guideFocusedIndex) newClass += ' focused';
                c.className = newClass;
            }
        }
        scrollFocusedCardIntoView();
    }

    function scrollFocusedCardIntoView() {
        var target = document.getElementById('card-' + guideFocusedIndex);
        if (target && isGuideOpen) {
            try {
                target.scrollIntoView(false);
            } catch (e) {}
        }
    }

    function moveGuideFocus(delta) {
        guideFocusedIndex += delta;
        if (guideFocusedIndex < 0) guideFocusedIndex = channels.length - 1;
        if (guideFocusedIndex >= channels.length) guideFocusedIndex = 0;
        updateGuideSelection();
    }

    // ============================================================
    // Manejo del Control Remoto / Teclado
    // ============================================================
    function setupKeyListeners() {
        document.onkeydown = function (e) {
            e = e || window.event;
            var code = e.keyCode || e.which;
            var KEYS = window.TV_KEYS;

            if (isGuideOpen) {
                resetGuideInactivityTimer();
            }

            // 1. Teclas Numéricas (0-9)
            if (KEYS && typeof KEYS.getNumber === 'function') {
                var digit = KEYS.getNumber(code);
                if (digit !== -1) {
                    handleNumberKey(digit);
                    if (e.preventDefault) e.preventDefault();
                    return false;
                }
            }

            // 2. Teclas de Navegación y Control
            if (KEYS) {
                if (KEYS.isUp(code) || KEYS.isChUp(code)) {
                    if (e.preventDefault) e.preventDefault();
                    if (isGuideOpen) {
                        moveGuideFocus(-1);
                    } else {
                        tuneChannel(currentIndex - 1);
                    }
                    return false;
                }

                if (KEYS.isDown(code) || KEYS.isChDown(code)) {
                    if (e.preventDefault) e.preventDefault();
                    if (isGuideOpen) {
                        moveGuideFocus(1);
                    } else {
                        tuneChannel(currentIndex + 1);
                    }
                    return false;
                }

                if (KEYS.isLeft(code)) {
                    if (e.preventDefault) e.preventDefault();
                    if (!isGuideOpen) {
                        openGuide();
                    } else {
                        moveGuideFocus(-10);
                    }
                    return false;
                }

                if (KEYS.isRight(code)) {
                    if (e.preventDefault) e.preventDefault();
                    if (isGuideOpen) {
                        moveGuideFocus(10);
                    } else {
                        toggleOSD();
                    }
                    return false;
                }

                if (KEYS.isEnter(code)) {
                    if (e.preventDefault) e.preventDefault();
                    if (isGuideOpen) {
                        tuneChannel(guideFocusedIndex);
                        closeGuide();
                    } else {
                        openGuide();
                    }
                    return false;
                }

                if (KEYS.isReturn(code)) {
                    if (e.preventDefault) e.preventDefault();
                    if (isGuideOpen) {
                        closeGuide();
                    } else {
                        toggleOSD();
                    }
                    return false;
                }

                if (KEYS.isPlayPause(code)) {
                    if (pluginPlayer && typeof pluginPlayer.Pause === 'function') {
                        try { pluginPlayer.Pause(); } catch (err) {}
                    } else if (video) {
                        if (video.paused) {
                            if (video.play) video.play();
                        } else {
                            if (video.pause) video.pause();
                        }
                    }
                    return false;
                }
            }
        };
    }

    // ============================================================
    // Actualización de Lista M3U mediante XMLHttpRequest
    // ============================================================
    function fetchUpdatedPlaylist() {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', M3U_URL, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        var parsed = parseM3U(xhr.responseText);
                        if (parsed && parsed.length > 0) {
                            channels = parsed;
                            guideRendered = false;
                        }
                    }
                }
            };
            xhr.send(null);
        } catch (e) {}
    }

    function parseM3U(content) {
        if (!content) return [];
        var lines = content.split('\n');
        var list = [];
        var cur = null;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].replace(/^\s+|\s+$/g, '');
            if (!line) continue;

            if (line.indexOf('#EXTINF') === 0 || line.indexOf('# EXTINF') === 0) {
                var nameMatch = line.match(/tvg-name="([^"]*)"/);
                var logoMatch = line.match(/tvg-logo="([^"]*)"/);
                var groupMatch = line.match(/group-title="([^"]*)"/);
                var titleMatch = line.match(/,\s*(.*)$/);

                var name = nameMatch ? nameMatch[1] : '';
                var display = titleMatch ? titleMatch[1].replace('✪ | CL', '').replace('✪', '').replace(/^\s+|\s+$/g, '') : name;

                cur = {
                    id: list.length + 1,
                    name: display || name || ('Canal ' + (list.length + 1)),
                    logo: logoMatch ? logoMatch[1] : '',
                    group: groupMatch ? groupMatch[1] : 'Chile',
                    url: ''
                };
            } else if (cur && (line.indexOf('http://') === 0 || line.indexOf('https://') === 0)) {
                cur.url = line;
                list.push(cur);
                cur = null;
            }
        }

        return list;
    }

    // Exponer init globalmente para <body onload="init();">
    window.init = init;
})();
