const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const projectDir = process.env.PROJECT_DIR || "/home/admin_dany/thepiolo_web";
const dotenv = loadEnvFile(path.join(projectDir, ".env"));

const sharedEnv = {
  NODE_ENV: "production",
  PORT: 3001,
  NODE_OPTIONS: "--max-old-space-size=512",
  ...dotenv,
  AUTH_SECRET: dotenv.AUTH_SECRET || dotenv.NEXTAUTH_SECRET,
  AUTH_URL: dotenv.AUTH_URL || dotenv.NEXTAUTH_URL,
};

module.exports = {
  apps: [
    {
      name: "thepiolo-web",
      script: "npm",
      args: "start",
      cwd: projectDir,
      env: sharedEnv,
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "800M",
      kill_timeout: 5000,
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 5,
      min_uptime: "30s",
      restart_delay: 4000,
      listen_timeout: 10000,
      shutdown_with_message: true,
      env_production: sharedEnv,
    },
  ],
};
