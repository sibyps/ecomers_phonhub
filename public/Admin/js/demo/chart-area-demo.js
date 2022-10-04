// Set new default font family and font color to mimic Bootstrap's default styling
// (Chart.defaults.global.defaultFontFamily = "Nunito"),
//   '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = "#858796";

function weekchart(data) {
  $.ajax({
    url: "/admin/chart",
    data: {
      data,
    },
    method: "post",
    success: (response) => {
      let total = response.total;
      let date = response.date;
      if (response.daily) {
        var xValues = date;
        var yValues = total;
        var barColors = ["red", "green", "blue", "orange", "brown","yellow","pink"];

        new Chart("myChart", {
          type: "bar",
          data: {
            labels: xValues,
            datasets: [
              {
                backgroundColor: barColors,
                data: yValues,
              },
            ],
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
            },
          },
        });
      }
    },
  });
}
// var xValues = ["a","b","a","d","af"]
//         var yValues =[20,80,55,24,30]
//         var barColors = ["red", "green","blue","orange","brown"];
        
//         new Chart("myChart", {
//           type: "bar",
//           data: {
//             labels: xValues,
//             datasets: [{
//               backgroundColor: barColors,
//               data: yValues
//             }]
//           },
//           options: {
//             legend: {display: false},
//             title: {
//               display: true,
            
//             }
//           }
//         });
window.addEventListener("load", async () => {
  weekchart("daily");
});

