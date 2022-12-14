async function setState()
{

const data = await axios.get("http://localhost:3020/getTimerValue").then(res=>res.data.data);

let hasstarted = data.value
const sbutton = document.querySelector('#sbutton')


if(hasstarted===true)
  {
    sbutton.style.backgroundColor= 'yellowgreen';
    sbutton.innerHTML= "Vote"
      sbutton.disabled=false;
  }
  else
  {
    sbutton.style.backgroundColor= 'red';
    sbutton.innerHTML= "X"
    sbutton.disabled=true;
    window.location.href = 'addcandidate.html';
  }



}
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() { //to initialize app
    return App.initWeb3();
  },

  initWeb3: function() {    //connect client side application to local blockchain
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      document.getElementById("candidatesResults").innerHTML=""
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
   
        document.getElementById("candidatesResults").innerHTML=""
        if(hasVoted) {
          $('form').hide();
        } 

         App.render();


      });
    });
  },

  render: async() =>{
 
 

setState()
 
    var temp_Store= document.getElementById("candidatesResults");

    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data  , to list out candidates
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.Count();
    }).then(function(candidatesCount) {
     
      var candidatesResults = $("#candidatesResults");
      console.log(candidatesResults)
      candidatesResults.empty();
     
      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      
      document.addEventListener("DOMContentLoaded", function(e) { 


        var div = document.getElementById('candidatesResults');
        console.log(div)
        var childDivs = div.getElementsByTagName('div');
  console.log(childDivs)
     
      
      })
   



      // for( i=0; i< childDivs.length; i++ )
      // {
      //  var childDiv = childDivs[i];
      //  console.log(childDiv)
      // }

//loop-----------------------------------------------------------------------------------------------

      for (let i = 1; i <= candidatesCount; i++) {
       
        electionInstance.Candidates(i).then(function(candidate) {
         
        //   console.log(candidate , `i = ${i}`)
        //  console.log("----------")
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<div class='flex items-center justify-between pb-5 bg-yellow-50 border-2 border-orange-200'><p class='text-lg mx-auto font-bold m-4 text-black bg-yellow-50 '>" + id + "</p>" + "<p class='text-lg mx-auto font-bold m-4 text-black bg-yellow-50 '>" + name + "</p>" + "</div>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
