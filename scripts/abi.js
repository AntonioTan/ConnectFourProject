const abi = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "turnOwner",
				"type": "address"
			}
		],
		"name": "TurnChanged",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "int8",
				"name": "row",
				"type": "int8"
			}
		],
		"name": "checkBackSlashLeftWin",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int8",
				"name": "row",
				"type": "int8"
			}
		],
		"name": "checkBackSlashRightWin",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "col",
				"type": "uint8"
			}
		],
		"name": "checkColWin",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "row",
				"type": "uint8"
			}
		],
		"name": "checkForwardSlashLeftWin",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "row",
				"type": "uint8"
			}
		],
		"name": "checkForwardSlashRightWin",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "row",
				"type": "uint8"
			}
		],
		"name": "checkRowWin",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "checkWinner",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBoard",
		"outputs": [
			{
				"internalType": "enum ConnectFour.SquareState[6][7]",
				"name": "",
				"type": "uint8[6][7]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "col",
				"type": "uint8"
			}
		],
		"name": "getColState",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGameStatus",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "status",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getPlayerNumber",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTurnOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "joinGame",
		"outputs": [
			{
				"internalType": "bool",
				"name": "res",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "col",
				"type": "uint256"
			}
		],
		"name": "makeMove",
		"outputs": [
			{
				"internalType": "bool",
				"name": "succ",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sendToAll",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sendToWinner",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]