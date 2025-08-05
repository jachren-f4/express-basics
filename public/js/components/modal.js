class Modal {
    constructor(modalElement) {
        this.modal = modalElement;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('show');
    }

    close() {
        this.modal.classList.remove('show');
        this.modal.classList.add('hidden');
        
        const form = this.modal.querySelector('form');
        if (form) {
            DOMHelpers.resetForm(form);
        }
    }

    populateForm(data) {
        const form = this.modal.querySelector('form');
        if (form) {
            DOMHelpers.populateForm(form, data);
        }
    }
}