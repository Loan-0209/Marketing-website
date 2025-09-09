// Auto execute building fix
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for everything to load
    setTimeout(function() {
        console.log("Auto-executing window.testBuilding1()...");
        if (typeof window.testBuilding1 === 'function') {
            window.testBuilding1();
            console.log("✅ window.testBuilding1() executed successfully");
        } else {
            console.error("❌ window.testBuilding1 is not a function");
            console.log("Available window functions:", Object.keys(window).filter(key => typeof window[key] === 'function'));
        }
    }, 1000);
});
