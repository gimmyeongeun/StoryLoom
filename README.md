# StoryLoom 스토리룸

초등학생이 명작 동화 템플릿으로 **영어 동화**를 이어 쓰고, AI(Gemini)로 장면을 만들며, 디지털 동화책처럼 읽고 저장하는 웹 프로토타입입니다.

전북대학교 영어영문학과 · 영디리 프로젝트  
작성: 김명은 (202526905)

---

## 주요 기능

- **자유 창작**: 초/중/고급 난이도, 명작 템플릿(아기돼지 삼형제, 앨리스, 빨간 모자, 황금거위)
- **AI 동화 만들기**: Google Gemini API로 영어 문장 + 한글 번역 생성, 페이지 누적
- **스마트 이중 해석**: 전체 한국어 해석 토글, 단어 클릭 시 뜻·발음·단어장 저장
- **인터랙티브 동화책**: 이전/다음 장, 오디오북(TTS), 서재 저장·출판 모달
- **마법 단어장 / 학부모 모드 / 커뮤니티 릴레이**
- **프로필 사진**: 로고 옆 프로필 변경, 확대·위치 편집, localStorage 저장
- **다크 모드**, 닉네임 설정

---

## 폴더 구조

```
app name/
├── index.html          # 화면 구조
├── styles.css          # 커스텀 스타일
├── script.js           # 앱 로직
├── config.js           # API 키 (로컬 전용, Git 제외)
├── config.example.js   # config.js 예시
├── .env                # GROQ_API_KEY (로컬 전용, Git 제외)
├── .env.example        # .env 예시
├── sync-env.ps1        # .env → config.js 반영 스크립트
├── images/             # 캐릭터·템플릿 이미지
└── README.md
```

빌드 도구 없이 **HTML + CSS + JS**만으로 동작합니다. (Tailwind CDN 사용)

---

## 시작하기

### 1. 저장소 받기

```bash
git clone https://github.com/gimmyeongeun/StoryLoom.git
cd StoryLoom
```

### 2. Groq API 키 설정

브라우저에서는 `.env`를 직접 읽지 못하므로, `.env` 값을 `config.js`로 넘깁니다.

1. `.env.example`을 복사해 `.env`를 만듭니다.
2. [Groq Console](https://console.groq.com/keys)에서 발급한 키를 넣습니다.

```env
GROQ_API_KEY=여기에_발급받은_키
```

3. `config.js` 만들기 (둘 중 하나)

**방법 A — PowerShell 스크립트**

```powershell
.\sync-env.ps1
```

**방법 B — 예시 파일 복사**

```powershell
copy config.example.js config.js
```

그다음 `config.js`의 `GROQ_API_KEY` 값을 실제 키로 바꿉니다.

> `.env`와 `config.js`는 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.

### 3. 실행

`index.html`을 브라우저에서 엽니다.  
(더블클릭 또는 Live Server 등)

---

## 사용 방법 (간단히)

1. 닉네임을 입력합니다.
2. 명작 동화 템플릿을 고릅니다. → 1페이지가 열립니다.
3. 이어 쓸 단어/문장을 넣고 **동화 만들기**를 누릅니다. → 새 페이지가 추가됩니다.
4. **이전 장 / 다음 장**으로 장면을 넘깁니다.
5. **전체 한국어 해석**을 끄면 밑줄 단어를 눌러 뜻·발음을 볼 수 있습니다.

학부모 모드 체험용 PIN: `1234`

---

## 기술 스택

| 구분 | 내용 |
|------|------|
| 프론트엔드 | HTML5, CSS3, Vanilla JavaScript |
| 스타일 | Tailwind CSS (CDN), `styles.css` |
| AI | Groq Llama 3 (`llama3-70b-8192` → `llama3-8b-8192` fallback) |
| 저장 | `localStorage` (닉네임, 프로필 이미지·스타일 등) |

---

## 주의사항

- API 키를 `script.js`나 Git에 올리지 마세요.
- `file://`로 열 때 Gemini 호출이 CORS 등으로 막힐 수 있습니다. 그때는 로컬 서버로 열어 보세요.
- API 연결이 실패하면 선택한 템플릿 맥락의 예비 문장으로 화면이 이어집니다.

---

## 라이선스 / 프로젝트 정보

수업·포트폴리오용 프로토타입입니다.  
기획안: `영디리 프로젝트_기획안_202526905 김명은.txt`
