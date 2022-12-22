var game = document.getElementById('game')
var boxes = document.querySelectorAll('li')
var turnDisplay = document.getElementById('whos-turn')
var gameMessages = document.getElementById('game-messages')
var newGame = document.getElementById('new-game')
var joinGame = document.getElementById('join-game')
var player
var gameOver = false
var ConnectFourContract
var ConnectFour
var account
var started = false
var isTurn
var timeOut = false

if (typeof web3 !== 'undefined') {
  web3 = new Web3(window.ethereum)
} else {
  alert('Please install metamask!')
}
const eth = new Eth(window.ethereum)
eth.accounts().then(function (accounts) {
  account = accounts[0]
})

newGame.addEventListener('click', newGameHandler, false)
joinGame.addEventListener('click', joinGameHandler, false)

for (var i = 0; i < 42; i++) {
  boxes[i].addEventListener('click', clickHandler, false)
}

renderInterval = setInterval(render, 1000)
render()

function newGameHandler () {
  if (typeof ConnectFour != 'undefined') {
    console.log('There seems to be an existing game going on already')
  } else if (typeof account != 'undefined') {
    var val = document.getElementById('value-toplay').value * 1000000000
    ConnectFourContract = eth.contract(abi, bytecode, {
      from: account,
      gas: '10000000',
      gasPrice: '2000000000',
      value: val
    })
    ConnectFourContract.new(function (deployError, txHash) {
      if (deployError) {
        document.querySelector('#response').innerHTML =
          'Hmm... there was an error: ' + String(deployError)
      }

      var waitForTransaction = setInterval(function () {
        eth.getTransactionReceipt(txHash, function (err, receipt) {
          if (receipt) {
            clearInterval(waitForTransaction)
            ConnectFour = new web3.eth.Contract(abi, receipt.contractAddress, {
              from: account,
              gas: 3000000,
              gasPrice: '2000000000'
            })
            console.log('create')
            /*ConnectFour.events.allEvents({}, function(error, event) {
							console.log(event);
							render();
						});*/
            document.querySelector('#newGameAddress').innerHTML =
              'Share the contract address with your opponnent: <br><br>' +
              String(receipt.contractAddress) +
              '<br><br>'
            document.querySelector('#player').innerHTML = 'Player1'
            player = 1
          }
        })
      }, 300)
    })
  }
}

function joinGameHandler () {
  var contractAddress = document
    .getElementById('contract-ID-tojoin')
    .value.trim()
  ConnectFour = new web3.eth.Contract(abi, contractAddress, {
    from: account,
    gas: 3000000,
    gasPrice: '2000000000'
  })

  web3.eth.getBalance(contractAddress).then(result => {
    ConnectFour.methods
      .joinGame()
      .send({
        from: account,
        value: result
      })
      .on('error', function (error, receipt) {
        console.log(error)
      })
      .then(result => {
        console.log('join')
        /*ConnectFour.events.allEvents({}, function(error, event) {
				console.log(event);
				render();
			});*/
      })
  })

  document.querySelector('#player').innerHTML = 'Player2'
  player = 2
}

function clickHandler () {
  if (typeof ConnectFour != 'undefined') {
    if (gameOver || !isTurn) {
      return
    }

    var target = this.getAttribute('data-pos')
    target = parseInt(target % 7)

    ConnectFour.methods
      .makeMove(target)
      .send({
        from: account
      })
      .on('error', function (error, receipt) {
        console.log(error)
      })
      .then(result => {
        //console.log(result);
        //this.removeEventListener('click', clickHandler);
        render()
      })
  }
}

function renderBoard () {
  ConnectFour.methods
    .getBoard()
    .call({ from: account })
    .then(function (res) {
      //console.log(res);
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 6; j++) {
          var state = res[i][j]
          if (state > 0) {
            index = (5 - j) * 7 + i
            if (state == 1) {
              boxes[index].className = 'x';
              boxes[index].innerHTML = 'x';
            } else {
              boxes[index].className = 'o';
              boxes[index].innerHTML = 'o';
            }
          }
        }
      }
    })
}

function render () {
  if (typeof ConnectFour != 'undefined') {
    if (!started) {
      ConnectFour.methods.getGameStatus()
        .call({ from: account })
        .then(function (res) {
          if (res != 0) {
            started = true
          }
        })
      if (!started) {
        return
      }
    }

    ConnectFour.methods.getWinner()
      .call({ from: account })
      .then(function (res) {
        //console.log(res);
        if (res != 0) {
          if (!gameOver) {
            renderBoard()
            gameOver = true
            if (res == 3) {
              document.querySelector('#game-messages').innerHTML =
                'The game draws!'
            } else {
              document.querySelector('#game-messages').innerHTML =
                'Player ' + res + ' wins!'
            }
          }
        } else {
          if (!isTurn && !timeOut) {
          ConnectFour.methods.isTimeOut()
            .call({ from: account })
            .then(function (res) {
              if (res) {
                ConnectFour.methods.declareTimeOut()
                  .send({ from: account })
                  .on('error', function (error, receipt) {
                    console.log(error)
                  })
                timeOut = true;
                return;
              }
          });
          }
          ConnectFour.methods.getTurnOwner()
            .call({ from: account })
            .then(function (res) {
              if (res.toLowerCase() == account.toLowerCase()) {
                if (!isTurn || typeof isTurn == 'undefined') {
                  renderBoard()
                  isTurn = true
                  document.querySelector('#game-messages').innerHTML =
                    'Your turn !'
                }
              } else {
                if (isTurn || typeof isTurn == 'undefined') {
                  renderBoard()
                  isTurn = false
                  document.querySelector('#game-messages').innerHTML =
                    "Opponent's turn !"
                }
              }
            })
        }
      })
  }
}
