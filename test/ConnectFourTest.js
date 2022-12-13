const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')
const NO_WINNER_MSG = 'No winner yet'
const WINNER_MSG = 'You Win'
const Draw_MSG = 'Draw'
const JOIN_GAME_MSG = 'Joined Game'


describe('ConnectFourTest', function () {
  async function deployFixture () {
    const addressZero = ethers.constants.AddressZero
    const [owner, player2] = await ethers.getSigners()
    const ConnectFour = await ethers.getContractFactory('ConnectFour')
    const connectFour = await ConnectFour.deploy()
    return { connectFour, owner, player2 }
  }

  describe('Basic', function () {
    it('Valid player addresses created', async function () {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
      expect(await connectFour.getGameStatus()).to.equal(0)
      await connectFour.joinGame(player2.address)
      expect(await connectFour.getGameStatus()).to.equal(1)
      const [acc0, acc1, acc2, acc3] = await ethers.getSigners()
      expect(await connectFour.getPlayerNumber(owner.address)).to.equal(1)
      expect(await connectFour.getPlayerNumber(player2.address)).to.equal(2)
      expect(await connectFour.getPlayerNumber(acc3.address)).to.equal(0)
      expect(await connectFour.getPlayerTotal()).to.equal(2)
      await connectFour.joinGame(acc2.address)
      expect(await connectFour.getPlayerNumber(acc2.address)).to.equal(0)
      expect(await connectFour.getPlayerTotal()).to.equal(2)
      expect(await connectFour.getGameStatus()).to.equal(1)
    })
    it('Valid column positions filled', async function () {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
      connectFour.joinGame(player2.address)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(0)
      expect(await connectFour.getColState(0)).to.equal(1)
      expect(await connectFour.getColState(1)).to.equal(1)
      await connectFour.connect(owner).makeMove(1)
      expect(await connectFour.getColState(1)).to.equal(2)
    })
    it('Generate right winner in column', async function () {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      connectFour.joinGame(player2.address)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      expect(await connectFour.checkWinner()).to.equal(1)
      expect(await connectFour.checkColWin(1)).to.equal(1)
      expect(await connectFour.checkColWin(0)).to.equal(0)
      expect(await connectFour.checkWinner()).to.equal(1)
    })
    it('Generate right winner in row', async function () {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      connectFour.joinGame(player2.address)
      await connectFour.connect(owner).makeMove(0)
      await connectFour.connect(player2).makeMove(1)
      await connectFour.connect(owner).makeMove(2)
      await connectFour.connect(player2).makeMove(3)
      await connectFour.connect(owner).makeMove(0)
      await connectFour.connect(player2).makeMove(0)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(1)
      await connectFour.connect(owner).makeMove(2)
      await connectFour.connect(player2).makeMove(2)
      await connectFour.connect(owner).makeMove(3)
      await connectFour.connect(player2).makeMove(3)
      await connectFour.connect(owner).makeMove(4)
      await connectFour.connect(player2).makeMove(3)
      expect(await connectFour.checkRowWin(1)).to.equal(1)
      expect(await connectFour.checkRowWin(0)).to.equal(0)
      expect(await connectFour.getColState(0)).to.equal(3)
      expect(await connectFour.getColState(3)).to.equal(2)
    })
    it('Generate right winner in forwardslash', async function () {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
    //   await connectFour.connect(player2).makeMove(0)
    //   await connectFour.connect(owner).makeMove(1)
      connectFour.joinGame(player2.address)
      await connectFour.connect(owner).makeMove(1)
      await connectFour.connect(player2).makeMove(2)
      await connectFour.connect(owner).makeMove(3)
      await connectFour.connect(player2).makeMove(3)
      await connectFour.connect(owner).makeMove(2)
      await connectFour.connect(player2).makeMove(6)
      await connectFour.connect(owner).makeMove(4)
      await connectFour.connect(player2).makeMove(4)
      await connectFour.connect(owner).makeMove(4)
      await connectFour.connect(player2).makeMove(5)
      await connectFour.connect(owner).makeMove(5)
      await connectFour.connect(player2).makeMove(6)
      await connectFour.connect(owner).makeMove(4)
      await connectFour.connect(player2).makeMove(6)
      await connectFour.connect(owner).makeMove(6)
      await connectFour.connect(player2).makeMove(5)
      await connectFour.connect(owner).makeMove(4)
      await connectFour.connect(player2).makeMove(5)
      await connectFour.connect(owner).makeMove(6)
      await connectFour.connect(player2).makeMove(6)
      await connectFour.connect(owner).makeMove(3)

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
    console.log(await connectFour.getBoard())
      for(i=0; i<7; i++) {
        console.log(await connectFour.checkColWin(i));
      }
      expect(await connectFour.getColState(4)).to.equal(5)
      expect(await connectFour.getColState(6)).to.equal(6)
      expect(await connectFour.checkWinner()).to.equal(1)
      expect(await connectFour.checkForwardSlashRightWin(5)).to.equal(1)

    })
  })

  describe('Edge Case', function () {
    it('One column is full, then should forbid adding more balls.', async function () {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
      connectFour.joinGame(player2.address)
      for (i = 0; i < 10; i++) {
        if (i % 2 == 0) {
          await connectFour.connect(owner).makeMove(1)
        } else {
          await connectFour.connect(player2).makeMove(1)
        }
      }
      expect(await connectFour.getColState(1)).to.equal(6)
      // As invalid moves are discarded, the owner of current turn should be player1
      expect(await connectFour.getTurnOwner()).to.equal(owner.address)
    })
    it("Refuse invalid column move", async function() {
      const { connectFour, owner, player2 } = await loadFixture(deployFixture)
      connectFour.joinGame(player2.address)
      connectFour.connect(owner).makeMove(-1)
      for(i = 0; i<7; i++) {
        expect(await connectFour.getColState(i)).to.equal(0)
      }
      connectFour.connect(owner).makeMove(10)
      for(i = 0; i<7; i++) {
        expect(await connectFour.getColState(i)).to.equal(0)
      }
    })
  })
})
