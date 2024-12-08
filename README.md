# 프로젝트: 암호화 기반 파일 접근 관리 서비스

## 프로젝트 개요

이 서비스는 **파일 공유 및 관리**를 보다 안전하게 수행하기 위해 설계된 시스템입니다. 민감한 데이터와 파일 정보를 암호화하여 URL로 제공하며, 사용자는 암호화된 링크를 통해 파일 정보를 안전하게 조회, 다운로드 및 삭제할 수 있습니다. 또한, REST API 설계 원칙 중 하나인 HATEOAS(Hypermedia as the Engine of Application State)를 도입하여 다음 가능한 작업의 링크를 동적으로 제공하는 방식으로 구현되었습니다.

---

## 아이디어와 구축 이유

### **1. 아이디어**

1. **암호화된 링크 제공**:

   - 파일 ID 및 메타데이터를 암호화하여 클라이언트에 제공.
   - 암호화된 데이터는 URL 쿼리 파라미터로 전달되며, 이를 복호화하여 파일 정보를 안전하게 확인.

2. **HATEOAS와 연동**:
   - 파일 정보를 제공하는 동시에, 다운로드 및 삭제와 같은 작업을 동적으로 탐색할 수 있는 하이퍼미디어 링크 제공.

### **2. 구축 이유**

- **보안 강화**:
  - 민감한 파일 정보를 암호화하여 URL 노출 시에도 안전성 보장.
- **사용자 편의성**:
  - 링크 하나로 안전하게 파일 정보를 공유하고 작업을 수행할 수 있도록 설계.
- **RESTful 설계 학습**:
  - REST API와 HATEOAS의 원리를 적용하여 확장 가능하고 유연한 구조 설계.

---

## 동작 흐름

1. **파일 정보 암호화 및 링크 생성**:

   - 파일 ID와 메타데이터를 암호화하여 클라이언트에 제공할 링크 생성.
   - 링크는 쿼리 파라미터 형태로 암호화된 데이터를 포함.

2. **암호화된 링크 접근**:

   - 사용자가 암호화된 링크를 통해 파일 정보에 접근.
   - 서버는 데이터를 복호화하여 파일 정보를 반환하며, HATEOAS 기반의 작업 링크를 제공.

3. **파일 다운로드 및 삭제**:
   - 사용자는 제공된 링크를 통해 파일을 다운로드하거나 삭제.
   - 삭제 후, 해당 파일에 대한 모든 접근이 차단됨.

---

## 주요 동작 방식

### **1. 암호화된 링크 생성**

- 요청: `GET /generate-link/:id`
- 동작:
  - `:id`에 해당하는 파일 정보를 암호화.
  - 암호화된 데이터를 포함한 URL 링크를 생성하여 클라이언트에 반환.

### **2. 암호화된 링크 접근**

- 요청: `GET /access?data=<암호화된 데이터>`
- 동작:
  - 암호화된 데이터를 복호화하여 파일 정보 반환.
  - 반환 데이터에 HATEOAS 기반의 작업 링크 포함.

### **3. 파일 다운로드**

- 요청: `GET /download/:id`
- 동작:
  - `:id`에 해당하는 파일을 다운로드.

### **4. 파일 삭제**

- 요청: `DELETE /delete/:id`
- 동작:
  - `:id`에 해당하는 파일을 삭제.
  - 삭제된 파일은 더 이상 접근할 수 없도록 설정.

---

## 사용 기술 및 아키텍처

- **Backend**: Node.js, Express
- **암호화 알고리즘**: AES-256-CBC
- **REST API 설계 원칙**: HATEOAS 적용

---

## 설치 및 실행 방법

### **1. 프로젝트 클론**

```bash
git clone <repository-url>
cd express-encryption
```

### **2. 패키지 설치**

```bash
npm install
```

### **3. 서버 실행**

```bash
node app.js
```

### **4. API 테스트**

- 브라우저 또는 Postman을 사용하여 다음 엔드포인트를 테스트하세요:
  - **암호화된 링크 생성**: `GET http://localhost:3000/generate-link/1`
  - **암호화된 링크 접근**: `GET http://localhost:3000/access?data=<암호화된 데이터>`
  - **파일 다운로드**: `GET http://localhost:3000/download/1`
  - **파일 삭제**: `DELETE http://localhost:3000/delete/1`

---

## 주요 응답 예시

### **1. 암호화된 링크 생성**

**요청:** `GET /generate-link/1`

```json
{
  "message": "Encrypted access link generated.",
  "link": "http://localhost:3000/access?data=encrypted-data"
}
```

### **2. 암호화된 링크 접근**

**요청:** `GET /access?data=encrypted-data`

```json
{
  "file": {
    "id": 1,
    "name": "file1.txt",
    "size": "2MB",
    "type": "text/plain"
  },
  "_links": {
    "self": { "href": "/access?data=encrypted-data" },
    "download": { "href": "/download/1" },
    "delete": { "href": "/delete/1", "method": "DELETE" }
  }
}
```

### **3. 파일 다운로드**

**요청:** `GET /download/1`

```json
{
  "message": "File file1.txt is being downloaded."
}
```

### **4. 파일 삭제**

**요청:** `DELETE /delete/1`

```json
{
  "message": "File with ID 1 has been deleted."
}
```

---

## 기대 효과

- **보안성 강화**: URL에 포함된 민감한 데이터를 암호화하여 정보 유출 방지.
- **RESTful 설계 학습**: HATEOAS 원칙을 적용하여 확장 가능한 API 설계.
- **유연한 파일 관리**: 파일 접근, 다운로드, 삭제를 암호화된 링크로 안전하게 제공.
