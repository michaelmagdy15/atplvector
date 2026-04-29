const xlsx = require('xlsx');

function readExcel() {
    const workbook = xlsx.readFile('tk-syllabus-comparison-doc-v6.xlsx');
    console.log("Sheet names:", workbook.SheetNames);
    
    // Read the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON and print the first 10 rows
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log(`\nFirst 10 rows of sheet '${sheetName}':`);
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
    
    // Output basic stats
    console.log(`\nTotal rows in sheet '${sheetName}': ${data.length}`);
}

readExcel();
