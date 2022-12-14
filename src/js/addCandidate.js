async function disableButton()
{

  const data = await axios.get("http://localhost:3020/getTimerValue").then(res=>res.data.data);
  //console.log(data);
let hasstarted = data.value
//console.log("hasstarted",hasstarted);
  if(hasstarted===true)
  hasstarted=false;
  else
  hasstarted=true;

  const sbutton = document.querySelector('.sbutton')
let togglebutton = document.querySelector('.startVoting')

if(hasstarted===true)
  {
    sbutton.style.backgroundColor= 'grey';
    togglebutton.style.backgroundColor='red';
    togglebutton.innerHTML= "End Voting Phase"
      sbutton.disabled=true;
  }
  else
  {
    sbutton.style.backgroundColor= 'yellowgreen';
    togglebutton.style.backgroundColor='yellowgreen';
    togglebutton.innerHTML= "Start Voting Phase"
    sbutton.disabled=false;
  }

  const updatedata = await axios.post("http://localhost:3020/getTimerValue").then(res=>res.data.data);
 // console.log("updated",updatedata);

}
async function setState()
{

const data = await axios.get("http://localhost:3020/getTimerValue").then(res=>res.data.data);

let hasstarted = data.value
const sbutton = document.querySelector('.sbutton')
let togglebutton = document.querySelector('.startVoting')

if(hasstarted===true)
  {
    sbutton.style.backgroundColor= 'grey';
    togglebutton.style.backgroundColor='red';
    togglebutton.innerHTML= "End Voting Phase"
      sbutton.disabled=true;
  }
  else
  {
    sbutton.style.backgroundColor= 'yellowgreen';
    togglebutton.style.backgroundColor='yellowgreen';
    togglebutton.innerHTML= "Start Voting Phase"
    sbutton.disabled=false;
  }


}


setState()


App = {
    loading: false,
    contracts: {},
    //loading the app
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
      web3.eth.defaultAccount = web3.eth.accounts[0]
    },
    //web3.js is a library that lets us connect and communicate with the blockchain and in this communicate with metamask.
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      } 
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },


  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const election = await $.getJSON('Election.json')
      App.contracts.Election = TruffleContract(election)
      App.contracts.Election.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.Election = await App.contracts.Election.deployed()
    },
    //creates a new task
    add_Candidate: async () => {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.Election.add_Candidate(content)
      window.location.reload()
    },
    //changes boolean completed to true
    //renders the front end of the client-side webpage
    render: async () => {
      // Prevent double render



      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderList()
  
      // Update loading state
      App.setLoading(false)
    },
    //renders the tasks lists
    renderList: async () => {
      // Load the total task count from the blockchain
      const listCount = await App.Election.Count()
      const $taskTemplate = $('.taskTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= listCount; i++) {
        // Fetch the task data from the blockchain
        const candidate = await App.Election.Candidates(i)
        const taskId = candidate[0].toNumber()
        const taskContent = candidate[1]
        const taskCompleted = candidate[2]

        //----------------checking here

  console.log(candidate)
        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                      
  
     
          $('#taskList').append($newTaskTemplate)
        
       








  
        // Show the task
        $newTaskTemplate.show()
      }
    },
    //displays a loading message while interacting with the blockchain network or metamask
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
}
//loads the application
$(() => {
    $(window).load(() => {
      App.load()
    })
  })