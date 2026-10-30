/**
 * 커밋 형식: "타입: 제목"
 * 예) feat: 로그인 페이지 구현
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'style', 'refactor', 'chore', 'docs', 'test', 'revert'],
    ],
    'scope-empty': [2, 'always'],
    'subject-case': [0],
    'subject-full-stop': [0],
    'header-max-length': [2, 'always', 100],
  },
};
