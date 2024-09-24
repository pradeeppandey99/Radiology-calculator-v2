document.addEventListener('DOMContentLoaded', () => {
    loadAssumptions();
    showPage('dynamic'); // Start with the dynamic inputs page
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

function saveAssumptions() {
    const assumptions = {
        manhours: parseFloat(document.getElementById('manhours').value) || 0,
        consultantTime: parseFloat(document.getElementById('consultantTime').value) || 0,
        registrarTime: parseFloat(document.getElementById('registrarTime').value) || 0,
        simpleCTTime: parseFloat(document.getElementById('simpleCTTime').value) || 0,
        complexCTTime: parseFloat(document.getElementById('complexCTTime').value) || 0,
        complexCTWork: parseFloat(document.getElementById('complexCTWork').value) || 0,
        simpleMRITime: parseFloat(document.getElementById('simpleMRITime').value) || 0,
        complexMRITime: parseFloat(document.getElementById('complexMRITime').value) || 0,
        complexMRIWork: parseFloat(document.getElementById('complexMRIWork').value) || 0,
        seasonalAdjustment: parseFloat(document.getElementById('seasonalAdjustment').value) || 0
    };
    localStorage.setItem('assumptions', JSON.stringify(assumptions));
    alert('Assumptions saved successfully!');
}

function loadAssumptions() {
    const assumptions = JSON.parse(localStorage.getItem('assumptions')) || {
        manhours: 200,  // Changed from 160 to 180
        consultantTime: 80,
        registrarTime: 50,
        simpleCTTime: 30,
        complexCTTime: 120,
        complexCTWork: 20,
        simpleMRITime: 40,
        complexMRITime: 150,
        complexMRIWork: 25,
        seasonalAdjustment: 80
    };

    document.getElementById('manhours').value = assumptions.manhours;
    document.getElementById('consultantTime').value = assumptions.consultantTime;
    document.getElementById('registrarTime').value = assumptions.registrarTime;
    document.getElementById('simpleCTTime').value = assumptions.simpleCTTime;
    document.getElementById('complexCTTime').value = assumptions.complexCTTime;
    document.getElementById('complexCTWork').value = assumptions.complexCTWork;
    document.getElementById('simpleMRITime').value = assumptions.simpleMRITime;
    document.getElementById('complexMRITime').value = assumptions.complexMRITime;
    document.getElementById('complexMRIWork').value = assumptions.complexMRIWork;
    document.getElementById('seasonalAdjustment').value = assumptions.seasonalAdjustment;
}

function calculateManpower() {
    const assumptions = JSON.parse(localStorage.getItem('assumptions'));
    if (!assumptions) {
        alert('Please set and save the assumptions first.');
        showPage('assumptions');
        return;
    }

    const consultants = parseFloat(document.getElementById('consultants').value) || 0;
    const registrars = parseFloat(document.getElementById('registrars').value) || 0;
    const ctPatients = parseFloat(document.getElementById('ctPatients').value) || 0;
    const mriPatients = parseFloat(document.getElementById('mriPatients').value) || 0;

    const totalAvailableManhours = (consultants * assumptions.consultantTime * assumptions.manhours) + (registrars * assumptions.registrarTime * assumptions.manhours);
    const timeSimpleCT = (ctPatients * assumptions.simpleCTTime * (1 - assumptions.complexCTWork)) / 60;
    const timeComplexCT = (ctPatients * assumptions.complexCTTime * assumptions.complexCTWork) / 60;
    const timeSimpleMRI = (mriPatients * assumptions.simpleMRITime * (1 - assumptions.complexMRIWork)) / 60;
    const timeComplexMRI = (mriPatients * assumptions.complexMRITime * assumptions.complexMRIWork) / 60;
    const totalTimeCT = timeSimpleCT + timeComplexCT;
    const totalTimeMRI = timeSimpleMRI + timeComplexMRI;
    const totalTimeReporting = totalTimeCT + totalTimeMRI;
    const adjustedTotalTimeReporting = totalTimeReporting * (1 + assumptions.seasonalAdjustment);
    const totalDeficitSurplusManhours = totalAvailableManhours - adjustedTotalTimeReporting;
    const totalDeficitSurplusManpower = totalDeficitSurplusManhours / assumptions.manhours;

    document.getElementById('result').innerHTML = `
        <h2>Results</h2>
        <p>Total available manhours per month: ${totalAvailableManhours.toFixed(2)}</p>
        <p>Time required for simple CT reporting: ${timeSimpleCT.toFixed(2)}</p>
        <p>Time required for complex CT reporting: ${timeComplexCT.toFixed(2)}</p>
        <p>Total time required for CT per month: ${totalTimeCT.toFixed(2)}</p>
        <p>Time required for simple MRI reporting: ${timeSimpleMRI.toFixed(2)}</p>
        <p>Time required for complex MRI reporting: ${timeComplexMRI.toFixed(2)}</p>
        <p>Total time required for MRI per month: ${totalTimeMRI.toFixed(2)}</p>
        <p>Total time required for reporting per month: ${totalTimeReporting.toFixed(2)}</p>
        <p>Adjusted total time required for reporting per month: ${adjustedTotalTimeReporting.toFixed(2)}</p>
        <p>Total deficit or surplus of manhours per month: ${totalDeficitSurplusManhours.toFixed(2)}</p>
        <p>Total deficit or surplus manpower required: ${totalDeficitSurplusManpower.toFixed(2)}</p>
    `;
}
