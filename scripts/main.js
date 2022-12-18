var game = document.getElementById('game');
var boxes = document.querySelectorAll('li');
var turnDisplay = document.getElementById('whos-turn');
var gameMessages = document.getElementById('game-messages');
var newGame = document.getElementById('new-game');
var joinGame = document.getElementById('join-game');
var player;
var gameOver = false;
var ConnectFourContract;
var ConnectFour;
var account;
var started = false;
var isTurn = false;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('Please install metamask!')
}
const eth = new Eth(window.ethereum);

eth.accounts().then(function(accounts){
	account = accounts[0];
	ConnectFourContract = eth.contract(abi, bytecode, { from: accounts[0], gas: '30000000' });
});

newGame.addEventListener('click',newGameHandler,false);
joinGame.addEventListener('click',joinGameHandler, false);
    
for(var i = 0; i < 42; i++) {
	boxes[i].addEventListener('click', clickHandler, false);
}

renderInterval = setInterval(render, 1000);
render();


function newGameHandler() {
	if (typeof ConnectFour != 'undefined'){
        		console.log("There seems to be an existing game going on already");
	} else {
		ConnectFourContract.new(function(deployError, txHash) {
			if (deployError) {
				return el('#response').innerHTML = 'Hmm... there was an error: ' + String(deployError);
			}  

			var waitForTransaction = setInterval(function() {
				eth.getTransactionReceipt(txHash, function(err, receipt) {
					if (receipt) {
						clearInterval(waitForTransaction);
						ConnectFour = new web3.eth.Contract(abi, receipt.contractAddress, {
							from: account,
							gas: 3000000,
							gasPrice: '20000000000'});
						console.log('create success')
						document.querySelector('#newGameAddress').innerHTML = 
							"Share the contract address with your opponnent: <br><br>" + String(receipt.contractAddress) + "<br><br>";
						document.querySelector('#player').innerHTML ="Player1"
						player = 1;
					}
				})
			}, 300);
		})
	}
}

function joinGameHandler() {
	var contractAddress = document.getElementById('contract-ID-tojoin').value.trim();
	ConnectFour = new web3.eth.Contract(abi, contractAddress, {
		from: account,
		gas: 3000000,
		gasPrice: '20000000000'});

	ConnectFour.methods.joinGame().send({
		from: account,
	}).on('error', function(error, receipt) {console.log(error);}).then((result) => {console.log('join success');});

	document.querySelector('#player').innerHTML ="Player2";
	player = 2;
}

function clickHandler() {
	if (typeof ConnectFour != 'undefined') {
		if (gameOver || !isTurn) {
        			return;
		}

		var target = this.getAttribute('data-pos');
		target = parseInt(target%7);
                	ConnectFour.methods.makeMove(target).send({
			from: account,
		}).on('error', function(error, receipt) {console.log(error);}).then((result) => {
			//console.log(result);
			//this.removeEventListener('click', clickHandler);
			render();
	                });
	}
}


function render() {
	if (typeof ConnectFour != 'undefined') {
		if (!started) {
			ConnectFour.methods.getGameStatus().call({from: account}).then(function(res) {
				if (res != 0) {
					started = true;
				}
			});
			if (!started) {
				return;
			}
		}

		ConnectFour.methods.getBoard().call({from: account}).then(function(res) {
			console.log(res);
			for (var i = 0; i < 7; i++) {
				for (var j = 0; j < 6; j++) {
					var state = res[i][j];
		    			if (state > 0) {
						index = (5- j)* 7 + i;
                    					if (state == 1) {
                        						boxes[index].className = 'x';
                        						boxes[index].innerHTML = 'x';
                    					} else{
                        						boxes[index].className = 'o';
                        						boxes[index].innerHTML = 'o';
						}
					}
				}
			}
		});

		ConnectFour.methods.checkWinner().call({from: account}).then(function(res) {
			//console.log(res);
			if (res != 0) {
				gameOver = true;
				if (res == 3) {
					document.querySelector('#game-messages').innerHTML = "The game draws!"
				} else {
					document.querySelector('#game-messages').innerHTML = "Player " + res + " wins!"
				}
			} else {
				ConnectFour.methods.getTurnOwner().call({from: account}).then(function(res) {
					if (res.toLowerCase() == account.toLowerCase()) {
						isTurn = true;
						document.querySelector('#game-messages').innerHTML = "Your turn !";
					} else {
						isTurn = false;
						document.querySelector('#game-messages').innerHTML = "Opponent's turn !";
					}
				});
			}
		});
	}
}
