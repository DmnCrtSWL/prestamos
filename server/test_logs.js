const { execSync } = require('child_process');

try {
  // First, we create an error manually via the Vercel deployed endpoint
  const curlCmd = `curl -s -X POST https://prestamos-server.vercel.app/api/clients -F "name=Log Test" -F "phone=123" -F "curp=TEST12345678901235" -F "address=123" -F "ine_front=@valid_test.jpg"`;
  console.log('Triggering error...');
  execSync(curlCmd);
  console.log('Done triggering. Wait a few seconds to let Vercel log it...');
} catch (e) {
  console.log('Curl error:', e.message);
}
