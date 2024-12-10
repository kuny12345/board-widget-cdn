블로그 게시판 설치 가이드
안녕하세요! 블로그 게시판을 귀하의 웹사이트에 설치하는 방법을 안내해드리겠습니다.
1. 설치 전 준비사항
웹사이트에 HTML 파일을 업로드할 수 있는 권한
발급받은 게시판 ID (관리자에게 문의)
2. 설치 방법
2.1. HTML 파일 생성
아래 코드를 복사하여 board.html 파일을 생성하세요:
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>블로그</title>
</head>
<body>
    <script>
        const BOARD_CONFIG = {
            id: '여기에_발급받은_게시판_ID를_입력하세요',  // 필수
            siteName: '여기에_사이트_이름을_입력하세요',   // 선택
            mainColor: '#333'                           // 선택 (테마 색상)
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.jsdelivr.net/gh/your-username/your-repo@main/board.js"></script>
</body>
</html>
2.2. 설정 변경
1. BOARD_CONFIG 객체의 값들을 수정하세요:
id: 관리자에게 발급받은 게시판 ID (필수)
siteName: 귀하의 사이트 이름 (선택)
mainColor: 원하는 테마 색상 (선택)
2.3. 파일 업로드
생성한 board.html 파일을 귀하의 웹사이트에 업로드하세요.
2. 웹사이트의 메뉴에 블로그 링크를 추가하세요.
예시:
<a href="board.html">블로그</a>
3. 커스터마이징 옵션
3.1. 테마 색상 변경
mainColor 값을 변경하여 게시판의 주요 색상을 수정할 수 있습니다:
mainColor: '#4A90E2'  // 파란색 테마
3.2. 사이트명 변경
siteName 값을 변경하여 게시판 상단에 표시되는 제목을 수정할 수 있습니다:
siteName: '우리 맛집'  // 게시판 상단에 표시될 이름
4. 주의사항
발급받은 게시판 ID는 고유한 값이므로 변경하거나 다른 사이트와 공유하지 마세요.
HTML 파일의 이름은 반드시 board.html로 해주세요.
게시판 내용은 자동으로 동기화되므로 별도의 관리가 필요하지 않습니다.
5. 문제해결
5.1. 게시판이 표시되지 않는 경우
게시판 ID가 올바르게 입력되었는지 확인하세요.
웹브라우저의 개발자 도구(F12)에서 오류 메시지를 확인하세요.
인터넷 연결이 정상적인지 확인하세요.
5.2. 스타일이 깨지는 경우
웹사이트의 기존 CSS와 충돌이 있는지 확인하세요.
mainColor 값이 올바른 형식인지 확인하세요 (#000000 또는 #000 형식).
6. 지원 및 문의
기술적인 문제: support@example.com
게시판 ID 발급: admin@example.com
7. 업데이트 내역
v1.0.0 (2024-03-xx): 최초 배포
v1.0.1 (2024-03-xx): 버그 수정 및 성능 개선
---
더 자세한 정보나 도움이 필요하시다면 언제든 문의해 주세요