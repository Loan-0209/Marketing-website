        // Enhanced error handling with better UI
        function handleInitializationError(error) {
            console.error('Smart City Init Error:', error);
            
            // Hide loading spinner
            const loadingSpinner = document.querySelector('.loading-spinner');
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            
            // Hide loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) loadingScreen.style.display = 'none';
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <h3>🚫 Không thể khởi tạo 3D Smart City</h3>
                <p><strong>Chi tiết lỗi:</strong> ${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()" class="retry-button">🔄 Thử lại</button>
                    <button onclick="window.history.back()" class="back-button">⬅️ Quay lại</button>
                </div>
            `;
            
            // Add error styling
            errorDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff4444, #cc3333);
                color: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
                max-width: 500px;
                min-width: 350px;
            `;
            
            // Style buttons
            const style = document.createElement('style');
            style.textContent = `
                .error-message h3 {
                    margin: 0 0 15px 0;
                    font-size: 24px;
                }
                .error-message p {
                    margin: 10px 0 20px 0;
                    font-size: 16px;
                    background: rgba(0,0,0,0.2);
                    padding: 10px;
                    border-radius: 8px;
                }
                .error-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                .retry-button, .back-button {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .retry-button {
                    background: #28a745;
                    color: white;
                }
                .retry-button:hover {
                    background: #218838;
                    transform: translateY(-2px);
                }
                .back-button {
                    background: #6c757d;
                    color: white;
                }
                .back-button:hover {
                    background: #545b62;
                    transform: translateY(-2px);
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(errorDiv);
            
            // Auto-hide after 30 seconds with countdown
            let countdown = 30;
            const countdownInterval = setInterval(() => {
                countdown--;
                const retryButton = errorDiv.querySelector('.retry-button');
                if (retryButton && countdown > 0) {
                    retryButton.textContent = `🔄 Thử lại (${countdown}s)`;
                } else if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    location.reload();
                }
            }, 1000);
        }