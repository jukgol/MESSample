let roles = [];
let allUsers = [];
let currentUser = null;

async function init() {
    await loadRoles();
    await loadUsers();
    setupEventListeners();
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    toast.style.backgroundColor = isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.95)';
    toast.classList.add('show');
    
    // 자동 삭제 타이머
    let timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000); // 버튼이 생겼으므로 시간을 조금 더 늘림

    // 닫기 버튼 클릭 이벤트
    toast.querySelector('.toast-close').onclick = () => {
        clearTimeout(timeoutId);
        toast.classList.remove('show');
    };
}

async function loadRoles() {
    try {
        const response = await fetch('/api/system/Users/roles');
        const data = await response.json();
        console.log('Roles loaded:', data);
        roles = data;
        
        const roleSelect = document.getElementById('role-code');
        roleSelect.innerHTML = '<option value="">Select Role</option>';
        
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
        const response = await fetch('/api/system/Users');
        const data = await response.json();
        console.log('Users loaded:', data);
        allUsers = data;
        
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
    
    // 선택된 아이템 강조 표시 찾기
    const items = document.querySelectorAll('.user-item');
    items.forEach(item => {
        if (item.textContent.includes(`(${user.LOGIN_ID})`)) {
            item.classList.add('active');
        }
    });

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
        document.getElementById('password').value = data.PASSWORD; 
        document.getElementById('user-name').value = data.USER_NAME;
        document.getElementById('role-code').value = data.ROLE_CODE;
        document.getElementById('is-active').value = data.IS_ACTIVE;
    }
}

function generateRandomUser() {
    // 1. Login ID: newid1, newid2 ... 순차적으로 없는 번호 찾기
    let num = 1;
    let newId = `newid${num}`;
    while (allUsers.some(u => u.LOGIN_ID && u.LOGIN_ID.toLowerCase() === newId.toLowerCase())) {
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
    document.getElementById('is-active').value = 'Y';
    
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
        const url = isEdit ? `/api/system/Users/${userId}` : '/api/system/Users';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showToast(isEdit ? 'Updated successfully' : 'Created successfully');
            await loadUsers();
            if (!isEdit) {
                document.getElementById('empty-state').style.display = 'flex';
                document.getElementById('form-container').style.display = 'none';
            }
        } else {
            const err = await response.json();
            const msg = err.message || err.Message || 'Unknown error occurred';
            console.error('Save failed:', err);
            showToast('Error: ' + msg, true);
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showToast('Failed to save: ' + err.message, true);
    }
}

async function handleDelete() {
    if (!currentUser || !confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`/api/system/Users/${currentUser.USER_ID}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Deleted successfully');
            await loadUsers();
            document.getElementById('empty-state').style.display = 'flex';
            document.getElementById('form-container').style.display = 'none';
        } else {
            const err = await response.json();
            const msg = err.message || err.Message || 'Unknown error occurred';
            console.error('Delete failed:', err);
            showToast('Error: ' + msg, true);
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showToast('Failed to delete: ' + err.message, true);
    }
}

function setupEventListeners() {
    document.getElementById('btn-add-user').onclick = () => showForm('add');
    document.getElementById('btn-random').onclick = generateRandomUser;
    document.getElementById('user-form').onsubmit = handleSave;
    document.getElementById('btn-delete').onclick = handleDelete;
}

window.onload = init;
