class DOMHelpers {
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static showElement(element) {
        element.classList.remove('hidden');
    }

    static hideElement(element) {
        element.classList.add('hidden');
    }

    static toggleElement(element, show) {
        if (show) {
            this.showElement(element);
        } else {
            this.hideElement(element);
        }
    }

    static clearElement(element) {
        element.innerHTML = '';
    }

    static setLoadingState(element, message = 'Loading...') {
        element.innerHTML = `<div class="loading">${message}</div>`;
    }

    static setErrorState(element, message = 'An error occurred') {
        element.innerHTML = `<div class="error">${message}</div>`;
    }

    static setEmptyState(element, message = 'No data available') {
        element.innerHTML = `<div class="no-data">${message}</div>`;
    }

    static getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') {
                data[key] = key === 'age' && value ? parseInt(value) : value;
            }
        }
        
        return data;
    }

    static resetForm(form) {
        form.reset();
    }

    static populateForm(form, data) {
        const elements = form.elements;
        
        for (const key in data) {
            if (elements[key]) {
                elements[key].value = data[key] || '';
            }
        }
    }
}