(function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const postForm = document.getElementById('post-form');
    const authSection = document.getElementById('auth-section');
    const feedSection = document.getElementById('feed-section');
    const postsDiv = document.getElementById('posts');
    const currentUserSpan = document.getElementById('current-user');
    const logoutBtn = document.getElementById('logout-btn');

    function getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    function setUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getPosts() {
        return JSON.parse(localStorage.getItem('posts') || '[]');
    }

    function setPosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function saveSession(username) {
        localStorage.setItem('session', username);
    }

    function clearSession() {
        localStorage.removeItem('session');
    }

    function getSession() {
        return localStorage.getItem('session');
    }

    function renderPosts() {
        const posts = getPosts().sort((a,b) => b.score - a.score);
        postsDiv.innerHTML = '';
        for (const post of posts) {
            const card = document.createElement('div');
            card.className = 'card';
            const body = document.createElement('div');
            body.className = 'card-body';

            const content = document.createElement('p');
            content.textContent = post.content;
            body.appendChild(content);

            const footer = document.createElement('div');
            footer.className = 'd-flex justify-content-between align-items-center';

            const voteGroup = document.createElement('div');
            const up = document.createElement('span');
            up.className = 'vote-btn me-2 text-success';
            up.textContent = '▲';
            up.addEventListener('click', () => vote(post.id, 1));
            const down = document.createElement('span');
            down.className = 'vote-btn ms-2 text-danger';
            down.textContent = '▼';
            down.addEventListener('click', () => vote(post.id, -1));
            const score = document.createElement('span');
            score.className = 'mx-2';
            score.textContent = post.score;
            voteGroup.appendChild(up);
            voteGroup.appendChild(score);
            voteGroup.appendChild(down);

            const info = document.createElement('small');
            info.textContent = `by ${post.author}`;
            footer.appendChild(info);
            footer.appendChild(voteGroup);

            if(getSession() === 'admin') {
                const delBtn = document.createElement('button');
                delBtn.className = 'btn btn-sm btn-danger';
                delBtn.textContent = 'Delete';
                delBtn.addEventListener('click', () => deletePost(post.id));
                footer.appendChild(delBtn);
            }

            card.appendChild(body);
            card.appendChild(footer);
            postsDiv.appendChild(card);
        }
    }

    function vote(id, delta) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if(!post) return;
        post.score += delta;
        setPosts(posts);
        renderPosts();
    }

    function deletePost(id) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== id);
        setPosts(posts);
        renderPosts();
    }

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            saveSession(username);
            showFeed();
        } else {
            alert('Invalid credentials');
        }
    });

    registerForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const users = getUsers();
        if (users.find(u => u.username === username)) {
            alert('Username already exists');
            return;
        }
        users.push({username, password});
        setUsers(users);
        alert('Registration successful. Please login.');
        document.getElementById('login-tab').click();
    });

    postForm.addEventListener('submit', e => {
        e.preventDefault();
        const content = document.getElementById('post-content').value;
        const posts = getPosts();
        posts.push({id: Date.now(), author: getSession(), content, score: 0});
        setPosts(posts);
        document.getElementById('post-content').value = '';
        renderPosts();
    });

    logoutBtn.addEventListener('click', () => {
        clearSession();
        showAuth();
    });

    function showFeed() {
        authSection.classList.add('d-none');
        feedSection.classList.remove('d-none');
        currentUserSpan.textContent = getSession();
        renderPosts();
    }

    function showAuth() {
        feedSection.classList.add('d-none');
        authSection.classList.remove('d-none');
    }

    // init
    if(getSession()) {
        showFeed();
    }
})();
