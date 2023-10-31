var jsonFile = require('jsonfile');
var request = require('request');
var fs = require('fs');
var createHTML = require('create-html')
var statusColor = "";
var fileName = 'ios-build-data.json';
getBuildData();

async function getBuildData(){

  let username = process.env.BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME";
  let accesskey = process.env.BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACCESS_KEY";
  let bstackCredentials = username+":"+accesskey; 
  let bstackCredentialsObj = Buffer.from(bstackCredentials, "utf8"); 
  let base64String = bstackCredentialsObj.toString("base64"); 
  var statusColor = "";
  var buildid="";//Add the Build ID here, can be programmed to be fetched dynamically basis where the tests are being triggered from
  
  var options = {
    'method': 'GET',
    'url': 'https://api-cloud.browserstack.com/app-automate/flutter-integration-tests/v2/ios/builds/'+buildid,
    'headers': {
      'Authorization': 'Basic '+base64String,
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    fs.writeFileSync(fileName, response.body);
    console.log("Build data has been fetched!")
  });

  setTimeout(() => {
      jsonFile.readFile(fileName, function(err, jsonData) {
      if (err) throw err;
      
      if(jsonData.status=="passed")
        statusColor = "#5AC900";
      else
        statusColor = "#ff7e6b";

      fs.writeFile("ios-reports/"+jsonData.id+".html", `
         <h2>Report for build id - <a href='https://app-automate.browserstack.com/dashboard/v2/builds/`+jsonData.id+`'>`+jsonData.id+`</a></h2>
         <h3>Build Status - <span style='background-color:`+statusColor+`'>`+jsonData.status+`</span></h3>`, function (err) {
        if (err) throw err;
        console.log('File created - ios-reports/'+jsonData.id+".html");
      });

      for (var i = 0; i < jsonData.devices.length; ++i) {
                
        for(var j = 0; j < jsonData.devices[i].sessions.length; j++){
          if(jsonData.devices[i].sessions[j].status=="passed")
            statusColor = "#5AC900";
          else
            statusColor = "#ff7e6b";

          fs.appendFile("ios-reports/"+jsonData.id+".html", `
          
                  <p><strong>Device: `+jsonData.devices[i].device+`</strong></p>
                  <p>Session ID: <a href='https://app-automate.browserstack.com/dashboard/v2/builds/`+jsonData.id+`/sessions/tests/`+jsonData.devices[i].sessions[j].id+`a175e0ec'>`+jsonData.devices[i].sessions[j].id+`</a></p>
                  <p>Session Status: <span style='background-color:`+statusColor+`'>`+jsonData.devices[i].sessions[j].status+`</span>
                  <br>Duration: `+jsonData.devices[i].sessions[j].duration+`s
                  <table border='1'>
                    <tr>
                      <td>Test case count: `+jsonData.devices[i].sessions[j].testcases.count+`</td>
                      <td>Passed: `+jsonData.devices[i].sessions[j].testcases.status.passed+`</td>
                      <td>Failed: `+jsonData.devices[i].sessions[j].testcases.status.failed+`</td>
                      <td>Skipped: `+jsonData.devices[i].sessions[j].testcases.status.skipped+`</td>
                      <td>Timedout: `+jsonData.devices[i].sessions[j].testcases.status.timedout+`</td>
                      <td>Error: `+jsonData.devices[i].sessions[j].testcases.status.error+`</td>
                      <td>Running: `+jsonData.devices[i].sessions[j].testcases.status.running+`</td>
                      <td>Queued: `+jsonData.devices[i].sessions[j].testcases.status.queued+`</td>
                    </tr>
                  </table>
                
              `, function (err) {
          if (err) throw err;
          console.log("Line item added!")
          });
        }
      }
    });
  },1500) 
}