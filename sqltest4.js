const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
    authentication: {
        options: {
            userName: "ReunificationServer2",
            password: "Savethekids2"
        },
        type: "default"
    },
    server: "phacks22.database.windows.net", 
    options: {
        database: "patriothacks2022_database", 
        encrypt: true,
        multipleStatements: true
    }

};

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        authentication: {
            type: 'azure-active-directory-msi-vm',
        },
        options: {
            database: process.env["db_database"],
            encrypt: true,
            port: 1433
        }
    };

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        authentication: {
            type: 'azure-active-directory-msi-app-service',
        },
        options: {
            database: process.env["db_database"],
            encrypt: true,
            port: 1433
        }
    });

*/

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
    if (err) {
        console.error(err.message);
    } else {
        addEntry([3,"Simpdsson","Homdder",null,null,null,null,null,null,null,null,null]);
        //readEntries();
        //findEntrybyID(3);
        //deleteEntry(2);
    }
    
});

connection.connect();


function queryDatabase() {
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
        //"SELECT PersonID, FirstName, LastName, Email FROM Persons; ",
        //"INSERT INTO Persons (PersonID, LastName, FirstName) VALUES(2, 'Smith', 'Jane');",
        //"CREATE TABLE Matches( PersonID1 int, PersonID2 int);",
        "SELECT * FROM INFORMATION_SCHEMA.TABLES;",
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    var entry = 0;
    request.on("row", columns => {
        console.log("entry #%d", entry)
        entry++;
        columns.forEach(column => {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });

    connection.execSql(request);
}


function deleteEntry(id) {
    console.log("Deleting entry...");

    let sqlString = `DELETE FROM Persons WHERE PersonID = ${id};`
    const request = new Request(
        sqlString,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    var entry = 0;
    request.on("row", columns => {
        console.log("entry #%d", entry)
        entry++;
        columns.forEach(column => {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
        console.log("------------------------------");
    });

    connection.execSql(request);
}

function findEntrybyID(id) {
    console.log("Deleting entry...");

    let sqlString = `SELECT * FROM Persons WHERE PersonID = ${id};`
    const request = new Request(
        sqlString,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    var entry = 0;
    request.on("row", columns => {
        console.log("entry #%d", entry)
        entry++;
        columns.forEach(column => {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
        console.log("------------------------------");
    });

    connection.execSql(request);
}



function readEntries() {
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(

        "SELECT * FROM Persons;",
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    var entry = 0;
    request.on("row", columns => {
        console.log("entry #%d", entry)
        entry++;
        columns.forEach(column => {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
        console.log("------------------------------");
    });

    connection.execSql(request);
}



function addEntry(inputArray) {
    console.log("Adding entry to table...");
    const sqlArray = ['PersonID',
        'LastName',
        'FirstName',
        'Phone_Number',
        'Email',
        'Current_Address',
        'Previous_Address',
        'Location',
        'Profile_image',
        'Passport_Number',
        'Drivers_licence_ID',
        'DNA_Test_ID']
    // Read all rows from table

    //add initial entry
    let sqlString = "INSERT INTO Persons (PersonID, LastName, FirstName, Phone_Number, Email, Current_Address, Previous_Address, Location, Profile_image, Passport_Number, Drivers_licence_ID, DNA_Test_ID) VALUES (";

    for (let i = 0; i < inputArray.length; i++) {
        sqlString += inputArray[i];
        if (i != inputArray.length - 1) {
            sqlString += ",";
        }
    }

    request.callback = function (err, rowCount, rows) {
        // rows is not being set but rowCount is. May be a bug.
        if (err) {
            // Error handling.
        } else {
            // Next SQL statement.
        }
    };

    sqlString += ")";
    console.log(sqlString);
    
    const request = new Request(
        sqlString,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );
    var entry = 0;

    connection.execSql(request);
    

    

    
}