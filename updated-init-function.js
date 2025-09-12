        // Enhanced updateLoadingProgress function
        function updateLoadingProgress(message, percentage) {
            const loadingText = document.querySelector('.loading-text');
            const progressBar = document.querySelector('.progress-bar');
            const progressText = document.querySelector('.progress-text');
            
            if (loadingText) loadingText.textContent = message;
            if (progressBar) progressBar.style.width = percentage + '%';
            if (progressText) progressText.textContent = message;
            
            console.log(`📱 Loading: ${message} (${percentage}%)`);
        }

        // ASYNC: Main initialization function with detailed progress tracking
        async function initSmartCity() {
            try {
                // Đảm bảo THREE.js loaded
                updateLoadingProgress('Đang tải THREE.js...', 10);
                await ensureThreeJSLoaded();
                console.log('THREE.js loaded successfully:', THREE.REVISION);
                updateLoadingProgress('THREE.js đã tải thành công!', 20);
                
                // Bây giờ mới khởi tạo scene
                updateLoadingProgress('Khởi tạo scene 3D...', 25);
                initScene();
                
                updateLoadingProgress('Khởi tạo WebGL renderer...', 30);
                await initRenderer();
                
                updateLoadingProgress('Thiết lập camera...', 35);
                initCamera();
                
                updateLoadingProgress('Tạo hệ thống ánh sáng...', 40);
                initLights();
                
                updateLoadingProgress('Xây dựng tòa nhà...', 50);
                createBuildings();
                
                updateLoadingProgress('Tạo địa hình và cơ sở hạ tầng...', 60);
                createTerrain();
                
                updateLoadingProgress('Khởi động hệ thống render...', 90);
                // Start render loop
                animate();
                
                updateLoadingProgress('Hoàn tất khởi tạo...', 95);
                // Hide loading screen
                hideLoadingScreen();
                
            } catch (error) {
                console.error('Initialization failed:', error);
                showErrorMessage('Failed to initialize 3D Smart City: ' + error.message);
            }
        }