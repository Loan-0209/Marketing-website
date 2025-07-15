#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const HEALTH_URL = 'http://localhost:5001/api/health';
const LOG_FILE = path.join(__dirname, '../logs/health-monitor.log');
const CHECK_INTERVAL = 30000; // 30 seconds
const MAX_FAILURES = 3;

let failureCount = 0;
let lastSuccessTime = new Date();

function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${message}\n`;
  
  console.log(logEntry.trim());
  
  // Write to log file
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
}

function checkHealth() {
  const req = http.get(HEALTH_URL, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const health = JSON.parse(data);
          if (health.status === 'OK') {
            if (failureCount > 0) {
              log(`✅ Server recovered after ${failureCount} failures`);
            }
            failureCount = 0;
            lastSuccessTime = new Date();
          } else {
            handleFailure('Health check returned non-OK status');
          }
        } catch (err) {
          handleFailure(`Invalid JSON response: ${err.message}`);
        }
      } else {
        handleFailure(`HTTP ${res.statusCode} response`);
      }
    });
  });
  
  req.on('error', (err) => {
    handleFailure(`Connection error: ${err.message}`);
  });
  
  req.setTimeout(5000, () => {
    req.destroy();
    handleFailure('Request timeout');
  });
}

function handleFailure(reason) {
  failureCount++;
  log(`❌ Health check failed (${failureCount}/${MAX_FAILURES}): ${reason}`);
  
  if (failureCount >= MAX_FAILURES) {
    log(`🚨 CRITICAL: Server failed ${MAX_FAILURES} consecutive health checks!`);
    log(`Last successful check: ${lastSuccessTime.toISOString()}`);
    
    // Send alert (could integrate with external monitoring services)
    sendAlert(reason);
    
    // Reset failure count to avoid spam
    failureCount = 0;
  }
}

function sendAlert(reason) {
  // This could be extended to send emails, Slack notifications, etc.
  log(`📧 ALERT: Server health critical - ${reason}`);
  
  // Log system stats for debugging
  logSystemStats();
}

function logSystemStats() {
  const exec = require('child_process').exec;
  
  exec('pm2 status', (error, stdout, stderr) => {
    if (!error) {
      log(`PM2 Status:\n${stdout}`);
    }
  });
  
  exec('ps aux | grep node', (error, stdout, stderr) => {
    if (!error) {
      log(`Node Processes:\n${stdout}`);
    }
  });
}

function startMonitoring() {
  log('🔍 Starting health monitoring...');
  log(`Checking ${HEALTH_URL} every ${CHECK_INTERVAL/1000} seconds`);
  
  // Initial check
  checkHealth();
  
  // Set up periodic checks
  setInterval(checkHealth, CHECK_INTERVAL);
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  log('Health monitor shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  log('Health monitor shutting down...');
  process.exit(0);
});

// Start monitoring
startMonitoring();