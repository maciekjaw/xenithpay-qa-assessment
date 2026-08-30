
function fn() {
  const env = karate.env || 'demo';
  karate.log('karate.env =', env);

  const testPassword = karate.properties['testPassword'];
  if (!testPassword) {
    karate.fail(
      'testPassword is not set. Run with -DtestPassword=YourPass, ' +
      'or set it in your CI secrets. Must meet DemoQA rules: min 8 chars, ' +
      'at least one uppercase, one lowercase, one digit, one special character.',
    );
  }

  const config = {
    baseUrl: 'https://demoqa.com',
    testPassword: testPassword,
  };
  return config;
}