const API_URL = (process.env.SMOKE_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');
const EMAIL = process.env.SMOKE_EMAIL ?? 'demo@invoiceflow.dev';
const PASSWORD = process.env.SMOKE_PASSWORD ?? 'password123';

const fail = (message, details) => {
  console.error(`SMOKE FAILED: ${message}`);
  if (details) {
    console.error(details);
  }
  process.exit(1);
};

const readJson = async (response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const expectOk = async (response, label) => {
  if (!response.ok) {
    fail(`${label} returned ${response.status}`, await readJson(response));
  }

  return readJson(response);
};

const main = async () => {
  console.log(`Running smoke test against ${API_URL}`);

  const health = await fetch(`${API_URL}/health`);
  const healthBody = await expectOk(health, 'Health check');

  if (healthBody?.status !== 'ok') {
    fail('Health check did not return status=ok', healthBody);
  }

  const login = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const loginBody = await expectOk(login, 'Login');

  if (!loginBody?.accessToken) {
    fail('Login response did not include accessToken', loginBody);
  }

  const dashboard = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${loginBody.accessToken}`,
    },
  });
  const dashboardBody = await expectOk(dashboard, 'Dashboard stats');

  if (typeof dashboardBody?.clients !== 'number') {
    fail('Dashboard stats payload looks invalid', dashboardBody);
  }

  console.log('Smoke test passed.');
};

main().catch((error) => fail('Unexpected exception', error));
