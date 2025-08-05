class UserManager {
    constructor() {
        this.api = new UserAPI();
        this.initializeElements();
        this.setupEventListeners();
        this.initialize();
    }

    initializeElements() {
        this.elements = {
            healthStatus: document.getElementById('status-text'),
            addUserForm: document.getElementById('add-user-form'),
            editUserForm: document.getElementById('edit-user-form'),
            usersContainer: document.getElementById('users-container'),
            userCount: document.getElementById('user-count'),
            refreshButton: document.getElementById('refresh-users'),
            messageDiv: document.getElementById('message'),
            editModal: document.getElementById('edit-modal')
        };

        this.messageHandler = new MessageHandler(this.elements.messageDiv);
        this.editModal = new Modal(this.elements.editModal);
    }

    setupEventListeners() {
        this.elements.addUserForm.addEventListener('submit', (e) => this.handleAddUser(e));
        this.elements.editUserForm.addEventListener('submit', (e) => this.handleEditUser(e));
        this.elements.refreshButton.addEventListener('click', () => this.loadUsers());
    }

    async initialize() {
        await this.checkHealth();
        await this.loadUsers();
    }

    async checkHealth() {
        try {
            const healthData = await this.api.checkHealth();
            this.elements.healthStatus.textContent = 'Online';
            this.elements.healthStatus.className = 'status-value online';
        } catch (error) {
            this.elements.healthStatus.textContent = 'Offline';
            this.elements.healthStatus.className = 'status-value offline';
            console.error('Health check failed:', error);
        }
    }

    async loadUsers() {
        DOMHelpers.setLoadingState(this.elements.usersContainer, 'Loading users...');
        
        try {
            const data = await this.api.getAllUsers();
            
            UserCard.renderList(data.users, this.elements.usersContainer);
            this.elements.userCount.textContent = `Total: ${data.count} users`;
        } catch (error) {
            console.error('Failed to load users:', error);
            DOMHelpers.setErrorState(
                this.elements.usersContainer, 
                'Failed to load users. Please check if the server is running.'
            );
            this.messageHandler.error('Failed to load users');
        }
    }

    async handleAddUser(e) {
        e.preventDefault();
        
        const userData = DOMHelpers.getFormData(this.elements.addUserForm);
        
        try {
            const result = await this.api.createUser(userData);
            this.messageHandler.success(result.message);
            DOMHelpers.resetForm(this.elements.addUserForm);
            await this.loadUsers();
        } catch (error) {
            console.error('Failed to add user:', error);
            this.messageHandler.error(error.message || 'Failed to add user');
        }
    }

    async openEditModal(userId) {
        try {
            const user = await this.api.getUserById(userId);
            this.editModal.populateForm(user);
            this.editModal.open();
        } catch (error) {
            console.error('Failed to load user:', error);
            this.messageHandler.error('Failed to load user data');
        }
    }

    closeModal() {
        this.editModal.close();
    }

    async handleEditUser(e) {
        e.preventDefault();
        
        const formData = DOMHelpers.getFormData(this.elements.editUserForm);
        const userId = formData.id;
        delete formData.id;
        
        try {
            const result = await this.api.updateUser(userId, formData);
            this.messageHandler.success(result.message);
            this.editModal.close();
            await this.loadUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
            this.messageHandler.error(error.message || 'Failed to update user');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        try {
            const result = await this.api.deleteUser(userId);
            this.messageHandler.success(result.message);
            await this.loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            this.messageHandler.error(error.message || 'Failed to delete user');
        }
    }
}

let userManager;