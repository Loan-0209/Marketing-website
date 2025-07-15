module.exports = {
  apps: [
    {
      name: 'heart-backend',
      script: 'server.js',
      instances: 1, // Single instance for development to avoid MongoDB connection issues
      exec_mode: 'fork', // Use fork mode instead of cluster for better stability
      env: {
        NODE_ENV: 'development',
        PORT: 5001 // Match the actual port being used
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '500M', // Lower threshold for better monitoring
      node_args: '--max_old_space_size=2048',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads', 'server.log'],
      restart_delay: 2000, // Faster restart
      max_restarts: 15, // More restart attempts
      min_uptime: '5s', // Shorter minimum uptime
      autorestart: true, // Ensure automatic restart
      kill_timeout: 5000, // Graceful shutdown timeout
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_interval: 30000,
      // Environment specific settings
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Additional monitoring
      pmx: true,
      // Cron restart to prevent memory leaks (daily at 3 AM)
      cron_restart: '0 3 * * *'
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'heart',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'your-repo-url',
      path: '/var/www/heart-backend',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};