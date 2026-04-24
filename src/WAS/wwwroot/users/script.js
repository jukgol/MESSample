let roles = [];
let allUsers = [];
let currentUser = null;

async function init() {
    await loadRoles();
    await loadUsers();
    setupEventListeners();
}

async function loadRoles() {
    try {
        const response = await fetch('/api/Users/roles');
        roles = await response.json();
        const roleSelect = document.getElementById('role-code');
        
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.ROLE_CODE;
            option.textContent = role.ROLE_NAME;
            roleSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to load roles:', err);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/api/Users');
        allUsers = await response.json();
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';

        allUsers.forEach(user => {
            const div = document.createElement('div');
            div.className = 'user-item';
            div.innerHTML = `
                <span class="user-name">${user.USER_NAME} (${user.LOGIN_ID})</span>
                <span class="user-role">${user.ROLE_NAME} | ${user.IS_ACTIVE === 'Y' ? 'Active' : 'Inactive'}</span>
            `;
            div.onclick = () => selectUser(user);
            userList.appendChild(div);
        });
    } catch (err) {
        console.error('Failed to load users:', err);
    }
}

function selectUser(user) {
    currentUser = user;
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    // event.currentTarget를 사용하기 위해 onclick 핸들러 수정 필요할 수 있으나 div.onclick에서 처리됨
    showForm('edit', user);
}

function showForm(mode, data = null) {
    const formContainer = document.getElementById('form-container');
    const emptyState = document.getElementById('empty-state');
    const formTitle = document.getElementById('form-title');
    const btnSave = document.getElementById('btn-save');
    const btnRandom = document.getElementById('btn-random');
    const btnDelete = document.getElementById('btn-delete');

    emptyState.style.display = 'none';
    formContainer.style.display = 'block';

    if (mode === 'add') {
        formTitle.textContent = 'Add New User';
        btnSave.textContent = 'Create';
        btnRandom.style.display = 'inline-block';
        btnDelete.style.display = 'none';
        
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        currentUser = null;
        document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    } else {
        formTitle.textContent = 'Edit User';
        btnSave.textContent = 'Update';
        btnRandom.style.display = 'none';
        btnDelete.style.display = 'block';
        
        document.getElementById('user-id').value = data.USER_ID;
        document.getElementById('login-id').value = data.LOGIN_ID;
        document.getElementById('password').value = data.PASSWORD; // 가리지 않고 보여줌
        document.getElementById('user-name').value = data.USER_NAME;
        document.getElementById('role-code').value = data.ROLE_CODE;
        document.getElementById('is-active').value = data.IS_ACTIVE;
    }
}

function generateRandomUser() {
    // 1. Login ID: newid1, newid2 ... 순차적으로 없는 번호 찾기
    let num = 1;
    let newId = `newid${num}`;
    while (allUsers.some(u => u.LOGIN_ID.toLowerCase() === newId.toLowerCase())) {
        num++;
        newId = `newid${num}`;
    }

    // 2. User Name: 랜덤 3글자 (대문자 알파벳 조합)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomName = '';
    for (let i = 0; i < 3; i++) {
        randomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 폼에 채우기
    document.getElementById('login-id').value = newId;
    document.getElementById('password').value = '1';
    document.getElementById('user-name').value = randomName;
    
    // 기본값 설정 (있으면)
    if (roles.length > 0) {
        document.getElementById('role-code').value = roles[0].ROLE_CODE;
    }
}

async function handleSave(e) {
    e.preventDefault();
    
    const userId = document.getElementById('user-id').value;
    const isEdit = !!userId;
    
    const userData = {
        LOGIN_ID: document.getElementById('login-id').value,
        PASSWORD: document.getElementById('password').value,
        USER_NAME: document.getElementById('user-name').value,
        ROLE_CODE: document.getElementById('role-code').value,
        IS_ACTIVE: document.getElementById('is-active').value
    };

    try {
        const url = isEdit ? `/api/Users/${userId}` : '/api/Users';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert(isEdit ? 'Updated successfully' : 'Created successfully');
            await loadUsers();
            if (!isEdit) {
                document.getElementById('empty-state').style.display = 'flex';
                document.getElementById('form-container').style.display = 'none';
            }
        } else {
            const err = await response.json();
            alert('Error: ' + err.Message);
        }
    } catch (err) {
        alert('Failed to save: ' + err.message);
    }
}

async function handleDelete() {
    if (!currentUser || !confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`/api/Users/${currentUser.USER_ID}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Deleted successfully');
            await loadUsers();
            document.getElementById('empty-state').style.display = 'flex';
            document.getElementById('form-container').style.display = 'none';
        } else {
            const err = await response.json();
            alert('Error: ' + err.Message);
        }
    } catch (err) {
        alert('Failed to delete: ' + err.message);
    }
}

function setupEventListeners() {
    document.getElementById('btn-add-user').onclick = () => showForm('add');
    document.getElementById('btn-random').onclick = generateRandomUser;
    document.getElementById('user-form').onsubmit = handleSave;
    document.getElementById('btn-delete').onclick = handleDelete;
}

window.onload = init;
