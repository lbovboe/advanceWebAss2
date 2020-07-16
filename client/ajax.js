$(function () {
  $("#submit").on("click", function (e) {
    e.preventDefault();
    
    //-------------------------------form data for sending backend-----------------------------------
    //get data from form and send to back end
    var yearData = $("#year").val();
    var sMonthData = $("#sMonth").val();
    var eMonthData = $("#eMonth").val();
    var radioValue = $("input[name='present']:checked").val();
    var radioWeather = $("input[name='weather']:checked").val();
    // $("#div1").text(
    //   `year : ${yearData} , sMonth : ${sMonthData} , eMonth: ${eMonthData} , 
    //         presentation : ${radioValue} , weather: ${radioWeather}`
    // );
    // make into object
    var obj = {
      year: yearData,
      sMonth: sMonthData,
      eMonth: eMonthData,
    };
    // make into string and send to backend
    var json = JSON.stringify(obj);
    console.log(yearData);
    console.log(sMonthData);
    console.log(eMonthData);
    //--------------------------------------request backend function and get response back----------------------------------------------
    $.post("/searchInfo", json, function (data) {
      //data: Received from server in JSON string form
      console.log(data);
      //--------------------------------Parse and make newObj with array Months---------------------
      const objJson = JSON.parse(data);
      const newObj = {
        months: [
          "jan",
          "feb",
          "march",
          "Apr",
          "May",
          "jun",
          "july",
          "Aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ],
        ...objJson,
      };
      // length of keys, total 3
      const objLength = Object.keys(newObj).length; // 3 , since month only ws and sr
      console.log(objLength);
      // length of the data in ws or sr
      const arrLength = Object.values(newObj.ws).length; //  length of the array

      //-------------------------------------------------Presentation methods---------------------
      //makeTable(objLength, newObj, sMonthData, eMonthData, arrLength);
      if (radioValue == "table") {
        $("#graphPresent").hide();
        makeTable(
          objLength,
          newObj,
          sMonthData,
          eMonthData,
          arrLength,
          radioWeather
        );
      } else if (radioValue == "graph") {
        $("table").remove();
        $("#graphPresent").show();
        let arrData = Object.values(objJson)[0];
        let title = "Weather Measurement against Months";
        let legend = "Wind Speed Km/h";
        let legend2 = "Solar Radiation Kwh/m2";
        let arrData2 = Object.values(objJson)[1];
        let monthsArr = Object.values(newObj)[0];
        console.log(monthsArr);
        lineGraph(
          monthsArr,
          arrData,
          arrData2,
          title,
          legend,
          legend2,
          radioWeather
        );
      } else if (radioValue == "tableGraph") {
        makeTable(
          objLength,
          newObj,
          sMonthData,
          eMonthData,
          arrLength,
          radioWeather
        );
        $("#graphPresent").show();
        let arrData = Object.values(objJson)[0];
        let title = "Weather Measurement against Months";
        let legend = "Wind Speed Km/h";
        let legend2 = "Solar Radiation Kwh/m2";
        let arrData2 = Object.values(objJson)[1];
        let monthsArr = Object.values(newObj)[0];
        console.log(monthsArr);
        lineGraph(
          monthsArr,
          arrData,
          arrData2,
          title,
          legend,
          legend2,
          radioWeather
        );
      }
    });
  });
});
//---------------------table------------------------------
//objLength = length for custom object (month,ws,sr) so is 3 for outer loop
// newObj = custom object
// arrLength = length of the ws or sr array so ensure how many times to repeat
// type = either with ws or sr or both

const makeTable = (objLength, newObj, sMonth, eMonth, arrLength, type) => {
  $("table").remove();
  
  var element = "";
  var table = $("<table border = 1>").addClass("tablePresentation");
  if (type == "wsSr") {
    for (let i = 0; i < objLength; i++) {
      var row = $("<tr>");

      if (i == 1) {
        row.append($("<td>").text(Object.keys(newObj)[i] + "  (km/h)"));
      } else if (i == 2) {
        row.append($("<td>").text(Object.keys(newObj)[i] + "  (kWh/m2)"));
      }
      if (i == 0) {
        row.append($("<td>").text(Object.keys(newObj)[i]));
        for (let k = sMonth - 1; k < eMonth; k++) {
          element = $("<td>").text(Object.values(newObj)[0][k]);
          row.append(element);
        }
      } else {
        for (let j = 0; j < arrLength; j++) {
          element = $("<td>").text(Object.values(newObj)[i][j]);
          row.append(element);
        }
      }

      table.append(row);
    }
    $("#tablePresent").append(table);
  } else if (type == "ws") {
    for (let i = 0; i < objLength - 1; i++) {
      var row = $("<tr>");

      if (i == 1) {
        row.append($("<td>").text(Object.keys(newObj)[i] + "  (km/h)"));
      }
      if (i == 0) {
        row.append($("<td>").text(Object.keys(newObj)[i]));
        for (let k = sMonth - 1; k < eMonth; k++) {
          element = $("<td>").text(Object.values(newObj)[0][k]);
          row.append(element);
        }
      } else {
        for (let j = 0; j < arrLength; j++) {
          element = $("<td>").text(Object.values(newObj)[i][j]);
          row.append(element);
        }
      }

      table.append(row);
    }
    $("#tablePresent").append(table);
  } else if (type == "sr") {
    for (let i = 0; i < objLength - 1; i++) {
      var row = $("<tr>");

      if (i == 1) {
        row.append($("<td>").text(Object.keys(newObj)[i + 1] + "  (kWh/m2)"));
      }
      if (i == 0) {
        row.append($("<td>").text(Object.keys(newObj)[i]));
        for (let k = sMonth - 1; k < eMonth; k++) {
          element = $("<td>").text(Object.values(newObj)[0][k]);
          row.append(element);
        }
      } else {
        for (let j = 0; j < arrLength; j++) {
          element = $("<td>").text(Object.values(newObj)[i + 1][j]);
          row.append(element);
        }
      }

      table.append(row);
    }
    $("#tablePresent").append(table);
  }
};
//--------------------------graph----------------------------
const lineGraph = (
  arrMonths,
  arrData,
  arrData2,
  title,
  legend,
  legend2,
  type
) => {
  let myChart = document.getElementById("myChart").getContext("2d");
  $("#graphPresent").css("background-color","white");
  console.log(arrData);
  // Global Options
  Chart.defaults.global.defaultFontFamily = "Lato";
  Chart.defaults.global.defaultFontSize = 18;
  Chart.defaults.global.defaultFontColor = "#777";

  if (type == "wsSr") {
    let LineChart = new Chart(myChart, {
      type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: arrMonths,
        datasets: [
          {
            label: legend,
            data: arrData,
            fill: false,
            //backgroundColor:'green',
            backgroundColor: "blue",
            borderWidth: 1,
            borderColor: "blue",
            hoverBorderWidth: 3,
            hoverBorderColor: "#000",
          },
          {
            label: legend2,
            data: arrData2,
            fill: false,
            //backgroundColor:'green',
            backgroundColor: "red",
            borderWidth: 1,
            borderColor: "red",
            hoverBorderWidth: 3,
            hoverBorderColor: "#000",
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize: 25,
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            fontColor: "black",
          },
        },
        layout: {
          padding: {
            left: 50,
            right: 0,
            bottom: 0,
            top: 0,
          },
        },
        tooltips: {
          enabled: true,
        },
      },
    });
  } else if (type == "ws") {
    let LineChart = new Chart(myChart, {
      type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: arrMonths,
        datasets: [
          {
            label: legend,
            data: arrData,
            fill: false,
            //backgroundColor:'green',
            backgroundColor: "blue",
            borderWidth: 1,
            borderColor: "blue",
            hoverBorderWidth: 3,
            hoverBorderColor: "#000",
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize: 25,
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            fontColor: "black",
          },
        },
        layout: {
          padding: {
            left: 50,
            right: 0,
            bottom: 0,
            top: 0,
          },
        },
        tooltips: {
          enabled: true,
        },
      },
    });
  } else if (type == "sr") {
    let LineChart = new Chart(myChart, {
      type: "line", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: arrMonths,
        datasets: [
          {
            label: legend2,
            data: arrData2,
            fill: false,
            //backgroundColor:'green',
            backgroundColor: "red",
            borderWidth: 1,
            borderColor: "red",
            hoverBorderWidth: 3,
            hoverBorderColor: "#000",
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize: 25,
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            fontColor: "black",
          },
        },
        layout: {
          padding: {
            left: 50,
            right: 0,
            bottom: 0,
            top: 0,
          },
        },
        tooltips: {
          enabled: true,
        },
      },
    });
  }
};
