class UserCard {
    static create(user) {
        return `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-info">
                    <h3>${DOMHelpers.escapeHtml(user.name)}</h3>
                    <div class="user-details">
                        <p>Email: ${DOMHelpers.escapeHtml(user.email)}</p>
                        <p>Age: ${user.age || 'Not specified'}</p>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn btn-edit" onclick="userManager.openEditModal(${user.id})">Edit</button>
                    <button class="btn btn-danger" onclick="userManager.deleteUser(${user.id})">Delete</button>
                </div>
            </div>
        `;
    }

    static renderList(users, container) {
        if (!users || users.length === 0) {
            DOMHelpers.setEmptyState(container, 'No users found. Add one to get started!');
            return;
        }

        const userCards = users.map(user => this.create(user)).join('');
        container.innerHTML = userCards;
    }
}