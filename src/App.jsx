import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {

  /* Setting list to store transactions */
  const [transactionList, setTransactionList] = useState([]);

  /* Setting vairables to store error state */
  const [inputErrors, setInputErrors] = useState({
    'nameError': false,
    'valueError': false,
  });

  /* Setting input variables */
  const [inputValues, setInputValues] = useState({
    'transactionName': '',
    'transactionValue': '',
    'transactionType': 'income',
  });

  /* Function to get current balance */
  const getBalance = () => {
    let balance = 0;
    for (let key in transactionList) {
      if (transactionList[key].type == 'income') {
        balance += parseFloat(transactionList[key].value);
      } else {
        balance -= parseFloat(transactionList[key].value);
      }
    }
    return balance.toFixed(2);
  }

  /* Function to get formatted current date */
  const getFormattedDate = () => {
    // Create a new Date object
    const currentDate = new Date();

    // Get various components of the date
    const year = currentDate.getFullYear();
    // Note: Months are zero-based, so add 1
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Return the current date
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /* Rendering transactions */
  const renderTransactions = () => {
    return transactionList.map((transaction) => (
      <li className='flex w-full justify-between rounded-md border p-2 items-center shadow-md' key={transaction.uuid}>
        <div className='flex gap-4 items-center'>
          <button className='text-black font-bold border w-6 h-6 bg-red-400 rounded-md' onClick={() => handleRemoveTransaction(transaction.uuid)}>-</button>

          <div>
            <p className='text-black font-bold'>{transaction.name}</p>
            <p className='text-gray-400'>{transaction.date}</p>
          </div>
        </div>

        <h1 className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? '+' : '-'} ${transaction.value}</h1>
      </li>
    ));
  }

  /* Transaction addition logic */
  const handleAddTransaction = () => {
    // Setting input error status
    if (inputValues.transactionName === '') {
      setInputErrors({
        'nameError': true,
        'valueError': false,
      });
      return;
    } else if (inputValues.transactionValue == '' || inputValues.transactionValue == 0) {
      setInputErrors({
        'nameError': false,
        'valueError': true,
      });
      return;
    } else {
      setInputErrors({
        'nameError': false,
        'valueError': false,
      });
    }

    // Updating transaction list if there are no input errors
    let updatedTransactionList = [...transactionList];
    updatedTransactionList.unshift({
      'name': inputValues.transactionName,
      'value': parseFloat(inputValues.transactionValue).toFixed(2),
      'type': inputValues.transactionType,
      'date': getFormattedDate(),
      'uuid': uuidv4(),
    });
    setTransactionList(updatedTransactionList);

    // Clearing input variables
    setInputValues({
      'transactionName': '',
      'transactionValue': '',
      'transactionType': 'income',
    });
  }

  /* Transaction deletion logic */
  const handleRemoveTransaction = (key) => {
    let updatedTransactionList = transactionList.filter((item) => item.uuid != key);
    setTransactionList(updatedTransactionList);
  }

  /* Input change handler */
  const handleInputChange = (event) => {
    if (event.target.name === 'transactionValue' && event.target.value < 0) {
      event.target.value = event.target.value * -1;
    }
    setInputValues({
      ...inputValues,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <main className='flex flex-col items-center w-screen mt-12 gap-8 font-mono'>
      <div className={`font-bold text-6xl justify-start w-3/4 md:w-1/2 ${getBalance() >= 0 ? ' text-green-400' : 'text-red-400'}`}>
        ${getBalance()}
      </div>

      <div className='flex w-3/4 md:w-1/2 justify-between'>
        <input className={`w-1/4 border-b focus:outline-none ${inputErrors.nameError ? 'border-red-300' : 'border-gray-300'}`}
          placeholder='Income or expense...'
          type="text" value={inputValues.transactionName}
          onChange={handleInputChange}
          name='transactionName' />

        <input className={`w-1/4 border-b focus:outline-none ${inputErrors.valueError ? 'border-red-300' : 'border-gray-300'}`}
          placeholder='Amount...'
          type="number"
          min='0'
          value={inputValues.transactionValue}
          onChange={handleInputChange}
          name='transactionValue' />

        <select value={inputValues.transactionType} onChange={handleInputChange} name='transactionType'>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <button className='text-black font-bold border w-6 bg-red-400 rounded-md' onClick={handleAddTransaction}>+</button>
      </div>

      <ul className='flex w-3/4 md:w-1/2 flex-col gap-4 mb-6'>
        {renderTransactions()}
      </ul>
    </main>
  )
}

export default App
