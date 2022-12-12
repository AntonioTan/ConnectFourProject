const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("ConnectFourTest", function() {
    async function deployFixture() {
        const addressZero = ethers.constants.AddressZero;
        const [owner, player2] = await ethers.getSigners();
        const ConnectFour = await ethers.getContractFactory("ConnectFour");
        const connectFour = await ConnectFour.deploy(player2.address)
        return {connectFour, owner, player2}
    }

    describe("Basic", function() {
        it("Valid player addresses created", async function() {
            const {connectFour, owner, player2} = await loadFixture(deployFixture);
            expect(await connectFour.getPlayerNumber(owner.address)).to.equal(1);
            expect(await connectFour.getPlayerNumber(player2.address)).to.equal(2);
        })
    });
    
})