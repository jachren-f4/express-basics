class MessageHandler {
    constructor(messageElement) {
        this.messageElement = messageElement;
        this.hideTimeout = null;
    }

    show(text, type = 'info', duration = 3000) {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        DOMHelpers.showElement(this.messageElement);

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        if (duration > 0) {
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, duration);
        }
    }

    hide() {
        DOMHelpers.hideElement(this.messageElement);
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    success(text, duration = 3000) {
        this.show(text, 'success', duration);
    }

    error(text, duration = 5000) {
        this.show(text, 'error', duration);
    }

    info(text, duration = 3000) {
        this.show(text, 'info', duration);
    }

    warning(text, duration = 4000) {
        this.show(text, 'warning', duration);
    }
}