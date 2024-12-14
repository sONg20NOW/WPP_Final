# 사용한 package
* prisma
* clsx
* react-toastify
* react-markdown
* tailwindcss/typography
* remark-gfm
* rehype-raw

# Additional Functions
1. Text Formatting
2. Search
3. Profile Image
4. TOC
5. Favorite and Pin
6. Theme and Fonts 

# Patch Notes
## ver 1.0 (2024-12-13)
1. login, register 기능 추가
* login되면 해당 userName의 User의 문서만 나오도록
* register 후에는 자동으로 로그인 창으로 되돌아감
* login이 안 되어 있다면 login 창이 자동으로 뜸
(쿠키 이용하면 더 현실적이어질 듯)
2. delete 기능 추가
* 기존 문제점: 첫번째 문서를 선택한 상태에서 삭제하면 제대로 적용되지 않았음
> 이유: 삭제 후의 Notes가 아닌 기존의 Notes에서 첫번째 문서를 골라서 삭제한 문서를 다시 화면에 표시함
* 해결법: 삭제 후의 Notes에서 해당 작업을 하도록 변경.
## ver 1.2 (2024-12-13)
1. userId로 routing되도록 바꿈
2. getNotes() 함수에 "userId" parameter를 추가하여 특정 user의 문서만 가져오도록 변경
3. Logout 버튼 추가
4. delete 후에 변경된 Notes에서도 getNotes() 내에 올바른 parameter가 입력되도록 변경
5. delete 후에 남은 문서가 없는 경우 URL 쿼리 파라미터에 noteId 부분 삭제
6. 아무 노트도 선택되지 않은 경우(문서가 없는 경우) New Page create 시에 새롭게 생성된 문서가 자동 선택
7. Register 페이지에 Login 버튼 추가
## ver 2.0 (2024-12-13) - Text Formatting
+ Main.jsx
1. Text Formatting 하려고 했는데 react-markdown이 의존성 충돌로 안깔림
-> react를 18로 다운그레이드
2. react-markdown으로 해결  
3. edit/view 버튼 만들어서 토글 형식으로 마크다운 지원
## ver 3.0 (2024-12-14) - Search
+ SearchList.jsx Sidebar.jsx
1. search button 생성
2. search 버튼 click 시 창이 뜨도록
3. search keyword 입력창에 입력이 바뀔 때마다 즉시즉시 검색
4. 검색 결과 리스트 중 하나를 클릭하면 해당 페이지로 이동하고 검색창을 닫도록
## ver 4.0 (2024-12-14) - Profile Image
+ src\app\profile\page.js sidebar.jsx
1. profile image를 BLOB 형식으로 DB 저장
2. BLOB 형식의 DB 데이터를 이미지로 변환
## ver 5.0 (2024-12-14) -ToC
+ Toc.jsx
1. ToC 버튼 생성
2. 토글 형식으로 버튼 누를 시 ToC 나옴
3. Main의 오른쪽 사이드에 ToC 추가
## ver 6.0 (2024-12-14) - Favorite and Pin
+ Doc.jsx
0. 별표 svg 추가  
[무료 svg 사이트](https://heroicons.com/)
1. 스키마 Note에 pinned boolean 요소 추가 (default 값: false)
2. Notes 가져올 때 pinned 된 것들 먼저 오도록.
3. un-pinned 상태에서는 hover 시에만 보이도록  
`text-transparent` 사용
# Dumb Dumbs (바보짓들)
1. **problem**: 자꾸 actions.js에 있는 함수에서 
```
Error: The "payload" argument must be of type object. Received null
```
이런 에러가 떴음.
**solution**: 스키마 구조와 다른 변수 사용 중이었음

2. searchParams로 가져오는 값들은 string이므로 정수값의 경우에는 parseInt() 과정 필요.

3. **problem**: 해당 에러 발생
```
Error: Internal React error: Expected static flag was missing. Please notify the React team.
```
**solution**: 
```jsx
const searchParams = useSearchParams();
const userId = parseInt(searchParams?.get("userId"), 10);
```
searchParams뒤에 ? 추가하여 더 안정성 있게 바꿈.

4. button의 default type은 submit으로 정의된다.

5. sqlite에서는 mode: 'insensitive' (대소문자 구분 없는 검색)을 지원하지 않는다.  
(PostgreSQL / MySQL에서만 지원)

6. **problem**: 값이 늦게 반영
```jsx
const newKeyword = e.target.value;
setKeyword(newKeyword);
const newFoundNotes = await searchNotes(keyword, UserId);
```

**reason**: useState는 상태를 비동기적으로 업데이트.  

**solution**: 
```jsx
const newKeyword = e.target.value;
setKeyword(newKeyword);
const newFoundNotes = await searchNotes(newKeyword, UserId);
```

7. payload error 뜨면 타입 값을 잘 확인하자...(중복)

8. image가 제대로 안 뜨는 문제
-> 