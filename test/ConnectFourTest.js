const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')

const NO_WINNER_MSG = 'No winner yet'
const WINNER_MSG = 'You Win'
const Draw_MSG = 'Draw'
const JOIN_GAME_MSG = 'Joined Game'
const GAME_NOT_OVER_MSG = "Game is not over yet"

describe('ConnectFourTest', function () {
  async function deployFixture () {
    const addressZero = ethers.constants.AddressZero
    const [player1, player2] = await ethers.getSigners()
    const ConnectFour = await ethers.getContractFactory('ConnectFour')
    const connectFour = await ConnectFour.deploy({ value: ethers.utils.parseEther("100") })
    return { connectFour, player1, player2 }
  }

  async function getCurrentPlayer(connectFour, player1, player2) {
      return await connectFour.getTurnOwner() == player1.address ? player1 : player2
  }

  async function playerNext(connectFour, col) {
    return await connectFour.connect(getCurrentPlayer(connect, player1, player2)).makeMove(col)
  }

  describe('Basic', function () {
    it('Check player money sent to winner correctly', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      player1_balance = ethers.provider.getBalance(player1.address)
      expect(await connectFour.getGameStatus()).to.equal(0)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("50") })
      expect(await connectFour.getGameStatus()).to.equal(0)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("200") })
      expect(await connectFour.getGameStatus()).to.equal(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      //await expect(connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).sendToWinner()).to.be.revertedWith(GAME_NOT_OVER_MSG)
      expect( await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)).to.changeEtherBalances(
        [player1, player2],
        [0, 0]
      )
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
       expect(await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)).to.emit(connectFour, "GameOver").withArgs(player1.address, "Win")
      // expect(connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)).to.changeEtherBalances(
      //   [player1, player2],
      //   [200, -200]
      // )
      // expect(await ethers.provider.getBalance(player1.address)).to.equal(ethers.utils.parseEther("200"))
    })
    it("Generate draw result", async function() {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })

      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)

      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)

      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)


      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)

      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)

      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)

        console.log(await connectFour.getBoard())
       expect(await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)).to.emit(connectFour, "GameOver").withArgs(ethers.constants.AddressZero, "Draw")
      // expect().to.changeEtherBalances(
      //   [player1, player2],
      //   [100, 100]
      // )
      for(i=0; i<7; i++) {
        expect(await connectFour.getColState(i)).to.equal(6)
      }
    })
    it('Valid player addresses created', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      expect(await connectFour.getGameStatus()).to.equal(0)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      expect(await connectFour.getGameStatus()).to.equal(1)
      const [acc0, acc1, acc2, acc3] = await ethers.getSigners()
      expect(await connectFour.getPlayerNumber(player1.address)).to.equal(1)
      expect(await connectFour.getPlayerNumber(player2.address)).to.equal(2)
      expect(await connectFour.getPlayerNumber(acc3.address)).to.equal(0)
      //expect(await connectFour.getPlayerTotal()).to.equal(2)
      await connectFour.connect(acc2).joinGame()
      expect(await connectFour.getPlayerNumber(acc2.address)).to.equal(0)
      //expect(await connectFour.getPlayerTotal()).to.equal(2)
      expect(await connectFour.getGameStatus()).to.equal(1)
    })
    it('Valid column positions filled', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      expect(await connectFour.getColState(0)).to.equal(1)
      expect(await connectFour.getColState(1)).to.equal(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      expect(await connectFour.getColState(1)).to.equal(2)
    })
    it('Generate right winner in column', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      //await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      //await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayerNum = await connectFour.getTurnOwner() == player1.address ? 1: 2 
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player2 : player1 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      console.log(await connectFour.getBoard())
      expect(await connectFour.checkWinner()).to.equal(startPlayerNum)
      expect(await connectFour.checkColWin(1)).to.equal(startPlayerNum)
      expect(await connectFour.checkColWin(0)).to.equal(0)
      expect(await connectFour.checkWinner()).to.equal(startPlayerNum)
    })
    it('Generate right winner in row', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      //await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      //await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayerNum = await connectFour.getTurnOwner() == player1.address ? 1: 2 
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      expect(await connectFour.checkRowWin(1)).to.equal(startPlayerNum)
      expect(await connectFour.checkRowWin(0)).to.equal(0)
      expect(await connectFour.getColState(0)).to.equal(3)
      expect(await connectFour.getColState(3)).to.equal(2)
    })
    it('Generate right winner in forwardslashright', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      //await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      //await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayerNum = await connectFour.getTurnOwner() == player1.address ? 1: 2 
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)

      //   for(i=0; i<6; i++) {
      //     console.log(await connectFour.checkRowWin(i));
      //     console.log(await connectFour.checkForwardSlashRightWin(i));
      //     console.log(await connectFour.checkForwardSlashLeftWin(i));
      //   }
      //   for(i=0; i<6; i++) {
      //     for(j=0; j<7; j++) {
      //         state = await connectFour.getBoardState(i, j)
      //         console.log(state)
      //     }
      //   }
      //   for(i=0; i<7; i++) {
      //     console.log(await connectFour.checkColWin(i));
      //   }
      expect(await connectFour.getColState(4)).to.equal(5)
      expect(await connectFour.getColState(6)).to.equal(6)
      expect(await connectFour.checkWinner()).to.equal(startPlayerNum)
      expect(await connectFour.checkForwardSlashRightWin(5)).to.equal(startPlayerNum)
    })
    it('Generate right winner in backslashleft', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayer = await connectFour.getTurnOwner() == player1.address ? player1 : player2
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2).makeMove(3)
      console.log(await connectFour.getBoard())
      console.log(startPlayer == player1 ? 1 : 2)
      expect(await connectFour.checkWinner()).to.equal(startPlayer == player1 ? 1 : 2)
      expect(await connectFour.checkBackSlashLeftWin(5)).to.equal(startPlayer == player1 ? 1 : 2)
    })
    it('Generate right winner in forwardslashleft', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayerNum = await connectFour.getTurnOwner() == player1.address ? 1 : 2
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(6)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      //   console.log(await connectFour.getBoard())
      expect(await connectFour.checkWinner()).to.equal(startPlayerNum)
      expect(await connectFour.checkForwardSlashLeftWin(0)).to.equal(startPlayerNum)
    })
    it('Generate right winner in backslashright', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayerNum = await connectFour.getTurnOwner() == player1.address ? 1 : 2
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(5)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(4)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(0)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(2)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
      await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(3)
      console.log(await connectFour.getBoard())
      expect(await connectFour.checkWinner()).to.equal(startPlayerNum)
      expect(await connectFour.checkBackSlashRightWin(0)).to.equal(startPlayerNum)
    })
  })

  describe('Edge Case', function () {
    it('One column is full, then should forbid adding more balls.', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      const startPlayerAddr = await connectFour.getTurnOwner()
      for (i = 0; i < 10; i++) {
        if (i % 2 == 0) {
          await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
        } else {
          await connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(1)
        }
      }
      expect(await connectFour.getColState(1)).to.equal(6)
      // As invalid moves are discarded, the player1 of current turn should be player1
      expect(await connectFour.getTurnOwner()).to.equal(startPlayerAddr)
    })
    it('Refuse invalid column move', async function () {
      const { connectFour, player1, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).joinGame({ value: ethers.utils.parseEther("100") })
      connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(-1)
      for (i = 0; i < 7; i++) {
        expect(await connectFour.getColState(i)).to.equal(0)
      }
      connectFour.connect(await connectFour.getTurnOwner() == player1.address ? player1 : player2 ).makeMove(10)
      for (i = 0; i < 7; i++) {
        expect(await connectFour.getColState(i)).to.equal(0)
      }
    })
  })
})
