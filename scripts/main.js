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
		//renderInterval = setInterval(render, 1000);
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
						console.log('success')
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
	console.log(contractAddress);

	ConnectFour.methods.joinGame().send({
		from: account,
	}).on('error', function(error, receipt) {console.log(error);}).then((result) => {console.log(result);});

	document.querySelector('#player').innerHTML ="Player2";
	player = 2;
}

function clickHandler() {
	/*if (typeof ConnectFour != 'undefined') {
		ConnectFour.checkWinner().then(function(res) {
			console.log(res);
			if (res) {
				gameOver = true;
			}
		});
		if (gameOver) {
        			return;
		}
	}*/

	var target = this.getAttribute('data-pos');
                ConnectFour.methods.makeMove(parseInt(target/7)).send({
		from: account,
	}).on('error', function(error, receipt) {console.log(error);}).then((result) => {
		console.log(result);
		//this.removeEventListener('click', clickHandler);
		render();
                });
	ConnectFour.methods.getGameStatus().call({
		from: account,
	}).then((result) => {console.log(result);});
}

function render() {
    if (typeof ConnectFour != 'undefined'){
        ConnectFour.methods.getBoard().then(function(res){
            for (var i = 0; i < 42; i++){
                var state = res[0][i].words[0];
                if (state>0){
                    if (state==1){
                        boxes[i].className = 'x';
                        boxes[i].innerHTML = 'x';
                    } else{
                        boxes[i].className = 'o';
                        boxes[i].innerHTML = 'o';
                    }
                }
            }
        });
        if (!gameOver){
            ConnectFour.getTurnOwner().then(function(res){
	console.log(res);
                /*if (res == ){
                    document.querySelector('#game-messages').innerHTML = "Your turn !";
                } else {
                    document.querySelector('#game-messages').innerHTML = "Not your turn !";
                }*/
            });
        }   
    }
}
