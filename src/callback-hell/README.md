# fc-async-js callback-hell

## callback-hell 간소화

- 코드 간소화

  - 조건에 따른 조기 return을
  - 콜백함수를 따로 빼서 코드 간소화

- 기능 추가
  - shell 스크립트 및 `gm` write 메소드 실행 시 디렉토리에 따른 오류로 `fs:mkdir` 추가
  - `gm` 내장 state을 다음 콜백에 넘겨주기 위해 `self` 추가

실행방법:

```sh
npm run callback
```

## promisfy

- 함수 모듈화
  - 특정 gm기능(write, size 등) 프로미스화 및 에러 처리때문에 늘어난 코드 관리를 위해 파일/기능별 함수 모듈화
  - Nodejs가 제공하는 EC module 및 JSDoc 사용 경험
- 기능 추가
  - gm이 지원하는 이미지 포맷 확인(`gm --version`)후 이미지 파일명 사전 점검기능 추가

실행방법:

```sh
npm run callback-promisfy
```
