// RESTORE ORIGINAL LOGO - Fix header/navigation logo
// Copy and paste into browser console at http://localhost:8080/3d-smart-city.html

(function restoreOriginalLogo() {
    console.log('🔧 RESTORING ORIGINAL LOGO');
    console.log('==========================\n');
    
    // 1. FIND LOGO ELEMENTS BY MULTIPLE SELECTORS
    console.log('1️⃣ Searching for logo elements...');
    
    const logoSelectors = [
        '.logo',
        '.brand', 
        '.header h1',
        '.navigation h1',
        '.navbar-brand',
        '.site-title',
        'h1',
        '.title',
        '[class*="logo"]',
        '[class*="brand"]',
        'header *'
    ];
    
    const logoElements = [];
    
    logoSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent || el.innerHTML || '';
                // Look for elements containing "HEART" 
                if (text.includes('HEART')) {
                    logoElements.push({
                        element: el,
                        selector: selector,
                        currentText: text,
                        tagName: el.tagName
                    });
                }
            });
        } catch (e) {
            // Ignore invalid selectors
        }
    });
    
    console.log(`Found ${logoElements.length} logo elements containing "HEART":`);
    logoElements.forEach((logo, index) => {
        console.log(`  ${index + 1}. ${logo.tagName} (${logo.selector}): "${logo.currentText}"`);
    });
    
    // 2. SEARCH BY TEXT CONTENT (FALLBACK)
    if (logoElements.length === 0) {
        console.log('\n🔍 Fallback: Searching by text content...');
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const text = el.textContent || '';
            if (text.includes('HEART') && text.length < 50) { // Avoid large containers
                logoElements.push({
                    element: el,
                    selector: 'text-search',
                    currentText: text,
                    tagName: el.tagName
                });
            }
        });
        
        console.log(`Fallback found ${logoElements.length} elements`);
    }
    
    // 3. IDENTIFY NAVIGATION/HEADER AREA
    console.log('\n2️⃣ Identifying navigation/header elements...');
    
    const headerElements = [];
    const headerSelectors = ['header', '.header', '.navigation', '.navbar', '.nav', '.top-bar'];
    
    headerSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                headerElements.push({
                    element: el,
                    selector: selector,
                    hasHeartText: (el.textContent || '').includes('HEART')
                });
            });
        } catch (e) {
            // Ignore
        }
    });
    
    console.log(`Found ${headerElements.length} header elements:`);
    headerElements.forEach(header => {
        console.log(`  - ${header.selector}: hasHeart=${header.hasHeartText}`);
    });
    
    // 4. FIND BEST LOGO CANDIDATE
    console.log('\n3️⃣ Finding best logo candidate...');
    
    let bestLogo = null;
    
    // Priority 1: Logo in header/navigation
    logoElements.forEach(logo => {
        const isInHeader = headerElements.some(header => 
            header.element.contains(logo.element)
        );
        
        if (isInHeader) {
            bestLogo = logo;
            console.log(`✅ Found logo in header: ${logo.tagName} with text "${logo.currentText}"`);
            return;
        }
    });
    
    // Priority 2: First logo element found
    if (!bestLogo && logoElements.length > 0) {
        bestLogo = logoElements[0];
        console.log(`📍 Using first logo found: ${bestLogo.tagName} with text "${bestLogo.currentText}"`);
    }
    
    // 5. RESTORE ORIGINAL LOGO
    if (bestLogo) {
        console.log('\n4️⃣ Restoring original logo...');
        
        const currentText = bestLogo.currentText;
        console.log(`Current text: "${currentText}"`);
        
        // Clean up debug symbols and restore to original
        let restoredText = currentText;
        
        // Remove debug emojis
        restoredText = restoredText.replace(/🚨/g, '');
        restoredText = restoredText.replace(/🔍/g, '');
        restoredText = restoredText.replace(/⚠️/g, '');
        restoredText = restoredText.replace(/❌/g, '');
        restoredText = restoredText.replace(/✅/g, '');
        
        // Clean up extra spaces
        restoredText = restoredText.replace(/\s+/g, ' ').trim();
        
        // Ensure it starts with rocket emoji
        if (!restoredText.startsWith('🚀')) {
            if (restoredText.includes('HEART')) {
                restoredText = '🚀 ' + restoredText.replace(/^\s*/, '');
            }
        }
        
        // Final cleanup - ensure clean format
        if (restoredText.includes('HEART')) {
            restoredText = '🚀 HEART';
        }
        
        console.log(`Restored text: "${restoredText}"`);
        
        // Apply the fix
        const element = bestLogo.element;
        const originalHTML = element.innerHTML;
        
        // Try different methods to update
        try {
            // Method 1: Update textContent
            if (element.textContent === currentText) {
                element.textContent = restoredText;
                console.log('✅ Updated via textContent');
            }
            // Method 2: Update innerHTML if it's simple text
            else if (element.innerHTML === currentText || element.innerHTML.includes(currentText)) {
                element.innerHTML = restoredText;
                console.log('✅ Updated via innerHTML');
            }
            // Method 3: Replace specific text content
            else {
                const newHTML = originalHTML.replace(currentText, restoredText);
                element.innerHTML = newHTML;
                console.log('✅ Updated via text replacement');
            }
            
            // Verify the change
            setTimeout(() => {
                const newText = element.textContent || element.innerHTML;
                console.log(`Verification - New text: "${newText}"`);
                
                if (newText.includes('🚀 HEART')) {
                    console.log('✅ Logo successfully restored to "🚀 HEART"');
                } else {
                    console.log('⚠️ Logo may need manual verification');
                }
            }, 100);
            
        } catch (error) {
            console.error('❌ Error updating logo:', error);
            
            // Fallback: Direct manipulation
            console.log('🔄 Trying fallback method...');
            element.innerHTML = '🚀 HEART';
            console.log('✅ Applied fallback fix');
        }
        
    } else {
        console.log('\n❌ No logo elements found!');
        console.log('🔍 Manual search in page title...');
        
        // Check page title as last resort
        if (document.title.includes('HEART')) {
            console.log(`Page title: "${document.title}"`);
            if (document.title.includes('🚨') || document.title.includes('🔍')) {
                document.title = document.title.replace(/🚨|🔍|⚠️|❌|✅/g, '').replace(/\s+/g, ' ').trim();
                if (!document.title.startsWith('🚀')) {
                    document.title = '🚀 ' + document.title;
                }
                console.log('✅ Page title cleaned');
            }
        }
    }
    
    // 6. SEARCH FOR ANY REMAINING DEBUG SYMBOLS
    console.log('\n5️⃣ Cleaning up any remaining debug symbols...');
    
    const debugSymbols = ['🚨', '🔍', '⚠️', '❌', '✅'];
    let cleanedCount = 0;
    
    document.querySelectorAll('*').forEach(el => {
        if (el.children.length === 0) { // Only text nodes
            const text = el.textContent || '';
            const hasDebugSymbol = debugSymbols.some(symbol => text.includes(symbol));
            
            if (hasDebugSymbol && text.includes('HEART')) {
                let cleanText = text;
                debugSymbols.forEach(symbol => {
                    cleanText = cleanText.replace(new RegExp(symbol, 'g'), '');
                });
                cleanText = cleanText.replace(/\s+/g, ' ').trim();
                
                if (cleanText.includes('HEART') && !cleanText.startsWith('🚀')) {
                    cleanText = '🚀 ' + cleanText;
                }
                
                el.textContent = cleanText;
                cleanedCount++;
                console.log(`  ✅ Cleaned: "${text}" → "${cleanText}"`);
            }
        }
    });
    
    console.log(`Cleaned ${cleanedCount} additional elements`);
    
    // 7. FINAL VERIFICATION
    console.log('\n6️⃣ Final verification...');
    
    setTimeout(() => {
        const finalLogoElements = [];
        document.querySelectorAll('*').forEach(el => {
            const text = el.textContent || '';
            if (text.includes('HEART') && text.length < 50) {
                finalLogoElements.push({
                    tag: el.tagName,
                    text: text,
                    hasRocket: text.includes('🚀'),
                    hasDebugSymbols: debugSymbols.some(symbol => text.includes(symbol))
                });
            }
        });
        
        console.log('📊 FINAL LOGO STATUS:');
        console.log('====================');
        finalLogoElements.forEach((logo, index) => {
            const status = logo.hasRocket && !logo.hasDebugSymbols ? '✅' : '⚠️';
            console.log(`${status} ${logo.tag}: "${logo.text}"`);
        });
        
        const successCount = finalLogoElements.filter(logo => 
            logo.hasRocket && !logo.hasDebugSymbols
        ).length;
        
        if (successCount > 0) {
            console.log(`\n🎉 SUCCESS: ${successCount} logo(s) restored to "🚀 HEART"`);
        } else {
            console.log('\n⚠️ May need manual verification - check page visually');
        }
        
    }, 500);
    
    console.log('\n✅ LOGO RESTORATION COMPLETE');
    console.log('Check the page header/navigation for "🚀 HEART" logo');
    
})();