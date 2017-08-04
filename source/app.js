(function() {
    "use strict"

    if (!window.addEventListener) return // Check for IE9+
    var options = INSTALL_OPTIONS
    var element

    /* get z-index */
    function getMaxZIndex() {
        var max = 0
        var elements = document.getElementsByTagName('*')

        Array.prototype.slice.call(elements).forEach(function(element) {
            var zIndex = parseInt(document.defaultView.getComputedStyle(element).zIndex, 10)

            max = zIndex ? Math.max(max, zIndex) : max
        })

        return max
    }
    /* get z-index */
    /* cookie handler function */
    function createCookie(name, value, days) {
        if (days) {
            var date = new Date()
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
            var expires = "; expires=" + date.toGMTString()
        } else var expires = ""
        document.cookie = name + "=" + value + expires + "; path=/"
    }

    function readCookie(name) {
        var nameEQ = name + "="
        var ca = document.cookie.split(';')
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') c = c.substring(1, c.length)
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
        }
        return null
    }
    /* cookie handler function */

    // updateElement runs every time the options are updated.
    // Most of your code will end up inside this function.

    function updateElement() {
        /* localstorage expired */
        if (typeof(Storage) !== "undefined") {
            var localStorageValid = localStorage.tibrrCookieConsent && new Date(parseInt(localStorage.tibrrCookieConsent, 10)) >= new Date()
        }
        /* localstorage expired */
        if ((INSTALL_ID == 'preview') || ((readCookie('tibrrCookieConsent') == null) && ((localStorageValid == false) || (localStorageValid == undefined)))) {
            element = INSTALL.createElement({
                "selector": "body",
                "method": "append"
            }, element)
            element.setAttribute('app', 'tibrr-cookie-consent')
            element.style.backgroundColor = options.backgroundColor
            if (options.location == 'top') {
                element.style.top = '0'
            } else {
                element.style.bottom = '0'
            }
            element.style.zIndex = getMaxZIndex() + 1

            var elementContainer = document.createElement('DIV')
            elementContainer.className = 'tibrr-cookie-consent-container'
            element.appendChild(elementContainer)

            var elementText = document.createElement("DIV")
            elementText.className = 'tibrr-cookie-consent-text'
            elementText.textContent = options.message
            elementText.style.color = options.textColor
            elementContainer.appendChild(elementText)

            var elementButtonContainer = document.createElement('DIV')
            elementButtonContainer.className = 'tibrr-cookie-consent-button'
            elementContainer.appendChild(elementButtonContainer)

            var elementButton = document.createElement('BUTTON')
            elementButton.textContent = options.buttonText
            elementButton.style.borderColor = options.buttonBorderColor
            elementButtonContainer.appendChild(elementButton)

            // user set styling
            var elementStyle = document.createElement('STYLE')
            elementStyle.innerHTML = 'cloudflare-app[app="tibrr-cookie-consent"] > .tibrr-cookie-consent-container > .tibrr-cookie-consent-button > button {background-color: ' + options.buttonColor + '; color: ' + options.buttonTextColor + ';} cloudflare-app[app="tibrr-cookie-consent"] > .tibrr-cookie-consent-container > .tibrr-cookie-consent-button > button:hover {background-color: ' + options.buttonHoverColor + '; color: ' + options.buttonHoverTextColor + ';}';
            element.appendChild(elementStyle)

            // add button onclick event
            elementButton.onclick = function() {
                // disable button in preview mode
                if (INSTALL_ID != 'preview') {
                    element.style.display = 'none'
                    if (typeof(Storage) !== "undefined") {
                        var askAgainIn = new Date()
                        askAgainIn.setDate(askAgainIn.getDate() + options.cookieLifetime)
                        localStorage.tibrrCookieConsent = askAgainIn.getTime()
                    } else {
                        createCookie('tibrrCookieConsent', '1', options.cookieLifetime)
                    }
                }
            }
        }
    }
    // This code ensures that the app doesn't run before the page is loaded.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateElement)
    } else {
        updateElement()
    }

    // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
    window.INSTALL_SCOPE = {
        setOptions: function setOptions(nextOptions) {
            options = nextOptions

            updateElement()
        }
    }
}())