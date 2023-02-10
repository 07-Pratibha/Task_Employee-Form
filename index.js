
//Defining variables
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";
var connToken = "90932634|-31949276207102681|90948660";

$("#empid").focus();

//saving data in Local Storage
function saveRecNo2LS(jsonObj) {
  var Data = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", Data.rec_no);
}

//checking whether the employee id by user matched the db
function getEmpIdAsJsonObj() {
  var empid = $("#empid").val();
  var jsonStr = {
    id: empid,
  };
  return JSON.stringify(jsonStr);
}

//if it matches we fill the other form elements
function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var data = JSON.parse(jsonObj.data).record;
  $("#empname").val(data.name);
  $("#empsal").val(data.salary);
  $("#hra").val(data.hra);
  $("#da").val(data.da);
  $("#deduct").val(data.deduction);
}

// The user enters employee id.this function runs
function getEmp() {
  var empIdJsonObj = getEmpIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(connToken,empDBName,empRelationName,empIdJsonObj);
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
  jQuery.ajaxSetup({ async: true });
  
  //if not found
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#empname").focus();
    $("#change").prop("disabled", true);
    $("#empname").prop("disabled", false);
    $("#da").prop("disabled", false);
    $("#hra").prop("disabled", false);
    $("#deduct").prop("disabled", false);
    $("#empsal").prop("disabled", false);
  } 
  //if found
  else if (resJsonObj.status === 200) {
    $("#empid").prop("disabled", true);
    fillData(resJsonObj);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#empname").focus();
    $("#save").prop("disabled", true);
    $("#empname").prop("disabled", false);
    $("#empsal").prop("disabled", false);
    $("#hra").prop("disabled", false);
    $("#da").prop("disabled", false);
    $("#deduct").prop("disabled", false);
  }
}

// Reset the form
function resetForm() {
  $("#empid").val("");
  $("#empname").val("");
  $("#empsal").val("");
  $("#hra").val("");
  $("#da").val("");
  $("#deduct").val("");
  $("#empid").prop("disabled", false);
  $("#empname").prop("disabled", true);
  $("#empsal").prop("disabled", true);
  $("#hra").prop("disabled", true);
  $("#da").prop("disabled", true);
  $("#deduct").prop("disabled", true);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", false);
  $("#reset").prop("disabled", true);
  $("#empid").focus();
}

//checking the data
function validateData() {
  var empid, empname, empsal, hra, da, deduct;
  empid = $("#empid").val();
  empname = $("#empname").val();
  empsal = $("#empsal").val();
  hra = $("#hra").val();
  da = $("#da").val();
  deduct = $("#deduct").val();

  if (empid === "") {
    alert("Employee ID missing");
    $("#empid").focus();
    return "";
  }

  if (empname === "") {
    alert("Employee Name missing");
    $("#empname").focus();
    return "";
  }

  if (empsal === "") {
    alert("Employee Salary missing ");
    $("#empsal").focus();
    return "";
  }

  if (hra === "") {
    alert("HRA missing");
    $("#hra").focus();
    return "";
  }

  if (deduct === "") {
    alert("Deduction missing");
    $("#deduct").focus();

    return "";
  }

  if (da === "") {
    alert("DA missing");
    $("#da").focus();
    return "";
  }
  var jsonStrObj = {
    id: empid,
    name: empname,
    salary: empsal,
    hra: hra,
    da: da,
    deduction: deduct,
  };
  return JSON.stringify(jsonStrObj);
}

// Save the employee data
function saveData() {
  var jsonStrObj = validateData(); //validateData will return the string of a JSON object
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest( connToken,jsonStrObj,empDBName,empRelationName);
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl( putRequest,jpdbBaseURL,jpdbIML);
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#empid").focus();
}

//Updating the data
function changeData() {
    $('#change').prop('disabled',true);
     $('#reset').prop('disabled',true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName,localStorage.getItem("recno"));
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl( updateRequest,jpdbBaseURL,jpdbIML);
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#empid").focus();
}
