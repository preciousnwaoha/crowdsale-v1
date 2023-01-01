async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const PinCoin = await ethers.getContractFactory("PinCoin");
  const pinCoin = await PinCoin.deploy();
  await pinCoin.deployed();

  const Crowdsale = await ethers.getContractFactory("Crowdsale");
  const crowdSale = await Crowdsale.deploy(2, owner.address, pinCoin.address);

  await crowdSale.deployed();

  console.log(`Hello`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
