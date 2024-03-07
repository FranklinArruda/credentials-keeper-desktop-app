
// import both document delegation to main js file
  function tableSearchWrapper(){
    // Add event listeners to the search inputs for real-time filtering
    document.getElementById("searchInputCredentials").addEventListener("input", function() {
        filterTable("outputTableCredentials","searchInputCredentials");
    });
    document.getElementById("searchInputPhone").addEventListener("input", function() {
        filterTable("outputTablePhone","searchInputPhone");
    });
  };
  



  // Move the filter function to the top level of your script
  function filterTable(tableID, inputID) {
  
    var input, filter, table, rows, cells, i, txtValue;
    input = document.getElementById(inputID);
    filter = input.value.toUpperCase();
    table = document.getElementById(tableID);
    rows = table.getElementsByTagName("tr");
  
    // Iterate through each row in the table
    for (i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        cells = rows[i].getElementsByTagName("td");
        let display = false;
  
        // Iterate through each cell in the row
        for (let j = 0; j < cells.length; j++) {
            txtValue = cells[j].textContent || cells[j].innerText;
  
            // Check if the cell content matches the search filter
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                display = true;
                break; // Break the loop if a match is found in any cell
            }
        }
  
        // Set the display style based on the search result
        if (display) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
  }




  export{
    tableSearchWrapper
  }