// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.7;

contract ConnectFour {
    address player1;
    address player2;
    enum SquareState {
        Empty,
        Red,
        Blue
    }
    uint currentTurn = 0;
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

    constructor(address _player2) {
        require(_player2 != msg.sender, "The two players cannot be the same!");
        player1 = msg.sender;
        player2 = _player2;
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
    function getTurnOwner() private view returns (address) {
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
    function checkRowWin(uint8 row) private view returns (uint8) {
        uint curBlue = 0;
        uint curRed = 0;
        for (uint i = 0; i < N; i++) {
            if (board[row][i] == SquareState.Blue) {
                curBlue += 1;
            } else if (board[row][i] == SquareState.Red) {
                curRed += 1;
            } else {
                curRed = 0;
                curBlue = 0;
            }
            if (curRed == 4) {
                return 1;
            }
            if (curBlue == 4) {
                return 2;
            }
        }
        return 0;
    }

    /**
     * Check whether the given col has four continuous positions filled with balls of the same color
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     */
    function checkColWin(uint8 col) private view returns (uint8) {
        uint curBlue = 0;
        uint curRed = 0;
        for (uint i = 0; i < M; i++) {
            if (board[i][col] == SquareState.Blue) {
                curBlue += 1;
            } else if (board[i][col] == SquareState.Red) {
                curRed += 1;
            } else {
                curRed = 0;
                curBlue = 0;
            }
            if (curRed == 4) {
                return 1;
            }
            if (curBlue == 4) {
                return 2;
            }
        }
        return 0;
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
    function checkForwardSlashWin(uint8 row) private view returns (uint8) {
        uint8 diffX = 1;
        uint8 diffY = 1;
        uint8 curBlue = 0;
        uint8 curRed = 0;
        uint8 x = row;
        uint8 y = 0;
        while (x < M && y < N) {
            if (board[x][y] == SquareState.Blue) {
                curBlue += 1;
            } else if (board[x][y] == SquareState.Red) {
                curRed += 1;
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
     * check whether there are four continuous positions filled with balls of the same color
     * in one backslash like the following:
     * R
     *   R
     *     R
     *       R
     * the row stands for the starting row
     * return 1 if player 1 wins(Red wins)
     * return 2 if player 2 wins(Blue wins)
     * return 0 if no one wins
     */
    function checkBackSlashWin(int8 row) private view returns (uint8) {
        int8 diffX = -1;
        uint8 diffY = 1;
        int8 x = row;
        uint8 y = 0;
        uint8 curBlue = 0;
        uint8 curRed = 0;
        while (x >= 0 && y < N) {
            if (board[uint8(x)][y] == SquareState.Blue) {
                curBlue += 1;
            } else if (board[uint8(x)][y] == SquareState.Red) {
                curRed += 1;
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
    function checkWinner() private view returns (uint8) {
        for (uint8 i = 0; i < M; i++) {
            uint8 res = checkRowWin(i);
            if (res != 0) {
                return res;
            }
            res = checkBackSlashWin(int8(i));
            if (res != 0) {
                return res;
            }
            res = checkForwardSlashWin(i);
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
        if (msg.sender != getTurnOwner()) {
            string
                memory errMsg = "Invalid Move: this turn dont belong to the makeMove msg sender!";
            return (false, errMsg);
        }
        if (colState[col] <= M - 1) {
            string memory errMsg = "Invalid Move: This column is full already";
            return (false, errMsg);
        }
        board[colState[col]][col] = getPlayerMove(msg.sender);
        colState[col] += 1;
        uint8 winner = checkWinner();
        string memory winnerMsg = "Draw";
        if (winner == getPlayerNumber(msg.sender)) {
            winnerMsg = "You Win!";
        } else if (winner == 3) {
            winnerMsg = "The board is full!";
        }
        currentTurn += 1;
        return (true, winnerMsg);
    }
}
