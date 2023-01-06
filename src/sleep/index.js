/**
 * setTimeout 대신 사용할 Promise 기반의 sleep 함수
 */
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

module.exports = sleep;
