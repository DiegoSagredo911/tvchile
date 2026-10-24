/**
 * tizen-keys.js (Compatible con Samsung Smart TV 2010-2014 Orsay y 2015+ Tizen)
 * 100% JavaScript ES5 puro (sin const, let ni funciones flecha)
 */

(function () {
    'use strict';

    var widgetAPI = null;
    var tvKey = null;
    var pluginAPI = null;

    // Intentar inicializar Samsung Common API (Modelos 2010-2014 Orsay / H-Series)
    try {
        if (typeof Common !== 'undefined' && Common.API) {
            if (Common.API.Widget) widgetAPI = new Common.API.Widget();
            if (Common.API.TVKeyValue) tvKey = new Common.API.TVKeyValue();
            if (Common.API.Plugin) pluginAPI = new Common.API.Plugin();
        }
    } catch (e) {
        // En Tizen o PC no existe Common.API
    }

    // Intentar registrar teclas en Tizen OS (Modelos 2015+)
    try {
        if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
            var tizenKeys = [
                'ChannelUp', 'ChannelDown',
                'MediaPlay', 'MediaPause', 'MediaPlayPause', 'MediaStop',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
            ];
            for (var i = 0; i < tizenKeys.length; i++) {
                try {
                    tizen.tvinputdevice.registerKey(tizenKeys[i]);
                } catch (err) {}
            }
        }
    } catch (e) {}

    // Desregistrar teclas de volumen si estamos en Orsay para que el TV maneje el volumen nativo
    try {
        if (pluginAPI && tvKey) {
            if (tvKey.KEY_VOL_UP) pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
            if (tvKey.KEY_VOL_DOWN) pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
            if (tvKey.KEY_MUTE) pluginAPI.unregistKey(tvKey.KEY_MUTE);
        }
    } catch (e) {}

    // Mapeo unificado compatible con todos los modelos
    var TV_KEYS = {
        isUp: function (c) {
            return c === 38 || (tvKey && c === tvKey.KEY_UP) || c === 29460;
        },
        isDown: function (c) {
            return c === 40 || (tvKey && c === tvKey.KEY_DOWN) || c === 29461;
        },
        isLeft: function (c) {
            return c === 37 || (tvKey && c === tvKey.KEY_LEFT) || c === 4;
        },
        isRight: function (c) {
            return c === 39 || (tvKey && c === tvKey.KEY_RIGHT) || c === 5;
        },
        isEnter: function (c) {
            return c === 13 || (tvKey && c === tvKey.KEY_ENTER) || c === 29443;
        },
        isReturn: function (c) {
            return c === 10009 || c === 27 || c === 8 || (tvKey && (c === tvKey.KEY_RETURN || c === tvKey.KEY_EXIT)) || c === 88;
        },
        isChUp: function (c) {
            return c === 427 || c === 33 || (tvKey && c === tvKey.KEY_CH_UP) || c === 68;
        },
        isChDown: function (c) {
            return c === 428 || c === 34 || (tvKey && c === tvKey.KEY_CH_DOWN) || c === 65;
        },
        isPlayPause: function (c) {
            return c === 415 || c === 19 || c === 10252 || (tvKey && (c === tvKey.KEY_PLAY || c === tvKey.KEY_PAUSE));
        },
        getNumber: function (c) {
            // Teclas de teclado estándar o Tizen (0-9)
            if (c >= 48 && c <= 57) {
                return c - 48;
            }
            // Teclado numérico / Numpad
            if (c >= 96 && c <= 105) {
                return c - 96;
            }
            // Samsung Orsay TVKeyValue (2010-2014)
            if (tvKey) {
                if (c === tvKey.KEY_0 || c === 17) return 0;
                if (c === tvKey.KEY_1 || c === 101) return 1;
                if (c === tvKey.KEY_2 || c === 98) return 2;
                if (c === tvKey.KEY_3 || c === 6) return 3;
                if (c === tvKey.KEY_4 || c === 8) return 4;
                if (c === tvKey.KEY_5 || c === 9) return 5;
                if (c === tvKey.KEY_6 || c === 10) return 6;
                if (c === tvKey.KEY_7 || c === 12) return 7;
                if (c === tvKey.KEY_8 || c === 13) return 8;
                if (c === tvKey.KEY_9 || c === 14) return 9;
            }
            return -1;
        }
    };

    window.TV_KEYS = TV_KEYS;
    window.widgetAPI = widgetAPI;
    window.tvKey = tvKey;
    window.pluginAPI = pluginAPI;
})();
