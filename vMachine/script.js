function returnOptions(type, data, title, xDesc, yDesc, xStacked, yStacked, indexAxis) {
  const options = {
    type: type,
    data: data,
    options:{

      plugins: {
        customCanvasBackgroundColor: {
          color: 'white',
        },
        title: {
          display: true,
          text: title,
          color: "#2B262D",
          font: {
            size: 14,
          },
        },
        tooltip: {
          titleFont: {
            size: 18,
          },
          bodyFont: {
            size: 18,
          },
        },
        legend: {
          labels: {
            color: "#2B262D",
            font: {
              size: 12,
            },
          },
        },
      },
      indexAxis: indexAxis, // Use the indexAxis parameter here
      scales: {
        x: {
          stacked: xStacked,
          title: {
            display: true,
            text: xDesc,
            font: {
              size: 14,
            },
            padding: {
              top: 10,
            },
            color: '#2B262D',
          },
          ticks: {
            color: "#2B262D",
            font: {
              size: 16,
            },
          },
          grid: {
            color: "#6f6f73",
          },
        },
        y: {
          stacked: yStacked,
          title: {
            display: true,
            text: yDesc,
            font: {
              size: 14,
            },
            padding: {
              bottom: 10,
            },
            color: '#2B262D',
          },
          ticks: {
            color: "#2B262D",
            font: {
              size: 18,
            },
          },
          grid: {
            color: "#6f6f73",
          },
        },
      },
    }
  }

  return options;
}


const category = ["Carbonated", "Food", "Non Carbonated", "Water"]
const vmLocation = ["Brunswick Sq Mall", "EB Public Library", "Earle Asphalt", "GuttenPlans"]
const categorySales = {};
const totalSaleFromMachine = {};
const totalTransactionsFromMachine = {};
const cashSalesFromMachine = {};
const creditSalesFromMachine = {};
const transactionOnVendingMachineEachMonth = [];
const transactionOnVendingMachineEachcategory = [];
const test = [];
const uniquePlace = [];
const uniqueDate = [];
const avgSales = [];

categorySales["Carbonated"] = parseFloat(0)
categorySales["Food"] = parseFloat(0)
categorySales["Water"] = parseFloat(0)
categorySales["Non Carbonated"] = parseFloat(0)

fetch('./data/Pivot_Table.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(response => {
    console.log("asdf");
   

    // setData(response.data)
    response.data.map((value)=>{
      const { Location, TotalSales, TotalTransactions, CashSales, CreditSales, CarbonatedSales, FoodSales, NonCarbonatedSales, WaterSales, Month} = value;

      // buat ambil location
      if(!uniquePlace.includes(Location)){
        uniquePlace.push(Location)
      }

      const [y, m] = Month.split("-");
      const date = new Date(null, m - 1);
      const monthName = date.toLocaleString('en', { month: 'long' })
      
      // buat ambil month
      if(!uniqueDate.includes(monthName)){
        uniqueDate.push(monthName)
      }
      
      // buat ambil transaction di vm each month
      if(!transactionOnVendingMachineEachMonth[Location]){
        transactionOnVendingMachineEachMonth[Location] = {}
        transactionOnVendingMachineEachMonth[Location][monthName] = parseFloat(TotalTransactions);
      }
      else{
        transactionOnVendingMachineEachMonth[Location][monthName] = parseFloat(TotalTransactions)
      }
      
      // buat ambil transaction di vm each category
      if (!test[category[0]]) {
        test[category[0]] = {};
      }
      if (!test[category[0]][Location]) {
          test[category[0]][Location] = parseFloat(CarbonatedSales);
      } else {
          test[category[0]][Location] += parseFloat(CarbonatedSales);
      }
      if (!test[category[1]]) {
          test[category[1]] = {};
      }
      if (!test[category[1]][Location]) {
          test[category[1]][Location] = parseFloat(FoodSales);
      } else {
          test[category[1]][Location] += parseFloat(FoodSales);
      }
      if (!test[category[2]]) {
          test[category[2]] = {};
      }
      if (!test[category[2]][Location]) {
          test[category[2]][Location] = parseFloat(NonCarbonatedSales);
      } else {
          test[category[2]][Location] += parseFloat(NonCarbonatedSales);
      }
      if (!test[category[3]]) {
          test[category[3]] = {};
      }
      if (!test[category[3]][Location]) {
          test[category[3]][Location] = parseFloat(WaterSales);
      } else {
          test[category[3]][Location] += parseFloat(WaterSales);
      }
    

      // buat ambil total sales from vm each location
      if (totalSaleFromMachine[Location]) {
        totalSaleFromMachine[Location] += parseFloat(TotalSales);
        totalTransactionsFromMachine[Location] += parseInt(TotalTransactions)
      } else {
        totalSaleFromMachine[Location] = parseFloat(TotalSales);
        totalTransactionsFromMachine[Location] = parseInt(TotalTransactions)
      }

      // buat ambil cash sales from vm each location
      if(cashSalesFromMachine[Location]){
        cashSalesFromMachine[Location] += parseFloat(CashSales)
      }else{
        cashSalesFromMachine[Location] = parseFloat(CashSales)
      }

      // buat ambil cash sales from vm each location
      if(creditSalesFromMachine[Location]){
        creditSalesFromMachine[Location] += parseFloat(CreditSales)
      }else{
        creditSalesFromMachine[Location] = parseFloat(CreditSales)
      }

      // buat ambil sales from vm each category
      categorySales["Carbonated"] += parseFloat(CarbonatedSales)
      categorySales["Food"] += parseFloat(FoodSales)
      categorySales["Water"] += parseFloat(WaterSales)
      categorySales["Non Carbonated"] += parseFloat(NonCarbonatedSales)
      

      // console.log(cashSalesFromMachine);
      // console.log(creditSalesFromMachine);
      // console.log(categorySales);
      // console.log(totalSaleFromMachine);
      // console.log(uniqueDate);
      // console.log(uniquePlace);
      // console.log(transactionOnVendingMachineEachMonth);
      // console.log(test );
    })
    
    // nge rata2in sales tiap location
    uniquePlace.forEach(element => {
      var avg = totalSaleFromMachine[element]/totalTransactionsFromMachine[element]
      avgSales.push(avg)
    });

    const dataChart1 ={
      labels:uniquePlace,
      datasets: [
        {
          label: "Average Transaction" ,
          data: avgSales,
          borderColor: "#5fb883",
          backgroundColor: "#5fb883",
        },
      ]
    }

    const dataChart2 ={
      labels:uniquePlace,
      datasets: [
        { 
          label: "Cash",
          data: cashSalesFromMachine,
          backgroundColor: "#5fb883",
          borderColor: "#5fb883",
          borderWidth: 1,
        },
        { 
          label: "Credit",
          data: creditSalesFromMachine,
          backgroundColor: "#d6607e",
          borderColor: "#d6607e",
          borderWidth: 1,
        },
      ]
    }

    const dataChart3 ={
      labels: category,
      datasets: [
        { 
          label: "Category",
          data: categorySales,
          backgroundColor: "#5fb883",
          borderColor: "#5fb883",
          borderWidth: 1,
        }
      ]
    }

    const dataChart4 = { 
      labels: uniqueDate,
      datasets: [
        { 
          label: "Brunswick Sq Mall",
          data: transactionOnVendingMachineEachMonth["Brunswick Sq Mall"],
          backgroundColor: "#9F496E",
          borderColor: "#9F496E",
          borderWidth: 1,
        },
        { 
          label: "EB Public Library",
          data: transactionOnVendingMachineEachMonth["EB Public Library"],
          backgroundColor: "#cfc282",
          borderColor: "#cfc282",
          borderWidth: 1,
        },
        { 
          label: "Earle Asphalt",
          data: transactionOnVendingMachineEachMonth["Earle Asphalt"],
          backgroundColor: "#5fb883",
          borderColor: "#5fb883",
          borderWidth: 1,
        },
        { 
          label: "GuttenPlans",
          data: transactionOnVendingMachineEachMonth["GuttenPlans"],
          backgroundColor: "#7891de",
          borderColor: "#7891de",
          borderWidth: 1,
        },
        
      ]
    }

    const dataChart5 = { 
      labels: uniquePlace,
      datasets: [
        { 
          label: category[0],
          data: test[category[0]],
          backgroundColor: "#9F496E",
          borderColor: "#9F496E",
          borderWidth: 1,
        },
        { 
          label: category[1],
          data: test[category[1]],
          backgroundColor: "#cfc282",
          borderColor: "#cfc282",
          borderWidth: 1,
        },
        { 
          label: category[2],
          data: test[category[2]],
          backgroundColor: "#5fb883",
          borderColor: "#5fb883",
          borderWidth: 1,
        },
        { 
          label: category[3],
          data: test[category[3]],
          backgroundColor: "#7891de",
          borderColor: "#7891de",
          borderWidth: 1,
        },
        
      ]
    }

    const configChart1 = returnOptions("line", dataChart1, "Average Value of Transaction", "Location", "Average Value Transaction", false, false, "x")

    const configChart2 = returnOptions("bar", dataChart2, "Payment Type in each Machine", "Location", "Total Transaction", false, false, "x")

    const configChart3 = returnOptions("bar", dataChart3, "Sales in each Category", "Category", "Total Transaction", false, false, "x")
    
    const configChart4 = returnOptions("bar", dataChart4, "Peak Sales Date", "Transaction Date", "Transaction Count", false, false, "x")
  
    const configChart5 = returnOptions("bar", dataChart5, "Top Selling Category Across Machine", "Category", "Location", true, true, 'y')

    const configChartX = returnOptions("bar", dataChart5, "asdf", "asdf", "asdf", true, true, 'y')
    const myChart1 = new Chart(
      document.getElementById('chart1'),
      configChart1
    );

    const myChart2 = new Chart(
      document.getElementById('chart2'),
      configChart2
    );

    const myChart3 = new Chart(
      document.getElementById('chart3'),
      configChart3
    );

    const myChart4 = new Chart(
      document.getElementById('chart4'),
      configChart4
    );

    const myChart5 = new Chart(
      document.getElementById('chart5'),
      configChart5
    );
  
    const chartVersion = document.getElementById('chartVersion');
    chartVersion.innerText = Chart.version;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

  