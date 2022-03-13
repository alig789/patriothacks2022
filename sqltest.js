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
        trustServerCertificate: false

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
        addEntry([11,"Drew","Nancy",7032343234,"nDrew@gmail.com","4573 Southland Ave, Alexandria VA","4931 Street St, Richmond VA","Ukraine"]);
        //addEntry(inputData);
        //readEntries();
        //findEntrybyID(3);
        //deleteEntry(6);
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

    sendCommand(`DELETE FROM Persons WHERE PersonID = ${id};`);

}

function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
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
    sendCommand("SELECT * FROM Persons");
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
    console.log(`${sqlArray[0]} = ${inputArray[0]}`);
    let sqlNameString = `INSERT INTO Persons (PersonID) VALUES(${inputArray[0]})`;
    let commands = [];
    commands.push(sqlNameString);
    for (let i = 1; i < inputArray.length; i++) {

        if (inputArray[i] != null) {
            console.log(`${sqlArray[i]} = ${inputArray[i]}`);
            let sqlString = `UPDATE Persons SET ${sqlArray[i]} = '${inputArray[i]}' WHERE PersonID = ${inputArray[0]}`;
            commands.push(sqlString);


        }
    }

    console.log(commands);
    sendCommandSequence(commands,0);
    
}

function sendCommand(command) {
    let sqlString = command;
    const request = new Request(sqlString,
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

   request.on("requestCompleted", function () {x = 0 });

    connection.execSql(request);
    
    console.log("DONE");
}

function sendCommandSequence(command,i) {
    if (Array.isArray(command)) {
        let cmd_count = command.length;
        if (i >= cmd_count) {
            console.log("DONE");
            process.exit(1);
        }
        let sqlString = command[i];
        console.log(sqlString);
        const request = new Request(sqlString,
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`${rowCount} row(s) returned`);
                }
            }
        );
        connection.execSql(request);
        request.on('requestCompleted', function () {
            sendCommandSequence(command, i+=1);
        });
    }
    else {
        let sqlString = command;
        const request = new Request(sqlString,
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`${rowCount} row(s) returned`);
                }
            }
        );
        connection.execSql(request);
    }


    console.log("DONE");
}

