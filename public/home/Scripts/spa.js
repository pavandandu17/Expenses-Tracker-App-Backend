function displayAddExpense() {
    (document.getElementById('formContainer')).style.display = 'block';
    (document.getElementById('reportContainer')).style.display = 'none';
    (document.getElementById('analyzeContainer')).style.display = 'none';
}

function displayReport() {
    (document.getElementById('formContainer')).style.display = 'none';
    (document.getElementById('reportContainer')).style.display = 'block';
    (document.getElementById('analyzeContainer')).style.display = 'none';
}

function displayAnalyze() {
    (document.getElementById('formContainer')).style.display = 'none';
    (document.getElementById('reportContainer')).style.display = 'none';
    (document.getElementById('analyzeContainer')).style.display = 'block';
}