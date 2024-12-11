// 설정값 확인 및 기본값 설정
const config = {
    id: BOARD_CONFIG.id,
    siteName: BOARD_CONFIG.siteName || '블로그',
    mainColor: BOARD_CONFIG.mainColor || '#333'
};

// 공통 스타일
const commonStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    nav { background-color: ${config.mainColor}; padding: 1rem; }
    nav ul { list-style: none; display: flex; justify-content: center; gap: 2rem; }
    nav a { color: white; text-decoration: none; font-size: 1.1rem; }
    
    .content { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    
    .blog-header { text-align: center; margin-bottom: 3rem; }
    .blog-header h1 { font-size: 2.5rem; color: #333; margin-bottom: 1rem; }
    .blog-header p { color: #666; font-size: 1.1rem; }
`;

// 게시판 목록 페이지 스타일
const boardStyles = `
    .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .blog-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .blog-card:hover {
        transform: translateY(-5px);
    }

    .blog-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .blog-content {
        padding: 1.5rem;
    }

    .blog-title {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: #333;
    }

    .blog-meta {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
    }

    .blog-excerpt {
        color: #444;
        line-height: 1.5;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .pagination {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 2rem;
        padding: 1rem;
    }

    .pagination button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .pagination button:hover {
        background-color: #f5f5f5;
    }
`;

// 상세 페이지 스타일
const viewStyles = `
    .post-content {
        line-height: 1.8;
        color: #333;
        font-size: 1.1rem;
        max-width: 800px;
        margin: 0 auto;
        word-break: keep-all;
    }

    .post-content h3 {
        margin-top: 40px;
        margin-bottom: 20px;
        color: #333;
        font-size: 1.4rem;
    }

    .post-content p {
        margin-bottom: 20px;
    }

    .post-meta {
        color: #666;
        margin: 1rem 0 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
    }

    .image-gallery {
        margin: 2rem 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
    }

    .post-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .back-button {
        display: inline-block;
        margin-bottom: 2rem;
        padding: 0.5rem 1rem;
        background: ${config.mainColor};
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .back-button:hover {
        background-color: ${config.mainColor}dd;
    }
`;

// Supabase 초기화
const supabaseUrl = 'https://jrrdzqsqgjonjmiirtig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycmR6cXNxZ2pvbmptaWlydGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NDY4MzksImV4cCI6MjA0OTAyMjgzOX0.MSl7e53qCKNG1ZE6ULgk6XWQBu_PKIpGy8D6zGeIeRk';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 현재 페이지 타입 확인
const isViewPage = window.location.pathname.includes('view.html');

// 스타일 적용
const styleSheet = document.createElement('style');
styleSheet.textContent = commonStyles + (isViewPage ? viewStyles : boardStyles);
document.head.appendChild(styleSheet);

// 기본 HTML 구조 생성
document.body.innerHTML = `
    <nav>
        <ul>
            <li><a href="index.html">홈</a></li>
            <li><a href="menu.html">메뉴</a></li>
            <li><a href="about.html">소개</a></li>
            <li><a href="reservation.html">예약</a></li>
            <li><a href="board.html">블로그</a></li>
            <li><a href="contact.html">연락처</a></li>
        </ul>
    </nav>

    <div class="content">
        ${isViewPage 
            ? '<div id="postContent"></div>'
            : `
                <div class="blog-header">
                    <h1>${config.siteName} 블로그</h1>
                    <p>맛있는 이야기가 가득 공간</p>
                </div>
                <div class="blog-grid" id="blogList"></div>
                <div class="pagination" id="pagination"></div>
            `
        }
    </div>
`;

// 게시판 목록 관련 함수들
const boardFunctions = {
    POSTS_PER_PAGE: 6,
    totalPosts: 0,

    async loadPosts(page = 1) {
        try {
            // 전체 게시글 수 ��회
            const countResult = await supabaseClient
                .from('posting_history')
                .select('*', { count: 'exact' })
                .eq('status', 'success')
                .eq('board_id', config.id);

            if (countResult.error) throw countResult.error;
            this.totalPosts = countResult.count;

            // 페이지네이션된 게시글 조회
            const postsResult = await supabaseClient
                .from('posting_history')
                .select(`
                    *,
                    board:boards(name)
                `)
                .eq('status', 'success')
                .eq('board_id', config.id)
                .order('posted_at', { ascending: false })
                .range((page - 1) * this.POSTS_PER_PAGE, page * this.POSTS_PER_PAGE - 1);

            if (postsResult.error) throw postsResult.error;
            const posts = postsResult.data;

            const blogList = document.getElementById('blogList');
            blogList.innerHTML = '';

            posts.forEach((post) => {
                const card = document.createElement('div');
                card.className = 'blog-card';
                
                const imageUrl = post.image_urls && post.image_urls.length > 0 
                    ? post.image_urls[0] 
                    : 'https://placehold.co/400x300';
                
                card.innerHTML = `
                    <img src="${imageUrl}" 
                         alt="${post.title}" 
                         class="blog-image" 
                         onerror="this.src='https://placehold.co/400x300'">
                    <div class="blog-content">
                        <h2 class="blog-title">${post.title}</h2>
                        <div class="blog-meta">
                            <span>${post.board.name}</span> • 
                            <span>${new Date(post.posted_at).toLocaleDateString()}</span>
                        </div>
                        <p class="blog-excerpt">${post.content.substring(0, 150)}...</p>
                        <a href="#" onclick="boardFunctions.viewPost('${post.id}')" style="color: #333; text-decoration: none;">자세히 보기 →</a>
                    </div>
                `;
                blogList.appendChild(card);
            });

            this.updatePagination(page);
        } catch (error) {
            console.error('Error loading posts:', error);
            alert('게시글을 불러오는데 실패했습니다.');
        }
    },

    updatePagination(currentPage) {
        const totalPages = Math.ceil(this.totalPosts / this.POSTS_PER_PAGE);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '이전';
            prevButton.onclick = () => this.loadPosts(currentPage - 1);
            pagination.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerHTML = i;
            if (i === currentPage) {
                pageButton.style.backgroundColor = config.mainColor;
                pageButton.style.color = 'white';
            }
            pageButton.onclick = () => this.loadPosts(i);
            pagination.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '다음';
            nextButton.onclick = () => this.loadPosts(currentPage + 1);
            pagination.appendChild(nextButton);
        }
    },

    viewPost(postId) {
        location.href = `view.html?id=${postId}`;
    }
};

// 게시글 상세 관련 함수들
const viewFunctions = {
    async loadPost() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');

            const { data: post, error } = await supabaseClient
                .from('posting_history')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;

            const postContent = document.getElementById('postContent');
            
            // 게시글 내용을 줄바꿈 단위로 분리하여 처리
            const formattedContent = post.content
                .split('\n\n')  // 빈 줄을 기준으로 분리
                .map(paragraph => {
                    // h3 태그로 시작하는 경우 그대로 반환
                    if (paragraph.startsWith('###')) {
                        return paragraph;
                    }
                    // 일반 텍스트는 p 태그로 감싸기
                    return `<p>${paragraph.trim()}</p>`;
                })
                .join('\n');

            postContent.innerHTML = `
                <a href="board.html" class="back-button">← 목록으로</a>
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span>${new Date(post.posted_at).toLocaleDateString()}</span>
                </div>
                <div class="post-content">
                    ${formattedContent}
                </div>
                ${post.image_urls ? this.renderImages(post.image_urls) : ''}
            `;
        } catch (error) {
            console.error('Error loading post:', error);
            alert('게시글을 불러오는데 실패했습니다.');
        }
    },

    renderImages(imageUrls) {
        if (!Array.isArray(imageUrls)) return '';
        return `
            <div class="image-gallery">
                ${imageUrls.map(url => `
                    <img src="${url}" alt="게시글 이미지" class="post-image">
                `).join('')}
            </div>
        `;
    }
};

// 페이지에 따라 적절한 초기화 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    if (isViewPage) {
        viewFunctions.loadPost();
    } else {
        boardFunctions.loadPosts(1);
    }
}); 
