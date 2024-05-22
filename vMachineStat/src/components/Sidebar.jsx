window.process = {};
import { useState, useEffect } from 'react'
import {LineGraph} from './Line'
import { parse } from 'postcss';
import { BarChart } from './Bar';

export const Sidebar = () => {

  // variable2 utama
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState();
  const [axis, setAxis] = useState(["x", "y"]);
  const [placesDummy, setPlacesDummy] = useState(["Brunswick Sq Mall", "EB Public Library", "Earle Asphalt", "GuttenPlans"]);
  const [category, setcategory] = useState(["Carbonated", "Food", "Non Carbonated", "Water"]);
  const [chartTitle, setChartTitle] = useState(["Average Value of Transaction", "Payment Type in each Machine", "Sales in each Category", "Peak Sales Date", "Top Selling Category Across Machine"])
  const [xDesc, setxDesc] = useState(["Location", "Location", "Category", "Transaction Date", "Category"])
  const [yDesc, setyDesc] = useState(["Average Value Transaction", "Total Transaction", "Total Transaction", "Transaction Count", "Location"])
  const [transactionDate, settransactionDate] = useState([])
  const [avgTrans, setAvgTrans] = useState([])
  const [cashSales, setCashSales] = useState([])
  const [categorySales, setcategorySales] = useState([])
  const [creditSales, setCreditSales] = useState([])
  const [transactionMonth, setTransactionMonth] = useState([])
  const [categoryTransaction, setCategoryTransaction] = useState([])

  // ambil data nya
  useEffect(() => {
    fetch('./Pivot_Table.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(response => {
        // variable penampung
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

          if(!transactionOnVendingMachineEachcategory[Location]){
            transactionOnVendingMachineEachcategory[Location] = {}
            transactionOnVendingMachineEachcategory[Location][category[0]] = parseFloat(CarbonatedSales)
            transactionOnVendingMachineEachcategory[Location][category[1]] = parseFloat(FoodSales)
            transactionOnVendingMachineEachcategory[Location][category[2]] = parseFloat(NonCarbonatedSales)
            transactionOnVendingMachineEachcategory[Location][category[3]] = parseFloat(WaterSales)
          }else{
            transactionOnVendingMachineEachcategory[Location][category[0]] += parseFloat(CarbonatedSales)
            transactionOnVendingMachineEachcategory[Location][category[1]] += parseFloat(FoodSales)
            transactionOnVendingMachineEachcategory[Location][category[2]] += parseFloat(NonCarbonatedSales)
            transactionOnVendingMachineEachcategory[Location][category[3]] += parseFloat(WaterSales)
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
          
        })
        
        // nge rata2in sales tiap location
        uniquePlace.forEach(element => {
          var avg = totalSaleFromMachine[element]/totalTransactionsFromMachine[element]
          avgSales.push(avg)
        });

        // set variable penampung ke utama
        setCategoryTransaction(test)
        // setCategoryTransaction(transactionOnVendingMachineEachcategory)
        setTransactionMonth(transactionOnVendingMachineEachMonth)
        settransactionDate(uniqueDate)
        setcategorySales(categorySales)
        setCashSales(cashSalesFromMachine)
        setCreditSales(creditSalesFromMachine)
        setPlaces(uniquePlace)
        setLoading(false);
        setError(null);
        setAvgTrans(avgSales)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // kalo data ny masih loading / ada error bakal ngedisplay loading/error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // data average value of transaction/chart 1
  const averageData ={
    labels:places,
    datasets: [
      {
        label: "Average Transaction" ,
        data: avgTrans,
        borderColor: "#5fb883",
        backgroundColor: "#5fb883",
      },
    ]
  }

  // data payment type in each machine/chart 2
  const paymentTypeData = { 
    labels: places,
    datasets: [
      { 
        label: "Cash",
        data: cashSales,
        backgroundColor: "#5fb883",
        borderColor: "#5fb883",
        borderWidth: 1,
      },
      { 
        label: "Credit",
        data: creditSales,
        backgroundColor: "#d6607e",
        borderColor: "#d6607e",
        borderWidth: 1,
      },
    ]
  }

  // data sales in each category/chart 3
  const categoryData = { 
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

  // data peak sales date chine/chart 4
  const dateData = { 
    labels: transactionDate,
    datasets: [
      { 
        label: "Brunswick Sq Mall",
        data: transactionMonth["Brunswick Sq Mall"],
        backgroundColor: "#9F496E",
        borderColor: "#9F496E",
        borderWidth: 1,
      },
      { 
        label: "EB Public Library",
        data: transactionMonth["EB Public Library"],
        backgroundColor: "#cfc282",
        borderColor: "#cfc282",
        borderWidth: 1,
      },
      { 
        label: "Earle Asphalt",
        data: transactionMonth["Earle Asphalt"],
        backgroundColor: "#5fb883",
        borderColor: "#5fb883",
        borderWidth: 1,
      },
      { 
        label: "GuttenPlans",
        data: transactionMonth["GuttenPlans"],
        backgroundColor: "#7891de",
        borderColor: "#7891de",
        borderWidth: 1,
      },
      
    ]
  }
  
  // data top selling category across machine/chart 5
  const categoryTransactionData = { 
    labels: places,
    datasets: [
      { 
        label: category[0],
        data: categoryTransaction[category[0]],
        backgroundColor: "#9F496E",
        borderColor: "#9F496E",
        borderWidth: 1,
      },
      { 
        label: category[1],
        data: categoryTransaction[category[1]],
        backgroundColor: "#cfc282",
        borderColor: "#cfc282",
        borderWidth: 1,
      },
      { 
        label: category[2],
        data: categoryTransaction[category[2]],
        backgroundColor: "#5fb883",
        borderColor: "#5fb883",
        borderWidth: 1,
      },
      { 
        label: category[3],
        data: categoryTransaction[category[3]],
        backgroundColor: "#7891de",
        borderColor: "#7891de",
        borderWidth: 1,
      },
      
    ]
  }

  return (
    <>
      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-main" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium font-custom">
              <li className='mb-5'>
                  <a href="#" className="flex items-start text-2xl p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="./public/title.png" alt="" />
                  </a>
              </li>
              <li>
                  <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-hover transition duration-300 ease-in-out ">
                    <svg className="w-8 h-8 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                    </svg>
                    <span className="ms-3 text-2xl font-custom">Dashboard</span>
                  </a>
              </li>
              <li>
                  <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-hover transition duration-300 ease-in-out">
                    <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                    </svg>
                    <span className="ms-3 text-2xl">Table</span>
                  </a>
              </li>
              

            </ul>
        </div>
      </aside>

      <div className="sm:ml-64 bg-[url('./public/mario-background.jpg')] bg-repeat bottom-0">
        <div className="">
            <div className="mb-8">
              <div className="flex items-center justify-center h-24  bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-500 pl-12 transition duration-75 text-start group-hover:text-gray-900 color-text text-5xl font-custom">
                    Business Dashboard
                  </p>
              </div>
            </div>
            
            {/* here weh */}
            <div className="flex items-center justify-center h-96 mb-16 pb-5 bg-white ml-80 mr-80">
              <LineGraph title={chartTitle[0]} data={averageData} xDesc={xDesc[0]} yDesc={yDesc[0]}/>
            </div>
            <div className="flex items-center justify-center h-96 mb-16 pb-5 bg-white ml-80 mr-80">
              <BarChart title={chartTitle[1]} data={paymentTypeData} xDesc={xDesc[1]} yDesc={yDesc[1]} xStacked={false} yStacked={false} axis={axis[0]}/>
            </div>
            <div className="flex items-center justify-center h-96 mb-16 pb-5 bg-white ml-80 mr-80">
              <BarChart title={chartTitle[2]} data={categoryData} xDesc={xDesc[2]} yDesc={yDesc[2]} xStacked={false} yStacked={false} axis={axis[0]}/>
            </div>
            <div className="flex items-center justify-center h-96 mb-16 pb-5 bg-white ml-80 mr-80">
              <BarChart title={chartTitle[3]} data={dateData} xDesc={xDesc[3]} yDesc={yDesc[3]} xStacked={false} yStacked={false} axis={axis[0]}/>
            </div>
            <div className="flex items-center justify-center h-96 bg-white ml-80 mr-80">
              <BarChart title={chartTitle[4]} data={categoryTransactionData} xDesc={xDesc[4]} yDesc={yDesc[4]} xStacked={true} yStacked={true} axis={axis[1]}/>
            </div>
        </div>
      </div>
    </>
  )
}

