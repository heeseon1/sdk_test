import dotenv from 'dotenv'; //dotenv: 환경 변수 파일(.env)을 읽어와 환경 변수를 설정해주는 역할
import { response } from 'express';
const express = require('express'); //Node.js를 위한 빠르고 간단한 웹 애플리케이션 프레임워크
const path = require('path'); // Node.js에서 기본으로 제공하는 경로 관리 모듈
const request = require('request') // HTTP 요청을 간단하게 보낼 수 있도록 도와주는 라이브러리

//require('dotenv').config();
dotenv.config();

const app = express();; //express 초기화

//app.use: express 미들웨어 추가 메소드
app.use(express.static('public')); // public 파일을 정적으로 제공 (경로 입력)

// ecpress의 GET 요청
// 서버에서 req를 처리하고 res를 응답해 클라이언트에게 전달
app.get('/config', (req, res) => {
    console.log('config!');

    // env파일에 적은 환경 변수를 사용하려면 porcess.env 객체 사용
    res.json({
        url: process.env.COGINSIGHT_SERVICE_URL,
        version: process.env.COGINSIGHT_CHATBOT_VERSION,
        botId: process.env.COGINSIGHT_PROJECT_ID
    });
});


// 서버에서 다른 서버로 api 요청
// /auth 경로로 get 요청을 보내면, 챗봇 서버의 API 인증 결과를 클라이언트에게 전달
app.get('/auth', (req, res) => {
    console.log("auth!");

    const url = process.env.COGINSIGHT_SERVICE_URL;
    const apiKey = process.env.COGINSIGHT_API_KEY;
    const domainId = process.env.COGINSIGHT_DOMAIN_ID;
    const chatbotId = process.env.COGINSIGHT_PROJECT_ID;
    const userKey = process.env.COGINSIGHT_USER_KEY;

    //챗봇에 api 요청 보낼 때 필요한 정보
    const options = {
        uri: `${url}/api/auth`,
        headers: {
            "coginsight-domain-id": domainId,
            "coginsight-api-key": apiKey
        },
        body: {
            projectId: chatbotId,
            userKey: userKey,
            secure: {
                "data": "secure data"
            }
        },
        json: true
    };

    // 서버가 외부 API에 POST 요청, 응답 값을 클라이언트에게 응답
    request.post(options, (error, response, body) => {
        console.log("Authentication Response: ", body);
        const token = body?.result; // body.result 값 추출, body가 null||undefined라면 undefined
        res.send({"token": token}); // 토큰 값 응답
    })
})

//html 페이지 접속
//__dirname: Node.js에서 제공하는 전역 변수, 현재 실행 중인 파일의 디렉토리 경로를 나타냄
app.get('/sdk.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sdk.html'));
});


// 서버 실행
app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});