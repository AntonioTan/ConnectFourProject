// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.7;

contract ConnectFour {
    enum SquareState {
        Empty,
        Red,
        Blue
    }
    uint8 constant M = 6;
    uint8 constant N = 7;
    // the row at bottom has the index 0
    // the row at roof has the index M-1
    // 5
    // 4
    // 3
    // 2
    // 1
    // 0
    //   0 1 2 3 4 5 6
    SquareState[M][N] board;
    // used to check the next position to fill in each column
    uint8[N] colState;
    uint currentTurn = 0;
    address player1;
    address player2;
    // number of players in current game
    uint8 nPlayers = 0;
    uint8 gameStatus = 0;

    /*event GameCreated(
        address addr
    );
    event PlayerJoined(address player2);
    event GameOver(address winner, string res);
    event TurnChanged(address turnOwner);*/

    constructor() {
        player1 = msg.sender;
        nPlayers += 1;
        gameStatus = 0;
        //emit GameCreated(address(this));
    }

    /**
     * Get the player number
     */
    function getPlayerTotal() public view returns (uint num) {
        return nPlayers;
    }

    /**
     * Get the game status
     */
    function getGameStatus() public view returns (uint status) {
        return gameStatus;
    }

    /**
     * Player2 joins the game via this function
     * emit PlayerJoined event when joined successfully
     */
    function joinGame() public returns (bool res, string memory reason) {
        if (gameStatus != 0) {
            if (gameStatus == 1) {
                return (false, "The game already started");
            } else {
                return (false, "The game is over");
            }
        } else if (msg.sender == player1) {
            return (false, "The two players cannot be the same");
        } else if (nPlayers == 2) {
            return (false, "There are already two players in the game");
        } else {
            player2 = msg.sender;
            nPlayers += 1;
            gameStatus = 1;
            //emit PlayerJoined(player2);
            return (true, "Joined game");
        }
    }


    function getBoard() public view returns (SquareState[6][7] memory) {
        return board;
    }
    /**
     * Does the game board has empty fields?
     * bool returns true if yes and false if the board is full
     */
    function hasEmptyFields() private view returns (bool) {
        for (uint i = 0; i < N; i++) {
            if (colState[i] != M) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the next position to be filled given the column number
     */
    function getColState(uint8 col) public view returns (uint8) {
        return colState[col];
    }

    /**
     * Get the number of player by player address
     * Valid player number is 1 or 2
     * If provided with an invalid address, return 0
     */
    function getPlayerNumber(address player) public view returns (uint8) {
        if (player == player1) {
            return 1;
        }
        if (player == player2) {
            return 2;
        }
        return 0;
    }

    /**
     * Get the move state of player by player address
     * Valid player number is Blue or Red
     * If provided with an invalid address, return Empty
     */
    function getPlayerMove(address player) private view returns (SquareState) {
        if (player == player1) {
            return SquareState.Red;
        }
        if (player == player2) {
            return SquareState.Blue;
        }
        return SquareState.Empty;
    }

    /**
     * Get the address of the current turn owner
     */
    function getTurnOwner() public view returns (address) {
        if (currentTurn % 2 == 0) {
            return player1;
        } else {
            return player2;
        }
    }

    /**
     * Check whether the given row has four continuous positions filled with balls of the same color
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     */
    function checkRowWin(uint8 row) public view returns (uint8) {
        int8 x = int8(row);
        int8 y = 0;
        int8 diffX = 0;
        int8 diffY = 1;
        return checkContinuousWin(x, y, diffX, diffY);
    }

    /**
     * Check whether the given col has four continuous positions filled with balls of the same color
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     */
    function checkColWin(uint8 col) public view returns (uint8) {
        int8 x = 0;
        int8 y = int8(col);
        int8 diffX = 1;
        int8 diffY = 0;
        return checkContinuousWin(x, y, diffX, diffY);
    }

    /**
     * Check whether there are four continuous positions filled with balls of the same color
     * in one forward slash like the following
     *       R
     *     R
     *   R
     * R
     * the row stands for the starting row
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     */
    function checkForwardSlashLeftWin(uint8 row) public view returns (uint8) {
        int8 diffX = 1;
        int8 diffY = 1;
        int8 x = int8(row);
        int8 y = 0;
        return checkContinuousWin(x, y, diffX, diffY);
    }
    
    /**
     * Like checkForwardSlashLeftWin but start from the rightmost column and move from right-top to left-bot
     */
    function checkForwardSlashRightWin(uint8 row) public view returns (uint8) {
        int8 diffX = -1;
        int8 diffY = -1;
        int8 x = int8(row);
        int8 y = int8(N-1);
        return checkContinuousWin(x, y, diffX, diffY);
    }

    /**
     * check whether there are four continuous positions filled with balls of the same color
     * in one backslash like the following:
     * R
     *   R
     *     R
     *       R
     * the row stands for the starting row
     * starting from right-top to left-bottom
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     */
    function checkBackSlashLeftWin(int8 row) public view returns (uint8) {
        int8 diffX = -1;
        int8 diffY = 1;
        int8 x = int8(row);
        int8 y = 0;
        return checkContinuousWin(x, y, diffX, diffY);
    }

    /**
     * Like checkBackSlashLeftWin but start from rightMost column and check from right-bottom to left-top
     */
    function checkBackSlashRightWin(int8 row) public view returns (uint8) {
        int8 diffX = 1;
        int8 diffY = -1;
        int8 x = int8(row);
        int8 y = int8(N-1);
        return checkContinuousWin(x, y, diffX, diffY);        
    }

    /**
     * helper function to check whether there are four continous balls of the same color in one straight line
     * set by diffX and diffY
     */
    function checkContinuousWin(int8 x, int8 y, int8 diffX, int8 diffY) private view returns (uint8 res) {
        uint8 curBlue = 0;
        uint8 curRed = 0;
        while (x < int8(M) && x>=0 && y>=0 && y < int8(N)) {
            if (board[uint8(y)][uint8(x)] == SquareState.Blue) {
                curBlue += 1;
                curRed = 0;
            } else if (board[uint8(y)][uint8(x)] == SquareState.Red) {
                curRed += 1;
                curBlue = 0;
            } else {
                curBlue = 0;
                curRed = 0;
            }
            if (curRed == 4) {
                return 1;
            }
            if (curBlue == 4) {
                return 2;
            }
            x += diffX;
            y += diffY;
        }
        return 0;
    }

    /**
     * check the current winner by checking the row, column, backslash and forwardslash state respectively
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     * return 3 if board is full
     */
    function checkWinner() public view returns (uint8) {
        for (uint8 i = 0; i < M; i++) {
            uint8 res = checkRowWin(i);
            if (res != 0) {
                return res;
            }
            res = checkBackSlashLeftWin(int8(i));
            if (res != 0) {
                return res;
            }
            res = checkBackSlashRightWin(int8(i));
            if (res != 0) {
                return res;
            }
            res = checkForwardSlashLeftWin(i);
            if (res != 0) {
                return res;
            }
            res = checkForwardSlashRightWin(i);
            if (res != 0) {
                return res;
            }
        }
        for (uint8 i = 0; i < N; i++) {
            uint8 res = checkColWin(i);
            if (res != 0) {
                return res;
            }
        }
        if (!hasEmptyFields()) {
            return 3;
        }
        return 0;
    }

    function makeMove(
        uint col
    ) public returns (bool succ, string memory reason) {
        if (gameStatus != 1) {
            string memory errMsg = "Game is in join phase";
            if (gameStatus == 2) {
                errMsg = "Game is over";
            }
            return (false, errMsg);
        }
        if (col >= N) {
            string memory errMsg = "Invalid column index";
            return (false, errMsg);
        }
        if (msg.sender != getTurnOwner()) {
            string
                memory errMsg = "Invalid Move: this turn dont belong to the makeMove msg sender!";
            return (false, errMsg);
        }
        if (colState[col] > M - 1) {
            string memory errMsg = "Invalid Move: This column is full already";
            return (false, errMsg);
        }
        board[col][colState[col]] = getPlayerMove(msg.sender);
        colState[col] += 1;
        uint8 winner = checkWinner();
        string memory winnerMsg = "No winner yet";
        if (winner == getPlayerNumber(msg.sender)) {
            winnerMsg = "You Win";
            gameStatus += 1;
        } else if (winner == 3) {
            winnerMsg = "Draw";
            gameStatus += 1;
        }
        currentTurn += 1;
        //address turnOwner = getTurnOwner();
        //emit TurnChanged(turnOwner);
        return (true, winnerMsg);
    }
}
